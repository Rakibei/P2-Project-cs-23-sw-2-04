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

document.getElementById("logoutButton").addEventListener("click", () => {
  // Create an object with the data to be sent in the request
  const data = {
    functionName: "Logout",
  };

  // Make a POST request to "/userRequests" endpoint
  fetch("/userRequests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // Convert the data object to a JSON string
  })
    .then((response) => {
      // Check if the response has been redirected
      if (response.redirected) {
        // If redirected, navigate to the response URL
        window.location.href = response.url;
      }
    })
    .catch((error) => console.error(error)); // Log any error that occurred during the request
});
