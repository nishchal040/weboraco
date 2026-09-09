// EmailJS message sender
function sendmail() {
    const params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };

    emailjs
        .send("service_qpdunv7", "template_8jomi5v", params)
        .then(() => {
            alert("Message sent successfully! We will get back to you shortly.");
            const form = document.querySelector("form");
            if (form) form.reset();
        })
        .catch((error) => {
            alert("Failed to send message. Please email us directly at info.webora.co@gmail.com");
            console.error(error);
        });
}

// Mobile Menu Controls
function showmenu() {
    const menu = document.getElementById('nav-menu') || document.getElementById('list') || document.getElementById('menu');
    if (menu) {
        menu.classList.add("active");
        document.body.style.overflow = 'hidden';
    }
}

function closemenu() {
    const menu = document.getElementById('nav-menu') || document.getElementById('list') || document.getElementById('menu');
    if (menu) {
        menu.classList.remove("active");
        document.body.style.overflow = '';
    }
}

// Back to Top smooth scroll
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Global DOM Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('nav.navbar') || document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 30) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Close mobile menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-list a, .menu ul a, #list a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closemenu();
        });
    });
});

// FAQ Accordion Toggle
function toggleFaq(button) {
    const faqItem = button.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const isOpen = faqItem.classList.contains('open');

    // Close other open items for cleaner UX
    const allItems = document.querySelectorAll('.faq-item');
    allItems.forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('open');
            const otherAnswer = item.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
            const otherBtn = item.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
    });

    if (isOpen) {
        faqItem.classList.remove('open');
        answer.style.maxHeight = null;
        button.setAttribute('aria-expanded', 'false');
    } else {
        faqItem.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        button.setAttribute('aria-expanded', 'true');
    }
}