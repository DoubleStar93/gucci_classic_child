{**
 * Barbara Alvisi — selettore lingua footer (stile luxury reference)
 *}
{if $languages|count > 1}
  <div
    class="barbaraalvisi-footer-locale language-selector"
    id="_footer_language_selector"
    aria-label="{if $language.iso_code == 'it'}Lingua{else}{l s='Language' d='Shop.Theme.Global'}{/if}"
  >
    <ul class="barbaraalvisi-footer-locale-list">
      {foreach from=$languages item=lang}
        <li>
          <a
            href="{url entity='language' id=$lang.id_lang}"
            class="barbaraalvisi-footer-locale-link{if $lang.id_lang == $current_language.id_lang} is-active{/if}"
            hreflang="{$lang.iso_code}"
            lang="{$lang.iso_code}"
          >
            {$lang.name_simple}
          </a>
        </li>
      {/foreach}
    </ul>
  </div>
{/if}
