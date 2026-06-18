{*
 * Ever Popup — template front Barbara Alvisi / Gucci style
 *}
<div
  id="gucci-everpopup-overlay"
  class="gucci-everpopup-overlay"
  hidden
  aria-hidden="true"
  role="dialog"
  aria-modal="true"
>
  <div
    id="everpspopup_block_center"
    {if isset($everpspopup->carrier) && $everpspopup->carrier > 0}data-carrier="{$everpspopup->carrier|escape:'htmlall':'UTF-8'}"{/if}
    data-delay="{$everpspopup->delay|escape:'htmlall':'UTF-8'}"
    data-adult="{$everpspopup->adult_mode|escape:'htmlall':'UTF-8'}"
    data-expire="{$everpspopup->cookie_time|escape:'htmlall':'UTF-8'}"
    data-cookiesuffix="{$everpspopup->controller_array|escape:'htmlall':'UTF-8'}{$everpspopup->cookie_suffix|escape:'htmlall':'UTF-8'}"
    class="Everpopup_block gucci-everpopup"
  >
    <div class="gucci-everpopup__panel"{if $everpspopup->bgcolor} style="background-color:{$everpspopup->bgcolor|escape:'htmlall':'UTF-8'};"{/if}>
      <button type="button" class="gucci-everpopup__close" aria-label="{if isset($language) && $language.iso_code == 'it'}Chiudi{else}{l s='Close' mod='everpspopup'}{/if}">&times;</button>
      <style>
        #everpspopup_block_center,
        #everpspopup_block_center .gucci-everpopup__panel {
          max-height: none !important;
          height: auto !important;
          overflow: visible !important;
        }
        #everpspopup_block_center .gucci-everpopup__panel {
          padding: 0 !important;
        }
        #everpspopup_block_center .gucci-everpopup__newsletter {
          margin-top: 0.65rem !important;
          padding: 0 1.25rem 1.25rem !important;
          border-top: none !important;
        }
        #everpspopup_block_center .gucci-everpopup__content.rte img {
          margin-bottom: 0 !important;
        }
        #everpspopup_block_center .gucci-everpopup__feedback--ok {
          margin: 1rem 1.25rem 1.25rem !important;
        }
        #everpspopup_block_center .gucci-everpopup__success {
          display: none;
          margin: 0.35rem 0 0;
          padding: 0.75rem 0;
          font-family: var(--font-sans, "Jost", sans-serif);
          font-size: 14px;
          font-weight: 400;
          line-height: 1.5;
          text-align: center;
          color: var(--ba-bordeaux, #6b2a28);
        }
      </style>
      {if $everpspopup->link}
        <a href="{$everpspopup->link|escape:'htmlall':'UTF-8'}" class="gucci-everpopup__link-wrap" rel="nofollow">
      {/if}

      {if $everpspopup->content}
        <div class="gucci-everpopup__content rte">
          {$everpspopup->content nofilter}
        </div>
      {/if}

      {if $everpspopup->link}
        </a>
      {/if}

      {if $everpspopup->newsletter}
        {if isset($language) && $language.iso_code == 'it'}
          {assign var='gucciPopupAria' value='Iscrizione alla newsletter'}
          {assign var='gucciPopupNlTitle' value='Iscriviti alla newsletter'}
          {assign var='gucciPopupEmailPh' value='La tua e-mail'}
          {assign var='gucciPopupGdpr' value='Acconsento al trattamento dei dati personali'}
          {assign var='gucciPopupGdprErr' value='Consenso GDPR richiesto.'}
          {assign var='gucciPopupSubmit' value='Iscriviti'}
        {else}
          {l s='Newsletter subscription' mod='everpspopup' assign='gucciPopupAria'}
          {l s='Subscribe for newsletter' mod='everpspopup' assign='gucciPopupNlTitle'}
          {l s='Your email' mod='everpspopup' assign='gucciPopupEmailPh'}
          {l s='GDPR consent' mod='everpspopup' assign='gucciPopupGdpr'}
          {l s='GDPR consent.' mod='everpspopup' assign='gucciPopupGdprErr'}
          {l s='Submit' mod='everpspopup' assign='gucciPopupSubmit'}
        {/if}
        <section class="gucci-everpopup__newsletter" aria-label="{$gucciPopupAria|escape:'htmlall':'UTF-8'}">
          <h2 class="gucci-everpopup__title">{$gucciPopupNlTitle|escape:'htmlall':'UTF-8'}</h2>
          <form
            id="ever_subscription_form"
            class="gucci-everpopup__form"
            method="post"
            action="#"
            data-msg-gdpr="{$gucciPopupGdprErr|escape:'htmlall':'UTF-8'}"
            data-msg-email="{if isset($language) && $language.iso_code == 'it'}Inserisci un indirizzo e-mail valido{else}{l s='Please enter a valid email address' mod='everpspopup'}{/if}"
            data-msg-network="{if isset($language) && $language.iso_code == 'it'}Connessione non riuscita. Riprova.{else}{l s='Connection failed. Please try again.' mod='everpspopup'}{/if}"
          >
            <input
              id="everpspopupEmail"
              name="everpspopupEmail"
              class="gucci-everpopup__input form-control"
              type="email"
              placeholder="{$gucciPopupEmailPh|escape:'htmlall':'UTF-8'}"
              aria-label="{$gucciPopupEmailPh|escape:'htmlall':'UTF-8'}"
              required
            />
            <div class="gucci-everpopup__gdpr">
              <input type="checkbox" class="gucci-everpopup__checkbox" id="everpspopupGdpr" name="everpspopupGdpr" value="1">
              <label class="gucci-everpopup__gdpr-label" for="everpspopupGdpr">{$gucciPopupGdpr|escape:'htmlall':'UTF-8'}</label>
            </div>
            <input type="hidden" id="everpspopup_new_subscribe_url" value="{$link->getModuleLink('everpspopup', 'ajaxNewSubscribe')|escape:'htmlall':'UTF-8'}" />
            <button class="gucci-everpopup__submit" type="submit">{$gucciPopupSubmit|escape:'htmlall':'UTF-8'}</button>
            <p class="gucci-everpopup__success" id="everpspopup_success_msg" role="status" style="display:none;"></p>
          </form>
        </section>
      {/if}

      {if $everpspopup->adult_mode && $ever_ask_age == true}
        <section class="gucci-everpopup__adult">
          <h2 class="gucci-everpopup__title">{l s='You must be of age to access this content' mod='everpspopup'}</h2>
          <form id="adult_mode_form" class="gucci-everpopup__form" method="post">
            <label class="gucci-everpopup__label" for="ever_birthday">{l s='Birthday' mod='everpspopup'}</label>
            <input class="gucci-everpopup__input form-control" id="ever_birthday" name="ever_birthday" type="date" required />
            <input type="hidden" id="everpspopup_new_adult_url" value="{$link->getModuleLink('everpspopup', 'ajaxAdultMode')|escape:'htmlall':'UTF-8'}" />
            <button class="gucci-everpopup__submit" type="submit">{l s='Submit' mod='everpspopup'}</button>
          </form>
        </section>
      {/if}

      {if $everpspopup->adult_mode && $ever_ask_age == false}
        <section class="gucci-everpopup__adult">
          <h2 class="gucci-everpopup__title">{l s='You must be of age to access this content' mod='everpspopup'}</h2>
          <form id="adult_mode_form" class="gucci-everpopup__form" method="post">
            <input id="ever_birthday" name="ever_birthday" type="hidden" value="{$ever_required_age|escape:'htmlall':'UTF-8'}" />
            <input type="hidden" id="everpspopup_new_adult_url" value="{$link->getModuleLink('everpspopup', 'ajaxAdultMode')|escape:'htmlall':'UTF-8'}" />
            <button class="gucci-everpopup__submit" type="submit">{l s='I certify that I am of age' mod='everpspopup'}</button>
          </form>
        </section>
      {/if}

      <div class="gucci-everpopup__feedback gucci-everpopup__feedback--ok" id="everpspopup_confirm" style="display:none;" role="status"></div>
      <div class="gucci-everpopup__feedback gucci-everpopup__feedback--error" id="everpspopup_error" style="display:none;" role="alert"></div>
    </div>
  </div>
</div>
<link rel="stylesheet" href="{$everpspopup_assets_base|escape:'htmlall':'UTF-8'}views/css/everpspopup.css?v={$everpspopup_asset_version|escape:'htmlall':'UTF-8'}" />
<script src="{$everpspopup_assets_base|escape:'htmlall':'UTF-8'}views/js/everpspopup.js?v={$everpspopup_asset_version|escape:'htmlall':'UTF-8'}"></script>
