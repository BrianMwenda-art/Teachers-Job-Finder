// Shared dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    initTooltips();
    
    // Handle logout button
    const logoutButtons = document.querySelectorAll('.btn-logout, .btn-logout');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    });
    
    // Handle responsive menu toggle for mobile
    initMobileMenu();
});

function initTooltips() {
    // Initialize any tooltips using Tippy.js or similar
    console.log('Tooltips initialized');
}

function logoutUser() {
    // Perform logout via AJAX
    fetch('../php/logout.php', {
        method: 'POST',
        credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            window.location.href = '../index.html';
        } else {
            alert('Logout failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Logout error:', error);
        alert('An error occurred during logout');
    });
}

function initMobileMenu() {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '☰';
    
    const nav = document.querySelector('.navbar .container');
    if(window.innerWidth < 768 && nav) {
        nav.prepend(menuToggle);
        
        menuToggle.addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.toggle('active');
        });
    }
}

// Utility function for showing alerts
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.prepend(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}