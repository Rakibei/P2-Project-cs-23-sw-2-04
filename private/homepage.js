// import { response } from "express";



let profileInfo = document.getElementById("profileInfo");


window.addEventListener('load', () => {

// spørge server om bruger info

// fullName
// eMail 
// phoneNumber

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
