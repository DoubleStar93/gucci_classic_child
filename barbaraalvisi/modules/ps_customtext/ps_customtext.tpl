{**
 * Barbara Alvisi — blocco testo personalizzato (homepage, sotto hero)
 *}
{if isset($cms_infos.text) && $cms_infos.text|strip_tags|trim != ''}
  <section
    class="barbaraalvisi-home-customtext barbaraalvisi-home-section"
    id="custom-text"
    aria-label="{if isset($language) && $language.iso_code == 'it'}Testo{else}{l s='Custom text' d='Modules.Customtext.Shop'}{/if}"
  >
    <div class="barbaraalvisi-home-customtext__inner ps_customtext block_customtext">
      {$cms_infos.text nofilter}
    </div>
  </section>
{/if}
