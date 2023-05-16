// import { response } from "express";



let profileInfo = document.getElementById("profileInfo");


window.addEventListener('load', () => {

  fetch("/sesionData")
  .then((response) => response.json())
  .then((data) => {
    UserLevel = data.UserLevel;
    console.log(UserLevel);
    

    if(UserLevel.isAdmin){
    AdminButton = document.getElementById("AdminButton").style.display = "flex";
    }
    if(UserLevel.isManager){
    ManagerButton = document.getElementById("ManagerButton").style.display = "flex";
    }
    if(UserLevel.isProjectManager){
    ProjectManagerButton = document.getElementById("ProjectManagerButton").style.display = "flex";  
    }

  });


fetch('/profileData')
.then(response => response.json())
.then(data => {
    document.getElementById("WelcomeText").innerHTML += " " + data.userName;
});


});


document.getElementById("logoutButton").addEventListener("click",() => {

    const data = {
        functionName: "Logout"
    }

    fetch('/userRequests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
          }
    
      })
      .catch(error => console.error(error));


});
