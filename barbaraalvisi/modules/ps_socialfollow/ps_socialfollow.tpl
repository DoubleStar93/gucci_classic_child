{**
 * Barbara Alvisi — social footer minimal
 *}
{if $social_links}
  <div class="barbaraalvisi-footer-social block-social ps-social-follow">
    <span class="barbaraalvisi-footer-meta-label">
      {if $language.iso_code == 'it'}Seguici{else}{l s='Follow us' d='Modules.Socialfollow.Shop'}{/if}
    </span>
    <ul class="barbaraalvisi-footer-social-list">
      {foreach from=$social_links item=social_link}
        <li>
          <a
            href="{$social_link.url}"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="{$social_link.label}"
            class="barbaraalvisi-footer-social-link"
          >
            {$social_link.label}
          </a>
        </li>
      {/foreach}
    </ul>
  </div>
{/if}
