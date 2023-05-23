// The servers parameters are set up so that it works with express
import fs from "fs";
import http, { get } from "http";
import { join } from "path";
import express, { query } from "express";
import moment from "moment";

import {
  ConnectToDatabase,

  //All the functions from the databases is imported, so the server can use them
} from "./database/databaseSetup.js";
import {
  GetProjects,
  CreateUserProjectLink,
  GetProjectIdWithName,
  GetProjectTasks,
  CreateProject,
  GetUserProjects,
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
  GetUserInfoWithID,
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
  GetFilledOutTimeSheetsForUser,
  GetTotalTimeForTask,
  ApproveTimeSheet,
  GetAllSubmitStatus,
  GetEmailfromSubmitstaus,
} from "./database/databaseTimeSheet.js";

import {
  IsAdmin,
  IsManager,
  isAuthenticated,
  IsProjectManager,
} from "./routes/Authentication.js";

//import { ConvertJsonToExcel } from "./xlsx/xlsxTest.js";
import path from "node:path";

const { json } = express;
const { urlencoded } = express;
const { static: serveStatic } = express;
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
import session from "express-session";
import { stringify } from "querystring";
import { Console, log } from "console";
import managerRequests from "./routes/ManagerRequests.js";
import adminRequests from "./routes/AdminRequests.js";
import ProjectManagerRequests from "./routes/ProjectManagerRequests.js";

import { CreatePDFForUser } from "./pdf/pdfTest.js";
import { CreateXLSX } from "./xlsx/xlsxExport.js";

import { autoMailer } from "./e-mail_notification/mail.js";
import { isProxy } from "util/types";

// The server is given the name app and calls from the express function
const app = express();

//The server listens on port 3110 localhost so the ip is 127.0.0.1:3000
app.listen(3000);

// Database connection
const poolData = ConnectToDatabase();

// Use session to set up cookies middleware before other middleware functions
app.use(
  session({
    secret: "q9w8e7r6t5y4u3i2o1p0",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    cookie: { maxAge: 14400000 },
  })
);

//The servers private folder is static and is only able to be used after the isAuthenticated function has confirmed the user
app.use("/private", isAuthenticated, serveStatic(join(__dirname, "private")));

//This middleware allows the server to parse data sent in JSON and html forms format
app.use(json());
app.use(urlencoded());

// This middleware is to log all requsts sent to the server and log what method they used and what they want.
app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});
// This get middleware is for when the server is called just on the url
app.get("/", (req, res) => {
  // The server logs the users session token
  console.log("the session token is ", req.session);

  // We check if the user has accesed the site before
  if (req.session.isAuthenticated == true) {
    // If they are authenticated then redirect them to the next site
    res.redirect("/private/homepage.html");
  } else {
    // If not send them to the login page
    res.redirect("/LoginPage.html");
  }
});
// we now say that the client can acces the public folder otherwise the client does not send a get requst
app.use(serveStatic("public"));

// When the server recieves a post request to the server directly
app.post("/", async (req, res) => {
  // For error handling to let the user know they typped wrong
  const comp = await ComparePassword(
    poolData,
    req.body.username,
    req.body.password
  );
  console.log(req.body);
  if (comp) {
    // If the user is authenticated then the server redirects them and saves their cookie to show that they are indeed authenticated
    console.log(req.body.username + " is here");
    req.session.isAuthenticated = true;
    req.session.userName = req.body.username;
    req.session.save();
    res.redirect("/private/homepage.html");
    //If the username doesn´t exist in the database a alert will be sent
  } else if ((await GetUserIdWithName(poolData, req.body.username)) == false) {
    res.status(401).send("Invalid username");
    //If the Password doesn´t match the username in the database a alert will be sent
  } else {
    res.status(401).send("Invalid password");
  }
});

/*This is for when the user needs their userdata on the next page.
  These are stored in variables for later use*/
app.get("/sesionData", async (req, res) => {
  let userID = await GetUserIdWithName(poolData, req.session.userName);
  let userProjects = await GetUserProjects(poolData, userID);
  let UserLevel = await GetUserLevel(poolData, userID);

  const week = moment().isoWeek();
  const year = new Date().getFullYear();

  /*First the function isTimeSheetFound checks if there is an existing TimeSheet for the user
    and if there is the timesheet is stored in the variable timeSheetForUSer wich is later stored in req.session.timeSheetForUser */
  if (await IsTimeSheetFound(poolData, userID, week, year)) {
    let timeSheetForUser = await GetFilledOutTimeSheetForUser(
      poolData,
      userID,
      week,
      year
    );
    //console.log(timeSheetForUser)
    timeSheetForUser.week = week;
    timeSheetForUser.year = year;
    console.log(timeSheetForUser);
    req.session.timeSheetForUser = timeSheetForUser;
  }

  /*This for loop iterates through all the projects that the user is assigned to.
    For every project the GetProjectTasks function is used to get all the tasks for the selected project*/
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

// Route to get all the time sheets for a user for the time sheet history page
app.get("/allTimesheetsForUser", async (req, res) => {
  // Database is called to get user and time sheet data
  const userID = await GetUserIdWithName(poolData, req.session.userName);
  const timeSheetsForUser = await GetFilledOutTimeSheetsForUser(
    poolData,
    userID
  );

  console.log(timeSheetsForUser);

  // If there are any time sheets then save it in the session data
  if (timeSheetsForUser.length > 0) {
    req.session.timeSheetsForUser = timeSheetsForUser;
  }

  // The session is saved and sent to the user
  req.session.save();
  res.json(req.session);
  console.log("DatE Sent");
});

// Route to make the user logout
app.post("/userRequests", async (req, res) => {
  switch (req.body.functionName) {
    case "Logout":
      req.session.isAuthenticated = false;
      res.redirect("/LoginPage.html");
      break;
    default:
      break;
  }
});

// Route to get the current user info
app.get("/profileData", async (req, res) => {
  // Ask database for data
  let userID = await GetUserIdWithName(poolData, req.session.userName);
  let UserInfo = await GetUserInfoWithID(poolData, userID);

  // User info is saved in the session data
  req.session.userID = userID;
  req.session.eMail = UserInfo.email;
  req.session.phone = UserInfo.phone;
  console.log(req.session);
  res.json(req.session);
});

// The manager folder is made accesible to users who are managers
app.use("/manager", IsManager, serveStatic(join(__dirname, "manager")));
// The route for managerRequests is imported. "" refers to no extra route added and instead the route from manager requests is the deffinitive route
app.use("", managerRequests);

// The Project manager folder is made accesible to users who are managers
app.use(
  "/ProjectManager",
  IsProjectManager,
  serveStatic(join(__dirname, "ProjectManager"))
);
// The route for ProjectManagerRequests is imported
app.use("", ProjectManagerRequests);

// The admin folder is made accesible to users who are managers
app.use("/admin", IsAdmin, serveStatic(join(__dirname, "admin")));
// The route for adminRequests is imported
app.use("", adminRequests);

// To handle requsts from the homepage
app.get("/UserRequsts", isAuthenticated, async (req, res) => {
  console.log(req.query);

  switch (req.query.functionName) {
    case "ExportPDF":
      // The user info is gooten
      let userID3 = await GetUserIdWithName(poolData, req.session.userName);
      // All projects that are linked to the user is gotten
      let ProjectsToExport = GetUserProjects(poolData, userID3).then(
        async (projects) => {
          if (projects != false) {
            for (let i = 0; i < projects.length; i++) {
              projects[i].tasks = await GetProjectTasks(
                poolData,
                projects[i].id
              );
            }
            console.log("asdsdsdsad");
            console.log(projects);

            CreatePDFForUser(req.session.userName, projects).then((pdfPath) => {
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
          }
        }
      );
      break;

    case "ExportExcel":
      const userID = await GetUserIdWithName(poolData, req.session.userName);
      const projects = await GetUserProjects(poolData, userID);
      let projectObjects = [];
      for (let i = 0; i < projects.length; i++) {
        projectObjects.push({
          project: projects[i],
          tasksForProject: await GetProjectTasks(poolData, projects[i].id),
        });
      }
      for (let i = 0; i < projectObjects.length; i++) {
        projectObjects[i].project.projectmanager = await GetUsernameWithID(
          poolData,
          projectObjects[i].project.projectmanagerid
        );
        if (!projectObjects[i].project.projectmanager) {
          projectObjects[i].project.projectmanager =
            "No one is manager for this project";
        }
        projectObjects[i].project.totalHours = 0;
        for (let j = 0; j < projectObjects[i].tasksForProject.length; j++) {
          const totalHoursForTask = await GetTotalTimeForTask(
            poolData,
            projectObjects[i].tasksForProject[j].id
          );
          projectObjects[i].tasksForProject[j].totalHours = totalHoursForTask;
          projectObjects[i].project.totalHours += totalHoursForTask;
        }
      }
      for (let i = 0; i < projectObjects.length; i++) {
        delete projectObjects[i].project.projectmanagerid;
        delete projectObjects[i].project.id;
        for (let j = 0; j < projectObjects[i].tasksForProject.length; j++) {
          delete projectObjects[i].tasksForProject[j].id;
          delete projectObjects[i].tasksForProject[j].projectId;
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
  }
});

// Handle timesheet submition
app.post("/submitTime", isAuthenticated, async (req, res) => {
  // The data sent from the requests body is added to local variables
  const userID = req.body.userID;
  const week = req.body.week;
  const year = req.body.year;

  // The time sheet id is gotten
  const timeSheetId = await makeNewTimeSheet(poolData, userID, week, year);

  // Time sheet tasks are added
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

  res.status(200).send("Time sheet submited");
});

async function makeNewTimeSheet(poolData, userID, week, year) {
  const isThereATimeSheet = await IsTimeSheetFound(
    poolData,
    userID,
    week,
    year
  );
  let timeSheetId;
  if (isThereATimeSheet) {
    console.log("Update sheet");
    timeSheetId = await GetTimeSheetId(poolData, userID, week, year);
    await DeleteAllTaskEntryForATimeSheet(poolData, timeSheetId);
  } else {
    console.log("Make new sheet");
    timeSheetId = await CreateTimeSheet(poolData, userID, week, year);
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
