// save data for later use
let projects;

//When the web page loads get info of the user from the server
window.addEventListener("load", () => {
  fetch("/sesionData")
    .then((response) => response.json())
    .then((data) => {
      // Do something with session data here
      console.log(data);
      projects = data.projects;
      week = data.week;
      userID = data.userID;
      userName = data.userName;
      timeSheetForUser = data.timeSheetForUser;
      CreateTimeSheetTable(
        data.projects,
        data.timeSheetForUser,
        data.week,
        data.userName
      );
    });
});

/*The HideCollums functions uses the array to hide the corresponding tabel collums on the mobile version.
  Currentday determines wich day need to be showed to the user
  */




let array_of_weekdayfunctions = [
  { monday: [3, 4, 5, 6, 7, 8] },
  { tuesday: [2, 4, 5, 6, 7, 8] },
  { wednesday: [2, 3, 5, 6, 7, 8] },
  { thursday: [2, 3, 4, 6, 7, 8] },
  { friday: [2, 3, 4, 5, 7, 8] },
  { saturday: [2, 3, 4, 5, 6, 8] },
  { sunday: [2, 3, 4, 5, 6, 7] },
];

let firstday = 0;
let lastday = 6;
let currentday = 0;

//Make time sheet table for user
function CreateTimeSheetTable(projects, timeSheetForUser, week, userName) {
  tableData = preparetableDataForTimeSheetTable(projects, timeSheetForUser);
  makeNewTimeSheetTable(tableData, week, userName, timeSheetForUser);
  SumOfCollum();
  SumOffTotalHoursRow();
  SumOfAbsenceHoursRow();
  if (window.outerWidth < 500) {
    hideColumns([3, 4, 5, 6, 7, 8]);
  }
}

//a function the will delete the specific row where the corresponding "delete row button" is pressed
function DeleteRow() {
  //event.target is the element that is clicked
  let td = event.target.parentNode;
  //tr is the row to be removed
  let tr = td.parentNode;
  tr.parentNode.removeChild(tr);
}

//A function that will create a new row in the ta
function CreateNewRow() {
  //gets the correct table

  let tabletime = document.getElementById("timesheet");
  let rows = tabletime.rows[1];
  let cell = rows.cells[2];
  let input = cell.getElementsByTagName("input")[0];
  let id = input.id;
  //console.log(id);
  let newid = id.split("day")[1];

  newid--;

  //console.log(newid);

  //inserts a new row
  let row = tabletime.insertRow(1);

  //inserts 8 new cells
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  let cell4 = row.insertCell(3);
  let cell5 = row.insertCell(4);
  let cell6 = row.insertCell(5);
  let cell7 = row.insertCell(6);
  let cell8 = row.insertCell(7);
  let cell9 = row.insertCell(8);
  let cell10 = row.insertCell(9);

  //inserts the imput for the different cells
  cell1.innerHTML = `<select name="ProjectsDropdown${newid}" class="ProjectsDropdown" id="ProjectsDropdown${newid}">
                          <option value="Default">Select a project</option> 
                          </select>`;
  cell2.innerHTML = ` <select name="TasksDropdown${newid}" class="TasksDropdown" id="TasksDropdown${newid}" > </select>`;
  cell3.innerHTML = `<input type="number" id="monday${newid}" value="0" step="0.5" name="monday${newid}" value="0" oninput="validity.valid||(value='0');" step="0.5" min="0" max="20">`;
  cell4.innerHTML = `<input type="number" id="tuesday${newid}" value="0" step="0.5" name="monday${newid}" value="0" oninput="validity.valid||(value='0');" step="0.5" min="0" max="20">`;
  cell5.innerHTML = `<input type="number" id="wednesday${newid}" value="0" step="0.5" name="monday${newid}" value="0" oninput="validity.valid||(value='0');" step="0.5" min="0" max="20">`;
  cell6.innerHTML = `<input type="number" id="thursday${newid}" value="0" step="0.5" name="monday${newid}" value="0" oninput="validity.valid||(value='0');" step="0.5" min="0" max="20">`;
  cell7.innerHTML = `<input type="number" id="friday${newid}" value="0" step="0.5" name="monday${newid}" value="0" oninput="validity.valid||(value='0');" step="0.5" min="0" max="20">`;
  cell8.innerHTML = `<input type="number" id="saturday${newid}" value="0" step="0.5" name="monday${newid}" value="0" oninput="validity.valid||(value='0');" step="0.5" min="0" max="20">`;
  cell9.innerHTML = `<input type="number" id="sunday${newid}" value="0" step="0.5" name="monday${newid}" value="0" oninput="validity.valid||(value='0');" step="0.5" min="0" max="20">`;
  cell10.innerHTML = `<input type="button"class="DeleteRowButton" value="Delete Row" onclick="DeleteRow()">`;

  PopulateDropdownProjects(newid);
  LinkingDropdowns(newid, projects);
  SumOfCollum();
  if (window.outerWidth < 500) {
    //console.log("Dette er current" + JSON.stringify(currentday));
    let columns = Object.values(array_of_weekdayfunctions[currentday])[0];
    //console.log("Dette er columns til newrow" + columns);
    showAllColumns();
    hideColumns(columns);
  }
}

/*When the button with the id="AddRow" is clicked, the function CreateNewRow is
 executed resulting in the creation of a new row*/
const AddRowBtn = document.getElementById("AddRow");
AddRowBtn.addEventListener("click", CreateNewRow);

function showAllColumns() {
  const table = document.getElementById("timesheet");
  const rows = table.rows;

  for (let i = 0; i <= rows.length - 1; i++) {
    const cells = rows[i].cells;

    for (let j = 0; j <= cells.length - 1; j++) {
      cells[j].style.display = "";
    }
  }
}
//hide columns by style. Called only if the users screens width is small (> 500)
function hideColumns(columns) {
  const table = document.getElementById("timesheet");
  const rows = table.rows;

  for (let i = 0; i <= rows.length - 1; i++) {
    const cells = rows[i].cells;

    for (let j = columns.length - 1; j >= 0; j--) {
      const index = columns[j];

      if (index >= 0 && index <= cells.length - 1) {
        cells[index].style.display = "none";
      }
    }
  }
}
function LinkingDropdowns(newid, projects) {
  // Create an empty object to store project names and their associated task names
  const projectsnames = {};

  // Iterate over the projects array
  for (let i = 0; i < projects.length; i++) {
    // Assign the project name as the key and map the task names as an array of values
    projectsnames[projects[i].name] = projects[i].tasks.map((task) => task.name);
  }

  // Get references to the project and task dropdown elements based on the provided newid
  let projectDropdown = document.getElementById("ProjectsDropdown" + newid);
  let taskDropdown = document.getElementById("TasksDropdown" + newid);

  // Add an event listener to the project dropdown element
  projectDropdown.addEventListener("change", () => {
    // Get the selected project from the project dropdown
    let selectedProject = projectDropdown.value;

    // Retrieve the associated task names for the selected project from the projectsnames object
    let taskOptions = projectsnames[selectedProject]
      .map((task) => `<option>${task}</option>`)
      .join("");

    // Set the options of the task dropdown with the retrieved task names
    taskDropdown.innerHTML = taskOptions;
  });
}

function PopulateDropdownProjects(newid) {
  // Get the reference to the projects dropdown element based on the provided newid
  const ProjectsDropdown = document.getElementById("ProjectsDropdown" + newid);

  // Iterate over the projects array
  for (let i = 0; i < projects.length; i++) {
    // Create a new option element
    let option = document.createElement("OPTION");

    // Set the innerHTML of the option to the project name
    option.innerHTML = projects[i].name;

    // Set the value of the option to the project name
    option.value = projects[i].name;

    // Append the option to the projects dropdown
    ProjectsDropdown.appendChild(option);
  }
}

// Cells are the x axis rows are the y axis

//a function that sums up all the values of a collum and inserts the final value as the last cell in the collum
function SumOfCollum() {
  let tableID = document.getElementById("timesheet");
  let amountOfRows = tableID.rows.length;
  let amountOfCollums = tableID.rows[0].cells.length;

  let totalCollumValue = 0;

  for (let i = 2; i < amountOfCollums; i++) {
    for (let j = 1; j < amountOfRows - 3; j++) {
      let input = tableID.rows[j].cells[i].querySelector(
        "input[type='number']"
      );
      if (input) {
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
  // Get a reference to the timesheet table
  let table = document.getElementById("timesheet");

  // Get the total number of rows in the table
  let totalrows = table.rows.length;

  // Get the number of cells in the last row of the timesheet table
  let rowlength = document.getElementById("timesheet").rows[totalrows - 1].cells.length;

  // Initialize a variable to store the sum of total hours
  let Totalhourssum = 0;

  // Iterate over the cells starting from the second cell (index 2) and up to the second-to-last cell (index rowlength - 2)
  for (let i = 2; i < rowlength - 1; i++) {
    // Get the input element within the cell
    const input = table.rows[totalrows - 1].cells[i].querySelector("input[type=number]");

    // Parse the input value as a number
    const value = Number(input.value);

    // Check if the parsed value is a valid number
    if (!isNaN(value)) {
      // Add the valid number to the Totalhourssum variable
      Totalhourssum += value;
    }
  }

  // Set the value of the input element in the last cell of the last row to the Totalhourssum
  table.rows[totalrows - 1].cells[rowlength - 1].querySelector("input[type='number']").value = Totalhourssum;

  // Reset the Totalhourssum variable to 0
  Totalhourssum = 0;
}

function SumOfAbsenceHoursRow() {
  // Get the table element by its ID
  let table = document.getElementById("timesheet");

  // Get the total number of rows in the table
  let totalrows = table.rows.length;

  // Get the number of cells in the last row
  let rowlength =
    document.getElementById("timesheet").rows[totalrows - 1].cells.length;

  // Initialize the variable to store the total row value
  let totalRowValue = 0;

  // Iterate through the cells starting from the 2nd cell and up to the second-to-last cell
  for (i = 2; i < rowlength - 1; i++) {
    // Get the input element within the specific cell
    const input = table.rows[totalrows - 3].cells[i].querySelector("input[type=number]");
    
    // Parse the input value as a number
    const value = Number(input.value);

    // Get a reference to the current cell
    let cell = table.rows[totalrows - 3].cells[i];

    // Attach an event listener to the current cell, listening for input changes
    cell.addEventListener("input", SumOfAbsenceHoursRow);

    // Check if the parsed value is a valid number
    if (!isNaN(value)) {
      // Add the value to the totalRowValue
      totalRowValue += value;
    }
  }

  // Set the value of the input in the last cell of the third-to-last row to the totalRowValue
  table.rows[totalrows - 3].cells[rowlength - 1].querySelector("input[type='number']").value = totalRowValue;

  // Reset the totalRowValue to 0
  totalRowValue = 0;
}

// Start of swipe effect
let touchstartX = 0;
let touchendX = 0;

function checkSwipe() {
  // Check if the horizontal swipe distance is greater than 60 pixels to the right
  if (touchendX - touchstartX > 60) {
    if (currentday == 0) {
      return;
    } else {
      // Decrement the current day
      currentday--;
      // Get the columns to hide based on the current day
      let columns = Object.values(array_of_weekdayfunctions[currentday])[0];
      // Show all columns
      showAllColumns();
      // Hide the columns for the current day
      hideColumns(columns);
    }
  }

  // Check if the horizontal swipe distance is greater than 60 pixels to the left
  if (touchendX - touchstartX < -60) {
    if (currentday == lastday) {
      return;
    } else {
      // Increment the current day
      currentday++;
      // Get the columns to hide based on the current day
      let columns = Object.values(array_of_weekdayfunctions[currentday])[0];
      console.log(columns);
      // Show all columns
      showAllColumns();
      // Hide the columns for the current day
      hideColumns(columns);
    }
  }
}

var area = document.getElementById("timesheetcontainer");

// Add a touchstart event listener to the "timesheetcontainer" element
area.addEventListener("touchstart", (e) => {
  // Store the starting X-coordinate of the touch event
  touchstartX = e.changedTouches[0].screenX;
});

// Add a touchend event listener to the "timesheetcontainer" element
area.addEventListener("touchend", (e) => {
  // Store the ending X-coordinate of the touch event
  touchendX = e.changedTouches[0].screenX;
  // Call the checkSwipe() function to determine the swipe direction and take action accordingly
  checkSwipe();
});
// End of swipe effect
