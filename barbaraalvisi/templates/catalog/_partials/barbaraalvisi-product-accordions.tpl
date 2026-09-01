{**
 * Barbara Alvisi — accordion PDP stile luxury reference
 *}
<div class="barbaraalvisi-pdp-accordions">
  {if $product.grouped_features}
    <div class="barbaraalvisi-pdp-accordion">
      <button
        type="button"
        class="barbaraalvisi-pdp-accordion-trigger"
        aria-expanded="false"
        aria-controls="barbaraalvisi-pdp-panel-details"
        data-barbaraalvisi-accordion-trigger
      >
        {if $language.iso_code == 'it'}Dettagli prodotto{else}{l s='Product Details' d='Shop.Theme.Catalog'}{/if}
      </button>
      <div id="barbaraalvisi-pdp-panel-details" class="barbaraalvisi-pdp-accordion-panel" hidden>
        <div class="barbaraalvisi-pdp-accordion-content">
          <dl class="barbaraalvisi-pdp-data-sheet data-sheet">
            {foreach from=$product.grouped_features item=feature}
              <dt class="name">{$feature.name}</dt>
              <dd class="value">{$feature.value|escape:'htmlall'|nl2br nofilter}</dd>
            {/foreach}
          </dl>
        </div>
      </div>
    </div>
  {elseif $product.description_short}
    <div class="barbaraalvisi-pdp-accordion">
      <button
        type="button"
        class="barbaraalvisi-pdp-accordion-trigger"
        aria-expanded="false"
        aria-controls="barbaraalvisi-pdp-panel-details"
        data-barbaraalvisi-accordion-trigger
      >
        {if $language.iso_code == 'it'}Dettagli prodotto{else}{l s='Product Details' d='Shop.Theme.Catalog'}{/if}
      </button>
      <div id="barbaraalvisi-pdp-panel-details" class="barbaraalvisi-pdp-accordion-panel" hidden>
        <div class="barbaraalvisi-pdp-accordion-content product-description">{$product.description_short nofilter}</div>
      </div>
    </div>
  {/if}

  <div class="barbaraalvisi-pdp-accordion">
    <button
      type="button"
      class="barbaraalvisi-pdp-accordion-trigger"
      aria-expanded="false"
      aria-controls="barbaraalvisi-pdp-panel-care"
      data-barbaraalvisi-accordion-trigger
    >
      {if $language.iso_code == 'it'}Cura dei materiali{else}{l s='Material care' d='Shop.Theme.Catalog'}{/if}
    </button>
    <div id="barbaraalvisi-pdp-panel-care" class="barbaraalvisi-pdp-accordion-panel" hidden>
      <div class="barbaraalvisi-pdp-accordion-content">
        {if $language.iso_code == 'it'}
          <p>Per preservare la qualità del prodotto nel tempo, evitare il contatto con acqua, profumi, cosmetici e l&apos;esposizione prolungata a fonti di calore e luce diretta. Per evitare il danneggiamento delle fibre o dei tessuti seguire le istruzioni presenti nell&apos;etichetta del prodotto.</p>
        {else}
          <p>{l s='To preserve product quality over time, avoid contact with water, perfumes, cosmetics and prolonged exposure to heat and direct light. To avoid damaging fibres or fabrics, follow the instructions on the product label.' d='Shop.Theme.Catalog'}</p>
        {/if}
      </div>
    </div>
  </div>

  <div class="barbaraalvisi-pdp-accordion">
    <button
      type="button"
      class="barbaraalvisi-pdp-accordion-trigger"
      aria-expanded="false"
      aria-controls="barbaraalvisi-pdp-panel-commitment"
      data-barbaraalvisi-accordion-trigger
    >
      {if $language.iso_code == 'it'}Il nostro impegno{else}{l s='Our commitment' d='Shop.Theme.Global'}{/if}
    </button>
    <div id="barbaraalvisi-pdp-panel-commitment" class="barbaraalvisi-pdp-accordion-panel" hidden>
      <div class="barbaraalvisi-pdp-accordion-content">
        {if $language.iso_code == 'it'}
          <p>{$shop.name|escape:'htmlall':'UTF-8'} si impegna a promuovere pratiche responsabili lungo l&apos;intera filiera, con attenzione alla qualità artigianale, all&apos;innovazione e al rispetto delle persone e dell&apos;ambiente.</p>
        {else}
          <p>{$shop.name|escape:'htmlall':'UTF-8'} is committed to responsible practices across its supply chain, with a focus on craftsmanship, innovation, and respect for people and the environment.</p>
        {/if}
      </div>
    </div>
  </div>
</div>
