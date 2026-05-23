{**
 * Classic Gucci — link footer in accordion stile gucci.com
 *}
{foreach $linkBlocks as $linkBlock}
  <div class="col-12 gucci-footer-col gucci-footer-accordion">
    <button
      type="button"
      class="gucci-footer-accordion-trigger"
      aria-expanded="false"
      aria-controls="gucci-footer-panel-{$linkBlock.id}"
      data-gucci-accordion-trigger
    >
      {$linkBlock.title}
    </button>
    <div id="gucci-footer-panel-{$linkBlock.id}" class="gucci-footer-accordion-panel" hidden>
      <ul class="gucci-footer-links">
        {foreach $linkBlock.links as $link}
          <li>
            <a
              id="{$link.id}-{$linkBlock.id}"
              class="{$link.class}"
              href="{$link.url}"
              title="{$link.description}"
              {if !empty($link.target)} target="{$link.target}" {/if}
            >
              {$link.title}
            </a>
          </li>
        {/foreach}
      </ul>
    </div>
  </div>
{/foreach}
