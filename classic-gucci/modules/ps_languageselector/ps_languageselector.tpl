{**
 * Classic Gucci — selettore lingua footer (stile gucci.com)
 *}
{if $languages|count > 1}
  <div class="gucci-footer-locale language-selector" id="_desktop_language_selector">
    <span class="gucci-footer-meta-label">
      {if $language.iso_code == 'it'}Lingua{else}{l s='Language' d='Shop.Theme.Global'}{/if}
    </span>
    <ul class="gucci-footer-locale-list">
      {foreach from=$languages item=lang}
        <li>
          <a
            href="{$lang.url}"
            class="gucci-footer-locale-link{if $lang.id_lang == $current_language.id_lang} is-active{/if}"
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
