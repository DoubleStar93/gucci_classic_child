{**
 * Seconda fascia home in scorrimento, al posto del titolo «Prodotti in vetrina».
 *}
{if $language.iso_code == 'it'}
  {assign var='barbaraalvisiMadeLabel' value='Scopri la qualità del vero Made in Italy'}
  {assign var='barbaraalvisiMadeLead' value='Scopri la qualità del vero '}
  {assign var='barbaraalvisiMadeEmphasis' value='Made in Italy'}
{else}
  {assign var='barbaraalvisiMadeLabel' value='Discover the quality of true Made in Italy'}
  {assign var='barbaraalvisiMadeLead' value='Discover the quality of true '}
  {assign var='barbaraalvisiMadeEmphasis' value='Made in Italy'}
{/if}

<h2 class="barbaraalvisi-home-madeinitaly-marquee" aria-label="{$barbaraalvisiMadeLabel|escape:'htmlall':'UTF-8'}">
  <span class="barbaraalvisi-home-madeinitaly-marquee__track">
    {section name=barbaraalvisiMadeGroup loop=2}
      <span class="barbaraalvisi-home-madeinitaly-marquee__group"{if $smarty.section.barbaraalvisiMadeGroup.index != 0} aria-hidden="true"{/if}>
        {section name=barbaraalvisiMadeCopy loop=4}
          <span class="barbaraalvisi-home-madeinitaly-marquee__item"{if $smarty.section.barbaraalvisiMadeGroup.index != 0 || $smarty.section.barbaraalvisiMadeCopy.index != 0} aria-hidden="true"{/if}>
            <span class="barbaraalvisi-home-madeinitaly-marquee__lead">{$barbaraalvisiMadeLead|escape:'htmlall':'UTF-8'}<em class="barbaraalvisi-home-madeinitaly-marquee__emphasis">{$barbaraalvisiMadeEmphasis|escape:'htmlall':'UTF-8'}</em>&nbsp;-&nbsp;</span>
          </span>
        {/section}
      </span>
    {/section}
  </span>
</h2>
