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

function makeNewTimeSheetTable(tableData, week, userName, timeSheetForUser) {
  const table = document.createElement("table");
  table.setAttribute("id", "timesheet");

  const caption = document.createElement("caption");
  caption.textContent = `Time sheet for week ${week} for ${userName}`;
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
    const select = document.createElement("select");
    select.setAttribute("name", `ProjectsDropdown${index}`);
    select.setAttribute("class", "ProjectsDropdown");
    select.setAttribute("id", `ProjectsDropdown${index}`);

    const option = document.createElement("option");
    option.textContent = "Select a project";
    select.appendChild(option);

    for (let i = 0; i < rowData[key].length; i++) {
      const option = document.createElement("option");
      option.textContent = rowData[key][i];
      if (
        rowData[key][i] === timeSheetForUser.tasks.projects[index].projectName
      ) {
        option.setAttribute("selected", "selected");
      }
      select.appendChild(option);
      cell.appendChild(select);
    }
  } else {
    cell.textContent = rowData[key];
  }
  return cell;
}

function makeTasksCell(rowData, index, timeSheetForUser, key) {
  const cell = document.createElement("td");
  if (rowData[key].length > 0) {
    const select = document.createElement("select");
    select.setAttribute("name", `TasksDropdown${index}`);
    select.setAttribute("class", "TasksDropdown");
    select.setAttribute("id", `TasksDropdown${index}`);

    const option = document.createElement("option");
    option.textContent = "Select a task";
    select.appendChild(option);

    for (let i = 0; i < rowData[key].length; i++) {
      const option = document.createElement("option");
      option.textContent = rowData[key][i].name;
      if (
        rowData[key][i].name === timeSheetForUser.tasks.projects[index].taskName
      ) {
        option.setAttribute("selected", "selected");
      }
      select.appendChild(option);
      cell.appendChild(select);
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
  input.setAttribute("oninput", "validity.valid||(value='0');");
  input.setAttribute("step", "0.5");
  input.setAttribute("min", "0");
  input.setAttribute("max", "20");
  if (rowData.projectName === "Total Hours") {
    input.setAttribute("readonly", "");
  }
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
