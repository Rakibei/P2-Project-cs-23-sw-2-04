import XLSX from 'xlsx'
import fs from 'fs';
import { execFile } from 'child_process';

export async function CreateXLSX(username, projectData, TaskData){
    return new Promise((resolve) => {

        const workBook = new XLSX.utils.book_new();

        const projectSheet = XLSX.utils.json_to_sheet(projectData);
        XLSX.utils.book_append_sheet(workBook, projectSheet, 'Projects');

        const taskSheet = XLSX.utils.json_to_sheet(TaskData);
        XLSX.utils.book_append_sheet(workBook, taskSheet, 'Tasks');

        const filePath = './xlsx/'+username+'TimeSheet.xlsx';

        XLSX.writeFile(workBook, filePath);

        resolve(filePath);

    });
};

export async function CreateXLSXForAllProjects(projects){
    return new Promise((resolve) => {
    const workBook = new XLSX.utils.book_new();
    for (let i = 0; i < projects.length; i++) {
    const projectSheet = XLSX.utils.json_to_sheet([projects[i].project]);
    // append the tasks to the project sheet
    XLSX.utils.sheet_add_json(projectSheet, projects[i].tasksForProject.flat(), {skipHeader: false, origin: -1});
    XLSX.utils.book_append_sheet(workBook, projectSheet, `Projects${i}`);
    }
    const filePath = './xlsx/'+'TimeSheetForAllProjects.xlsx';
    XLSX.writeFile(workBook, filePath);
   
    resolve(filePath);
   
    });
   };
   
   


/*xport async function ConvertJsonToExcel(json, name) {

    const workSheet=XLSX.utils.json_to_sheet(json)
    const workBook=XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workBook, workSheet, name)

    XLSX.write(workBook,{bookType: 'xlsx', type: 'buffer'})
    
    XLSX.write(workBook,{bookType: 'xlsx', type: 'binary'})

    XLSX.writeFile(workBook, "./xlsx/" + name + ".xlsx")


    return "./xlsx/" + name + ".xlsx"


}*/

