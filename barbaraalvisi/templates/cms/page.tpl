{**
 * Barbara Alvisi — pagine CMS (contenuto da back office PrestaShop)
 *}
{extends file='parent:cms/page.tpl'}

{block name='page_content_container'}
  <section id="content" class="page-content page-cms page-cms-{$cms.id|intval} barbaraalvisi-cms-page">
    <div class="barbaraalvisi-cms-page-inner">
      {block name='cms_content'}
        {$cms.content nofilter}
      {/block}

      {block name='hook_cms_dispute_information'}
        {hook h='displayCMSDisputeInformation'}
      {/block}

      {block name='hook_cms_print_button'}
        {hook h='displayCMSPrintButton'}
      {/block}
    </div>
  </section>
  {literal}
  <script>
    (function () {
      var images = document.querySelectorAll('.barbaraalvisi-cms-page-inner img[width][height]');
      images.forEach(function (img) {
        if (img.closest('.barbaraalvisi-cms-img')) {
          return;
        }
        var width = parseFloat(img.getAttribute('width'));
        var height = parseFloat(img.getAttribute('height'));
        if (!width || !height) {
          return;
        }
        var frame = document.createElement('span');
        frame.className = 'barbaraalvisi-cms-img';
        frame.style.width = width + 'px';
        frame.style.aspectRatio = width + ' / ' + height;
        img.parentNode.insertBefore(frame, img);
        frame.appendChild(img);
      });
    }());
  </script>
  {/literal}
{/block}
