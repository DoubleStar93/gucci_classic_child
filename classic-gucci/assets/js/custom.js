/**
 * Classic Gucci — drawer menu, ricerca, contatti, accordion
 */
document.addEventListener('DOMContentLoaded', () => {
  const drawer = document.getElementById('mobile_top_menu_wrapper');
  const menuToggle = document.getElementById('menu-icon');
  const drawerCloseBtn = document.querySelector('[data-gucci-drawer-close]');
  const searchPanel = document.getElementById('gucci-search-panel');
  const searchToggle = document.getElementById('gucci-search-toggle');
  const searchCloseBtn = document.querySelector('[data-gucci-search-close]');
  const searchInput = document.querySelector('#gucci-search-panel .gucci-search-input');
  const contactDrawer = document.getElementById('gucci-contact-drawer');
  const contactBackdrop = document.getElementById('gucci-contact-backdrop');
  const contactOpenBtns = document.querySelectorAll('#gucci-contact-toggle, [data-gucci-contact-open]');
  const contactCloseBtns = document.querySelectorAll('[data-gucci-contact-close]');

  const closeMenu = () => {
    if (!drawer || !menuToggle) {
      return;
    }

    if (typeof window.jQuery !== 'undefined' && window.jQuery(drawer).is(':visible')) {
      window.jQuery(menuToggle).trigger('click');
      return;
    }

    drawer.style.display = 'none';
    document.body.classList.remove('gucci-menu-open');
    drawer.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  const searchResults = document.getElementById('gucci-search-results');

  const mountSearchAutocomplete = () => {
    const autocomplete = document.querySelector('.searchbar-autocomplete.ui-autocomplete');

    if (autocomplete && searchResults && !searchResults.contains(autocomplete)) {
      searchResults.appendChild(autocomplete);
    }

    if (typeof window.jQuery !== 'undefined' && searchInput) {
      const $input = window.jQuery(searchInput);
      if ($input.data('ui-autocomplete') || $input.data('psBlockSearchAutocomplete')) {
        try {
          $input.autocomplete('option', 'appendTo', '#gucci-search-results');
          $input.autocomplete('option', 'position', { my: 'left top', at: 'left bottom', collision: 'none' });
        } catch (e) {
          /* psBlockSearchAutocomplete widget */
        }
      }
    }
  };

  const closeSearch = () => {
    if (!searchPanel || !searchToggle) {
      return;
    }

    searchPanel.classList.remove('is-open');
    searchPanel.hidden = true;
    searchPanel.setAttribute('aria-hidden', 'true');
    searchToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('gucci-search-open');

    const autocomplete = document.querySelector('.searchbar-autocomplete.ui-autocomplete');
    if (autocomplete) {
      autocomplete.style.display = 'none';
    }
  };

  const closeContact = () => {
    if (!contactDrawer) {
      return;
    }

    contactDrawer.classList.remove('is-open');
    contactDrawer.hidden = true;
    contactDrawer.setAttribute('aria-hidden', 'true');

    if (contactBackdrop) {
      contactBackdrop.classList.remove('is-open');
      contactBackdrop.hidden = true;
      contactBackdrop.setAttribute('aria-hidden', 'true');
    }

    contactOpenBtns.forEach((button) => {
      button.setAttribute('aria-expanded', 'false');
    });

    document.body.classList.remove('gucci-contact-open');
  };

  const openContact = () => {
    if (!contactDrawer) {
      return;
    }

    closeMenu();
    closeSearch();

    contactDrawer.hidden = false;
    contactDrawer.classList.add('is-open');
    contactDrawer.setAttribute('aria-hidden', 'false');

    if (contactBackdrop) {
      contactBackdrop.hidden = false;
      contactBackdrop.classList.add('is-open');
      contactBackdrop.setAttribute('aria-hidden', 'false');
    }

    contactOpenBtns.forEach((button) => {
      button.setAttribute('aria-expanded', 'true');
    });

    document.body.classList.add('gucci-contact-open');
  };

  const positionSearchAutocomplete = () => {
    mountSearchAutocomplete();

    const autocomplete = document.querySelector('.searchbar-autocomplete.ui-autocomplete');
    if (!autocomplete || !searchPanel || !searchPanel.classList.contains('is-open')) {
      return;
    }

    autocomplete.style.position = 'static';
    autocomplete.style.left = 'auto';
    autocomplete.style.right = 'auto';
    autocomplete.style.top = 'auto';
    autocomplete.style.width = '100%';
    autocomplete.style.maxWidth = 'none';
    autocomplete.style.transform = 'none';
  };

  const openSearch = () => {
    if (!searchPanel || !searchToggle) {
      return;
    }

    closeMenu();
    closeContact();
    searchPanel.hidden = false;
    searchPanel.classList.add('is-open');
    searchPanel.setAttribute('aria-hidden', 'false');
    searchToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('gucci-search-open');

    if (searchInput) {
      window.setTimeout(() => searchInput.focus(), 50);
    }

    window.setTimeout(() => {
      mountSearchAutocomplete();
      positionSearchAutocomplete();
    }, 100);
  };

  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', () => {
      if (searchPanel.classList.contains('is-open')) {
        closeSearch();
      } else {
        openSearch();
      }
    });
  }

  if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', closeSearch);
  }

  contactOpenBtns.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();

      if (contactDrawer && contactDrawer.classList.contains('is-open')) {
        closeContact();
      } else {
        openContact();
      }
    });
  });

  contactCloseBtns.forEach((button) => {
    button.addEventListener('click', closeContact);
  });

  if (contactBackdrop) {
    contactBackdrop.addEventListener('click', closeContact);
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      window.setTimeout(positionSearchAutocomplete, 50);
    });
    searchInput.addEventListener('focus', positionSearchAutocomplete);
  }

  window.addEventListener('resize', positionSearchAutocomplete);

  document.addEventListener('click', (event) => {
    if (!searchPanel || !searchPanel.classList.contains('is-open')) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    if (
      target.closest('#gucci-search-panel')
      || target.closest('#gucci-search-toggle')
      || target.closest('.searchbar-autocomplete')
    ) {
      return;
    }

    closeSearch();
  });

  if (drawer && menuToggle) {
    const setMenuOpen = (open) => {
      document.body.classList.toggle('gucci-menu-open', open);
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    const syncFromDrawer = () => {
      const visible = drawer.style.display !== 'none' && getComputedStyle(drawer).display !== 'none';
      setMenuOpen(visible);
      if (visible) {
        closeSearch();
        closeContact();
      }
    };

    menuToggle.addEventListener('click', () => {
      window.setTimeout(syncFromDrawer, 0);
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', () => {
        if (typeof window.jQuery !== 'undefined' && window.jQuery(drawer).is(':visible')) {
          window.jQuery(menuToggle).trigger('click');
          return;
        }

        drawer.style.display = 'none';
        setMenuOpen(false);
      });
    }
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (searchPanel && searchPanel.classList.contains('is-open')) {
        closeSearch();
        return;
      }

      if (contactDrawer && contactDrawer.classList.contains('is-open')) {
        closeContact();
        return;
      }

      if (document.body.classList.contains('gucci-menu-open')) {
        closeMenu();
      }
    }
  });

  if (drawer) {
    drawer.querySelectorAll('.gucci-menu-expand[data-target]').forEach((button) => {
      const targetSelector = button.getAttribute('data-target');
      const target = targetSelector ? document.querySelector(targetSelector) : null;

      if (!target) {
        return;
      }

      const syncExpanded = () => {
        const isOpen = target.classList.contains('show') || target.classList.contains('in');
        button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      };

      button.addEventListener('click', (event) => {
        if (typeof window.jQuery === 'undefined' || !window.jQuery.fn.collapse) {
          event.preventDefault();
          event.stopPropagation();

          const isOpen = target.classList.contains('show') || target.classList.contains('in');
          if (isOpen) {
            target.classList.remove('show', 'in');
          } else {
            target.classList.add('show');
          }

          syncExpanded();
          return;
        }

        window.setTimeout(syncExpanded, 350);
      });
    });
  }

  /* Riposiziona autocomplete quando jQuery UI lo apre */
  if (typeof window.jQuery !== 'undefined') {
    window.jQuery(document).on('autocompleteopen autocompleteresponse', () => {
      positionSearchAutocomplete();
    });

    window.setTimeout(mountSearchAutocomplete, 500);
  }

  /* PDP Gucci — galleria counter + accordion */
  const pdpHero = document.querySelector('.js-gucci-pdp-gallery');
  const pdpRestGallery = document.querySelector('.js-gucci-pdp-gallery-rest');
  const pdpCounterCurrent = document.querySelector('.gucci-pdp-gallery-counter-current');
  const pdpSlides = [
    ...(pdpHero ? Array.from(pdpHero.querySelectorAll('.gucci-pdp-gallery-slide')) : []),
    ...(pdpRestGallery ? Array.from(pdpRestGallery.querySelectorAll('.gucci-pdp-gallery-slide')) : []),
  ];

  if (pdpSlides.length && pdpCounterCurrent) {
    const updateGalleryCounter = () => {
      const viewportMiddle = window.innerHeight * 0.45;
      let activeIndex = 1;

      pdpSlides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
          activeIndex = index + 1;
        }
      });

      pdpCounterCurrent.textContent = String(activeIndex);
      pdpSlides.forEach((slide, index) => {
        slide.classList.toggle('is-active', index + 1 === activeIndex);
      });
    };

    updateGalleryCounter();
    window.addEventListener('scroll', updateGalleryCounter, { passive: true });
    window.addEventListener('resize', updateGalleryCounter);
  }

  document.querySelectorAll('[data-gucci-accordion-trigger]').forEach((trigger) => {
    const panelId = trigger.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;

    if (!panel) {
      return;
    }

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        trigger.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });
  });
});
