//This version of CreatePDF include an additional Promise. For whatever reason it seemed
//that the original return function passed before the PDF had been created, which caused the path
//used in Server.js to get a non-functional path. now the path should only be passed on after the PDF
//has been created.
import PDFDocument from 'pdfkit';
import fs from 'fs';

export async function CreatePDF(username,projectData, TaskData){
    return new Promise((resolve) => { 

        const doc = new PDFDocument();
        const stream = doc.pipe(fs.createWriteStream('./pdf/'+username+'TimeSheet.pdf'));

        stream.on('finish', () => {
            resolve("./pdf/"+username+"TimeSheet.pdf");
        });

        //Size manipulation of the headline
        doc.fontSize(18).text("Allocation of time for "+ username);
        
        //layout and size manipulation of the text from projectData.
        /*const formattedData = projectData.map(project => { //we omitted the previous stringify function, since that data resisted manipulation.
            return `
            Project Name: ${project.name}\n
            Start Date: ${project.startDate}\n
            End Date: ${project.endDate}\n
            Hours Spent: ${project.hoursSpent}`;
          });
          //doc.moveDown(); //simply create a gap between headline and body.
          //doc.fontSize(12).text(formattedData.join('\n\n'));*/

          doc.fontSize(12);
          doc.moveDown();
          projectData.forEach(project => {

            
            doc.text(`Project Name: ${project.name}`,{align: 'left'});
            doc.text(`Start Date: ${project.startDate.toLocaleString()}`, { align: 'left' });
            doc.text(`End Date: ${project.endDate.toLocaleString()}`, { align: 'left' });
            doc.text(`Hours Spent: ${project.hoursSpent}`, { align: 'left' });
            doc.moveDown();
                TaskData.forEach(task => {
                    doc.text(`Task Name: ${task.name}`,{align: 'left'});
                    doc.text(`Description: ${task.description}`,{align: 'left'});
                    doc.text(`Estimate: ${task.estimate}`,{align: 'left'});
                    doc.moveDown();
                });
          });

        /*const formattedTask = TaskData.map(task => { 
            return `Task Name: ${task.name}\nDescription: ${task.description}\nEstimate: ${task.estimate}`;
          });
          doc.moveDown(); 
          doc.fontSize(12).text(formattedTask.join('\n\n'));*/

        doc.end();
    });
};


