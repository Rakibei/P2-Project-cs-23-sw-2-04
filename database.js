import mysql2 from 'mysql2'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

export function ConnectToDatabase() {
    try {
        dotenv.config()
        const pool = mysql2.createPool({ 
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        }).promise()
        return pool;
    } catch {
        console.log(error)
        return false // error occurred
    }
}

export async function GetUsers(pool) {
    try {
        const [rows] = await pool.query("SELECT * FROM users")
        return rows
    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}

export async function GetUser(pool, id) {
    try {
        const [user] = await pool.query(`
        SELECT * 
        FROM users
        WHERE id = ?
        `,[id])
        return user[0]
    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}

export async function CreateUser(pool, username, password, isAdmin, fullname, phone, email) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const [result] = await pool.query(`
        INSERT INTO users (username, password, isAdmin, fullname, phone, email)
        VALUES (?, ?, ?, ?, ?, ?)
        `, [username, hash, isAdmin, fullname, phone, email])
        const id = result.insertId
        return GetUser(pool, id)
    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}
 
export async function ComparePassword(pool, username, password) {

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username])
        const user = rows[0]
        if (!user) {
            return false // user not found
        }
        const match = await bcrypt.compare(password, user.password)
        return match // true or false
    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}

export async function CreateProject(pool, name, startDate, endDate, hoursSpent) {
    try {
        const values = [name, startDate, endDate, hoursSpent];
        await pool.query('INSERT INTO projects (name, startDate, endDate, hoursSpent) VALUES (?, ?, ?, ?)', values);
        return true; // success
    } catch (error) {
        console.log(error);
        return false; // error occurred
    }
}

export async function GetProject(pool, id) {
    try {
        const [project] = await pool.query(`SELECT * FROM projects WHERE id = ?`,[id])
        return project[0]
    } catch (error) {
        console.log(error);
        return false; // error occurred
    }
}

export async function GetProjects(pool) {
    try {
        const [rows] = await pool.query("SELECT * FROM projects")
        return rows
    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}

export async function GetProjectIdWithName(pool, projectName) {
    try {
        const [projectId] = await pool.query('SELECT * FROM projects WHERE name = ?', [projectName])
        return projectId[0].id
    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}





export async function GetUserIdWithName(pool, username) {
    try {
        const [userId] = await pool.query('SELECT * FROM users WHERE username = ?', [username])
        return userId[0].id
    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}

export async function GetUserProjects(pool, userId) {
    try {
        const [userProjectsLinks] = await pool.query('SELECT * FROM userProjectLinks WHERE userId = ?', [userId])
        const projectIds = userProjectsLinks.map(link => link.projectId)

        const [projects] = await pool.query('SELECT * FROM projects WHERE id IN (?)', [projectIds])
        return projects;
    } catch (error) {
        console.log(error)
        return false // error occurred
    }

}

export async function CreateUserProjectLink(pool, userId, projectId, isManagerForProject) {
    try {
        const values = [userId, projectId, isManagerForProject];
        await pool.query('INSERT INTO userProjectLinks (userId, projectId, isManagerForProject) VALUES (?, ?, ?)', values);
        return true; // success


    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}

export async function SetUserLevel(pool, userId, isNowAdmin) {
    try {
        const values = [isNowAdmin, userId]
        pool.query('UPDATE users SET isAdmin = "?" WHERE id = "?"', values);
        return true; // success
    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}

export async function GetUserLevel(pool, userId) {
    try {
        const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        return user[0].isAdmin; // success
    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}

export async function CreateTasks(pool, projectId, name, description, estimate) {
    try {
        // Create the task
        const [result] = await pool.query(`
            INSERT INTO tasks (projectId, name, description, estimate) VALUES (?, ?, ?, ?)`, [projectId, name, description, estimate]);
        const taskId = result.insertId;

    } catch (error) {
        console.log(error);
        return false; // error occurred
    }
}

export async function GetProjectTasks(pool, projectId) {
    try {
        const [rows] = await pool.query(`SELECT * FROM tasks WHERE projectId = ?`, [projectId])
        return rows
    } catch (error) {
        console.log(error);
        return false; // error occurred
    }
}

export async function CreateUserManagerLink(pool, userId, managerId, projectId) {
    try {
        const values = [userId, managerId, projectId];
        await pool.query('INSERT INTO userManagerLinks (userId, managerId, projectId) VALUES (?, ?, ?)', values);
        return true; // success
    } catch (error) {
        console.log(error)
        return false; // error occurred
    }
}

export async function GetmanagerProjects(pool, userId) {
    try {
        const [userProjectsLinks] = await pool.query('SELECT * FROM userProjectLinks WHERE userId = ? AND isManagerForProject = true', [userId])
        const projectIds = userProjectsLinks.map(link => link.projectId)

        if (projectIds.length === 0) {
            return [];
        }

        const [projects] = await pool.query('SELECT * FROM projects WHERE id IN (?)', [projectIds])
        return projects;
    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}




/*
comparePassword('madstest', 'hej').then((result) => {
    console.log(result); // true or false
});
*/


//const newUser = await createUser('madstest', 'hej')
//console.log(newUser)
//const pool = await ConnectToDatabase();

//CreateTasks(pool, 2, "Task3", "Hej", 21)

//console.log( await setUserLevel(pool, 1, 1) )
//const user =  await GetProjectTasks()
//console.log(user)
//getUser(pool, 2);
//const result = await createUser('Markus', '1234')
//console.log(result)