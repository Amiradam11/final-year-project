// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// script.js
document.getElementById('get-started').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent default anchor behavior
    const featuresSection = document.getElementById('features');
    const footer = document.querySelector('.footer');
    footer.style.position = "relative"; // Add the 'visible' class
    featuresSection.style.display = "block"; // Add the 'visible' class
    featuresSection.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the section
});