


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
      if (CurrentTimeSheet == false) {
        alert("User Has not submited timesheet");
        return;
      }

        console.log(CurrentTimeSheet);
        let TimeSheetHolder = document.getElementById("CurrentTimeSheet");


        TimeSheetHolder.innerHTML="";

        let CurrentPath;
        let k = 0;
        

      const TopInfo = ["Project","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      for (let Info of TopInfo) {
      const td = document.createElement("td");
      const text = document.createTextNode(Info);
      td.appendChild(text);
      TimeSheetHolder.appendChild(td);
}



        for (let i = 0; i < Object.keys(CurrentTimeSheet.tasks).length + Object.keys(CurrentTimeSheet.tasks.projects).length - 1; i++) {
          switch (i) {
            case 0:
              CurrentPath = CurrentTimeSheet.tasks.absance;
              break;
            case 1:
              CurrentPath = CurrentTimeSheet.tasks.meeting;
              break;
            case 2:
              CurrentPath = CurrentTimeSheet.tasks.vaction;
              break;
            case 3:
              CurrentPath = CurrentTimeSheet.tasks.projects[k];
              break;
            default:
              CurrentPath = CurrentTimeSheet.tasks.projects[++k];
              break;
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

          Cell1.textContent = CurrentPath.hours.monday;
          Cell2.textContent = CurrentPath.hours.tuesday;
          Cell3.textContent = CurrentPath.hours.wednesday;
          Cell4.textContent = CurrentPath.hours.thursday;
          Cell5.textContent = CurrentPath.hours.friday;
          Cell6.textContent = CurrentPath.hours.saturday;
          Cell7.textContent = CurrentPath.hours.sunday;


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

        let ButtonHolder = document.getElementById("ButtonHolder");

        ButtonHolder.innerHTML = "";

        let ApproveButton = document.createElement("button");
        let DeclineButton = document.createElement("button");
        
        ApproveButton.id = "ApproveButton";
        DeclineButton.id = "DeclineButton";

        ApproveButton.textContent = "Approve";
        DeclineButton.textContent = "Approve";

        ApproveButton.addEventListener("click",ApproveTimeSheet(CurrentTimeSheet.timeSheetId))
       // DeclineButton.addEventListener("click")

       ButtonHolder.appendChild(ApproveButton);


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
   