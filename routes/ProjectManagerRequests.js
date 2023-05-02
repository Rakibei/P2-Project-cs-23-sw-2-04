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
  import { IsProjectManager } from './Authentication.js';
  const { json } = express;
  const { urlencoded } = express;
  const { static: serveStatic } = express;
  import { fileURLToPath } from "url";
  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  import session from "express-session";
  import { stringify } from "querystring";
  import { Console, log } from "console";
  
  
  
  const router = express.Router();
  

  router.post("/ProjectManagerRequests", IsProjectManager, async (req, res) => {
    console.log(req.body);
  
  
  switch (req.body.functionName) {
    case "LinkUserToProject":
      let userID1 = await GetUserIdWithName(poolData, req.body.userToLink);
      let projectID = await GetProjectIdWithName(
        poolData,
        req.body.projectToLink
      );
      let newLinkData = await CreateUserProjectLink(
        poolData,
        userID1,
        projectID
      );
      console.log(newLinkData);
      break;
    default:
      break;
  }
  
  });
  
  
  
  router.get("/ProjectManagerRequests",IsProjectManager,async (req, res)=>{
    console.log(req.query);
   switch (req.query.functionName) { 
  
    case "GetProjectManagerProjects":
        let ProjectManagerID2 = await GetUserIdWithName(poolData, req.session.userName);
        let managerProjects = await GetManagerProjects(poolData, ProjectManagerID2);
        console.log(managerProjects);
        res.send(managerProjects);
        break; 
  
        default:
          break;
   }
  })

  export default router;
