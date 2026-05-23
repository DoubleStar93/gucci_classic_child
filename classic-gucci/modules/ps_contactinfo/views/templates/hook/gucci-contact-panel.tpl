{**
 * Classic Gucci — drawer Contattaci stile gucci.com
 *}
<div class="gucci-contact-panel">
  {if isset($contact_infos.phone) && $contact_infos.phone}
    {assign var=gucci_phone_href value=$contact_infos.phone|regex_replace:'/[^0-9+]/':''}
    {assign var=gucci_phone_wa value=$contact_infos.phone|regex_replace:'/[^0-9]/':''}
    <div class="gucci-contact-channel">
      <a href="tel:{$gucci_phone_href}" class="gucci-contact-channel-link">
        <i class="material-icons gucci-contact-channel-icon" aria-hidden="true">phone</i>
        <span class="gucci-contact-channel-text">
          {if $language.iso_code == 'it'}Chiamaci {$contact_infos.phone}{else}{l s='Call us' d='Shop.Theme.Global'} {$contact_infos.phone}{/if}
        </span>
      </a>
      <p class="gucci-contact-channel-hours">
        {if $language.iso_code == 'it'}Dal Lunedì alla Domenica dalle 10.00 alle 19.00 (CET).{else}{l s='Monday to Sunday from 10:00 a.m. to 7:00 p.m. (CET).' d='Shop.Theme.Global'}{/if}
      </p>
    </div>

    <div class="gucci-contact-channel">
      <a
        href="https://wa.me/{$gucci_phone_wa}"
        class="gucci-contact-channel-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="gucci-contact-channel-icon gucci-contact-channel-icon--whatsapp" aria-hidden="true"></span>
        <span class="gucci-contact-channel-text">
          {if $language.iso_code == 'it'}Scrivici su WhatsApp{else}{l s='Write to us on WhatsApp' d='Shop.Theme.Global'}{/if}
        </span>
      </a>
      <p class="gucci-contact-channel-hours">
        {if $language.iso_code == 'it'}Dal Lunedì alla Domenica dalle 10.00 alle 19.00 (CET).{else}{l s='Monday to Sunday from 10:00 a.m. to 7:00 p.m. (CET).' d='Shop.Theme.Global'}{/if}
      </p>
    </div>
  {/if}

  <div class="gucci-contact-channel">
    <a href="{$urls.pages.contact}" class="gucci-contact-channel-link">
      <span class="gucci-contact-channel-icon gucci-contact-channel-icon--live" aria-hidden="true"></span>
      <span class="gucci-contact-channel-text gucci-contact-channel-text--caps">
        {if $language.iso_code == 'it'}Live chat{else}{l s='Live chat' d='Shop.Theme.Global'}{/if}
      </span>
    </a>
    <p class="gucci-contact-channel-hours">
      {if $language.iso_code == 'it'}Dal Lunedì alla Domenica dalle 10.00 alle 19.00 (CET).{else}{l s='Monday to Sunday from 10:00 a.m. to 7:00 p.m. (CET).' d='Shop.Theme.Global'}{/if}
    </p>
  </div>

  {if isset($contact_infos.email) && $contact_infos.email && $display_email}
    <div class="gucci-contact-channel gucci-contact-channel--email">
      <a href="mailto:{$contact_infos.email|escape:'url'}" class="gucci-contact-channel-link">
        <i class="material-icons gucci-contact-channel-icon" aria-hidden="true">mail_outline</i>
        <span class="gucci-contact-channel-text">{$contact_infos.email}</span>
      </a>
      <p class="gucci-contact-channel-hours">
        {if $language.iso_code == 'it'}Dal Lunedì alla Domenica dalle 10.00 alle 19.00 (CET).{else}{l s='Monday to Sunday from 10:00 a.m. to 7:00 p.m. (CET).' d='Shop.Theme.Global'}{/if}
      </p>
    </div>
  {/if}

  <div class="gucci-contact-assistance">
    <p class="gucci-contact-assistance-title">
      {if $language.iso_code == 'it'}Hai bisogno di ulteriore assistenza?{else}{l s='Do you need further assistance?' d='Shop.Theme.Global'}{/if}
    </p>
    <a href="{$urls.pages.contact}" class="gucci-contact-assistance-link">
      {l s='Contact us' d='Shop.Theme.Global'}
    </a>
  </div>
</div>
