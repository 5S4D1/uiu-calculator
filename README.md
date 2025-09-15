
# UIU Calculator

A modern, user-friendly CGPA calculator designed for United International University (UIU) students. Easily calculate your cumulative grade point average (CGPA) based on your current academic record, new courses, and retake scenarios—all in a responsive web app with real-time validation and a clean interface.


## Features

- **Current CGPA Calculation**: Enter your current CGPA and completed credit hours
- **Add New Courses**: Add multiple new courses with credit hours (1-3) and expected grades
- **Retake Course Calculation**: Instantly see the impact of retaking courses on your CGPA
- **Real-time Validation**: Input validation with instant visual feedback
- **Responsive Design**: Seamless experience on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations and intuitive controls


## How to Use

### CGPA Calculator
1. **Enter Current Information**
   - Input your current CGPA (0-4 scale)
   - Enter your completed credit hours

2. **Add New Courses** *(Optional)*
   - Enter course title, credit hours (1-3), and expected grade
   - Click **Add New Course** to include it in the calculation
   - Repeat for multiple courses

3. **Add Retake Courses** *(Optional)*
   - Enter course title and credit hours
   - Select your previous grade and expected new grade
   - Click **Add Retake Course** to include it in the calculation

4. **Calculate**
   - Click **Calculate CGPA** to see your new CGPA
   - View the results, including CGPA change and total credits

5. **Reset**
   - Click **Reset** to clear all inputs and start over


### Prerequisites

1. **Search**
   - Search by **Course Title**
   - Search by **Course Code**

2. **Show All Courses**
   - *Enable* this **Button** show all courses have in **DB**.

3. **Show Course**
   - Course Code
   - Course Title
   - Credit Hours
   - Prerequisite Course
   - Course Category
   - Department Name
   - Description of Course


### Tuition Fee Calculator
1. **Enter Course Credits**

2. **Enter *Retake Course* Credits** if you have!
   - Only **first time** retake course.

3. **Enter Per Credit Fee (৳)**

4. **Enter Semester/Trimester Fee (৳)**

5. **Select Waiver** if you have!

6. **Select Scholarship** if you have!


### Exam Schedule
1. **Upload** ```.xlsx``` file that provide by university for Mid or Final exam.

2. Enter your **student id**

3. *click* **Add Course** button
   - Enter your **course title** and **section** and *click* **Exam Schedule**

4. If you want to download your schedule *click* **Download PDF** button.

## UIU Grading Scale

| Grade | Grade Points | Marks Range | Assessment    |
|-------|--------------|-------------|---------------|
| A     | 4.00         | 90-100      | Outstanding   |
| A-    | 3.67         | 86-89       | Excellent     |
| B+    | 3.33         | 82-85       | Very Good     |
| B     | 3.00         | 78-81       | Good          |
| B-    | 2.67         | 74-77       | Above Average |
| C+    | 2.33         | 70-73       | Average       |
| C     | 2.00         | 66-69       | Below Average |
| C-    | 1.67         | 62-65       | Poor          |
| D+    | 1.33         | 58-61       | Very poor     |
| D     | 1.00         | 55-57       | Pass          |
| F     | 0.00         | <55         | Fail          |


## Technical Details

- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **Frameworks/Libraries**: None (pure vanilla JavaScript)
- **Responsive**: Mobile-first design
- **Browser Support**: All modern browsers


## Getting Started

1. **Clone or download** this repository
2. Open `index.html` in any modern web browser
3. Start calculating your CGPA instantly—no installation required!


## File Structure

```
uiu-calculator/
├── index.html                # Main HTML file
├── prerequisite.html         # Prerequisite courses page
├── schedule.html             # Class schedule page
├── tuitionFee.html           # Tuition Fee calculator page
├── courses.json              # Course data (DB)
├── js/                       # JavaScript functionality
│   ├── navigation.js         # Navigation bar logic
│   ├── prerequisite.js       # Prerequisite logic
│   ├── schedule.js           # Schedule logic
│   ├── script.js             # CGPA calculator logic
│   └── tuitionFee.js         # Tuition fee logic
├── style/                    # CSS styling
│   ├── footer.css            # Footer styles
│   ├── navigation.css        # Navigation bar styles
│   ├── prerequisite.css      # Prerequisite styles
│   ├── schedule.css          # Schedule styles
│   ├── style.css             # Main styles
│   └── tuitionFee.css        # Tuition fee styles
├── README.md                 # Documentation
├── LICENSE                   # License file
└── asset/                    # Images and icons
   ├── icon.ico              # Favicon
   ├── increase.png          # UI icon
   ├── decrease.png          # UI icon
   ├── rise.png              # UI icon
   └── footerLogo.svg        # Footer logo
```

## Future Enhancements

- [ ] Save calculation history
- [ ] Export results to PDF
- [ ] Add other department course data.

## Contributing

Contributions are welcome! Feel free to fork this project and submit pull requests for improvements or new features.


## License

This project is open source and available under the MIT License.
