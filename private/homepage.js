// import { response } from "express";

let profileInfo = document.getElementById("profileInfo");

window.addEventListener("load", () => {
  // Fetch session data from "/sesionData" endpoint
  fetch("/sesionData")
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

  fetch("/profileData")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("WelcomeText").innerHTML += " " + data.userName;
    });
});

document
  .querySelector("#exportButtonPDF")
  .addEventListener("click", (event) => {
    event.preventDefault();
    fetch("/UserRequsts?functionName=ExportPDF", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.blob().then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "ExportedTimeSheet.pdf";
        document.body.appendChild(link);
        link.click();
      });
    });
  });

document
  .querySelector("#exportButtonXlsx")
  .addEventListener("click", (event) => {
    event.preventDefault();
    const data = {
      functionName: "ExportExcel",
    };
    fetch("/adminRequests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      response.blob().then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "ExportedTimeSheet.xlsx";
        document.body.appendChild(link);
        link.click();
      });
    });
  });
