
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
  
  
    function rendertimesheettable (projects){
     
        let timesheettable= `<body>
            <table id="timesheet">
                <caption>Time sheet for week 14 for ${projects[0].UserName} </caption>
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


      // Cells are the x axis rows are the y axis


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
            totalCollumValue += parseInt(cell.value);
          }
          tableID.rows[amountOfRows -1].cells[i].querySelector("input[type='number']").value = totalCollumValue;
          totalCollumValue = 0;
        }
      }