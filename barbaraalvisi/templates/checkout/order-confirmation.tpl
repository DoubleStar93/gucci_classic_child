{**
 * Barbara Alvisi — conferma ordine (extends page.tpl, evita prepend Classic)
 *}
{extends file='page.tpl'}

{block name='page_header_container'}{/block}

{block name='page_content_container'}
  <div class="barbaraalvisi-order-confirmation-page">
    <section class="barbaraalvisi-order-confirmation-intro">
      <p class="barbaraalvisi-order-confirmation-eyebrow" aria-hidden="true">
        {if $language.iso_code == 'it'}Grazie{else}{l s='Thank you' d='Shop.Theme.Checkout'}{/if}
      </p>
      <h1 class="barbaraalvisi-order-confirmation-title">
        {if $language.iso_code == 'it'}
          Il tuo ordine è confermato
        {else}
          {l s='Your order is confirmed' d='Shop.Theme.Checkout'}
        {/if}
      </h1>
      <p class="barbaraalvisi-order-confirmation-lead">
        {if $language.iso_code == 'it'}
          Ti abbiamo inviato un'email a <strong>{$order_customer.email|escape:'html':'UTF-8'}</strong>.
        {else}
          {l s='An email has been sent to your mail address %email%.' d='Shop.Theme.Checkout' sprintf=['%email%' => $order_customer.email]}
        {/if}
      </p>
      {if $order.details.invoice_url}
        <p class="barbaraalvisi-order-confirmation-invoice">
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
        <div class="barbaraalvisi-order-confirmation-hook">
          {$HOOK_ORDER_CONFIRMATION nofilter}
        </div>
      {/if}
    </section>

    <div class="barbaraalvisi-order-confirmation barbaraalvisi-order-confirmation-inner">
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

      <section id="order-details" class="barbaraalvisi-order-confirmation-details">
        <h2 class="barbaraalvisi-order-confirmation-details-title">
          {if $language.iso_code == 'it'}Dettagli ordine{else}{l s='Order details' d='Shop.Theme.Checkout'}{/if}
        </h2>
        <dl class="barbaraalvisi-order-confirmation-details-grid">
          <div class="barbaraalvisi-order-confirmation-details-row">
            <dt>{if $language.iso_code == 'it'}Riferimento{else}{l s='Order reference' d='Shop.Theme.Checkout'}{/if}</dt>
            <dd>{$order.details.reference}</dd>
          </div>
          <div class="barbaraalvisi-order-confirmation-details-row">
            <dt>{if $language.iso_code == 'it'}Pagamento{else}{l s='Payment method' d='Shop.Theme.Checkout'}{/if}</dt>
            <dd>{$order.details.payment}</dd>
          </div>
          {if !$order.details.is_virtual && !($is_multishipment_enabled|default:false)}
            <div class="barbaraalvisi-order-confirmation-details-row">
              <dt>{if $language.iso_code == 'it'}Spedizione{else}{l s='Shipping method' d='Shop.Theme.Checkout'}{/if}</dt>
              <dd>
                {$order.carrier.name}
                {if $order.carrier.delay}
                  <span class="barbaraalvisi-order-confirmation-delay">{$order.carrier.delay}</span>
                {/if}
              </dd>
            </div>
          {/if}
        </dl>
      </section>

      {if !empty($HOOK_PAYMENT_RETURN)}
        <section id="hook-payment-return" class="barbaraalvisi-order-confirmation-payment-return">
          <h2 class="barbaraalvisi-order-confirmation-section-title">
            {if $language.iso_code == 'it'}Istruzioni di pagamento{else}{l s='Payment instructions' d='Shop.Theme.Checkout'}{/if}
          </h2>
          <div class="barbaraalvisi-order-confirmation-payment-return__body">
            {$HOOK_PAYMENT_RETURN nofilter}
          </div>
        </section>
      {/if}

      <section id="content-hook_order_confirmation_2" class="barbaraalvisi-order-confirmation-extra">
        {if $language.iso_code == 'it'}
          {assign var='barbaraalvisiOrderSelectionTitle' value='Selezione'}
        {else}
          {assign var='barbaraalvisiOrderSelectionTitle' value='Popular products'}
        {/if}
        {include
          file='_partials/barbaraalvisi-featured-products-strip.tpl'
          wrapperClass='barbaraalvisi-order-confirmation-products'
          hookName='displayOrderConfirmation2'
          widgetHook='displayOrderConfirmation2'
          sectionTitle=$barbaraalvisiOrderSelectionTitle
        }
      </section>

      <div class="barbaraalvisi-order-confirmation-actions">
        <a href="{$urls.pages.index}" class="barbaraalvisi-btn barbaraalvisi-btn--primary">
          {if $language.iso_code == 'it'}Continua lo shopping{else}{l s='Continue shopping' d='Shop.Theme.Actions'}{/if}
        </a>
        {if isset($customer) && $customer.is_logged}
          <a href="{$urls.pages.history}" class="barbaraalvisi-btn barbaraalvisi-btn--outline">
            {if $language.iso_code == 'it'}I miei ordini{else}{l s='Order history' d='Shop.Theme.Customeraccount'}{/if}
          </a>
        {/if}
      </div>
    </div>
  </div>
{/block}
