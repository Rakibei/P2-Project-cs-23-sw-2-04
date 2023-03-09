window.addEventListener('load', () => {
  fetch('/sesionData')
      .then(response => response.json())
      .then(data => {
          // Do something with session data here
          console.log(data);
      });
});