document.addEventListener('DOMContentLoaded', function() {
    const vacanciesContainer = document.getElementById('vacancies-container');
    const subjectFilter = document.getElementById('subject');
    const locationFilter = document.getElementById('location');
    const applyFiltersBtn = document.getElementById('apply-filters');
    
    // Fetch vacancies from PHP backend
    async function fetchVacancies(subject = '', location = '') {
        try {
            let url = 'php/get_vacancies.php';
            if (subject || location) {
                url += `?subject=${encodeURIComponent(subject)}&location=${encodeURIComponent(location)}`;
            }
            
            const response = await fetch(url);
            const vacancies = await response.json();
            displayVacancies(vacancies);
        } catch (error) {
            console.error("Error fetching vacancies:", error);
            vacanciesContainer.innerHTML = '<p class="error">Failed to load vacancies. Please try again later.</p>';
        }
    }
    
    function displayVacancies(vacancies) {
        vacanciesContainer.innerHTML = '';
        
        if (vacancies.length === 0) {
            vacanciesContainer.innerHTML = '<p class="no-results">No vacancies match your criteria.</p>';
            return;
        }
        
        vacancies.forEach(vacancy => {
            const vacancyCard = document.createElement('div');
            vacancyCard.className = 'vacancy-card';
            vacancyCard.innerHTML = `
                <h3>${vacancy.school_name}</h3>
                <p><strong>Subject:</strong> ${vacancy.subject}</p>
                <p><strong>Location:</strong> ${vacancy.district}</p>
                <p><strong>Position:</strong> ${vacancy.position_type}</p>
                <p><strong>Posted:</strong> ${new Date(vacancy.posted_date).toLocaleDateString()}</p>
                <div class="requirements">
                    <h4>Requirements:</h4>
                    <p>${vacancy.requirements || 'Not specified'}</p>
                </div>
                <button class="btn-apply" data-id="${vacancy.vacancy_id}">Apply Now</button>
            `;
            vacanciesContainer.appendChild(vacancyCard);
        });
        
        // Add event listeners to apply buttons
        document.querySelectorAll('.btn-apply').forEach(btn => {
            btn.addEventListener('click', function() {
                const vacancyId = this.getAttribute('data-id');
                alert(`Application for vacancy ID: ${vacancyId} would be processed here`);
                // In real implementation, redirect to application form
            });
        });
    }
    
    // Initial load
    fetchVacancies();
    
    // Filter button click
    applyFiltersBtn.addEventListener('click', function() {
        const subject = subjectFilter.value;
        const location = locationFilter.value;
        fetchVacancies(subject, location);
    });
});