// import { response } from "express";

let profileInfo = document.getElementById("profileInfo");

window.addEventListener("load", () => {
  // Fetch session data from "/sesionData" endpoint
  fetch("/sesionData")
    .then((response) => response.json())
    .then((data) => {
      UserLevel = data.UserLevel;
      console.log(UserLevel);

      // Check if the user is an admin and display the admin button
      if (UserLevel.isAdmin) {
        AdminButton = document.getElementById("AdminButton").style.display = "flex";
      }

      // Check if the user is a manager and display the manager button
      if (UserLevel.isManager) {
        ManagerButton = document.getElementById("ManagerButton").style.display = "flex";
      }

      // Check if the user is a project manager and display the project manager button
      if (UserLevel.isProjectManager) {
        ProjectManagerButton = document.getElementById("ProjectManagerButton").style.display = "flex";
      }
    });

  // Fetch profile data from "/profileData" endpoint
  fetch("/profileData")
    .then((response) => response.json())
    .then((data) => {
      // Update the welcome text to include the user's name
      document.getElementById("WelcomeText").innerHTML += " " + data.userName;
    });
});
