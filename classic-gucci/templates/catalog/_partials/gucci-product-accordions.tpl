{**
 * Classic Gucci — accordion PDP stile gucci.com
 *}
<div class="gucci-pdp-accordions">
  {if $product.grouped_features}
    <div class="gucci-pdp-accordion">
      <button
        type="button"
        class="gucci-pdp-accordion-trigger"
        aria-expanded="false"
        aria-controls="gucci-pdp-panel-details"
        data-gucci-accordion-trigger
      >
        {if $language.iso_code == 'it'}Dettagli prodotto{else}{l s='Product Details' d='Shop.Theme.Catalog'}{/if}
      </button>
      <div id="gucci-pdp-panel-details" class="gucci-pdp-accordion-panel" hidden>
        <div class="gucci-pdp-accordion-content">
          <dl class="gucci-pdp-data-sheet data-sheet">
            {foreach from=$product.grouped_features item=feature}
              <dt class="name">{$feature.name}</dt>
              <dd class="value">{$feature.value|escape:'htmlall'|nl2br nofilter}</dd>
            {/foreach}
          </dl>
        </div>
      </div>
    </div>
  {elseif $product.description_short}
    <div class="gucci-pdp-accordion">
      <button
        type="button"
        class="gucci-pdp-accordion-trigger"
        aria-expanded="false"
        aria-controls="gucci-pdp-panel-details"
        data-gucci-accordion-trigger
      >
        {if $language.iso_code == 'it'}Dettagli prodotto{else}{l s='Product Details' d='Shop.Theme.Catalog'}{/if}
      </button>
      <div id="gucci-pdp-panel-details" class="gucci-pdp-accordion-panel" hidden>
        <div class="gucci-pdp-accordion-content product-description">{$product.description_short nofilter}</div>
      </div>
    </div>
  {/if}

  <div class="gucci-pdp-accordion">
    <button
      type="button"
      class="gucci-pdp-accordion-trigger"
      aria-expanded="false"
      aria-controls="gucci-pdp-panel-care"
      data-gucci-accordion-trigger
    >
      {if $language.iso_code == 'it'}Cura dei materiali{else}{l s='Material care' d='Shop.Theme.Catalog'}{/if}
    </button>
    <div id="gucci-pdp-panel-care" class="gucci-pdp-accordion-panel" hidden>
      <div class="gucci-pdp-accordion-content">
        {if $language.iso_code == 'it'}
          <p>Per preservare la qualità del prodotto nel tempo, evitare il contatto con acqua, profumi, cosmetici e l&apos;esposizione prolungata a fonti di calore e luce diretta. Conservare in un luogo asciutto, preferibilmente nella sua confezione originale.</p>
        {else}
          <p>{l s='To preserve product quality over time, avoid contact with water, perfumes, cosmetics and prolonged exposure to heat and direct light. Store in a dry place, preferably in its original packaging.' d='Shop.Theme.Catalog'}</p>
        {/if}
      </div>
    </div>
  </div>

  <div class="gucci-pdp-accordion">
    <button
      type="button"
      class="gucci-pdp-accordion-trigger"
      aria-expanded="false"
      aria-controls="gucci-pdp-panel-commitment"
      data-gucci-accordion-trigger
    >
      {if $language.iso_code == 'it'}Il Nostro Impegno{else}{l s='Our commitment' d='Shop.Theme.Global'}{/if}
    </button>
    <div id="gucci-pdp-panel-commitment" class="gucci-pdp-accordion-panel" hidden>
      <div class="gucci-pdp-accordion-content">
        {if $language.iso_code == 'it'}
          <p>Gucci si impegna a promuovere pratiche responsabili lungo l&apos;intera filiera, con attenzione alla qualità artigianale, all&apos;innovazione e al rispetto delle persone e dell&apos;ambiente.</p>
        {else}
          <p>{l s='Gucci is committed to responsible practices across its supply chain, with a focus on craftsmanship, innovation, and respect for people and the environment.' d='Shop.Theme.Global'}</p>
        {/if}
      </div>
    </div>
  </div>
</div>
