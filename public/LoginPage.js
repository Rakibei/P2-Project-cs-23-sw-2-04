/*

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();

  // assign the username and password to variables
  const usrName = event.target.username.value;
  const pswrd = event.target.password.value;

  // alert function when valid_user is false 
  function Alert() {
    window.alert("the input is invalid!! please try again");
  }

  // function return true when the length of the input is between the min and max length of allowed character
  function valid_length(inputDatalength, min, max) {
    if (inputDatalength > min && inputDatalength < max) {
      return true;
    } else {
      return false;
    }
  }

  // function return true if there is no special character in the input 

  function valid_char(input) {
    return !/[§!#$%&/()=?` '*,@_\-:.,";<>“¶™∞£]/g.test(input);
  }


  // we check if the input is valid then store it in valid_usrName and valid_pswrd
  let valid_usrName, valid_pswrd;

  if (valid_length(usrName.length, 3, 11) && valid_char(usrName)) {
    valid_usrName = usrName;
  } else {
    Alert();
  }

  if (valid_length(pswrd.length, 4, 25)) {
    valid_pswrd = pswrd;
  } else {
    Alert();
  }




  const data = {

    username: valid_usrName,
    password: valid_pswrd
  };

  fetch('http://127.0.0.1:3000', {
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
*/
document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();

  // assign the username and password to variables
  const usrName = event.target.username.value;
  const pswrd = event.target.password.value;

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

  // check if the input is valid
  if (isValidLength(usrName.length, 2, 25) && isValidChar(usrName) &&
    isValidLength(pswrd.length, 4, 25)) {
    const data = {
      username: usrName,
      password: pswrd
    };

    fetch('http://127.0.0.1:3000', {
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
  } else {
    showInvalidInputMessage();
  }
});

