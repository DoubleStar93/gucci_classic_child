{*
 * Ever Popup — template front Barbara Alvisi / Gucci style
 *}
<a href="#everpspopup_block_center" {if isset($everpspopup->carrier) && $everpspopup->carrier > 0}data-carrier="{$everpspopup->carrier|escape:'htmlall':'UTF-8'}"{/if} rel="nofollow" data-fancybox id="ever_fancy_mark"></a>
<div
  id="everpspopup_block_center"
  {if isset($everpspopup->carrier) && $everpspopup->carrier > 0}data-carrier="{$everpspopup->carrier|escape:'htmlall':'UTF-8'}"{/if}
  data-delay="{$everpspopup->delay|escape:'htmlall':'UTF-8'}"
  data-adult="{$everpspopup->adult_mode|escape:'htmlall':'UTF-8'}"
  data-expire="{$everpspopup->cookie_time|escape:'htmlall':'UTF-8'}"
  data-cookiesuffix="{$everpspopup->controller_array|escape:'htmlall':'UTF-8'}{$everpspopup->cookie_suffix|escape:'htmlall':'UTF-8'}"
  class="Everpopup_block gucci-everpopup"
  style="display:none;"
>
  <div class="gucci-everpopup__panel"{if $everpspopup->bgcolor} style="background-color:{$everpspopup->bgcolor|escape:'htmlall':'UTF-8'};"{/if}>
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
      <section class="gucci-everpopup__newsletter" aria-label="{l s='Newsletter subscription' mod='everpspopup'}">
        <p class="gucci-everpopup__eyebrow">{l s='Newsletter' mod='everpspopup'}</p>
        <h2 class="gucci-everpopup__title">{l s='Subscribe for newsletter' mod='everpspopup'}</h2>
        <form id="ever_subscription_form" class="gucci-everpopup__form" method="post">
          <label class="gucci-everpopup__label" for="everpspopupEmail">{l s='Your email' mod='everpspopup'}</label>
          <input
            id="everpspopupEmail"
            name="everpspopupEmail"
            class="gucci-everpopup__input form-control"
            type="email"
            placeholder="{l s='Your email' mod='everpspopup'}"
            required
          />
          <div class="gucci-everpopup__gdpr">
            <input type="checkbox" class="gucci-everpopup__checkbox" id="everpspopupGdpr" name="everpspopupGdpr" value="1">
            <label class="gucci-everpopup__gdpr-label" for="everpspopupGdpr">{l s='GDPR consent' mod='everpspopup'}</label>
          </div>
          <input type="hidden" id="everpspopup_new_subscribe_url" value="{$link->getModuleLink('everpspopup', 'ajaxNewSubscribe')|escape:'htmlall':'UTF-8'}" />
          <button class="gucci-everpopup__submit" type="submit">{l s='Submit' mod='everpspopup'}</button>
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
