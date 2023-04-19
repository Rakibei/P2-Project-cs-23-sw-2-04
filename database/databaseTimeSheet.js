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
    try {
        const values = [staticTaskType, timeSheetId, mondayHours, tuesdayHours, wednesdayHours, thursdayHours, fridayHours, saturdayHours, sundayHours];
        await pool.query(
            "INSERT INTO staticTaskEntry (staticTaskType, timeSheetId, mondayHours, tuesdayHours, wednesdayHours, thursdayHours, fridayHours, saturdayHours, sundayHours) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            values
        );
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
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}

export async function CreateTimeSheet(pool, userId, week, year) {
  try {
      // Create a new timesheet entry and retrieve its auto-generated id
      const [insertResult] = await pool.query(
          'INSERT INTO timeSheet (userId, week, year) VALUES (?, ?, ?)',
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
            'SELECT * FROM timeSheet WHERE userId = ? AND week = ? AND year = ?',
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
        const [timeSheetReference] = await pool.query('SELECT * FROM timeSheet WHERE userId = ? AND week = ? AND year = ?', [userId, week, year]);
        console.log(timeSheetReference);
        const [rows] = await pool.query('SELECT * FROM taskEntry WHERE timeSheetId = ?', [timeSheetReference[0].id]);
        console.log(rows);
        const [rows2] = await pool.query('SELECT * FROM staticTaskEntry WHERE timeSheetId = ?', [timeSheetReference[0].id]);
        console.log(rows2);
        const tasks = rows.concat(rows2)
        
        const timeSheet = {
            timeSheetId: timeSheetReference[0].id,
            tasks: tasks,
        }
        return timeSheet;
    } catch (error) {
        console.log(error);
        return false; // error occurred
    }
}