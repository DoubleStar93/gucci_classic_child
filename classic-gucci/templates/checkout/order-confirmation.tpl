{**
 * Classic Gucci — conferma ordine (extends page.tpl, evita prepend Classic)
 *}
{extends file='page.tpl'}

{block name='page_header_container'}{/block}

{block name='page_content_container'}
  <div class="gucci-order-confirmation-page">
    <section class="gucci-order-confirmation-intro">
      <p class="gucci-order-confirmation-eyebrow" aria-hidden="true">
        {if $language.iso_code == 'it'}Grazie{else}{l s='Thank you' d='Shop.Theme.Checkout'}{/if}
      </p>
      <h1 class="gucci-order-confirmation-title">
        {if $language.iso_code == 'it'}
          Il tuo ordine è confermato
        {else}
          {l s='Your order is confirmed' d='Shop.Theme.Checkout'}
        {/if}
      </h1>
      <p class="gucci-order-confirmation-lead">
        {if $language.iso_code == 'it'}
          Ti abbiamo inviato un'email a <strong>{$order_customer.email|escape:'html':'UTF-8'}</strong>.
        {else}
          {l s='An email has been sent to your mail address %email%.' d='Shop.Theme.Checkout' sprintf=['%email%' => $order_customer.email]}
        {/if}
      </p>
      {if $order.details.invoice_url}
        <p class="gucci-order-confirmation-invoice">
          {if $language.iso_code == 'it'}
            Puoi anche <a href="{$order.details.invoice_url|escape:'html':'UTF-8'}">scaricare la fattura</a>.
          {else}
            {l
              s='You can also [1]download your invoice[/1]'
              d='Shop.Theme.Checkout'
              sprintf=[
                '[1]' => '<a href="'|cat:$order.details.invoice_url|cat:'">',
                '[/1]' => '</a>'
              ]
            }
          {/if}
        </p>
      {/if}
      {if $HOOK_ORDER_CONFIRMATION}
        <div class="gucci-order-confirmation-hook">
          {$HOOK_ORDER_CONFIRMATION nofilter}
        </div>
      {/if}
    </section>

    <div class="gucci-order-confirmation gucci-order-confirmation-inner">
      {if isset($is_multishipment_enabled) && $is_multishipment_enabled}
        {include
          file='checkout/_partials/order-confirmation-table-multishipment.tpl'
          products=$order.order_shipments
          subtotals=$order.subtotals
          totals=$order.totals
          labels=$order.labels
          add_product_link=false
        }
      {else}
        {include
          file='checkout/_partials/order-confirmation-table.tpl'
          products=$order.products
          subtotals=$order.subtotals
          totals=$order.totals
          labels=$order.labels
          add_product_link=false
        }
      {/if}

      <section id="order-details" class="gucci-order-confirmation-details">
        <h2 class="gucci-order-confirmation-details-title">
          {if $language.iso_code == 'it'}Dettagli ordine{else}{l s='Order details' d='Shop.Theme.Checkout'}{/if}
        </h2>
        <dl class="gucci-order-confirmation-details-grid">
          <div class="gucci-order-confirmation-details-row">
            <dt>{if $language.iso_code == 'it'}Riferimento{else}{l s='Order reference' d='Shop.Theme.Checkout'}{/if}</dt>
            <dd>{$order.details.reference}</dd>
          </div>
          <div class="gucci-order-confirmation-details-row">
            <dt>{if $language.iso_code == 'it'}Pagamento{else}{l s='Payment method' d='Shop.Theme.Checkout'}{/if}</dt>
            <dd>{$order.details.payment}</dd>
          </div>
          {if !$order.details.is_virtual && !($is_multishipment_enabled|default:false)}
            <div class="gucci-order-confirmation-details-row">
              <dt>{if $language.iso_code == 'it'}Spedizione{else}{l s='Shipping method' d='Shop.Theme.Checkout'}{/if}</dt>
              <dd>
                {$order.carrier.name}
                {if $order.carrier.delay}
                  <span class="gucci-order-confirmation-delay">{$order.carrier.delay}</span>
                {/if}
              </dd>
            </div>
          {/if}
        </dl>
      </section>

      {if !empty($HOOK_PAYMENT_RETURN)}
        <section id="hook-payment-return" class="gucci-order-confirmation-payment-return">
          <h2 class="gucci-order-confirmation-section-title">
            {if $language.iso_code == 'it'}Istruzioni di pagamento{else}{l s='Payment instructions' d='Shop.Theme.Checkout'}{/if}
          </h2>
          <div class="gucci-order-confirmation-payment-return__body">
            {$HOOK_PAYMENT_RETURN nofilter}
          </div>
        </section>
      {/if}

      <section id="content-hook_order_confirmation_2" class="gucci-order-confirmation-extra">
        {if $language.iso_code == 'it'}
          {assign var='gucciOrderSelectionTitle' value='Selezione'}
        {else}
          {assign var='gucciOrderSelectionTitle' value='Popular products'}
        {/if}
        {include
          file='_partials/gucci-featured-products-strip.tpl'
          wrapperClass='gucci-order-confirmation-products'
          hookName='displayOrderConfirmation2'
          widgetHook='displayOrderConfirmation2'
          sectionTitle=$gucciOrderSelectionTitle
        }
      </section>

      <div class="gucci-order-confirmation-actions">
        <a href="{$urls.pages.index}" class="gucci-btn gucci-btn--primary">
          {if $language.iso_code == 'it'}Continua lo shopping{else}{l s='Continue shopping' d='Shop.Theme.Actions'}{/if}
        </a>
        {if isset($customer) && $customer.is_logged}
          <a href="{$urls.pages.history}" class="gucci-btn gucci-btn--outline">
            {if $language.iso_code == 'it'}I miei ordini{else}{l s='Order history' d='Shop.Theme.Customeraccount'}{/if}
          </a>
        {/if}
      </div>
    </div>
  </div>
{/block}
