// The functions from our database functions are imported
import fs from "fs";
import { ConnectToDatabase } from "../database/databaseSetup.js";
import {
  GetProjects,
  CreateUserProjectLink,
  GetProjectIdWithName,
  GetProjectTasks,
  CreateProject,
  GetUserProjects,
  CreateUserManagerlink,
  GetTaskNameAndProjectName,
} from "../database/databaseProject.js";
import {
  GetUsers,
  GetUser,
  CreateUser,
  ComparePassword,
  GetUserIdWithName,
  GetUsersUnderManager,
  GetUserLevel,
  SetUserLevel,
  GetUsernameWithID,
} from "../database/databaseUser.js";
import {
  CreateTasks,
  CreateTaskEntry,
  CreateTimeSheet,
  CreateStaticTaskEntry,
  IsTimeSheetFound,
  DeleteAllTaskEntryForATimeSheet,
  GetTimeSheetId,
  GetFilledOutTimeSheetForUser,
  ApproveTimeSheet,
  GetTotalTimeForTask,
} from "../database/databaseTimeSheet.js";

import { CreatePDFForAdmin } from "../pdf/pdfTest.js";
import { CreateXLSX } from "../xlsx/xlsxExport.js";
import { autoMailer } from "../e-mail_notification/mail.js";

// The frameworks we use are imported
import http from "http";
import { join } from "path";
import express, { query } from "express";
import moment from "moment";
import { IsAdmin } from "./Authentication.js";
const { json } = express;
const { urlencoded } = express;
const { static: serveStatic } = express;
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
import session from "express-session";
import { stringify } from "querystring";
import { Console, log } from "console";

// A connection to the database is made
const poolData = ConnectToDatabase();

// router is set up with express router this will make it posible to export the path to another main file
const router = express.Router();

// Here post requsts from the admin page is handled and they are checked if they are an admin
router.post("/adminRequests", IsAdmin, async (req, res) => {
  // A switch case is used to check the function that the request wants to use
  switch (req.body.functionName) {
    case "CreateUser":
      // Here a user is created with the data gotten from the request and the indicates that they are a basic user
      let CreateUserData = await CreateUser(
        poolData,
        req.body.createUsername,
        req.body.createPassword,
        0,
        req.body.FullName,
        req.body.PhoneNumber,
        req.body.Email
      );
      console.log(CreateUserData);
      // When the user has been created a response is sent to the client
      res
        .status(201)
        .send("User: " + req.body.createUsername + " has been created");
      break;
    case "CreateProject":

      console.log(req.body);
      // When a project is created it will need a project managager here an id is gotten with their name
      let ProjectManagerID = await GetUserIdWithName(
        poolData,
        req.body.ProjectManager
      );
      // The project is created with the relevant data
      let CreateProjectData = await CreateProject(
        poolData,
        req.body.projectName,
        req.body.projectStartDate,
        req.body.projectEndDate,
        ProjectManagerID
      );
      console.log(CreateProjectData);
      // A response is sent to the client
      res
        .status(201)
        .send("Project: " + req.body.projectName + " has been created");
      break;

    case "setUserLevel":
      // When a user level needs to be changed their id is first gotten
      let userID2 = await GetUserIdWithName(
        poolData,
        req.body.setUserLevelName
      );
      console.log(userID2);
      
      // The user's level is changed based on the boolean values recived in the request
      let SetUserNewLevelData = await SetUserLevel(
        poolData,
        userID2,
        req.body.setUserIsAdmin,
        req.body.SetUserIsManager
      );
      console.log(SetUserNewLevelData);
      // Here two checks are made so the info can be sent to the client what the user was changed to in the database
      let check1 = req.body.setUserIsAdmin;
      let check2 = req.body.SetUserIsManager;
      res
        .status(201)
        .send(
          "User: " +
            req.body.setUserLevelName +
            " Is Now " +
            (check1 ? "Admin, " : "") +
            (check2 ? "Manager, " : "")
        );
      break;

    case "LinkUserToManagerForm":
      // When a link from a user to a manager needs to be made both the users and the managers
      // id are gotten with their name
      let ManagerID = await GetUserIdWithName(poolData, req.body.Manager);

      // if the manager does not exist send the responsse to the client and stop the case
      if (ManagerID == false) {
        res.status(400).send("User: " + req.body.Manager + " does not exist");
        break;
      }

      let UserID5 = await GetUserIdWithName(poolData, req.body.User);

      // If the user does not exist then send a response to the client and stop the case
      if (UserID5 == false) {
        res.status(400).send("User: " + req.body.User + " does not exist");
        break;
      }

      console.log(ManagerID);
      // The manager and user are linked with the relevant data
      let usermanagerlink = await CreateUserManagerlink(
        poolData,
        UserID5,
        ManagerID
      );

      if (usermanagerlink == true) {
        // If the link was succesful send a response to the user
        res
          .status(201)
          .send(
            "User: " +
              req.body.User +
              " is now under manager: " +
              req.body.Manager
          );
      } else {
        // If something went wrong then send a response to the user informing them of the server error
        res
          .status(500)
          .send("Error has occured and changes have not been made");
      }

      break;

    case "ExportPDF":
     
     let ProjectsToExport = GetProjects(poolData).then(async (projects) => {
       if (projects != false) {
         for (let i = 0; i < projects.length; i++) {
           projects[i].tasks = await GetProjectTasks(poolData, projects[i].id);
         }

         CreatePDFForAdmin(projects).then(
           (pdfPath) => {
             const stream = fs.createReadStream(pdfPath);
             stream.on("open", () => {
               stream.pipe(res);
             });
             stream.on("error", (err) => {
               res.end(err);
             });
             res.on("finish", () => {
               fs.unlink(pdfPath, (err) => {
                 if (err) throw err;
                 console.log("PDF file deleted");
               });
             });
           }
         );
       }
     });

      break;

    case "ExportExcel":
      const projects = await GetProjects(poolData);
      if(projects >! 0 || projects == false) {
        //send alert to user that input is not valid
        break;
      } 
      let projectObjects = [];
      for (let i = 0; i < projects.length; i++) {
        projectObjects.push({
          project: projects[i],
          tasksForProject: await GetProjectTasks(poolData, projects[i].id)
        });
      }
      for (let i = 0; i < projectObjects.length; i++) {
        projectObjects[i].project.projectmanager = await GetUsernameWithID(poolData, projectObjects[i].project.projectmanagerid);
        if(!projectObjects[i].project.projectmanager) {projectObjects[i].project.projectmanager = "No one is manager for this project"}
        projectObjects[i].project.totalHours = 0;
        for (let j = 0; j < projectObjects[i].tasksForProject.length; j++) {
          const totalHoursForTask = await GetTotalTimeForTask(poolData, projectObjects[i].tasksForProject[j].id);
          projectObjects[i].tasksForProject[j].totalHours = totalHoursForTask;
          projectObjects[i].project.totalHours += totalHoursForTask;
        }
      }
      for (let i = 0; i < projectObjects.length; i++) {
        delete projectObjects[i].project.projectmanagerid;
        delete projectObjects[i].project.id;
        for (let j = 0; j < projectObjects[i].tasksForProject.length; j++) {
          delete projectObjects[i].tasksForProject[j].id
          delete projectObjects[i].tasksForProject[j].projectId
        }
      }
      
      const xlsxPath = await CreateXLSX(projectObjects);

      const stream = fs.createReadStream(xlsxPath);
      stream.on("open", () => {
        stream.pipe(res);
      });
      stream.on("error", (err) => {
        res.end(err);
      });
      res.on("finish", () => {
        fs.unlink(xlsxPath, (err) => {
          if (err) throw err;
          console.log("XLSX file deleted");
        });
      });
      break;

    case "CreateTasks":
      // when tasks need to be made for a project the project id is first gotten
      let projectID2 = await GetProjectIdWithName(
        poolData,
        req.body.projectToLink
      );
      // The task is created with the relevant data
      let task = await CreateTasks(
        poolData,
        projectID2,
        req.body.taskName,
        req.body.taskDescription,
      );
      console.log(task);
      // The client is informed that the task has been created
      res
        .status(201)
        .send(
          "Task: " +
            req.body.taskName +
            " Has now been created for " +
            req.body.projectToLink
        );

      break;
    case "AutoMailer":
      // here the automailer function is called with the relevant data to be able to send
      // emails are the correct time
      autoMailer(req.body.hours, req.body.mins, req.body.Weekday);

      // The client is informed that the email time has been updated
      res.status(201).send("Email Notification time has been updated");

      break;
    default:
      break;
  }

  console.log(req.body);
});

// here get requests are handled from the admin site
router.get("/adminRequests", IsAdmin, async (req, res) => {
  
  console.log(req.query);
  // A switch statement is used to handled the diffrent functions the client wants to be called
  switch (req.query.functionName) {
    
    case "seeUserLevel":
    // When a user level wnats to be known first the user id is gooten
    let userID1 = await GetUserIdWithName(poolData, req.query.users);
    // If the user dosen't exist then send a repsone saying that to the client and stop the case
    if (userID1 === false) {
      res.status(400);
      break;
    }
    // the users level is gotten with their id
    let seeUserLevelData = await GetUserLevel(poolData, userID1);
    // if there was a server error then send that repsone to the client
    if (seeUserLevelData === false) {
      res.status(500);
      break;
    }
    console.log(seeUserLevelData);
    // if the user level data was gotten then send that to the client
    res.send(seeUserLevelData);
    break;

  default:
    break;
}



})

// export the get and post routes to the main server.js file
export default router;
