// JavaScript for sliding text effect
const slidingText = document.querySelector('.sliding-text');
const textArray = [' Your Online Presence', ' Responsive Websites', ' SEO Optimized Content'];
let textIndex = 0;

function changeText() {
    slidingText.textContent = textArray[textIndex];
    textIndex = (textIndex + 1) % textArray.length;
}

setInterval(changeText, 3000);

// Scroll to Contact section
function scrollToContact() {
    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
}
