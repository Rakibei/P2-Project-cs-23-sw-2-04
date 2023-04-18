


// Requst users under the manager
window.addEventListener("load", () => {
    const data = {
        functionName: "GetUsersUnderManager"
    }
    fetch("/managerRequests",{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)

    }).then(response => {
        return response.json()
    })
    .then(async data =>{
        await DisplayUsers(data);
    })
      .catch(error => console.error(error));
    });      
    


    async function DisplayUsers(data){

        console.log(data);
        
        let UserData = await GetUserInfo(data);
        console.log(UserData);
        let UserHolder = document.getElementById("UserHolder");

        for (let i = 0; i < data.length; i++) {

            let Button = document.createElement("button");


            Button.name = "button"+i;
            
            Button.textContent = UserData[i];
            
            Button.onclick = () => CreateTimeSheet(UserData[i]);



            UserHolder.appendChild(Button);

            let Break = document.createElement("br");
            UserHolder.appendChild(Break);





        }
    }


    async function GetUserInfo (UserIds){
        data ={
          users: UserIds,
          functionName: "GetUserInfo"
        }
        try {
          const response = await fetch('/managerRequests', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          //console.log(response.json());
          return await response.json();
        } catch(error) {
          console.error(error);
        }
      }


    async function CreateTimeSheet (UserID){

        


    }


    async function GetTimeSheet(UserID){
       
    const data = {
    functionName: "GetTimeSheet",
    UserID: UserID,
    }
    fetch("/managerRequests",{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)

    }).then(response => {
        return response.json()
    })
    .then(async data =>{
        await DisplayUsers(data);
    })
      .catch(error => console.error(error));



        
    }