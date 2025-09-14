// Global variables
let excelData = [];
let newCourseCounter = 0;

// DOM elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
});

// Initialize all event listeners
function initializeEventListeners() {
    // File upload
    dropZone.addEventListener('click', handleDropZoneClick);
    fileInput.addEventListener('change', handleFileUpload);
    
    // Course management
    document.getElementById('add-course-btn').addEventListener('click', addNewCourseForm);
    
    // Exam schedule
    const examScheduleBtn = document.getElementById('exam-schedule');
    if (examScheduleBtn) {
        examScheduleBtn.addEventListener('click', filterExamSchedule);
    }
}

// Handle drop zone click
function handleDropZoneClick() {
    const currentFileInput = document.getElementById('file-input');
    if (currentFileInput) {
        currentFileInput.click();
    }
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Display file info
    displayFileInfo(file);

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const expectedHeaders = ["Dept.", "Course Code", "Course Title", "Section", "Teacher", "Exam Date", "Exam Time", "Room"];
        const actualHeaders = Object.keys(jsonData[0]);
        const isValid = expectedHeaders.every(h => actualHeaders.includes(h));

            if (isValid) {
                excelData = jsonData;
                showMessage("Excel file loaded successfully!", "success");
            } else {
                showMessage("Invalid Excel file format. Please check the headers.", "error");
                removeFileInfo();
            }
        } catch (error) {
            showMessage("Error reading Excel file. Please try again.", "error");
            removeFileInfo();
        }
    };
    reader.readAsArrayBuffer(file);
}

// Display file information
function displayFileInfo(file) {
    const fileSize = (file.size / 1024).toFixed(1) + ' KB';
    
    const fileInfoHTML = `
        <div class="file-info" id="file-info">
            <div class="file-details">
                <i class="fa-solid fa-file-excel file-icon"></i>
                <div class="file-text">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${fileSize}</div>
                </div>
            </div>
            <button type="button" class="remove-file-btn" onclick="removeFile()">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>
    `;
    
    // Hide drop zone and show file info
    dropZone.style.display = 'none';
    
    // Create file info container after drop zone
    const fileInfoContainer = document.createElement('div');
    fileInfoContainer.className = 'file-info-container';
    fileInfoContainer.innerHTML = fileInfoHTML;
    
    dropZone.parentNode.insertBefore(fileInfoContainer, dropZone.nextSibling);
}

// Remove file information
function removeFileInfo() {
    // Remove file info container
    const fileInfoContainer = document.querySelector('.file-info-container');
    if (fileInfoContainer) {
        fileInfoContainer.remove();
    }
    
    // Show drop zone again
    dropZone.style.display = 'flex';
}

// Remove file function
window.removeFile = function() {
    excelData = [];
    const currentFileInput = document.getElementById('file-input');
    if (currentFileInput) {
        currentFileInput.value = '';
    }
    removeFileInfo();
    showMessage("File removed successfully!", "success");
}

// Add new course form
function addNewCourseForm() {
    newCourseCounter++;
    const formId = `new-course-${newCourseCounter}`;
    const formHTML = `
        <div class="course-form" id="${formId}">
            <div class="course-form-header">
                <h5>Course ${newCourseCounter}</h5>
                <button type="button" class="remove-course-btn" onclick="removeNewCourse('${formId}')">Remove</button>
            </div>
            <div class="course-data">
                <div class="input-container">
                    <label for="${formId}-title">Course Title</label>
                    <input type="text" id="${formId}-title" placeholder="Course title">
                </div>
                <div class="input-container">
                    <label for="${formId}-section">Section</label>
                    <input type="text" id="${formId}-section" placeholder="Section">
                </div>
            </div>
        </div>
    `;
    document.getElementById('new-course-form').insertAdjacentHTML('beforeend', formHTML);
}

// Remove course form
window.removeNewCourse = function (formId) {
    document.getElementById(formId).remove();
}

// Show message to user
function showMessage(message, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) existingMessage.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    dropZone.insertAdjacentElement('afterend', messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) messageDiv.remove();
    }, 3000);
}

// Parse room data to extract room numbers and student ID ranges
function parseRoomData(roomText) {
    if (!roomText) return [];
    
    const rooms = [];
    const roomParts = roomText.split(/\s{2,}|\n/).filter(part => part.trim());
    
    roomParts.forEach(part => {
        const trimmed = part.trim();
        if (!trimmed) return;
        
        const roomMatch = trimmed.match(/^(\d+)\s*\(([^)]+)\)$/);
        if (roomMatch) {
            const roomNumber = roomMatch[1];
            const studentRange = roomMatch[2];
            
            const rangeMatch = studentRange.match(/^(\d+)-(\d+)$/);
            if (rangeMatch) {
                rooms.push({
                    roomNumber: roomNumber,
                    startId: parseInt(rangeMatch[1]),
                    endId: parseInt(rangeMatch[2])
                });
            }
        }
    });
    
    return rooms;
}

// Find the correct room for a student ID
function findStudentRoom(roomText, studentId) {
    const rooms = parseRoomData(roomText);
    const studentIdNum = parseInt(studentId);
    
    for (const room of rooms) {
        if (studentIdNum >= room.startId && studentIdNum <= room.endId) {
            return room.roomNumber;
        }
    }
    
    return null;
}

// Get all course data from forms
function getCourseData() {
    const courses = [];
    const courseForms = document.querySelectorAll('.course-form');
    
    courseForms.forEach(form => {
        const titleInput = form.querySelector('input[placeholder="Course title"]');
        const sectionInput = form.querySelector('input[placeholder="Section"]');
        
        if (titleInput && sectionInput && titleInput.value.trim() && sectionInput.value.trim()) {
            courses.push({
                title: titleInput.value.trim(),
                section: sectionInput.value.trim()
            });
        }
    });
    
    return courses;
}

// Filter exam schedule based on user input
function filterExamSchedule() {
    if (excelData.length === 0) {
        showMessage("Please upload an Excel file first!", "error");
        return;
    }
    
    const department = document.getElementById('Dept').value;
    const studentId = document.getElementById('sid').value;
    const courses = getCourseData();
    
    if (!studentId.trim()) {
        showMessage("Please enter your Student ID!", "error");
        return;
    }
    
    if (courses.length === 0) {
        showMessage("Please add at least one course!", "error");
        return;
    }
    
    // Filter data based on department and courses
    const filteredData = excelData.filter(row => {
        const deptMatch = !department || row["Dept."] === department;
        const courseMatch = courses.some(course => 
            row["Course Title"] && row["Course Title"].toLowerCase().includes(course.title.toLowerCase()) &&
            row["Section"] && row["Section"].toLowerCase().includes(course.section.toLowerCase())
        );
        return deptMatch && courseMatch;
    });
    
    // Enhance filtered data with room information
    const enhancedData = filteredData.map(row => {
        const studentRoom = findStudentRoom(row["Room"], studentId);
        return {
            ...row,
            studentRoom: studentRoom,
            roomInfo: row["Room"]
        };
    });
    
    displayExamSchedule(enhancedData, studentId, department);
}

// Display exam schedule results
function displayExamSchedule(data, studentId, department) {
    const existingResults = document.querySelector('.exam-results');
    if (existingResults) existingResults.remove();
    
    if (data.length === 0) {
        showMessage("No exam schedule found for the selected courses!", "error");
        return;
    }
    
    const resultsHTML = `
        <div class="exam-results">
            <div class="results-header">
                <h3>Exam Schedule</h3>
                <div class="student-info">
                    <p><strong>Student ID:</strong> ${studentId}</p>
                    <p><strong>Department:</strong> ${department}</p>
                </div>
                <button type="button" id="download-pdf" class="download-btn">
                    <i class="fa-solid fa-download"></i> Download PDF
                </button>
            </div>
            <div class="results-table">
                <table>
                    <thead>
                        <tr>
                            <th>Course Code</th>
                            <th>Course Title</th>
                            <th>Section</th>
                            <th>Teacher</th>
                            <th>Exam Date</th>
                            <th>Exam Time</th>
                            <th>Your Room</th>
                            <th>Room Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(row => `
                            <tr>
                                <td>${row["Course Code"] || '-'}</td>
                                <td>${row["Course Title"] || '-'}</td>
                                <td>${row["Section"] || '-'}</td>
                                <td>${row["Teacher"] || '-'}</td>
                                <td>${row["Exam Date"] || '-'}</td>
                                <td>${row["Exam Time"] || '-'}</td>
                                <td class="room-cell">
                                    ${row.studentRoom ? 
                                        `<span class="room-number">Room ${row.studentRoom}</span>` : 
                                        '<span class="no-room">Room not found</span>'
                                    }
                                </td>
                                <td class="room-details">
                                    <small>${row.roomInfo || '-'}</small>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    const searchContainer = document.querySelector('.search-container');
    searchContainer.insertAdjacentHTML('afterend', resultsHTML);
    
    document.getElementById('download-pdf').addEventListener('click', () => {
        downloadPDF(data, studentId, department);
    });
    
    showMessage(`Found ${data.length} exam(s) for your courses!`, "success");
    
    // Auto scroll to results
    setTimeout(() => {
        const resultsElement = document.querySelector('.exam-results');
        if (resultsElement) {
            resultsElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }, 500);
}

// Download PDF function using jsPDF
function downloadPDF(data, studentId, department) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('portrait', 'mm', 'a4');
        
        // Add space above header
        const headerY = 15;
        
        // Black header background
        doc.setFillColor(0, 0, 0);
        doc.rect(0, headerY, 210, 15, 'F');
        
        // White header text
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Exam Schedule", 105, headerY + 10, { align: "center" });
        
        // Student info
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Student ID: ${studentId}`, 20, headerY + 25);
        doc.text(`Department: ${department}`, 20, headerY + 32);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 120, headerY + 25);
        
        // Table setup
        const tableStartY = headerY + 40;
        const colWidths = [25, 50, 12, 12, 25, 22, 15];
        const headers = ['Course Code', 'Course Title', 'Section', 'Teacher', 'Exam Date', 'Exam Time', 'Room'];
        
        // Draw table headers with proper positioning
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(0, 0, 0);
        
        let xPos = 20;
        headers.forEach((header, index) => {
            // Draw black rectangle for each header
            doc.rect(xPos - 1, tableStartY - 5, colWidths[index], 7, 'F');
            // Draw header text
            doc.text(header, xPos, tableStartY);
            xPos += colWidths[index];
        });
        
        // Draw table data
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        let yPos = tableStartY + 8;
        
        data.forEach((row, rowIndex) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            
            const rowData = [
                row["Course Code"] || '-',
                row["Course Title"] || '-',
                row["Section"] || '-',
                row["Teacher"] || '-',
                (row["Exam Date"] || '-').replace(/\n/g, ' '),
                row["Exam Time"] || '-',
                row.studentRoom ? `Room ${row.studentRoom}` : 'Not found'
            ];
            
            // Calculate maximum lines needed for this row
            let maxLines = 1;
            rowData.forEach((cellData, colIndex) => {
                const lines = doc.splitTextToSize(cellData, colWidths[colIndex] - 2);
                maxLines = Math.max(maxLines, lines.length);
            });
            
            // Alternating row background with proper height
            if (rowIndex % 2 === 0) {
                doc.setFillColor(240, 240, 240);
                doc.rect(19, yPos - 4, 172, (maxLines * 4) + 4, 'F');
            }
            
            // Draw each cell with proper spacing
            xPos = 20;
            rowData.forEach((cellData, colIndex) => {
                const lines = doc.splitTextToSize(cellData, colWidths[colIndex] - 2);
                lines.forEach((line, lineIndex) => {
                    doc.text(line, xPos + 1, yPos + (lineIndex * 4));
                });
                xPos += colWidths[colIndex];
            });
            
            // Add more space between rows
            yPos += (maxLines * 4) + 8;
        });
        
        // Footer
        doc.setFontSize(8);
        doc.text("Generated by UiU Calculator", 105, 280, { align: "center" });
        
        doc.save(`Exam_Schedule_${studentId}.pdf`);
        showMessage("PDF downloaded successfully!", "success");
        
    } catch (error) {
        console.error("Error generating PDF:", error);
        showMessage("Error generating PDF. Please try again.", "error");
        fallbackPrintPDF(data, studentId, department);
    }
}

// Fallback PDF generation using print
function fallbackPrintPDF(data, studentId, department) {
    const printWindow = window.open('', '_blank');
    
    const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Exam Schedule - ${studentId}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .student-info { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
                .room-number { color: #28a745; font-weight: bold; }
                .no-room { color: #dc3545; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Exam Schedule</h1>
            </div>
            <div class="student-info">
                <p><strong>Student ID:</strong> ${studentId}</p>
                <p><strong>Department:</strong> ${department}</p>
                <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Course Title</th>
                        <th>Section</th>
                        <th>Teacher</th>
                        <th>Exam Date</th>
                        <th>Exam Time</th>
                        <th>Your Room</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            <td>${row["Course Code"] || '-'}</td>
                            <td>${row["Course Title"] || '-'}</td>
                            <td>${row["Section"] || '-'}</td>
                            <td>${row["Teacher"] || '-'}</td>
                            <td>${(row["Exam Date"] || '-').replace(/\n/g, ' ')}</td>
                            <td>${row["Exam Time"] || '-'}</td>
                            <td>${row.studentRoom ? 
                                `<span class="room-number">Room ${row.studentRoom}</span>` : 
                                '<span class="no-room">Room not found</span>'
                            }</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="footer">
                <p>Generated by UiU Calculator</p>
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.open();
    printWindow.document.documentElement.innerHTML = pdfContent;
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 500);
}