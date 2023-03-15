document.getElementById("userButton").addEventListener("click", () => {
    document.getElementById("userCreation").style.display = "block";
    document.getElementById("projectCreation").style.display = "none";
    document.getElementById("setUserLevel").style.display = "none";
});
document.getElementById("projectButton").addEventListener("click", ()=> {
    document.getElementById("userCreation").style.display = "none";
    document.getElementById("projectCreation").style.display = "block";
    document.getElementById("setUserLevel").style.display = "none";
});
document.getElementById("UserLevelButton").addEventListener("click", ()=> {
    document.getElementById("userCreation").style.display = "none";
    document.getElementById("projectCreation").style.display = "none";
    document.getElementById("setUserLevel").style.display = "block";
});




document.querySelector('#userCreationForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
      username: event.target.username.value,
      password: event.target.password.value
    };
   fetch('http://127.0.0.1:3000/adminRequests', {
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

