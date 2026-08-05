{*
 * Ever Popup — template front Barbara Alvisi / Barbaraalvisi style
 *}
<div
  id="barbaraalvisi-everpopup-overlay"
  class="barbaraalvisi-everpopup-overlay"
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
    class="Everpopup_block barbaraalvisi-everpopup"
  >
    <div class="barbaraalvisi-everpopup__panel"{if $everpspopup->bgcolor} style="background-color:{$everpspopup->bgcolor|escape:'htmlall':'UTF-8'};"{/if}>
      <button type="button" class="barbaraalvisi-everpopup__close" aria-label="{if $everpspopup_lang_iso == 'it'}Chiudi{else}Close{/if}">&times;</button>
      <style>
        #barbaraalvisi-everpopup-overlay {
          position: fixed !important;
          inset: 0 !important;
          z-index: 99990 !important;
          display: none;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          background: rgba(26, 20, 18, 0.72);
          overflow-y: auto;
        }
        #barbaraalvisi-everpopup-overlay.is-open {
          display: flex !important;
        }
        #barbaraalvisi-everpopup-overlay[hidden] {
          display: none !important;
        }
        body.barbaraalvisi-everpopup-open {
          overflow: hidden;
        }
        #everpspopup_block_center,
        #everpspopup_block_center .barbaraalvisi-everpopup__panel {
          max-height: none !important;
          height: auto !important;
          overflow: visible !important;
        }
        #everpspopup_block_center .barbaraalvisi-everpopup__panel {
          padding: 0 !important;
        }
        #everpspopup_block_center .barbaraalvisi-everpopup__newsletter {
          margin-top: 0.65rem !important;
          padding: 0 1.25rem 1.25rem !important;
          border-top: none !important;
        }
        #everpspopup_block_center .barbaraalvisi-everpopup__content.rte img {
          margin-bottom: 0 !important;
        }
        #everpspopup_block_center .barbaraalvisi-everpopup__feedback--ok {
          margin: 1rem 1.25rem 1.25rem !important;
        }
        #everpspopup_block_center .barbaraalvisi-everpopup__success {
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
        <a href="{$everpspopup->link|escape:'htmlall':'UTF-8'}" class="barbaraalvisi-everpopup__link-wrap" rel="nofollow">
      {/if}

      {if $everpspopup->content}
        <div class="barbaraalvisi-everpopup__content rte">
          {$everpspopup->content nofilter}
        </div>
      {/if}

      {if $everpspopup->link}
        </a>
      {/if}

      {if $everpspopup->newsletter}
        {if $everpspopup_lang_iso == 'it'}
          {assign var='barbaraalvisiPopupAria' value='Iscrizione alla newsletter'}
          {assign var='barbaraalvisiPopupNlTitle' value='Iscriviti alla newsletter'}
          {assign var='barbaraalvisiPopupEmailPh' value='La tua e-mail'}
          {assign var='barbaraalvisiPopupGdpr' value='Acconsento al trattamento dei dati personali'}
          {assign var='barbaraalvisiPopupGdprErr' value='Consenso GDPR richiesto.'}
          {assign var='barbaraalvisiPopupSubmit' value='Iscriviti'}
        {else}
          {assign var='barbaraalvisiPopupAria' value='Newsletter subscription'}
          {assign var='barbaraalvisiPopupNlTitle' value='Subscribe to our newsletter'}
          {assign var='barbaraalvisiPopupEmailPh' value='Your email address'}
          {assign var='barbaraalvisiPopupGdpr' value='I agree to the processing of my personal data'}
          {assign var='barbaraalvisiPopupGdprErr' value='GDPR consent is required.'}
          {assign var='barbaraalvisiPopupSubmit' value='Subscribe'}
        {/if}
        <section class="barbaraalvisi-everpopup__newsletter" aria-label="{$barbaraalvisiPopupAria|escape:'htmlall':'UTF-8'}">
          <h2 class="barbaraalvisi-everpopup__title">{$barbaraalvisiPopupNlTitle|escape:'htmlall':'UTF-8'}</h2>
          <form
            id="ever_subscription_form"
            class="barbaraalvisi-everpopup__form"
            method="post"
            action="#"
            data-msg-gdpr="{$barbaraalvisiPopupGdprErr|escape:'htmlall':'UTF-8'}"
            data-msg-email="{if $everpspopup_lang_iso == 'it'}Inserisci un indirizzo e-mail valido{else}Please enter a valid email address{/if}"
            data-msg-network="{if $everpspopup_lang_iso == 'it'}Connessione non riuscita. Riprova.{else}Connection failed. Please try again.{/if}"
          >
            <input
              id="everpspopupEmail"
              name="everpspopupEmail"
              class="barbaraalvisi-everpopup__input form-control"
              type="email"
              placeholder="{$barbaraalvisiPopupEmailPh|escape:'htmlall':'UTF-8'}"
              aria-label="{$barbaraalvisiPopupEmailPh|escape:'htmlall':'UTF-8'}"
              required
            />
            <div class="barbaraalvisi-everpopup__gdpr">
              <input type="checkbox" class="barbaraalvisi-everpopup__checkbox" id="everpspopupGdpr" name="everpspopupGdpr" value="1">
              <label class="barbaraalvisi-everpopup__gdpr-label" for="everpspopupGdpr">{$barbaraalvisiPopupGdpr|escape:'htmlall':'UTF-8'}</label>
            </div>
            <input type="hidden" id="everpspopup_new_subscribe_url" value="{$link->getModuleLink('everpspopup', 'ajaxNewSubscribe')|escape:'htmlall':'UTF-8'}" />
            <button class="barbaraalvisi-everpopup__submit" type="submit">{$barbaraalvisiPopupSubmit|escape:'htmlall':'UTF-8'}</button>
            <p class="barbaraalvisi-everpopup__success" id="everpspopup_success_msg" role="status" style="display:none;"></p>
          </form>
        </section>
      {/if}

      {if $everpspopup->adult_mode && $ever_ask_age == true}
        <section class="barbaraalvisi-everpopup__adult">
          <h2 class="barbaraalvisi-everpopup__title">{l s='You must be of age to access this content' mod='everpspopup'}</h2>
          <form id="adult_mode_form" class="barbaraalvisi-everpopup__form" method="post">
            <label class="barbaraalvisi-everpopup__label" for="ever_birthday">{l s='Birthday' mod='everpspopup'}</label>
            <input class="barbaraalvisi-everpopup__input form-control" id="ever_birthday" name="ever_birthday" type="date" required />
            <input type="hidden" id="everpspopup_new_adult_url" value="{$link->getModuleLink('everpspopup', 'ajaxAdultMode')|escape:'htmlall':'UTF-8'}" />
            <button class="barbaraalvisi-everpopup__submit" type="submit">{l s='Submit' mod='everpspopup'}</button>
          </form>
        </section>
      {/if}

      {if $everpspopup->adult_mode && $ever_ask_age == false}
        <section class="barbaraalvisi-everpopup__adult">
          <h2 class="barbaraalvisi-everpopup__title">{l s='You must be of age to access this content' mod='everpspopup'}</h2>
          <form id="adult_mode_form" class="barbaraalvisi-everpopup__form" method="post">
            <input id="ever_birthday" name="ever_birthday" type="hidden" value="{$ever_required_age|escape:'htmlall':'UTF-8'}" />
            <input type="hidden" id="everpspopup_new_adult_url" value="{$link->getModuleLink('everpspopup', 'ajaxAdultMode')|escape:'htmlall':'UTF-8'}" />
            <button class="barbaraalvisi-everpopup__submit" type="submit">{l s='I certify that I am of age' mod='everpspopup'}</button>
          </form>
        </section>
      {/if}

      <div class="barbaraalvisi-everpopup__feedback barbaraalvisi-everpopup__feedback--ok" id="everpspopup_confirm" style="display:none;" role="status"></div>
      <div class="barbaraalvisi-everpopup__feedback barbaraalvisi-everpopup__feedback--error" id="everpspopup_error" style="display:none;" role="alert"></div>
    </div>
  </div>
</div>
<link rel="stylesheet" href="{$everpspopup_assets_base|escape:'htmlall':'UTF-8'}views/css/everpspopup.css?v={$everpspopup_asset_version|escape:'htmlall':'UTF-8'}" />
<script src="{$everpspopup_assets_base|escape:'htmlall':'UTF-8'}views/js/everpspopup.js?v={$everpspopup_asset_version|escape:'htmlall':'UTF-8'}"></script>
