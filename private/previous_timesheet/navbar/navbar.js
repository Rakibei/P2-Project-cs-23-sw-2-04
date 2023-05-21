window.addEventListener('load', () => {
  // Make an HTTP request to "/sesionData" endpoint
  fetch("/sesionData")
    .then((response) => response.json())
    .then((data) => {
      // Retrieve the UserLevel data from the response
      UserLevel = data.UserLevel;
  
      // Check if the user is an admin and display the corresponding button
      if (UserLevel.isAdmin) {
        AdminButton = document.getElementById("NavAdmin").style.display = "block";
      }
  
      // Check if the user is a manager and display the corresponding button
      if (UserLevel.isManager) {
        ManagerButton = document.getElementById("NavManager").style.display = "block";
      }
  
      // Check if the user is a project manager and display the corresponding button
      if (UserLevel.isProjectManager) {
        ProjectManagerButton = document.getElementById("NavProjectManager").style.display = "block";
      }
    });
});

function openMenu() {
  // Toggle the 'fa-bars' and 'fa-x' classes on the menu-icon element
  document.getElementById("menu-icon").classList.toggle('fa-bars');
  document.getElementById("menu-icon").classList.toggle('fa-x');

  // Toggle the 'menu-open' and 'menu-closed' classes on the menu element
  document.getElementById("menu").classList.toggle('menu-open');
  document.getElementById("menu").classList.toggle('menu-closed');
}

window.onload = function(){
    document.getElementById("menu-text").addEventListener( 'click', openMenu);
}

document.getElementById("NavLogout").addEventListener("click", () => {
  // Create a data object with the functionName property set to "Logout"
  const data = {
    functionName: "Logout"
  };

  // Make a POST request to '/userRequests' endpoint with the data as JSON payload
  fetch('/userRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    // Check if the response was redirected
    if (response.redirected) {
      // Redirect the user to the specified response URL
      window.location.href = response.url;
    }
  })
  .catch(error => console.error(error));
});