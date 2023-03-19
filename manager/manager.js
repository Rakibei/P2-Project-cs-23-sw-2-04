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
  fetch('http://127.0.0.1:3000/managerRequests', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
});

