{**
 * Classic Gucci — breadcrumb minimale (nascosto su home, PDP, PLP, …)
 *}
{if $page.page_name != 'index' && $page.page_name != 'product' && $page.page_name != 'category' && $page.page_name != 'search' && $page.page_name != 'new-products' && $page.page_name != 'best-sales' && $page.page_name != 'prices-drop' && $page.page_name != 'manufacturer' && $page.page_name != 'manufacturers' && $page.page_name != 'cart' && $page.page_name != 'checkout' && $page.page_name != 'authentication' && $page.page_name != 'registration' && $page.page_name != 'order-confirmation' && $page.page_name != 'my-account' && $page.page_name != 'history' && $page.page_name != 'order-detail' && $page.page_name != 'identity' && $page.page_name != 'addresses' && $page.page_name != 'address' && $page.page_name != 'password' && $page.page_name != 'guest-tracking' && $page.page_name != 'order-slip' && $page.page_name != 'discount' && $page.page_name != 'order-follow' && $page.page_name != 'pagenotfound' && $page.page_name != 'stores'}
  <nav data-depth="{$breadcrumb.count}" class="breadcrumb gucci-breadcrumb" aria-label="{if $language.iso_code == 'it'}Percorso{else}{l s='Breadcrumb' d='Shop.Theme.Global'}{/if}">
    <ol>
      {foreach from=$breadcrumb.links item=path name=breadcrumb}
        {include file='_partials/gucci-it-label.tpl' gucciLabelIn=$path.title scope='parent'}
        <li>
          {if not $smarty.foreach.breadcrumb.last}
            <a href="{$path.url}"><span>{$gucciLabelOut|escape:'htmlall':'UTF-8'}</span></a>
          {else}
            <span>{$gucciLabelOut|escape:'htmlall':'UTF-8'}</span>
          {/if}
        </li>
      {/foreach}
    </ol>
  </nav>
{/if}
