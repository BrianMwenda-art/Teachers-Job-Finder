document.addEventListener('DOMContentLoaded', function() {
    // Navigation between sections
    const navLinks = document.querySelectorAll('.dashboard-nav a');
    const sections = document.querySelectorAll('.dashboard-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section') + '-section';
            
            // Update active nav link
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected section
            sections.forEach(section => {
                section.classList.remove('active');
                if(section.id === sectionId) {
                    section.classList.add('active');
                }
            });
            
            // Load data if needed
            if(sectionId === 'applications-section') {
                loadApplications();
            }
        });
    });
    
    // Load recommended jobs
    async function loadRecommendedJobs() {
        try {
            const response = await fetch('../php/get_recommended_jobs.php');
            const jobs = await response.json();
            const container = document.getElementById('recommended-jobs-container');
            
            container.innerHTML = '';
            if(jobs.length === 0) {
                container.innerHTML = '<p>No recommended jobs found based on your profile.</p>';
                return;
            }
            
            jobs.forEach(job => {
                const jobCard = document.createElement('div');
                jobCard.className = 'job-card';
                jobCard.innerHTML = `
                    <h4>${job.school_name}</h4>
                    <p><strong>Subject:</strong> ${job.subject}</p>
                    <p><strong>Location:</strong> ${job.district}</p>
                    <button class="btn-apply" data-id="${job.vacancy_id}">Apply Now</button>
                `;
                container.appendChild(jobCard);
            });
        } catch(error) {
            console.error('Error loading recommended jobs:', error);
        }
    }
    
    // Load teacher applications
    async function loadApplications(filter = 'all') {
        try {
            const response = await fetch(`../php/get_teacher_applications.php?filter=${filter}`);
            const applications = await response.json();
            const container = document.getElementById('applications-container');
            
            container.innerHTML = '';
            if(applications.length === 0) {
                container.innerHTML = '<p>No applications found.</p>';
                return;
            }
            
            applications.forEach(app => {
                const appCard = document.createElement('div');
                appCard.className = 'application-card';
                appCard.innerHTML = `
                    <div class="app-header">
                        <h4>${app.school_name}</h4>
                        <span class="status-badge ${app.status.toLowerCase()}">${app.status}</span>
                    </div>
                    <p><strong>Subject:</strong> ${app.subject}</p>
                    <p><strong>Applied:</strong> ${new Date(app.application_date).toLocaleDateString()}</p>
                    <p><strong>Last Update:</strong> ${new Date(app.updated_at).toLocaleDateString()}</p>
                    ${app.status === 'Interview' ? `<button class="btn-view-interview">View Interview Details</button>` : ''}
                `;
                container.appendChild(appCard);
            });
        } catch(error) {
            console.error('Error loading applications:', error);
        }
    }
    
    // Filter applications
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadApplications(this.getAttribute('data-status'));
        });
    });
    
    // Form submission
    const profileForm = document.getElementById('teacher-profile-form');
    if(profileForm) {
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            try {
                const response = await fetch('../php/update_teacher_profile.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                if(result.success) {
                    alert('Profile updated successfully!');
                } else {
                    alert('Error updating profile: ' + result.message);
                }
            } catch(error) {
                console.error('Error:', error);
                alert('An error occurred while updating your profile.');
            }
        });
    }
    
    // Initial load
    loadRecommendedJobs();
});