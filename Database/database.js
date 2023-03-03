import mysql from 'mysql2'
import bcrypt from 'bcrypt'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({ 
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM users")
    return rows
}

export async function getUser(id) {
    const [user] = await pool.query(`
    SELECT * 
    FROM users
    WHERE id = ?
    `,[id])
    return user[0]
}

export async function createUser(username, password) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const [result] = await pool.query(`
    INSERT INTO users (username, password)
    VALUES (?, ?)
    `, [username, hash])
    const id = result.insertId
    return getUser(id)
}


export async function comparePassword(username, password) {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];
        if (!user) {
            return false; // user not found
        }
        const match = await bcrypt.compare(password, user.password);
        return match; // true or false
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

const users = await getUsers()
console.log(users)

//const user =  await getUser(2)
//console.log(user)

//const result = await createUser('Markus', '1234')
//console.log(result)