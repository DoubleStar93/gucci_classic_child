{**
 * Barbara Alvisi — overlay caricamento pagina (monogramma B)
 *}
<div id="barbaraalvisi-page-loader" class="barbaraalvisi-page-loader{if $page.page_name == 'checkout'} is-hidden{/if}" aria-live="polite" role="status">
  <div class="barbaraalvisi-page-loader__inner">
    <img
      class="barbaraalvisi-page-loader__mark"
      src="{$urls.base_url}themes/barbaraalvisi/assets/img/brand/charger.png"
      width="100"
      height="62"
      alt=""
      decoding="sync"
      fetchpriority="high"
    >
  </div>
</div>
