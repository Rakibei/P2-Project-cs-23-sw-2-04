//sets up event to when form is submitted
document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();

  // assign the username and password to variables
  const usrName = event.target.username.value;
  const pswrd = event.target.password.value;

  // check if the input is valid
  if (isValidLength(usrName.length, 2, 25) && isValidChar(usrName) &&
    isValidLength(pswrd.length, 4, 25)) {
    const data = {
      username: usrName,
      password: pswrd
    };
    //makes a POST request to the server to see if the log in is correct
    fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        //if the user is not found or password does not match. Give an alert to the user
        if (response.status === 401) {
          response.text().then(data => {
            alert(data);
          });
        }
        //if the log in is successful then redirect the user
        if (response.redirected) {
          window.location.href = response.url;
        }
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => console.error(error));
  } else {
    showInvalidInputMessage();
  }
});

  // function shows an error message when input is invalid
  function showInvalidInputMessage() {
    window.alert("The input is invalid! Please try again.");
  }

  // function returns true when the length of the input is between the min and max length of allowed characters
  function isValidLength(inputDataLength, min, max) {
    return inputDataLength >= min && inputDataLength <= max;
  }

  // function returns true if there are only alphanumeric characters and some special characters in the input
  function isValidChar(input) {
    return /^[a-zA-Z0-9_-]+$/.test(input);
  }