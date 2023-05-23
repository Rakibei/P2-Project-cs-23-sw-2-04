let userName;
let userID;


function getTimeSheetData() {
  // Initialize the timeSheet object with default values
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

  // Get a reference to the timesheet table element
  let table = document.getElementById("timesheet");

  // Get the number of rows in the table
  let rowLength = table.rows.length;

  // Calculate the week number based on the current date
  timeSheet.week = Math.ceil(
    Math.floor(
      (new Date() - new Date(new Date().getFullYear(), 0, 1)) /
        (24 * 60 * 60 * 1000)
    ) / 7
  );

  // Set the userName and userID properties of the timeSheet object
  timeSheet.userName = userName;
  timeSheet.userID = userID;

  // Set the year property of the timeSheet object
  timeSheet.year = new Date().getFullYear();

  // Collect data from the meeting, absence, and vacation sections of the table
  collectTableData(timeSheet.meeting, table, rowLength - 4);
  collectTableData(timeSheet.absence, table, rowLength - 3);
  collectTableData(timeSheet.vacation, table, rowLength - 2);

  // Collect project data from the table
  collectProjectData(timeSheet, table, rowLength);

  // Return the populated timeSheet object
  return timeSheet;
}

function collectTableData(timeSheetTaskSection, table, rowFromTable) {
  let i = 2; // Start index for table cells, index 0 and 1 are for other purposes

  // Iterate over each day in the timeSheetTaskSection.days object
  for (const day in timeSheetTaskSection.days) {
    // Get the input element of type "number" from the specific cell in the table
    let input = table.rows[rowFromTable].cells[i].querySelector("input[type=number]");

    // Retrieve the numeric value from the input element
    let value = Number(input.value);

    // Check if the value is a valid number (not NaN)
    if (!isNaN(value)) {
      // Update the corresponding day's value in the timeSheetTaskSection.days object
      timeSheetTaskSection.days[day] = value;
    }

    i++; // Increment the cell index for the next iteration
  }
}

function collectProjectData(timeSheet, table, rowLength) {
  // Iterate over the rows of projects in reverse order
  for (let i = rowLength - 5; i > 0; i--) {
    // Read the project and task dropdowns for each row
    let selectProject = table.rows[i].cells[0].querySelector("select");
    let selectTask = table.rows[i].cells[1].querySelector("select");

    // Skip the iteration if project is not selected or task is not provided
    if (
      selectProject.value == "Default" ||
      selectTask.value == "" ||
      selectProject.value == "Select a project"
    ) {
      continue;
    }

    // Create project and task objects if they don't exist in the timeSheet.projects structure
    if (!timeSheet.projects.hasOwnProperty(selectProject.value)) {
      timeSheet.projects[selectProject.value] = {};
    }

    if (!timeSheet.projects[selectProject.value].hasOwnProperty(selectTask.value)) {
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

    // Set the task name and task ID
    timeSheet.projects[selectProject.value][selectTask.value].taskName = [
      selectTask.value,
    ];

    // Find the task in the projects array and set its ID
    targetProjectWithTasks = projects[0].find(
      (item) => item.name === selectProject.value
    ).tasks;
    targetTask = targetProjectWithTasks.find(
      (item) =>
        item.name ===
        timeSheet.projects[selectProject.value][selectTask.value].taskName[0]
    );
    timeSheet.projects[selectProject.value][selectTask.value].taskId = targetTask.id;

    // Collect table data for the specific project and task
    collectTableData(
      timeSheet.projects[selectProject.value][selectTask.value],
      table,
      i
    );
  }
}

document.querySelector("#timeSheetButton").addEventListener("click", (event) => {
  // Get the time sheet data
  let timeSheet = getTimeSheetData();

  // Make an HTTP POST request to submit the time sheet data
  fetch("http://127.0.0.1:3000/submitTime", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(timeSheet),
  })
    .then((response) => {
      // Handle the response if needed
    
        

        console.log(response);
        switch (response.status) {
          case 200:
            alert("Time sheet submited");
          break;
        }




      })
    .catch((error) => console.error(error));
});
