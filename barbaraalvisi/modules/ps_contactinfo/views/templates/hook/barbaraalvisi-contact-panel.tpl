{**
 * Barbara Alvisi — drawer Contatti stile luxury reference
 *}
<div class="barbaraalvisi-contact-panel">
  {if isset($contact_infos.address) && ($contact_infos.company || $contact_infos.address.formatted)}
    <section class="barbaraalvisi-contact-section barbaraalvisi-contact-section--store" aria-labelledby="barbaraalvisi-contact-store-title">
      <h3 id="barbaraalvisi-contact-store-title" class="barbaraalvisi-contact-section-title">
        {if $language.iso_code == 'it'}Informazioni negozio{else}{l s='Store information' d='Shop.Theme.Global'}{/if}
      </h3>

      <div class="barbaraalvisi-contact-store">
        {if isset($contact_infos.company) && $contact_infos.company}
          <p class="barbaraalvisi-contact-store-name">{$contact_infos.company}</p>
        {/if}

        <address class="barbaraalvisi-contact-address">
          {if $contact_infos.address.address1}
            <span class="barbaraalvisi-contact-address-line">{$contact_infos.address.address1}</span>
          {/if}
          {if $contact_infos.address.address2}
            <span class="barbaraalvisi-contact-address-line">{$contact_infos.address.address2}</span>
          {/if}
          {if $contact_infos.address.postcode || $contact_infos.address.city}
            <span class="barbaraalvisi-contact-address-line">
              {if $contact_infos.address.postcode}{$contact_infos.address.postcode}{/if}{if $contact_infos.address.postcode && $contact_infos.address.city} {/if}{if $contact_infos.address.city}{$contact_infos.address.city}{/if}
            </span>
          {/if}
          {if $contact_infos.address.state}
            <span class="barbaraalvisi-contact-address-line">{$contact_infos.address.state}</span>
          {/if}
          {if $contact_infos.address.country}
            <span class="barbaraalvisi-contact-address-line">{$contact_infos.address.country}</span>
          {/if}
        </address>
      </div>
    </section>
  {/if}

  <section class="barbaraalvisi-contact-section barbaraalvisi-contact-section--channels" aria-labelledby="barbaraalvisi-contact-channels-title">
    <h3 id="barbaraalvisi-contact-channels-title" class="barbaraalvisi-contact-section-title">
      {if $language.iso_code == 'it'}Assistenza clienti{else}{l s='Customer care' d='Shop.Theme.Global'}{/if}
    </h3>

    <ul class="barbaraalvisi-contact-channels" role="list">
      {if isset($contact_infos.phone) && $contact_infos.phone}
        {assign var=barbaraalvisi_phone_href value=$contact_infos.phone|regex_replace:'/[^0-9+]/':''}
        {assign var=barbaraalvisi_phone_wa value=$contact_infos.phone|regex_replace:'/[^0-9]/':''}

        <li class="barbaraalvisi-contact-channel">
          <a href="tel:{$barbaraalvisi_phone_href}" class="barbaraalvisi-contact-channel-link">
            <span class="barbaraalvisi-contact-channel-icon-wrap" aria-hidden="true">
              <i class="material-icons barbaraalvisi-contact-channel-icon">phone</i>
            </span>
            <span class="barbaraalvisi-contact-channel-copy">
              <span class="barbaraalvisi-contact-channel-label">
                {if $language.iso_code == 'it'}Telefono{else}{l s='Phone' d='Shop.Theme.Global'}{/if}
              </span>
              <span class="barbaraalvisi-contact-channel-text">{$contact_infos.phone}</span>
            </span>
          </a>
          <p class="barbaraalvisi-contact-channel-hours">
            {if $language.iso_code == 'it'}Dal lunedì alla domenica, 10:00–19:00 (CET).{else}{l s='Monday to Sunday from 10:00 a.m. to 7:00 p.m. (CET).' d='Shop.Theme.Global'}{/if}
          </p>
        </li>

        <li class="barbaraalvisi-contact-channel">
          <a
            href="https://wa.me/{$barbaraalvisi_phone_wa}"
            class="barbaraalvisi-contact-channel-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="barbaraalvisi-contact-channel-icon-wrap" aria-hidden="true">
              <span class="barbaraalvisi-contact-channel-icon barbaraalvisi-contact-channel-icon--whatsapp"></span>
            </span>
            <span class="barbaraalvisi-contact-channel-copy">
              <span class="barbaraalvisi-contact-channel-label">WhatsApp</span>
              <span class="barbaraalvisi-contact-channel-text">
                {if $language.iso_code == 'it'}Scrivici su WhatsApp{else}{l s='Write to us on WhatsApp' d='Shop.Theme.Global'}{/if}
              </span>
            </span>
          </a>
          <p class="barbaraalvisi-contact-channel-hours">
            {if $language.iso_code == 'it'}Dal lunedì alla domenica, 10:00–19:00 (CET).{else}{l s='Monday to Sunday from 10:00 a.m. to 7:00 p.m. (CET).' d='Shop.Theme.Global'}{/if}
          </p>
        </li>
      {/if}

      {if isset($contact_infos.email) && $contact_infos.email && $display_email}
        <li class="barbaraalvisi-contact-channel barbaraalvisi-contact-channel--email">
          <a href="mailto:{$contact_infos.email|escape:'url'}" class="barbaraalvisi-contact-channel-link">
            <span class="barbaraalvisi-contact-channel-icon-wrap" aria-hidden="true">
              <i class="material-icons barbaraalvisi-contact-channel-icon">mail_outline</i>
            </span>
            <span class="barbaraalvisi-contact-channel-copy">
              <span class="barbaraalvisi-contact-channel-label">
                {if $language.iso_code == 'it'}E-mail{else}{l s='Email' d='Shop.Theme.Global'}{/if}
              </span>
              <span class="barbaraalvisi-contact-channel-text barbaraalvisi-contact-channel-text--email">{$contact_infos.email}</span>
            </span>
          </a>
          <p class="barbaraalvisi-contact-channel-hours">
            {if $language.iso_code == 'it'}Rispondiamo entro 24–48 ore lavorative.{else}{l s='We reply within 24–48 business hours.' d='Shop.Theme.Global'}{/if}
          </p>
        </li>
      {/if}

      <li class="barbaraalvisi-contact-channel">
        <a href="{$urls.pages.contact}" class="barbaraalvisi-contact-channel-link">
          <span class="barbaraalvisi-contact-channel-icon-wrap" aria-hidden="true">
            <i class="material-icons barbaraalvisi-contact-channel-icon">chat_bubble_outline</i>
          </span>
          <span class="barbaraalvisi-contact-channel-copy">
            <span class="barbaraalvisi-contact-channel-label">
              {if $language.iso_code == 'it'}Modulo contatti{else}{l s='Contact form' d='Shop.Theme.Global'}{/if}
            </span>
            <span class="barbaraalvisi-contact-channel-text">
              {if $language.iso_code == 'it'}Invia un messaggio{else}{l s='Send us a message' d='Shop.Theme.Global'}{/if}
            </span>
          </span>
        </a>
      </li>
    </ul>
  </section>

  <div class="barbaraalvisi-contact-assistance">
    <p class="barbaraalvisi-contact-assistance-title">
      {if $language.iso_code == 'it'}Hai bisogno di ulteriore assistenza?{else}{l s='Do you need further assistance?' d='Shop.Theme.Global'}{/if}
    </p>
    <a href="{$urls.pages.contact}" class="barbaraalvisi-contact-assistance-link">
      {if $language.iso_code == 'it'}Contattaci{else}{l s='Contact us' d='Shop.Theme.Global'}{/if}
    </a>
  </div>
</div>
