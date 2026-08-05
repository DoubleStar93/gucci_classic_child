{**
 * Barbara Alvisi — step checkout (titoli IT)
 *}
{assign var='barbaraalvisiStepTitle' value=$title}
{if isset($language) && $language.iso_code == 'it'}
  {if $title == 'Personal Information'}{assign var='barbaraalvisiStepTitle' value='Informazioni personali'}{/if}
  {if $title == 'Addresses'}{assign var='barbaraalvisiStepTitle' value='Indirizzi'}{/if}
  {if $title == 'Shipping Method'}{assign var='barbaraalvisiStepTitle' value='Spedizione'}{/if}
  {if $title == 'Payment'}{assign var='barbaraalvisiStepTitle' value='Pagamento'}{/if}
{/if}

<section
  id="{$identifier}"
  class="{[
    'checkout-step' => true,
    '-current' => $step_is_current,
    '-reachable' => $step_is_reachable,
    '-complete' => $step_is_complete,
    'js-current-step' => $step_is_current
  ]|classnames}"
>
  <h1 class="step-title js-step-title h3 barbaraalvisi-checkout-step-title">
    <span class="barbaraalvisi-checkout-step-title__main">
      <i class="material-icons rtl-no-flip done" aria-hidden="true">&#xE876;</i>
      <span class="step-number">{$position}</span>
      {$barbaraalvisiStepTitle|escape:'htmlall':'UTF-8'}
    </span>
    <span class="step-edit text-muted">
      <i class="material-icons edit" aria-hidden="true">mode_edit</i>
      {if isset($language) && $language.iso_code == 'it'}Modifica{else}{l s='Edit' d='Shop.Theme.Actions'}{/if}
    </span>
  </h1>

  <div class="content">
    {block name='step_content'}DUMMY STEP CONTENT{/block}
  </div>
</section>
