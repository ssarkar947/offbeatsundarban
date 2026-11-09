/**
 * OFFBEAT SUNDARBAN TOUR - INTERACTIVE CONTROLLER
 * Naturalist Expedition System & Interactive Trip Planner
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderScroll();
  initDestinationTabs();
  initItineraryAccordions();
  initWildlifeFilter();
  initTripCalculator();
  initBookingForm();
});

/* Mobile Navigation Toggle */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

/* Header sticky shadow on scroll */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* Destination Tabs (Buriridabri, JhingeKhali, HariKhali, Kumirmari) */
function initDestinationTabs() {
  const tabBtns = document.querySelectorAll('.dest-tab-btn');
  const panels = document.querySelectorAll('.dest-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-dest');

      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById(`dest-${targetId}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });
}

/* Day-by-Day Itinerary Accordions */
function initItineraryAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const currentItem = header.parentElement;
      const isOpen = currentItem.classList.contains('open');

      if (isOpen) {
        currentItem.classList.remove('open');
      } else {
        const parentAccordion = currentItem.closest('.itinerary-accordion');
        if (parentAccordion) {
          parentAccordion.querySelectorAll('.accordion-item').forEach(item => {
            item.classList.remove('open');
          });
        }
        currentItem.classList.add('open');
      }
    });
  });
}

/* Wildlife & Avian Spotter Filter */
function initWildlifeFilter() {
  const filterBtns = document.querySelectorAll('.spot-btn');
  const cards = document.querySelectorAll('.spot-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* Interactive Expedition Calculator: ₹3,999 per guest */
function initTripCalculator() {
  const guestsInput = document.getElementById('calc-guests');
  const basePricePerPersonSpan = document.getElementById('calc-base-rate');
  const guestsCountSpan = document.getElementById('calc-guests-count');
  const grandTotalSpan = document.getElementById('calc-grand-total');

  function calculate() {
    if (!guestsInput) return;

    const guests = Math.max(1, parseInt(guestsInput.value) || 1);
    const baseRatePerPerson = 3999;
    const grandTotal = baseRatePerPerson * guests;

    if (basePricePerPersonSpan) basePricePerPersonSpan.textContent = `₹3,999`;
    if (guestsCountSpan) guestsCountSpan.textContent = guests.toString();
    if (grandTotalSpan) grandTotalSpan.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
  }

  if (guestsInput) {
    guestsInput.addEventListener('change', calculate);
    guestsInput.addEventListener('input', calculate);
  }

  // Run initial calculation
  calculate();
}

/* Booking & Direct WhatsApp Dispatcher */
function initBookingForm() {
  const form = document.getElementById('expedition-booking-form');
  const modal = document.getElementById('confirmation-modal');
  const closeModalBtn = document.querySelector('.modal-close-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('book-name')?.value.trim() || '';
      const phone = document.getElementById('book-phone')?.value.trim() || '';
      const guests = Math.max(1, parseInt(document.getElementById('calc-guests')?.value) || 1);
      const diet = document.getElementById('book-diet')?.value || 'Non-Veg';
      const total = 3999 * guests;

      if (!name || !phone) {
        alert('Please provide your name and phone/WhatsApp number.');
        return;
      }

      const message = `*Sundarban Tour Booking Request*\n` +
        `--------------------------------\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone / WhatsApp:* ${phone}\n` +
        `👥 *Number of Guests:* ${guests}\n` +
        `🍛 *Food Preference:* ${diet}\n` +
        `🌿 *Package:* Complete 3D/2N Tiger Reserve Tour\n` +
        `💰 *Package Rate:* ₹3,999 / person\n` +
        `💵 *Total Estimated Cost:* ₹${total.toLocaleString('en-IN')}\n` +
        `--------------------------------\n` +
        `Please confirm my booking and share upcoming trip dates!`;

      const waNumber = '917384593640';
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

      // Show friendly confirmation modal
      if (modal) {
        modal.classList.add('active');
        const modalBody = document.getElementById('modal-summary-content');
        if (modalBody) {
          modalBody.innerHTML = `
            <p style="margin-bottom: 0.75rem;"><strong>Thanks, ${name}!</strong> Opening WhatsApp to send your booking for <strong>${guests} guest(s)</strong> (₹${total.toLocaleString('en-IN')}).</p>
            <p style="font-size: 0.9rem; color: #555; margin-bottom: 1rem;">If WhatsApp didn't open automatically, <a href="${waUrl}" target="_blank" style="color: #128c7e; font-weight: bold; text-decoration: underline;">click here to chat directly</a>.</p>
          `;
        }
      }

      // Open WhatsApp directly
      window.open(waUrl, '_blank');
    });
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}
