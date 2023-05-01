export async function CreateTasks(
  pool,
  projectId,
  name,
  description,
  estimate
) {
  try {
    // Create the task
    const [result] = await pool.query(
      `
            INSERT INTO tasks (projectId, name, description, estimate) VALUES (?, ?, ?, ?)`,
      [projectId, name, description, estimate]
    );
    const taskId = result.insertId;
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}

export async function CreateStaticTaskEntry(pool, staticTaskType, timeSheetId, mondayHours, tuesdayHours, wednesdayHours, thursdayHours, fridayHours, saturdayHours, sundayHours) {
  console.log("Values "+pool, staticTaskType, timeSheetId, mondayHours, tuesdayHours, wednesdayHours, thursdayHours, fridayHours, saturdayHours, sundayHours);
  try {
    const values = [staticTaskType, timeSheetId, mondayHours, tuesdayHours, wednesdayHours, thursdayHours, fridayHours, saturdayHours, sundayHours];
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

export async function CreateTaskEntry(pool, taskId, timeSheetId, mondayHours, tuesdayHours, wednesdayHours, thursdayHours, fridayHours, saturdayHours, sundayHours) {
try {
    const values = [taskId, timeSheetId, mondayHours, tuesdayHours, wednesdayHours, thursdayHours, fridayHours, saturdayHours, sundayHours];
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
  return true;
} catch (error) {
  console.log(error);
  return false; // error occurred
}
}

export async function CreateTimeSheet(pool, userId, week, year) {
try {
    // Create a new timesheet entry and retrieve its auto-generated id
    console.log(week);
    const [insertResult] = await pool.query(
        'INSERT INTO timesheet (userId, week, year) VALUES (?, ?, ?)',
        [userId, week, year]
    );
    const timesheetId = insertResult.insertId;
    return timesheetId;
} catch (error) {
    console.log(error);
    return false; // error occurred 
}
}
export async function GetTimeSheetId(pool, userId, week, year) {
try {
  const [result] = await pool.query(
    `SELECT id FROM timeSheet
    WHERE userId = ? AND week = ? AND year = ?`,
    [userId, week, year]
  );
  return result[0].id
} catch (error) {
  console.log(error);
  return false; // error occurred 
}
}

export async function IsTimeSheetFound(pool, userId, week, year) {
  try {
      // Check if a timesheet with the given userId, week, and year already exists
      const [queryResult] = await pool.query(
          'SELECT * FROM timesheet WHERE userId = ? AND week = ? AND year = ?',
          [userId, week, year]
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

export async function GetFilledOutTimeSheetForUser(pool, userId, week, year) {
  try {
      const [timeSheetReference] = await pool.query('SELECT * FROM timesheet WHERE userId = ? AND week = ? AND year = ?', [userId, week, year]);
      const [taskEntry] = await pool.query('SELECT * FROM taskentry WHERE timeSheetId = ?', [timeSheetReference[0].id]);
      const [staticTaskEntry] = await pool.query('SELECT * FROM statictaskentry WHERE timeSheetId = ?', [timeSheetReference[0].id]);
      const tasks = taskEntry.concat(staticTaskEntry)
      const timeSheet = {
          timeSheetId: timeSheetReference[0].id,
          tasks: sortTaskRows(tasks),
      }
      return timeSheet;
  } catch (error) {
      console.log(error);
      return false; // error occurred
  }
}
//make sure tasks are in a usable and expedited formart
function sortTaskRows(tasks) {
  const sortedTasks = {
    vaction: {},
    absance: {},
    meeting: {},
    projects: [],
  }
  tasks.forEach(task => {
    
    if(Object.hasOwn(task, "staticTaskType")) {
      const structuredTask = {
        id: task.id,
        taskID: task.taskId,
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
        }
      }
      switch (task.staticTaskType) {
        case 1:
          sortedTasks.vaction = structuredTask;
          break;
        case 2:
          sortedTasks.absance = structuredTask;
          break;
        case 3:
          sortedTasks.meeting = structuredTask;
          break;
        default:
          break;
      }
    }
    if(Object.hasOwn(task, "taskId")) {
      const structuredTask = {
        id: task.id,
        taskId: task.taskId,
        timeSheetId: task.timeSheetId,
        hours: {
          monday: task.mondayHours,
          tuesday: task.tuesdayHours,
          wednesday: task.wednesdayHours,
          thursday: task.thursdayHours,
          friday: task.fridayHours,
          saturday: task.saturdayHours,
          sunday: task.sundayHours,
        }
      }
      sortedTasks.projects.push(structuredTask);
    }
  })
  return sortedTasks;
}

export async function ApproveTimeSheet(pool, TimeSheetId) {
  try {
      const [insertResult] = await pool.query(
          'UPDATE timesheet SET submitstatus = 1 WHERE id = ?',
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
        const [SubmitStatus] = await pool.query('SELECT submitstatus FROM timesheet WHERE id = ?', [TimeSheetID]);
        
        return SubmitStatus[0];
    } catch (error) {
        console.log(error);
        return false; // error occurred
    }
  }

