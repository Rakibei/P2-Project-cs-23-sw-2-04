import moment from "moment/moment.js";
import { GetTaskWithID, GetProjectNameWithTaskID } from "./databaseProject.js";

export async function CreateTasks(pool, projectId, name, description) {
  try {
    // Create the task
    const [result] = await pool.query(
      `INSERT INTO tasks (projectId, name, description) VALUES (?, ?, ?)`,
      [projectId, name, description]
    );
    const taskId = result.insertId;
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}

export async function CreateStaticTaskEntry(
  pool,
  staticTaskType,
  timeSheetId,
  mondayHours,
  tuesdayHours,
  wednesdayHours,
  thursdayHours,
  fridayHours,
  saturdayHours,
  sundayHours
) {
  console.log(
    "Values " + pool,
    staticTaskType,
    timeSheetId,
    mondayHours,
    tuesdayHours,
    wednesdayHours,
    thursdayHours,
    fridayHours,
    saturdayHours,
    sundayHours
  );
  try {
    const values = [
      staticTaskType,
      timeSheetId,
      mondayHours,
      tuesdayHours,
      wednesdayHours,
      thursdayHours,
      fridayHours,
      saturdayHours,
      sundayHours,
    ];
    await pool.query(
      "INSERT INTO staticTaskEntry (staticTaskType, timeSheetId, mondayHours, tuesdayHours, wednesdayHours, thursdayHours, fridayHours, saturdayHours, sundayHours) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      values
    );
    return true;
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}

export async function CreateTaskEntry(
  pool,
  taskId,
  timeSheetId,
  mondayHours,
  tuesdayHours,
  wednesdayHours,
  thursdayHours,
  fridayHours,
  saturdayHours,
  sundayHours
) {
  try {
    const values = [
      taskId,
      timeSheetId,
      mondayHours,
      tuesdayHours,
      wednesdayHours,
      thursdayHours,
      fridayHours,
      saturdayHours,
      sundayHours,
    ];
    await pool.query(
      "INSERT INTO taskEntry (taskId, timeSheetId, mondayHours, tuesdayHours, wednesdayHours, thursdayHours, fridayHours, saturdayHours, sundayHours) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      values
    );
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}
export async function DeleteAllTaskEntryForATimeSheet(pool, timeSheetId) {
try {
  await pool.query(
    'DELETE FROM taskEntry WHERE timeSheetId = ?', timeSheetId
  )
  await pool.query(
    'DELETE FROM staticTaskEntry WHERE timeSheetId = ?', timeSheetId
  )
  await pool.query(
    'UPDATE timesheet SET submitstatus = 0 WHERE id = ?' , timeSheetId
  )
  return true;
} catch (error) {
  console.log(error);
  return false; // error occurred
}
}

export async function CreateTimeSheet(pool, userID, week, year) {
  try {
    // Create a new timesheet entry and retrieve its auto-generated id
    console.log(week);
    const [insertResult] = await pool.query(
      "INSERT INTO timesheet (userId, week, year) VALUES (?, ?, ?)",
      [userID, week, year]
    );
    const timesheetId = insertResult.insertId;
    return timesheetId;
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}
export async function GetTimeSheetId(pool, userID, week, year) {
  try {
    const [result] = await pool.query(
      `SELECT id FROM timeSheet
    WHERE userId = ? AND week = ? AND year = ?`,
      [userID, week, year]
    );
    return result[0].id;
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}

export async function IsTimeSheetFound(pool, userID, week, year) {
  try {
    // Check if a timesheet with the given userID, week, and year already exists
    const [queryResult] = await pool.query(
      "SELECT * FROM timesheet WHERE userId = ? AND week = ? AND year = ?",
      [userID, week, year]
    );
    if (queryResult.length > 0) {
      // An entry already exists, so return true
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}

export async function GetFilledOutTimeSheetsForUser(pool, userID) {
  try {
    let timeSheets = [];
    const [timeSheetReferences] = await pool.query(
      "SELECT * FROM timesheet WHERE userId = ?",
      [userID]
    );
    for (let i = 0; i < timeSheetReferences.length; i++) {
      const [taskEntry] = await pool.query(
        "SELECT * FROM taskentry WHERE timeSheetId = ?",
        [timeSheetReferences[i].id]
      );
      const [staticTaskEntry] = await pool.query(
        "SELECT * FROM statictaskentry WHERE timeSheetId = ?",
        [timeSheetReferences[i].id]
      );
      const tasks = taskEntry.concat(staticTaskEntry);

      const sortedTasks = await sortTaskRows(pool, tasks);
      timeSheets.push({
        timeSheetId: timeSheetReferences[i].id,
        timeSheetWeek: timeSheetReferences[i].week,
        timeSheetYear: timeSheetReferences[i].year,
        timeSheetStatus: timeSheetReferences[i].submitstatus,
        tasks: sortedTasks,
      });
    }
    return timeSheets;
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}

export async function GetFilledOutTimeSheetForUser(pool, userID, week, year) {
  try {
    const [timeSheetReference] = await pool.query(
      "SELECT * FROM timesheet WHERE userId = ? AND week = ? AND year = ?",
      [userID, week, year]
    );
    const [taskEntry] = await pool.query(
      "SELECT * FROM taskentry WHERE timeSheetId = ?",
      [timeSheetReference[0].id]
    );
    const [staticTaskEntry] = await pool.query(
      "SELECT * FROM statictaskentry WHERE timeSheetId = ?",
      [timeSheetReference[0].id]
    );
    const tasks = taskEntry.concat(staticTaskEntry);

    const sortedTasks = await sortTaskRows(pool, tasks);
    const timeSheet = {
      timeSheetId: timeSheetReference[0].id,
      tasks: sortedTasks,
    };
    return timeSheet;
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}
//make sure tasks are in a usable and expedited formart
async function sortTaskRows(pool, tasks) {
  const sortedTasks = {
    projects: [],
    meeting: {},
    absence: {},
    vacation: {},
  };

  for (const task of tasks) {
    if (Object.hasOwn(task, "staticTaskType")) {
      const structuredTask = {
        id: task.id,
        staticTaskType: task.staticTaskType,
        timeSheetId: task.timeSheetId,
        hours: {
          monday: task.mondayHours,
          tuesday: task.tuesdayHours,
          wednesday: task.wednesdayHours,
          thursday: task.thursdayHours,
          friday: task.fridayHours,
          saturday: task.saturdayHours,
          sunday: task.sundayHours,
        },
      };
      switch (task.staticTaskType) {
        case 1:
          sortedTasks.meeting = structuredTask;
          break;
        case 2:
          sortedTasks.absence = structuredTask;
          break;
        case 3:
          sortedTasks.vacation = structuredTask;
          break;
        default:
          break;
      }
    }
    if (Object.hasOwn(task, "taskId")) {
      let project = await GetProjectNameWithTaskID(pool, task.taskId);

      const taskForEntry = await GetTaskWithID(pool, task.taskId);

      const structuredTask = {
        id: task.id,
        taskId: task.taskId,
        timeSheetId: task.timeSheetId,
        taskName: taskForEntry.name,
        projectName: project,
        hours: {
          monday: task.mondayHours,
          tuesday: task.tuesdayHours,
          wednesday: task.wednesdayHours,
          thursday: task.thursdayHours,
          friday: task.fridayHours,
          saturday: task.saturdayHours,
          sunday: task.sundayHours,
        },
      };
      sortedTasks.projects.unshift(structuredTask);
    }
  }

  return sortedTasks;
}

export async function ApproveTimeSheet(pool, TimeSheetId) {
  try {
    const [insertResult] = await pool.query(
      "UPDATE timesheet SET submitstatus = 1 WHERE id = ?",
      [TimeSheetId]
    );
    return insertResult;
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}
export async function GetTimeSheetSubmit(pool, TimeSheetID) {
  try {
    const [SubmitStatus] = await pool.query(
      "SELECT submitstatus FROM timesheet WHERE id = ?",
      [TimeSheetID]
    );

    return SubmitStatus[0];
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}

export async function GetAllSubmitStatus(pool,CurrentWeek,CurrentYear) {
  try {


    console.log(CurrentWeek);
    console.log(CurrentYear);
    


    // get list of users
    // Get list of timesheets for current week
    // if user has a time sheet then remove them
    const [Users] = await pool.query(
      'SELECT * FROM users'
    )
    let UserIDs = []
    console.log(Users);
    UserIDs = Users.map((user) => user.id);

    const [SubmitedTimeSheets] = await pool.query(
      `SELECT * FROM timeSheet WHERE week = ? AND year = ?`
      , [CurrentWeek,CurrentYear]
      )

    let FilteredUsers = [];

    for (let i = 0; i < UserIDs.length; i++) {
      for (let j = 0; j < SubmitedTimeSheets.length; j++) {
        if (UserIDs[i] === SubmitedTimeSheets[j].userId) {
          console.log(UserIDs[i]);
          FilteredUsers.push(UserIDs[i]);
          break
        }
      }
    }

    for (let m = 0; m < Users.length; m++) {

      let SelectedUser = FilteredUsers[m];

      let UserIndex = UserIDs.indexOf(SelectedUser);

      // -1 means here that the user was not found
      // so if its greater there was a user
      if (UserIndex > -1) {
        UserIDs.splice(UserIndex, 1); // 2nd parameter means remove one item only
      }
    }

    console.log(UserIDs);

    return UserIDs;

  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}

export async function GetEmailfromSubmitstaus(pool, userIds) {
  try {
    const [users] = await pool.query(`SELECT * FROM users WHERE id IN (?)`, [
      userIds,
    ]);
    const emails = users.map((user) => user.email);
    return emails;
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}

export async function GetTotalTimeForTask(pool, task) {
  try {
    const [taskEntrys] = await pool.query(`SELECT * FROM taskentry WHERE taskId = ?`, [
      task,
    ]);
    let totalHours = 0;
    for (let i = 0; i < taskEntrys.length; i++) {
      console.log(taskEntrys[i]);
      totalHours += taskEntrys[i].mondayHours 
      totalHours += taskEntrys[i].tuesdayHours 
      totalHours += taskEntrys[i].wednesdayHours
      totalHours += taskEntrys[i].thursdayHours 
      totalHours += taskEntrys[i].fridayHours 
      totalHours += taskEntrys[i].saturdayHours 
      totalHours += taskEntrys[i].sundayHours
    }
    return totalHours;
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}


