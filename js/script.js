document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.committee-slider');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMembers = document.getElementById('modal-members');
    const closeBtn = document.querySelector('.close');
  

    const scrollAmount = 280; // This is the amount to scroll
    const transitionTime = 1000; // Time in ms for the slow transition

    // Function to check if we reached the last or first image
    function checkSliderEnd(direction) {
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        const currentScroll = slider.scrollLeft;

        if (direction === 'next' && currentScroll >= maxScroll) {
            // Smooth transition to the start
            setTimeout(() => {
                slider.scrollTo({
                    left: 0,
                    behavior: 'smooth',
                });
            }, transitionTime);
        } else if (direction === 'prev' && currentScroll <= 0) {
            // Smooth transition to the end
            setTimeout(() => {
                slider.scrollTo({
                    left: maxScroll,
                    behavior: 'smooth',
                });
            }, transitionTime);
        }
    }

    // Slider Navigation
    prevBtn.addEventListener('click', () => {
        slider.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth',
        });

        // Check if the slider is at the start after scrolling
        checkSliderEnd('prev');
    });

    nextBtn.addEventListener('click', () => {
        slider.scrollBy({
            left: scrollAmount,
            behavior: 'smooth',
        });

        // Check if the slider is at the end after scrolling
        checkSliderEnd('next');
    });

    // Automatic Slider
    setInterval(() => {
        nextBtn.click();
    }, 5000);

    // Modal Functionality
    function openModal(committeeType) {
        const committee = committeeData[committeeType];
        if (!committee) return;

        modalTitle.textContent = committee.title;
        
        // Special handling for featured committees
        if (['chief-patrons', 'patrons','honorary-chair','conference-chair','publication-chair','finance-chair','Organizing Co-chair'].includes(committeeType)) {
            modalMembers.innerHTML = committee.members
                .map(member => `
                    <div class="member-card featured">
                        <div class="member-image">
                            <img src="${member.image}" alt="${member.name}">
                        </div>
                        <div class="member-info">
                            <h3>${member.name}</h3>
                            
                            
                            <p>${member.role}</p>
                            ${member.email ? `<p class="email">Email: ${member.email}</p>` : ''}
                        </div>
                    </div>
                `).join('');
        } else {
            // Original handling for other committees
            modalMembers.innerHTML = committee.members
                .map(member => `
                    <div class="member-card">
                        <h3>${member.name}</h3>
                        <p>${member.role}</p>
                        ${member.email ? `<p>Email: ${member.email}</p>` : ''}
                    </div>
                `).join('');
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Event Listeners
    document.querySelectorAll('.committee-card').forEach((card) => {
        card.addEventListener('click', () => {
            const committeeType = card.dataset.committee;
            openModal(committeeType);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
    });
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's a year-only route link (e.g., #2027)
      if (href.match(/^#\d{4}$/)) {
        return; // Let the routing system handle it
      }
      
      // Skip if already handled by jQuery navigation
      if (this.classList.contains('scrollto') || 
          this.closest('.nav-menu') || 
          this.closest('#mobile-nav')) {
        return; // Let jQuery handler take care of it
      }
      
      e.preventDefault();
      const targetId = href;
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Get current year route
        const currentYear = window.getCurrentRoute ? window.getCurrentRoute() : '2027';
        
        // Store year in sessionStorage
        if (currentYear) {
          sessionStorage.setItem('currentYear', currentYear);
        }
        
        // Build hash with year and section (format: #2027-intro)
        const sectionId = targetId.replace('#', '');
        const newHash = '#' + currentYear + '-' + sectionId;
        
        // Update hash
        window.location.hash = newHash;
      }
    });
  });

  // Optional: Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      
      const sections = Array.from(document.querySelectorAll('section'));
      const currentSection = sections.find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      
      if (currentSection) {
        const currentIndex = sections.indexOf(currentSection);
        const nextIndex = e.key === 'ArrowDown' 
          ? Math.min(currentIndex + 1, sections.length - 1)
          : Math.max(currentIndex - 1, 0);
          
        sections[nextIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
