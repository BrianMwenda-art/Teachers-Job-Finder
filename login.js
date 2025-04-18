document.addEventListener('DOMContentLoaded', function() {
    // Teacher login form handling
    const teacherLoginForm = document.getElementById('teacherLoginForm');
    if(teacherLoginForm) {
        teacherLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin('teacher');
        });
    }
    
    // School login form handling
    const schoolLoginForm = document.getElementById('schoolLoginForm');
    if(schoolLoginForm) {
        schoolLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin('school');
        });
    }
    
    // Forgot password links
    document.querySelectorAll('.forgot-password').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showForgotPasswordModal(this.closest('form').id.includes('teacher') ? 'teacher' : 'school');
        });
    });
});

async function handleLogin(userType) {
    const form = userType === 'teacher' ? 
        document.getElementById('teacherLoginForm') : 
        document.getElementById('schoolLoginForm');
    
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    const schoolCode = userType === 'school' ? form.querySelector('#school-code').value : null;
    
    const messageBox = document.getElementById('loginMessage');
    messageBox.style.display = 'none';
    
    // Validate inputs
    if(!email || !password) {
        showMessage(messageBox, 'Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Signing in...';
    submitButton.disabled = true;
    
    try {
        const response = await fetch(`../php/${userType}_login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                school_code: schoolCode
            })
        });
        
        const data = await response.json();
        
        if(data.success) {
            showMessage(messageBox, 'Login successful! Redirecting...', 'success');
            
            // Store user data if needed
            if(data.token) {
                localStorage.setItem(`${userType}Token`, data.token);
            }
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = userType === 'teacher' ? 
                    '../teacher-dash.html' : 
                    '../school-dash.html';
            }, 1500);
        } else {
            showMessage(messageBox, data.message || 'Login failed. Please try again.', 'error');
        }
    } catch(error) {
        console.error('Login error:', error);
        showMessage(messageBox, 'An error occurred. Please try again later.', 'error');
    } finally {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message-box ${type}`;
    element.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

function showForgotPasswordModal(userType) {
    // In a real implementation, this would show a modal
    // For now, we'll just redirect to a password reset page
    window.location.href = `../forgot-password.html?type=${userType}`;
}