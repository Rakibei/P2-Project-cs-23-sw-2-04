let userName;
let userID;

function getTimeSheetData() {
  let timeSheet = {
    week: 0,
    userName: "",
    userID: 0,
    year: 0,
    vacation: {
      days: {
        mondayHours: 0,
        tuesdayHours: 0,
        wednesdayHours: 0,
        thursdayHours: 0,
        fridayHours: 0,
        saturdayHours: 0,
        sundayHours: 0,
      },
    },
    absence: {
      days: {
        mondayHours: 0,
        tuesdayHours: 0,
        wednesdayHours: 0,
        thursdayHours: 0,
        fridayHours: 0,
        saturdayHours: 0,
        sundayHours: 0,
      },
    },
    meeting: {
      days: {
        mondayHours: 0,
        tuesdayHours: 0,
        wednesdayHours: 0,
        thursdayHours: 0,
        fridayHours: 0,
        saturdayHours: 0,
        sundayHours: 0,
      },
    },
    projects: {},
  };

  let table = document.getElementById("timesheet");
  let rowLength = table.rows.length;
  //let columnLength = table.rows[0].cells.length;

  timeSheet.week = Math.ceil(
    
    Math.floor(
      
      (new Date() - new Date(new Date().getFullYear(), 0, 1)) /
       
        (24 * 60 * 60 * 1000)
    
    ) / 7
  
  );
  timeSheet.userName = userName;
  timeSheet.userID = userID;
  timeSheet.year = new Date().getFullYear();

  //collectMeetingData(timeSheet, table, rowLength);
  collectTableData(timeSheet.meeting, table, rowLength - 4);
  collectTableData(timeSheet.absence, table, rowLength - 3);
  collectTableData(timeSheet.vacation, table, rowLength - 2);
  collectProjectData(timeSheet, table, rowLength);

  return timeSheet;
}

function collectTableData(timeSheetTaskSection, table, rowFromTable) {
  let i = 2;
  for (const day in timeSheetTaskSection.days) {
    let input =
      table.rows[rowFromTable].cells[i].querySelector("input[type=number]");
    let value = Number(input.value);
    if (!isNaN(value)) {
      timeSheetTaskSection.days[day] = value;
    }
    i++;
  }
}

function collectProjectData(timeSheet, table, rowLength) {
  for (let i = rowLength - 5; i > 0; i--) {
    //read rows of projects
    let selectProject = table.rows[i].cells[0].querySelector("select");
    let selectTask = table.rows[i].cells[1].querySelector("select");
    //if project is not selected it will be skip
    if (selectProject.value == "Default" || selectTask.value == "" || selectProject.value == "Select a project") {
      continue;
    }

    if (!timeSheet.projects.hasOwnProperty(selectProject.value)) {
      timeSheet.projects[selectProject.value] = {};
    }

    if (
      !timeSheet.projects[selectProject.value].hasOwnProperty(selectTask.value)
    ) {
      timeSheet.projects[selectProject.value][selectTask.value] = {
        taskName: "",
        taskId: 0,
        days: {
          mondayHours: 0,
          tuesdayHours: 0,
          wednesdayHours: 0,
          thursdayHours: 0,
          fridayHours: 0,
          saturdayHours: 0,
          sundayHours: 0,
        },
      };
    }

    //get task id

    timeSheet.projects[selectProject.value][selectTask.value].taskName = [
      selectTask.value,
    ];
    targetProjectWithTasks = [projects][0].find(
      (item) => item.name === [selectProject.value][0]
    ).tasks;
    targetTask = targetProjectWithTasks.find(
      (item) =>
        item.name ===
        timeSheet.projects[selectProject.value][selectTask.value].taskName[0]
    );
    timeSheet.projects[selectProject.value][selectTask.value].taskId =
      targetTask.id;

    timeSheet.projects[selectProject.value][selectTask.value].taskName = [
      selectTask.value,
    ];
    targetProjectWithTasks = [projects][0].find(
      (item) => item.name === [selectProject.value][0]
    ).tasks;
    targetTask = targetProjectWithTasks.find(
      (item) =>
        item.name ===
        timeSheet.projects[selectProject.value][selectTask.value].taskName[0]
    );
    timeSheet.projects[selectProject.value][selectTask.value].taskId =
      targetTask.id;

    collectTableData(
      timeSheet.projects[selectProject.value][selectTask.value],
      table,
      i
    );
  }
}

document
  .querySelector("#timeSheetButton")
  .addEventListener("click", (event) => {
    let timeSheet = getTimeSheetData();

    fetch("http://127.0.0.1:3000/submitTime", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(timeSheet),
    })
      .then((response) => {})
      .catch((error) => console.error(error));
  });

