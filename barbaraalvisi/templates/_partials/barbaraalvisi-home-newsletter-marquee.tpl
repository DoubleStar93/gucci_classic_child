{**
 * Fascia home in scorrimento — testo fisso, non gestito dal pannello.
 * Il click riapre il popup newsletter già in pagina (everpspopup).
 *}
{if $language.iso_code == 'it'}
  {assign var='barbaraalvisiMarqueeLabel' value='Iscriviti alla Newsletter - ricevi uno sconto del 10% sul primo acquisto'}
  {assign var='barbaraalvisiMarqueeLead' value='Iscriviti alla Newsletter'}
  {assign var='barbaraalvisiMarqueeRest' value=' - ricevi uno sconto del 10% '}
  {assign var='barbaraalvisiMarqueeEmphasis' value='sul primo acquisto'}
{else}
  {assign var='barbaraalvisiMarqueeLabel' value='Subscribe to the Newsletter - get 10% off your first purchase'}
  {assign var='barbaraalvisiMarqueeLead' value='Subscribe to the Newsletter'}
  {assign var='barbaraalvisiMarqueeRest' value=' - get 10% off '}
  {assign var='barbaraalvisiMarqueeEmphasis' value='your first purchase'}
{/if}

<button
  type="button"
  class="barbaraalvisi-home-newsletter-marquee"
  data-barbaraalvisi-open-newsletter
  aria-label="{$barbaraalvisiMarqueeLabel|escape:'htmlall':'UTF-8'}"
>
  <span class="barbaraalvisi-home-newsletter-marquee__track">
    {section name=barbaraalvisiMarqueeGroup loop=2}
      <span class="barbaraalvisi-home-newsletter-marquee__group"{if $smarty.section.barbaraalvisiMarqueeGroup.index != 0} aria-hidden="true"{/if}>
        {section name=barbaraalvisiMarqueeCopy loop=4}
          <span class="barbaraalvisi-home-newsletter-marquee__item"{if $smarty.section.barbaraalvisiMarqueeGroup.index != 0 || $smarty.section.barbaraalvisiMarqueeCopy.index != 0} aria-hidden="true"{/if}>
            <strong class="barbaraalvisi-home-newsletter-marquee__lead">{$barbaraalvisiMarqueeLead|escape:'htmlall':'UTF-8'}</strong><span class="barbaraalvisi-home-newsletter-marquee__rest">{$barbaraalvisiMarqueeRest|escape:'htmlall':'UTF-8'}<em class="barbaraalvisi-home-newsletter-marquee__emphasis">{$barbaraalvisiMarqueeEmphasis|escape:'htmlall':'UTF-8'}</em></span>
          </span>
        {/section}
      </span>
    {/section}
  </span>
</button>
