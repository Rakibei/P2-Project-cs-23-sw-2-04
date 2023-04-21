


// Requst users under the manager
window.addEventListener("load", () => {
    
    fetch("https://cs-23-sw-2-04.p2datsw.cs.aau.dk/node0/managerRequests?functionName=GetUsersUnderManager",{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },

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
            Button.id = "button"+i;

            
            Button.textContent = UserData[i];
            
            Button.onclick = () => ShowTimeSheet(data[i]);



            UserHolder.appendChild(Button);

            let Break = document.createElement("br");
            UserHolder.appendChild(Break);
        }
    }


    async function GetUserInfo (UserIds){
        try {
          const response = await fetch('https://cs-23-sw-2-04.p2datsw.cs.aau.dk/node0/managerRequests?functionName=GetUserInfo&users='+UserIds, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
          });
          return await response.json();
        } catch(error) {
          console.error(error);
        }
      }


    async function ShowTimeSheet (UserID){

        let CurrentTimeSheet = await GetTimeSheet(UserID);
        console.log(CurrentTimeSheet);
        let TimeSheetHolder = document.getElementById("CurrentTimeSheet");

        TimeSheetHolder.innerHTML = JSON.stringify(CurrentTimeSheet);


        for (let i = 0; i < CurrentTimeSheet.tasks.length; i++) {

          TimeSheetHolder.createElement("tr")
          let Row = document.createElement("tr"); 
          let Cell1 = document.createElement("td"); 
          let Cell2 = document.createElement("td");
          let Cell3 = document.createElement("td"); 
          let Cell4 = document.createElement("td"); 
          let Cell5 = document.createElement("td"); 
          let Cell6 = document.createElement("td"); 
          let Cell7 = document.createElement("td"); 

          for (let j = 0; j < 7; j++) {
            eval(`Cell${j}`).id = `Row${i}Cell${j}`;    
            eval(`Cell${j}`).name = `Row${i}Cell${j}`;            
        
          }

          Cell1.textContent = TimeSheetHolder.task[i].mondayhours






        }









    }


    async function GetTimeSheet(UserID){
    

      try {
        const response = await fetch("https://cs-23-sw-2-04.p2datsw.cs.aau.dk/node0/managerRequests?functionName=GetTimeSheet&UserID="+UserID,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        return await response.json();
      } catch(error) {
        console.error(error);
      }
    } 
        
      