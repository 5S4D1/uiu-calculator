// Global variables
let allCourses = [];
let filteredCourses = [];
let isBrowseMode = false; // Default to search-only mode
let isTransitioning = false; // Prevent multiple transitions

// DOM elements
let searchInput, searchBtn, resultsContainer, searchContainer, searchBox, browseToggle;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    initializeElements();
    loadCourses();
    setupEventListeners();
    setInitialMode(); // Set initial mode (search-only by default)
});

// Initialize DOM elements
function initializeElements() {
    searchInput = document.getElementById('searchInput');
    searchBtn = document.getElementById('searchBtn');
    resultsContainer = document.getElementById('resultsContainer');
    searchContainer = document.getElementById('searchContainer');
    searchBox = document.getElementById('searchBox');
    browseToggle = document.getElementById('browseToggle');
    
    console.log('Elements found:', {
        searchInput: !!searchInput,
        searchBtn: !!searchBtn,
        resultsContainer: !!resultsContainer,
        searchContainer: !!searchContainer,
        searchBox: !!searchBox,
        browseToggle: !!browseToggle
    });
    
    if (!searchInput || !searchBtn || !resultsContainer || !searchContainer || !searchBox || !browseToggle) {
        console.error('Some elements not found!');
        return;
    }
}

// Set initial mode
function setInitialMode() {
    // Default to search-only mode (toggle off)
    browseToggle.checked = false;
    isBrowseMode = false;
    updateMode();
}

// Update the UI based on current mode with scroll-like animation
async function updateMode() {
    if (isTransitioning) return;
    isTransitioning = true;

    if (isBrowseMode) {
        // Browse mode: shrink search container and show courses
        console.log('Switching to browse mode...');
        
        // Immediately shrink the search container and show courses
        // This creates the smooth scroll-like effect without lag
        searchContainer.classList.remove('search-only');
        resultsContainer.classList.remove('hidden');
        displayCourses(allCourses);
        console.log('Switched to browse mode');
        isTransitioning = false;
        
    } else {
        // Search-only mode: expand search container and hide courses
        console.log('Switching to search-only mode...');
        
        // First, hide the results
        resultsContainer.classList.add('hidden');
        
        // Then expand the search container to full height
        // This ensures the search elements smoothly move from top to center
        setTimeout(() => {
            searchContainer.classList.add('search-only');
            searchInput.value = ''; // Clear search input
            resetSearchBoxBorder(); // Reset border to default
            console.log('Switched to search-only mode');
            isTransitioning = false;
        }, 100);
    }
}

// Reset search box border to default
function resetSearchBoxBorder() {
    searchBox.classList.remove('typing', 'not-found');
}

// Update search box border based on search status
function updateSearchBoxBorder(searchTerm) {
    if (!searchTerm) {
        resetSearchBoxBorder();
        return;
    }
    
    // Check if search term matches any course
    const hasMatches = allCourses.some(course => {
        const courseCode = course.courseCode.toLowerCase();
        const courseTitle = course.courseTitle.toLowerCase();
        return courseCode.includes(searchTerm.toLowerCase()) || courseTitle.includes(searchTerm.toLowerCase());
    });
    
    // Remove existing classes
    searchBox.classList.remove('typing', 'not-found');
    
    if (hasMatches) {
        searchBox.classList.add('typing'); // Green - matches found
    } else {
        searchBox.classList.add('not-found'); // Red - no matches
    }
}

// Load courses from JSON file
async function loadCourses() {
    try {
        console.log('Loading courses from courses.json...');
        const response = await fetch('courses.json');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allCourses = await response.json();
        console.log('Courses loaded:', allCourses.length, 'courses');
        
        // Only display courses if in browse mode
        if (isBrowseMode) {
            displayCourses(allCourses);
        }
        
    } catch (error) {
        console.error('Error loading courses:', error);
        showError('Failed to load courses. Please refresh the page. Error: ' + error.message);
    }
}

// Setup event listeners
function setupEventListeners() {
    if (!searchInput || !searchBtn || !browseToggle) {
        console.error('Cannot setup event listeners - elements not found');
        return;
    }
    
    // Toggle switch event with smooth transition
    browseToggle.addEventListener('change', function() {
        isBrowseMode = this.checked;
        
        // Add a small delay for the toggle animation
        setTimeout(() => {
            updateMode();
        }, 200);
    });
    
    // Search input events for dynamic border
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        updateSearchBoxBorder(searchTerm);
        
        // If search is cleared and we're in search-only mode, smoothly return to center
        if (!searchTerm && !isBrowseMode && !searchContainer.classList.contains('search-only')) {
            // Smoothly return to search-only mode
            resultsContainer.classList.add('hidden');
            setTimeout(() => {
                searchContainer.classList.add('search-only');
            }, 100);
        }
    });
    
    // Search button click
    searchBtn.addEventListener('click', function() {
        console.log('Search button clicked');
        performSearch();
    });
    
    // Enter key in search input
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            console.log('Enter key pressed');
            performSearch();
        }
    });
    
    console.log('Event listeners setup complete');
}

// Perform search
function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    console.log('Searching for:', searchTerm);
    
    if (searchTerm === '') {
        if (isBrowseMode) {
            console.log('Empty search in browse mode, showing all courses');
            displayCourses(allCourses);
        } else {
            console.log('Empty search in search-only mode, returning to center');
            // Smoothly return to search-only mode
            resultsContainer.classList.add('hidden');
            setTimeout(() => {
                searchContainer.classList.add('search-only');
            }, 100);
        }
        resetSearchBoxBorder();
        return;
    }
    
    // Always stay in current mode - don't automatically switch to browse mode
    if (isBrowseMode) {
        // In browse mode: filter and show results
        filteredCourses = allCourses.filter(course => {
            const courseCode = course.courseCode.toLowerCase();
            const courseTitle = course.courseTitle.toLowerCase();
            
            const matchesCode = courseCode.includes(searchTerm);
            const matchesTitle = courseTitle.includes(searchTerm);
            
            return matchesCode || matchesTitle;
        });
        
        console.log('Search results in browse mode:', filteredCourses.length, 'courses found');
        displayCourses(filteredCourses);
    } else {
        // In search-only mode: show results with smooth transition to top
        filteredCourses = allCourses.filter(course => {
            const courseCode = course.courseCode.toLowerCase();
            const courseTitle = course.courseTitle.toLowerCase();
            
            const matchesCode = courseCode.includes(searchTerm);
            const matchesTitle = courseTitle.includes(searchTerm);
            
            return matchesCode || matchesTitle;
        });
        
        console.log('Search results in search-only mode:', filteredCourses.length, 'courses found');
        
        // Show results in search-only mode with smooth transition
        if (filteredCourses.length > 0) {
            // Smoothly transition search container to top (like browse mode)
            searchContainer.classList.remove('search-only');
            
            // Show results after a small delay to allow transition
            setTimeout(() => {
                resultsContainer.classList.remove('hidden');
                displayCourses(filteredCourses);
            }, 300);
        } else {
            showNoResults();
        }
    }
}

// Display courses in cards with expanding animation
function displayCourses(courses) {
    console.log('Displaying', courses.length, 'courses');
    
    if (courses.length === 0) {
        showNoResults();
        return;
    }
    
    const coursesHTML = courses.map(course => createCourseCard(course)).join('');
    resultsContainer.innerHTML = coursesHTML;
    
    // Add expanding animation for course cards
    const cards = resultsContainer.querySelectorAll('.course-card');
    
    // Create intersection observer for expanding animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) translateZ(0) scale(1)';
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe each card with expanding effect
    cards.forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) translateZ(0) scale(0.9)';
        observer.observe(card);
    });
}

// Create course card HTML
function createCourseCard(course) {
    const prerequisiteHTML = course.prerequisite 
        ? `<div class="prerequisite">${course.prerequisite}</div>`
        : '<div class="no-prerequisite">No prerequisites</div>';
    
    const descriptionHTML = course.description 
        ? `<div class="description">${course.description}</div>`
        : '<div class="description">No description available</div>';
    
    return `
        <div class="course-card">
            <div class="course-header">
                <div class="course-code">${course.courseCode}</div>
                <div class="credit-hours">${course.creditHours} Credits</div>
            </div>
            <div class="course-title">${course.courseTitle}</div>
            <div class="course-details">
                <div class="detail-item">
                    <span class="detail-label">Prerequisite:</span>
                    <div class="detail-value">${prerequisiteHTML}</div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Category:</span>
                    <div class="detail-value">${course.courseCategory || 'Not specified'}</div>
                </div>
            </div>
            <div class="detail-item">
                <span class="detail-label">Description:</span>
                <div class="detail-value">${descriptionHTML}</div>
            </div>
        </div>
    `;
}

// Show no results message
function showNoResults() {
    console.log('Showing no results message');
    resultsContainer.innerHTML = `
        <div class="no-results">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>No courses found matching your search.</p>
            <p>Try searching with a different course code or title.</p>
        </div>
    `;
}

// Show error message
function showError(message) {
    console.error('Showing error:', message);
    resultsContainer.innerHTML = `
        <div class="no-results">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>${message}</p>
        </div>
    `;
}

// Utility function to highlight search terms (optional enhancement)
function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}
