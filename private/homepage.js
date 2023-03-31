


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