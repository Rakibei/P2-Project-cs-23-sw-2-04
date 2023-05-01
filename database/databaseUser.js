import bcrypt from "bcrypt";
import { GetManagerProjectsForUser } from "./databaseProject.js";
import { NULL } from "mysql/lib/protocol/constants/types.js";

export async function GetUsers(pool) {
    try {
      const [rows] = await pool.query("SELECT * FROM users");
      return rows;
    } catch (error) {
      console.log(error);
      return false; // error occurred
    }
  }
  
  export async function GetUser(pool, id) {
    try {
      const [user] = await pool.query(
        `
          SELECT * 
          FROM users
          WHERE id = ?
          `,
        [id]
      );
      return user[0];
    } catch (error) {
      console.log(error);
      return false; // error occurred
    }
  }
  
  export async function CreateUser(
    pool,
    username,
    password,
    isAdmin,
    fullname,
    phone,
    email
  ) {
    console.log(username, isAdmin, fullname, phone, email);
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
  
      const [result] = await pool.query(
        `
          INSERT INTO users (username, password, isAdmin, fullname, phone, email)
          VALUES (?, ?, ?, ?, ?, ?)
          `,
        [username, hash, isAdmin, fullname, phone, email]
      );
      console.log(result);
      const id = result.insertId;
      return GetUser(pool, id);
    } catch (error) {
      console.log(error);
      return false; // error occurred
    }
  }
  
  export async function ComparePassword(pool, username, password) {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
        username,
      ]);
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

  export async function GetUserIdWithName(pool, username) {
    try {
      const [userId] = await pool.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );

      if (userId.length == 0) {
        return false;  
      }
      return userId[0].id;
    } catch (error) {
      console.log(error);
      return false; // error occurred
    }
  }



  export async function GetUsernameWithID(pool, UserID) {
    try {
      const [username] = await pool.query(
        "SELECT * FROM users WHERE id = ?",
        [UserID]
      );
      return username[0].username;
    } catch (error) {
      console.log(error);
      return false; // error occurred
    }
  }



  export async function GetUserLevel(pool, userId) {
    try {
      const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
        userId,
      ]);
      let userLevel = {
        isAdmin: 0,
        isManager: 0,
        isProjectManager: 0,
      };
      userLevel.isAdmin	= user[0].isAdmin;
      userLevel.isManager = user[0].isManager;
      if(GetManagerProjectsForUser(pool, userId).length != 0) {
        userLevel.isProjectManager = 1;
      }
      return userLevel; // success
    } catch (error) {
      console.log(error);
      return false; // error occurred
    }
  }

  

  
  export async function GetUsersUnderManager(pool, managerId) {
    try {
      const [userManagerLinks] = await pool.query("SELECT * FROM usermanagerlinks WHERE managerId = ?", [managerId]);
      console.log(userManagerLinks)
      const users = userManagerLinks.map((link) => link.userId);
      console.log(users)
      
      return users;
    } catch (error) {
      console.log(error);
      return false; // error occurred
    }
  
  }

  export async function SetUserLevel(pool, userId, isNowAdmin, isNowManager) {
    try {
      const values = [isNowAdmin, isNowManager, userId];
      pool.query('UPDATE users SET isAdmin = ?, isManager = ? WHERE id = ?', values);
      return true; // success
    } catch (error) {
      console.log(error);
      return false; // error occurred
    }
  }