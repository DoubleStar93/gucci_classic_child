{**
 * Classic Gucci — aside informativo pagina Contattaci (override ps_contactinfo-rich)
 *}
<div class="gucci-contact-aside-panel">
  {if isset($contact_infos.company) && $contact_infos.company}
    <p class="gucci-contact-aside__brand">{$contact_infos.company}</p>
  {/if}

  {if isset($contact_infos.email) && $contact_infos.email && $display_email}
    <div class="gucci-contact-aside__block">
      <h2 class="gucci-contact-aside__label">
        {if $language.iso_code == 'it'}E-mail{else}{l s='Email' d='Shop.Theme.Global'}{/if}
      </h2>
      <a href="mailto:{$contact_infos.email|escape:'url'}" class="gucci-contact-aside__link">
        {$contact_infos.email}
      </a>
      <p class="gucci-contact-aside__note">
        {if $language.iso_code == 'it'}Rispondiamo entro 24–48 ore lavorative.{else}{l s='We reply within 24–48 business hours.' d='Shop.Theme.Global'}{/if}
      </p>
    </div>
  {/if}

  {if isset($contact_infos.phone) && $contact_infos.phone}
    {assign var=gucci_phone_href value=$contact_infos.phone|regex_replace:'/[^0-9+]/':''}
    <div class="gucci-contact-aside__block">
      <h2 class="gucci-contact-aside__label">
        {if $language.iso_code == 'it'}Telefono{else}{l s='Phone' d='Shop.Theme.Global'}{/if}
      </h2>
      <a href="tel:{$gucci_phone_href}" class="gucci-contact-aside__link">
        {$contact_infos.phone}
      </a>
    </div>
  {/if}

  {if isset($contact_infos.address) && ($contact_infos.address.city || $contact_infos.address.country)}
    <div class="gucci-contact-aside__block">
      <h2 class="gucci-contact-aside__label">
        {if $language.iso_code == 'it'}Negozio{else}{l s='Store' d='Shop.Theme.Global'}{/if}
      </h2>
      <address class="gucci-contact-aside__address">
        {if $contact_infos.address.city}<span>{$contact_infos.address.city}</span>{/if}
        {if $contact_infos.address.country}<span>{$contact_infos.address.country}</span>{/if}
      </address>
    </div>
  {/if}
</div>
