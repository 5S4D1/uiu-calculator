
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
uiu-cgpa-calculator/
├── index.html             # Main HTML file
├── courseRequisite.html   # Course Requisite file
├── tuitionFee.html        # Tuition Fee file
├── script                 # JavaScript functionality
|   ├── courseRequisite.js
|   ├── script.js
|   └── tuitionFee.js
├── style/                 # CSS styling
|   ├── courseRequisite.css
|   ├── style.css
|   └── tuitionFee.css
├── README.md              # Documentation
└── asset/
    ├── icon.ico           # Favicon
    ├── increase.png       # UI icon
    ├── decrease.png       # UI icon
    └── rise.png           # UI icon
```

## Future Enhancements

- [ ] Save calculation history
- [ ] Export results to PDF
- [ ] Semester-wise breakdown
- [ ] GPA trend analysis

## Contributing

Contributions are welcome! Feel free to fork this project and submit pull requests for improvements or new features.


## License

This project is open source and available under the MIT License.
