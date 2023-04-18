// import { response } from "express";



let profileInfo = document.getElementById("profileInfo");


window.addEventListener('load', () => {

  fetch("/sesionData")
  .then((response) => response.json())
  .then((data) => {
    UserLevel = data.UserLevel;
    console.log(UserLevel);
    

    if(UserLevel.isAdmin){
    AdminButton= document.getElementById("AdminButton").style.display = "flex";
    }
    if(UserLevel.isManager){
      AdminButton= document.getElementById("ManagerButton").style.display = "flex";
    }
  });


fetch('/profileData')
.then(response => response.json())
.then(data => {
    // Do something with session data here
    console.log(data);
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
