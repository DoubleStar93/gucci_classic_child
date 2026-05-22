{**
 * Classic Gucci — header su un'unica riga
 * Sinistra: menu | Centro: logo | Destra: cerca + account + carrello
 *}
{block name='header_banner'}{/block}

{block name='header_nav'}{/block}

{block name='header_top'}
  <div class="gucci-header-bar header-top">
    <div class="container">
      <div class="gucci-header-inner hidden-sm-down">
        <div class="gucci-header-col gucci-header-col--left">
          {hook h='displayTop'}
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

        <div class="gucci-header-col gucci-header-col--right">
          {hook h='displayNav2'}
        </div>
      </div>

      <div class="hidden-md-up gucci-header-mobile">
        <div class="gucci-header-mobile-top">
          <div id="menu-icon">
            <i class="material-icons">&#xE5D2;</i>
          </div>
          <div class="gucci-header-mobile-logo" id="_mobile_logo"></div>
          <div class="gucci-header-mobile-icons">
            <div id="_mobile_cart"></div>
            <div id="_mobile_user_info"></div>
          </div>
        </div>
        <div id="mobile_top_menu_wrapper" style="display:none;">
          <div class="js-top-menu mobile" id="_mobile_top_menu"></div>
          <div class="js-top-menu-bottom">
            <div id="_mobile_currency_selector"></div>
            <div id="_mobile_language_selector"></div>
            <div id="_mobile_contact_link"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/block}
