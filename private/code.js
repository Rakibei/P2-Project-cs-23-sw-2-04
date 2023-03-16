
window.addEventListener('load', () => {
    fetch('/sesionData')
        .then(response => response.json())
        .then(data => {
            // Do something with session data here
            console.log(data);
            let projects = data.projects;
            document.getElementById('timesheetcontainer').innerHTML = rendertimesheettable(projects);
            SumOfRow();
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
                
                <td>
                    <select name="" id="tasks">
                        <option value="Task1">Task 1</option>
                        <option value="Task2">Task 2</option>
                        <option value="Task3">Task 3</option>
                        <option value="task4">Task 4</option>
                    </select></td>`;
            timesheettable+=`<td><input type="number" id="monday${i}" value="0" step="0.5" name="monday" min="0" max="20"></td>`;
            timesheettable+=`<td><input type="number" id="tuesday${i}" value="0" step="0.5" name="tuesday" min="0" max="20"></td>`;
            timesheettable+=`<td><input type="number" id="wednesday${i}" value="0" step="0.5" name="wednesday" min="0" max="20"></td>`;
            timesheettable+=`<td><input type="number" id="thursday${i}" value="0" step="0.5" name="thursday" min="0" max="20"></td>`;
            timesheettable+=`<td><input type="number" id="friday${i}"value="0" step="0.5" name="friday" min="0" max="20"></td>`;
  
        }
      timesheettable+=`<tr>
                <td>Absence</td>
                <td>
                    <select name="" id="tasks">
                        <option value="Task1">Sygefravår</option>
                        <option value="Task2">Barnets 1. 
                        sygedag</option>
                    </select></td>`;
            timesheettable+=`<td><input type="number" id="mondaysick" value="0" step="0.5" name="monday" min="0" max="20"></td>`;
            timesheettable+=`<td><input type="number" id="tuesdaysick" value="0" step="0.5" name="tuesday" min="0" max="20"></td>`;
            timesheettable+=`<td><input type="number" id="wednesdaysick" value="0" step="0.5" name="wednesday" min="0" max="20"></td>`;
            timesheettable+=`<td><input type="number" id="thursdaysick" value="0" step="0.5" name="thursday" min="0" max="20"></td>`;
            timesheettable+=`<td><input type="number" id="fridaysick"value="0" step="0.5" name="friday" min="0" max="20"></td>`;
      timesheettable+=`<tr>
            <td>Meetings</td>
            <td></td>`;
        timesheettable+=`<td><input type="number" id="mondaymeeting" value="0" step="0.5" name="monday" min="0" max="20"></td>`;
        timesheettable+=`<td><input type="number" id="tuesdaymeeting" value="0" step="0.5" name="tuesday" min="0" max="20"></td>`;
        timesheettable+=`<td><input type="number" id="wednesdaymeeting" value="0" step="0.5" name="wednesday" min="0" max="20"></td>`;
        timesheettable+=`<td><input type="number" id="thursdaymeeting" value="0" step="0.5" name="thursday" min="0" max="20"></td>`;
        timesheettable+=`<td><input type="number" id="fridaymeeting"value="0" step="0.5" name="friday" min="0" max="20"></td>`;
        timesheettable+=`<tr>
            <td></td>
            <td>Total Hours</td>`;
        timesheettable+=`<td><input type="number" id="tuesdaymeeting" value="0" step="0.5" name="tuesday" min="0" max="20"></td>`;
        timesheettable+=`<td><input type="number" id="tuesdaymeeting" value="0" step="0.5" name="tuesday" min="0" max="20"></td>`;
        timesheettable+=`<td><input type="number" id="wednesdaymeeting" value="0" step="0.5" name="wednesday" min="0" max="20"></td>`;
        timesheettable+=`<td><input type="number" id="thursdaymeeting" value="0" step="0.5" name="thursday" min="0" max="20"></td>`;
        timesheettable+=`<td><input type="number" id="fridaymeeting"value="0" step="0.5" name="friday" min="0" max="20"></td>`;
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
        cell1.innerHTML = ` <select name="" id="ProjectsDropdown">
                            <option value="Default">Default</option>
                            </select>`;
        cell2.innerHTML = ` <select name="" id="tasks">
                            <option value="Default">Default</option>
                            </select>`;
        cell3.innerHTML = `<input type="number" id="mondaymeeting" value="0" step="0.5" name="monday" min="0" max="20">`;
        cell4.innerHTML = `<input type="number" id="mondaymeeting" value="0" step="0.5" name="monday" min="0" max="20">`;
        cell5.innerHTML = `<input type="number" id="mondaymeeting" value="0" step="0.5" name="monday" min="0" max="20">`;
        cell6.innerHTML = `<input type="number" id="mondaymeeting" value="0" step="0.5" name="monday" min="0" max="20">`;
        cell7.innerHTML = `<input type="number" id="mondaymeeting" value="0" step="0.5" name="monday" min="0" max="20">`;
        cell8.innerHTML = `<input type="button" value="Delete Row" onclick="DeleteRow()">`;
        
        PopulateDropdownProjects();

      }
      
      const ProjectsDropdown = document.getElementById("ProjectsDropdown");
      function PopulateDropdownProjects(){
      for(let i=0; i<projects.length; i++){
        let option = document.createElement("OPTION");
        option.innerHTML = projects[i].name;
        option.value = projects[i].name;
        ProjectsDropdown.appendChild(option);
        console.log("ajaj");                                  
      }
    }




      // Cells are the x axis rows are the y axis


      //a function that sums up all the values of a collum and inserts the final value as the last cell in the collum
      function SumOfRow() {
        let tableID = document.getElementById("timesheet");
        let amountOfRows = tableID.rows.length;
        let amountOfCollums = tableID.rows[0].cells.length;
      
        console.log("The Row length is" + amountOfRows);
        console.log("The collum length" + amountOfCollums);
        let totalCollumValue = 0;
        
        for (let i = 2; i < amountOfCollums; i++) {
          for (let j = 1; j < amountOfRows -1; j++) {
            let cell = tableID.rows[j].cells[i].querySelector("input[type='number']");
            cell.addEventListener('input', SumOfRow);
            console.log(cell.value);
            totalCollumValue += parseFloat(cell.value);
          }
          tableID.rows[amountOfRows -1].cells[i].querySelector("input[type='number']").value = totalCollumValue;
          totalCollumValue = 0;
        }
      }
