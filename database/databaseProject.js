
export async function CreateProject(
    pool,
    name,
    startDate,
    endDate,
    hoursSpent
  ) {
    try {
      const values = [name, startDate, endDate, hoursSpent];
      await pool.query(
        "INSERT INTO projects (name, startDate, endDate, hoursSpent) VALUES (?, ?, ?, ?)",
        values
      );
      return true; // success
    } catch (error) {
      console.log(error);
      return false; // error occurred
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
      const projectIds = userProjectsLinks.map((link) => link.projectId);
  
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
  
  export async function CreateUserProjectLink(
    pool,
    userId,
    projectId,
    isManagerForProject
  ) {
    try {
      const values = [userId, projectId, isManagerForProject];
      await pool.query(
        "INSERT INTO userProjectLinks (userId, projectId, isManagerForProject) VALUES (?, ?, ?)",
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
  }

  export async function GetManagerProjects(pool, userId) {
    try {
      const [userProjectsLinks] = await pool.query(
        "SELECT * FROM userProjectLinks WHERE userId = ? AND isManagerForProject = true",
        [userId]
      );
      const projectIds = userProjectsLinks.map((link) => link.projectId);
  
      if (projectIds.length === 0) {
        return [];
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
        "INSERT INTO userProjectManagerLinks (userId, managerId, projectId) VALUES (?, ?, ?)",
        values
      );
      return true; // success
    } catch (error) {
      console.log(error);
      return false; // error occurred
    }
  }