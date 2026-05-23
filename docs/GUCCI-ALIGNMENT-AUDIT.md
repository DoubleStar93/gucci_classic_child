# Audit di allineamento — Staging vs Gucci.com

**Benchmark:** [gucci.com/it/it](https://www.gucci.com/it/it/)  
**Staging:** [chocolate-ferret-940937.hostingersite.com](https://chocolate-ferret-940937.hostingersite.com/)  
**Tema child:** `classic-gucci` (padre `classic`)  
**Data audit:** maggio 2026

Documento operativo: confronto **per area**, gap precisi, **TODO per fase** con file da toccare e criteri di accettazione.  
Complementare a `GUCCI-DESIGN-REFERENCE.md` (linee guida) e screenshot in `docs/reference-screenshots/`.

---

## 1. Metodologia

| Fonte | Uso |
|-------|-----|
| gucci.com (desktop + mobile) | Comportamento, tipografia, spaziature, gerarchia |
| Screenshot locali `gucci-*.png`, `staging-*.png` | Confronto visivo ripetibile |
| Codice `classic-gucci/` | Stato reale implementato (non solo staging cache) |
| `config/theme.yml` + BO | Hook moduli, layout pagine |

**Legenda stato**

| Simbolo | Significato |
|---------|-------------|
| ✅ | Allineato o accettabile |
| 🟡 | Parziale — funziona ma diverso da Gucci |
| ❌ | Mancante o Classic ancora visibile |
| 🔧 BO | Dipende da back office (logo, menu, moduli) |

---

## 2. Confronto sintetico per pagina

### 2.1 Header globale

| Aspetto | Gucci.com | Staging (codice + tipico deploy) | Gap |
|---------|-----------|----------------------------------|-----|
| Posizione | Fixed, trasparente su hero/PDP poi bianco | Fixed + scroll ✅ (PDP) | 🟡 Home/PLP: bianco da subito (ok) |
| Logo | Sinistra, monocromatico, piccolo | Sinistra in codice ✅ | 🔧 logo monocromatico BO |
| Navigazione | Solo hamburger (destra) | Hamburger ✅ | ✅ |
| Link testo in barra | Nessuno | Rimosso “Contattaci” da barra ✅ | ✅ |
| Icone | Carrello → Account → Cerca → Menu | Ordine CSS ok, icone ✅ | 🟡 Verificare testo residuo moduli |
| Menu drawer | Destra, ~480px, voci 15px, no righe | Destra ✅, stile aggiornato | 🟡 “Ricerca negozio” / telefono in fondo |
| Contatti drawer | — | Sinistra ✅ | Scelta progetto (ok) |

### 2.2 Homepage

| Aspetto | Gucci.com | Staging | Gap |
|---------|-----------|---------|-----|
| Hero | Full-bleed video/immagine + copy bianco + CTA outline | Slider Classic **nascosto** CSS; resta `ps_banner` | 🟡 Non è hero editoriale Gucci |
| Sezioni | Blocchi editoriali + griglia 2 col categorie | `featured-products` + titoli nascosti | ❌ Layout editoriale |
| Moduli rumorosi | Assenti | Molti nascosti CSS (`special`, `new`, `customtext`) | 🟡 BO ancora attivi |
| Card prodotto | Bianco, minimal | Miniature override ✅ | ✅ |
| Newsletter | Footer, non in mezzo home | Home newsletter nascosta | ✅ |

### 2.3 PLP (categoria / ricerca)

| Aspetto | Gucci.com | Staging | Gap |
|---------|-----------|---------|-----|
| Layout | Full width, molto aria | `layout-full-width` ✅ | ✅ |
| Titolo categoria | Sans, sobrio | `.gucci-plp-title` 15px ✅ | ✅ |
| Griglia | 2–3 col, whitespace | `col-6 col-lg-4`, gap 3.5–4rem ✅ | ✅ |
| Card | Nome + prezzo grigio, no badge | Override ✅ | ✅ |
| Filtri | Drawer/pannello sobrio | Drawer + backdrop + Escape ✅ | ✅ |
| Sidebar Classic | No | Colonne nascoste ✅ | ✅ |

### 2.4 PDP (scheda prodotto)

| Aspetto | Gucci.com (pattern 2025) | Staging (scelta attuale) | Gap |
|---------|--------------------------|---------------------------|-----|
| Galleria | Scroll verticale immagini grandi; header overlay | **100svh** per slide, full width ✅ | ✅ mobile-first |
| Desktop buybox | Spesso colonna destra sticky (ref. gossip) | **Sotto** galleria (richiesta cliente) | 🟡 Diverso da ref. desktop Gucci |
| Titolo | Serif, uppercase, ~22–28px | Playfair clamp ✅ | ✅ |
| Prezzo | Unico, nero, no sconto | `.gucci-price-current`, flag nascosti ✅ | ✅ |
| CTA | “AGGIUNGI AL CARRELLO” nero full width | Nero + label IT in tpl ✅ | ✅ |
| Tab Classic | No | Nascosti ✅ | ✅ |
| Accordions | Sì, minimal | `gucci-product-accordions` ✅ | ✅ |
| Reassurance | No | Nascosto ✅ | ✅ |

### 2.5 Footer

| Aspetto | Gucci.com | Staging | Gap |
|---------|-----------|---------|-----|
| Sfondo | Nero | Nero ✅ | ✅ |
| Ricerca negozio | In alto (rimosso su staging su richiesta) | — | ✅ (scelta) |
| Newsletter | Sottile, underline | `ps_emailsubscription` in footer ✅ | ✅ |
| Colonne | Accordion 3–4 blocchi | `ps_linklist` + accordion JS ✅ | 🔧 Titoli BO |
| Lingua / paese | Riga sopra copyright | Non stilizzata | ❌ |
| Link social | Minimal | `ps_socialfollow` non in hook | ❌ |

### 2.6 Checkout / carrello / account

| Aspetto | Gucci.com | Staging | Gap |
|---------|-----------|---------|-----|
| Carrello pagina | Minimal luxury | Wrapper `.gucci-cart-page` | 🟡 Partial parent |
| Checkout steps | Pulito, monocromo | Wrapper only | ❌ Partial parent |
| Login / registrazione | Sobrio | Wrapper `.gucci-auth-page` | ❌ Form Classic |
| Mini-carrello | Drawer/modal | `.gucci-cart-modal` slide | 🟡 Sfondo modal bianco in CSS |

### 2.7 Tipografia globale

| Token | Gucci (indicativo) | Child (`:root`) | Gap |
|-------|----------------------|-----------------|-----|
| Body catalogo | ~14px, peso 300–400 | `--gucci-type-base: 14px` | 🟡 Peso 400 globale |
| Menu drawer | ~11–15px, tracking largo | Drawer 15px, menu 11px uppercase altrove | 🟡 Mix scale |
| UI CTA | 11px uppercase | `--gucci-type-ui: 11px` | ✅ |
| Titoli editoriali | Serif | Playfair Display | ✅ |

---

## 3. Inventario codice (stato attuale)

### Template child principali

| Area | File |
|------|------|
| Header / search / drawers | `templates/_partials/header.tpl` |
| Footer | `templates/_partials/footer.tpl` |
| Home | `templates/index.tpl` |
| PDP | `templates/catalog/product.tpl` + partials `gucci-*` |
| PLP | `templates/catalog/listing/*.tpl`, `miniatures/product.tpl` |
| Checkout | `templates/checkout/cart.tpl`, `checkout.tpl` |
| Account | `templates/customer/authentication.tpl`, `registration.tpl`, `my-account.tpl` |

### Moduli override

`ps_mainmenu`, `ps_shoppingcart`, `ps_customersignin`, `ps_searchbar`, `ps_emailsubscription`, `ps_linklist`, `ps_contactinfo`

### Asset

- `assets/css/custom.css` (~3700 righe) — token, header, drawer, PLP, PDP, footer  
- `assets/js/custom.js` — drawer, header scroll, accordion, gallery counter, filtri  

---

## 4. Roadmap per fasi (TODO)

### Fase 0 — Deploy e BO (bloccante per vedere il codice)

- [ ] **0.1** Caricare `classic-gucci/` su Hostinger in `themes/classic-gucci/`
- [ ] **0.2** Tema attivo: **Classic Gucci Style**; padre `classic` presente
- [ ] **0.3** Svuotare cache PrestaShop + Smarty
- [ ] **0.4** **Design → Posizioni:** `ps_mainmenu` → `displayTop`; `ps_shoppingcart` + `ps_customersignin` → `displayNav2`
- [ ] **0.5** Logo monocromatico (SVG/PNG nero) in **Design → Tema e logo**
- [ ] **0.6** Disattivare in BO (non solo CSS): `ps_imageslider`, `ps_customtext` rumorosi, `blockreassurance` home
- [ ] **0.7** Verifica incognito staging dopo ogni rilascio

**Accettazione:** modifiche CSS/TPL visibili su chocolate-ferret; checklist §10 di `GUCCI-DESIGN-REFERENCE.md` verde.

---

### Fase 1 — Header autentico Gucci (priorità alta) — IN CORSO

| ID | Task | File | Stato |
|----|------|------|-------|
| 1.1 | Logo **sinistra**, icone **destra** (grid 2 col) | `header.tpl`, `custom.css` | ✅ |
| 1.2 | Contatti solo da drawer menu / icona opzionale | `header.tpl` | ✅ |
| 1.3 | Ordine icone: carrello → account → cerca → menu | `custom.css` order | Come gucci.com |
| 1.4 | Header PDP: trasparente + bianco scroll | già in `custom.js` + CSS | Verificare su prodotto con immagini |
| 1.5 | Menu drawer: voci chiuse, no separatori, 15px | `ps_mainmenu.tpl`, CSS | Come screenshot `gucci-menu-drawer.png` |
| 1.6 | Footer drawer: Contatti, Login, (opz.) negozio | `header.tpl` | Link funzionanti |

---

### Fase 2 — Tipografia e token globali

| ID | Task | File | Accettazione |
|----|------|------|--------------|
| 2.1 | Unificare body catalogo 14px / secondary 13px | `custom.css` `:root` | PLP + PDP + drawer coerenti |
| 2.2 | Peso 300 descrizioni, 400/500 UI | `custom.css` body, `.product-description` | Grigio `#666`, line-height 1.75 |
| 2.3 | Rimuovere `letter-spacing` globale su titoli card | `custom.css` h1–h6 | Solo dove serve (CTA uppercase) |
| 2.4 | Audit link blu `#24b9d7` residui | `custom.css` grep | Nessun teal PrestaShop |

---

### Fase 3 — Homepage editoriale

| ID | Task | File | Accettazione |
|----|------|------|--------------|
| 3.1 | Nascondere tutti i moduli home non Gucci | `custom.css`, `theme.yml` | 🟡 whitelist banner + 1 featured |
| 3.2 | Hero full-bleed: banner unico o template dedicato | `index.tpl`, CSS | Immagine edge-to-edge, opz. CTA outline |
| 3.3 | Sezione 2 colonne categorie (HTML o CMS) | nuovo partial / `ps_banner` x2 | Come `gucci-home-categories.png` |
| 3.4 | Una sola griglia prodotti “featured” | `theme.yml` hook `ps_featuredproducts` | Titolo sezione sobrio o nascosto |
| 3.5 | Rimuovere Lorem `customtext` | BO + CSS | Testo editoriale reale o vuoto |

---

### Fase 4 — PLP (listing)

| ID | Task | File | Accettazione |
|----|------|------|--------------|
| 4.1 | Toolbar: conteggio + Filtra + Ordina stile caption | `products-top.tpl`, CSS | 12px uppercase, nero/grigio |
| 4.2 | Filtri drawer: backdrop + Escape + transizione | `custom.js`, CSS | ✅ |
| 4.3 | Paginazione minimal | `custom.css` `.pagination` | Nero/bianco, no blu |
| 4.4 | `category-footer.tpl` override vuoto/editoriale | nuovo tpl | No testo Classic sotto griglia |
| 4.5 | Subcategories: nascoste o riga link orizzontale sobria | `subcategories.tpl` | Non griglia Classic |

---

### Fase 5 — PDP (scheda prodotto)

| ID | Task | File | Accettazione |
|----|------|------|--------------|
| 5.1 | Galleria full-bleed + header overlay | già fatto | 100svh, header trasparente in cima |
| 5.2 | Buybox sotto galleria (scelta progetto) | `product.tpl`, CSS | Centrato max-width ~32rem |
| 5.3 | (Opzionale) Desktop split sticky come gossip ref. | `custom.css` media query | Solo se si cambia brief |
| 5.4 | CTA label IT “AGGIUNGI AL CARRELLO” | `product-add-to-cart.tpl` | ✅ (uppercase via CSS) |
| 5.5 | Varianti taglia/colore minimal | `product-variants.tpl` | No select Bootstrap colorati |
| 5.6 | 6+ immagini prodotto | BO catalogo | Gallery scroll lunga |
| 5.7 | Accessori “Potrebbe piacerti anche” griglia sobria | `product.tpl`, CSS | Stesse card PLP |

---

### Fase 6 — Footer

| ID | Task | File | Accettazione |
|----|------|------|--------------|
| 6.1 | Colonne `ps_linklist` titoli IT Gucci | BO + `bo-recommendations.json` | 3–4 accordion |
| 6.2 | Newsletter underline in footer | `ps_emailsubscription.tpl` | Solo footer |
| 6.3 | Riga lingua / paese sopra copyright | `footer.tpl`, `ps_languageselector` hook | Come gucci-footer |
| 6.4 | Social `ps_socialfollow` in footer | `theme.yml` + CSS | Icone lineari bianche |
| 6.5 | Copyright 11px grigio | `footer.tpl` | No “Powered by PrestaShop” |

---

### Fase 7 — Carrello, checkout, account

| ID | Task | File | Accettazione |
|----|------|------|--------------|
| 7.1 | Override `cart-detailed*.tpl` righe minimal | nuovi tpl | Immagine bianca, testo 14px |
| 7.2 | Checkout steps + riepilogo | `checkout/_partials/*` | No step colorati Classic |
| 7.3 | Form login/registrazione underline | `customer/_partials/*` | Nero/bianco |
| 7.4 | Pagine ordini / indirizzi | `history.tpl`, `addresses.tpl` | Stesso linguaggio UI |

---

### Fase 8 — QA finale e regressione

| ID | Task |
|----|------|
| 8.1 | Confronto screenshot 1440 + 390: home, PLP, PDP, footer |
| 8.2 | Mobile: drawer, filtri, gallery counter, header scroll |
| 8.3 | Incognito + carrello + checkout guest |
| 8.4 | Aggiornare questo documento (stato ✅) |

---

## 5. Matrice priorità (cosa fare prima)

```
Fase 0 (deploy/BO) → Fase 1 (header) → Fase 2 (tipo) → Fase 5 (PDP polish)
                  ↘ Fase 4 (PLP)     ↗
                    Fase 3 (home) — contenuto BO
                    Fase 6 (footer) — parallel
                    Fase 7 (checkout) — dopo catalogo
```

---

## 6. File da toccare per fase (checklist rapida)

| Fase | File principali |
|------|-----------------|
| 0 | Deploy FTP, BO cache/hook/logo/moduli |
| 1 | `header.tpl`, `custom.css`, `custom.js`, `ps_mainmenu.tpl` |
| 2 | `custom.css` (`:root`, body, override link) |
| 3 | `index.tpl`, `theme.yml`, `custom.css` (#index) |
| 4 | `product-list.tpl`, `products-top.tpl`, `facets.tpl`, `custom.js` |
| 5 | `product.tpl`, `gucci-*.tpl`, `custom.css` (#product) |
| 6 | `footer.tpl`, `theme.yml`, `ps_linklist`, `ps_emailsubscription` |
| 7 | `templates/checkout/**`, `templates/customer/**` |

---

## 7. Riferimenti screenshot

| File | Contenuto |
|------|-----------|
| `gucci-home-hero.png` | Header + hero |
| `gucci-menu-drawer.png` | Menu laterale |
| `gucci-home-categories.png` | Griglia 2 col |
| `gucci-footer.png` | Footer nero |
| `gucci-pdp-desktop-1440-*.png` | PDP desktop |
| `gucci-pdp-gossip-*.png` | Buybox reference |
| `staging-*.png` | Stato deploy precedente |

---

## 8. Note decisioni di progetto

1. **Buybox PDP sotto la galleria** (non sidebar desktop): scelta esplicita cliente; diverso da alcuni screenshot Gucci desktop ma coerente con scroll gallery full-page.  
2. **Drawer contatti a sinistra** / **menu a destra**: scelta implementata; Gucci ufficiale usa menu hamburger con tutto nel menu.  
3. **Ricerca negozio footer**: rimossa su richiesta; non compare nell’audit come gap bloccante.  

---

*Prossimo aggiornamento: segnare TODO completati dopo ogni sprint e data deploy.*
