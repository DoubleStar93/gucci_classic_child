{**
 * Classic Gucci — drawer Contatti stile gucci.com
 *}
<div class="gucci-contact-panel">
  {if isset($contact_infos.address) && ($contact_infos.company || $contact_infos.address.formatted)}
    <section class="gucci-contact-section gucci-contact-section--store" aria-labelledby="gucci-contact-store-title">
      <h3 id="gucci-contact-store-title" class="gucci-contact-section-title">
        {if $language.iso_code == 'it'}Informazioni negozio{else}{l s='Store information' d='Shop.Theme.Global'}{/if}
      </h3>

      <div class="gucci-contact-store">
        {if isset($contact_infos.company) && $contact_infos.company}
          <p class="gucci-contact-store-name">{$contact_infos.company}</p>
        {/if}

        <address class="gucci-contact-address">
          {if $contact_infos.address.address1}
            <span class="gucci-contact-address-line">{$contact_infos.address.address1}</span>
          {/if}
          {if $contact_infos.address.address2}
            <span class="gucci-contact-address-line">{$contact_infos.address.address2}</span>
          {/if}
          {if $contact_infos.address.postcode || $contact_infos.address.city}
            <span class="gucci-contact-address-line">
              {if $contact_infos.address.postcode}{$contact_infos.address.postcode}{/if}{if $contact_infos.address.postcode && $contact_infos.address.city} {/if}{if $contact_infos.address.city}{$contact_infos.address.city}{/if}
            </span>
          {/if}
          {if $contact_infos.address.state}
            <span class="gucci-contact-address-line">{$contact_infos.address.state}</span>
          {/if}
          {if $contact_infos.address.country}
            <span class="gucci-contact-address-line">{$contact_infos.address.country}</span>
          {/if}
        </address>
      </div>
    </section>
  {/if}

  <section class="gucci-contact-section gucci-contact-section--channels" aria-labelledby="gucci-contact-channels-title">
    <h3 id="gucci-contact-channels-title" class="gucci-contact-section-title">
      {if $language.iso_code == 'it'}Assistenza clienti{else}{l s='Customer care' d='Shop.Theme.Global'}{/if}
    </h3>

    <ul class="gucci-contact-channels" role="list">
      {if isset($contact_infos.phone) && $contact_infos.phone}
        {assign var=gucci_phone_href value=$contact_infos.phone|regex_replace:'/[^0-9+]/':''}
        {assign var=gucci_phone_wa value=$contact_infos.phone|regex_replace:'/[^0-9]/':''}

        <li class="gucci-contact-channel">
          <a href="tel:{$gucci_phone_href}" class="gucci-contact-channel-link">
            <span class="gucci-contact-channel-icon-wrap" aria-hidden="true">
              <i class="material-icons gucci-contact-channel-icon">phone</i>
            </span>
            <span class="gucci-contact-channel-copy">
              <span class="gucci-contact-channel-label">
                {if $language.iso_code == 'it'}Telefono{else}{l s='Phone' d='Shop.Theme.Global'}{/if}
              </span>
              <span class="gucci-contact-channel-text">{$contact_infos.phone}</span>
            </span>
          </a>
          <p class="gucci-contact-channel-hours">
            {if $language.iso_code == 'it'}Dal lunedì alla domenica, 10:00–19:00 (CET).{else}{l s='Monday to Sunday from 10:00 a.m. to 7:00 p.m. (CET).' d='Shop.Theme.Global'}{/if}
          </p>
        </li>

        <li class="gucci-contact-channel">
          <a
            href="https://wa.me/{$gucci_phone_wa}"
            class="gucci-contact-channel-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="gucci-contact-channel-icon-wrap" aria-hidden="true">
              <span class="gucci-contact-channel-icon gucci-contact-channel-icon--whatsapp"></span>
            </span>
            <span class="gucci-contact-channel-copy">
              <span class="gucci-contact-channel-label">WhatsApp</span>
              <span class="gucci-contact-channel-text">
                {if $language.iso_code == 'it'}Scrivici su WhatsApp{else}{l s='Write to us on WhatsApp' d='Shop.Theme.Global'}{/if}
              </span>
            </span>
          </a>
          <p class="gucci-contact-channel-hours">
            {if $language.iso_code == 'it'}Dal lunedì alla domenica, 10:00–19:00 (CET).{else}{l s='Monday to Sunday from 10:00 a.m. to 7:00 p.m. (CET).' d='Shop.Theme.Global'}{/if}
          </p>
        </li>
      {/if}

      {if isset($contact_infos.email) && $contact_infos.email && $display_email}
        <li class="gucci-contact-channel gucci-contact-channel--email">
          <a href="mailto:{$contact_infos.email|escape:'url'}" class="gucci-contact-channel-link">
            <span class="gucci-contact-channel-icon-wrap" aria-hidden="true">
              <i class="material-icons gucci-contact-channel-icon">mail_outline</i>
            </span>
            <span class="gucci-contact-channel-copy">
              <span class="gucci-contact-channel-label">
                {if $language.iso_code == 'it'}E-mail{else}{l s='Email' d='Shop.Theme.Global'}{/if}
              </span>
              <span class="gucci-contact-channel-text gucci-contact-channel-text--email">{$contact_infos.email}</span>
            </span>
          </a>
          <p class="gucci-contact-channel-hours">
            {if $language.iso_code == 'it'}Rispondiamo entro 24–48 ore lavorative.{else}{l s='We reply within 24–48 business hours.' d='Shop.Theme.Global'}{/if}
          </p>
        </li>
      {/if}

      <li class="gucci-contact-channel">
        <a href="{$urls.pages.contact}" class="gucci-contact-channel-link">
          <span class="gucci-contact-channel-icon-wrap" aria-hidden="true">
            <i class="material-icons gucci-contact-channel-icon">chat_bubble_outline</i>
          </span>
          <span class="gucci-contact-channel-copy">
            <span class="gucci-contact-channel-label">
              {if $language.iso_code == 'it'}Modulo contatti{else}{l s='Contact form' d='Shop.Theme.Global'}{/if}
            </span>
            <span class="gucci-contact-channel-text">
              {if $language.iso_code == 'it'}Invia un messaggio{else}{l s='Send us a message' d='Shop.Theme.Global'}{/if}
            </span>
          </span>
        </a>
      </li>
    </ul>
  </section>

  <div class="gucci-contact-assistance">
    <p class="gucci-contact-assistance-title">
      {if $language.iso_code == 'it'}Hai bisogno di ulteriore assistenza?{else}{l s='Do you need further assistance?' d='Shop.Theme.Global'}{/if}
    </p>
    <a href="{$urls.pages.contact}" class="gucci-contact-assistance-link">
      {if $language.iso_code == 'it'}Contattaci{else}{l s='Contact us' d='Shop.Theme.Global'}{/if}
    </a>
  </div>
</div>
