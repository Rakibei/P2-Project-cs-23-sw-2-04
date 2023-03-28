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

        doc.fontSize(18).text("Allocation of time for "+ username);

        doc.fontSize(12).text(JSON.stringify(projectData));
        doc.end();
    });
};

