document.getElementById("createUserManagerLinkButton").addEventListener("click",()=>{

    document.getElementById("createUserManagerLink").style.display = "block";
    document.getElementById("showProjects").style.display = "none"
  })
  
document.getElementById("showProjectsButton").addEventListener("click",()=>{

    document.getElementById("createUserManagerLink").style.display = "none";
    document.getElementById("showProjects").style.display = "block"
  })



  
  document.querySelector('#createUserManagerLink').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
      managerToLink: event.target.managerToLink.value,
      userToLink: event.target.userToLink.value,
      projectToLink: event.target.projectToLinkForUser.value,
      function: "LinkUsers"
    };
   fetch('/ProjectManagerRequests', {
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
  
  
  
  document.getElementById("showProjectsButton").addEventListener("click", () => {
    fetch('/ProjectManagerRequests?functionName=GetProjectManagerProjects', {
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
  
  