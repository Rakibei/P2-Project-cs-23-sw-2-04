
window.addEventListener('load', () => {
  fetch('/sesionData')
      .then(response => response.json())
      .then(data => {
          // Do something with session data here
          console.log(data);
          let projects = data.projects;
          document.getElementById('timesheetcontainer').innerHTML = rendertimesheettable(projects);
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
          timesheettable+=`<td><input type="number" id="monday${i}" name="monday" min="10" max="100"></td>`;
          timesheettable+=`<td><input type="number" id="tuesday${i}" name="tuesday" min="10" max="100"></td>`;
          timesheettable+=`<td><input type="number" id="wednesday${i}" name="wednesday" min="10" max="100"></td>`;
          timesheettable+=`<td><input type="number" id="thursday${i}" name="thursday" min="10" max="100"></td>`;
          timesheettable+=`<td><input type="number" id="friday${i}" name="friday" min="10" max="100"></td>`;

      }
      timesheettable += `</tbody></table></body>`
      return timesheettable;
    }