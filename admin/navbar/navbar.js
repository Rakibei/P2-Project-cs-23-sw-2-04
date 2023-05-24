window.addEventListener('load', () => {

    fetch("../sesionData")
    .then((response) => response.json())
    .then((data) => {
      UserLevel = data.UserLevel;
  
      if(UserLevel.isAdmin){
      AdminButton = document.getElementById("NavAdmin").style.display = "block";
      }
      if(UserLevel.isManager){
      ManagerButton = document.getElementById("NavManager").style.display = "block";
      }
      if(UserLevel.isProjectManager){
      ProjectManagerButton = document.getElementById("NavProjectManager").style.display = "block";  
      }
  
    });
});

function openMenu(){
    document.getElementById("menu-icon").classList.toggle('fa-bars');
    document.getElementById("menu-icon").classList.toggle('fa-x');
    document.getElementById("menu").classList.toggle('menu-open');
    document.getElementById("menu").classList.toggle('menu-closed');
}

window.onload = function(){
    document.getElementById("menu-text").addEventListener( 'click', openMenu);
}

document.getElementById("NavLogout").addEventListener("click",() => {

    const data = {
        functionName: "Logout"
    }

    fetch('../userRequests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
          }
    
      })
      .catch(error => console.error(error));


});