// import { response } from "express";

let profileInfo = document.getElementById("profileInfo");

window.addEventListener("load", () => {
  // Fetch session data from "/sesionData" endpoint
  fetch("../sesionData")
    .then((response) => response.json())
    .then((data) => {
      UserLevel = data.UserLevel;
      console.log(UserLevel);

      if (UserLevel.isAdmin) {
        AdminButton = document.getElementById("AdminButton").style.display =
          "flex";
      }
      if (UserLevel.isManager) {
        ManagerButton = document.getElementById("ManagerButton").style.display =
          "flex";
      }
      if (UserLevel.isProjectManager) {
        ProjectManagerButton = document.getElementById(
          "ProjectManagerButton"
        ).style.display = "flex";
      }
    });

  fetch("../profileData")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("WelcomeText").innerHTML += " " + data.userName;
    });
});

