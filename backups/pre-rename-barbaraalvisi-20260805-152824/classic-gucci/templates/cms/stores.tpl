{**
 * Classic Gucci — negozi
 *}
{extends file='parent:cms/stores.tpl'}

{block name='page_title'}
  {if $language.iso_code == 'it'}Negozi{else}{l s='Our stores' d='Shop.Theme.Global'}{/if}
{/block}

{block name='page_content_container'}
  <section id="content" class="page-content page-stores gucci-stores-page gucci-page-content">
    {if $stores|@count == 0}
      <p class="gucci-stores-empty">
        {if $language.iso_code == 'it'}
          Al momento non ci sono negozi fisici da mostrare. Per assistenza, visita la pagina Contatti.
        {else}
          {l s='No stores are available at this time.' d='Shop.Theme.Global'}
        {/if}
      </p>
    {/if}

    {foreach $stores as $store}
      <article id="store-{$store.id|intval}" class="store-item gucci-store-card">
        <div class="gucci-store-card-inner">
          {if $store.image}
            <div class="gucci-store-image hidden-sm-down">
              <picture>
                {if !empty($store.image.bySize.stores_default.sources.avif)}<source srcset="{$store.image.bySize.stores_default.sources.avif}" type="image/avif">{/if}
                {if !empty($store.image.bySize.stores_default.sources.webp)}<source srcset="{$store.image.bySize.stores_default.sources.webp}" type="image/webp">{/if}
                <img
                  src="{$store.image.bySize.stores_default.url}"
                  alt="{if !empty($store.image.legend)}{$store.image.legend|escape:'quotes'}{else}{$store.name|escape:'quotes'}{/if}"
                  loading="lazy"
                >
              </picture>
            </div>
          {/if}

          <div class="gucci-store-details">
            <h2 class="gucci-store-name">{$store.name|escape:'htmlall':'UTF-8'}</h2>
            <address class="gucci-store-address">{$store.address.formatted nofilter}</address>

            {if $store.note || $store.phone || $store.fax || $store.email}
              <button
                type="button"
                class="gucci-store-toggle btn-unstyle"
                data-toggle="collapse"
                data-target="#about-{$store.id|intval}"
                aria-expanded="false"
                aria-controls="about-{$store.id|intval}"
              >
                {if $language.iso_code == 'it'}Info e contatti{else}{l s='About and Contact' d='Shop.Theme.Global'}{/if}
                <i class="material-icons" aria-hidden="true">expand_more</i>
              </button>
            {/if}

            {if $store.business_hours}
              <div class="gucci-store-hours">
                <p class="gucci-store-hours-title">
                  {if $language.iso_code == 'it'}Orari{else}{l s='Opening hours' d='Shop.Theme.Global'}{/if}
                </p>
                <table class="gucci-store-hours-table">
                  {foreach $store.business_hours as $day}
                    <tr>
                      <th>{$day.day|escape:'htmlall':'UTF-8'}</th>
                      <td>
                        <ul>
                          {foreach $day.hours as $h}
                            <li>{$h|escape:'htmlall':'UTF-8'}</li>
                          {/foreach}
                        </ul>
                      </td>
                    </tr>
                  {/foreach}
                </table>
              </div>
            {/if}
          </div>
        </div>

        {if $store.note || $store.phone || $store.fax || $store.email}
          <footer id="about-{$store.id|intval}" class="gucci-store-footer collapse">
            {if $store.note}
              <p class="gucci-store-note">{$store.note|escape:'htmlall':'UTF-8'}</p>
            {/if}
            <ul class="gucci-store-contacts">
              {if $store.phone}
                <li><i class="material-icons" aria-hidden="true">phone</i>{$store.phone|escape:'htmlall':'UTF-8'}</li>
              {/if}
              {if $store.fax}
                <li><i class="material-icons" aria-hidden="true">print</i>{$store.fax|escape:'htmlall':'UTF-8'}</li>
              {/if}
              {if $store.email}
                <li>
                  <i class="material-icons" aria-hidden="true">email</i>
                  <a href="mailto:{$store.email|escape:'url'}">{$store.email|escape:'htmlall':'UTF-8'}</a>
                </li>
              {/if}
            </ul>
          </footer>
        {/if}
      </article>
    {/foreach}
  </section>
{/block}
