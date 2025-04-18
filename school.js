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
            if(sectionId === 'vacancies-section') {
                loadSchoolVacancies();
            } else if(sectionId === 'applicants-section') {
                loadApplicants();
            }
        });
    });
    
    // Modal functionality
    const modal = document.getElementById('vacancy-modal');
    const addBtn = document.getElementById('add-vacancy-btn');
    const closeBtn = document.querySelector('.close-modal');
    
    if(addBtn) {
        addBtn.addEventListener('click', () => modal.style.display = 'block');
    }
    
    if(closeBtn) {
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
    }
    
    window.addEventListener('click', (e) => {
        if(e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Load school vacancies
    async function loadSchoolVacancies() {
        try {
            const response = await fetch('../php/get_school_vacancies.php');
            const vacancies = await response.json();
            const container = document.getElementById('vacancies-list');
            
            container.innerHTML = '';
            if(vacancies.length === 0) {
                container.innerHTML = '<p>No vacancies found. Click "Add New Vacancy" to create one.</p>';
                return;
            }
            
            vacancies.forEach(vacancy => {
                const vacancyCard = document.createElement('div');
                vacancyCard.className = 'vacancy-card';
                vacancyCard.innerHTML = `
                    <div class="vacancy-header">
                        <h4>${vacancy.subject}</h4>
                        <span class="status-badge ${vacancy.status.toLowerCase()}">${vacancy.status}</span>
                    </div>
                    <p><strong>Type:</strong> ${vacancy.position_type}</p>
                    <p><strong>Posted:</strong> ${new Date(vacancy.posted_date).toLocaleDateString()}</p>
                    <p><strong>Applications:</strong> ${vacancy.application_count}</p>
                    <div class="vacancy-actions">
                        <button class="btn-view-applicants" data-id="${vacancy.vacancy_id}">View Applicants</button>
                        <button class="btn-edit-vacancy" data-id="${vacancy.vacancy_id}">Edit</button>
                    </div>
                `;
                container.appendChild(vacancyCard);
            });
        } catch(error) {
            console.error('Error loading school vacancies:', error);
        }
    }
    
    // Load applicants
    async function loadApplicants(vacancyId = '', status = '') {
        try {
            let url = '../php/get_vacancy_applicants.php';
            if(vacancyId || status) {
                url += `?vacancy_id=${vacancyId}&status=${status}`;
            }
            
            const response = await fetch(url);
            const applicants = await response.json();
            const container = document.getElementById('applicants-container');
            
            container.innerHTML = '';
            if(applicants.length === 0) {
                container.innerHTML = '<p>No applicants found.</p>';
                return;
            }
            
            applicants.forEach(applicant => {
                const appCard = document.createElement('div');
                appCard.className = 'applicant-card';
                appCard.innerHTML = `
                    <div class="applicant-header">
                        <h4>${applicant.teacher_name}</h4>
                        <span class="status-badge ${applicant.status.toLowerCase()}">${applicant.status}</span>
                    </div>
                    <p><strong>Applied For:</strong> ${applicant.subject}</p>
                    <p><strong>Applied On:</strong> ${new Date(applicant.application_date).toLocaleDateString()}</p>
                    <div class="applicant-actions">
                        <button class="btn-view-profile" data-id="${applicant.application_id}">View Profile</button>
                        <select class="status-select" data-app-id="${applicant.application_id}">
                            <option value="submitted" ${applicant.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
                            <option value="reviewed" ${applicant.status === 'Reviewed' ? 'selected' : ''}>Reviewed</option>
                            <option value="interview" ${applicant.status === 'Interview' ? 'selected' : ''}>Interview</option>
                            <option value="rejected" ${applicant.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                            <option value="hired" ${applicant.status === 'Hired' ? 'selected' : ''}>Hired</option>
                        </select>
                    </div>
                `;
                container.appendChild(appCard);
            });
        } catch(error) {
            console.error('Error loading applicants:', error);
        }
    }
    
    // Filter applicants
    const filterBtn = document.getElementById('filter-applicants-btn');
    if(filterBtn) {
        filterBtn.addEventListener('click', () => {
            const vacancyId = document.getElementById('vacancy-filter').value;
            const status = document.getElementById('status-filter').value;
            loadApplicants(vacancyId, status);
        });
    }
    
    // Vacancy form submission
    const vacancyForm = document.getElementById('vacancy-form');
    if(vacancyForm) {
        vacancyForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            try {
                const response = await fetch('../php/add_vacancy.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                if(result.success) {
                    alert('Vacancy posted successfully!');
                    modal.style.display = 'none';
                    loadSchoolVacancies();
                } else {
                    alert('Error posting vacancy: ' + result.message);
                }
            } catch(error) {
                console.error('Error:', error);
                alert('An error occurred while posting the vacancy.');
            }
        });
    }
    
    // Initial load
    loadSchoolVacancies();
});