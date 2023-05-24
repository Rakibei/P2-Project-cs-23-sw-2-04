document.getElementById("projectButton").addEventListener("click", () => {
  document.getElementById("projectCreation").style.display = "block";
});




document.querySelector('#projectCreationForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = {
    projectName: event.target.projectName.value,
    projectStartDate: event.target.projectStartDate.value,
    projectEndDate: event.target.projectEndDate.value,
    projectHoursSpent: event.target.projectHoursSpent.value,
    ProjectManager: event.target.ProjectManager.value,
    functionName: "CreateProject"
  };
  fetch('../managerRequests', {
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
          document.querySelector('#projectCreationForm').reset();
        });
      }
    })
    .catch(error => console.error(error));
});
