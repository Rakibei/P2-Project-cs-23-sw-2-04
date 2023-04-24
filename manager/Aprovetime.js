


// Requst users under the manager
window.addEventListener("load", () => {
    
    fetch("/managerRequests?functionName=GetUsersUnderManager",{
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
          const response = await fetch('/managerRequests?functionName=GetUserInfo&users='+UserIds, {
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

        for (let i = 0; i < CurrentTimeSheet.tasks.length; i++) {

          let Row = document.createElement("tr"); 
          let Cell0 = document.createElement("td"); 
          let Cell1 = document.createElement("td");
          let Cell2 = document.createElement("td"); 
          let Cell3 = document.createElement("td"); 
          let Cell4 = document.createElement("td"); 
          let Cell5 = document.createElement("td"); 
          let Cell6 = document.createElement("td"); 
          let Cell7 = document.createElement("td"); 


          for (let j = 0; j < 8; j++) {
            eval(`Cell${j}`).id = `Row${i}Cell${j}`;    
            eval(`Cell${j}`).name = `Row${i}Cell${j}`;            
        
          }
          
          
          Cell0.textContent = CurrentTimeSheet.tasks[i].staticTaskType;
          Cell1.textContent = CurrentTimeSheet.tasks[i].mondayHours;
          Cell2.textContent = CurrentTimeSheet.tasks[i].tuesdayHours;
          Cell3.textContent = CurrentTimeSheet.tasks[i].wednesdayHours;
          Cell4.textContent = CurrentTimeSheet.tasks[i].thursdayHours;
          Cell5.textContent = CurrentTimeSheet.tasks[i].fridayHours;
          Cell6.textContent = CurrentTimeSheet.tasks[i].saturdayHours;
          Cell7.textContent = CurrentTimeSheet.tasks[i].sundayHours;


          TimeSheetHolder.appendChild(Row);
          TimeSheetHolder.appendChild(Cell0);
          TimeSheetHolder.appendChild(Cell1);
          TimeSheetHolder.appendChild(Cell2);
          TimeSheetHolder.appendChild(Cell3);
          TimeSheetHolder.appendChild(Cell4);
          TimeSheetHolder.appendChild(Cell5);
          TimeSheetHolder.appendChild(Cell6);
          TimeSheetHolder.appendChild(Cell7);
          










        }









    }


    async function GetTimeSheet(UserID){
    

      try {
        const response = await fetch("/managerRequests?functionName=GetTimeSheet&UserID="+UserID,{
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
        
      