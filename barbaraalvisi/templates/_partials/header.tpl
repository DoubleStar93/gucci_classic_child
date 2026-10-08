{**
 * Barbara Alvisi — header stile luxury reference
 * Sinistra: logo | Destra: carrello, account, cerca, menu (drawer)
 * Contatti nel footer del menu drawer
 *}
{block name='header_banner'}{/block}

{block name='header_nav'}{/block}

{block name='header_top'}
  <div class="barbaraalvisi-header-bar header-top">
    <div class="container">
      <div class="barbaraalvisi-header-inner">
        <div class="barbaraalvisi-header-col barbaraalvisi-header-col--logo">
          <div id="_desktop_logo">
            {if $page.page_name == 'index'}
              <h1 class="logo barbaraalvisi-logo-wrap">
                <a href="{$urls.pages.index}" class="barbaraalvisi-logo-link" aria-label="{$shop.name|escape:'html':'UTF-8'}">
                  <img
                    src="{$urls.base_url}themes/barbaraalvisi/assets/img/brand/logo-black.png"
                    alt="{$shop.name|escape:'html':'UTF-8'}"
                    class="barbaraalvisi-logo barbaraalvisi-logo--dark"
                    width="260"
                    height="26"
                    loading="eager"
                  >
                  <img
                    src="{$urls.base_url}themes/barbaraalvisi/assets/img/brand/logo-white.png"
                    alt=""
                    class="barbaraalvisi-logo barbaraalvisi-logo--light"
                    width="260"
                    height="26"
                    loading="eager"
                    aria-hidden="true"
                  >
                </a>
              </h1>
            {else}
              <div class="logo barbaraalvisi-logo-wrap">
                <a href="{$urls.pages.index}" class="barbaraalvisi-logo-link" aria-label="{$shop.name|escape:'html':'UTF-8'}">
                  <img
                    src="{$urls.base_url}themes/barbaraalvisi/assets/img/brand/logo-black.png"
                    alt="{$shop.name|escape:'html':'UTF-8'}"
                    class="barbaraalvisi-logo barbaraalvisi-logo--dark"
                    width="260"
                    height="26"
                    loading="eager"
                  >
                  <img
                    src="{$urls.base_url}themes/barbaraalvisi/assets/img/brand/logo-white.png"
                    alt=""
                    class="barbaraalvisi-logo barbaraalvisi-logo--light"
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

        <div class="barbaraalvisi-header-col barbaraalvisi-header-col--icons">
          <div class="barbaraalvisi-header-mobile-utilities hidden-md-up">
            <div id="_mobile_cart"></div>
            <div id="_mobile_user_info"></div>
          </div>

          {hook h='displayNav2'}

          <button
            type="button"
            id="barbaraalvisi-search-toggle"
            class="barbaraalvisi-search-toggle btn-unstyle"
            aria-label="{if $language.iso_code == 'it'}Cerca{else}{l s='Search' d='Shop.Theme.Catalog'}{/if}"
            aria-expanded="false"
            aria-controls="barbaraalvisi-search-panel"
          >
            <i class="material-icons" aria-hidden="true">search</i>
          </button>

          <button
            type="button"
            id="menu-icon"
            class="barbaraalvisi-menu-toggle btn-unstyle"
            aria-label="{if $language.iso_code == 'it'}Menu{else}{l s='Menu' d='Shop.Theme.Global'}{/if}"
            aria-expanded="false"
            aria-controls="mobile_top_menu_wrapper"
          >
            <i class="material-icons" aria-hidden="true">&#xE5D2;</i>
          </button>
        </div>
      </div>

    </div>

    <div id="barbaraalvisi-search-panel" class="barbaraalvisi-search-panel" aria-hidden="true" hidden>
      <div class="barbaraalvisi-search-panel-top">
        {include
          file='_partials/barbaraalvisi-panel-close.tpl'
          extraClass='barbaraalvisi-search-panel-close'
          closeAttr='data-barbaraalvisi-search-close'
        }
      </div>

      <div class="barbaraalvisi-search-panel-body">
        <div class="barbaraalvisi-search-panel-inner">
          <p class="barbaraalvisi-search-label">{if $language.iso_code == 'it'}Cerca{else}{l s='Search' d='Shop.Theme.Catalog'}{/if}</p>
          <div
            id="search_widget"
            class="barbaraalvisi-search search-widget"
            data-search-controller-url="{$link->getPageLink('search', true)|escape:'html':'UTF-8'}"
          >
            <form method="get" action="{$link->getPageLink('search', true)|escape:'html':'UTF-8'}" class="barbaraalvisi-search-form">
              <input type="hidden" name="controller" value="search">
              <input
                type="text"
                name="s"
                value=""
                placeholder="{if $language.iso_code == 'it'}Cerca nel catalogo{else}{l s='Search our catalog' d='Shop.Theme.Catalog'}{/if}"
                aria-label="{if $language.iso_code == 'it'}Cerca{else}{l s='Search' d='Shop.Theme.Catalog'}{/if}"
                class="barbaraalvisi-search-input"
                autocomplete="off"
              >
              <button type="submit" class="barbaraalvisi-search-submit visually-hidden" tabindex="-1" aria-hidden="true">
                {l s='Search' d='Shop.Theme.Catalog'}
              </button>
            </form>
          </div>
        </div>

        <div class="barbaraalvisi-search-results-wrap">
          <div id="barbaraalvisi-search-results" class="barbaraalvisi-search-results" aria-live="polite"></div>
        </div>
      </div>
    </div>

    <div id="barbaraalvisi-nav-backdrop" class="barbaraalvisi-nav-backdrop" aria-hidden="true" hidden></div>

    <div id="mobile_top_menu_wrapper" class="barbaraalvisi-nav-drawer barbaraalvisi-side-drawer" hidden aria-hidden="true">
      <div class="barbaraalvisi-nav-drawer-header">
        {include file='_partials/barbaraalvisi-panel-close.tpl' closeAttr='data-barbaraalvisi-drawer-close'}
      </div>

      <div class="barbaraalvisi-drawer-body barbaraalvisi-nav-drawer-body">
        <nav class="barbaraalvisi-nav-drawer-nav" aria-label="{if $language.iso_code == 'it'}Menu{else}{l s='Menu' d='Shop.Theme.Global'}{/if}">
          <div class="js-top-menu mobile" id="_mobile_top_menu">
            {hook h='displayTop'}
          </div>
        </nav>

        <div class="js-top-menu-bottom barbaraalvisi-drawer-footer barbaraalvisi-nav-drawer-footer">
          <a
            href="{$urls.pages.contact}"
            class="barbaraalvisi-drawer-link"
          >
            {if $language.iso_code == 'it'}Contattaci{else}{l s='Contact us' d='Shop.Theme.Global'}{/if}
          </a>
          <a
            class="barbaraalvisi-drawer-link barbaraalvisi-drawer-instagram"
            href="https://www.instagram.com/barbaraalvisiofficial"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg class="barbaraalvisi-drawer-instagram__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
            <span>{if $language.iso_code == 'it'}Seguici su Instagram{else}Follow us on Instagram{/if}</span>
          </a>
          <a
            class="barbaraalvisi-drawer-link barbaraalvisi-drawer-whatsapp"
            href="https://wa.me/393522766033"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg class="barbaraalvisi-drawer-whatsapp__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>{if $language.iso_code == 'it'}Scrivici su WhatsApp{else}Write to us on WhatsApp{/if}</span>
          </a>
          <div id="_mobile_currency_selector" class="barbaraalvisi-nav-drawer-utilities"></div>
          <div id="_mobile_language_selector" class="barbaraalvisi-nav-drawer-utilities"></div>
          <div id="_mobile_contact_link" class="barbaraalvisi-nav-drawer-utilities"></div>
        </div>
      </div>
    </div>

    <div id="barbaraalvisi-contact-backdrop" class="barbaraalvisi-contact-backdrop" aria-hidden="true" hidden></div>

    <div id="barbaraalvisi-contact-drawer" class="barbaraalvisi-contact-drawer barbaraalvisi-side-drawer" aria-hidden="true" hidden>
      <div class="barbaraalvisi-contact-drawer-header">
        <h2 class="barbaraalvisi-contact-drawer-title">
          {if $language.iso_code == 'it'}Contatti{else}{l s='Contact us' d='Shop.Theme.Global'}{/if}
        </h2>
        {include file='_partials/barbaraalvisi-panel-close.tpl' closeAttr='data-barbaraalvisi-contact-close'}
      </div>

      <div class="barbaraalvisi-drawer-body barbaraalvisi-contact-drawer-body">
        {widget name='ps_contactinfo'}
      </div>
    </div>

    <div id="barbaraalvisi-account-backdrop" class="barbaraalvisi-account-backdrop" aria-hidden="true" hidden></div>

    <div id="barbaraalvisi-account-drawer" class="barbaraalvisi-account-drawer barbaraalvisi-side-drawer" aria-hidden="true" hidden>
      <div class="barbaraalvisi-drawer-header">
        <h2 class="barbaraalvisi-drawer-title">
          {if $language.iso_code == 'it'}Account{else}{l s='My account' d='Shop.Theme.Customeraccount'}{/if}
        </h2>
        {include file='_partials/barbaraalvisi-panel-close.tpl' closeAttr='data-barbaraalvisi-account-close'}
      </div>

      <div class="barbaraalvisi-drawer-body barbaraalvisi-account-drawer-body">
        {if !$customer.is_logged}
          <a
            href="{$urls.pages.authentication}?back={$urls.current_url|urlencode}"
            class="barbaraalvisi-drawer-link"
            rel="nofollow"
          >
            {if $language.iso_code == 'it'}Accedi{else}{l s='Sign in' d='Shop.Theme.Actions'}{/if}
          </a>
          <a href="{$urls.pages.register}" class="barbaraalvisi-drawer-link" rel="nofollow">
            {if $language.iso_code == 'it'}Registrati{else}{l s='Create account' d='Shop.Theme.Customeraccount'}{/if}
          </a>
        {else}
          <a href="{$urls.pages.my_account}" class="barbaraalvisi-drawer-link" rel="nofollow">
            {if $language.iso_code == 'it'}Il mio account{else}{l s='My account' d='Shop.Theme.Customeraccount'}{/if}
          </a>
          <a href="{$urls.pages.history}" class="barbaraalvisi-drawer-link" rel="nofollow">
            {if $language.iso_code == 'it'}Ordini{else}{l s='Order history and details' d='Shop.Theme.Customeraccount'}{/if}
          </a>
          <a href="{$urls.pages.identity}" class="barbaraalvisi-drawer-link" rel="nofollow">
            {if $language.iso_code == 'it'}Informazioni personali{else}{l s='Information' d='Shop.Theme.Customeraccount'}{/if}
          </a>
          <a href="{$urls.pages.addresses}" class="barbaraalvisi-drawer-link" rel="nofollow">
            {if $language.iso_code == 'it'}Indirizzi{else}{l s='Addresses' d='Shop.Theme.Customeraccount'}{/if}
          </a>
          <a href="{$urls.pages.my_account}?mylogout=" class="barbaraalvisi-drawer-link" rel="nofollow">
            {if $language.iso_code == 'it'}Esci{else}{l s='Sign out' d='Shop.Theme.Actions'}{/if}
          </a>
        {/if}
      </div>
    </div>
  </div>
{/block}
