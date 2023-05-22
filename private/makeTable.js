function preparetableDataForTimeSheetTable(projects, timeSheetForUser) {
  let meetingHours;
  let absenceHours;
  let vacationHours;

  // Check if timeSheetForUser is undefined or null
  if (!timeSheetForUser) {
    // If it is, initialize meetingHours, absenceHours, and vacationHours with arrays of 0 values for each day of the week (6 days)
    meetingHours = Array(6).fill(0);
    absenceHours = Array(6).fill(0);
    vacationHours = Array(6).fill(0);
  } else {
    // If timeSheetForUser is defined, assign the corresponding hours arrays
    meetingHours = timeSheetForUser.tasks.meeting.hours;
    absenceHours = timeSheetForUser.tasks.absence.hours;
    vacationHours = timeSheetForUser.tasks.vacation.hours;
  }

  // Call prepareTasks function to get the list of prepared tasks
  const listOfPreparedTasks = prepareTasks(projects, timeSheetForUser);

  // Prepare the table data object
  const tableData = {
    // Prepare rows of projects based on the prepared tasks
    rowsOfProjects: listOfPreparedTasks.map((task) =>
      prepareProjectRow(task.projectName, task.taskName, task.hours, false)
    ),
    // Prepare row for meetings with meetingHours
    rowMeetings: prepareProjectRow("Meetings", [], meetingHours, false),
    // Prepare row for absence with absenceHours
    rowAbsence: prepareProjectRow("Absence", [], absenceHours, true),
    // Prepare row for vacation with vacationHours
    rowVacation: prepareProjectRow("Vacation", [], vacationHours, false),
    // Prepare row for total hours with an empty hours array of 0 values for each day of the week (6 days)
    rowTotal: prepareProjectRow("Total Hours", [], Array(6).fill(0), true),
  };

  return tableData;
}

function prepareProjectRow(projectName, taskList, hoursList, totalForRow) {
  // Create a row object with the provided project name, task list, hours object, and a flag indicating if it's a total row
  const row = {
    projectName: projectName,
    tasks: taskList,
    hours: {},
    totalForRow: totalForRow,
  };

  // Define the days of the week
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // Assign hours from the hoursList array to the corresponding day of the week in the row's hours object
  for (let i = 0; i < daysOfWeek.length; i++) {
    const day = daysOfWeek[i];
    // If the hoursList doesn't have a value for the day, assign 0 as the default value
    row.hours[day] = hoursList[day] ?? 0;
  }

  return row;
}

function prepareTasks(projects, timeSheetForUser) {
  let savedTasks;

  // Check if timeSheetForUser is undefined or null
  if (!timeSheetForUser) {
    // If it is, initialize savedTasks as an empty array
    savedTasks = [];
  } else {
    // If timeSheetForUser is defined, assign the projects array from timeSheetForUser tasks
    savedTasks = timeSheetForUser.tasks.projects;
  }

  const tasks = [];
  for (const savedTask of savedTasks) {
    if (projects) {
      // Find the matching project based on the savedTask's taskId
      const matchingProject = projects.find((project) =>
        project.tasks.some((task) => task.id === savedTask.taskId)
      );

      if (matchingProject) {
        // Find the matching task within the matching project
        const matchingTask = matchingProject.tasks.find(
          (task) => task.id === savedTask.taskId
        );

        tasks.push({
          projectName: matchingProject.name,
          taskName: matchingTask.name,
          hours: savedTask.hours,
        });
      }
    }
  }

  return tasks;
}

function makeNewTimeSheetTable(tableData, week, userName, timeSheetForUser) {
  // Create a new table element
  const table = document.createElement("table");
  table.setAttribute("id", "timesheet");

  // Create a caption element and set its text content
  const caption = document.createElement("caption");
  caption.textContent = `Time sheet for week ${week} for ${userName}`;

  // Append the caption to the table
  table.appendChild(caption);

  // Create the table header using the makeHeaderForTable() function
  table.appendChild(makeHeaderForTable());

  // Create a tbody element
  const tbody = document.createElement("tbody");

  // Iterate over the keys of tableData object
  Object.keys(tableData).forEach((rowId) => {
    const rowData = tableData[rowId];

    // Check if rowData is an array (for multiple rows)
    if (Array.isArray(rowData)) {
      rowData.forEach((projectRowData, index) => {
        // Create a row using the makeRowForTable() function
        const row = makeRowForTable(projectRowData, index, timeSheetForUser);

        // Append the row to the tbody
        tbody.appendChild(row);
      });
    } else {
      // Create a row using the makeRowForTable() function
      const row = makeRowForTable(rowData);

      // Append the row to the tbody
      tbody.appendChild(row);
    }
  });

  // Append the tbody to the table
  table.appendChild(tbody);

  // Append the table to an element with the id "container" in the document
  document.getElementById("container").appendChild(table);
}

function makeRowForTable(rowData, index, timeSheetForUser) {
  // Create a new table row element
  const row = document.createElement("tr");

  // Iterate over the keys in the rowData object
  Object.keys(rowData).forEach((key) => {
    switch (key) {
      case "projectName":
        // Create and append the project name cell to the row
        row.appendChild(
          makeProjectNameCell(rowData, index, timeSheetForUser, key)
        );
        break;
      case "tasks":
        // Create and append the tasks cell to the row
        row.appendChild(makeTasksCell(rowData, index, timeSheetForUser, key));
        break;
      case "hours":
        let i = 0;
        // Iterate over the days in the rowData.hours object
        for (let day in rowData[key]) {
          // Create and append the day cell to the row
          row.appendChild(makeDayCell(rowData, key, day, i));
          i++;
        }
        break;
      case "totalForRow":
        // Create and append the total for row cell to the row
        row.appendChild(makeTotalForRowCell(rowData, key));
        break;
      default:
        // Ignore other keys
        break;
    }
  });

  // Return the created row
  return row;
}

function makeProjectNameCell(rowData, index, timeSheetForUser, key) {
  // Create a new table cell element
  const cell = document.createElement("td");

  // Check if the value of rowData[key] is an array
  if (Array.isArray(rowData[key])) {
    // Create a select element
    const select = document.createElement("select");
    select.setAttribute("name", `ProjectsDropdown${index}`);
    select.setAttribute("class", "ProjectsDropdown");
    select.setAttribute("id", `ProjectsDropdown${index}`);

    // Create an option element for the default "Select a project" option
    const option = document.createElement("option");
    option.textContent = "Select a project";
    select.appendChild(option);

    // Iterate over the elements of rowData[key] array
    for (let i = 0; i < rowData[key].length; i++) {
      // Create an option element for each project name
      const option = document.createElement("option");
      option.textContent = rowData[key][i];

      // Check if the current project name matches the selected project in timeSheetForUser
      if (rowData[key][i] === timeSheetForUser.tasks.projects[index].projectName) {
        option.setAttribute("selected", "selected");
      }

      // Append the option element to the select element
      select.appendChild(option);
      
      // Append the select element to the table cell
      cell.appendChild(select);
    }
  } else {
    // If the value of rowData[key] is not an array, set the text content of the cell to rowData[key]
    cell.textContent = rowData[key];
  }
  
  // Return the created table cell
  return cell;
}

function makeTasksCell(rowData, index, timeSheetForUser, key) {
  // Create a new table cell element
  const cell = document.createElement("td");

  // Check if the rowData[key] array has elements
  if (rowData[key].length > 0) {
    // Create a new select element
    const select = document.createElement("select");
    select.setAttribute("name", `TasksDropdown${index}`);
    select.setAttribute("class", "TasksDropdown");
    select.setAttribute("id", `TasksDropdown${index}`);

    // Create a default option and append it to the select element
    const option = document.createElement("option");
    option.textContent = "Select a task";
    select.appendChild(option);

    // Iterate over the rowData[key] array
    for (let i = 0; i < rowData[key].length; i++) {
      // Create an option element for each task
      const option = document.createElement("option");
      option.textContent = rowData[key][i].name;

      // Check if the task name matches the selected taskName from timeSheetForUser
      if (rowData[key][i].name === timeSheetForUser.tasks.projects[index].taskName) {
        option.setAttribute("selected", "selected");
      }

      // Append the option to the select element
      select.appendChild(option);
      
      // Append the select element to the cell
      cell.appendChild(select);
    }
  }

  // Return the created cell
  return cell;
}

function makeDayCell(rowData, key, day, i) {
  // Create a table cell element
  const cell = document.createElement("td");

  // Create an input element
  const input = document.createElement("input");

  // Set attributes for the input element
  input.setAttribute("class", "inputfield");
  input.setAttribute("type", "number");
  input.setAttribute("placeholder", "0");
  input.setAttribute("value", rowData[key][day]);
  input.setAttribute("oninput", "validity.valid||(value='0');");
  input.setAttribute("step", "0.5");
  input.setAttribute("min", "0");
  input.setAttribute("max", "20");

  // If the rowData's projectName is "Total Hours", make the input readonly
  if (rowData.projectName === "Total Hours") {
    input.setAttribute("readonly", "");
  }

  // Append the input element to the table cell
  cell.appendChild(input);

  // Return the created table cell
  return cell;
}

function makeTotalForRowCell(rowData, key) {
  // Create a new <td> element
  const cell = document.createElement("td");

  // Check if the value of the specified key in the rowData object is true
  if (rowData[key] === true) {
    // If the condition is true, create an <input> element
    const input = document.createElement("input");

    // Set the attributes for the input element
    input.setAttribute("class", "inputfield");
    input.setAttribute("type", "number");
    input.setAttribute("placeholder", "0");
    input.setAttribute("value", "0");
    input.setAttribute("oninput", "validity.valid||(value='0');");
    input.setAttribute("readonly", "");

    // Append the input element to the cell
    cell.appendChild(input);
  }

  // Return the created cell
  return cell;
}

function makeHeaderForTable() {
  // Create the <thead> element
  const thead = document.createElement("thead");

  // Create a row for the table header
  const headerRow = document.createElement("tr");

  // Define an array of header texts
  const headerTexts = [
    "Project",
    "Task",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
    "Total",
  ];

  // Iterate over each header text
  headerTexts.forEach((headerText) => {
    // Create a <th> element for the header
    const header = document.createElement("th");

    // Set the text content of the header to the current header text
    header.textContent = headerText;

    // Append the header to the header row
    headerRow.appendChild(header);
  });

  // Append the header row to the <thead> element
  thead.appendChild(headerRow);

  // Return the created <thead> element
  return thead;
}
