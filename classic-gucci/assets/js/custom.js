/**
 * Classic Gucci — drawer menu, ricerca, contatti, accordion
 */
document.addEventListener('DOMContentLoaded', () => {
  const drawer = document.getElementById('mobile_top_menu_wrapper');
  const menuToggle = document.getElementById('menu-icon');
  const menuBackdrop = document.getElementById('gucci-nav-backdrop');
  const drawerCloseBtn = document.querySelector('[data-gucci-drawer-close]');
  const searchPanel = document.getElementById('gucci-search-panel');
  const searchToggle = document.getElementById('gucci-search-toggle');
  const searchCloseBtn = document.querySelector('[data-gucci-search-close]');
  const searchInput = document.querySelector('#gucci-search-panel .gucci-search-input');
  const contactDrawer = document.getElementById('gucci-contact-drawer');
  const contactBackdrop = document.getElementById('gucci-contact-backdrop');
  const contactOpenBtns = document.querySelectorAll('#gucci-contact-toggle, [data-gucci-contact-open]');
  const contactCloseBtns = document.querySelectorAll('[data-gucci-contact-close]');
  const accountDrawer = document.getElementById('gucci-account-drawer');
  const accountBackdrop = document.getElementById('gucci-account-backdrop');
  const accountToggle = document.getElementById('gucci-account-toggle');
  const accountCloseBtns = document.querySelectorAll('[data-gucci-account-close]');

  const collapseAllMenuSubmenus = () => {
    if (!drawer) {
      return;
    }

    drawer.querySelectorAll('.gucci-sub-menu, .sub-menu.js-sub-menu').forEach((submenu) => {
      submenu.classList.remove('is-open', 'show', 'in', 'collapse');
      submenu.hidden = true;
    });

    drawer.querySelectorAll('.gucci-menu-expand').forEach((button) => {
      button.setAttribute('aria-expanded', 'false');
    });
  };

  const closeMenu = () => {
    if (!drawer || !menuToggle) {
      return;
    }

    drawer.classList.remove('is-open');
    drawer.hidden = true;
    drawer.style.display = '';
    drawer.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('gucci-menu-open');

    if (menuBackdrop) {
      menuBackdrop.classList.remove('is-open');
      menuBackdrop.hidden = true;
      menuBackdrop.setAttribute('aria-hidden', 'true');
    }

    collapseAllMenuSubmenus();
  };

  const openMenu = () => {
    if (!drawer || !menuToggle) {
      return;
    }

    closeSearch();
    closeContact();
    closeAccount();

    drawer.hidden = false;
    drawer.style.display = '';
    drawer.style.width = '';
    drawer.style.maxWidth = '';
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('gucci-menu-open');

    if (menuBackdrop) {
      menuBackdrop.hidden = false;
      menuBackdrop.classList.add('is-open');
      menuBackdrop.setAttribute('aria-hidden', 'false');
    }

    collapseAllMenuSubmenus();
    [0, 50, 200].forEach((delay) => {
      window.setTimeout(collapseAllMenuSubmenus, delay);
    });
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

  const closeAccount = () => {
    if (!accountDrawer) {
      return;
    }

    accountDrawer.classList.remove('is-open');
    accountDrawer.hidden = true;
    accountDrawer.setAttribute('aria-hidden', 'true');

    if (accountBackdrop) {
      accountBackdrop.classList.remove('is-open');
      accountBackdrop.hidden = true;
      accountBackdrop.setAttribute('aria-hidden', 'true');
    }

    if (accountToggle) {
      accountToggle.setAttribute('aria-expanded', 'false');
    }

    document.body.classList.remove('gucci-account-open');
  };

  const openAccount = () => {
    if (!accountDrawer) {
      return;
    }

    closeMenu();
    closeSearch();
    closeContact();

    accountDrawer.hidden = false;
    accountDrawer.classList.add('is-open');
    accountDrawer.setAttribute('aria-hidden', 'false');

    if (accountBackdrop) {
      accountBackdrop.hidden = false;
      accountBackdrop.classList.add('is-open');
      accountBackdrop.setAttribute('aria-hidden', 'false');
    }

    if (accountToggle) {
      accountToggle.setAttribute('aria-expanded', 'true');
    }

    document.body.classList.add('gucci-account-open');
  };

  const openContact = () => {
    if (!contactDrawer) {
      return;
    }

    closeMenu();
    closeSearch();
    closeAccount();

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
    closeAccount();
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

  if (accountToggle && accountDrawer) {
    accountToggle.addEventListener('click', (event) => {
      event.preventDefault();

      if (accountDrawer.classList.contains('is-open')) {
        closeAccount();
      } else {
        openAccount();
      }
    });
  }

  accountCloseBtns.forEach((button) => {
    button.addEventListener('click', closeAccount);
  });

  if (accountBackdrop) {
    accountBackdrop.addEventListener('click', closeAccount);
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
    drawer.style.display = '';

    menuToggle.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (drawer.classList.contains('is-open')) {
          closeMenu();
        } else {
          openMenu();
        }
      },
      true
    );

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', (event) => {
        event.preventDefault();
        closeMenu();
      });
    }

    if (menuBackdrop) {
      menuBackdrop.addEventListener('click', closeMenu);
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

      if (accountDrawer && accountDrawer.classList.contains('is-open')) {
        closeAccount();
        return;
      }

      if (document.body.classList.contains('gucci-menu-open')) {
        closeMenu();
      }
    }
  });

  if (drawer) {
    const blurMenuControl = (control) => {
      if (control instanceof HTMLElement) {
        control.blur();
      }
    };

    const toggleGucciSubmenu = (button, event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      const targetSelector = button.getAttribute('data-target');
      const target = targetSelector ? document.querySelector(targetSelector) : null;

      if (!target) {
        return;
      }

      const isOpen = !target.classList.contains('is-open');

      if (isOpen) {
        target.hidden = false;
        target.classList.add('is-open');
      } else {
        target.classList.remove('is-open');
        window.setTimeout(() => {
          if (!target.classList.contains('is-open')) {
            target.hidden = true;
          }
        }, 520);
      }

      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      blurMenuControl(button);
      blurMenuControl(button.closest('.gucci-menu-row')?.querySelector('.gucci-menu-link'));
    };

    const initGucciMenuAccordion = () => {
      drawer.querySelectorAll('.gucci-menu-expand[data-target]').forEach((button) => {
        if (button.dataset.gucciMenuInit === '1') {
          return;
        }

        button.dataset.gucciMenuInit = '1';

        const targetSelector = button.getAttribute('data-target');
        const target = targetSelector ? document.querySelector(targetSelector) : null;

        if (target) {
          target.classList.remove('collapse', 'show', 'in');
          if (!target.classList.contains('is-open')) {
            target.hidden = true;
          }
          button.setAttribute('aria-expanded', target.classList.contains('is-open') ? 'true' : 'false');
        }

        button.removeAttribute('data-toggle');

        button.addEventListener('click', (event) => {
          toggleGucciSubmenu(button, event);
        });

        const row = button.closest('.gucci-menu-row');
        const parentItem = button.closest('.gucci-menu-item--parent');
        const link = row ? row.querySelector('.gucci-menu-link') : null;

        if (link && parentItem) {
          link.addEventListener('click', (event) => {
            event.preventDefault();
            toggleGucciSubmenu(button, event);
          });
        }
      });
    };

    initGucciMenuAccordion();
    collapseAllMenuSubmenus();

    if (menuToggle) {
      menuToggle.addEventListener(
        'click',
        () => {
          window.setTimeout(initGucciMenuAccordion, 0);
        },
        false
      );
    }
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

  /* PLP — filtri drawer */
  const filterToggler = document.getElementById('search_filter_toggler');
  const filtersWrapper = document.getElementById('search_filters_wrapper');

  const closeFilters = () => {
    if (filtersWrapper) {
      filtersWrapper.classList.remove('is-open');
    }
  };

  if (filterToggler && filtersWrapper) {
    filterToggler.addEventListener('click', () => {
      filtersWrapper.classList.toggle('is-open');
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (
        filtersWrapper.classList.contains('is-open')
        && !filtersWrapper.contains(target)
        && !target.closest('#search_filter_toggler')
      ) {
        closeFilters();
      }
    });
  }

  /* Cart modal — backdrop scuro */
  const cartModal = document.getElementById('blockcart-modal');
  let cartModalBackdrop = document.querySelector('.gucci-cart-modal-backdrop');

  const ensureCartModalBackdrop = () => {
    if (!cartModalBackdrop) {
      cartModalBackdrop = document.createElement('div');
      cartModalBackdrop.className = 'gucci-cart-modal-backdrop';
      cartModalBackdrop.hidden = true;
      document.body.appendChild(cartModalBackdrop);
      cartModalBackdrop.addEventListener('click', () => {
        if (typeof window.jQuery !== 'undefined' && cartModal) {
          window.jQuery(cartModal).modal('hide');
        }
      });
    }
  };

  const syncCartModalBackdrop = (open) => {
    ensureCartModalBackdrop();
    if (!cartModalBackdrop) {
      return;
    }

    cartModalBackdrop.hidden = !open;
    document.body.classList.toggle('gucci-cart-modal-open', open);
  };

  if (cartModal && typeof window.jQuery !== 'undefined') {
    window.jQuery(cartModal)
      .on('show.bs.modal shown.bs.modal', () => syncCartModalBackdrop(true))
      .on('hide.bs.modal hidden.bs.modal', () => syncCartModalBackdrop(false));
  }
});
