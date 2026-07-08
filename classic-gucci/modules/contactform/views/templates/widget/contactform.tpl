{**
 * Classic Gucci — form contatti minimal
 *}
<section class="contact-form gucci-contact-form">
  <form action="{$urls.pages.contact|escape:'htmlall':'UTF-8'}" method="post" {if $contact.allow_file_upload}enctype="multipart/form-data"{/if}>
    {if $notifications}
      <div class="alert {if $notifications.nw_error}alert-danger{else}alert-success{/if} gucci-contact-alert">
        <ul>
          {foreach $notifications.messages as $notif}
            <li>{$notif}</li>
          {/foreach}
        </ul>
      </div>
    {/if}

    {if !$notifications || $notifications.nw_error}
      <div class="form-fields gucci-contact-fields">
        {if $contact.contacts|count === 1}
          {assign var=firstContact value=current($contact.contacts)}
          <input type="hidden" name="id_contact" value="{$firstContact.id_contact|escape:'htmlall':'UTF-8'}">
        {else}
          <div class="form-group gucci-form-group">
            <label class="form-control-label" for="id_contact">
              {if $language.iso_code == 'it'}Oggetto{else}{l s='Subject' d='Shop.Forms.Labels'}{/if}
            </label>
            <select name="id_contact" id="id_contact" class="form-control form-control-select">
              {foreach from=$contact.contacts item=contact_elt}
                <option value="{$contact_elt.id_contact|escape:'htmlall':'UTF-8'}">{$contact_elt.name|escape:'htmlall':'UTF-8'}</option>
              {/foreach}
            </select>
          </div>
        {/if}

        <div class="form-group gucci-form-group">
          <label class="form-control-label" for="email">
            {if $language.iso_code == 'it'}Indirizzo e-mail{else}{l s='Email address' d='Shop.Forms.Labels'}{/if}
          </label>
          <input
            id="email"
            class="form-control"
            name="from"
            type="email"
            value="{$contact.email|escape:'htmlall':'UTF-8'}"
            placeholder="{if $language.iso_code == 'it'}nome@esempio.it{else}{l s='your@email.com' d='Shop.Forms.Help'}{/if}"
            required
          >
        </div>

        {if $contact.orders}
          <div class="form-group gucci-form-group">
            <label class="form-control-label" for="id-order">
              {if $language.iso_code == 'it'}Riferimento ordine{else}{l s='Order reference' d='Shop.Forms.Labels'}{/if}
              <span class="gucci-form-optional">{if $language.iso_code == 'it'}(facoltativo){else}{l s='optional' d='Shop.Forms.Help'}{/if}</span>
            </label>
            <select id="id-order" name="id_order" class="form-control form-control-select">
              <option value="">{if $language.iso_code == 'it'}Seleziona riferimento{else}{l s='Select reference' d='Shop.Forms.Help'}{/if}</option>
              {foreach from=$contact.orders item=order}
                <option value="{$order.id_order|intval}">{$order.reference|escape:'htmlall':'UTF-8'}</option>
              {/foreach}
            </select>
          </div>
        {/if}

        {if $contact.allow_file_upload}
          <div class="form-group gucci-form-group gucci-form-group--file">
            <label class="form-control-label" for="file-upload">
              {if $language.iso_code == 'it'}Allegato{else}{l s='Attachment' d='Shop.Forms.Labels'}{/if}
              <span class="gucci-form-optional">{if $language.iso_code == 'it'}(facoltativo){else}{l s='optional' d='Shop.Forms.Help'}{/if}</span>
            </label>
            <div class="gucci-file-upload">
              <input id="file-upload" type="file" name="fileUpload" class="form-control gucci-file-upload__input">
              <button type="button" class="gucci-file-upload__trigger" data-gucci-file-trigger>
                {if $language.iso_code == 'it'}Scegli file{else}{l s='Choose file' d='Shop.Theme.Actions'}{/if}
              </button>
              <span class="gucci-file-upload__name" data-gucci-file-name aria-live="polite">
                {if $language.iso_code == 'it'}Nessun file selezionato{else}{l s='No file selected' d='Shop.Theme.Global'}{/if}
              </span>
            </div>
          </div>
        {/if}

        <div class="form-group gucci-form-group">
          <label class="form-control-label" for="contactform-message">
            {if $language.iso_code == 'it'}Messaggio{else}{l s='Message' d='Shop.Forms.Labels'}{/if}
          </label>
          <textarea
            id="contactform-message"
            class="form-control"
            name="message"
            placeholder="{if $language.iso_code == 'it'}Come possiamo aiutarti?{else}{l s='How can we help?' d='Shop.Forms.Help'}{/if}"
            rows="5"
            required
          >{if $contact.message}{$contact.message|escape:'htmlall':'UTF-8'}{/if}</textarea>
        </div>

        {if isset($id_module)}
          <div class="form-group gucci-form-group gucci-form-group--gdpr">
            {hook h='displayGDPRConsent' id_module=$id_module}
          </div>
        {/if}
      </div>

      <footer class="form-footer gucci-contact-footer">
        <input type="text" name="url" value="" tabindex="-1" autocomplete="off" aria-hidden="true" class="gucci-honeypot">
        <input type="hidden" name="token" value="{$token|escape:'htmlall':'UTF-8'}">
        <button class="btn btn-primary gucci-btn gucci-btn--primary" type="submit" name="submitMessage">
          {if $language.iso_code == 'it'}Invia messaggio{else}{l s='Send' d='Shop.Theme.Actions'}{/if}
        </button>
      </footer>
    {/if}
  </form>
</section>
