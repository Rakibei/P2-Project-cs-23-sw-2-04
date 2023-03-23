let projects 
window.addEventListener('load', () => {
    fetch('/sesionData')
        .then(response => response.json())
        .then(data => {
            // Do something with session data here
            console.log(data);
            projects = data.projects;
            document.getElementById('timesheetcontainer').innerHTML = rendertimesheettable(projects);
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
    function rendertimesheettable (projects){
     
        let timesheettable= `<body>
            <table id="timesheet">
                <caption>Time sheet for week 14 for </caption>
                <thead>
                    <tr>
                        <th> Project </th><th>Task</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th>
                    </tr>
                </thead>
                <tbody>`;
        for(let i=0; i<projects.length; i++){
            timesheettable+=`<tr>
                <td>${projects[i].name}</td>
                
                <td></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" placeholder="0" id="monday${i}" value="0" oninput="validity.valid||(value='0');" step="0.5" name="monday" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" id="tuesday${i}" value="0" oninput="validity.valid||(value='0');" step="0.5" name="tuesday" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" id="wednesday${i}" value="0" oninput="validity.valid||(value='0');" step="0.5" name="wednesday" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" id="thursday${i}" value="0" oninput="validity.valid||(value='0');" step="0.5" name="thursday" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" id="friday${i}"value="0" oninput="validity.valid||(value='0');" step="0.5" name="friday" min="0" max="20"></td>`;
  
        }
      timesheettable+=`<tr>
            <td>Meetings</td>
            <td></td>`;
        timesheettable+=`<td><input class="inputfield" type="number" id="mondaymeeting" value="0" oninput="validity.valid||(value='0');" step="0.5" name="monday" min="0" max="20"></td>`;
        timesheettable+=`<td><input class="inputfield" type="number" id="tuesdaymeeting" value="0" oninput="validity.valid||(value='0');" step="0.5" name="tuesday" min="0" max="20"></td>`;
        timesheettable+=`<td><input class="inputfield" type="number" id="wednesdaymeeting" value="0" oninput="validity.valid||(value='0');" step="0.5" name="wednesday" min="0" max="20"></td>`;
        timesheettable+=`<td><input class="inputfield" type="number" id="thursdaymeeting" value="0" oninput="validity.valid||(value='0');" step="0.5" name="thursday" min="0" max="20"></td>`;
        timesheettable+=`<td><input class="inputfield" type="number" id="fridaymeeting"value="0" oninput="validity.valid||(value='0');" step="0.5" name="friday" min="0" max="20"></td>`;
        timesheettable+=`<tr>
                <td>Absence</td>
                <td>
                    </td>`;
            timesheettable+=`<td><input class="inputfield" type="number" id="mondaysick" value="0" oninput="validity.valid||(value='0');" step="0.5" name="monday" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" id="tuesdaysick" value="0" oninput="validity.valid||(value='0');" step="0.5" name="tuesday" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" id="wednesdaysick" value="0" oninput="validity.valid||(value='0');" step="0.5" name="wednesday" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" id="thursdaysick" value="0" oninput="validity.valid||(value='0');" step="0.5" name="thursday" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" id="fridaysick"value="0" oninput="validity.valid||(value='0');" step="0.5" name="friday" min="0" max="20"></td>`;
            timesheettable+=`<td><input class="inputfield" type="number" id="TotalAbsenceHours"value="0"  step="0.5" name="friday" min="0" max="70" readonly></td>`;
        timesheettable+=`<tr>
            <td></td>
            <td>Total Hours</td>`;
        timesheettable+=`<td><input type="number" id="tuesdaymeeting" value="0" step="0.5" name="tuesday" min="0" max="20" readonly></td>`;
        timesheettable+=`<td><input type="number" id="tuesdaymeeting" value="0" step="0.5" name="tuesday" min="0" max="20" readonly></td>`;
        timesheettable+=`<td><input type="number" id="wednesdaymeeting" value="0" step="0.5" name="wednesday" min="0" max="20" readonly></td>`;
        timesheettable+=`<td><input type="number" id="thursdaymeeting" value="0" step="0.5" name="thursday" min="0" max="20" readonly></td>`;
        timesheettable+=`<td><input type="number" id="fridaymeeting"value="0" step="0.5" name="friday" min="0" max="20" readonly></td>`;
        timesheettable+=`<td><input type="number" id="fridaymeeting"value="0" step="0.5" name="friday" min="0" max="20" readonly></td>`;
        timesheettable += `</tbody></table></body>`
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
    
    

      //A function that will create a new row in the table
      function CreateNewRow() {

        //gets the correct table 
        let tabletime = document.getElementById("timesheet");

        //inserts a new row
        let row = tabletime.insertRow(1);

        //inserts 8 new cells
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);
        
        //inserts the imput for the different cells
        cell1.innerHTML = ` <select name="ProjectsDropdown" id="ProjectsDropdown">

                            </select>`;
        cell2.innerHTML = 
        cell3.innerHTML = `<input type="number" id="mondaymeeting" value="0" step="0.5" name="monday" min="0" max="20">`;
        cell4.innerHTML = `<input type="number" id="mondaymeeting" value="0" step="0.5" name="monday" min="0" max="20">`;
        cell5.innerHTML = `<input type="number" id="mondaymeeting" value="0" step="0.5" name="monday" min="0" max="20">`;
        cell6.innerHTML = `<input type="number" id="mondaymeeting" value="0" step="0.5" name="monday" min="0" max="20">`;
        cell7.innerHTML = `<input type="number" id="mondaymeeting" value="0" step="0.5" name="monday" min="0" max="20">`;
        cell8.innerHTML = `<input type="button" value="Delete Row" onclick="DeleteRow()">`;

        PopulateDropdownProjects();
        SumOfCollum();
      }
      
        
        function PopulateDropdownProjects(){
        const ProjectsDropdown = document.getElementById("ProjectsDropdown");
        for(let i=0; i<projects.length; i++){
          let option = document.createElement("OPTION");
          option.innerHTML = projects[i].name;
          option.value = projects[i].name;
          ProjectsDropdown.appendChild(option);
                                         
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
          for (let j = 1; j < amountOfRows -2; j++) {
            let cell = tableID.rows[j].cells[i].querySelector("input[type='number']");
            cell.addEventListener('input', SumOfCollum);
            totalCollumValue += parseFloat(cell.value);
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
        let totalamountOfCollums = table.rows.length
        let amountOfRows = table.rows[0].cells.length;

        let totalRowValue = 0
        for(i=2; i<=totalamountOfCollums; i++){
        totalRowValue += parseFloat(table.rows[totalamountOfCollums -1].cells[i].querySelector("input[type='number']").value);
        console.log(totalRowValue);
      }

        table.rows[amountOfRows -2].cells[totalamountOfCollums+1].querySelector("input[type='number']").value = totalRowValue;
        totalRowValue=0;  
        

        }

        function SumOfAbsenceHoursRow(){
  
          let table = document.getElementById('timesheet');
          let totalamountOfCollums = table.rows.length
          let amountOfRows = table.rows[0].cells.length;
  
          let totalRowValue = 0
          for(i=2; i<=totalamountOfCollums; i++){
          totalRowValue += parseFloat(table.rows[totalamountOfCollums -2].cells[i].querySelector("input[type='number']").value);
          let cell = table.rows[totalamountOfCollums -2].cells[i];
          cell.addEventListener('input', SumOfAbsenceHoursRow);
         
        }
  
          table.rows[amountOfRows -3].cells[totalamountOfCollums+1].querySelector("input[type='number']").value = totalRowValue;
          totalRowValue=0;
      }
    
    