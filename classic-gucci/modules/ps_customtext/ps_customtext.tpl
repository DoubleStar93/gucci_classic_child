{**
 * Classic Gucci — blocco testo editoriale (nascosto in CSS di default)
 *}
{if $cms_infos.text}
  <section class="gucci-home-editorial" id="custom-text">
    <div class="gucci-home-editorial__inner">
      {$cms_infos.text nofilter}
    </div>
  </section>
{/if}
