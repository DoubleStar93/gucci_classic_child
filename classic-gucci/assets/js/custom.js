/**
 * Classic Gucci — drawer menu, ricerca, contatti, accordion
 */
document.addEventListener('DOMContentLoaded', () => {
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
      || document.body.classList.contains('gucci-filters-open');

    const scrolled = forceSolid || window.scrollY > headerScrollThreshold;
    header.classList.toggle('is-scrolled', scrolled);
  };

  if (header) {
    if (document.body.id === 'product') {
      const syncPdpHeaderState = () => {
        if (window.scrollY <= headerScrollThreshold) {
          header.classList.remove('is-scrolled');
        }
      };

      syncPdpHeaderState();
      window.addEventListener('pageshow', syncPdpHeaderState);
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
  const filterToggler = document.getElementById('search_filter_toggler');
  const filtersWrapper = document.getElementById('search_filters_wrapper');
  const filtersBackdrop = document.getElementById('gucci-filters-backdrop');

  const closeFilters = () => {
    if (filtersWrapper) {
      filtersWrapper.classList.remove('is-open');
      filtersWrapper.setAttribute('aria-hidden', 'true');
    }

    if (filtersBackdrop) {
      filtersBackdrop.classList.remove('is-open');
      filtersBackdrop.hidden = true;
      filtersBackdrop.setAttribute('aria-hidden', 'true');
    }

    document.body.classList.remove('gucci-filters-open');
  };

  const openFilters = () => {
    if (!filtersWrapper) {
      return;
    }

    filtersWrapper.classList.add('is-open');
    filtersWrapper.setAttribute('aria-hidden', 'false');

    if (filtersBackdrop) {
      filtersBackdrop.hidden = false;
      filtersBackdrop.classList.add('is-open');
      filtersBackdrop.setAttribute('aria-hidden', 'false');
    }

    document.body.classList.add('gucci-filters-open');
  };

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
    updateHeaderOnScroll();
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

    searchPanel.classList.remove('is-open');
    searchPanel.hidden = true;
    searchPanel.setAttribute('aria-hidden', 'true');
    searchToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('gucci-search-open');
    updateHeaderOnScroll();

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
    updateHeaderOnScroll();
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
    updateHeaderOnScroll();
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
    updateHeaderOnScroll();
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

    closeMenu();
    closeContact();
    closeAccount();
    searchPanel.hidden = false;
    searchPanel.classList.add('is-open');
    searchPanel.setAttribute('aria-hidden', 'false');
    searchToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('gucci-search-open');
    updateHeaderOnScroll();

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

  const initGucciPdpGallery = () => {
    cleanupClassicPdpImages();
    upgradeGucciGalleryResolution();

    const pdpGallery = document.querySelector('.js-gucci-pdp-gallery[data-gucci-gallery-slider]');
    if (!pdpGallery || pdpGallery.dataset.gucciGalleryReady === '1') {
      return;
    }

    pdpGallery.dataset.gucciGalleryReady = '1';

    const pdpViewport = pdpGallery.querySelector('.js-gucci-pdp-gallery-viewport');
    const pdpSlides = Array.from(pdpGallery.querySelectorAll('.gucci-pdp-gallery-slide'));
    const pdpThumbs = Array.from(pdpGallery.querySelectorAll('.gucci-pdp-gallery-thumb'));
    const pdpCounterCurrent = pdpGallery.querySelector('.gucci-pdp-gallery-counter-current');
    let pdpActiveIndex = 0;
    let pdpTouchStartX = 0;

    const goToPdpSlide = (index) => {
      if (!pdpSlides.length) {
        return;
      }

      const nextIndex = Math.max(0, Math.min(index, pdpSlides.length - 1));
      pdpActiveIndex = nextIndex;

      pdpSlides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === nextIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      pdpThumbs.forEach((thumb, thumbIndex) => {
        const isActive = thumbIndex === nextIndex;
        thumb.classList.toggle('is-active', isActive);
        thumb.setAttribute('aria-current', isActive ? 'true' : 'false');
      });

      if (pdpCounterCurrent) {
        pdpCounterCurrent.textContent = String(nextIndex + 1);
      }

      pdpSlides.forEach((slide) => {
        const img = slide.querySelector('.gucci-pdp-gallery-image');
        if (img) {
          img.classList.remove('js-qv-product-cover');
        }
      });

      const activeImg = pdpSlides[nextIndex]?.querySelector('.gucci-pdp-gallery-image');
      if (activeImg) {
        activeImg.classList.add('js-qv-product-cover');
      }

      upgradeGucciGalleryResolution();
    };

    pdpThumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const slideIndex = Number.parseInt(thumb.getAttribute('data-slide-index') || '0', 10);
        goToPdpSlide(slideIndex);
      });
    });

    if (pdpViewport) {
      pdpViewport.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          goToPdpSlide(pdpActiveIndex + 1);
        }

        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          goToPdpSlide(pdpActiveIndex - 1);
        }
      });

      pdpViewport.addEventListener(
        'touchstart',
        (event) => {
          pdpTouchStartX = event.changedTouches[0]?.clientX ?? 0;
        },
        { passive: true }
      );

      pdpViewport.addEventListener(
        'touchend',
        (event) => {
          const touchEndX = event.changedTouches[0]?.clientX ?? 0;
          const deltaX = touchEndX - pdpTouchStartX;

          if (Math.abs(deltaX) < 48) {
            return;
          }

          if (deltaX < 0) {
            goToPdpSlide(pdpActiveIndex + 1);
          } else {
            goToPdpSlide(pdpActiveIndex - 1);
          }
        },
        { passive: true }
      );
    }

    goToPdpSlide(0);
  };

  initGucciPdpGallery();

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
      initGucciPdpGallery();
    });
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

  if (filterToggler && filtersWrapper) {
    filterToggler.addEventListener('click', () => {
      if (filtersWrapper.classList.contains('is-open')) {
        closeFilters();
      } else {
        openFilters();
      }
    });

    if (filtersBackdrop) {
      filtersBackdrop.addEventListener('click', closeFilters);
    }

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
