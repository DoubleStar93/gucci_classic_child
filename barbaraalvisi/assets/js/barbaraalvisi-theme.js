/**
 * Barbara Alvisi — drawer menu, ricerca, contatti, accordion
 * Caricato manualmente dopo il bundle CCC (non usare assets/js/custom.js — PS lo include nel bundle).
 */
(() => {
  const syncBarbaraalvisiCustomerPrivacyField = () => {
    const customerForm = document.getElementById('customer-form');
    if (!customerForm) {
      return;
    }

    const consentCheckbox = customerForm.querySelector('input[name="psgdpr"]');
    if (!consentCheckbox) {
      return;
    }

    let privacyField = customerForm.querySelector('.js-barbaraalvisi-customer-privacy-sync');
    if (!privacyField) {
      privacyField = document.createElement('input');
      privacyField.type = 'hidden';
      privacyField.name = 'customer_privacy';
      privacyField.className = 'js-barbaraalvisi-customer-privacy-sync';
      privacyField.setAttribute('aria-hidden', 'true');
      customerForm.appendChild(privacyField);
    } else if (privacyField.type === 'checkbox') {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = 'customer_privacy';
      hiddenField.className = 'js-barbaraalvisi-customer-privacy-sync';
      hiddenField.setAttribute('aria-hidden', 'true');
      privacyField.replaceWith(hiddenField);
      privacyField = hiddenField;
    }

    if (consentCheckbox.checked) {
      privacyField.disabled = false;
      privacyField.value = '1';
      return;
    }

    privacyField.value = '';
    privacyField.disabled = true;
  };

  const isCheckoutOrderRequest = (url, method) => {
    if (document.body?.id !== 'checkout') {
      return false;
    }

    const requestMethod = String(method || 'GET').toUpperCase();
    if (requestMethod !== 'POST') {
      return false;
    }

    return String(url || '').includes('controller=order');
  };

  const getBarbaraalvisiCustomerPrivacyValue = () => {
    syncBarbaraalvisiCustomerPrivacyField();

    const privacyField = document.querySelector('#customer-form .js-barbaraalvisi-customer-privacy-sync');
    if (!(privacyField instanceof HTMLInputElement) || privacyField.disabled) {
      return '';
    }

    return privacyField.value || '1';
  };

  const appendBarbaraalvisiCustomerPrivacyToBody = (body) => {
    const privacyValue = getBarbaraalvisiCustomerPrivacyValue();
    if (!privacyValue || typeof body !== 'string' || body.includes('customer_privacy=')) {
      return body;
    }

    const prefix = body.length ? '&' : '';
    return `${body}${prefix}customer_privacy=${encodeURIComponent(privacyValue)}`;
  };

  const guardBarbaraalvisiCheckoutOrderPosts = () => {
    if (window.__barbaraalvisiCheckoutOrderPostGuard === '1') {
      return;
    }

    window.__barbaraalvisiCheckoutOrderPostGuard = '1';

    if (window.jQuery && typeof window.jQuery === 'function') {
      window.jQuery.ajaxPrefilter((options) => {
        if (!isCheckoutOrderRequest(options?.url, options?.type)) {
          return;
        }

        if (typeof options.data === 'string') {
          options.data = appendBarbaraalvisiCustomerPrivacyToBody(options.data);
          return;
        }

        if (options.data && typeof options.data === 'object' && !(options.data instanceof FormData)) {
          if (!Object.prototype.hasOwnProperty.call(options.data, 'customer_privacy')) {
            const privacyValue = getBarbaraalvisiCustomerPrivacyValue();
            if (privacyValue) {
              options.data.customer_privacy = privacyValue;
            }
          }
        }
      });
    }

    if (typeof XMLHttpRequest !== 'undefined') {
      const xhrOpen = XMLHttpRequest.prototype.open;
      const xhrSend = XMLHttpRequest.prototype.send;

      XMLHttpRequest.prototype.open = function open(method, url, ...rest) {
        this.__barbaraalvisiMethod = method;
        this.__barbaraalvisiUrl = url;
        return xhrOpen.call(this, method, url, ...rest);
      };

      XMLHttpRequest.prototype.send = function send(body) {
        if (isCheckoutOrderRequest(this.__barbaraalvisiUrl, this.__barbaraalvisiMethod)) {
          body = appendBarbaraalvisiCustomerPrivacyToBody(body);
        }

        return xhrSend.call(this, body);
      };
    }
  };

  const setupBarbaraalvisiCheckoutConsent = () => {
    if (document.body?.id !== 'checkout') {
      return;
    }

    guardBarbaraalvisiCheckoutOrderPosts();

    const customerForm = document.getElementById('customer-form');
    if (!customerForm || customerForm.dataset.barbaraalvisiConsentValidation === '1') {
      return;
    }

    customerForm.dataset.barbaraalvisiConsentValidation = '1';

    const consentCheckbox = customerForm.querySelector('input[name="psgdpr"]');
    if (!consentCheckbox) {
      return;
    }

    const consentGroup = consentCheckbox.closest('.form-group');
    const consentMessage = 'Seleziona questa casella per accettare i termini e condizioni e continuare.';

    const syncConsentValidity = () => {
      syncBarbaraalvisiCustomerPrivacyField();

      if (consentCheckbox.checked) {
        consentCheckbox.setCustomValidity('');
        consentGroup?.classList.remove('barbaraalvisi-form-group--invalid');
        return;
      }

      consentCheckbox.setCustomValidity(consentMessage);
    };

    consentCheckbox.addEventListener('change', syncConsentValidity);
    consentCheckbox.addEventListener('invalid', () => {
      consentGroup?.classList.add('barbaraalvisi-form-group--invalid');
      consentCheckbox.setCustomValidity(consentMessage);
    });

    customerForm.addEventListener('submit', (event) => {
      syncConsentValidity();
      if (!customerForm.checkValidity()) {
        event.preventDefault();
        const firstInvalid = customerForm.querySelector(':invalid');
        if (firstInvalid instanceof HTMLElement) {
          firstInvalid.reportValidity();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest(
        '#customer-form [type="submit"], #customer-form [data-link-action="register-new-customer"], [data-link-action="register-new-customer"]'
      );
      if (!trigger || !customerForm.contains(trigger)) {
        return;
      }

      syncConsentValidity();
    }, true);

    syncConsentValidity();
  };

  const bootBarbaraalvisiCheckoutConsent = () => {
    setupBarbaraalvisiCheckoutConsent();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootBarbaraalvisiCheckoutConsent, { once: true });
  } else {
    bootBarbaraalvisiCheckoutConsent();
  }

  const setupBarbaraalvisiCheckoutTabs = () => {
    if (document.body?.id !== 'checkout') {
      return;
    }

    const step = document.getElementById('checkout-personal-information-step');
    if (!step || step.dataset.barbaraalvisiTabsInit === '1') {
      return;
    }

    const tabList = step.querySelector('.barbaraalvisi-checkout-tabs');
    const tabPanels = step.querySelector('.barbaraalvisi-checkout-tab-panels');
    if (!tabList || !tabPanels) {
      return;
    }

    step.dataset.barbaraalvisiTabsInit = '1';

    const activateCheckoutTab = (link) => {
      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      const targetId = link.getAttribute('href')?.replace('#', '');
      if (!targetId) {
        return;
      }

      const targetPane = document.getElementById(targetId);
      if (!targetPane || !tabPanels.contains(targetPane)) {
        return;
      }

      tabList.querySelectorAll('.nav-link').forEach((tab) => {
        const isActive = tab === link;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      tabPanels.querySelectorAll('.tab-pane').forEach((pane) => {
        const isActive = pane === targetPane;
        pane.classList.toggle('active', isActive);
        pane.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });
    };

    tabList.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#checkout-"]');
      if (!link || !tabList.contains(link)) {
        return;
      }

      event.preventDefault();
      activateCheckoutTab(link);
    });
  };

  const bootBarbaraalvisiCheckoutTabs = () => {
    setupBarbaraalvisiCheckoutTabs();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootBarbaraalvisiCheckoutTabs, { once: true });
  } else {
    bootBarbaraalvisiCheckoutTabs();
  }

  const setupBarbaraalvisiCheckoutPayment = () => {
    if (document.body?.id !== 'checkout' || document.body.dataset.barbaraalvisiPaymentInit === '1') {
      return;
    }

    document.body.dataset.barbaraalvisiPaymentInit = '1';

    const PAYMENT_SUBMIT_KEY = 'barbaraalvisiCheckoutPaymentSubmit';

    const clearPaymentSubmitLock = () => {
      try {
        sessionStorage.removeItem(PAYMENT_SUBMIT_KEY);
      } catch {
        // ignore
      }

      document.body?.removeAttribute('data-barbaraalvisi-payment-submit');
    };

    clearPaymentSubmitLock();

    const getPaymentStep = () => document.getElementById('checkout-payment-step');

    const getSelectedPaymentOption = () => (
      document.querySelector('input[name="payment-option"]:checked')?.id || ''
    );

    const haveTermsBeenAccepted = () => (
      [...document.querySelectorAll('#conditions-to-approve input[type="checkbox"]')]
        .every((checkbox) => checkbox.checked)
    );

    const syncTermsButtonState = () => {
      const confirmButton = document.querySelector('#payment-confirmation button[type="submit"]');
      if (!confirmButton) {
        return;
      }

      const accepted = haveTermsBeenAccepted() && Boolean(getSelectedPaymentOption());
      confirmButton.disabled = !accepted;
      confirmButton.classList.toggle('disabled', !accepted);
    };

    const markTermsInvalid = () => {
      Array.from(document.querySelectorAll('#conditions-to-approve input[type="checkbox"]')).forEach((checkbox) => {
        const group = checkbox.closest('.form-group, li, .condition-label');
        if (!checkbox.checked) {
          group?.classList.add('barbaraalvisi-form-group--invalid');
          checkbox.setCustomValidity('Accetta i termini per continuare.');
          checkbox.reportValidity();
        } else {
          group?.classList.remove('barbaraalvisi-form-group--invalid');
          checkbox.setCustomValidity('');
        }
      });
    };

    document.querySelectorAll('#conditions-to-approve input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          const group = checkbox.closest('.form-group, li, .condition-label');
          group?.classList.remove('barbaraalvisi-form-group--invalid');
          checkbox.setCustomValidity('');
        }
        syncTermsButtonState();
        if (window.jQuery) {
          window.jQuery(checkbox).trigger('change');
        }
      });
    });

    document.addEventListener('change', (event) => {
      if (event.target.matches('input[name="payment-option"]')) {
        syncTermsButtonState();
      }
    }, true);

    const isPaymentSubmitLocked = () => {
      if (document.body?.dataset.barbaraalvisiPaymentSubmit === '1') {
        return true;
      }

      try {
        return sessionStorage.getItem(PAYMENT_SUBMIT_KEY) === '1';
      } catch {
        return false;
      }
    };

    const armPaymentSubmitLock = () => {
      document.body?.setAttribute('data-barbaraalvisi-payment-submit', '1');

      try {
        sessionStorage.setItem(PAYMENT_SUBMIT_KEY, '1');
      } catch {
        // ignore
      }
    };

    // Lascia al checkout nativo PS (bottom.js) ma blocca doppi click/submit.
    // I log server mostrano validateOrder chiamato due volte sullo stesso carrello.
    document.addEventListener('click', (event) => {
      const confirmButton = event.target.closest('#payment-confirmation button[type="submit"]');
      if (!confirmButton || confirmButton.disabled) {
        return;
      }

      if (isPaymentSubmitLocked()) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return;
      }

      armPaymentSubmitLock();
      if (typeof window.barbaraalvisiHidePageLoader === 'function') {
        window.barbaraalvisiHidePageLoader();
      }
    }, true);

    document.addEventListener('submit', (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) {
        return;
      }

      const paymentStep = getPaymentStep();
      if (!paymentStep || !paymentStep.contains(form)) {
        return;
      }

      if (!form.closest('.js-payment-option-form, [id^="pay-with-"]')) {
        return;
      }

      armPaymentSubmitLock();
    }, true);

    // Non intercettare #payment-confirmation: lascia al checkout nativo PS (bottom.js).
    document.addEventListener('click', (event) => {
      const paymentStep = getPaymentStep();
      if (!paymentStep) {
        return;
      }

      const rogueSubmit = event.target.closest(
        '.js-payment-option-form button[type="submit"], .js-payment-option-form input[type="submit"], .additional-information button[type="submit"], .additional-information input[type="submit"]'
      );

      if (!rogueSubmit || !paymentStep.contains(rogueSubmit)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      markTermsInvalid();
    }, true);

    if (typeof prestashop !== 'undefined' && prestashop.on) {
      prestashop.on('changedCheckoutStep', () => {
        window.requestAnimationFrame(syncTermsButtonState);
      });
      prestashop.on('orderConfirmationErrors', clearPaymentSubmitLock);
      prestashop.on('handleError', clearPaymentSubmitLock);
    }

    window.addEventListener('pageshow', () => {
      if (document.body?.id === 'order-confirmation' || document.body?.id === 'checkout') {
        clearPaymentSubmitLock();
      }
    });

    syncTermsButtonState();
  };

  const bootBarbaraalvisiCheckoutPayment = () => {
    setupBarbaraalvisiCheckoutPayment();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootBarbaraalvisiCheckoutPayment, { once: true });
  } else {
    bootBarbaraalvisiCheckoutPayment();
  }

  if (window.__barbaraalvisiClassicThemeLoaded) {
    return;
  }

  window.__barbaraalvisiClassicThemeLoaded = true;

  const initClassicBarbaraalvisiTheme = () => {
  if (document.documentElement.dataset.barbaraalvisiThemeInit === '1') {
    return;
  }
  document.documentElement.dataset.barbaraalvisiThemeInit = '1';

  const suppressEverpopupOnCheckoutCart = () => {
    const bodyId = document.body && document.body.id;
    if (bodyId !== 'cart' && bodyId !== 'checkout') {
      return;
    }

    document.body.classList.remove('barbaraalvisi-everpopup-open');

    const overlay = document.getElementById('barbaraalvisi-everpopup-overlay');
    if (overlay) {
      overlay.setAttribute('hidden', '');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.classList.remove('is-open');
      overlay.style.display = 'none';
    }

    if (typeof window.hideBarbaraalvisiEverpopupPageLoader === 'function') {
      window.hideBarbaraalvisiEverpopupPageLoader();
    }
  };

  suppressEverpopupOnCheckoutCart();
  document.addEventListener('DOMContentLoaded', suppressEverpopupOnCheckoutCart, { once: true });

  const header = document.getElementById('header');
  const headerScrollThreshold = 32;

  const updateHeaderOnScroll = () => {
    if (!header) {
      return;
    }

    const forceSolid =
      document.body.classList.contains('barbaraalvisi-menu-open')
      || document.body.classList.contains('barbaraalvisi-search-open')
      || document.body.classList.contains('barbaraalvisi-contact-open')
      || document.body.classList.contains('barbaraalvisi-account-open')
      || document.body.classList.contains('barbaraalvisi-filters-open')
      || document.body.classList.contains('barbaraalvisi-sort-open');

    const scrolled = forceSolid || window.scrollY > headerScrollThreshold;
    header.classList.toggle('is-scrolled', scrolled);
  };

  if (header) {
    if (document.body.id === 'product' || document.body.id === 'index') {
      const syncHeroHeaderState = () => {
        if (
          window.scrollY <= headerScrollThreshold
          && !document.body.classList.contains('barbaraalvisi-menu-open')
          && !document.body.classList.contains('barbaraalvisi-search-open')
          && !document.body.classList.contains('barbaraalvisi-contact-open')
          && !document.body.classList.contains('barbaraalvisi-account-open')
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

  const drawer = document.querySelector('#mobile_top_menu_wrapper.barbaraalvisi-nav-drawer');
  const menuToggle = document.getElementById('menu-icon');
  const menuBackdrop = document.getElementById('barbaraalvisi-nav-backdrop');
  const drawerCloseBtn = document.querySelector('[data-barbaraalvisi-drawer-close]');
  const searchPanel = document.getElementById('barbaraalvisi-search-panel');
  const searchToggle = document.getElementById('barbaraalvisi-search-toggle');
  const searchCloseBtn = document.querySelector('[data-barbaraalvisi-search-close]');
  const searchInput = document.querySelector('#barbaraalvisi-search-panel .barbaraalvisi-search-input');
  const contactDrawer = document.getElementById('barbaraalvisi-contact-drawer');
  const contactBackdrop = document.getElementById('barbaraalvisi-contact-backdrop');
  const contactOpenBtns = document.querySelectorAll('[data-barbaraalvisi-contact-open]');
  const contactCloseBtns = document.querySelectorAll('[data-barbaraalvisi-contact-close]');
  const accountDrawer = document.getElementById('barbaraalvisi-account-drawer');
  const accountBackdrop = document.getElementById('barbaraalvisi-account-backdrop');
  const accountToggle = document.getElementById('barbaraalvisi-account-toggle');
  const accountCloseBtns = document.querySelectorAll('[data-barbaraalvisi-account-close]');
  const filtersWrapper = document.getElementById('barbaraalvisi-filters-drawer');
  const filtersBackdrop = document.getElementById('barbaraalvisi-filters-backdrop');
  const sortWrapper = document.getElementById('barbaraalvisi-sort-drawer');
  const sortBackdrop = document.getElementById('barbaraalvisi-sort-backdrop');

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

  const BARBARAALVISI_DRAWER_MS = 560;
  const BARBARAALVISI_BACKDROP_MS = 520;
  const BARBARAALVISI_OVERLAY_MS = 460;

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
      afterTransition(drawer, 'transform', BARBARAALVISI_DRAWER_MS),
      backdrop ? afterTransition(backdrop, 'opacity', BARBARAALVISI_BACKDROP_MS) : Promise.resolve(),
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

    return afterTransition(overlay, 'opacity', BARBARAALVISI_OVERLAY_MS).then(() => {
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
  const sortToggleBtn = document.getElementById('barbaraalvisi-sort-toggler');

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
    document.body.classList.remove('barbaraalvisi-filters-open');
    clearClassicMobileFilterLayout();
    hideDrawer(filtersWrapper, filtersBackdrop);
  };

  const closeSort = () => {
    if (sortWrapper) {
      sortWrapper.setAttribute('aria-hidden', 'true');
    }

    setDrawerToggleState(sortToggleBtn, false);
    document.body.classList.remove('barbaraalvisi-sort-open');
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
    document.body.classList.add('barbaraalvisi-filters-open');
    revealDrawer(filtersWrapper, filtersBackdrop);
  };

  const openSort = () => {
    if (!sortWrapper) {
      return;
    }

    closeFilters();
    sortWrapper.setAttribute('aria-hidden', 'false');
    setDrawerToggleState(sortToggleBtn, true);
    document.body.classList.add('barbaraalvisi-sort-open');
    revealDrawer(sortWrapper, sortBackdrop);
  };

  const collapseAllMenuSubmenus = () => {
    if (!drawer) {
      return;
    }

    drawer.querySelectorAll('.barbaraalvisi-sub-menu, .sub-menu.js-sub-menu').forEach((submenu) => {
      submenu.classList.remove('show', 'in', 'collapse');
      setAccordionPanelOpen(submenu, false, { openClass: 'is-open', instant: true });
    });

    drawer.querySelectorAll('.barbaraalvisi-menu-expand').forEach((button) => {
      button.setAttribute('aria-expanded', 'false');
    });
  };

  const expandAllMenuSubmenus = () => {
    if (!drawer) {
      return;
    }

    drawer.querySelectorAll('.barbaraalvisi-menu-expand[data-target]').forEach((button) => {
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
    document.body.classList.remove('barbaraalvisi-menu-open');
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
    document.body.classList.remove('barbaraalvisi-search-open', 'barbaraalvisi-contact-open', 'barbaraalvisi-account-open');

    drawer.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('barbaraalvisi-menu-open');
    revealDrawer(drawer, menuBackdrop);

    expandAllMenuSubmenus();
    [0, 50, 200].forEach((delay) => {
      window.setTimeout(expandAllMenuSubmenus, delay);
    });
    updateHeaderOnScroll();
  };

  const searchResults = document.getElementById('barbaraalvisi-search-results');

  const mountSearchAutocomplete = () => {
    const autocomplete = document.querySelector('.searchbar-autocomplete.ui-autocomplete');

    if (autocomplete && searchResults && !searchResults.contains(autocomplete)) {
      searchResults.appendChild(autocomplete);
    }

    if (typeof window.jQuery !== 'undefined' && searchInput) {
      const $input = window.jQuery(searchInput);
      if ($input.data('ui-autocomplete') || $input.data('psBlockSearchAutocomplete')) {
        try {
          $input.autocomplete('option', 'appendTo', '#barbaraalvisi-search-results');
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
    document.body.classList.remove('barbaraalvisi-search-open');
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

    document.body.classList.remove('barbaraalvisi-contact-open');
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

    document.body.classList.remove('barbaraalvisi-account-open');
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
    document.body.classList.remove('barbaraalvisi-menu-open', 'barbaraalvisi-search-open', 'barbaraalvisi-contact-open');

    accountDrawer.setAttribute('aria-hidden', 'false');
    if (accountToggle) {
      accountToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('barbaraalvisi-account-open');
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
    document.body.classList.remove('barbaraalvisi-menu-open', 'barbaraalvisi-search-open', 'barbaraalvisi-account-open');

    contactDrawer.setAttribute('aria-hidden', 'false');
    contactOpenBtns.forEach((button) => {
      button.setAttribute('aria-expanded', 'true');
    });
    document.body.classList.add('barbaraalvisi-contact-open');
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
    document.body.classList.remove('barbaraalvisi-menu-open', 'barbaraalvisi-contact-open', 'barbaraalvisi-account-open');

    searchPanel.setAttribute('aria-hidden', 'false');
    searchToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('barbaraalvisi-search-open');
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

  if (document.documentElement.dataset.barbaraalvisiHeaderToggleHandler !== '1') {
    document.documentElement.dataset.barbaraalvisiHeaderToggleHandler = '1';

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const searchBtn = target.closest('#barbaraalvisi-search-toggle');
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

      const accountBtn = target.closest('#barbaraalvisi-account-toggle');
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
      target.closest('#barbaraalvisi-search-panel')
      || target.closest('#barbaraalvisi-search-toggle')
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

      if (document.body.classList.contains('barbaraalvisi-menu-open')) {
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

    const toggleBarbaraalvisiSubmenu = (button, event) => {
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
      blurMenuControl(button.closest('.barbaraalvisi-menu-row')?.querySelector('.barbaraalvisi-menu-link'));
    };

    const initBarbaraalvisiMenuAccordion = () => {
      drawer.querySelectorAll('.barbaraalvisi-menu-expand[data-target]').forEach((button) => {
        if (button.dataset.barbaraalvisiMenuInit === '1') {
          return;
        }

        button.dataset.barbaraalvisiMenuInit = '1';

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
          toggleBarbaraalvisiSubmenu(button, event);
        });

        // Il link padre naviga alla categoria; solo il chevron apre/chiude il sottomenu.
        // (prima preventDefault + loader in capture lasciavano la pagina bloccata in caricamento)
      });
    };

    initBarbaraalvisiMenuAccordion();
    expandAllMenuSubmenus();

    if (menuToggle) {
      menuToggle.addEventListener(
        'click',
        () => {
          window.setTimeout(initBarbaraalvisiMenuAccordion, 0);
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

  /* PDP Barbaraalvisi — slider immagine singola + miniature overlay */
  const cleanupClassicPdpImages = () => {
    document
      .querySelectorAll(
        '#product .images-container, #product .js-qv-mask, #product #product-modal, #product .product-cover:not(.barbaraalvisi-pdp-gallery)'
      )
      .forEach((node) => {
        if (!(node instanceof HTMLElement)) {
          return;
        }

        // Non rimuovere il wrapper PS-refreshable che contiene la galleria Barbaraalvisi
        if (
          (node.classList.contains('images-container') || node.classList.contains('js-images-container'))
          && node.querySelector('.barbaraalvisi-pdp-gallery, .js-barbaraalvisi-pdp-gallery')
        ) {
          return;
        }

        if (node.closest('.barbaraalvisi-pdp-gallery')) {
          return;
        }

        node.remove();
      });
  };

  const BARBARAALVISI_IMAGE_SIZE_SUFFIX =
    /-(?:large_default|thickbox_default|home_default|medium_default|small_default|cart_default)(?=\.(?:jpe?g|png|webp|avif))/i;

  const barbaraalvisiImagePixelScore = (width, height) => {
    const w = Number(width) || 0;
    const h = Number(height) || 0;
    return w > 0 && h > 0 ? w * h : 0;
  };

  const stripBarbaraalvisiImageSizeSuffix = (url) => (url ? url.replace(BARBARAALVISI_IMAGE_SIZE_SUFFIX, '') : '');

  const getBarbaraalvisiGalleryImageCandidates = (img) => {
    const fromImg = img ? img.currentSrc || img.src || '' : '';
    const full = img?.getAttribute('data-image-full-src') || '';

    return [
      full,
      stripBarbaraalvisiImageSizeSuffix(full),
      stripBarbaraalvisiImageSizeSuffix(fromImg),
      fromImg,
      img?.getAttribute('data-image-large-src') || '',
    ].filter((url, index, list) => url && list.indexOf(url) === index);
  };

  const upgradeBarbaraalvisiGalleryResolution = () => {
    document.querySelectorAll('.barbaraalvisi-pdp-gallery-image').forEach((img) => {
      if (!img || img.dataset.barbaraalvisiHiRes === '1') {
        return;
      }

      const candidates = getBarbaraalvisiGalleryImageCandidates(img);
      const currentBest = img.currentSrc || img.src || '';
      const currentScore = barbaraalvisiImagePixelScore(img.naturalWidth, img.naturalHeight);
      let candidateIndex = 0;
      let bestUrl = currentBest;
      let bestScore = currentScore;

      const finishUpgrade = () => {
        if (bestUrl && bestUrl !== currentBest) {
          img.src = bestUrl;
        }
        img.dataset.barbaraalvisiHiRes = '1';
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
          const nextScore = barbaraalvisiImagePixelScore(probe.naturalWidth, probe.naturalHeight);
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

  const initBarbaraalvisiGallery = (gallery) => {
    if (!gallery || gallery.dataset.barbaraalvisiGalleryReady === '1') {
      return;
    }

    if (!gallery.hasAttribute('data-barbaraalvisi-gallery-slider')) {
      return;
    }

    gallery.dataset.barbaraalvisiGalleryReady = '1';

    const galleryViewport = gallery.querySelector('.js-barbaraalvisi-pdp-gallery-viewport');
    const gallerySlides = Array.from(gallery.querySelectorAll('.barbaraalvisi-pdp-gallery-slide'));
    const galleryThumbs = Array.from(gallery.querySelectorAll('.barbaraalvisi-pdp-gallery-thumb'));
    const galleryCounterCurrent = gallery.querySelector('.barbaraalvisi-pdp-gallery-counter-current');
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
        const img = slide.querySelector('.barbaraalvisi-pdp-gallery-image');
        if (img) {
          img.classList.remove('js-qv-product-cover');
        }
      });

      const activeImg = gallerySlides[nextIndex]?.querySelector('.barbaraalvisi-pdp-gallery-image');
      if (activeImg) {
        activeImg.classList.add('js-qv-product-cover');
      }

      upgradeBarbaraalvisiGalleryResolution();
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

  const initBarbaraalvisiGalleries = () => {
    if (document.body.id === 'product') {
      cleanupClassicPdpImages();
    }

    upgradeBarbaraalvisiGalleryResolution();
    document.querySelectorAll('.js-barbaraalvisi-pdp-gallery[data-barbaraalvisi-gallery-slider]').forEach(initBarbaraalvisiGallery);
  };

  initBarbaraalvisiGalleries();

  let barbaraalvisiGalleryResizeTimer;
  window.addEventListener('resize', () => {
    window.clearTimeout(barbaraalvisiGalleryResizeTimer);
    barbaraalvisiGalleryResizeTimer = window.setTimeout(() => {
      upgradeBarbaraalvisiGalleryResolution();
    }, 150);
  });

  const syncBarbaraalvisiPdpVariantNote = () => {
    const note = document.querySelector('.js-barbaraalvisi-variant-note');
    if (!(note instanceof HTMLElement)) {
      return;
    }

    const names = [...document.querySelectorAll('#product .product-variants input:checked')]
      .map((input) => {
        if (!(input instanceof HTMLInputElement)) {
          return '';
        }
        const label = input.closest('label');
        const aria = label?.getAttribute('aria-label');
        return (input.title || aria || '').trim();
      })
      .filter(Boolean);

    if (!names.length) {
      note.hidden = true;
      return;
    }

    const isIt = document.body.classList.contains('lang-it')
      || document.documentElement.lang?.toLowerCase().startsWith('it');
    const prefix = isIt ? 'Variante' : 'Variant';
    note.textContent = `${prefix} ${names.join(' ')}`;
    note.hidden = false;
  };

  const syncBarbaraalvisiPdpAddToCartState = () => {
    const availability = document.getElementById('product-availability');
    const addToCartBtn = document.querySelector('.barbaraalvisi-add-to-cart');
    if (!(availability instanceof HTMLElement)) {
      return;
    }

    if (addToCartBtn instanceof HTMLButtonElement && addToCartBtn.disabled) {
      availability.hidden = true;
      addToCartBtn.classList.add('barbaraalvisi-add-to-cart--unavailable');
      return;
    }

    addToCartBtn?.classList.remove('barbaraalvisi-add-to-cart--unavailable');
    const text = availability.textContent.replace(/\s+/g, ' ').trim();
    availability.hidden = !text;
  };

  if (typeof prestashop !== 'undefined' && prestashop.on) {
    prestashop.on('updatedProduct', (event) => {
      if (typeof window.barbaraalvisiHidePageLoader === 'function') {
        window.barbaraalvisiHidePageLoader();
      }

      const galleryCol = document.querySelector('#product .barbaraalvisi-pdp-gallery-col');
      const coverHtml = event && event.product_cover_thumbnails;
      if (galleryCol instanceof HTMLElement && typeof coverHtml === 'string' && coverHtml.trim()) {
        const currentContainer = galleryCol.querySelector('.js-images-container, .images-container');
        if (!(currentContainer instanceof HTMLElement)) {
          galleryCol.innerHTML = coverHtml;
        } else if (!currentContainer.querySelector('.barbaraalvisi-pdp-gallery, .js-barbaraalvisi-pdp-gallery')) {
          // AJAX ha restituito markup Classic: sostituisci con il fragment del tema
          currentContainer.outerHTML = coverHtml;
        }
      }

      document.querySelectorAll('.js-barbaraalvisi-pdp-gallery').forEach((gallery) => {
        delete gallery.dataset.barbaraalvisiGalleryReady;
      });
      document.querySelectorAll('.barbaraalvisi-pdp-gallery-image').forEach((img) => {
        delete img.dataset.barbaraalvisiHiRes;
      });
      cleanupClassicPdpImages();
      initBarbaraalvisiGalleries();
      syncBarbaraalvisiPdpVariantNote();
      syncBarbaraalvisiPdpAddToCartState();
    });
  }

  const PDP_ACCORDION_PANEL_SELECTOR = '#product .barbaraalvisi-pdp-accordion-panel';

  const initBarbaraalvisiPdpAccordionPanels = () => {
    document.querySelectorAll(PDP_ACCORDION_PANEL_SELECTOR).forEach((panel) => {
      const panelId = panel.getAttribute('id');
      const trigger = panelId
        ? document.querySelector(`[data-barbaraalvisi-accordion-trigger][aria-controls="${panelId}"]`)
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

  const initBarbaraalvisiAccordions = () => {
    if (document.documentElement.dataset.barbaraalvisiAccordionReady === '1') {
      return;
    }
    document.documentElement.dataset.barbaraalvisiAccordionReady = '1';

    const syncFooterAccordionsLayout = () => {
      const isDesktop = window.matchMedia('(min-width: 992px)').matches;
      document.querySelectorAll('.barbaraalvisi-footer-accordion-panel').forEach((panel) => {
        const panelId = panel.id;
        const trigger = panelId
          ? document.querySelector(`[data-barbaraalvisi-footer-accordion-trigger][aria-controls="${panelId}"]`)
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

    initBarbaraalvisiPdpAccordionPanels();

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const footerTrigger = target.closest('[data-barbaraalvisi-footer-accordion-trigger]');
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

      const pdpTrigger = target.closest('[data-barbaraalvisi-accordion-trigger]');
      if (!pdpTrigger) {
        return;
      }

      const pdpPanelId = pdpTrigger.getAttribute('aria-controls');
      const pdpPanel = pdpPanelId ? document.getElementById(pdpPanelId) : null;
      if (!pdpPanel || !pdpPanel.classList.contains('barbaraalvisi-pdp-accordion-panel')) {
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

  initBarbaraalvisiAccordions();

  if (filtersWrapper) {
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const openTrigger = target.closest('#search_filter_toggler, [data-barbaraalvisi-filters-open]');
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
        && !target.closest('[data-barbaraalvisi-filters-close]')
        && !target.closest('#search_filter_toggler, [data-barbaraalvisi-filters-open]')
      ) {
        closeFilters();
      }
    });

    if (filtersBackdrop) {
      filtersBackdrop.addEventListener('click', closeFilters);
    }

    document.querySelectorAll('[data-barbaraalvisi-filters-close]').forEach((closeBtn) => {
      closeBtn.addEventListener('click', closeFilters);
    });
  }

  if (sortWrapper) {
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const openTrigger = target.closest('#barbaraalvisi-sort-toggler, [data-barbaraalvisi-sort-open]');
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
        && !target.closest('[data-barbaraalvisi-sort-close]')
      ) {
        closeSort();
      }
    });

    if (sortBackdrop) {
      sortBackdrop.addEventListener('click', closeSort);
    }

    document.querySelectorAll('[data-barbaraalvisi-sort-close]').forEach((closeBtn) => {
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
  let cartModalBackdrop = document.querySelector('.barbaraalvisi-cart-modal-backdrop');

  const barbaraalvisiGetCartModal = () => document.getElementById('blockcart-modal');

  const barbaraalvisiIsCartModalOpen = () => {
    const modal = barbaraalvisiGetCartModal();
    if (!modal) {
      return false;
    }

    return (
      modal.classList.contains('show')
      || modal.classList.contains('in')
      || document.body.classList.contains('barbaraalvisi-cart-modal-open')
      || document.body.classList.contains('modal-open')
    );
  };

  const barbaraalvisiCloseCartModal = () => {
    const modal = barbaraalvisiGetCartModal();
    if (!modal) {
      return;
    }

    if (typeof window.jQuery !== 'undefined' && typeof window.jQuery(modal).modal === 'function') {
      window.jQuery(modal).modal('hide');
      return;
    }

    modal.classList.remove('show', 'in');
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open', 'barbaraalvisi-cart-modal-open');
    document.querySelectorAll('.modal-backdrop').forEach((node) => node.remove());
    syncCartModalBackdrop(false);
  };

  const barbaraalvisiInitCartModalCloseDelegation = () => {
    if (document.documentElement.dataset.barbaraalvisiCartModalCloseReady === '1') {
      return;
    }

    document.documentElement.dataset.barbaraalvisiCartModalCloseReady = '1';

    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) {
        return;
      }

      const closeBtn = target.closest(
        '#blockcart-modal [data-barbaraalvisi-cart-modal-close], #blockcart-modal [data-dismiss="modal"]'
      );
      if (!closeBtn) {
        return;
      }

      event.preventDefault();
      barbaraalvisiCloseCartModal();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !barbaraalvisiIsCartModalOpen()) {
        return;
      }

      barbaraalvisiCloseCartModal();
    });
  };

  const ensureCartModalBackdrop = () => {
    if (!cartModalBackdrop) {
      cartModalBackdrop = document.createElement('div');
      cartModalBackdrop.className = 'barbaraalvisi-cart-modal-backdrop';
      cartModalBackdrop.hidden = true;
      document.body.appendChild(cartModalBackdrop);
      cartModalBackdrop.addEventListener('click', barbaraalvisiCloseCartModal);
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

    document.body.classList.toggle('barbaraalvisi-cart-modal-open', open);
  };

  const barbaraalvisiReplaceBlockcartFromResponse = (resp) => {
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
          || document.body.classList.contains('barbaraalvisi-cart-modal-open');

        currentModal.replaceWith(newModal);
        barbaraalvisiAfterBlockcartModalMounted();

        if (wasOpen && typeof window.jQuery !== 'undefined') {
          window.jQuery(newModal).modal('show');
        }

        if (!newModal.querySelector('.barbaraalvisi-cart-modal-product') && typeof window.jQuery !== 'undefined') {
          window.jQuery(newModal).modal('hide');
        }
      }
    }
  };

  const barbaraalvisiSyncBlockcartPreview = () => {
    const refreshUrl = document.querySelector('.blockcart')?.dataset?.refreshUrl;
    if (!refreshUrl || typeof window.jQuery === 'undefined') {
      return Promise.resolve(null);
    }

    return window.jQuery.post(refreshUrl, {}, null, 'json').then((refreshResp) => {
      if (refreshResp?.preview) {
        barbaraalvisiReplaceBlockcartFromResponse({ preview: refreshResp.preview });
      }

      return refreshResp;
    });
  };

  const barbaraalvisiFormatMoneyLikeSample = (amount, sampleValue) => {
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

  const barbaraalvisiSyncFreeShippingHintInModal = (modal, cart) => {
    if (!modal || !cart) {
      return;
    }

    const summaryBlock = modal.querySelector('.barbaraalvisi-cart-summary-block');
    if (!summaryBlock) {
      return;
    }

    const threshold = parseFloat(summaryBlock.dataset.barbaraalvisiFreeShippingThreshold || '0');
    const productsAmount = parseFloat(cart.subtotals?.products?.amount ?? '0');
    const subtotalSample = cart.subtotals?.products?.value || '';
    const isItalian =
      document.documentElement.lang?.toLowerCase().startsWith('it')
      || document.body.classList.contains('lang-it');

    let hint = summaryBlock.querySelector('.barbaraalvisi-free-shipping-hint');

    if (threshold <= 0 || productsAmount >= threshold - 0.001) {
      hint?.remove();
      return;
    }

    const remaining = threshold - productsAmount;
    const remainingValue = barbaraalvisiFormatMoneyLikeSample(remaining, subtotalSample);

    if (!hint) {
      hint = document.createElement('div');
      hint.className = 'barbaraalvisi-free-shipping-hint';
      hint.setAttribute('aria-live', 'polite');
      hint.innerHTML = isItalian
        ? '<p class="barbaraalvisi-free-shipping-hint__text">SPEDIZIONE GRATUITA SE AGGIUNGI ALTRI <span class="barbaraalvisi-free-shipping-hint__amount"></span> DI SPESA AL CARRELLO.</p>'
        : '<p class="barbaraalvisi-free-shipping-hint__text">Free shipping if you add another <span class="barbaraalvisi-free-shipping-hint__amount"></span> of spending to your cart.</p>';
      summaryBlock.appendChild(hint);
    }

    const amountNode = hint.querySelector('.barbaraalvisi-free-shipping-hint__amount');
    if (amountNode) {
      amountNode.textContent = remainingValue;
    }
  };

  const barbaraalvisiApplyCartUpdateToModal = (resp) => {
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
      modal.querySelectorAll('.barbaraalvisi-cart-modal-product').forEach((line) => {
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
        const input = line.querySelector('.barbaraalvisi-cart-modal-qty-input');
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
        `.barbaraalvisi-cart-modal-product[data-id-product="${resp.id_product}"][data-id-product-attribute="${resp.id_product_attribute || 0}"]`
      );

      if (resp.quantity <= 0) {
        line?.remove();
      } else {
        const input = line?.querySelector('.barbaraalvisi-cart-modal-qty-input');
        if (input) {
          input.value = resp.quantity;
          input.defaultValue = String(resp.quantity);
        }
      }
    }

    if (cart) {
      const count = cart.products_count ?? products.length;
      const summary = modal.querySelector('.barbaraalvisi-cart-summary-count');

      if (summary) {
        summary.textContent = isItalian
          ? (count === 1 ? '1 ARTICOLO NEL CARRELLO' : `${count} ARTICOLI NEL CARRELLO`)
          : (count === 1 ? '1 ITEM IN YOUR CART' : `${count} ITEMS IN YOUR CART`);
      }

      const subtotal = modal.querySelector('.barbaraalvisi-cart-summary-subtotal-value');
      const subtotalValue = cart.subtotals?.products?.value;

      if (subtotal && subtotalValue) {
        subtotal.textContent = subtotalValue;
      }

      barbaraalvisiSyncFreeShippingHintInModal(modal, cart);
    }

    if (!modal.querySelector('.barbaraalvisi-cart-modal-product') && typeof window.jQuery !== 'undefined') {
      window.jQuery(modal).modal('hide');
    }
  };

  const barbaraalvisiHidePageLoaderIfVisible = () => {
    if (typeof window.barbaraalvisiHidePageLoader === 'function') {
      window.barbaraalvisiHidePageLoader();
      return;
    }

    const loader = document.getElementById('barbaraalvisi-page-loader');
    if (!loader || loader.classList.contains('is-hidden')) {
      return;
    }

    loader.classList.add('is-hidden');
    document.documentElement.classList.remove('barbaraalvisi-is-loading');
    document.body.classList.remove('barbaraalvisi-is-loading');
  };

  const barbaraalvisiRequestCartUpdate = (url, extraData = {}) => {
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
          barbaraalvisiReplaceBlockcartFromResponse(resp);
        } else {
          barbaraalvisiApplyCartUpdateToModal(resp);
        }

        return barbaraalvisiSyncBlockcartPreview().then(() => {
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
      .always(barbaraalvisiHidePageLoaderIfVisible);
  };

  const barbaraalvisiIsCartControlsTarget = (element) => {
    if (!(element instanceof Element)) {
      return false;
    }

    return Boolean(
      element.closest('#blockcart-modal')
      || element.closest('body#cart .barbaraalvisi-cart-page')
      || element.closest('body#cart .barbaraalvisi-cart-overview')
    );
  };

  const barbaraalvisiInitCartControlsDelegation = () => {
    if (document.documentElement.dataset.barbaraalvisiCartControlsReady === '1') {
      return;
    }

    document.documentElement.dataset.barbaraalvisiCartControlsReady = '1';

    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target || !barbaraalvisiIsCartControlsTarget(target)) {
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
          barbaraalvisiRequestCartUpdate(url, { linkAction: 'update' });
        }
        return;
      }

      const removeLink = target.closest('.remove-from-cart');
      if (removeLink) {
        event.preventDefault();
        event.stopPropagation();
        barbaraalvisiRequestCartUpdate(removeLink.href, { linkAction: 'delete-from-cart' });
      }
    });

    document.addEventListener('change', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target || !barbaraalvisiIsCartControlsTarget(target)) {
        return;
      }

      const qtyInput = target.closest('.barbaraalvisi-cart-qty-input, .barbaraalvisi-cart-modal-qty-input');
      if (!qtyInput || !qtyInput.dataset.updateUrl) {
        return;
      }

      const qty = parseInt(qtyInput.value, 10);
      if (Number.isNaN(qty) || qty < 1) {
        qtyInput.value = qtyInput.defaultValue;
        return;
      }

      barbaraalvisiRequestCartUpdate(qtyInput.dataset.updateUrl, {
        linkAction: 'update',
        qty,
      });
    });
  };

  const barbaraalvisiUnwrapCartTouchspin = () => {
    document.querySelectorAll('body#cart .bootstrap-touchspin').forEach((wrap) => {
      const input = wrap.querySelector('.js-cart-line-product-quantity');
      if (input && wrap.parentNode) {
        wrap.parentNode.replaceChild(input, wrap);
      }
    });
  };

  const barbaraalvisiBindCartModal = (modal) => {
    if (!modal || typeof window.jQuery === 'undefined') {
      return;
    }

    window.jQuery(modal)
      .off('show.bs.modal.barbaraalvisi shown.bs.modal.barbaraalvisi hide.bs.modal.barbaraalvisi hidden.bs.modal.barbaraalvisi')
      .on('show.bs.modal.barbaraalvisi shown.bs.modal.barbaraalvisi', () => syncCartModalBackdrop(true))
      .on('hide.bs.modal.barbaraalvisi hidden.bs.modal.barbaraalvisi', () => syncCartModalBackdrop(false));
  };

  const barbaraalvisiAfterBlockcartModalMounted = () => {
    const modal = document.getElementById('blockcart-modal');
    if (!modal) {
      return;
    }

    barbaraalvisiBindCartModal(modal);

    if (
      modal.classList.contains('show')
      || modal.classList.contains('in')
      || document.body.classList.contains('modal-open')
      || document.body.classList.contains('barbaraalvisi-cart-modal-open')
    ) {
      syncCartModalBackdrop(true);
    }
  };

  const barbaraalvisiHookBlockcartShowModal = () => {
    if (typeof prestashop === 'undefined' || !prestashop.blockcart || prestashop.blockcart.__barbaraalvisiModalHooked) {
      return;
    }

    const originalShowModal = prestashop.blockcart.showModal;
    if (typeof originalShowModal !== 'function') {
      return;
    }

    prestashop.blockcart.showModal = (modalHtml) => {
      originalShowModal(modalHtml);
      barbaraalvisiAfterBlockcartModalMounted();
    };

    prestashop.blockcart.__barbaraalvisiModalHooked = true;
  };

  barbaraalvisiInitCartControlsDelegation();
  barbaraalvisiInitCartModalCloseDelegation();
  barbaraalvisiHookBlockcartShowModal();
  barbaraalvisiAfterBlockcartModalMounted();

  if (document.body.id === 'cart') {
    barbaraalvisiUnwrapCartTouchspin();
  }

  if (typeof prestashop !== 'undefined' && prestashop.on) {
    prestashop.on('updateCart', (event) => {
      if (!event?.resp || document.body.id === 'cart') {
        return;
      }

      if (event.resp.modal) {
        barbaraalvisiReplaceBlockcartFromResponse(event.resp);
      } else if (event.resp.cart || typeof event.resp.quantity !== 'undefined') {
        barbaraalvisiApplyCartUpdateToModal(event.resp);
      }

      requestAnimationFrame(barbaraalvisiAfterBlockcartModalMounted);
    });
  }

  document.querySelectorAll(
    '.wishlist-add-to, .wishlist-delete, .wishlist-create, .wishlist-login, .wishlist-toast, [class*="wishlist-modal"]'
  ).forEach((node) => {
    node.remove();
  });

  const homeEditorial = document.querySelector('#index .barbaraalvisi-home-categories');
  const homeHero = document.querySelector(
    '#index #module-ps_imageslider, #index .barbaraalvisi-home-hero, #index .ps_imageslider'
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

    applyItalianLabels('.barbaraalvisi-footer-links a, body#checkout .barbaraalvisi-checkout-summary a, body#checkout .cart-summary a');
    applyItalianLabels('#search_filters .facet-title, #search_filters .barbaraalvisi-facet-title, #search_filters .barbaraalvisi-facet-list a');
    applyItalianLabels('.barbaraalvisi-plp-sort .select-list');
    applyItalianLabels('.barbaraalvisi-pagination .page-list a, .barbaraalvisi-plp-showing');
    document.querySelectorAll('.barbaraalvisi-plp-showing, .pagination .col-md-4').forEach((node) => {
      const text = node.textContent?.trim();
      if (text && /^Showing \d+/.test(text)) {
        const match = text.match(/Showing (\d+)-(\d+) of (\d+) item\(s\)/);
        if (match) {
          node.textContent = `${match[1]}–${match[2]} di ${match[3]} articoli`;
        }
      }
    });
    applyItalianLabels('.barbaraalvisi-footer-copyright');
    applyItalianLabels('.barbaraalvisi-account-back-link, .barbaraalvisi-account-back-links a, .barbaraalvisi-orders-page a, body#guest-login label');
    applyItalianLabels('body#cart .cart-summary-line .label, body#cart .cart-summary-line .value, body#cart .promo-code-button, body#cart .block-promo label, body#checkout .js-show-details, body#checkout .promo-code-button, body#checkout .cart-summary-line .label, body#checkout .cart-summary-line .value, body#order-confirmation .cart-summary-line .label, body#order-confirmation .order-confirmation-table .label');
    applyItalianLabels('body#cart .cart-detailed-actions a, body#cart .checkout a, .barbaraalvisi-cart-modal-actions a, .barbaraalvisi-cart-modal-actions button');
    applyItalianLabels('.barbaraalvisi-breadcrumb a span, .barbaraalvisi-breadcrumb span, .barbaraalvisi-menu-link, .barbaraalvisi-drawer-footer .barbaraalvisi-drawer-link');
    applyItalianLabels('.barbaraalvisi-sitemap-group-title, .barbaraalvisi-sitemap-col a, body#contact label, body#contact .form-control-label, body#cms label');

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
      btn.classList.add('barbaraalvisi-btn', 'barbaraalvisi-btn--primary');
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
    document.querySelectorAll('.barbaraalvisi-variant-size-label, .barbaraalvisi-variant-radio-label, .attribute-name').forEach((node) => {
      const text = node.textContent?.trim();
      if (text && attrValueIt.has(text)) {
        node.textContent = attrValueIt.get(text);
      }
    });
    document.querySelectorAll('.barbaraalvisi-variant-label').forEach((node) => {
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
      placeOrderBtn.classList.add('barbaraalvisi-btn', 'barbaraalvisi-btn--primary');
    }

    document.querySelectorAll('body#checkout button.continue, body#checkout button[name="confirm-addresses"]').forEach((btn) => {
      btn.classList.add('barbaraalvisi-btn', 'barbaraalvisi-btn--primary');
    });

    setupBarbaraalvisiCheckoutConsent();
    setupBarbaraalvisiCheckoutTabs();
    setupBarbaraalvisiCheckoutPayment();
  }

  /** Griglia prodotti come homepage — anche liste legacy (.products.row) e AJAX listing */
  const barbaraalvisiProductGridSelectors = [
    '#products .products',
    '#product .barbaraalvisi-pdp-product-grids .products',
    '#product .barbaraalvisi-pdp-footer-grids .products',
    '#product .featured-products .products',
    '#index .featured-products .products',
    '#wrapper .featured-products .products',
    '.barbaraalvisi-product-grid-hook .products',
    '.barbaraalvisi-cart-cross-selling .products',
    '.barbaraalvisi-order-confirmation-extra .products',
    '.barbaraalvisi-not-found-products .products',
    '.barbaraalvisi-category-empty-products .products',
    '.barbaraalvisi-search-empty-products .products',
    '.barbaraalvisi-cart-modal-cross-selling .products',
    '.cross-selling .products',
    '.barbaraalvisi-product-grid-section .products',
    '.product-accessories .products',
  ];

  const isBarbaraalvisiProductGridExcluded = (grid) => Boolean(
    grid.closest(
      '.cart-overview, .cart-item, .product-line-grid, .cart-summary, .order-confirmation-table, #cart-summary-product-list, .barbaraalvisi-cart-container'
    )
  );

  const upgradeBarbaraalvisiProductGrids = () => {
    const grids = new Set();

    barbaraalvisiProductGridSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((grid) => grids.add(grid));
    });

    document.querySelectorAll('#wrapper .products.row, #wrapper .products:not(.barbaraalvisi-plp-grid)').forEach((grid) => {
      if (!isBarbaraalvisiProductGridExcluded(grid)) {
        grids.add(grid);
      }
    });

    grids.forEach((grid) => {
      grid.classList.add('barbaraalvisi-plp-grid');
      grid.classList.remove('row');
      grid.querySelectorAll(':scope > .js-product, :scope > .product').forEach((cell) => {
        cell.classList.add('barbaraalvisi-plp-cell', 'barbaraalvisi-product-miniature');
      });
    });
  };

  upgradeBarbaraalvisiProductGrids();

  if (typeof prestashop !== 'undefined' && prestashop.on) {
    prestashop.on('updateProductList', upgradeBarbaraalvisiProductGrids);
    prestashop.on('updatedProductList', upgradeBarbaraalvisiProductGrids);
  }

  const gridObserverRoots = [
    document.getElementById('products'),
    document.getElementById('js-product-list'),
    document.getElementById('wrapper'),
    document.querySelector('#product .barbaraalvisi-pdp-product-grids'),
    document.querySelector('.barbaraalvisi-product-grid-hook'),
  ].filter(Boolean);

  if (gridObserverRoots.length && typeof MutationObserver !== 'undefined') {
    let gridUpgradeFrame = 0;
    const scheduleBarbaraalvisiProductGridUpgrade = () => {
      if (gridUpgradeFrame) {
        cancelAnimationFrame(gridUpgradeFrame);
      }
      gridUpgradeFrame = requestAnimationFrame(() => {
        gridUpgradeFrame = 0;
        upgradeBarbaraalvisiProductGrids();
      });
    };

    const gridObserver = new MutationObserver(scheduleBarbaraalvisiProductGridUpgrade);
    gridObserverRoots.forEach((root) => {
      gridObserver.observe(root, { childList: true, subtree: true });
    });
  }

  /** Footer newsletter — ps_emailsubscription.js prepend l'alert nel form (layout rotto) */
  const initBarbaraalvisiFooterNewsletter = () => {
    const block = document.querySelector('.barbaraalvisi-footer #blockEmailSubscription.barbaraalvisi-footer-newsletter');
    if (!block) {
      return;
    }

    const form = block.querySelector('form');
    if (!form || form.dataset.barbaraalvisiNewsletterBound === '1') {
      return;
    }

    form.dataset.barbaraalvisiNewsletterBound = '1';

    const heading = block.querySelector('.barbaraalvisi-footer-heading');

    const getSubscriptionUrl = () => (
      typeof window.psemailsubscription_subscription === 'string'
        ? window.psemailsubscription_subscription
        : null
    );

    const clearNewsletterFeedback = () => {
      block.querySelectorAll('.barbaraalvisi-footer-newsletter-feedback').forEach((node) => node.remove());
      form.querySelectorAll('.alert, .block_newsletter_alert').forEach((node) => node.remove());
    };

    const showNewsletterFeedback = (message, isError) => {
      clearNewsletterFeedback();

      const feedback = document.createElement('div');
      feedback.className = `barbaraalvisi-footer-newsletter-feedback barbaraalvisi-footer-newsletter-feedback--${isError ? 'error' : 'ok'}`;
      feedback.setAttribute('role', isError ? 'alert' : 'status');

      const paragraph = document.createElement('p');
      paragraph.className = `barbaraalvisi-footer-newsletter-msg barbaraalvisi-footer-newsletter-msg--${isError ? 'error' : 'ok'}`;
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

  initBarbaraalvisiFooterNewsletter();

  const initBarbaraalvisiContactFileUpload = () => {
    if (document.body.id !== 'contact') {
      return;
    }

    document.querySelectorAll('.barbaraalvisi-file-upload').forEach((wrapper) => {
      const input = wrapper.querySelector('.barbaraalvisi-file-upload__input');
      const trigger = wrapper.querySelector('[data-barbaraalvisi-file-trigger]');
      const nameEl = wrapper.querySelector('[data-barbaraalvisi-file-name]');
      if (!(input instanceof HTMLInputElement) || !(nameEl instanceof HTMLElement)) {
        return;
      }

      if (trigger instanceof HTMLButtonElement) {
        trigger.addEventListener('click', () => input.click());
      }

      const emptyLabel = nameEl.textContent.trim();

      input.addEventListener('change', () => {
        const file = input.files && input.files[0];
        nameEl.textContent = file ? file.name : emptyLabel;
      });
    });
  };

  initBarbaraalvisiContactFileUpload();

  const initBarbaraalvisiPageLoader = () => {
    const loader = document.getElementById('barbaraalvisi-page-loader');
    if (!loader) {
      return;
    }

    let loaderSafetyTimer = null;

    const setLoadingState = (isLoading) => {
      document.documentElement.classList.toggle('barbaraalvisi-is-loading', isLoading);
      document.body.classList.toggle('barbaraalvisi-is-loading', isLoading);
    };

    const hideLoader = () => {
      window.clearTimeout(loaderSafetyTimer);
      loaderSafetyTimer = null;

      if (loader.classList.contains('is-hidden')
        && !document.documentElement.classList.contains('barbaraalvisi-is-loading')
        && !document.body.classList.contains('barbaraalvisi-is-loading')) {
        return;
      }

      loader.classList.add('is-hidden');
      setLoadingState(false);
    };

    const showLoader = () => {
      if (document.body?.id === 'checkout') {
        return;
      }

      loader.classList.remove('is-hidden');
      setLoadingState(true);
      window.clearTimeout(loaderSafetyTimer);
      // Failsafe: se la navigazione AJAX non completa, non bloccare il sito
      loaderSafetyTimer = window.setTimeout(hideLoader, 8000);
    };

    window.barbaraalvisiHidePageLoader = hideLoader;

    const isInternalNavigationLink = (link) => {
      if (!(link instanceof HTMLAnchorElement)) {
        return false;
      }

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:') || link.target === '_blank' || link.hasAttribute('download')) {
        return false;
      }

      if (
        link.hasAttribute('data-toggle')
        || link.hasAttribute('data-dismiss')
        || link.hasAttribute('data-barbaraalvisi-contact-open')
        || link.hasAttribute('data-barbaraalvisi-drawer-open')
        || link.closest('[data-toggle="modal"], .barbaraalvisi-drawer, #barbaraalvisi-everpopup-overlay, .js-qv-mask')
      ) {
        return false;
      }

      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) {
          return false;
        }

        // Stesso URL (solo hash/query uguale): niente full navigation
        if (url.pathname === window.location.pathname
          && url.search === window.location.search
          && url.hash) {
          return false;
        }

        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    };

    const isBarbaraalvisiAjaxCartLink = (link) => {
      if (!(link instanceof HTMLAnchorElement)) {
        return false;
      }

      if (link.classList.contains('remove-from-cart')) {
        return true;
      }

      const linkAction = link.dataset.linkAction;
      return linkAction === 'delete-from-cart' || linkAction === 'update';
    };

    const isAjaxProductRefreshForm = (form) => {
      if (!(form instanceof HTMLFormElement)) {
        return false;
      }

      if (form.id === 'add-to-cart-or-refresh') {
        return true;
      }

      if (form.querySelector('.product-refresh, .js-product-refresh, input.product-refresh, input[name="refresh"]')) {
        return true;
      }

      if (form.closest('#search_widget, .js-search-filters-form, #search_filters, .barbaraalvisi-filters-drawer')) {
        return true;
      }

      return false;
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

    // Bubble (non capture): rispetta preventDefault di drawer/menu/AJAX e non lascia il loader appeso
    document.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      if (event.target.closest('#payment-confirmation button, #payment-confirmation [type="submit"]')) {
        return;
      }

      const link = event.target.closest('a[href]');
      if (!isInternalNavigationLink(link) || isBarbaraalvisiAjaxCartLink(link)) {
        return;
      }

      showLoader();
    });

    document.addEventListener('submit', (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || form.target) {
        return;
      }

      if (form.closest('#barbaraalvisi-everpopup-overlay')) {
        return;
      }

      if (document.body.id === 'checkout') {
        return;
      }

      // Varianti PDP / refresh prodotto: AJAX, non full-page — non mostrare overlay
      if (isAjaxProductRefreshForm(form)) {
        return;
      }

      showLoader();
    }, true);

    if (typeof prestashop !== 'undefined' && prestashop.on) {
      prestashop.on('orderConfirmationErrors', hideLoader);
      prestashop.on('handleError', hideLoader);
      prestashop.on('changedCheckoutStep', hideLoader);
      prestashop.on('updatedProduct', hideLoader);
      prestashop.on('updateProduct', hideLoader);
      prestashop.on('updatedProductList', hideLoader);
      prestashop.on('updateCart', hideLoader);
      prestashop.on('updatedCart', hideLoader);
    }

    window.addEventListener('pageshow', () => {
      hideLoader();
    });

    window.addEventListener('pagehide', () => {
      hideLoader();
    });
  };

  initBarbaraalvisiPageLoader();
};

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClassicBarbaraalvisiTheme);
  } else {
    initClassicBarbaraalvisiTheme();
  }
})();
