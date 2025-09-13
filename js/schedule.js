const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');

// file input is hidden; When the drop zone is clicked, the file input is clicked.
dropZone.addEventListener('click', () => {
    fileInput.click();
})

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
        console.log(`File name: ${file.name}`);
        console.log(`File size: ${file.size}`);
    }
    else return;

    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const expectedHeaders = ["Dept.", "Course Code", "Course Title", "Section", "Teacher", "Exam Date", "Exam Time", "Room"];
        const actualHeaders = Object.keys(jsonData[0]);

        const isValid = expectedHeaders.every(h => actualHeaders.includes(h));
        console.log("✅ Headers valid:", isValid);

        console.log("Excel data: ", jsonData);
        jsonData.forEach((row) => {
            console.log(`${row["Course Code"]} - ${row["Section"]} - ${row["Exam Date"]} at ${row["Exam Time"]} room ${row["Room"]}`);
        });
    };

    reader.readAsArrayBuffer(file);
});