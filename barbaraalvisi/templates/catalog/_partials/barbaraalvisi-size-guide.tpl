{**
 * Barbara Alvisi — guida taglie in scheda prodotto (IT / EN)
 *}
<button
  type="button"
  class="barbaraalvisi-size-guide-open btn-unstyle"
  data-barbaraalvisi-size-guide-open
  aria-controls="barbaraalvisi-size-guide"
  aria-expanded="false"
>
  {if $language.iso_code == 'it'}Guida alle taglie{else}Size guide{/if}
</button>

<div
  id="barbaraalvisi-size-guide"
  class="barbaraalvisi-size-guide"
  hidden
  aria-hidden="true"
>
  <div class="barbaraalvisi-size-guide__backdrop" data-barbaraalvisi-size-guide-close></div>
  <div
    class="barbaraalvisi-size-guide__panel"
    role="dialog"
    aria-modal="true"
    aria-labelledby="barbaraalvisi-size-guide-title"
  >
    <header class="barbaraalvisi-size-guide__header">
      <h2 id="barbaraalvisi-size-guide-title" class="barbaraalvisi-size-guide__title">
        {if $language.iso_code == 'it'}Guida alle taglie{else}Size guide{/if}
      </h2>
      {include file='_partials/barbaraalvisi-panel-close.tpl' closeAttr='data-barbaraalvisi-size-guide-close'}
    </header>

    <div class="barbaraalvisi-size-guide__body">
      {if $language.iso_code == 'it'}
        <p>Per individuare la taglia più adatta, misura il tuo corpo seguendo le indicazioni riportate nell’immagine e confronta i valori con la nostra tabella.</p>
        <p>Oltre alle misure, è importante considerare anche la vestibilità del singolo capo. Ogni prodotto riporta nella propria pagina la vestibilità del modello: <strong>Over, Regular o Slim fit</strong>. Questo ti aiuterà a capire come il capo è pensato per essere indossato e a scegliere la taglia più adatta a te.</p>
        <p class="barbaraalvisi-size-guide__download-row">
          <a class="barbaraalvisi-size-guide__download" href="{$urls.base_url}themes/barbaraalvisi/assets/pdf/guida-taglie.pdf" download="Guida_taglie_Barbara_Alvisi.pdf">Scarica la guida (PDF)</a>
        </p>

        <section class="barbaraalvisi-size-guide__section">
          <h3>Abbigliamento</h3>
          <p class="barbaraalvisi-size-guide__note">La tabella si applica alle categorie abiti, camicie e bluse, capispalla, completi e spezzati, denimwear, gonne e pantaloni e leggings.</p>
          <div class="barbaraalvisi-size-guide__table-wrap">
            <table class="barbaraalvisi-size-guide__table">
              <thead>
                <tr>
                  <th scope="col">Taglia</th>
                  <th scope="col">IT</th>
                  <th scope="col">Busto (cm/in)</th>
                  <th scope="col">Vita (cm/in)</th>
                  <th scope="col">Fianchi (cm/in)</th>
                </tr>
              </thead>
              <tbody>
                <tr><th scope="row">XXS</th><td>38</td><td>82-84 / 32.3-33.1</td><td>63-65 / 24.8-25.6</td><td>89-90 / 35.0-35.4</td></tr>
                <tr><th scope="row">XS</th><td>40</td><td>85-87 / 33.5-34.3</td><td>66-68 / 26.0-26.8</td><td>91-93 / 35.8-36.6</td></tr>
                <tr><th scope="row">S</th><td>42</td><td>88-91 / 34.6-35.8</td><td>69-72 / 27.2-28.3</td><td>94-97 / 37.0-38.2</td></tr>
                <tr><th scope="row">M</th><td>44</td><td>92-95 / 36.2-37.4</td><td>73-76 / 28.7-29.9</td><td>98-101 / 38.6-39.8</td></tr>
                <tr><th scope="row">L</th><td>46</td><td>96-99 / 37.8-39.0</td><td>77-80 / 30.3-31.5</td><td>102-105 / 40.2-41.3</td></tr>
                <tr><th scope="row">XL</th><td>48</td><td>100-103 / 39.4-40.6</td><td>81-84 / 31.9-33.1</td><td>106-110 / 41.7-43.3</td></tr>
                <tr><th scope="row">XXL</th><td>50</td><td>104-107 / 40.9-42.1</td><td>85-88 / 33.5-34.6</td><td>111-114 / 43.7-44.9</td></tr>
                <tr><th scope="row">XXXL</th><td>52</td><td>108-111 / 42.5-43.7</td><td>89-94 / 35.0-37.0</td><td>115-120 / 45.3-47.2</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="barbaraalvisi-size-guide__section">
          <h3>Maglieria</h3>
          <p class="barbaraalvisi-size-guide__note">La tabella si applica alle categorie maglieria e basicwear.</p>
          <div class="barbaraalvisi-size-guide__table-wrap">
            <table class="barbaraalvisi-size-guide__table">
              <thead>
                <tr>
                  <th scope="col">Taglia</th>
                  <th scope="col">IT</th>
                  <th scope="col">Busto (cm/in)</th>
                  <th scope="col">Vita (cm/in)</th>
                  <th scope="col">Fianchi (cm/in)</th>
                </tr>
              </thead>
              <tbody>
                <tr><th scope="row">S/M</th><td>38-42</td><td>82-91 / 32.3-35.8</td><td>63-72 / 24.8-28.3</td><td>89-97 / 35.0-38.2</td></tr>
                <tr><th scope="row">M/L</th><td>44-46</td><td>92-99 / 36.2-39.0</td><td>73-80 / 28.7-31.5</td><td>98-105 / 38.6-41.3</td></tr>
                <tr><th scope="row">L/XL</th><td>48-52</td><td>100-111 / 39.4-43.7</td><td>81-94 / 31.9-37.0</td><td>106-120 / 41.7-47.2</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="barbaraalvisi-size-guide__section">
          <h3>Conversione internazionale</h3>
          <div class="barbaraalvisi-size-guide__table-wrap">
            <table class="barbaraalvisi-size-guide__table">
              <thead>
                <tr>
                  <th scope="col">Taglia</th>
                  <th scope="col">IT</th>
                  <th scope="col">EU</th>
                  <th scope="col">UK</th>
                  <th scope="col">US</th>
                </tr>
              </thead>
              <tbody>
                <tr><th scope="row">XXS</th><td>38</td><td>34</td><td>6</td><td>2</td></tr>
                <tr><th scope="row">XS</th><td>40</td><td>36</td><td>8</td><td>4</td></tr>
                <tr><th scope="row">S</th><td>42</td><td>38</td><td>10</td><td>6</td></tr>
                <tr><th scope="row">M</th><td>44</td><td>40</td><td>12</td><td>8</td></tr>
                <tr><th scope="row">L</th><td>46</td><td>42</td><td>14</td><td>10</td></tr>
                <tr><th scope="row">XL</th><td>48</td><td>44</td><td>16</td><td>12</td></tr>
                <tr><th scope="row">XXL</th><td>50</td><td>46</td><td>18</td><td>14</td></tr>
                <tr><th scope="row">XXXL</th><td>52</td><td>48</td><td>20</td><td>16</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="barbaraalvisi-size-guide__section">
          <h3>Guida alla misurazione</h3>
          <img
            class="barbaraalvisi-size-guide__figure"
            src="{$urls.base_url}themes/barbaraalvisi/assets/img/size-guide/measure-it.png"
            alt="Figura con le linee di misura di busto, vita e fianchi"
            width="775"
            height="914"
          >
        </section>
      {else}
        <p>To find your most suitable size, take your body measurements by following the instructions shown in the image, then compare your measurements with our size chart.</p>
        <p>In addition to your measurements, it is important to consider the fit of each individual garment. The fit of every product is specified on its product page: <strong>Oversized, Regular or Slim fit</strong>. This will help you understand how the garment is designed to fit and choose the size that is right for you.</p>
        <p class="barbaraalvisi-size-guide__download-row">
          <a class="barbaraalvisi-size-guide__download" href="{$urls.base_url}themes/barbaraalvisi/assets/pdf/size-guide.pdf" download="Size_guide_Barbara_Alvisi.pdf">Download the guide (PDF)</a>
        </p>

        <section class="barbaraalvisi-size-guide__section">
          <h3>Clothing</h3>
          <p class="barbaraalvisi-size-guide__note">This size chart applies to the following categories: dresses, shirts &amp; blouses, outerwear, suits &amp; separates, denim, skirts and trousers &amp; leggings.</p>
          <div class="barbaraalvisi-size-guide__table-wrap">
            <table class="barbaraalvisi-size-guide__table">
              <thead>
                <tr>
                  <th scope="col">Size</th>
                  <th scope="col">EU</th>
                  <th scope="col">Bust (cm/in)</th>
                  <th scope="col">Waist (cm/in)</th>
                  <th scope="col">Hips (cm/in)</th>
                </tr>
              </thead>
              <tbody>
                <tr><th scope="row">XXS</th><td>34</td><td>82-84 / 32.3-33.1</td><td>63-65 / 24.8-25.6</td><td>89-90 / 35.0-35.4</td></tr>
                <tr><th scope="row">XS</th><td>36</td><td>85-87 / 33.5-34.3</td><td>66-68 / 26.0-26.8</td><td>91-93 / 35.8-36.6</td></tr>
                <tr><th scope="row">S</th><td>38</td><td>88-91 / 34.6-35.8</td><td>69-72 / 27.2-28.3</td><td>94-97 / 37.0-38.2</td></tr>
                <tr><th scope="row">M</th><td>40</td><td>92-95 / 36.2-37.4</td><td>73-76 / 28.7-29.9</td><td>98-101 / 38.6-39.8</td></tr>
                <tr><th scope="row">L</th><td>42</td><td>96-99 / 37.8-39.0</td><td>77-80 / 30.3-31.5</td><td>102-105 / 40.2-41.3</td></tr>
                <tr><th scope="row">XL</th><td>44</td><td>100-103 / 39.4-40.6</td><td>81-84 / 31.9-33.1</td><td>106-110 / 41.7-43.3</td></tr>
                <tr><th scope="row">XXL</th><td>46</td><td>104-107 / 40.9-42.1</td><td>85-88 / 33.5-34.6</td><td>111-114 / 43.7-44.9</td></tr>
                <tr><th scope="row">XXXL</th><td>48</td><td>108-111 / 42.5-43.7</td><td>89-94 / 35.0-37.0</td><td>115-120 / 45.3-47.2</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="barbaraalvisi-size-guide__section">
          <h3>Knitwear</h3>
          <p class="barbaraalvisi-size-guide__note">This size chart applies to the following categories: knitwear and basics.</p>
          <div class="barbaraalvisi-size-guide__table-wrap">
            <table class="barbaraalvisi-size-guide__table">
              <thead>
                <tr>
                  <th scope="col">Size</th>
                  <th scope="col">EU</th>
                  <th scope="col">Bust (cm/in)</th>
                  <th scope="col">Waist (cm/in)</th>
                  <th scope="col">Hips (cm/in)</th>
                </tr>
              </thead>
              <tbody>
                <tr><th scope="row">S/M</th><td>34-38</td><td>82-91 / 32.3-35.8</td><td>63-72 / 24.8-28.3</td><td>89-97 / 35.0-38.2</td></tr>
                <tr><th scope="row">M/L</th><td>40-42</td><td>92-99 / 36.2-39.0</td><td>73-80 / 28.7-31.5</td><td>98-105 / 38.6-41.3</td></tr>
                <tr><th scope="row">L/XL</th><td>44-48</td><td>100-111 / 39.4-43.7</td><td>81-94 / 31.9-37.0</td><td>106-120 / 41.7-47.2</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="barbaraalvisi-size-guide__section">
          <h3>International size conversion</h3>
          <div class="barbaraalvisi-size-guide__table-wrap">
            <table class="barbaraalvisi-size-guide__table">
              <thead>
                <tr>
                  <th scope="col">Size</th>
                  <th scope="col">EU</th>
                  <th scope="col">IT</th>
                  <th scope="col">UK</th>
                  <th scope="col">US</th>
                </tr>
              </thead>
              <tbody>
                <tr><th scope="row">XXS</th><td>34</td><td>38</td><td>6</td><td>2</td></tr>
                <tr><th scope="row">XS</th><td>36</td><td>40</td><td>8</td><td>4</td></tr>
                <tr><th scope="row">S</th><td>38</td><td>42</td><td>10</td><td>6</td></tr>
                <tr><th scope="row">M</th><td>40</td><td>44</td><td>12</td><td>8</td></tr>
                <tr><th scope="row">L</th><td>42</td><td>46</td><td>14</td><td>10</td></tr>
                <tr><th scope="row">XL</th><td>44</td><td>48</td><td>16</td><td>12</td></tr>
                <tr><th scope="row">XXL</th><td>46</td><td>50</td><td>18</td><td>14</td></tr>
                <tr><th scope="row">XXXL</th><td>48</td><td>52</td><td>20</td><td>16</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="barbaraalvisi-size-guide__section">
          <h3>How to measure</h3>
          <img
            class="barbaraalvisi-size-guide__figure"
            src="{$urls.base_url}themes/barbaraalvisi/assets/img/size-guide/measure-en.png"
            alt="Figure showing bust, waist and hips measurement lines"
            width="772"
            height="912"
          >
        </section>
      {/if}
    </div>
  </div>
</div>
