# Griglia prodotti Gucci (come homepage)

## Pattern unico

| File | Ruolo |
|------|--------|
| `templates/catalog/_partials/productlist.tpl` | Markup griglia: `products gucci-plp-grid` + miniature; `maxProducts=8` opzionale |
| `templates/catalog/_partials/products.tpl` | Listing PLP → include `productlist.tpl` (senza limite) |
| `templates/catalog/_partials/products-bottom.tpl` | Vuoto (griglia solo in `products.tpl`; evita duplicati PLP) |
| `templates/_partials/gucci-home-products-section.tpl` | Home «Selezione» |
| `templates/_partials/gucci-product-grid-section.tpl` | Sezioni con titolo (PDP correlati) |
| `templates/_partials/gucci-featured-products-strip.tpl` | Hook + widget fallback (carrello, 404, modal) |
| `modules/ps_categoryproducts/.../ps_categoryproducts.tpl` | PDP «Della stessa categoria» |
| `modules/ps_crossselling/.../ps_crossselling.tpl` | PDP cross-selling (se modulo attivo) |
| `modules/ps_viewedproduct/.../ps_viewedproduct.tpl` | PDP prodotti visti (se modulo attivo) |
| `assets/css/custom.css` | Griglia full-bleed, 1→2→4 col, `:has()` per pochi prodotti |
| `assets/js/custom.js` | `upgradeGucciProductGrids()` + listing AJAX + PDP footer |

## Pagine coperte

- Home, categorie, ricerca, nuovi, offerte, best seller, marca, fornitore  
  (home BO: solo `ps_featuredproducts` in `theme.yml`; altri moduli home usano la stessa griglia se li aggiungi in Posizioni)
- Scheda prodotto (correlati BO, categoria, cross-selling, visti di recente)
- Carrello, conferma ordine, 404, modal add-to-cart

## Dopo deploy tema

1. Back office → **Design → Tema e logo** → riattiva **Classic Gucci Style**
2. **Parametri avanzati → Prestazioni** → Svuota cache
3. Verifica in incognito (`custom.css?v=…` in `head.tpl`)

## Hook in `theme.yml`

`ps_featuredproducts` su: `displayHome`, `displayCrossSellingShoppingCart`, `displayOrderConfirmation2`, `displayCartModalFooter`, `displayNotFound`.  
`ps_categoryproducts` su: `displayFooterProduct` (in `theme.yml`). Altri moduli sullo stesso hook usano lo stesso partial se hanno override nel child.

**PDP footer:** in `gucci-pdp-footer-grids` restano visibili solo `.gucci-product-grid-section` (recensioni e hook legacy nascosti via CSS).

## Verifica rapida (staging)

| URL | Atteso |
|-----|--------|
| `/` | 1 griglia, 8 prodotti, `gucci-plp-grid` |
| `?controller=category&id_category=4` | 1 griglia, `#js-product-list` presente |
| `?controller=search&s=…` | 1 griglia (no duplicati da v1.8.0) |
| `?controller=cart` | Strip «Selezione» sotto carrello |
| `?id_product=20&controller=product` | Correlati + categoria (max 8 ciascuna sezione) |

Cache: `custom.css?v=1.8.0` in `head.tpl`.
