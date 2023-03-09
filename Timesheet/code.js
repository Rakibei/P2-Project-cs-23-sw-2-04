let project1 = {
    projectID: 12351,
    name: "p1",
    startDate: 19.02,
    EndDate: 20.12,
    UserIDs: [1234,23321],
    UserName: "Daniel"
  }
  let project2 = {
    projectID:12351,
    name:"p2",
    startDate:19.02,
    EndDate:20.12,
    UserIDs:[1234,23321],
    UserName:"Daniel"
  }
  let project3 = {
    projectID:123511,
    name:"p3",
    startDate:19.02,
    EndDate:20.12,
    UserIDs:[1234,23321],
    UserName:"Daniel"
  }
  let project4 = {
    projectID:123521,
    name:"p4",
    startDate:19.02,
    EndDate:20.12,
    UserIDs:[1234,23321],
    UserName:"Daniel"
  }
  let projects = [project1,project2,project3,project4]
  
  document.getElementById('timesheetcontainer').innerHTML = rendertimesheettable(projects);

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