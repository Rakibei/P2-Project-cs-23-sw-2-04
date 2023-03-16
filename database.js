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

export async function CreateUser(pool, username, password) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const [result] = await pool.query(`
        INSERT INTO users (username, password)
        VALUES (?, ?)
        `, [username, hash])
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

        const [projects] = await pool.query('SELECT * FROM projects WHERE ProjectId IN (?)', [projectIds])
        return projects;
    } catch (error) {
        console.log(error)
        return false // error occurred
    }

}

export async function CreateUserProjectLink(pool, userId, projectId) {
    try {
        const values = [userId, projectId];
        await pool.query('INSERT INTO userProjectLinks (userId, projectId) VALUES (?, ?)', values);
        return true; // success


    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}

export async function SetUserLevel(pool, userId, newLevel) {
    try {
        pool.query('UPDATE users SET level = "?" WHERE id = "?"', [newLevel, userId]);
        return true; // success
    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}

export async function GetUserLevel(pool, userId) {
    try {
        const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        return user[0].level; // success
    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}

export async function CreateTasks(pool, projectId, name, description, status) {
    try {
        // Create the task
        const [result] = await pool.query(`
            INSERT INTO tasks (projectId, name, description, status) VALUES (?, ?, ?, ?)`, [projectId, name, description, status]);
        const taskId = result.insertId;

    } catch (error) {
        console.log(error);
        return false; // error occurred
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

//CreateProject(pool, "projectC", '1900-00-01', 'SELECT CURDATE()', 69)
//const userLevel = await GetUserLevel(pool, 1)
//createUserProjectLink(pool, 8, 2)
//const users = await getUserProjects(pool, 8)
//console.log(userLevel)
//console.log( await setUserLevel(pool, 1, 1) )
//const user =  await getUser(2)
//console.log(user)
//getUser(pool, 2);
//const result = await createUser('Markus', '1234')
//console.log(result)