document.getElementById("userButton").addEventListener("click", () => {
    document.getElementById("userCreation").style.display = "block";
    document.getElementById("projectCreation").style.display = "none";
    document.getElementById("setUserLevel").style.display = "none";
});
document.getElementById("projectButton").addEventListener("click", ()=> {
    document.getElementById("userCreation").style.display = "none";
    document.getElementById("projectCreation").style.display = "block";
    document.getElementById("setUserLevel").style.display = "none";
});
document.getElementById("UserLevelButton").addEventListener("click", ()=> {
    document.getElementById("userCreation").style.display = "none";
    document.getElementById("projectCreation").style.display = "none";
    document.getElementById("setUserLevel").style.display = "block";
});




document.querySelector('#userCreationForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
        createUsername: event.target.createUsername.value,
        createPassword: event.target.createPassword.value,
        function: "CreateUser"
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
        function: "CreateProject"
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
        function: "seeUserLevel"
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
        return "The Users level is Manager";
      case 2:
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
        function: "setUserLevel"
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