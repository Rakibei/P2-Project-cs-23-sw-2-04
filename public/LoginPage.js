document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = {
    username: event.target.username.value,
    password: event.target.password.value
  };
 fetch('https://cs-23-sw-2-04.p2datsw.cs.aau.dk/node0/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(response => {

  if (response.status === 401) {
    response.text().then(data => {
      alert(data);
    });
  }

  if (response.redirected) {
    window.location.href = response.url;
  }



  
})
.then(data => {
  console.log(data);
})
.catch(error => console.error(error));
});