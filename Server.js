import fs from "fs";
// The servers parameters are set up so that it works with express
import http from "http";
import { join } from "path";
import express, { query } from "express";
import moment from "moment";

import {
  ConnectToDatabase,
  
} from "./database/databaseSetup.js";
import {
  GetProjects,
  CreateUserProjectManagerlink,
  CreateUserProjectLink,
  GetProjectIdWithName,
  GetProjectTasks,
  CreateProject,
  GetUserProjects,
  GetManagerProjects,
  CreateUserManagerlink,
  GetTaskNameAndProjectName,
} from "./database/databaseProject.js";
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
} from "./database/databaseUser.js";
import {
  CreateTasks,
  CreateTaskEntry,
  CreateTimeSheet,
  CreateStaticTaskEntry,
  IsTimeSheetFound,
  DeleteAllTaskEntryForATimeSheet,
  GetTimeSheetId,
  GetFilledOutTimeSheetForUser,
} from "./database/databaseTimeSheet.js";

import { CreatePDF } from "./pdf/pdfTest.js";
import { ConvertJsonToExcel } from "./xlsx/xlsxTest.js";
import path from "node:path";

const { json } = express;
const { urlencoded } = express;
const { static: serveStatic } = express;
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
import session from "express-session";
import { stringify } from "querystring";
import { Console, log } from "console";
import { autoMailer } from "./e-mail_notification/mail.js";
//import { autoMailer } from './e-mail_notification/mail.js';

// The server is given the name app and calls from the express function
const app = express();

//The server listens on port 3110 localhost so the ip is 127.0.0.1:3110
app.listen(3000);

// Database connection
const poolData = ConnectToDatabase();

// Use session to set up cookies middleware before other middleware functions
app.use(
  session({
    secret: "your secret here",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

//The servers private folder is static and is only able to be used after the isAuthenticated function has confirmed the user
app.use("/private", isAuthenticated, serveStatic(join(__dirname, "private")));

//This middleware allows the server to parse data sent in JSON and html forms format
app.use(json());
app.use(urlencoded());

// This middleware is to log all requsts sent to the server and log what methond they used and what they want.
app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});

// This get middleware is for when the server is called just on the url
app.get("/", (req, res) => {
  // The server logs the users cookie
  console.log("the cookie is ", req.session);

  // We check if the user has accesed the site before
  if (req.session.isAuthenticated == true) {
    // If they are authenticated then redirect them to the next site
    res.redirect("/private/homepage.html");
  } else {
    // If not send them to the login page
    res.redirect("/index.html");
  }
});
// we now say that the client can acces the public folder otherwise the client dosent send a get requst
app.use(serveStatic("public"));

// When the server recives a post requst to the server directly
app.post("/", async (req, res) => {
  // For error handling to let the user know they typped wrong
  const comp = await ComparePassword(
    poolData,
    req.body.username,
    req.body.password
  );
  console.log(req.body);
  if (comp) {
    // If the user is authenticated then the server redirects them and saves their cookie to show that they are
    console.log(req.body.username + " is here");
    req.session.isAuthenticated = true;
    req.session.userName = req.body.username;
    req.session.save();
    res.redirect("/private/homepage.html");
  } else if ((await GetUserIdWithName(poolData, req.body.username)) == false) {
    res.status(401).send("Invalid username");
  } else {
    res.status(401).send("Invalid password");
  }
});

// for when the user needs their userdata on the next page
app.get("/sesionData", async (req, res) => {
  let userID = await GetUserIdWithName(poolData, req.session.userName);
  let userProjects = await GetUserProjects(poolData, userID);
  let UserLevel = await GetUserLevel(poolData, userID);
  const week = moment().isoWeek();
  const year = new Date().getFullYear();
    
  if (await IsTimeSheetFound(poolData, userID, week, year)) {
    let timeSheetForUser = await GetFilledOutTimeSheetForUser(poolData, userID, week, year)
      //console.log(timeSheetForUser)
      timeSheetForUser.week = week;
      timeSheetForUser.year = year;
    req.session.timeSheetForUser = timeSheetForUser;
  }
  
  
  
  for (let i = 0; i < userProjects.length; i++) {
    userProjects[i].tasks = await GetProjectTasks(poolData, userProjects[i].id);
  }
  

  // The info is stored in session and is sent to the client
  req.session.projects = userProjects;
  req.session.userID = userID;
  req.session.UserLevel = UserLevel;
  req.session.week = week;
  req.session.save();
  res.json(req.session);

  console.log("Data Sent");
  
});


app.post("/userRequests", async (req, res) => {
  switch (req.body.functionName) {
    case "Logout":
      req.session.isAuthenticated = false;
      res.redirect("/index.html");
      break;

    default:
      break;
  }
});

app.get("/profileData", async (req, res) => {
  // spørg server om data
  let userID = await GetUserIdWithName(poolData, req.session.userName);

  req.session.userID = userID;
  req.session.eMail = "Sutminpik@lort.dk";
  req.session.phone = 15322141;

  res.json(req.session);
});



















// handle the manager function

app.use("/manager",IsManager, serveStatic(join(__dirname, "manager")));

app.use("/ProjectManager",isAuthenticated, serveStatic(join(__dirname, "ProjectManager")));

//Maneger skal kunne se brugere under sig og hvilke projekter der er under sig

app.post("/ProjectManagerRequests", isAuthenticated, async (req, res) => {
  console.log(req.body);


switch (req.body.functionName) {
  case "LinkUsers":
    let ProjectManagerID1 = await GetUserIdWithName(poolData, req.body.managerToLink);
    let userID1 = await GetUserIdWithName(poolData, req.body.userToLink);
    let projectID = await GetProjectIdWithName(
      poolData,
      req.body.projectToLink
    );
    let newLinkData = await CreateUserProjectManagerlink(
      poolData,
      userID1,
      ProjectManagerID1,
      projectID
    );
    console.log(newLinkData);
    break;


  case "ApproveTimeSheet":
      console.log(req.body);

      

  break;
  default:
    break;
}

});



app.get("/ProjectManagerRequests",isAuthenticated,async (req, res)=>{
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








app.get("/managerRequests",IsManager, async (req, res)=>{
   console.log(req.query);
  switch (req.query.functionName) {

    case "GetProjectManagerProjects":
      let ProjectManagerID2 = await GetUserIdWithName(poolData, req.session.userName);
      let managerProjects = await GetManagerProjects(poolData, ProjectManagerID2);
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
    let TimeSheetData = await GetFilledOutTimeSheetForUser(poolData,req.query.UserID,moment().isoWeek(),moment().year());
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
















// Get a list of all projects that the manager is linked too

// let req.session.userName

// handle Admin functions

// This folder is only accelisble after the user is confirmed to be an admin
app.use("/admin", IsAdmin, serveStatic(join(__dirname, "admin")));

// Handle the Admins requsts
app.post("/adminRequests", isAuthenticated, async (req, res) => {
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
      let CreateProjectData = await CreateProject(
        poolData,
        req.body.projectName,
        req.body.projectStartDate,
        req.body.projectEndDate,
        req.body.projectHoursSpent
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
      
    case "CreateProjectManager":
      let ProjectManagerID = await GetUserIdWithName(poolData, req.body.ProjectManager);
      let projectID1 = await GetProjectIdWithName(
        poolData,
        req.body.ProjectForProjectManager
      );
      let newLinkData = await CreateUserProjectLink(
        poolData,
        ProjectManagerID,
        projectID1,
        1
      );
      console.log(newLinkData);
      res.status(201).send("User: " + req.body.ProjectManager + " has been made project managaer for " + req.body.ProjectForProjectManager);

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
    case "AutoMailer":

    autoMailer(req.body.hours,req.body.mins,req.body.Weekday);

    res.status(201).send("Email Notification time has been updated");

    break;
    default:
      break;
  }

  console.log(req.body);
});



// Handle timesheet submition
app.post("/submitTime", isAuthenticated, async (req, res) => {
  const userId = req.body.userId;
  const week = req.body.week;
  const year = req.body.year;
  const timeSheetId = await makeNewTimeSheet(poolData, userId, week, year);

  const meeting = req.body.meeting;
  await PrepareStaticTaskEntry(poolData, 1, timeSheetId, meeting.days);
  const absence = req.body.absence;
  await PrepareStaticTaskEntry(poolData, 2, timeSheetId, absence.days);
  const vacation = req.body.vacation;
  await PrepareStaticTaskEntry(poolData, 3, timeSheetId, vacation.days);

  for (const project in req.body.projects) {
    for (const task in req.body.projects[project]) {
      const taskEntry = req.body.projects[project][task];
      await PrepareTaskEntry(poolData, taskEntry, timeSheetId);
    }
  }
});

async function makeNewTimeSheet(poolData, userId, week, year) {
  const isThereATimeSheet = await IsTimeSheetFound(
    poolData,
    userId,
    week,
    year
  );
  let timeSheetId;
  if (isThereATimeSheet) {
    console.log("Update sheet");
    timeSheetId = await GetTimeSheetId(poolData, userId, week, year);
    await DeleteAllTaskEntryForATimeSheet(poolData, timeSheetId);
  } else {
    console.log("Make new sheet");
    timeSheetId = await CreateTimeSheet(poolData, userId, week, year);
  }
  return timeSheetId;
}

async function PrepareTaskEntry(poolData, taskEntry, timeSheetId) {
  const retult = await CreateTaskEntry(
    poolData,
    taskEntry.taskId,
    timeSheetId,
    taskEntry.days.mondayHours,
    taskEntry.days.tuesdayHours,
    taskEntry.days.wednesdayHours,
    taskEntry.days.thursdayHours,
    taskEntry.days.fridayHours,
    taskEntry.days.saturdayHours,
    taskEntry.days.sundayHours
  );
}

async function PrepareStaticTaskEntry(poolData, taskId, timeSheetId, hours) {
  const retult = await CreateStaticTaskEntry(
    poolData,
    taskId,
    timeSheetId,
    hours.mondayHours,
    hours.tuesdayHours,
    hours.wednesdayHours,
    hours.thursdayHours,
    hours.fridayHours,
    hours.saturdayHours,
    hours.sundayHours
  );
}

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send("404 error page does not exist");
});

function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    next();
  } else {
    // send error message
    res.status(401).send("Acces not granted");
  }
}

function IsAdmin(req, res, next) {
  if (req.session.UserLevel.isAdmin) {
    next();
  } else {
    // send error message
    res.status(401).send("Acces not granted");
  }
}

function IsManager(req, res, next) {
  if (req.session.UserLevel.isManager) {
    next();
  } else {
    // send error message
    res.status(401).send("Acces not granted");
  }
}