

document.getElementById("userButton").addEventListener("click", () => {
  document.getElementById("userCreation").style.display = "block";
  document.getElementById("projectCreation").style.display = "none";
  document.getElementById("setUserLevel").style.display = "none";
  document.getElementById("LinkUserToManagerContainer").style.display = "none";
  document.getElementById("createTaskForProject").style.display = "none";
  document.getElementById("SetTimeForEmailNotification").style.display = "none";
});
document.getElementById("projectButton").addEventListener("click", () => {
  document.getElementById("userCreation").style.display = "none";
  document.getElementById("projectCreation").style.display = "block";
  document.getElementById("setUserLevel").style.display = "none";
  document.getElementById("LinkUserToManagerContainer").style.display = "none";
  document.getElementById("createTaskForProject").style.display = "none";
  document.getElementById("SetTimeForEmailNotification").style.display = "none";

});
document.getElementById("userLevelButton").addEventListener("click", () => {
  document.getElementById("userCreation").style.display = "none";
  document.getElementById("projectCreation").style.display = "none";
  document.getElementById("setUserLevel").style.display = "block";
  document.getElementById("LinkUserToManagerContainer").style.display = "none";
  document.getElementById("createTaskForProject").style.display = "none";
  document.getElementById("SetTimeForEmailNotification").style.display = "none";
});

document.getElementById("LinkUserToManagerButton").addEventListener("click", () => {
  document.getElementById("userCreation").style.display = "none";
  document.getElementById("projectCreation").style.display = "none";
  document.getElementById("setUserLevel").style.display = "none";
  document.getElementById("LinkUserToManagerContainer").style.display = "block";
  document.getElementById("createTaskForProject").style.display = "none";
  document.getElementById("SetTimeForEmailNotification").style.display = "none";
});
document.getElementById("CreateTaskButton").addEventListener("click", () => {
  document.getElementById("userCreation").style.display = "none";
  document.getElementById("projectCreation").style.display = "none";
  document.getElementById("setUserLevel").style.display = "none";
  document.getElementById("LinkUserToManagerContainer").style.display = "none";
  document.getElementById("createTaskForProject").style.display = "block";
  document.getElementById("SetTimeForEmailNotification").style.display = "none";
});
document.getElementById("EmailNotificationButton").addEventListener("click", () => {
  document.getElementById("userCreation").style.display = "none";
  document.getElementById("projectCreation").style.display = "none";
  document.getElementById("setUserLevel").style.display = "none";
  document.getElementById("LinkUserToManagerContainer").style.display = "none";
  document.getElementById("createTaskForProject").style.display = "none";
  document.getElementById("SetTimeForEmailNotification").style.display = "block";

});





document.querySelector('#userCreationForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = {
    createUsername: event.target.createUsername.value,
    createPassword: event.target.createPassword.value,
    FullName: event.target.FullName.value,
    PhoneNumber: event.target.PhoneNumber.value,
    Email: event.target.Email.value,
    functionName: "CreateUser"
  };
  fetch('/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.status === 201) {
        response.text().then(data => {
          alert(data);
          document.querySelector('#userCreationForm').reset();
        });
      }
    })
    .catch(error => console.error(error));
});

document.querySelector('#projectCreationForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = {
    projectName: event.target.projectName.value,
    projectStartDate: event.target.projectStartDate.value,
    projectEndDate: event.target.projectEndDate.value,
    projectHoursSpent: event.target.projectHoursSpent.value,
    functionName: "CreateProject"
  };
  fetch('/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.status === 201) {
        response.text().then(data => {
          alert(data);
          document.querySelector('#projectCreationForm').reset();
        });
      }
    })
    .catch(error => console.error(error));
});


document.querySelector('#searchUserLevel').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = {
    seeUserLevel: event.target.seeUserLevel.value,
    functionName: "seeUserLevel"
  };
  fetch('/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      response.json()
        .then(data => { document.getElementById('SeeUserInfo').innerHTML = getUserLevelName(data); })
      document.querySelector('#searchUserLevel').reset();
    })
    .catch(error => console.error(error));
});

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
  console.log(TextResponse);
  return TextResponse
}


document.querySelector('#setUserLevelForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const isAdminChecked = document.querySelector('#SetUserAdmin').checked;
  const isManagerChecked = document.querySelector('#SetUserManager').checked;
  const data = {
    setUserLevelName: event.target.setUserLevelName.value,
    setUserIsAdmin: isAdminChecked,
    SetUserIsManager: isManagerChecked,
    functionName: "setUserLevel"
  };
  fetch('/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.status === 201) {
        response.text().then(data => {
          alert(data);
          document.querySelector('#setUserLevelForm').reset();
        });
      }
    })
    .catch(error => console.error(error));
});






document.querySelector('#LinkUserToManagerForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = {
    Manager: event.target.ManagerToLink.value,
    User: event.target.UserToLinkToManager.value,
    functionName: "LinkUserToManagerForm"
  };
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
          response.text().then(data => {
            alert(data);
            document.querySelector('#LinkUserToManagerForm').reset();
          });
          break;
      }
    })
    .catch(error => console.error(error));
});





document.querySelector('#exportButton').addEventListener('click', (event) => {
  event.preventDefault();
  const data = {
    functionName: "ExportPDF"
  };
  fetch('/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      response.blob().then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'DanielTimeSheet.pdf';
        document.body.appendChild(link);
        link.click();
      });
    });
});

document.querySelector('#exportButtonXlsx').addEventListener('click', (event) => {
  event.preventDefault();
  const data = {
    functionName: "ExportExcel"
  };
  fetch('/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      response.blob().then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'DanielTimeSheet.xlsx';
        document.body.appendChild(link);
        link.click();
      });
    });
});


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
  fetch('/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.status === 201) {
        response.text().then(data => {
          alert(data);
          document.querySelector('#createTaskForProjectForm').reset();
        });
      }
    })
    .catch(error => console.error(error));
});

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

  fetch('/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.status === 201) {
        response.text("lortelort").then(data => {
          alert(data);
          document.querySelector('#SetTimeForEmailNotificationForm').reset();
        });
      }
    })
    .catch(error => console.error(error));
});








console.log(document.cookie);