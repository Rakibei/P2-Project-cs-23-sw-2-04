
document.getElementById("userButton").addEventListener("click", () => {
    document.getElementById("userCreation").style.display = "block";
    document.getElementById("projectCreation").style.display = "none";
    document.getElementById("setUserLevel").style.display = "none";
    document.getElementById("createManagerForProject").style.display = "none";
});
document.getElementById("projectButton").addEventListener("click", ()=> {
    document.getElementById("userCreation").style.display = "none";
    document.getElementById("projectCreation").style.display = "block";
    document.getElementById("setUserLevel").style.display = "none";
    document.getElementById("createManagerForProject").style.display = "none";
});
document.getElementById("userLevelButton").addEventListener("click", ()=> {
  document.getElementById("userCreation").style.display = "none";
  document.getElementById("projectCreation").style.display = "none";
  document.getElementById("setUserLevel").style.display = "block";
  document.getElementById("createManagerForProject").style.display = "none";
});
document.getElementById("createManagerButton").addEventListener("click", ()=> {
  document.getElementById("userCreation").style.display = "none";
  document.getElementById("projectCreation").style.display = "none";
  document.getElementById("setUserLevel").style.display = "none";
  document.getElementById("createManagerForProject").style.display = "block";
});






document.querySelector('#userCreationForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
        createUsername: event.target.createUsername.value,
        createPassword: event.target.createPassword.value,
        functionName: "CreateUser"
    };
   fetch('http://127.0.0.1:3000/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {

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
   fetch('http://127.0.0.1:3000/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
 
  })
  .catch(error => console.error(error));
  });


  document.querySelector('#searchUserLevel').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
        seeUserLevel: event.target.seeUserLevel.value,
        functionName: "seeUserLevel"
    };
   fetch('http://127.0.0.1:3000/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    response.json()
    .then(data => {document.getElementById('SeeUserInfo').innerHTML = getUserLevelName(data);
    });

  })
  .catch(error => console.error(error));
  });

  function getUserLevelName(data) {
    switch (data) {
      case 0:
        return "The Users level is Basic User";
      case 1:
        return "The Users level is Admin";        
    default:
        return "The User does not exist"
    }
  }

  document.querySelector('#setUserLevelForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
        setUserLevelName: event.target.setUserLevelName.value,
        setUserLevelValue: event.target.setUserLevelValue.value,
        functionName: "setUserLevel"
    };
   fetch('http://127.0.0.1:3000/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    
  })
  .catch(error => console.error(error));
  });



  document.querySelector('#createManagerForProjectForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
      createManager: event.target.createManager.value,
      projectToLink: event.target.projectToLinkForManager.value,
      functionName: "CreateUserProjectLink"
    };
   fetch('http://127.0.0.1:3000/adminRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {

  })
  .catch(error => console.error(error));
});


document.querySelector('#exportButton').addEventListener('click', (event) => {
  event.preventDefault();
  const data = {
    functionName: "ExportPDF"
  };
 fetch('http://127.0.0.1:3000/adminRequests', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(response =>{
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

console.log(document.cookie);