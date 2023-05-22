
// Add event listener to user button
document.getElementById("userButton").addEventListener("click", () => {
  document.getElementById("userCreation").style.display = "block";
  document.getElementById("projectCreation").style.display = "none";
  document.getElementById("setUserLevel").style.display = "none";
  document.getElementById("LinkUserToManagerContainer").style.display = "none";
  document.getElementById("createTaskForProject").style.display = "none";
  document.getElementById("SetTimeForEmailNotification").style.display = "none";
});
// Add event listener to project button
document.getElementById("projectButton").addEventListener("click", () => {
  document.getElementById("userCreation").style.display = "none";
  document.getElementById("projectCreation").style.display = "block";
  document.getElementById("setUserLevel").style.display = "none";
  document.getElementById("LinkUserToManagerContainer").style.display = "none";
  document.getElementById("createTaskForProject").style.display = "none";
  document.getElementById("SetTimeForEmailNotification").style.display = "none";

});
// Add event listener to user level button
document.getElementById("userLevelButton").addEventListener("click", () => {
  document.getElementById("userCreation").style.display = "none";
  document.getElementById("projectCreation").style.display = "none";
  document.getElementById("setUserLevel").style.display = "block";
  document.getElementById("LinkUserToManagerContainer").style.display = "none";
  document.getElementById("createTaskForProject").style.display = "none";
  document.getElementById("SetTimeForEmailNotification").style.display = "none";
});
// Add event listener to link user to manager button
document.getElementById("LinkUserToManagerButton").addEventListener("click", () => {
  document.getElementById("userCreation").style.display = "none";
  document.getElementById("projectCreation").style.display = "none";
  document.getElementById("setUserLevel").style.display = "none";
  document.getElementById("LinkUserToManagerContainer").style.display = "block";
  document.getElementById("createTaskForProject").style.display = "none";
  document.getElementById("SetTimeForEmailNotification").style.display = "none";
});
// Add event listener to create task button
document.getElementById("CreateTaskButton").addEventListener("click", () => {
  document.getElementById("userCreation").style.display = "none";
  document.getElementById("projectCreation").style.display = "none";
  document.getElementById("setUserLevel").style.display = "none";
  document.getElementById("LinkUserToManagerContainer").style.display = "none";
  document.getElementById("createTaskForProject").style.display = "block";
  document.getElementById("SetTimeForEmailNotification").style.display = "none";
});
// Add event listener to email notification button
document.getElementById("EmailNotificationButton").addEventListener("click", () => {
  document.getElementById("userCreation").style.display = "none";
  document.getElementById("projectCreation").style.display = "none";
  document.getElementById("setUserLevel").style.display = "none";
  document.getElementById("LinkUserToManagerContainer").style.display = "none";
  document.getElementById("createTaskForProject").style.display = "none";
  document.getElementById("SetTimeForEmailNotification").style.display = "block";

});




// add eventlistener to the submit button for user creation
document.querySelector('#userCreationForm').addEventListener('submit', (event) => {
  event.preventDefault();  // Prevents the default action of submitting the form
  const data = {
    createUsername: event.target.createUsername.value,
    createPassword: event.target.createPassword.value,
    FullName: event.target.FullName.value,
    PhoneNumber: event.target.PhoneNumber.value,
    Email: event.target.Email.value,
    functionName: "CreateUser"
  };
  // Sends a POST request to /adminRequests with the data in JSON format
  fetch('/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.status === 201) { // If the response status is 201, alert the user and reset the form
        response.text().then(data => {
          alert(data);
          document.querySelector('#userCreationForm').reset();
        });
      }
    })
    .catch(error => console.error(error)); // Logs any errors to the console
});

// add eventlistener to the submit button for user creation
document.querySelector('#projectCreationForm').addEventListener('submit', (event) => {
  event.preventDefault();// Prevents the default action of submitting the form
  const data = {
    projectName: event.target.projectName.value,
    projectStartDate: event.target.projectStartDate.value,
    projectEndDate: event.target.projectEndDate.value,
    projectHoursSpent: event.target.projectHoursSpent.value,
    ProjectManager: event.target.ProjectManager.value,
    functionName: "CreateProject"
  };
  // Sends a POST request to /adminRequests with the data in JSON format
  fetch('/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.status === 201) { // If the response status is 201, alert the user and reset the form
        response.text().then(data => {
          alert(data);
          document.querySelector('#projectCreationForm').reset();
        });
      }
    })
    .catch(error => console.error(error)); // Logs any errors to the console
});

// add eventlistener to the submit button for search user level 
document.querySelector('#searchUserLevel').addEventListener('submit', (event) => {
  event.preventDefault(); // Prevents the default action of submitting the form
  document.querySelector("#SeeUserInfo").innerHTML = "";

  // Sends a GET request to /adminRequests with the data in JSON format
  fetch("/adminRequests?functionName=seeUserLevel&users=" + event.target.seeUserLevel.value, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },

  }).then(async response => {
    switch (response.status) { // it checks if the user exist or not and alert the window
      case 400:
        window.alert("User does not exist")
        break;
      case 500:
        window.alert("Internal server error")
        break;
    }
    return response.json();
  })
    .then(async data => {

      console.log(JSON.stringify(data));

      document.getElementById('SeeUserInfo').innerHTML = getUserLevelName(data); // assign to the function that display the user rank capabilities 
      document.querySelector('#searchUserLevel').reset();
    })
    .catch(error => console.error(error)
    );
});

// this function return the rank discription of a given user 
function getUserLevelName(data) {
  let TextResponse = "";
  console.log(data);
  if (data.isAdmin) {
    TextResponse += "<p>The user is an admin</p> <br>"
  }
  if (data.isManager) {
    TextResponse += "<p>The user is a manager</p> <br>"
  }
  if (data.isProjectManager) {
    TextResponse += "<p>The user is a ProjectManager</p> <br>"
  }
  if (!data.isProjectManager && !data.isManager && !data.isAdmin) {
    TextResponse += "<p>The user is only a user</p> <br>"
  }
  console.log(TextResponse);
  return TextResponse
}

// add eventlistener to the submit button for the set user level
document.querySelector('#setUserLevelForm').addEventListener('submit', (event) => {
  event.preventDefault();
  // we check if the admin or manager status is given to the user 
  const isAdminChecked = document.querySelector('#SetUserAdmin').checked;
  const isManagerChecked = document.querySelector('#SetUserManager').checked;
  const data = {
    setUserLevelName: event.target.setUserLevelName.value,
    setUserIsAdmin: isAdminChecked,
    SetUserIsManager: isManagerChecked,
    functionName: "setUserLevel"
  };
  // Sends a POST request to /adminRequests with the data in JSON format
  fetch('/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.status === 201) { // If the response status is 201, alert the user and reset the form
        response.text().then(data => {
          alert(data);
          document.querySelector('#setUserLevelForm').reset();
        });
      }
    })
    .catch(error => console.error(error)); // Logs any errors to the console
});





// add eventlistener to the submit button for the Link User To Manager
document.querySelector('#LinkUserToManagerForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = {
    Manager: event.target.ManagerToLink.value,
    User: event.target.UserToLinkToManager.value,
    functionName: "LinkUserToManagerForm"
  };
  // Sends a POST request to /adminRequests with the data in JSON format
  fetch('/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      switch (response.status) {
        case 201:
        case 500:
        case 400:
          response.text().then(data => {  // in case of mistakes or bad request we reset the form 
            alert(data);
            document.querySelector('#LinkUserToManagerForm').reset();
          });
          break;
      }
    })
    .catch(error => console.error(error)); // Logs any errors to the console
});




//add an event listener to the export button to download as pdf file
document.querySelector('#exportButton').addEventListener('click', (event) => {
  event.preventDefault();
  const data = {
    functionName: "ExportPDF"
  };
  // Sends a POST request to /adminRequests with the data in JSON format
  fetch('/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      response.blob().then(blob => {
        const url = URL.createObjectURL(blob); // Extracts the data from the response and creates a URL for it
        const link = document.createElement('a'); // Creates a link element and sets its attributes
        link.href = url;
        link.download = 'DanielTimeSheet.pdf';
        document.body.appendChild(link); // Appends the link element to the HTML body
        link.click();  // Simulates a click on the link element to download the file
      });
    });
});

//add an event listener to the export button to download as excel file
document.querySelector('#exportButtonXlsx').addEventListener('click', (event) => {
  event.preventDefault();
  const data = {
    functionName: "ExportExcel"
  };
  // Sends a POST request to /adminRequests with the data in JSON format
  fetch('/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      response.blob().then(blob => {
        const url = URL.createObjectURL(blob);  // Extracts the data from the response and creates a URL for it
        const link = document.createElement('a');  // Creates a link element and sets its attributes
        link.href = url;
        link.download = 'DanielTimeSheet.xlsx';
        document.body.appendChild(link);   // Appends the link element to the HTML body
        link.click();  // Simulates a click on the link element to download the file
      });
    });
});

// add eventlistener to the submit button for the create task 
document.querySelector('#createTaskForProjectForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = {
    projectToLink: event.target.projectToLinkFortask.value,
    taskDescription: event.target.taskDescription.value,
    taskName: event.target.taskName.value,
    estimate: event.target.estimate.value,
    functionName: "CreateTasks"
  };
  console.log(data);
  // Sends a POST request to /adminRequests with the data in JSON format
  fetch('/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.status === 201) { // If the response status is 201, alert the user and reset the form
        response.text().then(data => {
          alert(data);
          document.querySelector('#createTaskForProjectForm').reset();
        });
      }
    })
    .catch(error => console.error(error)); // Logs any errors to the console
});

// add eventlistener to the submit button for the email notification 
document.querySelector('#SetTimeForEmailNotificationForm').addEventListener('submit', (event) => {
  event.preventDefault();

  TimeOfDay = event.target.TimeOfDay.value;
  let [hours, mins] = TimeOfDay.split(":");

  const data = {
    functionName: "AutoMailer",
    mins: mins,
    hours: hours,
    Weekday: document.getElementById("WeekDay").value,
    functionName: "AutoMailer",
  }
  // Sends a POST request to /adminRequests with the data in JSON format
  fetch('/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.status === 201) { // If the response status is 201, alert the user and reset the form
        response.text("lortelort").then(data => {
          alert(data);
          document.querySelector('#SetTimeForEmailNotificationForm').reset();
        });
      }
    })
    .catch(error => console.error(error)); // Logs any errors to the console
});

console.log(document.cookie);