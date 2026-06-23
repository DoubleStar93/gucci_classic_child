/**
 * Classic Gucci — drawer menu, ricerca, contatti, accordion
 * Caricato manualmente dopo il bundle CCC (non usare assets/js/custom.js — PS lo include nel bundle).
 */
(() => {
  if (window.__gucciClassicThemeLoaded) {
    return;
  }

  window.__gucciClassicThemeLoaded = true;

  const initClassicGucciTheme = () => {
  if (document.documentElement.dataset.gucciThemeInit === '1') {
    return;
  }
  document.documentElement.dataset.gucciThemeInit = '1';

  const header = document.getElementById('header');
  const headerScrollThreshold = 32;

  const updateHeaderOnScroll = () => {
    if (!header) {
      return;
    }

    const forceSolid =
      document.body.classList.contains('gucci-menu-open')
      || document.body.classList.contains('gucci-search-open')
      || document.body.classList.contains('gucci-contact-open')
      || document.body.classList.contains('gucci-account-open')
      || document.body.classList.contains('gucci-filters-open')
      || document.body.classList.contains('gucci-sort-open');

    const scrolled = forceSolid || window.scrollY > headerScrollThreshold;
    header.classList.toggle('is-scrolled', scrolled);
  };

  if (header) {
    if (document.body.id === 'product' || document.body.id === 'index') {
      const syncHeroHeaderState = () => {
        if (
          window.scrollY <= headerScrollThreshold
          && !document.body.classList.contains('gucci-menu-open')
          && !document.body.classList.contains('gucci-search-open')
          && !document.body.classList.contains('gucci-contact-open')
          && !document.body.classList.contains('gucci-account-open')
        ) {
          header.classList.remove('is-scrolled');
        }
      };

      syncHeroHeaderState();
      window.addEventListener('pageshow', syncHeroHeaderState);
    }

    updateHeaderOnScroll();
    window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
    window.addEventListener('resize', updateHeaderOnScroll, { passive: true });
  }

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
  const contactOpenBtns = document.querySelectorAll('[data-gucci-contact-open]');
  const contactCloseBtns = document.querySelectorAll('[data-gucci-contact-close]');
  const accountDrawer = document.getElementById('gucci-account-drawer');
  const accountBackdrop = document.getElementById('gucci-account-backdrop');
  const accountToggle = document.getElementById('gucci-account-toggle');
  const accountCloseBtns = document.querySelectorAll('[data-gucci-account-close]');
  const filtersWrapper = document.getElementById('gucci-filters-drawer');
  const filtersBackdrop = document.getElementById('gucci-filters-backdrop');
  const sortWrapper = document.getElementById('gucci-sort-drawer');
  const sortBackdrop = document.getElementById('gucci-sort-backdrop');

  const portalOverlayToBody = (element) => {
    if (element && element.parentElement !== document.body) {
      document.body.appendChild(element);
    }
  };

  [filtersWrapper, filtersBackdrop, sortWrapper, sortBackdrop].forEach(portalOverlayToBody);

  const clearClassicMobileFilterLayout = () => {
    document.querySelectorAll('#content-wrapper, .js-content-wrapper, #footer, .js-footer').forEach((node) => {
      node.classList.remove('hidden-sm-down');
    });
  };

  const GUCCI_DRAWER_MS = 560;
  const GUCCI_BACKDROP_MS = 520;
  const GUCCI_OVERLAY_MS = 460;

  const afterTransition = (element, propertyName, fallbackMs) => new Promise((resolve) => {
    if (!element) {
      resolve();
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      element.removeEventListener('transitionend', onEnd);
      resolve();
    };

    const onEnd = (event) => {
      if (event.target === element && event.propertyName === propertyName) {
        finish();
      }
    };

    element.addEventListener('transitionend', onEnd);
    window.setTimeout(finish, fallbackMs);
  });

  const revealDrawer = (drawer, backdrop) => {
    if (drawer) {
      drawer.hidden = false;
      drawer.removeAttribute('hidden');
      drawer.style.display = '';
      drawer.style.width = '';
      drawer.style.maxWidth = '';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          drawer.classList.add('is-open');
        });
      });
    }

    if (backdrop) {
      backdrop.hidden = false;
      backdrop.removeAttribute('hidden');
      requestAnimationFrame(() => {
        backdrop.classList.add('is-open');
      });
    }
  };

  const hideDrawer = (drawer, backdrop, { instant = false } = {}) => {
    if (!drawer) {
      return Promise.resolve();
    }

    const wasOpen = drawer.classList.contains('is-open');
    drawer.classList.remove('is-open');
    if (backdrop) {
      backdrop.classList.remove('is-open');
    }

    if (instant || !wasOpen) {
      drawer.hidden = true;
      drawer.setAttribute('aria-hidden', 'true');
      if (backdrop) {
        backdrop.hidden = true;
        backdrop.setAttribute('aria-hidden', 'true');
      }
      return Promise.resolve();
    }

    return Promise.all([
      afterTransition(drawer, 'transform', GUCCI_DRAWER_MS),
      backdrop ? afterTransition(backdrop, 'opacity', GUCCI_BACKDROP_MS) : Promise.resolve(),
    ]).then(() => {
      drawer.hidden = true;
      drawer.setAttribute('aria-hidden', 'true');
      if (backdrop) {
        backdrop.hidden = true;
        backdrop.setAttribute('aria-hidden', 'true');
      }
    });
  };

  const revealOverlay = (overlay) => {
    if (!overlay) {
      return;
    }

    overlay.hidden = false;
    overlay.removeAttribute('hidden');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('is-open');
      });
    });
  };

  const hideOverlay = (overlay, { instant = false } = {}) => {
    if (!overlay) {
      return Promise.resolve();
    }

    const wasOpen = overlay.classList.contains('is-open');
    overlay.classList.remove('is-open');

    if (instant || !wasOpen) {
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
      return Promise.resolve();
    }

    return afterTransition(overlay, 'opacity', GUCCI_OVERLAY_MS).then(() => {
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
    });
  };

  const setAccordionPanelOpen = (panel, open, { openClass = 'is-accordion-open', instant = false } = {}) => {
    if (!panel) {
      return;
    }

    if (open) {
      panel.removeAttribute('hidden');
      panel.classList.add(openClass);

      if (instant) {
        panel.style.maxHeight = 'none';
        return;
      }

      panel.style.maxHeight = '0';
      requestAnimationFrame(() => {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      });

      const onEnd = (event) => {
        if (event.propertyName !== 'max-height') {
          return;
        }
        panel.removeEventListener('transitionend', onEnd);
        if (panel.classList.contains(openClass)) {
          panel.style.maxHeight = 'none';
        }
      };
      panel.addEventListener('transitionend', onEnd);
      return;
    }

    panel.classList.remove(openClass);

    if (instant) {
      panel.setAttribute('hidden', '');
      panel.style.maxHeight = '';
      return;
    }

    panel.style.maxHeight = `${panel.scrollHeight}px`;
    requestAnimationFrame(() => {
      panel.style.maxHeight = '0';
    });

    const onEnd = (event) => {
      if (event.propertyName !== 'max-height') {
        return;
      }
      panel.removeEventListener('transitionend', onEnd);
      if (!panel.classList.contains(openClass)) {
        panel.setAttribute('hidden', '');
        panel.style.maxHeight = '';
      }
    };
    panel.addEventListener('transitionend', onEnd);
  };

  const filterToggleBtn = document.getElementById('search_filter_toggler');
  const sortToggleBtn = document.getElementById('gucci-sort-toggler');

  const setDrawerToggleState = (button, open) => {
    if (!button) {
      return;
    }

    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    button.classList.toggle('is-active', open);
  };

  const closeFilters = () => {
    if (filtersWrapper) {
      filtersWrapper.setAttribute('aria-hidden', 'true');
    }

    setDrawerToggleState(filterToggleBtn, false);
    document.body.classList.remove('gucci-filters-open');
    clearClassicMobileFilterLayout();
    hideDrawer(filtersWrapper, filtersBackdrop);
  };

  const closeSort = () => {
    if (sortWrapper) {
      sortWrapper.setAttribute('aria-hidden', 'true');
    }

    setDrawerToggleState(sortToggleBtn, false);
    document.body.classList.remove('gucci-sort-open');
    hideDrawer(sortWrapper, sortBackdrop);
  };

  const openFilters = () => {
    if (!filtersWrapper) {
      return;
    }

    closeSort();
    clearClassicMobileFilterLayout();
    filtersWrapper.setAttribute('aria-hidden', 'false');
    setDrawerToggleState(filterToggleBtn, true);
    document.body.classList.add('gucci-filters-open');
    revealDrawer(filtersWrapper, filtersBackdrop);
  };

  const openSort = () => {
    if (!sortWrapper) {
      return;
    }

    closeFilters();
    sortWrapper.setAttribute('aria-hidden', 'false');
    setDrawerToggleState(sortToggleBtn, true);
    document.body.classList.add('gucci-sort-open');
    revealDrawer(sortWrapper, sortBackdrop);
  };

  const collapseAllMenuSubmenus = () => {
    if (!drawer) {
      return;
    }

    drawer.querySelectorAll('.gucci-sub-menu, .sub-menu.js-sub-menu').forEach((submenu) => {
      submenu.classList.remove('show', 'in', 'collapse');
      setAccordionPanelOpen(submenu, false, { openClass: 'is-open', instant: true });
    });

    drawer.querySelectorAll('.gucci-menu-expand').forEach((button) => {
      button.setAttribute('aria-expanded', 'false');
    });
  };

  const expandAllMenuSubmenus = () => {
    if (!drawer) {
      return;
    }

    drawer.querySelectorAll('.gucci-menu-expand[data-target]').forEach((button) => {
      const targetSelector = button.getAttribute('data-target');
      const target = targetSelector ? drawer.querySelector(targetSelector) : null;

      if (!target) {
        return;
      }

      target.classList.remove('show', 'in', 'collapse');
      setAccordionPanelOpen(target, true, { openClass: 'is-open', instant: true });
      button.setAttribute('aria-expanded', 'true');
    });
  };

  const closeMenu = () => {
    if (!drawer || !menuToggle) {
      return;
    }

    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('gucci-menu-open');
    collapseAllMenuSubmenus();
    updateHeaderOnScroll();
    hideDrawer(drawer, menuBackdrop);
  };

  const openMenu = () => {
    if (!drawer || !menuToggle) {
      return;
    }

    hideOverlay(searchPanel, { instant: true });
    hideDrawer(contactDrawer, contactBackdrop, { instant: true });
    hideDrawer(accountDrawer, accountBackdrop, { instant: true });
    if (searchToggle) {
      searchToggle.setAttribute('aria-expanded', 'false');
    }
    if (accountToggle) {
      accountToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('gucci-search-open', 'gucci-contact-open', 'gucci-account-open');

    drawer.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('gucci-menu-open');
    revealDrawer(drawer, menuBackdrop);

    expandAllMenuSubmenus();
    [0, 50, 200].forEach((delay) => {
      window.setTimeout(expandAllMenuSubmenus, delay);
    });
    updateHeaderOnScroll();
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

    searchToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('gucci-search-open');
    updateHeaderOnScroll();

    const autocomplete = document.querySelector('.searchbar-autocomplete.ui-autocomplete');
    if (autocomplete) {
      autocomplete.style.display = 'none';
    }

    searchPanel.setAttribute('aria-hidden', 'true');
    hideOverlay(searchPanel);
  };

  const closeContact = () => {
    if (!contactDrawer) {
      return;
    }

    contactOpenBtns.forEach((button) => {
      button.setAttribute('aria-expanded', 'false');
    });

    document.body.classList.remove('gucci-contact-open');
    updateHeaderOnScroll();
    contactDrawer.setAttribute('aria-hidden', 'true');
    hideDrawer(contactDrawer, contactBackdrop);
  };

  const closeAccount = () => {
    if (!accountDrawer) {
      return;
    }

    if (accountToggle) {
      accountToggle.setAttribute('aria-expanded', 'false');
    }

    document.body.classList.remove('gucci-account-open');
    updateHeaderOnScroll();
    accountDrawer.setAttribute('aria-hidden', 'true');
    hideDrawer(accountDrawer, accountBackdrop);
  };

  const openAccount = () => {
    if (!accountDrawer) {
      return;
    }

    hideDrawer(drawer, menuBackdrop, { instant: true });
    hideOverlay(searchPanel, { instant: true });
    hideDrawer(contactDrawer, contactBackdrop, { instant: true });
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }
    if (searchToggle) {
      searchToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('gucci-menu-open', 'gucci-search-open', 'gucci-contact-open');

    accountDrawer.setAttribute('aria-hidden', 'false');
    if (accountToggle) {
      accountToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('gucci-account-open');
    revealDrawer(accountDrawer, accountBackdrop);
    updateHeaderOnScroll();
  };

  const openContact = () => {
    if (!contactDrawer) {
      return;
    }

    hideDrawer(drawer, menuBackdrop, { instant: true });
    hideOverlay(searchPanel, { instant: true });
    hideDrawer(accountDrawer, accountBackdrop, { instant: true });
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }
    if (accountToggle) {
      accountToggle.setAttribute('aria-expanded', 'false');
    }
    if (searchToggle) {
      searchToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('gucci-menu-open', 'gucci-search-open', 'gucci-account-open');

    contactDrawer.setAttribute('aria-hidden', 'false');
    contactOpenBtns.forEach((button) => {
      button.setAttribute('aria-expanded', 'true');
    });
    document.body.classList.add('gucci-contact-open');
    revealDrawer(contactDrawer, contactBackdrop);
    updateHeaderOnScroll();
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

    hideDrawer(drawer, menuBackdrop, { instant: true });
    hideDrawer(contactDrawer, contactBackdrop, { instant: true });
    hideDrawer(accountDrawer, accountBackdrop, { instant: true });
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }
    if (accountToggle) {
      accountToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('gucci-menu-open', 'gucci-contact-open', 'gucci-account-open');

    searchPanel.setAttribute('aria-hidden', 'false');
    searchToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('gucci-search-open');
    revealOverlay(searchPanel);
    updateHeaderOnScroll();

    if (searchInput) {
      window.setTimeout(() => searchInput.focus(), 120);
    }

    window.setTimeout(() => {
      mountSearchAutocomplete();
      positionSearchAutocomplete();
    }, 160);
  };

  if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', closeSearch);
  }

  if (document.documentElement.dataset.gucciHeaderToggleHandler !== '1') {
    document.documentElement.dataset.gucciHeaderToggleHandler = '1';

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const searchBtn = target.closest('#gucci-search-toggle');
      if (searchBtn && searchPanel) {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (searchPanel.classList.contains('is-open')) {
          closeSearch();
        } else {
          openSearch();
        }
        return;
      }

      const accountBtn = target.closest('#gucci-account-toggle');
      if (accountBtn && accountDrawer) {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (accountDrawer.classList.contains('is-open')) {
          closeAccount();
        } else {
          openAccount();
        }
      }
    }, true);
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

      if (filtersWrapper && filtersWrapper.classList.contains('is-open')) {
        closeFilters();
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

      const willOpen = button.getAttribute('aria-expanded') !== 'true';

      setAccordionPanelOpen(target, willOpen, { openClass: 'is-open' });
      button.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
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
    expandAllMenuSubmenus();

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

  /* PDP Gucci — slider immagine singola + miniature overlay */
  const cleanupClassicPdpImages = () => {
    document
      .querySelectorAll(
        '#product .images-container, #product .js-qv-mask, #product #product-modal, #product .product-cover:not(.gucci-pdp-gallery)'
      )
      .forEach((node) => {
        if (node instanceof HTMLElement && !node.closest('.gucci-pdp-gallery')) {
          node.remove();
        }
      });
  };

  const GUCCI_IMAGE_SIZE_SUFFIX =
    /-(?:large_default|thickbox_default|home_default|medium_default|small_default|cart_default)(?=\.(?:jpe?g|png|webp|avif))/i;

  const gucciImagePixelScore = (width, height) => {
    const w = Number(width) || 0;
    const h = Number(height) || 0;
    return w > 0 && h > 0 ? w * h : 0;
  };

  const stripGucciImageSizeSuffix = (url) => (url ? url.replace(GUCCI_IMAGE_SIZE_SUFFIX, '') : '');

  const getGucciGalleryImageCandidates = (img) => {
    const fromImg = img ? img.currentSrc || img.src || '' : '';
    const full = img?.getAttribute('data-image-full-src') || '';

    return [
      full,
      stripGucciImageSizeSuffix(full),
      stripGucciImageSizeSuffix(fromImg),
      fromImg,
      img?.getAttribute('data-image-large-src') || '',
    ].filter((url, index, list) => url && list.indexOf(url) === index);
  };

  const upgradeGucciGalleryResolution = () => {
    document.querySelectorAll('.gucci-pdp-gallery-image').forEach((img) => {
      if (!img || img.dataset.gucciHiRes === '1') {
        return;
      }

      const candidates = getGucciGalleryImageCandidates(img);
      const currentBest = img.currentSrc || img.src || '';
      const currentScore = gucciImagePixelScore(img.naturalWidth, img.naturalHeight);
      let candidateIndex = 0;
      let bestUrl = currentBest;
      let bestScore = currentScore;

      const finishUpgrade = () => {
        if (bestUrl && bestUrl !== currentBest) {
          img.src = bestUrl;
        }
        img.dataset.gucciHiRes = '1';
      };

      const tryNext = () => {
        if (candidateIndex >= candidates.length) {
          finishUpgrade();
          return;
        }

        const url = candidates[candidateIndex];
        candidateIndex += 1;

        if (!url || url === currentBest) {
          tryNext();
          return;
        }

        const probe = new Image();
        probe.onload = () => {
          const nextScore = gucciImagePixelScore(probe.naturalWidth, probe.naturalHeight);
          if (nextScore > bestScore) {
            bestScore = nextScore;
            bestUrl = url;
          }
          tryNext();
        };
        probe.onerror = () => tryNext();
        probe.src = url;
      };

      tryNext();
    });
  };

  const initGucciGallery = (gallery) => {
    if (!gallery || gallery.dataset.gucciGalleryReady === '1') {
      return;
    }

    if (!gallery.hasAttribute('data-gucci-gallery-slider')) {
      return;
    }

    gallery.dataset.gucciGalleryReady = '1';

    const galleryViewport = gallery.querySelector('.js-gucci-pdp-gallery-viewport');
    const gallerySlides = Array.from(gallery.querySelectorAll('.gucci-pdp-gallery-slide'));
    const galleryThumbs = Array.from(gallery.querySelectorAll('.gucci-pdp-gallery-thumb'));
    const galleryCounterCurrent = gallery.querySelector('.gucci-pdp-gallery-counter-current');
    let galleryActiveIndex = 0;
    let galleryTouchStartX = 0;

    const goToGallerySlide = (index) => {
      if (!gallerySlides.length) {
        return;
      }

      const nextIndex = Math.max(0, Math.min(index, gallerySlides.length - 1));
      galleryActiveIndex = nextIndex;

      gallerySlides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === nextIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      galleryThumbs.forEach((thumb, thumbIndex) => {
        const isActive = thumbIndex === nextIndex;
        thumb.classList.toggle('is-active', isActive);
        thumb.setAttribute('aria-current', isActive ? 'true' : 'false');
      });

      if (galleryCounterCurrent) {
        galleryCounterCurrent.textContent = String(nextIndex + 1);
      }

      gallerySlides.forEach((slide) => {
        const img = slide.querySelector('.gucci-pdp-gallery-image');
        if (img) {
          img.classList.remove('js-qv-product-cover');
        }
      });

      const activeImg = gallerySlides[nextIndex]?.querySelector('.gucci-pdp-gallery-image');
      if (activeImg) {
        activeImg.classList.add('js-qv-product-cover');
      }

      upgradeGucciGalleryResolution();
    };

    galleryThumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const slideIndex = Number.parseInt(thumb.getAttribute('data-slide-index') || '0', 10);
        goToGallerySlide(slideIndex);
      });
    });

    if (galleryViewport) {
      galleryViewport.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          goToGallerySlide(galleryActiveIndex + 1);
        }

        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          goToGallerySlide(galleryActiveIndex - 1);
        }
      });

      galleryViewport.addEventListener(
        'touchstart',
        (event) => {
          galleryTouchStartX = event.changedTouches[0]?.clientX ?? 0;
        },
        { passive: true }
      );

      galleryViewport.addEventListener(
        'touchend',
        (event) => {
          const touchEndX = event.changedTouches[0]?.clientX ?? 0;
          const deltaX = touchEndX - galleryTouchStartX;

          if (Math.abs(deltaX) < 48) {
            return;
          }

          if (deltaX < 0) {
            goToGallerySlide(galleryActiveIndex + 1);
          } else {
            goToGallerySlide(galleryActiveIndex - 1);
          }
        },
        { passive: true }
      );
    }

    goToGallerySlide(0);
  };

  const initGucciGalleries = () => {
    if (document.body.id === 'product') {
      cleanupClassicPdpImages();
    }

    upgradeGucciGalleryResolution();
    document.querySelectorAll('.js-gucci-pdp-gallery[data-gucci-gallery-slider]').forEach(initGucciGallery);
  };

  initGucciGalleries();

  let gucciGalleryResizeTimer;
  window.addEventListener('resize', () => {
    window.clearTimeout(gucciGalleryResizeTimer);
    gucciGalleryResizeTimer = window.setTimeout(() => {
      upgradeGucciGalleryResolution();
    }, 150);
  });

  if (typeof prestashop !== 'undefined' && prestashop.on) {
    prestashop.on('updatedProduct', () => {
      document.querySelectorAll('.js-gucci-pdp-gallery').forEach((gallery) => {
        delete gallery.dataset.gucciGalleryReady;
      });
      document.querySelectorAll('.gucci-pdp-gallery-image').forEach((img) => {
        delete img.dataset.gucciHiRes;
      });
      cleanupClassicPdpImages();
      initGucciGalleries();
    });
  }

  const PDP_ACCORDION_PANEL_SELECTOR = '#product .gucci-pdp-accordion-panel';

  const initGucciPdpAccordionPanels = () => {
    document.querySelectorAll(PDP_ACCORDION_PANEL_SELECTOR).forEach((panel) => {
      const panelId = panel.getAttribute('id');
      const trigger = panelId
        ? document.querySelector(`[data-gucci-accordion-trigger][aria-controls="${panelId}"]`)
        : null;
      const isOpen = trigger?.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        panel.removeAttribute('hidden');
        panel.classList.add('is-accordion-open');
        panel.style.maxHeight = 'none';
      } else if (panel.hasAttribute('hidden')) {
        panel.classList.remove('is-accordion-open');
        panel.style.maxHeight = '0';
      }
    });
  };

  const initGucciAccordions = () => {
    if (document.documentElement.dataset.gucciAccordionReady === '1') {
      return;
    }
    document.documentElement.dataset.gucciAccordionReady = '1';

    const syncFooterAccordionsLayout = () => {
      const isDesktop = window.matchMedia('(min-width: 992px)').matches;
      document.querySelectorAll('.gucci-footer-accordion-panel').forEach((panel) => {
        const panelId = panel.id;
        const trigger = panelId
          ? document.querySelector(`[data-gucci-footer-accordion-trigger][aria-controls="${panelId}"]`)
          : null;

        if (isDesktop) {
          panel.hidden = false;
          panel.classList.add('is-desktop-open');
          trigger?.setAttribute('aria-expanded', 'false');
          return;
        }

        panel.classList.remove('is-desktop-open');
        const isOpen = trigger?.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
          panel.removeAttribute('hidden');
          panel.classList.add('is-accordion-open');
          panel.style.maxHeight = 'none';
        } else {
          panel.classList.remove('is-accordion-open');
          panel.setAttribute('hidden', '');
          panel.style.maxHeight = '0';
        }
      });
    };

    initGucciPdpAccordionPanels();

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const footerTrigger = target.closest('[data-gucci-footer-accordion-trigger]');
      if (footerTrigger) {
        if (window.matchMedia('(min-width: 992px)').matches) {
          return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        const footerPanelId = footerTrigger.getAttribute('aria-controls');
        const footerPanel = footerPanelId ? document.getElementById(footerPanelId) : null;
        if (!footerPanel) {
          return;
        }

        const willOpen = footerTrigger.getAttribute('aria-expanded') !== 'true';
        footerTrigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        setAccordionPanelOpen(footerPanel, willOpen);
        footerTrigger.blur();
        return;
      }

      const pdpTrigger = target.closest('[data-gucci-accordion-trigger]');
      if (!pdpTrigger) {
        return;
      }

      const pdpPanelId = pdpTrigger.getAttribute('aria-controls');
      const pdpPanel = pdpPanelId ? document.getElementById(pdpPanelId) : null;
      if (!pdpPanel || !pdpPanel.classList.contains('gucci-pdp-accordion-panel')) {
        return;
      }

      if (window.getComputedStyle(pdpTrigger).pointerEvents === 'none') {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      const isOpen = pdpTrigger.getAttribute('aria-expanded') === 'true';
      pdpTrigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      setAccordionPanelOpen(pdpPanel, !isOpen);
      pdpTrigger.blur();
    }, true);

    syncFooterAccordionsLayout();
    window.addEventListener('resize', syncFooterAccordionsLayout, { passive: true });
  };

  initGucciAccordions();

  if (filtersWrapper) {
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const openTrigger = target.closest('#search_filter_toggler, [data-gucci-filters-open]');
      if (openTrigger) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (filtersWrapper.classList.contains('is-open')) {
          closeFilters();
        } else {
          openFilters();
        }
        return;
      }
    }, true);

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (
        filtersWrapper.classList.contains('is-open')
        && !filtersWrapper.contains(target)
        && !target.closest('[data-gucci-filters-close]')
        && !target.closest('#search_filter_toggler, [data-gucci-filters-open]')
      ) {
        closeFilters();
      }
    });

    if (filtersBackdrop) {
      filtersBackdrop.addEventListener('click', closeFilters);
    }

    document.querySelectorAll('[data-gucci-filters-close]').forEach((closeBtn) => {
      closeBtn.addEventListener('click', closeFilters);
    });
  }

  if (sortWrapper) {
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const openTrigger = target.closest('#gucci-sort-toggler, [data-gucci-sort-open]');
      if (openTrigger) {
        event.preventDefault();
        if (sortWrapper.classList.contains('is-open')) {
          closeSort();
        } else {
          openSort();
        }
        return;
      }

      if (
        sortWrapper.classList.contains('is-open')
        && !sortWrapper.contains(target)
        && !target.closest('[data-gucci-sort-close]')
      ) {
        closeSort();
      }
    });

    if (sortBackdrop) {
      sortBackdrop.addEventListener('click', closeSort);
    }

    document.querySelectorAll('[data-gucci-sort-close]').forEach((closeBtn) => {
      closeBtn.addEventListener('click', closeSort);
    });
  }

  if (filtersWrapper || sortWrapper) {
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (filtersWrapper?.classList.contains('is-open')) {
        closeFilters();
      }

      if (sortWrapper?.classList.contains('is-open')) {
        closeSort();
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

    if (open) {
      cartModalBackdrop.hidden = false;
      requestAnimationFrame(() => {
        cartModalBackdrop.classList.add('is-visible');
      });
    } else {
      cartModalBackdrop.classList.remove('is-visible');
      cartModalBackdrop.addEventListener('transitionend', () => {
        if (!cartModalBackdrop.classList.contains('is-visible')) {
          cartModalBackdrop.hidden = true;
        }
      }, { once: true });
    }

    document.body.classList.toggle('gucci-cart-modal-open', open);
  };

  if (cartModal && typeof window.jQuery !== 'undefined') {
    window.jQuery(cartModal)
      .on('show.bs.modal shown.bs.modal', () => syncCartModalBackdrop(true))
      .on('hide.bs.modal hidden.bs.modal', () => syncCartModalBackdrop(false));
  }

  const gucciReplaceBlockcartFromResponse = (resp) => {
    if (!resp) {
      return;
    }

    if (resp.preview) {
      const cartRoot = document.querySelector('#_desktop_cart');
      if (cartRoot) {
        const previewWrap = document.createElement('div');
        previewWrap.innerHTML = resp.preview.trim();
        const newCartRoot = previewWrap.querySelector('#_desktop_cart') || previewWrap.firstElementChild;
        if (newCartRoot) {
          cartRoot.replaceWith(newCartRoot);
        }
      }
    }

    if (resp.modal) {
      const currentModal = document.getElementById('blockcart-modal');
      const modalWrap = document.createElement('div');
      modalWrap.innerHTML = resp.modal.trim();
      const newModal = modalWrap.querySelector('#blockcart-modal');

      if (currentModal && newModal) {
        const wasOpen =
          currentModal.classList.contains('show')
          || currentModal.classList.contains('in')
          || document.body.classList.contains('gucci-cart-modal-open');

        currentModal.replaceWith(newModal);
        gucciAfterBlockcartModalMounted();

        if (wasOpen && typeof window.jQuery !== 'undefined') {
          window.jQuery(newModal).modal('show');
        }

        if (!newModal.querySelector('.gucci-cart-modal-product') && typeof window.jQuery !== 'undefined') {
          window.jQuery(newModal).modal('hide');
        }
      }
    }
  };

  const gucciSyncBlockcartPreview = () => {
    const refreshUrl = document.querySelector('.blockcart')?.dataset?.refreshUrl;
    if (!refreshUrl || typeof window.jQuery === 'undefined') {
      return Promise.resolve(null);
    }

    return window.jQuery.post(refreshUrl, {}, null, 'json').then((refreshResp) => {
      if (refreshResp?.preview) {
        gucciReplaceBlockcartFromResponse({ preview: refreshResp.preview });
      }

      return refreshResp;
    });
  };

  const gucciFormatMoneyLikeSample = (amount, sampleValue) => {
    const safeAmount = Math.max(0, Number(amount) || 0);
    const sample = typeof sampleValue === 'string' ? sampleValue : '';

    if (sample.includes(',')) {
      return `${safeAmount.toFixed(2).replace('.', ',')} €`;
    }

    if (sample.includes('€')) {
      return `€${safeAmount.toFixed(2)}`;
    }

    return safeAmount.toFixed(2);
  };

  const gucciSyncFreeShippingHintInModal = (modal, cart) => {
    if (!modal || !cart) {
      return;
    }

    const summaryBlock = modal.querySelector('.gucci-cart-summary-block');
    if (!summaryBlock) {
      return;
    }

    const threshold = parseFloat(summaryBlock.dataset.gucciFreeShippingThreshold || '0');
    const productsAmount = parseFloat(cart.subtotals?.products?.amount ?? '0');
    const subtotalSample = cart.subtotals?.products?.value || '';
    const isItalian =
      document.documentElement.lang?.toLowerCase().startsWith('it')
      || document.body.classList.contains('lang-it');

    let hint = summaryBlock.querySelector('.gucci-free-shipping-hint');

    if (threshold <= 0 || productsAmount >= threshold - 0.001) {
      hint?.remove();
      return;
    }

    const remaining = threshold - productsAmount;
    const remainingValue = gucciFormatMoneyLikeSample(remaining, subtotalSample);

    if (!hint) {
      hint = document.createElement('div');
      hint.className = 'gucci-free-shipping-hint';
      hint.setAttribute('aria-live', 'polite');
      hint.innerHTML = isItalian
        ? '<p class="gucci-free-shipping-hint__text">SPEDIZIONE GRATUITA SE AGGIUNGI ALTRI <span class="gucci-free-shipping-hint__amount"></span> DI SPESA AL CARRELLO.</p>'
        : '<p class="gucci-free-shipping-hint__text">Free shipping if you add another <span class="gucci-free-shipping-hint__amount"></span> of spending to your cart.</p>';
      summaryBlock.appendChild(hint);
    }

    const amountNode = hint.querySelector('.gucci-free-shipping-hint__amount');
    if (amountNode) {
      amountNode.textContent = remainingValue;
    }
  };

  const gucciApplyCartUpdateToModal = (resp) => {
    const modal = document.getElementById('blockcart-modal');
    if (!modal || !resp) {
      return;
    }

    const cart = resp.cart;
    const products = cart?.products || [];
    const isItalian =
      document.documentElement.lang?.toLowerCase().startsWith('it')
      || document.body.classList.contains('lang-it');

    if (products.length) {
      modal.querySelectorAll('.gucci-cart-modal-product').forEach((line) => {
        const product = products.find((item) => {
          const productId = String(item.id_product ?? item.id ?? '');
          const attributeId = String(item.id_product_attribute ?? 0);
          return productId === line.dataset.idProduct && attributeId === line.dataset.idProductAttribute;
        });

        if (!product) {
          line.remove();
          return;
        }

        const qty = product.quantity ?? product.cart_quantity ?? resp.quantity ?? 1;
        const input = line.querySelector('.gucci-cart-modal-qty-input');
        if (input) {
          input.value = qty;
          input.defaultValue = String(qty);
        }
      });
    } else if (
      typeof resp.id_product !== 'undefined'
      && typeof resp.quantity !== 'undefined'
    ) {
      const line = modal.querySelector(
        `.gucci-cart-modal-product[data-id-product="${resp.id_product}"][data-id-product-attribute="${resp.id_product_attribute || 0}"]`
      );

      if (resp.quantity <= 0) {
        line?.remove();
      } else {
        const input = line?.querySelector('.gucci-cart-modal-qty-input');
        if (input) {
          input.value = resp.quantity;
          input.defaultValue = String(resp.quantity);
        }
      }
    }

    if (cart) {
      const count = cart.products_count ?? products.length;
      const summary = modal.querySelector('.gucci-cart-summary-count');

      if (summary) {
        summary.textContent = isItalian
          ? (count === 1 ? '1 ARTICOLO NEL CARRELLO' : `${count} ARTICOLI NEL CARRELLO`)
          : (count === 1 ? '1 ITEM IN YOUR CART' : `${count} ITEMS IN YOUR CART`);
      }

      const subtotal = modal.querySelector('.gucci-cart-summary-subtotal-value');
      const subtotalValue = cart.subtotals?.products?.value;

      if (subtotal && subtotalValue) {
        subtotal.textContent = subtotalValue;
      }

      gucciSyncFreeShippingHintInModal(modal, cart);
    }

    if (!modal.querySelector('.gucci-cart-modal-product') && typeof window.jQuery !== 'undefined') {
      window.jQuery(modal).modal('hide');
    }
  };

  const gucciHidePageLoaderIfVisible = () => {
    const loader = document.getElementById('gucci-page-loader');
    if (!loader || loader.classList.contains('is-hidden')) {
      return;
    }

    loader.classList.add('is-hidden');
    document.documentElement.classList.remove('gucci-is-loading');
    document.body.classList.remove('gucci-is-loading');
  };

  const gucciRequestCartUpdate = (url, extraData = {}) => {
    if (!url || typeof window.jQuery === 'undefined') {
      return Promise.resolve(null);
    }

    return window.jQuery
      .post(url, Object.assign({ ajax: 1, action: 'update' }, extraData), null, 'json')
      .then((resp) => {
        if (!resp || resp.hasError) {
          return resp;
        }

        if (document.body.id === 'cart') {
          window.location.reload();
          return resp;
        }

        if (resp.modal) {
          gucciReplaceBlockcartFromResponse(resp);
        } else {
          gucciApplyCartUpdateToModal(resp);
        }

        return gucciSyncBlockcartPreview().then(() => {
          if (typeof prestashop !== 'undefined') {
            if (resp.cart) {
              prestashop.cart = resp.cart;
            }

            if (prestashop.emit) {
              prestashop.emit('updateCart', {
                reason: { linkAction: extraData.linkAction || 'update' },
                resp,
              });
            }
          }

          return resp;
        });
      })
      .always(gucciHidePageLoaderIfVisible);
  };

  const gucciIsCartControlsTarget = (element) => {
    if (!(element instanceof Element)) {
      return false;
    }

    return Boolean(
      element.closest('#blockcart-modal')
      || element.closest('body#cart .gucci-cart-page')
      || element.closest('body#cart .gucci-cart-overview')
    );
  };

  const gucciInitCartControlsDelegation = () => {
    if (document.documentElement.dataset.gucciCartControlsReady === '1') {
      return;
    }

    document.documentElement.dataset.gucciCartControlsReady = '1';

    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target || !gucciIsCartControlsTarget(target)) {
        return;
      }

      const qtyBtn = target.closest('[data-qty-action]');
      if (qtyBtn) {
        event.preventDefault();
        event.stopPropagation();
        const qtyWrap = qtyBtn.closest('[data-up-url][data-down-url]');
        if (!qtyWrap) {
          return;
        }

        const url = qtyBtn.dataset.qtyAction === 'up' ? qtyWrap.dataset.upUrl : qtyWrap.dataset.downUrl;
        if (url) {
          gucciRequestCartUpdate(url, { linkAction: 'update' });
        }
        return;
      }

      const removeLink = target.closest('.remove-from-cart');
      if (removeLink) {
        event.preventDefault();
        event.stopPropagation();
        gucciRequestCartUpdate(removeLink.href, { linkAction: 'delete-from-cart' });
      }
    });

    document.addEventListener('change', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target || !gucciIsCartControlsTarget(target)) {
        return;
      }

      const qtyInput = target.closest('.gucci-cart-qty-input, .gucci-cart-modal-qty-input');
      if (!qtyInput || !qtyInput.dataset.updateUrl) {
        return;
      }

      const qty = parseInt(qtyInput.value, 10);
      if (Number.isNaN(qty) || qty < 1) {
        qtyInput.value = qtyInput.defaultValue;
        return;
      }

      gucciRequestCartUpdate(qtyInput.dataset.updateUrl, {
        linkAction: 'update',
        qty,
      });
    });
  };

  const gucciUnwrapCartTouchspin = () => {
    document.querySelectorAll('body#cart .bootstrap-touchspin').forEach((wrap) => {
      const input = wrap.querySelector('.js-cart-line-product-quantity');
      if (input && wrap.parentNode) {
        wrap.parentNode.replaceChild(input, wrap);
      }
    });
  };

  const gucciBindCartModal = (modal) => {
    if (!modal || typeof window.jQuery === 'undefined') {
      return;
    }

    window.jQuery(modal)
      .off('show.bs.modal.gucci shown.bs.modal.gucci hide.bs.modal.gucci hidden.bs.modal.gucci')
      .on('show.bs.modal.gucci shown.bs.modal.gucci', () => syncCartModalBackdrop(true))
      .on('hide.bs.modal.gucci hidden.bs.modal.gucci', () => syncCartModalBackdrop(false));
  };

  const gucciAfterBlockcartModalMounted = () => {
    const modal = document.getElementById('blockcart-modal');
    if (!modal) {
      return;
    }

    gucciBindCartModal(modal);

    if (
      modal.classList.contains('show')
      || modal.classList.contains('in')
      || document.body.classList.contains('modal-open')
      || document.body.classList.contains('gucci-cart-modal-open')
    ) {
      syncCartModalBackdrop(true);
    }
  };

  const gucciHookBlockcartShowModal = () => {
    if (typeof prestashop === 'undefined' || !prestashop.blockcart || prestashop.blockcart.__gucciModalHooked) {
      return;
    }

    const originalShowModal = prestashop.blockcart.showModal;
    if (typeof originalShowModal !== 'function') {
      return;
    }

    prestashop.blockcart.showModal = (modalHtml) => {
      originalShowModal(modalHtml);
      gucciAfterBlockcartModalMounted();
    };

    prestashop.blockcart.__gucciModalHooked = true;
  };

  gucciInitCartControlsDelegation();
  gucciHookBlockcartShowModal();
  gucciAfterBlockcartModalMounted();

  if (document.body.id === 'cart') {
    gucciUnwrapCartTouchspin();
  }

  if (typeof prestashop !== 'undefined' && prestashop.on) {
    prestashop.on('updateCart', (event) => {
      if (!event?.resp || document.body.id === 'cart') {
        return;
      }

      if (event.resp.modal) {
        gucciReplaceBlockcartFromResponse(event.resp);
      } else if (event.resp.cart || typeof event.resp.quantity !== 'undefined') {
        gucciApplyCartUpdateToModal(event.resp);
      }

      requestAnimationFrame(gucciAfterBlockcartModalMounted);
    });
  }

  document.querySelectorAll(
    '.wishlist-add-to, .wishlist-delete, .wishlist-create, .wishlist-login, .wishlist-toast, [class*="wishlist-modal"]'
  ).forEach((node) => {
    node.remove();
  });

  const homeEditorial = document.querySelector('#index .gucci-home-categories');
  const homeHero = document.querySelector(
    '#index #module-ps_imageslider, #index .gucci-home-hero, #index .ps_imageslider'
  );

  if (homeEditorial && homeHero) {
    homeHero.insertAdjacentElement('afterend', homeEditorial);
  }

  const isItalian =
    document.documentElement.lang?.toLowerCase().startsWith('it')
    || document.body.classList.contains('lang-it');

  if (isItalian) {
    const itUiLabels = new Map([
      ['Delivery', 'Spedizioni'],
      ['Legal Notice', 'Note legali'],
      ['Terms and conditions of use', 'Termini e condizioni'],
      ['About us', 'Chi siamo'],
      ['Secure payment', 'Pagamento sicuro'],
      ['Contact us', 'Contattaci'],
      ['Sitemap', 'Mappa del sito'],
      ['Stores', 'Negozi'],
      ['New products', 'Nuovi prodotti'],
      ['Best sellers', 'Più venduti'],
      ['Prices drop', 'Offerte'],
      ['Specials', 'Offerte'],
      ['Sign in', 'Accedi'],
      ['Create account', 'Crea account'],
      ['My account', 'Il mio account'],
      ['Orders', 'I miei ordini'],
      ['Addresses', 'I miei indirizzi'],
      ['Personal info', 'Informazioni personali'],
      ['Order tracking', 'Tracciamento ordine'],
      ['Show details', 'Mostra dettagli'],
      ['Hide details', 'Nascondi dettagli'],
      ['Shipping', 'Spedizione'],
      ['Free', 'Gratis'],
      ['Total', 'Totale'],
      ['Subtotal', 'Subtotale'],
      ['Taxes', 'Tasse'],
      ['Payment', 'Pagamento'],
      ['I agree to the [terms of service] and will adhere to them unconditionally.', 'Accetto i termini e condizioni.'],
      ['All rights reserved.', 'Tutti i diritti riservati.'],
      ['Availability', 'Disponibilità'],
      ['Selections', 'Selezioni'],
      ['Price', 'Prezzo'],
      ['Categories', 'Categorie'],
      ['Size', 'Taglia'],
      ['Color', 'Colore'],
      ['Composition', 'Composizione'],
      ['Property', 'Caratteristiche'],
      ['Weight', 'Peso'],
      ['Brand', 'Marca'],
      ['In stock', 'In magazzino'],
      ['Not available', 'Non disponibile'],
      ['New product', 'Nuovo prodotto'],
      ['Discounted', 'Scontato'],
      ['Long sleeves', 'Maniche lunghe'],
      ['Short sleeves', 'Maniche corte'],
      ['Relevance', 'Rilevanza'],
      ['Price, low to high', 'Prezzo: crescente'],
      ['Price, high to low', 'Prezzo: decrescente'],
      ['Name, A to Z', 'Nome: A-Z'],
      ['Name, Z to A', 'Nome: Z-A'],
      ['Newest first', 'Più recenti'],
      ['Back to login', 'Torna al login'],
      ['Back to Login', 'Torna al login'],
      ['Back to your account', 'Torna al tuo account'],
      ['Send reset link', 'Invia link di reset'],
      ['Change Password', 'Cambia password'],
      ['Forgot your password?', 'Hai dimenticato la password?'],
      ['Reset your password', 'Reimposta la password'],
      ['Continue shopping', 'Continua lo shopping'],
      ['Details', 'Dettagli'],
      ['Reorder', 'Riordina'],
      ['Guest Order Tracking', 'Traccia il tuo ordine'],
      ['Send', 'Invia'],
      ['Dimension', 'Dimensione'],
      ['Paper Type', 'Tipo carta'],
      ['Manufacturers', 'Marchi'],
      ['Matt paper', 'Carta opaca'],
      ['Recycled cardboard', 'Cartone riciclato'],
      ['Ceramic', 'Ceramica'],
      ['120 pages', '120 pagine'],
      ['Removable cover', 'Copertina removibile'],
      ['Ruled', 'Righe'],
      ['Plain', 'Bianco'],
      ['Squared', 'Quadretti'],
      ['Doted', 'Puntini'],
      ['Brands', 'Marchi'],
      ['View products', 'Scopri'],
      ['%number% products', 'articoli'],
      ['%number% product', 'articolo'],
      ['No products', 'Nessun prodotto'],
      ['Shopping Cart', 'Carrello'],
      ['Proceed to checkout', 'Procedi al checkout'],
      ['show details', 'Mostra dettagli'],
      ['Show details', 'Mostra dettagli'],
      ['Have a promo code?', 'Hai un codice promozionale?'],
      ['Promo code', 'Codice promozionale'],
      ['Gift', 'Omaggio'],
      ['Product customization', 'Personalizzazione prodotto'],
      ['Remove', 'Rimuovi'],
      ['Add', 'Aggiungi'],
      ['Checkout', 'Cassa'],
      ['Complete your order', 'Completa il tuo ordine'],
      ['Newsletter', 'Iscriviti alla newsletter'],
      ['Your email address', 'Indirizzo e-mail'],
      ['Subscribe', 'Iscriviti'],
      ['Previous', 'Precedente'],
      ['Next', 'Successivo'],
      ['Quantity', 'Quantità'],
      ['Grey', 'Grigio'],
      ['Clothes', 'Abbigliamento'],
      ['Accessories', 'Accessori'],
      ['Art', 'Arte'],
      ['Men', 'Uomo'],
      ['Women', 'Donna'],
      ['Stationery', 'Cancelleria'],
      ['Home Accessories', 'Accessori per la casa'],
      ['Our company', 'La nostra azienda'],
      ['Products', 'Prodotti'],
      ['Your account', 'Il tuo account'],
      ['Pages', 'Pagine'],
      ['Offers', 'Offerte'],
      ['Message', 'Messaggio'],
      ['Subject', 'Oggetto'],
      ['Email address', 'Indirizzo e-mail'],
      ['Send message', 'Invia messaggio'],
      ['Send', 'Invia messaggio'],
      ['Contact us', 'Contattaci'],
      ['How can we help?', 'Come possiamo aiutarti?'],
      ['your@email.com', 'nome@esempio.it'],
      ['Select reference', 'Seleziona riferimento'],
      ['Order reference', 'Riferimento ordine'],
      ['Attachment', 'Allegato'],
      ['optional', 'facoltativo'],
      ['About and Contact', 'Info e contatti'],
      ['Opening hours', 'Orari'],
    ]);

    const applyItalianLabels = (selector) => {
      document.querySelectorAll(selector).forEach((node) => {
        const text = node.textContent?.trim();
        if (text && itUiLabels.has(text)) {
          node.textContent = itUiLabels.get(text);
        }
      });
    };

    applyItalianLabels('.gucci-footer-links a, body#checkout .gucci-checkout-summary a, body#checkout .cart-summary a');
    applyItalianLabels('#search_filters .facet-title, #search_filters .gucci-facet-title, #search_filters .gucci-facet-list a');
    applyItalianLabels('.gucci-plp-sort .select-list');
    applyItalianLabels('.gucci-pagination .page-list a, .gucci-plp-showing');
    document.querySelectorAll('.gucci-plp-showing, .pagination .col-md-4').forEach((node) => {
      const text = node.textContent?.trim();
      if (text && /^Showing \d+/.test(text)) {
        const match = text.match(/Showing (\d+)-(\d+) of (\d+) item\(s\)/);
        if (match) {
          node.textContent = `${match[1]}–${match[2]} di ${match[3]} articoli`;
        }
      }
    });
    applyItalianLabels('.gucci-footer-copyright');
    applyItalianLabels('.gucci-account-back-link, .gucci-account-back-links a, .gucci-orders-page a, body#guest-login label');
    applyItalianLabels('body#cart .cart-summary-line .label, body#cart .cart-summary-line .value, body#cart .promo-code-button, body#cart .block-promo label, body#checkout .js-show-details, body#checkout .promo-code-button, body#checkout .cart-summary-line .label, body#checkout .cart-summary-line .value, body#order-confirmation .cart-summary-line .label, body#order-confirmation .order-confirmation-table .label');
    applyItalianLabels('body#cart .cart-detailed-actions a, body#cart .checkout a, .gucci-cart-modal-actions a, .gucci-cart-modal-actions button');
    applyItalianLabels('.gucci-breadcrumb a span, .gucci-breadcrumb span, .gucci-menu-link, .gucci-drawer-footer .gucci-drawer-link');
    applyItalianLabels('.gucci-sitemap-group-title, .gucci-sitemap-col a, body#contact label, body#contact .form-control-label, body#cms label');

    const ariaLabelsIt = new Map([
      ['Shopping cart', 'Carrello'],
      ['Sign in', 'Accedi'],
      ['My account', 'Il mio account'],
      ['Close', 'Chiudi'],
      ['Menu', 'Menu'],
      ['Search', 'Cerca'],
      ['Subcategories', 'Sottocategorie'],
      ['Breadcrumb', 'Percorso'],
    ]);
    ariaLabelsIt.forEach((it, en) => {
      document.querySelectorAll(`[aria-label="${en}"]`).forEach((node) => {
        node.setAttribute('aria-label', it);
      });
    });

    document.querySelectorAll('body#password button[type="submit"], body#password .form-control-submit').forEach((btn) => {
      btn.classList.add('gucci-btn', 'gucci-btn--primary');
    });
  }

  if (isItalian) {
    const attrValueIt = new Map([
      ['White', 'Bianco'],
      ['Black', 'Nero'],
      ['Size', 'Taglia'],
      ['Color', 'Colore'],
      ['Dimension', 'Dimensione'],
    ]);
    document.querySelectorAll('.gucci-variant-size-label, .gucci-variant-radio-label, .attribute-name').forEach((node) => {
      const text = node.textContent?.trim();
      if (text && attrValueIt.has(text)) {
        node.textContent = attrValueIt.get(text);
      }
    });
    document.querySelectorAll('.gucci-variant-label').forEach((node) => {
      const text = node.textContent?.trim();
      if (text && attrValueIt.has(text)) {
        node.textContent = attrValueIt.get(text);
      }
    });
  }

  if (isItalian && document.body.id === 'cart') {
    document.querySelectorAll('body#cart .remove-from-cart').forEach((link) => {
      link.setAttribute('aria-label', 'Rimuovi');
      link.setAttribute('title', 'Rimuovi');
      const icon = link.querySelector('.material-icons');
      if (icon) {
        icon.textContent = 'close';
        icon.setAttribute('aria-hidden', 'true');
      }
    });
  }

  if (isItalian && document.body.id === 'checkout') {
    const checkoutStepTitles = new Map([
      ['Personal Information', 'Informazioni personali'],
      ['Addresses', 'Indirizzi'],
      ['Shipping Method', 'Spedizione'],
      ['Payment', 'Pagamento'],
    ]);
    document.querySelectorAll('body#checkout h1.step-title').forEach((h1) => {
      h1.childNodes.forEach((node) => {
        if (node.nodeType !== Node.TEXT_NODE) {
          return;
        }
        const trimmed = node.textContent.trim();
        if (checkoutStepTitles.has(trimmed)) {
          node.textContent = ` ${checkoutStepTitles.get(trimmed)} `;
        }
      });
    });

    const checkoutLabels = new Map([
      ['Continue', 'Continua'],
      ['Place order', 'Effettua ordine'],
      ['Save', 'Salva'],
      ['Cancel', 'Annulla'],
      ['add new address', 'Aggiungi indirizzo'],
      ['Show', 'Mostra'],
      ['Choose', 'Scegli'],
      ['Selected', 'Selezionato'],
      ['The selected address will be used as your personal address (for invoice).', 'L\'indirizzo selezionato sarà usato come indirizzo personale (fattura).'],
      ['The selected address will be used both as your personal address (for invoice) and as your delivery address.', 'L\'indirizzo selezionato sarà usato come indirizzo personale e di consegna.'],
      ['Billing address differs from shipping address', 'L\'indirizzo di fatturazione è diverso da quello di spedizione'],
    ]);

    document.querySelectorAll('body#checkout button, body#checkout a.btn, body#checkout label, body#checkout p').forEach((node) => {
      const text = node.textContent?.trim();
      if (text && checkoutLabels.has(text)) {
        node.textContent = checkoutLabels.get(text);
      }
    });

    const placeOrderBtn = document.querySelector('#payment-confirmation button');
    if (placeOrderBtn) {
      placeOrderBtn.classList.add('gucci-btn', 'gucci-btn--primary');
    }

    document.querySelectorAll('body#checkout button.continue, body#checkout button[name="confirm-addresses"]').forEach((btn) => {
      btn.classList.add('gucci-btn', 'gucci-btn--primary');
    });
  }

  /** Griglia prodotti come homepage — anche liste legacy (.products.row) e AJAX listing */
  const gucciProductGridSelectors = [
    '#products .products',
    '#product .gucci-pdp-product-grids .products',
    '#product .gucci-pdp-footer-grids .products',
    '#product .featured-products .products',
    '#index .featured-products .products',
    '#wrapper .featured-products .products',
    '.gucci-product-grid-hook .products',
    '.gucci-cart-cross-selling .products',
    '.gucci-order-confirmation-extra .products',
    '.gucci-not-found-products .products',
    '.gucci-category-empty-products .products',
    '.gucci-search-empty-products .products',
    '.gucci-cart-modal-cross-selling .products',
    '.cross-selling .products',
    '.gucci-product-grid-section .products',
    '.product-accessories .products',
  ];

  const isGucciProductGridExcluded = (grid) => Boolean(
    grid.closest(
      '.cart-overview, .cart-item, .product-line-grid, .cart-summary, .order-confirmation-table, #cart-summary-product-list, .gucci-cart-container'
    )
  );

  const upgradeGucciProductGrids = () => {
    const grids = new Set();

    gucciProductGridSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((grid) => grids.add(grid));
    });

    document.querySelectorAll('#wrapper .products.row, #wrapper .products:not(.gucci-plp-grid)').forEach((grid) => {
      if (!isGucciProductGridExcluded(grid)) {
        grids.add(grid);
      }
    });

    grids.forEach((grid) => {
      grid.classList.add('gucci-plp-grid');
      grid.classList.remove('row');
      grid.querySelectorAll(':scope > .js-product, :scope > .product').forEach((cell) => {
        cell.classList.add('gucci-plp-cell', 'gucci-product-miniature');
      });
    });
  };

  upgradeGucciProductGrids();

  if (typeof prestashop !== 'undefined' && prestashop.on) {
    prestashop.on('updateProductList', upgradeGucciProductGrids);
    prestashop.on('updatedProductList', upgradeGucciProductGrids);
  }

  const gridObserverRoots = [
    document.getElementById('products'),
    document.getElementById('js-product-list'),
    document.getElementById('wrapper'),
    document.querySelector('#product .gucci-pdp-product-grids'),
    document.querySelector('.gucci-product-grid-hook'),
  ].filter(Boolean);

  if (gridObserverRoots.length && typeof MutationObserver !== 'undefined') {
    let gridUpgradeFrame = 0;
    const scheduleGucciProductGridUpgrade = () => {
      if (gridUpgradeFrame) {
        cancelAnimationFrame(gridUpgradeFrame);
      }
      gridUpgradeFrame = requestAnimationFrame(() => {
        gridUpgradeFrame = 0;
        upgradeGucciProductGrids();
      });
    };

    const gridObserver = new MutationObserver(scheduleGucciProductGridUpgrade);
    gridObserverRoots.forEach((root) => {
      gridObserver.observe(root, { childList: true, subtree: true });
    });
  }

  /** Footer newsletter — ps_emailsubscription.js prepend l'alert nel form (layout rotto) */
  const initGucciFooterNewsletter = () => {
    const block = document.querySelector('.gucci-footer #blockEmailSubscription.gucci-footer-newsletter');
    if (!block) {
      return;
    }

    const form = block.querySelector('form');
    if (!form || form.dataset.gucciNewsletterBound === '1') {
      return;
    }

    form.dataset.gucciNewsletterBound = '1';

    const heading = block.querySelector('.gucci-footer-heading');

    const getSubscriptionUrl = () => (
      typeof window.psemailsubscription_subscription === 'string'
        ? window.psemailsubscription_subscription
        : null
    );

    const clearNewsletterFeedback = () => {
      block.querySelectorAll('.gucci-footer-newsletter-feedback').forEach((node) => node.remove());
      form.querySelectorAll('.alert, .block_newsletter_alert').forEach((node) => node.remove());
    };

    const showNewsletterFeedback = (message, isError) => {
      clearNewsletterFeedback();

      const feedback = document.createElement('div');
      feedback.className = `gucci-footer-newsletter-feedback gucci-footer-newsletter-feedback--${isError ? 'error' : 'ok'}`;
      feedback.setAttribute('role', isError ? 'alert' : 'status');

      const paragraph = document.createElement('p');
      paragraph.className = `gucci-footer-newsletter-msg gucci-footer-newsletter-msg--${isError ? 'error' : 'ok'}`;
      paragraph.textContent = message;
      feedback.appendChild(paragraph);

      if (isError) {
        form.style.display = '';
        form.insertAdjacentElement('beforebegin', feedback);
        return;
      }

      form.style.display = 'none';
      if (heading) {
        heading.insertAdjacentElement('afterend', feedback);
      } else {
        block.prepend(feedback);
      }
    };

    form.addEventListener('submit', (event) => {
      const subscriptionUrl = getSubscriptionUrl();
      if (!subscriptionUrl) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      fetch(subscriptionUrl, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json',
        },
        credentials: 'same-origin',
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data || typeof data.msg !== 'string') {
            form.submit();
            return;
          }

          showNewsletterFeedback(data.msg, Boolean(data.nw_error));
        })
        .catch(() => {
          form.submit();
        });
    }, true);
  };

  initGucciFooterNewsletter();

  const initGucciPageLoader = () => {
    const loader = document.getElementById('gucci-page-loader');
    if (!loader) {
      return;
    }

    const setLoadingState = (isLoading) => {
      document.documentElement.classList.toggle('gucci-is-loading', isLoading);
      document.body.classList.toggle('gucci-is-loading', isLoading);
    };

    const showLoader = () => {
      loader.classList.remove('is-hidden');
      setLoadingState(true);
    };

    const hideLoader = () => {
      if (loader.classList.contains('is-hidden')) {
        return;
      }

      loader.classList.add('is-hidden');
      setLoadingState(false);
    };

    const isInternalNavigationLink = (link) => {
      if (!(link instanceof HTMLAnchorElement)) {
        return false;
      }

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || link.target === '_blank' || link.hasAttribute('download')) {
        return false;
      }

      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) {
          return false;
        }

        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    };

    const isGucciAjaxCartLink = (link) => {
      if (!(link instanceof HTMLAnchorElement)) {
        return false;
      }

      if (link.classList.contains('remove-from-cart')) {
        return true;
      }

      const linkAction = link.dataset.linkAction;
      return linkAction === 'delete-from-cart' || linkAction === 'update';
    };

    const revealWhenReady = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(hideLoader);
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', revealWhenReady, { once: true });
    } else {
      revealWhenReady();
    }

    document.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = event.target.closest('a[href]');
      if (!isInternalNavigationLink(link) || isGucciAjaxCartLink(link)) {
        return;
      }

      showLoader();
    }, true);

    document.addEventListener('submit', (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || form.target) {
        return;
      }

      if (form.closest('#gucci-everpopup-overlay')) {
        return;
      }

      showLoader();
    }, true);

    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        hideLoader();
      }
    });
  };

  initGucciPageLoader();
};

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClassicGucciTheme);
  } else {
    initClassicGucciTheme();
  }
})();
