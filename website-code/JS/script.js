const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

menuToggle.addEventListener("click", () => {
    menu.classList.toggle("active");
});

const faqToggle = document.getElementById("faq-toggle");
const faqContent = document.getElementById("faq-content");

if (faqToggle && faqContent) {
    faqToggle.addEventListener("click", () => {
        faqContent.classList.toggle("active");
        faqToggle.textContent = faqContent.classList.contains("active") ? "Hide FAQs" : "Show FAQs";
    });
}

const courseContainer = document.getElementById("course-list");


let allCourses = []; // Store all fetched courses for filtering

if (courseContainer) {
    fetch("package.json/courses.json")
        .then(response => response.json())
        .then(data => {
            const courses = data["Sheet 1"]; 
            allCourses = courses; // Save all courses to the global variable
            renderCourses(allCourses); // Initial render
        })
        .catch(error => console.error('Error fetching course data:', error));
}

// Function to render the filtered courses
function renderCourses(courses) {
    courseContainer.innerHTML = ""; // Clear previous results

    courses.forEach((course) => {
        const courseDiv = document.createElement('div');
        courseDiv.classList.add('course');
        courseDiv.innerHTML = `
            <h3>${course.CourseTitle}</h3>
            <p><strong>Course Award Name:</strong> ${course.CourseAwardName}</p>
            <p><strong>Year Of Entry:</strong> ${course.YearOfEntry}</p>
            <p><strong>Mode Of Attendance:</strong> ${course.ModeOfAttendance}</p>
            <p><strong>Study Length:</strong> ${course.StudyLength}</p>
            <div class="hidden-details">
                <p><strong>Course Type:</strong> ${course.CourseType}</p>
                <p><strong>Course Summary:</strong><br> ${course.CourseSummary}</p>
                <p><strong>Ucas Code:</strong> ${course.UcasCode ? course.UcasCode : "N/A"}</p>
                <p><strong>Ucas Points:</strong> ${course.UcasPoints ? course.UcasPoints : "N/A"}</p>
                <p><strong>Has Foundation Year:</strong> ${course.HasFoundationYear}</p>
                <p><strong>Course Subject:</strong> ${course.CourseSubject}</p>
                <p><strong>No Longer Recruiting:</strong> ${course.NoLongerRecruiting}</p>
            </div>
            <button class="course-toggle">Show More</button>
        `;
        courseContainer.appendChild(courseDiv);
    });

    // Add event listeners to each toggle button to show/hide details
    const toggleButtons = document.querySelectorAll(".course-toggle");
    toggleButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const hiddenDetails = event.target.previousElementSibling;
            hiddenDetails.classList.toggle("active");
            button.textContent = hiddenDetails.classList.contains("active") ? "Show Less" : "Show More";
        });
    });
}

const searchBar = document.getElementById("search-bar");
const courseFilter = document.getElementById("course-filter");

// Function to apply filters
function applyFilters() {
    const searchValue = searchBar.value.toLowerCase();
    const filterValue = courseFilter.value;

    let filteredCourses = allCourses.filter(course => {
        // Check course type if filter is applied
        if (filterValue !== "all" && course.CourseType !== filterValue && course.ModeOfAttendance !== filterValue && course.CourseSubject !== filterValue) {
            return false;
        }
    

        // Check search keyword in CourseTitle or CourseSummary
        const title = course.CourseTitle.toLowerCase();
        const summary = course.CourseSummary.toLowerCase();
        
        return title.includes(searchValue) || summary.includes(searchValue);
    });

    renderCourses(filteredCourses);
}

// Listen to input in search bar
if (searchBar) {
    searchBar.addEventListener("input", applyFilters);
}

// Listen to filter changes
if (courseFilter) {
    courseFilter.addEventListener("change", applyFilters);
}
