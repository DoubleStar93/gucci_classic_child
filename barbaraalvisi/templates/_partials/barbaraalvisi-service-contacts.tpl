{**
 * Servizio clienti — email e telefono (footer e pagina Contattaci)
 *}
{assign var='barbaraalvisiServiceEmail' value='servizioclienti@barbaraalvisi.it'}
{assign var='barbaraalvisiServicePhone' value='352 276 6033'}
{assign var='barbaraalvisiServicePhoneTel' value='+393522766033'}
<nav class="barbaraalvisi-service-contacts{if isset($barbaraalvisiServiceContactsMod) && $barbaraalvisiServiceContactsMod} barbaraalvisi-service-contacts--{$barbaraalvisiServiceContactsMod|escape:'htmlall':'UTF-8'}{/if}" aria-label="{if $language.iso_code == 'it'}Servizio clienti{else}{l s='Customer care' d='Shop.Theme.Global'}{/if}">
  <a class="barbaraalvisi-service-contacts__link" href="mailto:{$barbaraalvisiServiceEmail|escape:'htmlall':'UTF-8'}">{$barbaraalvisiServiceEmail|escape:'htmlall':'UTF-8'}</a>
  <a class="barbaraalvisi-service-contacts__link" href="tel:{$barbaraalvisiServicePhoneTel|escape:'htmlall':'UTF-8'}">{$barbaraalvisiServicePhone|escape:'htmlall':'UTF-8'}</a>
</nav>
