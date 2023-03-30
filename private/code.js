let projects 
window.addEventListener('load', () => {
    fetch('/sesionData')
        .then(response => response.json())
        .then(data => {
            // Do something with session data here
            console.log(data);
            projects = data.projects;
            document.getElementById('timesheetcontainer').innerHTML = rendertimesheettable(projects);
            for(let i=0; i<projects.length; i++){
            newid = i ;
            PopulateDropdownProjects(newid); 
            LinkingDropdowns(newid,projects);
            }
            SumOfCollum();
            SumOffTotalHoursRow();
            SumOfAbsenceHoursRow();
        });
  });

/*When the button with the id="AddRow" is clicked, the function CreateNewRow is
 executed resulting in the creation of a new row*/
const AddRowBtn = document.getElementById("AddRow");
AddRowBtn.addEventListener("click", CreateNewRow);








//A fucntion that dynamicly renders a timesheettable for the given Username
function rendertimesheettable(projects) {

  let timesheettable = `<body><div id="container">
            <table id="timesheet">
                <caption>Time sheet for week 14 for </caption>
                <thead>
                    <tr>
                        <th> Project </th><th>Task</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th><th>Saturday</th><th>Sunday</th>
                    </tr>
                </thead>
                <tbody>`;
        for(let i=0; i<projects.length; i++){
            timesheettable+=`<tr>
                <td> <select name="ProjectsDropdown${i}"  id="ProjectsDropdown${i}">
                <option value="Default">Select a project</option> 
                </select></td>
                
                <td> <select name="TasksDropdown${i}" id="TasksDropdown${i}"></select></td>`;

            timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="monday${i}" value="0" oninput="validity.valid||(value='0');" step="0.5" name="monday${i}" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="tuesday${i}" value="0" oninput="validity.valid||(value='0');" step="0.5" name="tuesday${i}" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="wednesday${i}" value="0" oninput="validity.valid||(value='0');" step="0.5" name="wednesday${i}" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="thursday${i}" value="0" oninput="validity.valid||(value='0');" step="0.5" name="thursday${i}" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="friday${i}"value="0" oninput="validity.valid||(value='0');" step="0.5" name="friday" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="saturday${i}"value="0" oninput="validity.valid||(value='0');" step="0.5" name="saturday${i}" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="sunday${i}"value="0" oninput="validity.valid||(value='0');" step="0.5" name="Sunday${i}" min="0" max="20"></td>`;
            
        }
      timesheettable+=`<tr>
            <td>Meetings</td>
            <td></td>`;
        timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="mondaymeeting" value="0" oninput="validity.valid||(value='0');" step="0.5" name="mondaymeeting" min="0" max="20"></td>`;
        timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="tuesdaymeeting" value="0" oninput="validity.valid||(value='0');" step="0.5" name="tuesdaymeeting" min="0" max="20"></td>`;
        timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="wednesdaymeeting" value="0" oninput="validity.valid||(value='0');" step="0.5" name="wednesdaymeeting" min="0" max="20"></td>`;
        timesheettable+=`<td><input class="inputfield" type="number" placeholder="0"id="thursdaymeeting" value="0" oninput="validity.valid||(value='0');" step="0.5" name="thursdaymeeting" min="0" max="20"></td>`;
        timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="fridaymeeting"value="0" oninput="validity.valid||(value='0');" step="0.5" name="fridaymeeting" min="0" max="20"></td>`;
        timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="saturdaymeeting"value="0" oninput="validity.valid||(value='0');" step="0.5" name="saturdaymeeting" min="0" max="20"></td>`;
        timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="sundaymeeting"value="0" oninput="validity.valid||(value='0');" step="0.5" name="sundaymeeting" min="0" max="20"></td>`;
        timesheettable+=`<tr>
                <td>Absence</td>
                <td></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="mondayAbsence" value="0" oninput="validity.valid||(value='0');" step="0.5" name="mondayAbsence" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="tuesdayAbsence" value="0" oninput="validity.valid||(value='0');" step="0.5" name="tuesdayAbsence" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="wednesdayAbsence" value="0" oninput="validity.valid||(value='0');" step="0.5" name="wednesdayAbsence" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="thursdayAbsence" value="0" oninput="validity.valid||(value='0');" step="0.5" name="thursdayAbsence" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="fridayAbsence"value="0" oninput="validity.valid||(value='0');" step="0.5" name="fridayAbsence" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="saturdayAbsence"value="0" oninput="validity.valid||(value='0');"  step="0.5" name="saturdayAbsence" min="0" max="20" ></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="sundayAbsence"value="0" oninput="validity.valid||(value='0');" step="0.5" name="sundayAbsence" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="TotalAbsence"value="0" oninput="validity.valid||(value='0');" step="0.5" name="TotalAbsence" min="0" max="70" readonly></td>`;
            timesheettable+=`<tr>
            <td>Vacation</td>
            <td>
                </td>`;
        timesheettable+=`<td><input class="inputfield" type="number" id="mondayVacation" value="0" oninput="validity.valid||(value='0');" step="0.5" name="mondayVacation" min="0" max="20"></td>`;
        timesheettable+=`<td><input class="inputfield" type="number" id="tuesdayVacation" value="0" oninput="validity.valid||(value='0');" step="0.5" name="tuesdayVacation" min="0" max="20"></td>`;
        timesheettable+=`<td><input class="inputfield" type="number" id="wednesdayVacation" value="0" oninput="validity.valid||(value='0');" step="0.5" name="wednesdayVacation" min="0" max="20"></td>`;
        timesheettable+=`<td><input class="inputfield" type="number" id="thursdayVacation" value="0" oninput="validity.valid||(value='0');" step="0.5" name="thursdayVacation" min="0" max="20"></td>`;
        timesheettable+=`<td><input class="inputfield" type="number" id="fridayAVacation"value="0" oninput="validity.valid||(value='0');" step="0.5" name="fridayVacation" min="0" max="20"></td>`;
        timesheettable+=`<tr>
            <td></td>
            <td>Total Hours</td>`;
        timesheettable+=`<td><input type="number" id="tuesdaymeeting" value="0" step="0.5" name="tuesday" min="0" max="20" readonly></td>`;
        timesheettable+=`<td><input type="number" id="tuesdaymeeting" value="0" step="0.5" name="tuesday" min="0" max="20" readonly></td>`;
        timesheettable+=`<td><input type="number" id="wednesdaymeeting" value="0" step="0.5" name="wednesday" min="0" max="20" readonly></td>`;
        timesheettable+=`<td><input type="number" id="thursdaymeeting" value="0" step="0.5" name="thursday" min="0" max="20" readonly></td>`;
        timesheettable+=`<td><input type="number" id="fridaymeeting"value="0" step="0.5" name="friday" min="0" max="20" readonly></td>`;
        timesheettable+=`<td><input type="number" id="fridaymeeting"value="0" step="0.5" name="friday" min="0" max="20" readonly></td>`;
        timesheettable += `</tbody></table></div></body>`
        return timesheettable;
      }

      

    
      //a function the will delete the specific row where the corresponding "delete row button" is pressed
      function DeleteRow() {
        //event.target is the element that is clicked
        let td = event.target.parentNode; 
        //tr is the row to be removed
        let tr = td.parentNode; 
        tr.parentNode.removeChild(tr);
    }    
    

    
    

      //A function that will create a new row in the ta
      function CreateNewRow() {


        
        //gets the correct table 
        
        let tabletime = document.getElementById("timesheet");
        let rows = tabletime.rows[1];
        let cell = rows.cells[2];
        let input = cell.getElementsByTagName("input")[0];
        let id = input.id;
        console.log(id);
        let newid = id.split("day")[1];

        
        newid--;
        
        console.log(newid);


        //inserts a new row
        let row = tabletime.insertRow(1);

        //inserts 8 new cells
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);
        let cell7 = row.insertCell(6);
        let cell8 = row.insertCell(7);
        let cell9 = row.insertCell(8);
        let cell10 = row.insertCell(9);
        

        
        //inserts the imput for the different cells
        cell1.innerHTML = `<select name="ProjectsDropdown${newid}" class="ProjectsDropdown" id="ProjectsDropdown${newid}">
                          <option value="Default">Select a project</option> 
                          </select>`;                    
        cell2.innerHTML = ` <select name="TasksDropdown${newid}" id="TasksDropdown${newid}"> </select>`;
        cell3.innerHTML = `<input type="number" id="monday${newid}" value="0" step="0.5" name="monday${newid}" min="0" max="20">`;
        cell4.innerHTML = `<input type="number" id="tuesday${newid}" value="0" step="0.5" name="monday${newid}" min="0" max="20">`;
        cell5.innerHTML = `<input type="number" id="wednesday${newid}" value="0" step="0.5" name="monday${newid}" min="0" max="20">`;
        cell6.innerHTML = `<input type="number" id="thursday${newid}" value="0" step="0.5" name="monday${newid}" min="0" max="20">`;
        cell7.innerHTML = `<input type="number" id="friday${newid}" value="0" step="0.5" name="monday${newid}" min="0" max="20">`;
        cell8.innerHTML = `<input type="number" id="saturday${newid}" value="0" step="0.5" name="monday${newid}" min="0" max="20">`;
        cell9.innerHTML = `<input type="number" id="sunday${newid}" value="0" step="0.5" name="monday${newid}" min="0" max="20">`;
        cell10.innerHTML = `<input type="button" value="Delete Row" onclick="DeleteRow()">`;

      
        PopulateDropdownProjects(newid);
        LinkingDropdowns(newid,projects);
        SumOfCollum();
      }
      

      function LinkingDropdowns(newid, projects){
        
        const projectsnames ={};
        for(let i=0; i<projects.length; i++){
          projectsnames[projects[i].name] =  projects[i].tasks.map(task => task.name);
        }
      
        let projectDropdown = document.getElementById("ProjectsDropdown"+newid);
        let taskDropdown = document.getElementById("TasksDropdown"+newid);
              
        projectDropdown.addEventListener("change", () => {
          let selectedProject = projectDropdown.value;
          let taskOptions = projectsnames[selectedProject].map(task => `<option>${task}</option>`).join("");
                
          taskDropdown.innerHTML = taskOptions;
        });
      }
  

        
        function PopulateDropdownProjects(newid){
        const ProjectsDropdown = document.getElementById("ProjectsDropdown"+newid);
        for(let i=0; i<projects.length; i++){
          let option = document.createElement("OPTION");
          option.innerHTML = projects[i].name;
          option.value = projects[i].name;
          ProjectsDropdown.appendChild(option);
                                         
      }
    } 

  
    

    function PopulateDropdownTasks(id){
    let ProjectsDropdown = document.getElementById("TasksDropdown"+id);
    for(let i=0; i<projects.length; i++){
      for(let j=0; j<projects[i].tasks.length; j++){
        let option = document.createElement("OPTION");
        option.innerHTML = projects[i].tasks[j].name;
        TasksDropdown.appendChild(option);
      }
    }
  }

      // Cells are the x axis rows are the y axis


      //a function that sums up all the values of a collum and inserts the final value as the last cell in the collum
      function SumOfCollum() {
        let tableID = document.getElementById("timesheet");
        let amountOfRows = tableID.rows.length;
        let amountOfCollums = tableID.rows[0].cells.length;
      
        console.log("The Row length is" + amountOfRows);
        console.log("The collum length" + amountOfCollums);
        let totalCollumValue = 0;
        
        for (let i = 2; i < amountOfCollums; i++) {
          for (let j = 1; j < amountOfRows -3; j++) {
            let input = tableID.rows[j].cells[i].querySelector("input[type='number']");
            input.addEventListener('input', SumOfCollum);
            const value = Number(input.value);
            if(!isNaN(value)){
              totalCollumValue += value;  
              }
            
            console.log(totalCollumValue);
          }
          
          tableID.rows[amountOfRows -1].cells[i].querySelector("input[type='number']").value = totalCollumValue;
          totalCollumValue = 0;
        
        
        }
        SumOffTotalHoursRow();
        SumOfAbsenceHoursRow();
      }

      
      
      function SumOffTotalHoursRow(){
        let table = document.getElementById('timesheet');
        let totalrows = table.rows.length;
        let rowlength = document.getElementById("timesheet").rows[totalrows-1].cells.length;
        console.log("se her idiot"+totalrows);
        console.log("rowlength="+rowlength);
        let Totalhourssum = 0
        

        
        for(i=2; i<rowlength-1; i++){
        const input = table.rows[totalrows-1].cells[i].querySelector("input[type=number");
        const value = Number(input.value);
        
        if(!isNaN(value)){
        Totalhourssum += value;  
        }
        }

        table.rows[totalrows-1].cells[rowlength-1].querySelector("input[type='number']").value = Totalhourssum;
        Totalhourssum=0         
        } 
        

        

        function SumOfAbsenceHoursRow(){
  
          let table = document.getElementById('timesheet');
          let totalrows = table.rows.length;
          let rowlength = document.getElementById("timesheet").rows[totalrows-1].cells.length;
          
  
          let totalRowValue = 0;
          for(i=2; i<rowlength-1; i++){
            const input = table.rows[totalrows-3].cells[i].querySelector("input[type=number");
            const value = Number(input.value);
            let cell= table.rows[totalrows-3].cells[i];
            cell.addEventListener('input', SumOfAbsenceHoursRow);

            if(!isNaN(value)){
            totalRowValue+= value;  
            }

          
         
        }
  
          table.rows[totalrows-3].cells[rowlength-1].querySelector("input[type='number']").value = totalRowValue;
          totalRowValue=0;
      }
    
    