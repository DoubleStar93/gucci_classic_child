{**
 * Barbara Alvisi — storico ordini
 *}
{extends file='customer/page.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}I miei ordini{else}{l s='Order history' d='Shop.Theme.Customeraccount'}{/if}
{/block}

{block name='page_content'}
  <div class="barbaraalvisi-orders-page barbaraalvisi-page-content">
    <p class="barbaraalvisi-orders-intro">
      {if $language.iso_code == 'it'}
        Ecco gli ordini effettuati dal tuo account.
      {else}
        {l s='Here are the orders you\'ve placed since your account was created.' d='Shop.Theme.Customeraccount'}
      {/if}
    </p>

    {if $orders}
      <div class="orders hidden-sm-down">
        <table class="table table-striped table-bordered table-labeled hidden-sm-down">
          <thead class="thead-default">
            <tr>
              <th>{if $language.iso_code == 'it'}Riferimento{else}{l s='Order reference' d='Shop.Theme.Checkout'}{/if}</th>
              <th>{if $language.iso_code == 'it'}Data{else}{l s='Date' d='Shop.Theme.Checkout'}{/if}</th>
              <th>{if $language.iso_code == 'it'}Totale{else}{l s='Total price' d='Shop.Theme.Checkout'}{/if}</th>
              <th>{if $language.iso_code == 'it'}Pagamento{else}{l s='Payment' d='Shop.Theme.Checkout'}{/if}</th>
              <th>{if $language.iso_code == 'it'}Stato{else}{l s='Status' d='Shop.Theme.Checkout'}{/if}</th>
              <th>{if $language.iso_code == 'it'}Fattura{else}{l s='Invoice' d='Shop.Theme.Checkout'}{/if}</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {foreach from=$orders item=order}
              <tr>
                <th scope="row">{$order.details.reference}</th>
                <td>{$order.details.order_date}</td>
                <td class="text-xs-right">{$order.totals.total.value}</td>
                <td>{$order.details.payment}</td>
                <td>
                  <span
                    class="label label-pill"
                    style="background-color:{$order.history.current.color}"
                  >
                    {$order.history.current.ostate_name}
                  </span>
                </td>
                <td class="text-xs-center">
                  {if $order.details.invoice_url}
                    <a href="{$order.details.invoice_url}"><i class="material-icons">&#xE415;</i></a>
                  {else}
                    -
                  {/if}
                </td>
                <td class="text-xs-center order-actions">
                  <a href="{$order.details.details_url}" data-link-action="view-order-details" class="barbaraalvisi-btn barbaraalvisi-btn--outline barbaraalvisi-btn--sm">
                    {if $language.iso_code == 'it'}Dettagli{else}{l s='Details' d='Shop.Theme.Customeraccount'}{/if}
                  </a>
                  {if $order.details.reorder_url}
                    <a href="{$order.details.reorder_url}" class="barbaraalvisi-btn barbaraalvisi-btn--outline barbaraalvisi-btn--sm">
                      {if $language.iso_code == 'it'}Riordina{else}{l s='Reorder' d='Shop.Theme.Actions'}{/if}
                    </a>
                  {/if}
                </td>
              </tr>
            {/foreach}
          </tbody>
        </table>
      </div>

      <div class="orders hidden-md-up">
        {foreach from=$orders item=order}
          <div class="order">
            <div class="row">
              <div class="col-xs-10">
                <a href="{$order.details.details_url}"><h3>{$order.details.reference}</h3></a>
                <div class="date">{$order.details.order_date}</div>
                <div class="total">{$order.totals.total.value}</div>
                <div class="status">
                  <span class="label label-pill" style="background-color:{$order.history.current.color}">
                    {$order.history.current.ostate_name}
                  </span>
                </div>
              </div>
              <div class="col-xs-2 text-xs-right">
                <div>
                  <a href="{$order.details.details_url}"><i class="material-icons">&#xE8B6;</i></a>
                </div>
                {if $order.details.reorder_url}
                  <div>
                    <a href="{$order.details.reorder_url}"><i class="material-icons">&#xE863;</i></a>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/foreach}
      </div>
    {else}
      <p class="barbaraalvisi-orders-empty">
        {if $language.iso_code == 'it'}Non hai ancora effettuato ordini.{else}{l s='You have not placed any orders.' d='Shop.Notifications.Warning'}{/if}
      </p>
    {/if}
  </div>
{/block}
