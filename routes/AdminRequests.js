import {
  ConnectToDatabase,
  
} from "../database/databaseSetup.js";
import {
  GetProjects,
  CreateUserProjectManagerlink,
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
  ApproveTimeSheet
} from "../database/databaseTimeSheet.js";




import http from "http";
import { join } from "path";
import express, { query } from "express";
import moment from "moment";
import { IsAdmin } from './Authentication.js';
const { json } = express;
const { urlencoded } = express;
const { static: serveStatic } = express;
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
import session from "express-session";
import { stringify } from "querystring";
import { Console, log } from "console";

const poolData = ConnectToDatabase();


const router = express.Router();




router.post("/adminRequests", IsAdmin, async (req, res) => {
    switch (req.body.functionName) {
      case "CreateUser":
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
        res.status(201).send("User: " + req.body.createUsername + " has been created");
        break;
      case "CreateProject":
  
          console.log(req.body);
  
        let ProjectManagerID5 = await GetUserIdWithName(poolData,req.body.projectmanager);
  
        let CreateProjectData = await CreateProject(
          poolData,
          req.body.projectName,
          req.body.projectStartDate,
          req.body.projectEndDate,
          req.body.projectHoursSpent,
          ProjectManagerID5,
        );
        console.log(CreateProjectData);
        res.status(201).send("Project: " + req.body.projectName + " has been created");
        break;
  
  
      case "seeUserLevel":
        let userID1 = await GetUserIdWithName(poolData, req.body.seeUserLevel);
        if (userID1 === false) {
          res.status(400).send("User: "+ req.body.seeUserLevel + " does not exist");
          break;
        }
        let seeUserLevelData = await GetUserLevel(poolData, userID1);
        if (seeUserLevelData === false) {
          res.status(500).send("Internal Server Error");
          break;
        }
        res.send(seeUserLevelData);
        break;
  
  
  
      case "setUserLevel":
        let userID2 = await GetUserIdWithName(
          poolData,
          req.body.setUserLevelName
        );
        console.log(userID2);
        let seeUserNewLevelData = await SetUserLevel(poolData,userID2,  req.body.setUserIsAdmin,req.body.SetUserIsManager);
        console.log(seeUserNewLevelData);
        let check1 = req.body.setUserIsAdmin; let check2 = req.body.SetUserIsManager;
        res.status(201).send("User: " + req.body.setUserLevelName + " Is Now " + (check1 ? "Admin, " : "") + (check2 ? "Manager, " : ""));
        break;
        
        case "LinkUserToManagerForm":
  
        let ManagerID = await GetUserIdWithName(poolData, req.body.Manager);
  
        if (ManagerID == false) {
          res.status(400).send("User: "+ req.body.Manager + " does not exist");
          break;
        }
        
        let UserID5 = await GetUserIdWithName(poolData, req.body.User);
  
        if (UserID5 == false) {
          res.status(400).send("User: "+ req.body.User + " does not exist");
          break;
        }
  
  
  
        console.log(ManagerID);
  
        let usermanagerlink = await CreateUserManagerlink(poolData, UserID5, ManagerID );
        
        if (usermanagerlink == true) {
          res.status(201).send("User: " + req.body.User + " is now under manager: " + req.body.Manager);
        }else{
          res.status(500).send("Error has occured and changes have not been made")
        }
  
        break;
  
  
  
  
      case "ExportPDF":
        let userID3 = await GetUserIdWithName(
          poolData,
          req.session.userName
        );
        GetUserProjects(poolData, userID3).then((projects) => {
          console.log(projects);
          CreatePDF(req.session.userName, projects).then((pdfPath) => {
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
          });
        });
  
        break;
      case "ExportExcel":
        let userID4 = req.session.userName;
        GetProjects(poolData).then((projects) => {
          JSON.stringify(projects);
          ConvertJsonToExcel(projects, userID4).then((xlsxPath) => {
            console.log(xlsxPath);
            res.download(xlsxPath);
          });
        });
        break;
      case "CreateTasks":
        let projectID2 = await GetProjectIdWithName(
          poolData,
          req.body.projectToLink
        );
        let task = await CreateTasks(
          poolData,
          projectID2,
          req.body.taskName,
          req.body.taskDescription,
          req.body.estimate
        );
        console.log(task);
        res.status(201).send("Task: " + req.body.taskName + " Has now been created for " + req.body.projectToLink);
      default:
        break;
    }
  
    console.log(req.body);
  });

  export default router;