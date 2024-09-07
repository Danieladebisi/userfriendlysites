// JavaScript for smooth scrolling
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Animation for hero text change
let heroTexts = ["Web Solutions Tailored to Your Needs", "Innovative Web Design", "Your Partner in Digital Success"];
let currentIndex = 0;

function changeHeroText() {
    document.querySelector(".hero-text").textContent = heroTexts[currentIndex];
    currentIndex = (currentIndex + 1) % heroTexts.length;
}

setInterval(changeHeroText, 4000);
