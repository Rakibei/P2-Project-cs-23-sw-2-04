//This version of CreatePDF include an additional Promise. For whatever reason it seemed
//that the original return function passed before the PDF had been created, which caused the path
//used in Server.js to get a non-functional path. now the path should only be passed on after the PDF
//has been created.
import PDFDocument from 'pdfkit';
import fs from 'fs';

export async function CreatePDF(username,projectData){
    return new Promise((resolve) => { // The

        const doc = new PDFDocument();
        const stream = doc.pipe(fs.createWriteStream('./pdf/'+username+'TimeSheet.pdf'));

        stream.on('finish', () => {
            resolve("./pdf/"+username+"TimeSheet.pdf");
        });

        //Size manipulation of the headline
        doc.fontSize(18).text("Allocation of time for "+ username);
        
        //layout and size manipulation of the text from projectData.
        const formattedData = projectData.map(project => { //we omitted the previous stringify function, since that data resisted manipulation.
            return `Project Name: ${project.name}\nDescription: ${project.description}\nBudget: ${project.budget}`;
          });
          doc.moveDown(); //simply create a gap between headline and body.
          doc.fontSize(12).text(formattedData.join('\n\n'));

        doc.end();
    });
};


