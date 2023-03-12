document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = {
    username: event.target.username.value,
    password: event.target.password.value
  };
 fetch('http://127.0.0.1:3000', {
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



