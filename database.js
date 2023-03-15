import mysql2 from 'mysql2'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

export function connectToDatabase() {
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

export async function getUsers(pool) {
    try {
        const [rows] = await pool.query("SELECT * FROM users")
        return rows
    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}
 
export async function getUser(pool, id) {
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

export async function createUser(pool, username, password) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const [result] = await pool.query(`
        INSERT INTO users (username, password)
        VALUES (?, ?)
        `, [username, hash])
        const id = result.insertId
        return getUser(pool, id)
    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}

export async function comparePassword(pool, username, password) {

    console.log(pool + " " + username + " " + password);

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

export async function createProject(pool, ProjectId, name, startDate, endDate, hoursSpent) {
    try {
        const values = [ProjectId, name, startDate, endDate, hoursSpent];
        await pool.query('INSERT INTO projects (ProjectId, name, startDate, endDate, hoursSpent) VALUES (?, ?, ?, ?, ?)', values);
        return true; // success
    } catch (error) {
        console.log(error);
        return false; // error occurred
    }
}

export async function getProject(pool, id) {
    try {
        const [project] = await pool.query(`SELECT * FROM projects WHERE id = ?`,[id])
        return project[0]
    } catch (error) {
        console.log(error);
        return false; // error occurred
    }
}

export async function getProjects(pool) {
    try {
        const [rows] = await pool.query("SELECT * FROM projects")
        return rows
    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}

export async function getUserIdWithName(pool, username) {
    try {
        const [userId] = await pool.query('SELECT * FROM users WHERE username = ?', [username])
        return userId[0].id
    } catch (error) {
        console.log(error)
        return false // error occurred
    }
}

export async function getUserProjects(pool, userId) {
    try {
        const [userProjectsLinks] = await pool.query('SELECT * FROM userProjectLinks WHERE userId = ?', [userId])
        //console.log([userProjectsLinks].projectId);
        const [projectIds] = userProjectsLinks.map(link => link.projectId)
        const [projects] = await pool.query('SELECT * FROM projects WHERE ProjectId = ?', projectIds)
        return [projects][0]
    } catch (error) {
        console.log(error)
        return false // error occurred
    }

}

export async function createUserProjectLink(pool, userId, projectId) {
    try {
        const values = [userId, projectId];
        await pool.query('INSERT INTO userProjectLinks (userId, projectId) VALUES (?, ?)', values);
        return true; // success


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
//const pool = await connectToDatabase();
//const users = await getUserProjects(pool, 8)
//console.log(users)

//const user =  await getUser(2)
//console.log(user)

//const result = await createUser('Markus', '1234')
//console.log(result)