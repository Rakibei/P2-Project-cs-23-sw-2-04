//This version of CreatePDF include an additional Promise. For whatever reason it seemed
//that the original return function passed before the PDF had been created, which caused the path
//used in Server.js to get a non-functional path. now the path should only be passed on after the PDF
//has been created.
import PDFDocument from 'pdfkit';
import fs from 'fs';

export async function CreatePDFForUser(username,projectData){

    return new Promise((resolve) => { 

        const doc = new PDFDocument();
        const stream = doc.pipe(fs.createWriteStream('./pdf/'+username+'TimeSheet.pdf'));

        stream.on('finish', () => {
            resolve("./pdf/"+username+"TimeSheet.pdf");
        });

        //Size manipulation of the headline
        doc.fontSize(18).text("Allocation of time for "+ username);
        

          doc.fontSize(12);
          doc.moveDown();

          for (let i = 0; i < projectData.length; i++) {
            doc.text(`Project Name: ${projectData[i].name}`,{align: 'left'});
            doc.text(`Start Date: ${projectData[i].startDate.toLocaleString()}`, { align: 'left' });
            doc.text(`End Date: ${projectData[i].endDate.toLocaleString()}`, { align: 'left' });
            doc.text(`Hours Spent: ${projectData[i].hoursSpent}`, { align: 'left' });
            doc.moveDown();
               if (projectData[i].tasks.length > 0) {
                for (let y = 0; y < projectData[i].tasks.length; y++) {
                    doc.text(`Task Name: ${projectData[i].tasks[y].name}`,{align: 'left'});
                    doc.text(`Description: ${projectData[i].tasks[y].description}`,{align: 'left'});
                    doc.text(`Estimate: ${projectData[i].tasks[y].estimate}`,{align: 'left'});
                    doc.moveDown();                    
                }
               }
            
          }
        doc.end();
    });
};


export async function CreatePDFForAdmin(projectData){

    return new Promise((resolve) => { 

        const doc = new PDFDocument();
        const stream = doc.pipe(fs.createWriteStream('./pdf/TimeSheetForAll.pdf'));

        stream.on('finish', () => {
            resolve("./pdf/TimeSheetForAll.pdf");
        });

        //Size manipulation of the headline
        doc.fontSize(18).text("Allocation of time for all users");
        
          doc.fontSize(12);
          doc.moveDown();

          for (let i = 0; i < projectData.length; i++) {
            doc.text(`Project Name: ${projectData[i].name}`,{align: 'left'});
            doc.text(`Start Date: ${projectData[i].startDate.toLocaleString()}`, { align: 'left' });
            doc.text(`End Date: ${projectData[i].endDate.toLocaleString()}`, { align: 'left' });
            doc.text(`Hours Spent: ${projectData[i].hoursSpent}`, { align: 'left' });
            doc.moveDown();
               if (projectData[i].tasks.length > 0) {
                for (let y = 0; y < projectData[i].tasks.length; y++) {
                    doc.text(`Task Name: ${projectData[i].tasks[y].name}`,{align: 'left'});
                    doc.text(`Description: ${projectData[i].tasks[y].description}`,{align: 'left'});
                    doc.text(`Estimate: ${projectData[i].tasks[y].estimate}`,{align: 'left'});
                    doc.moveDown();                    
                }
               }
            
          }
        doc.end();
    });
};
