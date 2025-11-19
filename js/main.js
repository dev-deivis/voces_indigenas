// ========================================
// INDIGENOUS VOICES - MAIN JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality
  initSearch();
  initFilters();
  initTimelineFilters();
  initSmoothScroll();
  initAnimations();
});

// ========================================
// SEARCH FUNCTIONALITY
// ========================================
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.language-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const name = card.dataset.name?.toLowerCase() || '';
      const content = card.textContent.toLowerCase();
      
      if (name.includes(searchTerm) || content.includes(searchTerm)) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    updateResultsCount(visibleCount);
  });
}

// ========================================
// FILTER FUNCTIONALITY
// ========================================
function initFilters() {
  const regionFilter = document.getElementById('regionFilter');
  const endangermentFilter = document.getElementById('endangermentFilter');
  const sortBy = document.getElementById('sortBy');

  if (regionFilter) {
    regionFilter.addEventListener('change', applyFilters);
  }
  if (endangermentFilter) {
    endangermentFilter.addEventListener('change', applyFilters);
  }
  if (sortBy) {
    sortBy.addEventListener('change', applyFilters);
  }
}

function applyFilters() {
  const regionFilter = document.getElementById('regionFilter')?.value || '';
  const endangermentFilter = document.getElementById('endangermentFilter')?.value || '';
  const sortBy = document.getElementById('sortBy')?.value || 'nombre';
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';

  const grid = document.getElementById('languagesGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.language-card'));
  let visibleCards = [];

  cards.forEach(card => {
    const region = card.dataset.region || '';
    const endangerment = card.dataset.endangerment || '';
    const name = card.dataset.name?.toLowerCase() || '';
    const content = card.textContent.toLowerCase();

    let show = true;

    // Apply region filter
    if (regionFilter && region !== regionFilter) {
      show = false;
    }

    // Apply endangerment filter
    if (endangermentFilter && endangerment !== endangermentFilter) {
      show = false;
    }

    // Apply search
    if (searchTerm && !name.includes(searchTerm) && !content.includes(searchTerm)) {
      show = false;
    }

    if (show) {
      card.style.display = 'block';
      visibleCards.push(card);
    } else {
      card.style.display = 'none';
    }
  });

  // Sort visible cards
  sortCards(visibleCards, sortBy, grid);
  updateResultsCount(visibleCards.length);
}

function sortCards(cards, sortBy, grid) {
  cards.sort((a, b) => {
    switch (sortBy) {
      case 'nombre':
        return (a.dataset.name || '').localeCompare(b.dataset.name || '');
      case 'hablantes-asc':
        return parseInt(a.dataset.speakers) - parseInt(b.dataset.speakers);
      case 'hablantes-desc':
        return parseInt(b.dataset.speakers) - parseInt(a.dataset.speakers);
      case 'peligro':
        const order = { 'critico': 1, 'severamente': 2, 'en-peligro': 3 };
        return (order[a.dataset.endangerment] || 4) - (order[b.dataset.endangerment] || 4);
      default:
        return 0;
    }
  });

  // Reorder in DOM
  cards.forEach(card => grid.appendChild(card));
}

function updateResultsCount(count) {
  const countElement = document.querySelector('.featured-container > p');
  if (countElement) {
    countElement.textContent = `${count} Lengua${count !== 1 ? 's' : ''} Encontrada${count !== 1 ? 's' : ''}`;
  }
}

// ========================================
// TIMELINE FILTERS
// ========================================
function initTimelineFilters() {
  const filterButtons = document.querySelectorAll('.timeline-filter');
  if (!filterButtons.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;
      const items = document.querySelectorAll('.timeline-item');

      items.forEach(item => {
        if (filter === 'todos' || item.dataset.category === filter) {
          item.style.display = 'block';
          // Add animation
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 100);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========================================
// ANIMATIONS
// ========================================
function initAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements
  const animatableElements = document.querySelectorAll(
    '.stat-card, .language-card, .timeline-item, .reference-card, .methodology-card'
  );

  animatableElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });

  // Counter animation for stats
  animateCounters();
}

function animateCounters() {
  const counters = document.querySelectorAll('.stat-number, .crisis-stat-number, .bib-stat-value');
  
  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const text = counter.textContent;
        
        // Check if it's a number
        const match = text.match(/^([\d,]+)(\+?)$/);
        if (match) {
          const target = parseInt(match[1].replace(/,/g, ''));
          const suffix = match[2] || '';
          animateNumber(counter, target, suffix);
        }
        
        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

function animateNumber(element, target, suffix = '') {
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 16);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }

  .language-card:hover {
    transform: translateY(-10px) !important;
  }

  .timeline-item {
    transition: all 0.5s ease;
  }

  /* Loading state */
  .loading {
    position: relative;
    overflow: hidden;
  }

  .loading::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    100% {
      left: 100%;
    }
  }

  /* Fade in animation */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fade-in {
    animation: fadeIn 0.6s ease forwards;
  }
`;

document.head.appendChild(style);

// ========================================
// BIBLIOGRAPHY SEARCH
// ========================================
const bibSearchInput = document.getElementById('bibSearchInput');
if (bibSearchInput) {
  bibSearchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.reference-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const content = card.textContent.toLowerCase();
      
      if (content.includes(searchTerm)) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update count
    const countElement = document.querySelector('.references-grid')?.previousElementSibling?.querySelector('p');
    if (countElement) {
      countElement.innerHTML = `<strong>Resultados de búsqueda:</strong> ${visibleCount} referencias`;
    }
  });
}

// ========================================
// MOBILE MENU (if needed)
// ========================================
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}

// ========================================
// UTILITIES
// ========================================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Console welcome message
console.log('%c🪶 Voces Indígenas', 'font-size: 24px; font-weight: bold; color: #8B5A2B;');
console.log('%cPreservando el patrimonio lingüístico de México', 'font-size: 14px; color: #666;');
console.log('%cProyecto académico del Instituto Tecnológico de Oaxaca', 'font-size: 12px; color: #888;');