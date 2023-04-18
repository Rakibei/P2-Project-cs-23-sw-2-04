import mysql2 from "mysql2";
import dotenv from "dotenv";

export function ConnectToDatabase() {
  try {
    dotenv.config();
    const pool = mysql2
      .createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      })
      .promise();
    return pool;
  } catch {
    console.log(error);
    return false; // error occurred
  }
}


















//export

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
//const user =  await GetProjectTasks(pool, 2)
//console.log(user)
//getUser(pool, 2);
//const result = await createUser('Markus', '1234')
//console.log(result)
