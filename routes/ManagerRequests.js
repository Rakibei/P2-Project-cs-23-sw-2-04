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


const poolData = ConnectToDatabase();




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



const router = express.Router();



router.post("/managerRequests", IsManager, async (req, res) => {
    console.log(req.body);
  
  
  switch (req.body.functionName) {
    case "ApproveTimeSheet":
     
        let TimeSheetApprove = await ApproveTimeSheet(poolData,req.body.TimeSheetId);
        
        console.log(TimeSheetApprove);    

        res.send("TimeSheet Has been aprroved");
  
    break;

    case "CreateProject":
  
    console.log(req.body);

  let ProjectManagerID = await GetUserIdWithName(poolData,req.body.ProjectManager);

  let CreateProjectData = await CreateProject(
    poolData,
    req.body.projectName,
    req.body.projectStartDate,
    req.body.projectEndDate,
    req.body.projectHoursSpent,
    ProjectManagerID,
  );
  console.log(CreateProjectData);
  res.status(201).send("Project: " + req.body.projectName + " has been created");
  break;



    default:
      break;
  }
  
  });
  
  router.get("/managerRequests",IsManager, async (req, res)=>{
     console.log(req.query);
    switch (req.query.functionName) {
  
      case "GetProjectManagerProjects":
        let ProjectManagerID2 = await GetUserIdWithName(poolData, req.session.userName);
        let managerProjects = await GetManagerProjectsForUser(poolData, ProjectManagerID2);
        console.log(managerProjects);
        res.send(managerProjects);
        break; 
  
      case "GetUsersUnderManager":
        let ManagerID3 = await GetUserIdWithName(poolData, req.session.userName);
        let Users = await GetUsersUnderManager(poolData,ManagerID3);
        console.log(Users);
        res.send(Users);
      break;
  
      case "GetUserInfo":
  
      let usernames = [];
      let users = req.query.users.split(","); // split the string by comma
      console.log(users[0]+users.length); // should log 82
      for (let i = 0; i < users.length; i++) {
        usernames[i] = await GetUsernameWithID(poolData,users[i]);
      }
      res.send(usernames)
      break;
      
      case "GetTimeSheet":
      let TimeSheetData ={}; 
      let CurrentNumb = 0;

      for (let i = 0; i < 5; i++) {
        let result = await GetFilledOutTimeSheetForUser(poolData,req.query.UserID,moment().isoWeek() - i,moment().year());
        let Status = await GetTimeSheetSubmit(poolData,result.timeSheetId);

        if (result !== false && Status.submitstatus == 0) {
          TimeSheetData[CurrentNumb] = result;
          TimeSheetData[CurrentNumb]["Week"] = moment().isoWeek() - i;
          CurrentNumb++;
        }
      }

      res.send(TimeSheetData);
      break;
  
      case "GetProjectInfo":
  
      console.log(req.query.TaskId);
  
      // Get Task name and project name
      let TasknameAndProjectName = await GetTaskNameAndProjectName(poolData,req.query.TaskId);
  
      console.log(TasknameAndProjectName);
  
      res.send(TasknameAndProjectName);
  
  
  
      break;
    
      default:
        break;
    }
  })

export default router;