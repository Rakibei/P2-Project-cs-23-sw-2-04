
export async function CreateProject(
    pool,
    name,
    startDate,
    endDate,
    hoursSpent,
    ProjectManagerID,
  ) {
    try {
      const values = [name, startDate, endDate, hoursSpent,ProjectManagerID];
      await pool.query(
        "INSERT INTO projects (name, startDate, endDate, hoursSpent, projectmanagerid) VALUES (?, ?, ?, ?,?)",
        values
      );
      return true; // success
    } catch (error) {
      console.log(error);
      return false; // error occurred
    }
  }
}

export async function GetProject(pool, id) {
  try {
    const [project] = await pool.query(`SELECT * FROM projects WHERE id = ?`, [
      id,
    ]);
    return project[0];
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}

export async function GetProjects(pool) {
  try {
    const [rows] = await pool.query("SELECT * FROM projects");
    return rows;
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}

export async function GetProjectIdWithName(pool, projectName) {
  try {
    const [projectId] = await pool.query(
      "SELECT * FROM projects WHERE name = ?",
      [projectName]
    );
    return projectId[0].id;
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}

export async function GetUserProjects(pool, userId) {
  try {
    const [userProjectsLinks] = await pool.query(
      "SELECT * FROM userProjectLinks WHERE userId = ?",
      [userId]
    );
    //return if there are no projects links for user
    if (userProjectsLinks.length <= 0) {
      return false;
    }
    const projectIds = userProjectsLinks.map((link) => link.projectId);

    const [projects] = await pool.query(
      `SELECT * FROM projects WHERE id IN (?)`,
      [projectIds]
    );
    return projects;
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}

export async function CreateUserProjectLink(
  pool,
  userId,
  projectId,
  isManagerForProject
) {
  try {
    const values = [userId, projectId, isManagerForProject];
    await pool.query(
      "INSERT INTO userprojectlinks (userId, projectId, isManagerForProject) VALUES (?, ?, ?)",
      values
    );
    return true; // success
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}


export async function GetProjectTasks(pool, projectId) {
  try {
    const [rows] = await pool.query(`SELECT * FROM tasks WHERE projectId = ?`, [
      projectId,
    ]);
    return rows;
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }

  export async function GetManagerProjectsForUser(pool, userId) {
    try {
      const [projects] = await pool.query(
        "SELECT * FROM projects WHERE projectmanagerid = ?",
        [userId]
      );
      return projects;
    } catch (error) {
      console.log(error);
      return false; // error occurred

    }

    const [projects] = await pool.query(
      "SELECT * FROM projects WHERE id IN (?)",
      [projectIds]
    );
    return projects;
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}

export async function CreateUserProjectManagerlink(
  pool,
  userId,
  managerId,
  projectId
) {
  try {
    const values = [userId, managerId, projectId];
    await pool.query(
      "INSERT INTO userprojectmanagerlinks (userId, managerId, projectId) VALUES (?, ?, ?)",
      values
    );
    return true; // success
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}


export async function CreateUserManagerlink(
  pool,
  userId,
  managerId) {
  try {
    const values = [userId, managerId];
    await pool.query(
      "INSERT INTO usermanagerlinks (userId, managerId) VALUES (?, ?)",
      values
    );
    return true; // success
  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}


export async function GetTaskNameAndProjectName(pool, TaskId) {
  try {
    const [TaskInfo] = await pool.query(
      "SELECT * FROM tasks WHERE id = ?",
      [TaskId]
    );

    console.log(TaskInfo);

    if (TaskInfo.length === 0) {
      return false;
    }

    console.log(TaskInfo[0].projectId);

    const [ProjectInfo] = await pool.query(
      "SELECT * FROM projects WHERE id = ?",
      [TaskInfo[0].projectId]
    )

    console.log(ProjectInfo);

    if (ProjectInfo.length === 0) {
      return false;
    }

    let TasknameAndProjectName = [ProjectInfo[0].name, TaskInfo[0].name];

    return TasknameAndProjectName;

  } catch (error) {
    console.log(error);
    return false; // error occurred
  }
}
