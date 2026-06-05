{**
 * Classic Gucci — header stile gucci.com
 * Sinistra: logo | Destra: carrello, account, cerca, menu (drawer)
 * Contatti nel footer del menu drawer
 *}
{block name='header_banner'}{/block}

{block name='header_nav'}{/block}

{block name='header_top'}
  <div class="gucci-header-bar header-top">
    <div class="container">
      <div class="gucci-header-inner">
        <div class="gucci-header-col gucci-header-col--logo">
          <div id="_desktop_logo">
            {if $page.page_name == 'index'}
              <h1 class="logo gucci-logo-wrap">
                <a href="{$urls.pages.index}" class="gucci-logo-link" aria-label="{$shop.name|escape:'html':'UTF-8'}">
                  <img
                    src="{$urls.base_url}themes/classic-gucci/assets/img/brand/logo-black.png"
                    alt="{$shop.name|escape:'html':'UTF-8'}"
                    class="gucci-logo gucci-logo--dark"
                    width="260"
                    height="26"
                    loading="eager"
                  >
                  <img
                    src="{$urls.base_url}themes/classic-gucci/assets/img/brand/logo-white.png"
                    alt=""
                    class="gucci-logo gucci-logo--light"
                    width="260"
                    height="26"
                    loading="eager"
                    aria-hidden="true"
                  >
                </a>
              </h1>
            {else}
              <div class="logo gucci-logo-wrap">
                <a href="{$urls.pages.index}" class="gucci-logo-link" aria-label="{$shop.name|escape:'html':'UTF-8'}">
                  <img
                    src="{$urls.base_url}themes/classic-gucci/assets/img/brand/logo-black.png"
                    alt="{$shop.name|escape:'html':'UTF-8'}"
                    class="gucci-logo gucci-logo--dark"
                    width="260"
                    height="26"
                    loading="eager"
                  >
                  <img
                    src="{$urls.base_url}themes/classic-gucci/assets/img/brand/logo-white.png"
                    alt=""
                    class="gucci-logo gucci-logo--light"
                    width="260"
                    height="26"
                    loading="eager"
                    aria-hidden="true"
                  >
                </a>
              </div>
            {/if}
          </div>
          <div id="_mobile_logo" class="hidden-md-up"></div>
        </div>

        <div class="gucci-header-col gucci-header-col--icons">
          <div class="gucci-header-mobile-utilities hidden-md-up">
            <div id="_mobile_cart"></div>
            <div id="_mobile_user_info"></div>
          </div>

          {hook h='displayNav2'}

          <button
            type="button"
            id="gucci-search-toggle"
            class="gucci-search-toggle btn-unstyle"
            aria-label="{if $language.iso_code == 'it'}Cerca{else}{l s='Search' d='Shop.Theme.Catalog'}{/if}"
            aria-expanded="false"
            aria-controls="gucci-search-panel"
          >
            <i class="material-icons" aria-hidden="true">search</i>
          </button>

          <button
            type="button"
            id="menu-icon"
            class="gucci-menu-toggle btn-unstyle"
            aria-label="{if $language.iso_code == 'it'}Menu{else}{l s='Menu' d='Shop.Theme.Global'}{/if}"
            aria-expanded="false"
            aria-controls="mobile_top_menu_wrapper"
          >
            <i class="material-icons" aria-hidden="true">&#xE5D2;</i>
          </button>
        </div>
      </div>

    </div>

    <div id="gucci-search-panel" class="gucci-search-panel" aria-hidden="true" hidden>
      <div class="gucci-search-panel-top">
        <button
          type="button"
          class="gucci-search-panel-close btn-unstyle"
          aria-label="{if $language.iso_code == 'it'}Chiudi{else}{l s='Close' d='Shop.Theme.Global'}{/if}"
          data-gucci-search-close
        >
          {if $language.iso_code == 'it'}Chiudi{else}{l s='Close' d='Shop.Theme.Global'}{/if}
        </button>
      </div>

      <div class="gucci-search-panel-body">
        <div class="gucci-search-panel-inner">
          <p class="gucci-search-label">{if $language.iso_code == 'it'}Cerca{else}{l s='Search' d='Shop.Theme.Catalog'}{/if}</p>
          <div
            id="search_widget"
            class="gucci-search search-widget"
            data-search-controller-url="{$link->getPageLink('search', true)|escape:'html':'UTF-8'}"
          >
            <form method="get" action="{$link->getPageLink('search', true)|escape:'html':'UTF-8'}" class="gucci-search-form">
              <input type="hidden" name="controller" value="search">
              <input
                type="text"
                name="s"
                value=""
                placeholder="{if $language.iso_code == 'it'}Cerca nel catalogo{else}{l s='Search our catalog' d='Shop.Theme.Catalog'}{/if}"
                aria-label="{if $language.iso_code == 'it'}Cerca{else}{l s='Search' d='Shop.Theme.Catalog'}{/if}"
                class="gucci-search-input"
                autocomplete="off"
              >
              <button type="submit" class="gucci-search-submit visually-hidden" tabindex="-1" aria-hidden="true">
                {l s='Search' d='Shop.Theme.Catalog'}
              </button>
            </form>
          </div>
        </div>

        <div class="gucci-search-results-wrap">
          <div id="gucci-search-results" class="gucci-search-results" aria-live="polite"></div>
        </div>
      </div>
    </div>

    <div id="gucci-nav-backdrop" class="gucci-nav-backdrop" aria-hidden="true" hidden></div>

    <div id="mobile_top_menu_wrapper" class="gucci-nav-drawer gucci-side-drawer" hidden aria-hidden="true">
      <div class="gucci-nav-drawer-header">
        <button
          type="button"
          class="gucci-drawer-close-circle btn-unstyle"
          aria-label="{if $language.iso_code == 'it'}Chiudi{else}{l s='Close' d='Shop.Theme.Global'}{/if}"
          data-gucci-drawer-close
        >
          <i class="material-icons" aria-hidden="true">close</i>
        </button>
      </div>

      <div class="gucci-drawer-body gucci-nav-drawer-body">
        <nav class="gucci-nav-drawer-nav" aria-label="{if $language.iso_code == 'it'}Menu{else}{l s='Menu' d='Shop.Theme.Global'}{/if}">
          <div class="js-top-menu mobile" id="_mobile_top_menu">
            {hook h='displayTop'}
          </div>
        </nav>

        <div class="js-top-menu-bottom gucci-drawer-footer gucci-nav-drawer-footer">
          <button
            type="button"
            class="gucci-drawer-link gucci-contact-toggle btn-unstyle"
            data-gucci-contact-open
          >
            {if $language.iso_code == 'it'}Contattaci{else}{l s='Contact us' d='Shop.Theme.Global'}{/if}
          </button>
          {if !$customer.is_logged}
            <a
              href="{$urls.pages.authentication}?back={$urls.current_url|urlencode}"
              class="gucci-drawer-link gucci-drawer-link--underline"
              rel="nofollow"
            >
              {if $language.iso_code == 'it'}Effettua il login{else}{l s='Sign in' d='Shop.Theme.Actions'}{/if}
            </a>
          {else}
            <a href="{$urls.pages.my_account}" class="gucci-drawer-link" rel="nofollow">
              {if $language.iso_code == 'it'}Il mio account{else}{l s='My account' d='Shop.Theme.Customeraccount'}{/if}
            </a>
            <a href="{$urls.pages.history}" class="gucci-drawer-link" rel="nofollow">
              {if $language.iso_code == 'it'}I miei ordini{else}{l s='Order history and details' d='Shop.Theme.Customeraccount'}{/if}
            </a>
          {/if}
          <div id="_mobile_currency_selector" class="gucci-nav-drawer-utilities"></div>
          <div id="_mobile_language_selector" class="gucci-nav-drawer-utilities"></div>
          <div id="_mobile_contact_link" class="gucci-nav-drawer-utilities"></div>
        </div>
      </div>
    </div>

    <div id="gucci-contact-backdrop" class="gucci-contact-backdrop" aria-hidden="true" hidden></div>

    <div id="gucci-contact-drawer" class="gucci-contact-drawer gucci-side-drawer" aria-hidden="true" hidden>
      <div class="gucci-contact-drawer-header">
        <h2 class="gucci-contact-drawer-title">
          {if $language.iso_code == 'it'}Contatti{else}{l s='Contact us' d='Shop.Theme.Global'}{/if}
        </h2>
        <button
          type="button"
          class="gucci-contact-close-circle btn-unstyle"
          aria-label="{if $language.iso_code == 'it'}Chiudi{else}{l s='Close' d='Shop.Theme.Global'}{/if}"
          data-gucci-contact-close
        >
          <i class="material-icons" aria-hidden="true">close</i>
        </button>
      </div>

      <div class="gucci-drawer-body gucci-contact-drawer-body">
        {widget name='ps_contactinfo' template='module:ps_contactinfo/views/templates/hook/gucci-contact-panel.tpl'}
      </div>
    </div>

    <div id="gucci-account-backdrop" class="gucci-account-backdrop" aria-hidden="true" hidden></div>

    <div id="gucci-account-drawer" class="gucci-account-drawer gucci-side-drawer" aria-hidden="true" hidden>
      <div class="gucci-drawer-header">
        <h2 class="gucci-drawer-title">
          {if $language.iso_code == 'it'}Account{else}{l s='My account' d='Shop.Theme.Customeraccount'}{/if}
        </h2>
        <button
          type="button"
          class="gucci-drawer-close btn-unstyle"
          aria-label="{if $language.iso_code == 'it'}Chiudi{else}{l s='Close' d='Shop.Theme.Global'}{/if}"
          data-gucci-account-close
        >
          <i class="material-icons" aria-hidden="true">close</i>
        </button>
      </div>

      <div class="gucci-drawer-body gucci-account-drawer-body">
        {if !$customer.is_logged}
          <a
            href="{$urls.pages.authentication}?back={$urls.current_url|urlencode}"
            class="gucci-drawer-link"
            rel="nofollow"
          >
            {if $language.iso_code == 'it'}Accedi{else}{l s='Sign in' d='Shop.Theme.Actions'}{/if}
          </a>
          <a href="{$urls.pages.register}" class="gucci-drawer-link" rel="nofollow">
            {if $language.iso_code == 'it'}Registrati{else}{l s='Create account' d='Shop.Theme.Customeraccount'}{/if}
          </a>
        {else}
          <a href="{$urls.pages.my_account}" class="gucci-drawer-link" rel="nofollow">
            {if $language.iso_code == 'it'}Il mio account{else}{l s='My account' d='Shop.Theme.Customeraccount'}{/if}
          </a>
          <a href="{$urls.pages.history}" class="gucci-drawer-link" rel="nofollow">
            {if $language.iso_code == 'it'}Ordini{else}{l s='Order history and details' d='Shop.Theme.Customeraccount'}{/if}
          </a>
          <a href="{$urls.pages.identity}" class="gucci-drawer-link" rel="nofollow">
            {if $language.iso_code == 'it'}Informazioni personali{else}{l s='Information' d='Shop.Theme.Customeraccount'}{/if}
          </a>
          <a href="{$urls.pages.addresses}" class="gucci-drawer-link" rel="nofollow">
            {if $language.iso_code == 'it'}Indirizzi{else}{l s='Addresses' d='Shop.Theme.Customeraccount'}{/if}
          </a>
          <a href="{$urls.pages.my_account}?mylogout=" class="gucci-drawer-link" rel="nofollow">
            {if $language.iso_code == 'it'}Esci{else}{l s='Sign out' d='Shop.Theme.Actions'}{/if}
          </a>
        {/if}
      </div>
    </div>
  </div>
{/block}
