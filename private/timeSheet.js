function getTimeSheetData() {
  let timeSheet = {
    week: 0,
    userName: "",
    userId: 0,
    year: 0,
    vacation: {
      mondayHours: 0,
      tuesdayHours: 0,
      wednesdayHours: 0,
      thursdayHours: 0,
      fridayHours: 0,
      saturdayHours: 0,
      sundayHours: 0,
    },
    absence: {
      mondayHours: 0,
      tuesdayHours: 0,
      wednesdayHours: 0,
      thursdayHours: 0,
      fridayHours: 0,
      saturdayHours: 0,
      sundayHours: 0,
    },
    meeting: {
      mondayHours: 0,
      tuesdayHours: 0,
      wednesdayHours: 0,
      thursdayHours: 0,
      fridayHours: 0,
      saturdayHours: 0,
      sundayHours: 0,
    },
    projects: {},
  };

  let table = document.getElementById("timesheet");
  let rowLength = table.rows.length;
  let columnLength = table.rows[0].cells.length;

  timeSheet.week = Math.ceil(Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000)) / 7);
  timeSheet.userName = userName;
  timeSheet.userId = userId;
  timeSheet.year = new Date().getFullYear();

  collectMeetingData(timeSheet, table, rowLength);
  collectAbsenceData(timeSheet, table, rowLength);
  collectVacationData(timeSheet, table, rowLength);
  collectProjectData(timeSheet, table, rowLength);

  return timeSheet;
}

function collectVacationData(timeSheet, table, rowLength) {
  let i = 2;
  for (const day in timeSheet.vacation) {
    let input =
      table.rows[rowLength - 2].cells[i].querySelector("input[type=number]");
    let value = Number(input.value);
    if (!isNaN(value)) {
      timeSheet.vacation[day] = value;
    }
    i++;
  }
}

function collectAbsenceData(timeSheet, table, rowLength) {
  let i = 2;
  for (const day in timeSheet.absence) {
    let input =
      table.rows[rowLength - 3].cells[i].querySelector("input[type=number]");
    let value = Number(input.value);
    if (!isNaN(value)) {
      timeSheet.absence[day] = value;
    }
    i++;
  }
}

function collectMeetingData(timeSheet, table, rowLength) {
  let i = 2;
  for (const day in timeSheet.meeting) {
    let input =
      table.rows[rowLength - 1].cells[i].querySelector("input[type=number]");
    let value = Number(input.value);
    if (!isNaN(value)) {
      timeSheet.meeting[day] = value;
    }
    i++;
  }
}

function collectProjectData(timeSheet, table, rowLength) {
  for (let i = rowLength - 5; i > 0; i--) {
    let selectProject = table.rows[i].cells[0].querySelector("select");
    let selectTask = table.rows[i].cells[1].querySelector("select");

    if (selectProject.value == "Default" || selectTask.value == "") {
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
    

    timeSheet.projects[selectProject.value][selectTask.value].taskName = [selectTask.value];
    targetProjectWithTasks = [projects][0].find((item) => item.name === [selectProject.value][0]).tasks;
    targetTask = targetProjectWithTasks.find(item => item.name === timeSheet.projects[selectProject.value][selectTask.value].taskName[0]);
    timeSheet.projects[selectProject.value][selectTask.value].taskId = targetTask.id;

    let j = 2;
    for (const day in timeSheet.projects[selectProject.value][selectTask.value]
      .days) {
      let input = table.rows[i].cells[j].querySelector("input[type=number]");
      let value = Number(input.value);
      if (!isNaN(value)) {
        timeSheet.projects[selectProject.value][selectTask.value].days[day] =
          value;
      }
      j++;
    }
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
