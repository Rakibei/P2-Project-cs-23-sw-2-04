document.getElementById("LinkUserToProjectkButton").addEventListener("click",()=>{
  
    document.getElementById("LinkUserToProjectContainer").style.display = "block";
    document.getElementById("createTaskForProject").style.display = "none";
    document.getElementById("showProjects").style.display = "none"
  })
  
document.getElementById("showProjectsButton").addEventListener("click",()=>{

    document.getElementById("LinkUserToProjectContainer").style.display = "none";
    document.getElementById("showProjects").style.display = "block";
    document.getElementById("createTaskForProject").style.display = "none";
  })

  document.getElementById("CreateTaskButton").addEventListener("click",()=>{

    document.getElementById("showProjects").style.display = "none"
    document.getElementById("LinkUserToProjectContainer").style.display = "none";
    document.getElementById("createTaskForProject").style.display = "block";

  })

  
  document.querySelector('#LinkUserToProjectForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
      userToLink: event.target.userToLink.value,
      projectToLink: event.target.projectToLinkForUser.value,
      functionName: "LinkUserToProject"
    };
   fetch('../ProjectManagerRequests', {
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



  document.querySelector('#createTaskForProjectForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
      projectToLink: event.target.projectToLinkFortask.value,
      taskDescription: event.target.taskDescription.value,
      taskName: event.target.taskName.value,
      estimate: event.target.estimate.value,
      functionName: "CreateTasks"
    };
    console.log(data);
    fetch('../ProjectManagerRequests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.status === 201) {
          response.text().then(data => {
            alert(data);
            document.querySelector('#createTaskForProjectForm').reset();
          });
        }
      })
      .catch(error => console.error(error));
  });


  
  
  
  document.getElementById("showProjectsButton").addEventListener("click", () => {
    fetch('../ProjectManagerRequests?functionName=GetProjectManagerProjects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(jsonData => {
      if(!document.getElementById("table")){
      const table = document.createElement("table");
      table.id = "table";
      const headerRow = document.createElement("tr");
  
      Object.keys(jsonData[0]).forEach((key) => {
      const headerCell = document.createElement("th");
      headerCell.textContent = key;
      headerRow.appendChild(headerCell);
      });
  
      table.appendChild(headerRow);
  
      jsonData.forEach((data) => {
      const dataRow = document.createElement("tr");
      Object.values(data).forEach((value) => {
          const dataCell = document.createElement("td");
          dataCell.textContent = value;
          dataRow.appendChild(dataCell);
      });
      table.appendChild(dataRow);
      });
      document.getElementById("showProjectsReplace").appendChild(table);
    }
  })

    .catch(error => console.error(error));
  });
  
  