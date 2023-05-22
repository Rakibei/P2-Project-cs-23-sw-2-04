
let projectsForUser;
let timeSheetsForUser;
let userName;

window.addEventListener("load", () => {
  // Fetch session data from "/sesionData" endpoint
  fetch("/sesionData")
    .then((response) => response.json())
    .then((data) => {
      // Log the received session data
      console.log(data);
      
      // Assign the projects and userName from the data object to variables
      projectsForUser = data.projects;
      userName = data.userName;
    });
  
  // Fetch time sheets for the user from "/allTimesheetsForUser" endpoint
  fetch("/allTimesheetsForUser")
    .then((response) => response.json())
    .then((data) => {
      // Log the received time sheets data
      console.log(data);

      // Assign the timeSheetsForUser from the data object to a variable
      timeSheetsForUser = data.timeSheetsForUser;
    });
});

document.querySelector("#formweek").addEventListener('submit', (event) => {
  event.preventDefault(); // Prevents the default form submission behavior

  // Extract the week value from the form input
  const formData = {
    week: event.target.week.value,
  };

  console.log(formData);

  // Split the week value into week and year components
  const formDataWeek = formData.week.split("-W");
  const week = Number(formDataWeek[1]);
  const year = Number(formDataWeek[0]);

  console.log(week + " " + year);

  // Iterate over timeSheetsForUser array to find a matching time sheet for the given week and year
  for (let i = 0; i < timeSheetsForUser.length; i++) {
    if(timeSheetsForUser[i].timeSheetWeek == week && timeSheetsForUser[i].timeSheetYear == year) {
      // Clear the content of the container element
      const container = document.getElementById("container");
      container.innerHTML = '';

      // Create a time sheet table using the matching projects, time sheet data, week, year, and userName
      CreateTimeSheetTable(projectsForUser, timeSheetsForUser[i], week, year, userName);
      break; // Exit the loop once a match is found
    }
  }
});

function CreateTimeSheetTable(projects, timeSheetForUser, week, year, userName) {
  // Prepare the table data for the time sheet table
  tableData = preparetableDataForTimeSheetTable(projects, timeSheetForUser);
  // Create a new time sheet table using the prepared table data, week, year, userName, and timeSheetForUser
  makeNewTimeSheetTable(tableData, week, year, userName, timeSheetForUser);
  // Calculate the sum of each column in the time sheet table
  SumOfCollum();
  // Calculate the sum of total hours row in the time sheet table
  SumOffTotalHoursRow();
  // Calculate the sum of absence hours row in the time sheet table
  SumOfAbsenceHoursRow();
  // Check if the outer width of the window is less than 500 pixels
  if (window.outerWidth < 500) {
    // Hide specific columns in the time sheet table
    hideColumns([3, 4, 5, 6, 7, 8]);
  }
}

function preparetableDataForTimeSheetTable(projects, timeSheetForUser) {
  let meetingHours;
  let absenceHours;
  let vacationHours;
  
  // Check if timeSheetForUser is undefined or null
  if (!timeSheetForUser) {
    // If undefined or null, initialize meetingHours, absenceHours, and vacationHours with arrays of zeros
    meetingHours = Array(6).fill(0);
    absenceHours = Array(6).fill(0);
    vacationHours = Array(6).fill(0);
  } else {
    // If timeSheetForUser exists, assign the corresponding task hours to meetingHours, absenceHours, and vacationHours
    meetingHours = timeSheetForUser.tasks.meeting.hours;
    absenceHours = timeSheetForUser.tasks.absence.hours;
    vacationHours = timeSheetForUser.tasks.vacation.hours;
  }

  // Call the prepareTasks function to get a list of prepared tasks based on projects and timeSheetForUser
  const listOfPreparedTasks = prepareTasks(projects, timeSheetForUser);
  
  // Create an object to store the table data
  const tableData = {
    rowsOfProjects: listOfPreparedTasks.map((task) =>
      prepareProjectRow(task.projectName, task.taskName, task.hours, false)
    ),
    rowMeetings: prepareProjectRow("Meetings", [], meetingHours, false),
    rowAbsence: prepareProjectRow("Absence", [], absenceHours, true),
    rowVacation: prepareProjectRow("Vacation", [], vacationHours, false),
    rowTotal: prepareProjectRow("Total Hours", [], Array(6).fill(0), true),
  };
  
  return tableData;
}

function prepareProjectRow(projectName, taskList, hoursList, totalForRow) {
  // Create an object to store the row data
  const row = {
    projectName: projectName,
    tasks: taskList,
    hours: {},
    totalForRow: totalForRow,
  };

  // Define an array of days of the week
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // Iterate over the daysOfWeek array
  for (let i = 0; i < daysOfWeek.length; i++) {
    const day = daysOfWeek[i];

    // Assign the hours value from the hoursList to the corresponding day in the row.hours object
    // If the hoursList doesn't have a value for the day, assign 0 as the default value
    row.hours[day] = hoursList[day] ?? 0;
  }

  // Return the prepared row object
  return row;
}

function prepareTasks(projects, timeSheetForUser) {
  let savedTasks;

  // Check if timeSheetForUser is falsy (null, undefined, etc.)
  if (!timeSheetForUser) {
    savedTasks = [];
  } else {
    savedTasks = timeSheetForUser.tasks.projects;
  }

  const tasks = [];

  // Iterate over each saved task
  for (const savedTask of savedTasks) {
    if (projects) {
      // Find the matching project that contains the saved task
      const matchingProject = projects.find((project) =>
        project.tasks.some((task) => task.id === savedTask.taskId)
      );

      if (matchingProject) {
        // Find the matching task within the matching project
        const matchingTask = matchingProject.tasks.find(
          (task) => task.id === savedTask.taskId
        );

        // Push an object with project name, task name, and hours to the tasks array
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

function makeNewTimeSheetTable(tableData, week, year, userName, timeSheetForUser) {
  // Create a new <table> element
  const table = document.createElement("table");
  table.setAttribute("id", "timesheet");

  // Create a <caption> element for the table
  const caption = document.createElement("caption");
  caption.textContent += `Time sheet for year ${year} and week ${week} for ${userName}. `;

  // Check the timeSheetStatus and add appropriate caption text
  if (timeSheetForUser.timeSheetStatus == 1) {
    caption.textContent += `This timeSheet is submitted `;
  } else {
    caption.textContent += `This timeSheet is not submitted `;
  }

  // Append the caption to the table
  table.appendChild(caption);

  // Create the table header using the makeHeaderForTable function
  table.appendChild(makeHeaderForTable());

  // Create a <tbody> element for the table body
  const tbody = document.createElement("tbody");

  // Iterate over the tableData object
  Object.keys(tableData).forEach((rowId) => {
    const rowData = tableData[rowId];
    if (Array.isArray(rowData)) {
      // If the rowData is an array, iterate over it
      rowData.forEach((projectRowData, index) => {
        const row = makeRowForTable(projectRowData, index, timeSheetForUser);
        tbody.appendChild(row);
      });
    } else {
      // If the rowData is not an array, create a single row
      const row = makeRowForTable(rowData);
      tbody.appendChild(row);
    }
  });

  // Append the tbody to the table
  table.appendChild(tbody);

  // Append the table to the "container" element
  document.getElementById("container").appendChild(table);
}

function makeRowForTable(rowData, index, timeSheetForUser) {
  const row = document.createElement("tr"); // Create a <tr> element

  // Create table cells for each column
  Object.keys(rowData).forEach((key) => {
    switch (key) {
      case "projectName":
        // Create a cell for the "projectName" column and append it to the row
        row.appendChild(makeProjectNameCell(rowData, index, timeSheetForUser, key));
        break;
      case "tasks":
        // Create a cell for the "tasks" column and append it to the row
        row.appendChild(makeTasksCell(rowData, index, timeSheetForUser, key));
        break;
      case "hours":
        let i = 0;
        // Iterate over the days in the "hours" column
        for (let day in rowData[key]) {
          // Create a cell for each day and append it to the row
          row.appendChild(makeDayCell(rowData, key, day, i));
          i++;
        }
        break;
      case "totalForRow":
        // Create a cell for the "totalForRow" column and append it to the row
        row.appendChild(makeTotalForRowCell(rowData, key));
        break;
      default:
        break;
    }
  });

  return row; // Return the created row
}

function makeProjectNameCell(rowData, index, timeSheetForUser, key) {
  // Create a new table cell element
  const cell = document.createElement("td");

  // Check if the value of the specified key in rowData is an array
  if (Array.isArray(rowData[key])) {
    // Iterate over the elements in the array
    for (let i = 0; i < rowData[key].length; i++) {
      // Check if the current element matches the project name at the specified index
      if (rowData[key][i] === timeSheetForUser.tasks.projects[index].projectName) {
        // Set the cell's text content to the matched project name
        cell.textContent = timeSheetForUser.tasks.projects[index].projectName;
      }
    }
  } else {
    // If the value of the specified key is not an array, set the cell's text content to the value
    cell.textContent = rowData[key];
  }

  // Return the created cell
  return cell;
}

function makeTasksCell(rowData, index, timeSheetForUser, key) {
  // Create a new table cell element
  const cell = document.createElement("td");

  // Check if the rowData has an array at the specified key and it has elements
  if (rowData[key].length > 0) {
    // Iterate over the elements in the rowData array
    for (let i = 0; i < rowData[key].length; i++) {
      // Check if the name of the current element matches the task name at the specified index
      if (rowData[key][i].name === timeSheetForUser.tasks.projects[index].taskName) {
        // Set the text content of the cell to the matching task name
        cell.textContent = timeSheetForUser.tasks.projects[index].taskName;
      }
    }
  }

  // Return the created table cell element
  return cell;
}

function makeDayCell(rowData, key, day, i) {
  // Create a new table cell element
  const cell = document.createElement("td");

  // Create an input element
  const input = document.createElement("input");

  // Set the class attribute of the input element to "inputfield"
  input.setAttribute("class", "inputfield");

  // Set the type attribute of the input element to "number"
  input.setAttribute("type", "number");

  // Set the placeholder attribute of the input element to "0"
  input.setAttribute("placeholder", "0");

  // Set the value attribute of the input element to the corresponding value from the rowData object
  input.setAttribute("value", rowData[key][day]);

  // Set the readonly attribute of the input element to make it read-only
  input.setAttribute("readonly", "");

  // Append the input element to the cell
  cell.appendChild(input);

  // Return the created cell
  return cell;
}

function makeTotalForRowCell(rowData, key) {
  // Create a new table cell element
  const cell = document.createElement("td");

  // Check if the value of the specified key in the rowData object is true
  if (rowData[key] === true) {
    // Create an input element
    const input = document.createElement("input");

    // Set attributes for the input element
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

  // Create the header row <tr> element
  const headerRow = document.createElement("tr");

  // An array of header texts
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
    "Total For Week",
  ];

  // Iterate over the header texts array
  headerTexts.forEach((headerText) => {
    // Create a <th> element for each header text
    const header = document.createElement("th");
    header.textContent = headerText;

    // Append the header to the header row
    headerRow.appendChild(header);
  });

  // Append the header row to the <thead> element
  thead.appendChild(headerRow);

  // Return the <thead> element
  return thead;
}







// Cells are the x axis rows are the y axis

//a function that sums up all the values of a collum and inserts the final value as the last cell in the collum
function SumOfCollum() {
  // Get the table element by its ID
  let tableID = document.getElementById("timesheet");

  // Get the number of rows and columns in the table
  let amountOfRows = tableID.rows.length;
  let amountOfCollums = tableID.rows[0].cells.length;

  let totalCollumValue = 0;

  // Iterate over the columns starting from the third column (index 2)
  for (let i = 2; i < amountOfCollums; i++) {
    // Iterate over the rows, excluding the header row (index 0) and the last three rows
    for (let j = 1; j < amountOfRows - 3; j++) {
      // Get the input element within the current cell
      let input = tableID.rows[j].cells[i].querySelector("input[type='number']");

      if (input) {
        // Add an input event listener to the input element, recursively calling SumOfCollum()
        input.addEventListener("input", SumOfCollum);

        // Get the numeric value from the input element
        const value = Number(input.value);

        // If the value is a valid number, add it to the total column value
        if (!isNaN(value)) {
          totalCollumValue += value;
        }
      }
    }

    // Set the value of the last cell in the current column (row: amountOfRows - 1) to the total column value
    tableID.rows[amountOfRows - 1].cells[i].querySelector("input[type='number']").value = totalCollumValue;

    // Reset the total column value for the next column
    totalCollumValue = 0;
  }

  // Call SumOffTotalHoursRow() and SumOfAbsenceHoursRow() functions
  SumOffTotalHoursRow();
  SumOfAbsenceHoursRow();
}
  
function SumOffTotalHoursRow() {
  // Get a reference to the timesheet table element
  let table = document.getElementById("timesheet");

  // Get the total number of rows in the timesheet table
  let totalrows = table.rows.length;

  // Get the number of cells in the last row of the timesheet table
  let rowlength = document.getElementById("timesheet").rows[totalrows - 1].cells.length;

  // Initialize the variable to store the sum of total hours
  let Totalhourssum = 0;

  // Iterate over the cells in the last row (excluding the first and last cell)
  for (i = 2; i < rowlength - 1; i++) {
    // Get the input element with type 'number' in the current cell
    const input = table.rows[totalrows - 1].cells[i].querySelector("input[type=number]");

    // Get the numeric value of the input
    const value = Number(input.value);

    // Check if the value is a valid number
    if (!isNaN(value)) {
      // Add the value to the total sum
      Totalhourssum += value;
    }
  }

  // Set the value of the input in the last cell of the last row to the total sum
  table.rows[totalrows - 1].cells[rowlength - 1].querySelector("input[type='number']").value = Totalhourssum;

  // Reset the total sum to 0 for future calculations
  Totalhourssum = 0;
}
  
function SumOfAbsenceHoursRow() {
  // Get reference to the timesheet table
  let table = document.getElementById("timesheet");

  // Get the total number of rows and the length of the last row
  let totalrows = table.rows.length;
  let rowlength = document.getElementById("timesheet").rows[totalrows - 1].cells.length;

  // Initialize a variable to store the total row value
  let totalRowValue = 0;

  // Iterate over the cells starting from the third cell (index 2) up to the second-to-last cell
  for (let i = 2; i < rowlength - 1; i++) {
    // Get the input element within the current cell
    const input = table.rows[totalrows - 3].cells[i].querySelector("input[type=number]");

    // Get the numerical value of the input
    const value = Number(input.value);

    // Get a reference to the current cell
    let cell = table.rows[totalrows - 3].cells[i];

    // Add an "input" event listener to the current cell, recursively calling the SumOfAbsenceHoursRow function
    cell.addEventListener("input", SumOfAbsenceHoursRow);

    // Check if the value is a valid number
    if (!isNaN(value)) {
      // Add the value to the totalRowValue
      totalRowValue += value;
    }
  }

  // Set the value of the last cell in the total row to the totalRowValue
  table.rows[totalrows - 3].cells[rowlength - 1].querySelector("input[type='number']").value = totalRowValue;

  // Reset the totalRowValue to 0
  totalRowValue = 0;
}

// Start of swipe effect
let touchstartX = 0;
let touchendX = 0;

function checkSwipe() {
  // Check if the horizontal swipe distance is greater than 60
  if (touchendX - touchstartX > 60) {
    // Check if the current day is the first day (0 index)
    if (currentday == 0) {
      return; // Return early if it is the first day
    } else {
      // Decrement the current day
      currentday--;

      // Get the columns to hide based on the current day
      let columns = Object.values(array_of_weekdayfunctions[currentday])[0];

      // Show all columns
      showAllColumns();

      // Hide the columns based on the current day
      hideColumns(columns);
    }
  }

  // Check if the horizontal swipe distance is less than -60
  if (touchendX - touchstartX < -60) {
    // Check if the current day is the last day
    if (currentday == lastday) {
      return; // Return early if it is the last day
    } else {
      // Increment the current day
      currentday++;

      // Get the columns to hide based on the current day
      let columns = Object.values(array_of_weekdayfunctions[currentday])[0];
      
      console.log(columns); // Output the columns to the console

      // Show all columns
      showAllColumns();

      // Hide the columns based on the current day
      hideColumns(columns);
    }
  }
}

var area = document.getElementById("timesheetcontainer");

// Add event listener for the "touchstart" event
area.addEventListener("touchstart", (e) => {
  // Get the X coordinate of the touch when it starts
  touchstartX = e.changedTouches[0].screenX;
});

// Add event listener for the "touchend" event
area.addEventListener("touchend", (e) => {
  // Get the X coordinate of the touch when it ends
  touchendX = e.changedTouches[0].screenX;
  
  // Call the "checkSwipe" function to determine if a swipe occurred
  checkSwipe();
});
