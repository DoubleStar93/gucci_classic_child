{**
 * Classic Gucci — una colonna per blocco link (4–5 colonne affiancate)
 *}
{foreach $linkBlocks as $linkBlock}
  <div class="col-lg-2 col-md-3 col-sm-6 gucci-footer-col links">
    <div class="wrapper gucci-footer-block">
      <p class="gucci-footer-col-title hidden-sm-down">{$linkBlock.title}</p>
      <div class="title clearfix hidden-md-up" data-target="#footer_sub_menu_{$linkBlock.id}" data-toggle="collapse">
        <span class="gucci-footer-col-title">{$linkBlock.title}</span>
        <span class="float-xs-right">
          <span class="navbar-toggler collapse-icons">
            <i class="material-icons add">&#xE313;</i>
            <i class="material-icons remove">&#xE316;</i>
          </span>
        </span>
      </div>
      <ul id="footer_sub_menu_{$linkBlock.id}" class="collapse show">
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
