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

/* Interactive Expedition Calculator: Base Rate ₹4299 & Subjective Photo Tour */
function initTripCalculator() {
  const packageSelect = document.getElementById('calc-package');
  const guestsInput = document.getElementById('calc-guests');
  const kolkataPickupCheck = document.getElementById('calc-pickup');
  const photoRigCheck = document.getElementById('calc-photorig');
  const singleStayCheck = document.getElementById('calc-singlestay');

  const basePricePerPersonSpan = document.getElementById('calc-base-rate');
  const guestsCountSpan = document.getElementById('calc-guests-count');
  const addOnsSpan = document.getElementById('calc-addons-total');
  const grandTotalSpan = document.getElementById('calc-grand-total');
  const subjectiveNote = document.getElementById('calc-subjective-note');

  function calculate() {
    if (!packageSelect || !guestsInput) return;

    const packageType = packageSelect.value;
    const guests = Math.max(1, parseInt(guestsInput.value) || 1);

    if (packageType === 'unexplored') {
      // Base rate: ₹4,299 per guest for complete 3D/2N Tiger Reserve tour
      const baseRatePerPerson = 4299;
      let addOns = 0;

      if (kolkataPickupCheck && kolkataPickupCheck.checked) {
        addOns += 4500; // Roundtrip AC vehicle transfer
      }
      if (photoRigCheck && photoRigCheck.checked) {
        addOns += 1500; // Lens beanbag support
      }
      if (singleStayCheck && singleStayCheck.checked) {
        addOns += (1200 * guests); // Single private room supplement
      }

      const grandTotal = (baseRatePerPerson * guests) + addOns;

      if (basePricePerPersonSpan) basePricePerPersonSpan.textContent = `₹4,299`;
      if (guestsCountSpan) guestsCountSpan.textContent = guests.toString();
      if (addOnsSpan) addOnsSpan.textContent = `₹${addOns.toLocaleString('en-IN')}`;
      if (grandTotalSpan) grandTotalSpan.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
      if (subjectiveNote) subjectiveNote.style.display = 'none';

    } else {
      // Photography Tour or Custom Charter: Subjective pricing
      if (basePricePerPersonSpan) basePricePerPersonSpan.textContent = `Subjective / Custom Quote`;
      if (guestsCountSpan) guestsCountSpan.textContent = guests.toString();
      if (addOnsSpan) addOnsSpan.textContent = `Tailored`;
      if (grandTotalSpan) grandTotalSpan.textContent = `Custom Quote on Inquiry`;
      if (subjectiveNote) {
        subjectiveNote.style.display = 'block';
        subjectiveNote.textContent = packageType === 'photo' 
          ? '* Photography safaris are customized to your camera setup, silent drift duration, lens support gear, and seasonal tide windows.'
          : '* Private charters are custom crafted with dedicated boat pilots and specialized itineraries.';
      }
    }
  }

  // Listeners
  [packageSelect, guestsInput, kolkataPickupCheck, photoRigCheck, singleStayCheck].forEach(elem => {
    if (elem) {
      elem.addEventListener('change', calculate);
      elem.addEventListener('input', calculate);
    }
  });

  // Run initial calculation
  calculate();
}

/* Booking & WhatsApp Concierge Dispatcher */
function initBookingForm() {
  const form = document.getElementById('expedition-booking-form');
  const whatsappBtn = document.getElementById('btn-whatsapp-inquire');
  const modal = document.getElementById('confirmation-modal');
  const closeModalBtn = document.querySelector('.modal-close-btn');

  function getFormData() {
    const pkg = document.getElementById('calc-package')?.selectedOptions[0]?.text || 'Complete 3D/2N Tiger Reserve Tour (₹4,299/guest)';
    const guests = document.getElementById('calc-guests')?.value || '2';
    const name = document.getElementById('book-name')?.value || 'Guest';
    const phone = document.getElementById('book-phone')?.value || '';
    const email = document.getElementById('book-email')?.value || '';
    const travelDate = document.getElementById('book-date')?.value || 'Upcoming Tide Window';
    const dietary = document.getElementById('book-diet')?.value || 'Traditional Delta Fresh Fish & Prawns';
    const notes = document.getElementById('book-notes')?.value || 'None';
    const pickup = document.getElementById('calc-pickup')?.checked ? 'Yes (Kolkata AC Vehicle)' : 'No (Direct Jetty Ghat)';
    const totalEst = document.getElementById('calc-grand-total')?.textContent || '';

    return {
      pkg, guests, name, phone, email, travelDate, dietary, notes, pickup, totalEst
    };
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const d = getFormData();
      const text = `*New Offbeat Sundarban Expedition Inquiry*%0A` +
        `--------------------------------%0A` +
        `🌿 *Package:* ${encodeURIComponent(d.pkg)}%0A` +
        `👥 *Number of Guests:* ${d.guests} (No Group Limitation)%0A` +
        `📅 *Preferred Travel Date:* ${encodeURIComponent(d.travelDate)}%0A` +
        `👤 *Lead Traveler:* ${encodeURIComponent(d.name)}%0A` +
        `📞 *Contact Phone:* ${encodeURIComponent(d.phone)}%0A` +
        `🚗 *Kolkata Transfer Req:* ${encodeURIComponent(d.pickup)}%0A` +
        `🍛 *Diet Preference:* ${encodeURIComponent(d.dietary)}%0A` +
        `💰 *Estimated / Quote:* ${encodeURIComponent(d.totalEst)}%0A` +
        `📝 *Special Notes:* ${encodeURIComponent(d.notes)}%0A` +
        `--------------------------------%0A` +
        `Please confirm slot availability for upcoming tides!`;

      const waNumber = '917384593640';
      const url = `https://wa.me/${waNumber}?text=${text}`;
      window.open(url, '_blank');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = getFormData();

      if (modal) {
        modal.classList.add('active');
        const modalBody = document.getElementById('modal-summary-content');
        if (modalBody) {
          modalBody.innerHTML = `
            <p style="margin-bottom: 0.75rem;"><strong>Thanks, ${d.name}!</strong> We have received your trip inquiry for <strong>${d.pkg}</strong> (${d.guests} people).</p>
            <p style="font-size: 0.9rem; color: #555; margin-bottom: 1rem;">We'll call or WhatsApp you directly at <strong>${d.phone || d.email}</strong> shortly to discuss your preferred dates (around <strong>${d.travelDate}</strong>) and answer any questions you have.</p>
            <div style="background: #fbf9f4; border: 1px solid #ebe2d3; padding: 12px; border-radius: 8px; font-size: 0.85rem; text-align: left;">
              <strong>Complete Tiger Reserve Route:</strong> Canning pickup &rarr; Dhamakhali &rarr; Bird Forest, Hemnagar Port & Zero Point &rarr; Deep Forest (Jhingakhali, Burirdabri with Bangladesh view, Morichjhapi, Arbesia, Khatuajhuri, Gapbani) &rarr; Safari Watchtowers (Sajnekhali, Sudhanyakhali, Bonbibi Bharani, Sarakkhali) &rarr; Godkhali return.
            </div>
          `;
        }
      }
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
