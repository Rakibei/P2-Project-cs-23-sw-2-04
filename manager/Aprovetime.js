


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
      if (data.length > 0) {
        await DisplayUsers(data);
      } else{
        window.alert("No users under you")
      }
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
            
            Button.onclick = () => ShowTimeSheet(data[i],UserData[i]);



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


    async function ShowTimeSheet (UserID, UserName){

      let CurrentTimeSheet = await GetTimeSheet(UserID);
      console.log(CurrentTimeSheet);
      let TimeSheetHolder = document.getElementById("TimeSheetContainer");


      
      if (CurrentTimeSheet == false ||  Object.keys(CurrentTimeSheet).length == 0 ) {
        TimeSheetHolder.innerHTML="";
        alert("No timesheets for user");
        return;
      }

       

        TimeSheetHolder.innerHTML="";

        let CurrentUser = document.createElement("h2");

        CurrentUser.textContent = "TimeSheet data for " + UserName;

        TimeSheetHolder.appendChild(CurrentUser);

      let CurrentPath;
      let k = 0;
        
for (let u = 0; u < Object.keys(CurrentTimeSheet).length; u++) {




        let CurrentTimeSheetInContainer = document.createElement("table");

        let WeekNumbHolder = document.createElement("h3");

        WeekNumbHolder.textContent = CurrentTimeSheet[u].Week

        TimeSheetHolder.appendChild(WeekNumbHolder);

        const TopInfo = ["Project","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        for (let Info of TopInfo) {
        const td = document.createElement("td");
        const text = document.createTextNode(Info);
        td.appendChild(text);
        CurrentTimeSheetInContainer.appendChild(td);
        }
  
  
  
          for (let i = 0; i < Object.keys(CurrentTimeSheet[u].tasks).length + Object.keys(CurrentTimeSheet[u].tasks.projects).length - 1; i++) {
            switch (i) {
              case 0:
                CurrentPath = CurrentTimeSheet[u].tasks.absence || {};
                break;
              case 1:
                CurrentPath = CurrentTimeSheet[u].tasks.meeting || {};
                break;
              case 2:
                CurrentPath = CurrentTimeSheet[u].tasks.vacation || {};
                break;
              case 3:
                CurrentPath = CurrentTimeSheet[u].tasks.projects[k] || {};
                break;
              default:
                CurrentPath = CurrentTimeSheet[u].tasks.projects[++k] || {};
                break;
            }

            if (Object.keys(CurrentPath).length === 0) {
              // Skip this iteration and continue with the next one
              continue;
            }
  
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
          
  
            // Call Project Info
  
            if (i < 3){
  
              switch (CurrentPath.staticTaskType) {
                case 1:
                  Cell0.textContent = "Vacation";  
                  break;
                case 2:
                  Cell0.textContent =  "Absence"
                  break;
                case 3:
                  Cell0.textContent = "Meeting"
                  break;
                }}
            else{
              Cell0.textContent = await GetProjectInfo(CurrentPath.taskId)
            }
  
            Cell1.textContent = CurrentPath.hours?.monday ?? "Not defined";
            Cell2.textContent = CurrentPath.hours?.tuesday ?? "Not defined";
            Cell3.textContent = CurrentPath.hours?.wednesday ?? "Not defined";
            Cell4.textContent = CurrentPath.hours?.thursday ?? "Not defined";
            Cell5.textContent = CurrentPath.hours?.friday ?? "Not defined";
            Cell6.textContent = CurrentPath.hours?.saturday ?? "Not defined";
            Cell7.textContent = CurrentPath.hours?.sunday ?? "Not defined";
  
            CurrentTimeSheetInContainer.appendChild(Row);
            CurrentTimeSheetInContainer.appendChild(Cell0);
            CurrentTimeSheetInContainer.appendChild(Cell1);
            CurrentTimeSheetInContainer.appendChild(Cell2);
            CurrentTimeSheetInContainer.appendChild(Cell3);
            CurrentTimeSheetInContainer.appendChild(Cell4);
            CurrentTimeSheetInContainer.appendChild(Cell5);
            CurrentTimeSheetInContainer.appendChild(Cell6);
            CurrentTimeSheetInContainer.appendChild(Cell7);
            
  
  
          }
    

          TimeSheetHolder.appendChild(CurrentTimeSheetInContainer)



  
          let ButtonHolder = document.createElement("div");

  
          ButtonHolder.innerHTML = "";
  
          let ApproveButton = document.createElement("button");
          let DeclineButton = document.createElement("button");
          
          ApproveButton.id = "ApproveButton" + u;
          // DeclineButton.id = "DeclineButton";
  
          ApproveButton.textContent = "Approve";
          DeclineButton.textContent = "Approve";

  
          ApproveButton.addEventListener("click", async function() {
            let result = await ApproveTimeSheet(CurrentTimeSheet[u].timeSheetId);
            // Use console.log() to check the result
            console.log(result);

            
            await ShowTimeSheet (UserID, UserName);
          });
          // DeclineButton.addEventListener("click")
  
         ButtonHolder.appendChild(ApproveButton);
          
         TimeSheetHolder.appendChild(ButtonHolder);


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
        
      

   async function GetProjectInfo(TaskId) {
      
      try {
        const response = await fetch('/managerRequests?functionName=GetProjectInfo&TaskId='+TaskId, {
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



async function ApproveTimeSheet(TimeSheetId){

  const data = {
    functionName: "ApproveTimeSheet",
    TimeSheetId: TimeSheetId
  };

  try {
      const response = await fetch('/managerRequests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return await response.json();

  } catch(error) {
    console.error(error);
  }


}


function DeclineTimeSheet(TimeSheetId){

}
   