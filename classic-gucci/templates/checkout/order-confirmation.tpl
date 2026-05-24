{**
 * Classic Gucci — conferma ordine
 *}
{extends file='parent:checkout/order-confirmation.tpl'}

{block name='page_content_container' prepend}
  <section class="gucci-order-confirmation-intro">
    {block name='order_confirmation_header'}
      <h1 class="gucci-order-confirmation-title">
        {if $language.iso_code == 'it'}
          Il tuo ordine è confermato
        {else}
          {l s='Your order is confirmed' d='Shop.Theme.Checkout'}
        {/if}
      </h1>
    {/block}

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
  </section>

  {block name='hook_order_confirmation'}
    {$HOOK_ORDER_CONFIRMATION nofilter}
  {/block}
{/block}

{block name='page_content'}
  <div class="gucci-order-confirmation gucci-order-confirmation-inner">
    {block name='order_confirmation_table'}
      {include
        file='checkout/_partials/order-confirmation-table.tpl'
        products=$order.products
        subtotals=$order.subtotals
        totals=$order.totals
        labels=$order.labels
        add_product_link=false
      }
    {/block}

    {block name='order_details'}
      <section id="order-details" class="gucci-order-confirmation-details">
        <h2 class="gucci-order-confirmation-details-title">
          {if $language.iso_code == 'it'}Dettagli ordine{else}{l s='Order details' d='Shop.Theme.Checkout'}{/if}
        </h2>
        <ul class="gucci-order-confirmation-details-list">
          <li>
            {if $language.iso_code == 'it'}
              Riferimento: {$order.details.reference}
            {else}
              {l s='Order reference: %reference%' d='Shop.Theme.Checkout' sprintf=['%reference%' => $order.details.reference]}
            {/if}
          </li>
          <li>
            {if $language.iso_code == 'it'}
              Pagamento: {$order.details.payment}
            {else}
              {l s='Payment method: %method%' d='Shop.Theme.Checkout' sprintf=['%method%' => $order.details.payment]}
            {/if}
          </li>
          {if !$order.details.is_virtual}
            <li>
              {if $language.iso_code == 'it'}
                Spedizione: {$order.carrier.name}
              {else}
                {l s='Shipping method: %method%' d='Shop.Theme.Checkout' sprintf=['%method%' => $order.carrier.name]}
              {/if}
              {if $order.carrier.delay}
                <span class="gucci-order-confirmation-delay">{$order.carrier.delay}</span>
              {/if}
            </li>
          {/if}
        </ul>
      </section>
    {/block}

    {block name='hook_payment_return'}
      {if !empty($HOOK_PAYMENT_RETURN)}
        <section id="hook-payment-return" class="gucci-order-confirmation-payment-return">
          {$HOOK_PAYMENT_RETURN nofilter}
        </section>
      {/if}
    {/block}

    {block name='account_transformation_form'}{/block}

    {block name='hook_order_confirmation_1'}
      {hook h='displayOrderConfirmation1'}
    {/block}

    {block name='hook_order_confirmation_2'}
      <section id="content-hook_order_confirmation_2" class="gucci-order-confirmation-extra">
        {hook h='displayOrderConfirmation2'}
      </section>
    {/block}

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
{/block}
