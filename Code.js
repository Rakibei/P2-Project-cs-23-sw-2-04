







document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append('Username', event.target.Username.value);
  formData.append('Password', event.target.Password.value);
  fetch('http://127.0.0.1:3000', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
});