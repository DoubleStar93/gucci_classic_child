{**
 * Classic Gucci — header stile gucci.com
 * Sinistra: Contattaci | Centro: logo | Destra: carrello, account, cerca, menu
 * Navigazione nel drawer (hook displayTop)
 *}
{block name='header_banner'}{/block}

{block name='header_nav'}{/block}

{block name='header_top'}
  <div class="gucci-header-bar header-top">
    <div class="container">
      <div class="gucci-header-inner">
        <div class="gucci-header-col gucci-header-col--left">
          <button
            type="button"
            id="gucci-contact-toggle"
            class="gucci-header-link gucci-contact-toggle btn-unstyle"
            aria-label="{l s='Contact us' d='Shop.Theme.Global'}"
            aria-expanded="false"
            aria-controls="gucci-contact-drawer"
          >
            {l s='Contact us' d='Shop.Theme.Global'}
          </button>
        </div>

        <div class="gucci-header-col gucci-header-col--center" id="_desktop_logo">
          {if $shop.logo_details}
            {if $page.page_name == 'index'}
              <h1 class="logo">
                {renderLogo}
              </h1>
            {else}
              <div class="logo">
                {renderLogo}
              </div>
            {/if}
          {/if}
        </div>

        <div class="gucci-header-col gucci-header-col--icons">
          {hook h='displayNav2'}

          <button
            type="button"
            id="gucci-search-toggle"
            class="gucci-search-toggle btn-unstyle"
            aria-label="{l s='Search' d='Shop.Theme.Catalog'}"
            aria-expanded="false"
            aria-controls="gucci-search-panel"
          >
            <i class="material-icons" aria-hidden="true">search</i>
          </button>

          <button
            type="button"
            id="menu-icon"
            class="gucci-menu-toggle btn-unstyle"
            aria-label="{l s='Menu' d='Shop.Theme.Global'}"
            aria-expanded="false"
            aria-controls="mobile_top_menu_wrapper"
          >
            <i class="material-icons" aria-hidden="true">&#xE5D2;</i>
          </button>
        </div>
      </div>

      <div class="top-logo hidden-md-up" id="_mobile_logo"></div>

      <div class="gucci-header-mobile-utilities hidden-md-up">
        <div id="_mobile_cart"></div>
        <div id="_mobile_user_info"></div>
      </div>
    </div>

    <div id="gucci-search-panel" class="gucci-search-panel" aria-hidden="true" hidden>
      <div class="gucci-search-panel-top">
        <button
          type="button"
          class="gucci-search-panel-close btn-unstyle"
          aria-label="{l s='Close' d='Shop.Theme.Global'}"
          data-gucci-search-close
        >
          {l s='Close' d='Shop.Theme.Global'}
        </button>
      </div>

      <div class="container gucci-search-panel-inner">
        <p class="gucci-search-label">{l s='Search' d='Shop.Theme.Catalog'}</p>
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
              placeholder="{l s='Search our catalog' d='Shop.Theme.Catalog'}"
              aria-label="{l s='Search' d='Shop.Theme.Catalog'}"
              class="gucci-search-input"
              autocomplete="off"
            >
            <button type="submit" class="gucci-search-submit visually-hidden" tabindex="-1" aria-hidden="true">
              {l s='Search' d='Shop.Theme.Catalog'}
            </button>
          </form>
        </div>
      </div>

      <div class="container gucci-search-results-wrap">
        <div id="gucci-search-results" class="gucci-search-results" aria-live="polite"></div>
      </div>
    </div>

    <div id="mobile_top_menu_wrapper" class="gucci-nav-drawer gucci-side-drawer" style="display:none;" aria-hidden="true">
      <div class="gucci-drawer-header">
        <button
          type="button"
          class="gucci-drawer-close btn-unstyle"
          aria-label="{l s='Close' d='Shop.Theme.Global'}"
          data-gucci-drawer-close
        >
          <i class="material-icons" aria-hidden="true">close</i>
        </button>
      </div>

      <div class="gucci-drawer-body">
        <div class="js-top-menu mobile" id="_mobile_top_menu">
          {hook h='displayTop'}
        </div>

        <div class="js-top-menu-bottom gucci-drawer-footer">
          <button
            type="button"
            class="gucci-drawer-link gucci-contact-toggle btn-unstyle"
            data-gucci-contact-open
          >
            {l s='Contact us' d='Shop.Theme.Global'}
          </button>
          {if !$customer.is_logged}
            <a
              href="{$urls.pages.authentication}?back={$urls.current_url|urlencode}"
              class="gucci-drawer-link"
              rel="nofollow"
            >
              {l s='Sign in' d='Shop.Theme.Actions'}
            </a>
          {else}
            <a href="{$urls.pages.my_account}" class="gucci-drawer-link" rel="nofollow">
              {l s='My account' d='Shop.Theme.Customeraccount'}
            </a>
          {/if}
          <div id="_mobile_currency_selector"></div>
          <div id="_mobile_language_selector"></div>
          <div id="_mobile_contact_link"></div>
        </div>
      </div>
    </div>

    <div id="gucci-contact-backdrop" class="gucci-contact-backdrop" aria-hidden="true" hidden></div>

    <div id="gucci-contact-drawer" class="gucci-contact-drawer gucci-side-drawer" aria-hidden="true" hidden>
      <div class="gucci-contact-drawer-header">
        <h2 class="gucci-contact-drawer-title">Contatti</h2>
        <button
          type="button"
          class="gucci-contact-close-circle btn-unstyle"
          aria-label="{l s='Close' d='Shop.Theme.Global'}"
          data-gucci-contact-close
        >
          <i class="material-icons" aria-hidden="true">close</i>
        </button>
      </div>

      <div class="gucci-drawer-body gucci-contact-drawer-body">
        {widget name='ps_contactinfo' template='module:ps_contactinfo/views/templates/hook/gucci-contact-panel.tpl'}
      </div>
    </div>
  </div>
{/block}
