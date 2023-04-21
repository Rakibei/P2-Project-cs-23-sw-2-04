// import { response } from "express";



let profileInfo = document.getElementById("profileInfo");


window.addEventListener('load', () => {

  fetch("https://cs-23-sw-2-04.p2datsw.cs.aau.dk/node0/sesionData")
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


fetch('https://cs-23-sw-2-04.p2datsw.cs.aau.dk/node0/profileData')
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

    fetch('https://cs-23-sw-2-04.p2datsw.cs.aau.dk/node0/userRequests', {
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
