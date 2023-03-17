



document.querySelector('#manggeUser').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
        usernameBasic: event.target.usernameBasic.value,
        function: "SeeManagerUsers"
    };
   fetch('http://127.0.0.1:3000/managerRequests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {

    console.log(response);

  })
  .catch(error => console.error(error));
  });