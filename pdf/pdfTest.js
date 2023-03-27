import PDFDocument from 'pdfkit';
import fs from 'fs';

export async function CreatePDF(username,projectData){

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('./pdf/'+username+'TimeSheet.pdf'));
    doc.text("Time data for "+ username)
    doc.text(JSON.stringify(projectData));
    doc.end();

    return "./pdf/"+username+"TimeSheet.pdf";

}



