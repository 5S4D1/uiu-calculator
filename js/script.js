document.addEventListener('DOMContentLoaded', function () {
    // Grade point mapping for UIU
    const gradePoints = {
        'A': 4.00,
        'A-': 3.67,
        'B+': 3.33,
        'B': 3.00,
        'B-': 2.67,
        'C+': 2.33,
        'C': 2.00,
        'C-': 1.67,
        'D+': 1.33,
        'D': 1.00,
        'F': 0.00
    };

    let newCourseFormCounter = 0;
    let retakeCourseFormCounter = 0;

    // Get container elements
    const newCourseContainer = document.querySelector('.new-course-container');
    const retakeContainer = document.querySelector('.retake-container');
    const newCourseFormsContainer = document.getElementById('new-course-forms');
    const retakeCourseFormsContainer = document.getElementById('retake-course-forms');

    // Button event listeners
    document.getElementById('calculate-button').addEventListener('click', function() {
        calculateCGPA();
        // Show and scroll to result-container
        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            resultContainer.style.display = 'block';
            setTimeout(() => scrollToElementById('result-container'), 100); // Wait for display
        }
    });
    
    document.getElementById('new-course').addEventListener('click', function () {
        showNewCourseContainer();
        // Show and scroll to new-course-forms
        const newCourseForms = document.getElementById('new-course-forms');
        if (newCourseForms) {
            setTimeout(() => scrollToElementById('new-course-forms'), 100);
        }
        if (hasBlankNewCourseForm()) {
            focusFirstBlankNewCourseForm();
            return;
        }
        addNewCourseForm();
    });

    document.getElementById('retake-course').addEventListener('click', function () {
        showRetakeCourseContainer();
        // Show and scroll to retake-course-forms
        const retakeCourseForms = document.getElementById('retake-course-forms');
        if (retakeCourseForms) {
            setTimeout(() => scrollToElementById('retake-course-forms'), 100);
        }
        if (hasBlankRetakeCourseForm()) {
            focusFirstBlankRetakeCourseForm();
            return;
        }
        addRetakeCourseForm();
    });

    document.getElementById('reset-button').addEventListener('click', function() {
        resetCalculator();
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Add course form button listeners
    document.getElementById('add-another-course-btn').addEventListener('click', function () {
        // Check if there are any blank forms first
        if (hasBlankNewCourseForm()) {
            // Focus on the first blank form
            focusFirstBlankNewCourseForm();
            return;
        }
        addNewCourseForm();
    });

    // Add retake course form button listeners
    document.getElementById('add-another-retake-btn').addEventListener('click', function () {
        // Check if there are any blank forms first
        if (hasBlankRetakeCourseForm()) {
            // Focus on the first blank form
            focusFirstBlankRetakeCourseForm();
            return;
        }
        addRetakeCourseForm();
    });

    // Function to show new course container
    function showNewCourseContainer() {
        newCourseContainer.classList.add('active');
        retakeContainer.classList.remove('active');
    }

    // Function to show retake course container
    function showRetakeCourseContainer() {
        retakeContainer.classList.add('active');
        newCourseContainer.classList.remove('active');
    }

    // Function to hide new course container
    function hideNewCourseContainer() {
        newCourseContainer.classList.remove('active');
        clearAllNewCourseForms();
    }

    // Function to hide retake course container
    function hideRetakeCourseContainer() {
        retakeContainer.classList.remove('active');
        clearAllRetakeCourseForms();
    }

    // Function to add new course form
    function addNewCourseForm() {
        newCourseFormCounter++;
        const formId = `new-course-${newCourseFormCounter}`;

        const formHTML = `
            <div class="course-form" id="${formId}">
                <div class="course-form-header">
                    <h5>Course ${newCourseFormCounter}</h5>
                    <button type="button" class="remove-course-btn" onclick="removeNewCourseForm('${formId}')">Remove</button>
                </div>
                <div class="course-form-fields">
                    <div class="course-title">
                        <label for="${formId}-title">Course Title (Optional)</label>
                        <input type="text" id="${formId}-title" placeholder="Enter Course Title">
                    </div>
                    <div class="course-credit">
                        <label for="${formId}-credit">Course Credit *</label>
                        <input type="number" id="${formId}-credit" placeholder="Credit" min="1" max="3" required>
                    </div>
                    <div class="course-grade">
                        <label for="${formId}-grade">Expected Grade *</label>
                        <select id="${formId}-grade" required>
                            <option value="" disabled selected>Select Grade</option>
                            <option value="A">A</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="B-">B-</option>
                            <option value="C+">C+</option>
                            <option value="C">C</option>
                            <option value="C-">C-</option>
                            <option value="D+">D+</option>
                            <option value="D">D</option>
                            <option value="F">F</option>
                        </select>
                    </div>
                </div>
            </div>
        `;

        newCourseFormsContainer.insertAdjacentHTML('beforeend', formHTML);
    }

    // Function to add retake course form
    function addRetakeCourseForm() {
        retakeCourseFormCounter++;
        const formId = `retake-course-${retakeCourseFormCounter}`;

        const formHTML = `
            <div class="course-form" id="${formId}">
                <div class="course-form-header">
                    <h5>Retake Course ${retakeCourseFormCounter}</h5>
                    <button type="button" class="remove-course-btn" onclick="removeRetakeCourseForm('${formId}')">Remove</button>
                </div>
                <div class="retake-form-fields">
                    <div class="course-title">
                        <label for="${formId}-title">Course Title (Optional)</label>
                        <input type="text" id="${formId}-title" placeholder="Enter Course Title">
                    </div>
                    <div class="course-credit">
                        <label for="${formId}-credit">Course Credit *</label>
                        <input type="number" id="${formId}-credit" placeholder="Credit" min="1" max="3" required>
                    </div>
                    <div class="course-grade">
                        <label for="${formId}-old-grade">Previous Grade *</label>
                        <select id="${formId}-old-grade" required>
                            <option value="" disabled selected>Previous Grade</option>
                            <option value="A">A</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="B-">B-</option>
                            <option value="C+">C+</option>
                            <option value="C">C</option>
                            <option value="C-">C-</option>
                            <option value="D+">D+</option>
                            <option value="D">D</option>
                            <option value="F">F</option>
                        </select>
                    </div>
                    <div class="course-grade">
                        <label for="${formId}-new-grade">Expected Grade *</label>
                        <select id="${formId}-new-grade" required>
                            <option value="" disabled selected>Expected Grade</option>
                            <option value="A">A</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="B-">B-</option>
                            <option value="C+">C+</option>
                            <option value="C">C</option>
                            <option value="C-">C-</option>
                            <option value="D+">D+</option>
                            <option value="D">D</option>
                            <option value="F">F</option>
                        </select>
                    </div>
                </div>
            </div>
        `;

        retakeCourseFormsContainer.insertAdjacentHTML('beforeend', formHTML);
    }

    // Make functions global so they can be called from HTML
    window.removeNewCourseForm = function (formId) {
        document.getElementById(formId).remove();
    };

    window.removeRetakeCourseForm = function (formId) {
        document.getElementById(formId).remove();
    };

    function isNewCourseFormEmpty(formId) {
        const title = document.getElementById(`${formId}-title`)?.value.trim() ?? '';
        const credit = document.getElementById(`${formId}-credit`)?.value ?? '';
        const grade = document.getElementById(`${formId}-grade`)?.value ?? '';
        return !title && !credit && !grade;
    }

    function isRetakeCourseFormEmpty(formId) {
        const title = document.getElementById(`${formId}-title`)?.value.trim() ?? '';
        const credit = document.getElementById(`${formId}-credit`)?.value ?? '';
        const oldGrade = document.getElementById(`${formId}-old-grade`)?.value ?? '';
        const newGrade = document.getElementById(`${formId}-new-grade`)?.value ?? '';
        return !title && !credit && !oldGrade && !newGrade;
    }

    function getNewCoursesFromForms() {
        const courses = [];
        const forms = newCourseFormsContainer.querySelectorAll('.course-form');

        for (const form of forms) {
            const formId = form.id;
            if (isNewCourseFormEmpty(formId)) {
                continue;
            }

            const credit = parseFloat(document.getElementById(`${formId}-credit`).value);
            const grade = document.getElementById(`${formId}-grade`).value;

            if (!credit || !grade || credit < 1 || credit > 3) {
                return { courses: null, incompleteFormId: formId };
            }

            const title = document.getElementById(`${formId}-title`).value.trim()
                || `Course ${formId.split('-')[2]}`;

            courses.push({
                title,
                credit,
                grade,
                points: gradePoints[grade]
            });
        }

        return { courses, incompleteFormId: null };
    }

    function getRetakeCoursesFromForms() {
        const courses = [];
        const forms = retakeCourseFormsContainer.querySelectorAll('.course-form');

        for (const form of forms) {
            const formId = form.id;
            if (isRetakeCourseFormEmpty(formId)) {
                continue;
            }

            const credit = parseFloat(document.getElementById(`${formId}-credit`).value);
            const oldGrade = document.getElementById(`${formId}-old-grade`).value;
            const newGrade = document.getElementById(`${formId}-new-grade`).value;

            if (!credit || !oldGrade || !newGrade || credit < 1 || credit > 3) {
                return { courses: null, incompleteFormId: formId };
            }

            const title = document.getElementById(`${formId}-title`).value.trim()
                || `Retake Course ${formId.split('-')[2]}`;

            courses.push({
                title,
                credit,
                oldGrade,
                expectedGrade: newGrade,
                oldPoints: gradePoints[oldGrade],
                expectedPoints: gradePoints[newGrade]
            });
        }

        return { courses, incompleteFormId: null };
    }

    function focusIncompleteCourseForm(formId) {
        const creditInput = document.getElementById(`${formId}-credit`);
        const gradeSelect = document.getElementById(`${formId}-grade`);
        const oldGradeSelect = document.getElementById(`${formId}-old-grade`);
        const newGradeSelect = document.getElementById(`${formId}-new-grade`);

        if (creditInput && !creditInput.value) {
            creditInput.focus();
        } else if (gradeSelect && !gradeSelect.value) {
            gradeSelect.focus();
        } else if (oldGradeSelect && !oldGradeSelect.value) {
            oldGradeSelect.focus();
        } else if (newGradeSelect && !newGradeSelect.value) {
            newGradeSelect.focus();
        } else if (creditInput) {
            creditInput.focus();
        }
    }

    // Helper functions to clear all forms
    function clearAllNewCourseForms() {
        newCourseFormsContainer.innerHTML = '';
        newCourseFormCounter = 0;
    }

    function clearAllRetakeCourseForms() {
        retakeCourseFormsContainer.innerHTML = '';
        retakeCourseFormCounter = 0;
    }

    function calculateCGPA() {
        const currentCGPA = parseFloat(document.getElementById('cgpa').value);
        const completedCredit = parseFloat(document.getElementById('credit').value);

        if (isNaN(currentCGPA) || isNaN(completedCredit)) {
            alert('Please enter valid CGPA and completed credit values');
            return;
        }

        if (currentCGPA < 0 || currentCGPA > 4) {
            alert('CGPA must be between 0 and 4');
            return;
        }

        const newCoursesResult = getNewCoursesFromForms();
        if (newCoursesResult.incompleteFormId) {
            alert('Please complete all course fields or remove incomplete courses.');
            focusIncompleteCourseForm(newCoursesResult.incompleteFormId);
            return;
        }

        const retakeCoursesResult = getRetakeCoursesFromForms();
        if (retakeCoursesResult.incompleteFormId) {
            alert('Please complete all retake course fields or remove incomplete courses.');
            focusIncompleteCourseForm(retakeCoursesResult.incompleteFormId);
            return;
        }

        const currentCourses = newCoursesResult.courses;
        const retakeCourses = retakeCoursesResult.courses;

        // Calculate total quality points from current CGPA
        let totalQualityPoints = currentCGPA * completedCredit;
        let totalCredits = completedCredit;

        // --- Semester GPA calculation ---
        let semesterQualityPoints = 0;
        let semesterCredits = 0;

        // Add new courses
        currentCourses.forEach(course => {
            totalQualityPoints += course.credit * course.points;
            totalCredits += course.credit;
            semesterQualityPoints += course.credit * course.points;
            semesterCredits += course.credit;
        });

        // Handle retake courses (remove old points, add new points)
        retakeCourses.forEach(course => {
            // Remove old course impact
            totalQualityPoints -= course.credit * course.oldPoints;
            // Add new course impact
            totalQualityPoints += course.credit * course.expectedPoints;
            // Credits remain the same for retakes
            semesterQualityPoints += course.credit * course.expectedPoints;
            semesterCredits += course.credit;
        });

        // Calculate new CGPA
        const newCGPA = totalQualityPoints / totalCredits;
        const cgpaChange = newCGPA - currentCGPA;

        // Calculate semester GPA
        let semesterGPA = 0;
        if (semesterCredits > 0) {
            semesterGPA = semesterQualityPoints / semesterCredits;
        }

        // Display results
        displayResults(newCGPA, totalCredits, cgpaChange, semesterCredits, semesterGPA);
    }

    function displayResults(newCGPA, totalCredits, cgpaChange, semesterCredits, semesterGPA) {
        document.getElementById('new-cgpa').textContent = newCGPA.toFixed(2);
        document.getElementById('total-credits').textContent = totalCredits;
        document.getElementById('semester-credits').textContent = semesterCredits;
        document.getElementById('semester-gpa').textContent = semesterGPA.toFixed(2);
        document.getElementById('cgpa-change').textContent = cgpaChange >= 0 ? '+' + cgpaChange.toFixed(2) : cgpaChange.toFixed(2);

        // Color code the change and border
        const changeElement = document.getElementById('cgpa-change');
        const resultContainer = document.getElementById('result-container');
        if (cgpaChange > 0) {
            changeElement.style.color = 'green';
            resultContainer.style.borderColor = 'green';
        } else if (cgpaChange < 0) {
            changeElement.style.color = 'red';
            resultContainer.style.borderColor = 'red';
        } else {
            changeElement.style.color = 'orange';
            resultContainer.style.borderColor = 'orange';
        }

        // Show results container
        resultContainer.style.display = 'block';

        updateStatusContainer(newCGPA, cgpaChange);
        document.getElementById('status-container').style.display = 'block';
    }

    function updateStatusContainer(newCGPA, cgpaChange) {
        const statusIcon = document.getElementById('status-icon');
        const statusCompliment = document.getElementById('status-compliment');
        const cgpaValue = document.getElementById('cgpa-value');
        const cgpaProgress = document.getElementById('cgpa-progress');

        // Icon: up or down arrow
        if (cgpaChange > 0.01) {
            statusIcon.innerHTML = '<img src="asset/increase.png" alt="Up" style="width: 60px; height: 60px;">';
        } else if (cgpaChange < -0.01) {
            statusIcon.innerHTML = '<img src="asset/decrease.png" alt="Up" style="width: 60px; height: 60px;">';
        } else {
            statusIcon.innerHTML = '<img src="asset/rise.png" alt="Up" style="width: 60px; height: 60px;">';
        }

        // Compliment text based on CGPA
        let compliment = '';
        if (newCGPA >= 3.85) compliment = "Outstanding! Keep it up!";
        else if (newCGPA >= 3.55) compliment = "Excellent work!";
        else if (newCGPA >= 3.10) compliment = "Good job, keep improving!";
        else if (newCGPA >= 2.75) compliment = "You're doing okay, aim higher!";
        else if (newCGPA >= 2.50) compliment = "Needs improvement, don't give up!";
        else compliment = "At risk. Seek help and work hard!";

        statusCompliment.textContent = compliment;

        // CGPA value
        cgpaValue.textContent = newCGPA.toFixed(2);

        // Circle progress (out of 4.00)
        const percent = Math.max(0, Math.min(1, newCGPA / 4));
        const circleLength = 2 * Math.PI * 30; // r=30
        cgpaProgress.style.strokeDasharray = circleLength;
        cgpaProgress.style.strokeDashoffset = circleLength * (1 - percent);
    }

    function resetCalculator() {
        // Clear all input fields
        document.getElementById('cgpa').value = '';
        document.getElementById('credit').value = '';

        // Hide all containers and clear forms
        hideNewCourseContainer();
        hideRetakeCourseContainer();

        // Hide results
        document.getElementById('result-container').style.display = 'none';
        document.getElementById('status-container').style.display = 'none';
    }

    // Input validation helpers
    function validateInput(input, min, max) {
        const value = parseFloat(input.value);
        if (isNaN(value) || value < min || value > max) {
            input.style.borderColor = 'red';
            return false;
        }
        input.style.borderColor = '#ccc';
        return true;
    }

    // Add real-time validation
    document.getElementById('cgpa').addEventListener('input', function () {
        validateInput(this, 0, 4);
    });

    document.getElementById('credit').addEventListener('input', function () {
        validateInput(this, 0, 200);
    });

    // Helper function to check if there are any blank new course forms
    function hasBlankNewCourseForm() {
        const forms = newCourseFormsContainer.querySelectorAll('.course-form');
        for (let form of forms) {
            const formId = form.id;
            const creditInput = document.getElementById(`${formId}-credit`);
            const gradeSelect = document.getElementById(`${formId}-grade`);

            // Check if required fields are empty
            if (!creditInput.value || !gradeSelect.value) {
                return true;
            }
        }
        return false;
    }

    // Helper function to check if there are any blank retake course forms
    function hasBlankRetakeCourseForm() {
        const forms = retakeCourseFormsContainer.querySelectorAll('.course-form');
        for (let form of forms) {
            const formId = form.id;
            const creditInput = document.getElementById(`${formId}-credit`);
            const oldGradeSelect = document.getElementById(`${formId}-old-grade`);
            const newGradeSelect = document.getElementById(`${formId}-new-grade`);

            // Check if required fields are empty
            if (!creditInput.value || !oldGradeSelect.value || !newGradeSelect.value) {
                return true;
            }
        }
        return false;
    }

    // Helper function to focus on the first blank form
    function focusFirstBlankNewCourseForm() {
        const forms = newCourseFormsContainer.querySelectorAll('.course-form');
        for (let form of forms) {
            const formId = form.id;
            const creditInput = document.getElementById(`${formId}-credit`);
            const gradeSelect = document.getElementById(`${formId}-grade`);

            if (!creditInput.value) {
                creditInput.focus();
                return;
            } else if (!gradeSelect.value) {
                gradeSelect.focus();
                return;
            }
        }
    }

    // Helper function to focus on the first blank retake form
    function focusFirstBlankRetakeCourseForm() {
        const forms = retakeCourseFormsContainer.querySelectorAll('.course-form');
        for (let form of forms) {
            const formId = form.id;
            const creditInput = document.getElementById(`${formId}-credit`);
            const oldGradeSelect = document.getElementById(`${formId}-old-grade`);
            const newGradeSelect = document.getElementById(`${formId}-new-grade`);

            if (!creditInput.value) {
                creditInput.focus();
                return;
            } else if (!oldGradeSelect.value) {
                oldGradeSelect.focus();
                return;
            } else if (!newGradeSelect.value) {
                newGradeSelect.focus();
                return;
            }
        }
    }

    // Utility function for smooth scroll to an element by id
    function scrollToElementById(id) {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});
