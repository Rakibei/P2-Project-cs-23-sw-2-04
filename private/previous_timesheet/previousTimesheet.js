
let projectsForUser;
let timeSheetsForUser;
let userName;

window.addEventListener("load", () => {
    fetch("/sesionData")
    .then((response) => response.json())
    .then((data) => {
      // Do something with session data here
      console.log(data);
      projectsForUser = data.projects;
      userName = data.userName;
      //timeSheetForUser = data.timeSheetForUser;
    });
    fetch("/allTimesheetsForUser").then((response) => response.json())
    .then((data) => {
        console.log(data);
        timeSheetsForUser = data.timeSheetsForUser;
    })
  });

document.querySelector("#formweek").addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = {
        week: event.target.week.value,
    };
    console.log(formData);
    const formDataWeek = formData.week.split("-W");
    const week = Number(formDataWeek[1]);
    const year = Number(formDataWeek[0]);

    console.log(week + " " + year);

    for (let i = 0; i < timeSheetsForUser.length; i++) {
        if(timeSheetsForUser[i].timeSheetWeek == week && timeSheetsForUser[i].timeSheetYear == year) {
            const container = document.getElementById("container");
            container.innerHTML = '';
            CreateTimeSheetTable(projectsForUser, timeSheetsForUser[i], week, year, userName);
            break;
        }
    }
});

//Object.values(form).reduce((obj,field) => { obj[field.name] = field.value; return obj }, {})

  function CreateTimeSheetTable(projects, timeSheetForUser, week, year, userName) {
    tableData = preparetableDataForTimeSheetTable(projects, timeSheetForUser);
    makeNewTimeSheetTable(tableData, week, year, userName, timeSheetForUser);
    SumOfCollum();
    SumOffTotalHoursRow();
    SumOfAbsenceHoursRow();
    if (window.outerWidth < 500) {
      hideColumns([3, 4, 5, 6, 7, 8]);
    }
  }

function preparetableDataForTimeSheetTable(projects, timeSheetForUser) {
    let meetingHours;
    let absenceHours;
    let vacationHours;
    if(!timeSheetForUser) {
        meetingHours = Array(6).fill(0);
        absenceHours = Array(6).fill(0);
        vacationHours = Array(6).fill(0);
    } else {
        meetingHours = timeSheetForUser.tasks.meeting.hours;
        absenceHours = timeSheetForUser.tasks.absence.hours;
        vacationHours = timeSheetForUser.tasks.vacation.hours;
    }
    
    const listOfPreparedTasks = prepareTasks(projects, timeSheetForUser);
  const tableData = {
    rowsOfProjects: listOfPreparedTasks.map((task) =>
      prepareProjectRow(task.projectName, task.taskName, task.hours, false)
    ),
    rowMeetings: prepareProjectRow("Metings", [], meetingHours, false),
    rowAbsence: prepareProjectRow("Absence", [], absenceHours, true),
    rowVacation: prepareProjectRow("Vacation", [], vacationHours, false),
    rowTotal: prepareProjectRow("Total Hours", [], Array(6).fill(0), true),
  };
  
  return tableData;
}

function prepareProjectRow(projectName, taskList, hoursList, totalForRow) {
  const row = {
    projectName: projectName,
    tasks: taskList,
    hours: {},
    totalForRow: totalForRow,
  };

  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  for (let i = 0; i < daysOfWeek.length; i++) {
    const day = daysOfWeek[i];
    row.hours[day] = hoursList[day] ?? 0;
  }

  return row;
}

function prepareTasks(projects, timeSheetForUser) {
    let savedTasks;
    if(!timeSheetForUser) {
        savedTasks = [];
    } else {
        savedTasks = timeSheetForUser.tasks.projects;
    }
  

  const tasks = [];
  for (const savedTask of savedTasks) {
    if (projects) {
        
      const matchingProject = projects.find((project) => 
        project.tasks.some((task) => task.id === savedTask.taskId)
      );
      if (matchingProject) {
        const matchingTask = matchingProject.tasks.find(
          (task) => task.id === savedTask.taskId
        );
        tasks.push({
          projectName: projects.map((project) => project.name),
          taskName: matchingProject.tasks,
          hours: savedTask.hours,
        });
        
      }
    }
  }
  
  return tasks;
}

function makeNewTimeSheetTable(tableData, week, year, userName, timeSheetForUser) {
  const table = document.createElement("table");
  table.setAttribute("id", "timesheet");

  const caption = document.createElement("caption");
  caption.textContent += `Time sheet for year ${year} and week ${week} for ${userName}. `;
  if(timeSheetForUser.timeSheetStatus == 1) {
    caption.textContent += `This timeSheet is submitted `;
  } else {
    caption.textContent += `This timeSheet is not submitted `;
  }

  table.appendChild(caption);

  table.appendChild(makeHeaderForTable());

  const tbody = document.createElement("tbody");

  Object.keys(tableData).forEach((rowId) => {
    const rowData = tableData[rowId];
    if (Array.isArray(rowData)) {
      rowData.forEach((projectRowData, index) => {
        const row = makeRowForTable(projectRowData, index, timeSheetForUser);
        tbody.appendChild(row);
      });
    } else {
      const row = makeRowForTable(rowData);
      tbody.appendChild(row);
    }
  });

  table.appendChild(tbody);

  document.getElementById("container").appendChild(table);
}

function makeRowForTable(rowData, index, timeSheetForUser) {
  const row = document.createElement("tr");
  // create table cells for each column
  Object.keys(rowData).forEach((key) => {
    switch (key) {
      case "projectName":
        row.appendChild(
          makeProjectNameCell(rowData, index, timeSheetForUser, key)
        );
        break;
      case "tasks":
        row.appendChild(makeTasksCell(rowData, index, timeSheetForUser, key));
        break;
      case "hours":
        let i = 0;
        for (let day in rowData[key]) {
          row.appendChild(makeDayCell(rowData, key, day, i));
          i++;
        }
        break;
      case "totalForRow":
        row.appendChild(makeTotalForRowCell(rowData, key));
        break;
      default:
        break;
    }
  });
  return row;
}

function makeProjectNameCell(rowData, index, timeSheetForUser, key) {
  const cell = document.createElement("td");
  if (Array.isArray(rowData[key])) {
    for (let i = 0; i < rowData[key].length; i++) {
      if (rowData[key][i] === timeSheetForUser.tasks.projects[index].projectName) {
        cell.textContent = timeSheetForUser.tasks.projects[index].projectName;
      }
    }
  } else {
    cell.textContent = rowData[key];
  }
  return cell;
}

function makeTasksCell(rowData, index, timeSheetForUser, key) {
  const cell = document.createElement("td");
  if (rowData[key].length > 0) {
    for (let i = 0; i < rowData[key].length; i++) {
      if (rowData[key][i].name === timeSheetForUser.tasks.projects[index].taskName) {
        cell.textContent = timeSheetForUser.tasks.projects[index].taskName;
      }
    }
  }
  return cell;
}

function makeDayCell(rowData, key, day, i) {
  const cell = document.createElement("td");
  const input = document.createElement("input");
  input.setAttribute("class", "inputfield");
  input.setAttribute("type", "number");
  input.setAttribute("placeholder", "0");
  input.setAttribute("value", rowData[key][day]);
  input.setAttribute("readonly", "");
  cell.appendChild(input);
  return cell;
}

function makeTotalForRowCell(rowData, key) {
  const cell = document.createElement("td");
  if (rowData[key] === true) {
    const input = document.createElement("input");
    input.setAttribute("class", "inputfield");
    input.setAttribute("type", "number");
    input.setAttribute("placeholder", "0");
    input.setAttribute("value", "0");
    input.setAttribute("oninput", "validity.valid||(value='0');");
    input.setAttribute("readonly", "");
    cell.appendChild(input);
  }
  return cell;
}

function makeHeaderForTable() {
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  [
    "Project",
    "Task",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
    "Total For Week",
  ].forEach((headerText) => {
    const header = document.createElement("th");
    header.textContent = headerText;
    headerRow.appendChild(header);
  });

  thead.appendChild(headerRow);
  return thead;
}







// Cells are the x axis rows are the y axis

//a function that sums up all the values of a collum and inserts the final value as the last cell in the collum
function SumOfCollum() {
    let tableID = document.getElementById("timesheet");
    let amountOfRows = tableID.rows.length;
    let amountOfCollums = tableID.rows[0].cells.length;
  
    //console.log(tableID);
  
    //console.log("The Row length is" + amountOfRows);
    //console.log("The collum length" + amountOfCollums);
    let totalCollumValue = 0;
  
    for (let i = 2; i < amountOfCollums; i++) {
      for (let j = 1; j < amountOfRows - 3; j++) {
        let input = tableID.rows[j].cells[i].querySelector(
          "input[type='number']"
        );
        if(input) {
          input.addEventListener("input", SumOfCollum);
          const value = Number(input.value);
          if (!isNaN(value)) {
            totalCollumValue += value;
          }
        }
      }
  
      tableID.rows[amountOfRows - 1].cells[i].querySelector(
        "input[type='number']"
      ).value = totalCollumValue;
      totalCollumValue = 0;
    }
    SumOffTotalHoursRow();
    SumOfAbsenceHoursRow();
  }
  
  function SumOffTotalHoursRow() {
    let table = document.getElementById("timesheet");
    let totalrows = table.rows.length;
    let rowlength =
      document.getElementById("timesheet").rows[totalrows - 1].cells.length;
    //console.log("se her idiot" + totalrows);
    //console.log("rowlength=" + rowlength);
    let Totalhourssum = 0;
  
    for (i = 2; i < rowlength - 1; i++) {
      const input =
        table.rows[totalrows - 1].cells[i].querySelector("input[type=number");
      const value = Number(input.value);
  
      if (!isNaN(value)) {
        Totalhourssum += value;
      }
    }
  
    table.rows[totalrows - 1].cells[rowlength - 1].querySelector(
      "input[type='number']"
    ).value = Totalhourssum;
    Totalhourssum = 0;
  }
  
  function SumOfAbsenceHoursRow() {
    let table = document.getElementById("timesheet");
    let totalrows = table.rows.length;
    let rowlength =
      document.getElementById("timesheet").rows[totalrows - 1].cells.length;
  
    let totalRowValue = 0;
    for (i = 2; i < rowlength - 1; i++) {
      const input =
        table.rows[totalrows - 3].cells[i].querySelector("input[type=number");
      const value = Number(input.value);
      let cell = table.rows[totalrows - 3].cells[i];
      cell.addEventListener("input", SumOfAbsenceHoursRow);
  
      if (!isNaN(value)) {
        totalRowValue += value;
      }
    }
  
    table.rows[totalrows - 3].cells[rowlength - 1].querySelector(
      "input[type='number']"
    ).value = totalRowValue;
    totalRowValue = 0;
  }

// Start of swipe effect
let touchstartX = 0;
let touchendX = 0;

function checkSwipe() {
  //console.log("detter er tocuhstart" + touchstartX);
  //console.log("detter er touchend" + touchendX);
  //console.log(touchendX - touchstartX);
  if (touchendX - touchstartX > 60) {
    if (currentday == 0) {
      return;
    } else {
      currentday--;
      //console.log(currentday);
      let columns = Object.values(array_of_weekdayfunctions[currentday])[0];
      //console.log(columns);
      showAllColumns();
      hideColumns(columns);
    }
  }

  if (touchendX - touchstartX < -60) {
    if (currentday == lastday) {
      return;
    } else {
      currentday++;
      //console.log(currentday);

      let columns = Object.values(array_of_weekdayfunctions[currentday])[0];
      console.log(columns);
      showAllColumns();
      hideColumns(columns);
    }
  }
}

var area = document.getElementById("timesheetcontainer");

area.addEventListener("touchstart", (e) => {
  touchstartX = e.changedTouches[0].screenX;
});

area.addEventListener("touchend", (e) => {
  touchendX = e.changedTouches[0].screenX;
  checkSwipe();
});
