// The functions from our database functions are imported
import {
  ConnectToDatabase,
  
} from "../database/databaseSetup.js";
import {
  GetProjects,
  CreateUserProjectLink,
  GetProjectIdWithName,
  GetProjectTasks,
  CreateProject,
  GetUserProjects,
  GetManagerProjectsForUser,
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
  GetTimeSheetSubmit,
} from "../database/databaseTimeSheet.js";

// a conection to the database is made
const poolData = ConnectToDatabase();

// The frameworks we use are imported
import http from "http";
import { join } from "path";
import express, { query } from "express";
import moment from "moment";
import { IsManager } from './Authentication.js';
const { json } = express;
const { urlencoded } = express;
const { static: serveStatic } = express;
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
import session from "express-session";
import { stringify } from "querystring";
import { Console, log } from "console";


// Router is set up with express router this will make it posible to export the path to another main file
const router = express.Router();


// Here post requets to manager is hanlded.
// It can only be accesed if the client is a manager
router.post("/managerRequests", IsManager, async (req, res) => {
    console.log(req.body);
  
  // A switch case is used to check the function that the request wants to use
  switch (req.body.functionName) {
    case "ApproveTimeSheet":
        // The case for when a time sheet needs to be approved
        
        // The function takes the relevant data from the request and changes the value in the database
        let TimeSheetApprove = await ApproveTimeSheet(poolData,req.body.TimeSheetId);
        
        console.log(TimeSheetApprove);    
        // A response is sent to the client
        res.send("TimeSheet Has been aprroved");
  
    break;

    case "CreateProject":
  
    console.log(req.body);
    // When a project is created it will need a project managager here an id is gotten with their name
    let ProjectManagerID = await GetUserIdWithName(poolData,req.body.ProjectManager);
    // The project is created with the relevant data
    let CreateProjectData = await CreateProject(
    poolData,
    req.body.projectName,
    req.body.projectStartDate,
    req.body.projectEndDate,
    ProjectManagerID,
  );
  console.log(CreateProjectData);
  // A response is sent to the client letting them know it was created
  res.status(201).send("Project: " + req.body.projectName + " has been created");
  break;
    default:
      break;
  }
  
  });
  
  // GET requets to manager is hanlded.
  // It can only be accesed if the client is a manager
  router.get("/managerRequests",IsManager, async (req, res)=>{
     console.log(req.query);
     // A switch case is used to handle the diffrent functions asked for by the client
    switch (req.query.functionName) {
    
      case "GetProjectManagerProjects":
        // When the client wants the project managers for the projects the username and project name is used to get the id to search for the projects
        let ProjectManagerID2 = await GetUserIdWithName(poolData, req.session.userName);
        let managerProjects = await GetManagerProjectsForUser(poolData, ProjectManagerID2);
        console.log(managerProjects);
        // The projects under are sent to the client
        res.send(managerProjects);
        break; 
  
      case "GetUsersUnderManager":
        // To get the users under a manager the managers id is needed
        let ManagerID3 = await GetUserIdWithName(poolData, req.session.userName);
        // The users are gotten from the database with the manager id
        let Users = await GetUsersUnderManager(poolData,ManagerID3);
        console.log(Users);
        // The users are sent to the client
        res.send(Users);
      break;
  
      case "GetUserInfo":
      // Here more than one user's info is expected to be gotten so an array is setup to store them
      let usernames = [];

      // Users are setupe based on the string that is sent which will then split the string at the comma and
      // make a new entry in an array that then has gone from a string to an array
      let users = req.query.users.split(","); 

      // A for loop is made that runs through all the users name with their user id
      for (let i = 0; i < users.length; i++) {
        usernames[i] = await GetUsernameWithID(poolData,users[i]);
      }
      // The usernames are sent back to the client
      res.send(usernames)
      break;
      
      case "GetTimeSheet":
      // The variable that will hold the timesheet in an object is made
      let TimeSheetData ={}; 
      // A variable to stop the numbers from jumping if the user has not made a time sheet 
      let CurrentNumb = 0;

      // A for loop is made that will look through the last month of time sheets
      for (let i = 0; i < 5; i++) {
        // The timesheet is gotten from the databasen note that the week is subtracted by i
        let result = await GetFilledOutTimeSheetForUser(poolData,req.query.UserID,moment().isoWeek() - i,moment().year());
        // The status of the time sheet is gotten to see if it has already been submited
        let Status = await GetTimeSheetSubmit(poolData,result.timeSheetId);

        // If there is a time sheet for that week and it has not already been aprroved then add it to the timesheetdata
        if (result !== false && Status.submitstatus == 0) {
          TimeSheetData[CurrentNumb] = result;
          TimeSheetData[CurrentNumb]["Week"] = moment().isoWeek() - i;
          // Used to get the correct position instead of it jumping
          CurrentNumb++;
        }
      }
      // The time sheets are sent to the client
      res.send(TimeSheetData);
      break;
  
      case "GetProjectInfo":
  
      console.log(req.query.TaskId);
  
      // Get Task name and project name
      let TasknameAndProjectName = await GetTaskNameAndProjectName(poolData,req.query.TaskId);
  
      console.log(TasknameAndProjectName);
  
      // send to the client
      res.send(TasknameAndProjectName);
  
  
  
      break;
    
      default:
        break;
    }
  })

export default router;