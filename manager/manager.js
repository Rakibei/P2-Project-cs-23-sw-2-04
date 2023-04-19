document.getElementById("createUserManagerLinkButton").addEventListener("click",()=>{

  document.getElementById("createUserManagerLink").style.display = "block";
})


document.querySelector('#createUserManagerLink').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = {
    managerToLink: event.target.managerToLink.value,
    userToLink: event.target.userToLink.value,
    projectToLink: event.target.projectToLinkForUser.value,
    function: "LinkUsers"
  };
 fetch('http://127.0.0.1:3000/managerRequests', {
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

  const data = {
    functionName: "GetProjectManagerProjects"
  }
  fetch('http://127.0.0.1:3000/managerRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(jsonData => {
    const table = document.createElement("table");

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
})
  .catch(error => console.error(error));
});

