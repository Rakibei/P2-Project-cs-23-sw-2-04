import XLSX from 'xlsx'


export async function ConvertJsonToExcel(json, name) {

    const workSheet=XLSX.utils.json_to_sheet(json)
    const workBook=XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workBook, workSheet, name)

    XLSX.write(workBook,{bookType: 'xlsx', type: 'buffer'})
    
    XLSX.write(workBook,{bookType: 'xlsx', type: 'binary'})

    XLSX.writeFile(workBook, "./xlsx/" + name + ".xlsx")


    return "./xlsx/" + name + ".xlsx"


}

