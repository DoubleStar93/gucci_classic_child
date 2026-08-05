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
