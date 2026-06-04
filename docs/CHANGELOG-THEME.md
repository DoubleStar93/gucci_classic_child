# Changelog tema Classic Gucci

## v1.8.0 (maggio 2026)

- Fix PLP/ricerca: griglia duplicata (products-bottom non deve ripetere productlist)
- `products.tpl`: wrapper `#js-product-list` + paginazione per AJAX listing

## v1.7.9 (maggio 2026)

- Home: una sola griglia «Selezione» (nasconde novità/offerte se agganciati in BO)
- Moduli home extra: non renderizzano su `index` (griglia Gucci altrove se usati)

## v1.7.8 (maggio 2026)

- CSS griglia anche su `.products` legacy (hook/widget) prima del JS
- Moduli `ps_newproducts` / `ps_bestsellers` / `ps_specials`: se attivi in BO → griglia Gucci
- JS: debounce `MutationObserver` griglia prodotti

## v1.7.7 (maggio 2026)

- `productlist.tpl`: parametro `maxProducts` (8 in home/sezioni; PLP senza limite)
- AJAX listing: `products-bottom.tpl` → stessa griglia homepage
- Override `productcomments`: footer PDP e stelle in griglia disattivati

## v1.7.6 (maggio 2026)

- PDP footer: nascosti hook non-griglia (es. recensioni tra le sezioni prodotti)
- `ps_categoryproducts`: max 8 prodotti come homepage
- JS: `MutationObserver` su `#wrapper` per liste dinamiche

## v1.7.5 (maggio 2026)

- PDP: contenitore `gucci-pdp-product-grids` (correlati + hook footer)
- Override `ps_crossselling` e `ps_viewedproduct` → `gucci-product-grid-section`
- CSS/JS: griglia su `#product`, `.featured-products` legacy, observer footer PDP

## v1.7.4 (maggio 2026)

- **Fallback globale** JS: tutte le `.products.row` nel catalogo → `gucci-plp-grid` (esclusi carrello/checkout)
- **CSS**: griglia anche su `.products.row` legacy; fix regole Classic che spaziavano le miniature fuori griglia
- **Doc** `docs/GUCCI-PRODUCT-GRID.md` — riferimento pattern unico

## v1.7.3 (maggio 2026)

- **Partial** `gucci-featured-products-strip.tpl`: hook + widget fallback (Selezione ovunque)
- **Carrello, conferma ordine, 404, modal add-to-cart**: stessa griglia homepage
- **Listing fornitore** (`supplier.tpl`) + CSS layout full-bleed
- **JS**: `MutationObserver` su `#products` + evento `updatedProductList`

## v1.7.2 (maggio 2026)

- **Liste prodotti ovunque**: CSS su `#products .products`, carrello, conferma ordine, cross-selling (anche senza classe `gucci-plp-grid`)
- **JS** `upgradeGucciProductGrids`: normalizza `.products.row` legacy + re-run su `updateProductList` (filtri AJAX)
- **Carrello / conferma ordine**: fallback widget `ps_featuredproducts` (hook `displayHome` / `displayOrderConfirmation2`) se l’hook è vuoto

## v1.7.1 (maggio 2026)

- **Carrello + conferma ordine**: cross-selling / Selezione con stessa griglia homepage (`displayCrossSellingShoppingCart`, `displayOrderConfirmation2`)
- **Partial** `gucci-product-grid-section.tpl` per sezioni prodotto riutilizzabili (PDP correlati, hook carrello)
- CSS miniature/griglia consolidato su `.gucci-plp-grid` (tutte le pagine)

## v1.7.0 (maggio 2026)

- **Griglia prodotti globale** `.gucci-plp-grid`: stessa logica homepage su categorie, ricerca, offerte, nuovi, best seller, marca, correlati PDP
- **Template unificato**: tutti i listing usano `productlist.tpl` via `products.tpl`
- **Miniature**: titolo `h3` ovunque; immagini `cover` anche in home (niente `contain` sulla griglia)
- **Pochi prodotti**: regole `:has()` globali (1→1 col, 2→2 col, 3→3 col)

## v1.6.9 (maggio 2026)

- **Fix correlati PDP / categorie piccole**: regole `:has()` con stessa specificità della griglia 4 col (2 correlati = 2 colonne su desktop, non 4 con metà riga vuota)

## v1.6.8 (maggio 2026)

- **PDP correlati**: griglia full-bleed come home/PLP; 2 correlati = 2 colonne (non 4 con spazio vuoto)
- Adattamento colonne se pochi prodotti (1–3) in griglia

## v1.6.6 (maggio 2026)

- **Griglia prodotti responsive**: 1 col (&lt;576px), 2 col (576–991px), 4 col (≥992px) — home, PLP, correlati PDP
- **PLP categoria**: stessa griglia full-bleed; un solo prodotto = quadrato a tutta larghezza
- Fix immagini quadrate (`aspect-ratio` + `object-fit` cover) su listing
- Layout `layout-left-column` su categoria: content al 100%

## v1.6.5 (maggio 2026)

- **Griglia prodotti unificata** ovunque (home, PLP, ricerca, offerte, PDP correlati): quadrati full-bleed, zero gap
- **Mobile**: 1 prodotto per riga; tablet 3 col; desktop 4 col (home Selezione 4 col da tablet)
- **PDP**: «Potrebbe piacerti anche» con stessa griglia in fondo pagina

## v1.6.3 (maggio 2026)

- **Home Selezione**: griglia 2× mobile / 4× desktop, celle quadrate `aspect-ratio 1:1`, zero gap, full-bleed (niente padding laterale sezione)

## v1.6.2 (maggio 2026)

- Fix: `scope='parent'` su tutti gli include `gucci-it-label.tpl` (titoli PLP/SEO/menu)

## v1.6.1 (maggio 2026)

- Fix PLP/SEO: rimosso `|lower` Smarty (non consentito) da `gucci-it-label.tpl`

## v1.6.0 (maggio 2026)

- **Home**: ordine moduli hero → Esplora → Selezione → banner (flex `order`)
- **Home**: placeholder gradient se lo slider BO è vuoto
- **PLP**: titoli categoria/listing IT (`gucci-it-label`, maiuscole BO)
- **PLP**: ordinamento IT in `sort-orders.tpl`
- **SEO**: tab Home, categoria, Cerca, Nuovi, Offerte
- Cartella `assets/img/home/` per `cat-3/6/9.jpg`

## v1.5.9 (maggio 2026)

- **Checkout**: titoli step IT (Informazioni personali, Indirizzi, Spedizione, Pagamento) via `checkout-step.tpl`
- **Cassa**: label riepilogo, testi indirizzo in JS; stile step title serif
- **SEO title**: Carrello, Cassa, Conferma ordine (`head.tpl`)
- **Contatti**: blocco `contact-rich` duplicato nascosto
- Carrello: conteggio «N articolo/articoli» con spaziatura corretta

## v1.5.8 (maggio 2026)

- Override **contactform**: form IT, layout minimal, intro
- **Contatti**: `page_content` corretto, header, breadcrumb visibile
- **Negozi**: card editoriali, label IT (Orari, Info e contatti)
- Doc: `docs/CHECKLIST-STAGING.md`

## v1.5.7 (maggio 2026)

- **Title tag** IT per CMS, sitemap, contatti, negozi (`head.tpl`)
- **Sitemap**: link annidati tradotti (Delivery → Spedizioni, …)
- Etichette IT estese in `gucci-it-label.tpl`

## v1.5.6 (maggio 2026)

- **Breadcrumb** visibile su pagine CMS (IT via `gucci-it-label`)
- CMS demo IT: Spedizioni, Note legali, Termini, Chi siamo, Pagamento (fino a traduzione BO)
- **Mappa del sito**: titoli sezioni IT + griglia editoriale
- Contatti: fallback label form IT in JS

## v1.5.5 (maggio 2026)

- Partial condiviso `gucci-it-label.tpl` per breadcrumb e menu drawer
- Menu: voci IT (Abbigliamento, Accessori, …), aria **Sottocategorie**
- Breadcrumb IT su pagine CMS/account; stile uppercase minimale
- Home Esplora: placeholder gradient se mancano `cat-*.jpg`
- Doc: `docs/IMMAGINI-HOME.md`

## v1.5.4 (maggio 2026)

- PLP: paginazione IT (**Precedente/Successivo**, conteggio articoli)
- Toolbar mobile: «X–Y di Z articoli»
- PDP: **Quantità** IT; miniature aria **Prezzo**
- Filtri: più valori IT (colori, categorie)
- Doc BO: `docs/BO-LINGUA-ITALIANA.md`

## v1.5.3 (maggio 2026)

- Carrello: icona **Rimuovi** (close), attributi IT (Taglia/Colore/Bianco/Nero)
- PDP: etichette varianti IT, **Servizi** (non “Gucci”), aria galleria
- Home slider: aria **Immagini homepage**

## v1.5.2 (maggio 2026)

- Checkout/carrello: **Cassa**, promo IT, mostra dettagli, label JS carrello
- Header drawer: aria-label **Chiudi** (contatti/account)
- Ricerca widget + newsletter: placeholder/aria IT
- Pagina errore **410**

## v1.5.1 (maggio 2026)

- Header IT: aria-label **Carrello**, **Accedi**, **Il mio account**
- PDP: pulsante **Contattaci**, accordion impegno con nome negozio (`{$shop.name}`)
- Pagina **restricted-country** in italiano
- Drawer contatti: link assistenza IT

## v1.5.0

- Pagina **Marchi** + listing per marca
- Filtri PLP: traduzioni estese (Carta opaca, Tipo carta, …)
- Audit doc aggiornato

## v1.4.9

- PLP Nuovi / Più venduti / Offerte (titoli IT)
- Negozi, 404/403/manutenzione
- Breadcrumb ridotto

## v1.4.8

- Conferma ordine (CTA, tabella IT)
- Storico ordini IT
- 404 con ricerca integrata
- Tracciamento ospite

## v1.4.7

- Account completo (password, indirizzi, guest)
- Ricerca titolo «Risultati per …»

## v1.4.6 e precedenti

Vedi commit git e `SITE-AUDIT-STAGING.md`.
