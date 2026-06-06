# Homepage — struttura editoriale e configurazione BO

Guida operativa per allineare la homepage di **Barbara Alvisi** allo schema concordato con il cliente.

**Riferimento visivo:** `materials/HomePage_schema.jpeg`  
**Foto hero di riferimento:** `materials/BarbaraAlvisi_foto_home_page.jpeg`  
**Staging:** valore `STAGING_URL` in `.env` (attuale: https://barbaraalvisi.it/)

Documenti correlati:

- [IMMAGINI-HOME.md](./IMMAGINI-HOME.md) — file JPG per la griglia categorie
- [GUCCI-DESIGN-REFERENCE.md](./GUCCI-DESIGN-REFERENCE.md) — benchmark visivo luxury
- [BO-LINGUA-ITALIANA.md](./BO-LINGUA-ITALIANA.md) — lingua predefinita IT

---

## 1. Struttura richiesta (schema cliente)

Lo schema definisce una homepage verticale, minimalista, in tre blocchi:

| Ordine | Sezione | Contenuto |
|--------|---------|-----------|
| 1 | **Hero** | Fotografia grande quasi a tutta pagina; testo in basso (titolo / messaggio / CTA). Fotografia **inclusiva**. |
| 2 | **Griglia 2×2** | Quattro blocchi editoriali: immagine + testo (nel wireframe: «Foto prodotto» + «TESTO»). |
| 3 | **Newsletter** | Fascia «Iscriviti alla nostra newsletter». |

In appendice allo schema è definita anche la struttura del menu **Abbigliamento** (9 sottovoci):

1. Abiti  
2. Camicie e bluse  
3. Capispalla  
4. Denimwear  
5. Felperia  
6. Giacche  
7. Gonne  
8. Maglieria  
9. Pantaloni  

---

## 2. Cosa fa già il tema child

Il file `classic-gucci/templates/index.tpl` compone la home così:

```
<section class="gucci-home">
  <div class="gucci-home-modules">
    {$HOOK_HOME}                          ← moduli PrestaShop (displayHome)
    {include gucci-home-categories.tpl}   ← griglia categorie hardcoded
  </div>
</section>
```

L’ordine visivo è forzato dal CSS (`custom.css`, sezione `gucci-home-modules`):

| Ordine CSS | Sezione | Origine |
|------------|---------|---------|
| 1 | Hero slider | Modulo `ps_imageslider` |
| 2 | Griglia categorie «Esplora» | Template `gucci-home-categories.tpl` |
| 3 | Griglia prodotti «Selezione» | Modulo `ps_featuredproducts` |
| 4 | Banner editoriale | Modulo `ps_banner` (se attivo) |

La **newsletter** non è nel blocco home: è nel footer via `footer.tpl` → widget `ps_emailsubscription`.

### File tema coinvolti

| File | Ruolo |
|------|--------|
| `templates/index.tpl` | Layout homepage |
| `templates/_partials/gucci-home-categories.tpl` | Griglia 2 colonne (Abbigliamento, Accessori, Arte) |
| `modules/ps_imageslider/views/templates/hook/slider.tpl` | Hero slider |
| `modules/ps_featuredproducts/views/templates/hook/ps_featuredproducts.tpl` | Sezione «Selezione» |
| `modules/ps_banner/ps_banner.tpl` | Banner sotto la vetrina |
| `templates/_partials/footer.tpl` | Newsletter |
| `config/theme.yml` | Hook `displayHome`: slider, featured, banner |
| `assets/css/custom.css` | Ordine sezioni, nascondere moduli demo, stile griglie |

### Moduli nascosti automaticamente dal tema

Il CSS nasconde in home (anche se ancora agganciati in BO):

- `ps_newproducts`, `ps_bestsellers`, `ps_specials`
- `ps_customtext` / blocchi Lorem
- `blockreassurance`

Meglio disattivarli anche da **Design → Posizioni** per evitare hook inutili.

---

## 3. Stato attuale vs schema — cosa manca

### Contenuti e backoffice (configurabili senza codice)

| Elemento | Stato tipico su staging | Azione |
|----------|-------------------------|--------|
| Foto hero | Slide demo PrestaShop (`sample-1`, `sample-2`…) | Caricare fotografia reale, preferibilmente verticale / inclusiva |
| Testo hero | Campi compilabili in BO ma **non mostrati** sul sito | Compilare in BO + aggiornare `slider.tpl` (vedi §5) |
| Griglia categorie | 3 tile senza foto → sfondo grigio | Caricare `cat-{id}.jpg` (vedi [IMMAGINI-HOME.md](./IMMAGINI-HOME.md)) |
| Quarto riquadro 2×2 | Solo 3 categorie nel template | Aggiungere 4ª categoria in BO + riga in `gucci-home-categories.tpl` |
| Selezione prodotti | Griglia 8 prodotti demo | Disattivare hook o sostituire con prodotti reali |
| Newsletter | Testi generici PrestaShop | Personalizzare in Moduli → Iscrizione alla newsletter |
| Menu Abbigliamento | Di solito già configurato con le 9 voci | Allineare voci del menu alle categorie in Catalogo |

### Tema / sviluppo (non risolvibile solo da BO)

| Elemento | Problema | Intervento |
|----------|----------|------------|
| Hero full-page | Aspect ratio attuale ~1110×340 (banner basso), non «foto intera pagina» | CSS: ratio verticale o `min-height` viewport; slide con foto portrait |
| Overlay testo hero | `slider.tpl` renderizza solo l’immagine | Aggiungere titolo, descrizione e link dai campi slide BO |
| Selezione in home | Non presente nello schema (solo griglia 2×2) | Disattivare `ps_featuredproducts` su `displayHome` oppure tenere per scelta editoriale |
| Newsletter sotto griglia | Oggi nel footer | Opzionale: spostare hook o duplicare sezione in `index.tpl` |

---

## 4. Configurazione backoffice — passo passo

### 4.1 Lingua e cache

Prima di tutto: [BO-LINGUA-ITALIANA.md](./BO-LINGUA-ITALIANA.md)  
Poi: **Parametri avanzati → Prestazioni → Svuota cache** dopo ogni modifica contenuti.

---

### 4.2 Hook homepage — Design → Posizioni

Apri **Design → Posizioni** → hook **`displayHome`**.

| Modulo | Schema puro | Schema + vetrina |
|--------|-------------|------------------|
| **Slider immagini** (`ps_imageslider`) | ✅ Attivo | ✅ Attivo |
| **Prodotti in vetrina** (`ps_featuredproducts`) | ❌ Disattiva | ✅ Attivo |
| **Banner** (`ps_banner`) | Opzionale | Opzionale |
| Nuovi prodotti / Più venduti / In offerta / Testo personalizzato | ❌ Disattiva | ❌ Disattiva |

La griglia **Esplora** (Abbigliamento, Accessori, Arte) **non** è un modulo: è nel template e compare sempre dopo gli hook.

Ordine consigliato negli hook: **Slider → (eventuale vetrina) → Banner**.

---

### 4.3 Hero — Moduli → Slider immagini

Per ogni slide (consiglio: **una sola slide** all’inizio, come nello schema):

| Campo BO | Uso |
|----------|-----|
| **Immagine** | JPG/WebP verticale, alta risoluzione (es. 1200×1600 px o superiore). Riferimento: `materials/BarbaraAlvisi_foto_home_page.jpeg`. |
| **Titolo** | Testo hero in basso (es. nome collezione). |
| **Descrizione** | Sottotitolo breve. |
| **URL** | Link a categoria, landing o pagina CMS. |
| **Lingua** | Compila **Italiano** (e inglese se il negozio è multilingua). |

Note:

- Fino all’aggiornamento di `slider.tpl`, titolo e descrizione **non sono visibili** in frontend.
- Dopo il deploy del tema, verifica in incognito: https://barbaraalvisi.it/

---

### 4.4 Griglia 2×2 «Esplora» — Categorie e immagini

#### Catalogo → Categorie

Verifica che esistano le categorie principali collegate al menu:

| ID (default demo) | Nome IT | Link menu |
|-------------------|---------|-----------|
| 3 | Abbigliamento | Voce principale + sottocategorie |
| 6 | Accessori | Voce principale |
| 9 | Arte | Voce principale |

Se gli **ID** in BO sono diversi, aggiorna l’array `gucciHomeCats` in:

`classic-gucci/templates/_partials/gucci-home-categories.tpl`

#### Immagini categoria

Carica (FTP o deploy) in:

```
classic-gucci/assets/img/home/
  cat-3.jpg
  cat-6.jpg
  cat-9.jpg
```

Specifiche: JPG verticale, min. **800×1000 px**. Dettagli in [IMMAGINI-HOME.md](./IMMAGINI-HOME.md).

**Placeholder locali** (solo sviluppo):

```bash
node scripts/make-home-cat-images.js
```

Genera gradienti neutri; sostituirli con foto reali prima del go-live.

#### Quarto riquadro (schema 2×2)

Lo schema prevede **4** celle. Oggi il template ne definisce **3** (la terza su desktop può occupare tutta la riga). Per il 2×2 completo:

1. Crea la 4ª categoria in **Catalogo → Categorie**
2. Aggiungi una voce nell’array `gucciHomeCats`
3. Carica `cat-{nuovoId}.jpg`
4. Esegui `npm run deploy`

---

### 4.5 Selezione prodotti — Moduli → Prodotti in vetrina

**Per rispettare solo lo schema** (hero + 2×2 + newsletter):

- **Design → Posizioni** → rimuovi `ps_featuredproducts` da `displayHome`

**Per mantenere la Selezione:**

- Segna i prodotti come «in vetrina» in **Catalogo → Prodotti**, oppure
- Configura il modulo (numero prodotti, categoria sorgente — dipende dalla versione PS)

Il tema mostra al massimo **8** prodotti (`gucci-home-products-section.tpl` → `maxProducts=8`).

---

### 4.6 Newsletter — Moduli → Iscrizione alla newsletter

| Campo | Valore suggerito |
|-------|------------------|
| Titolo | Iscriviti alla nostra newsletter |
| Testo informativo | Testo GDPR / diritto di disiscrizione |

Il modulo è renderizzato nel **footer** (`templates/_partials/footer.tpl`).  
Per averlo come fascia dedicata subito sotto la griglia (come nello schema) serve un intervento sul tema (hook o sezione in `index.tpl`).

---

### 4.7 Menu Abbigliamento — Design → Menu

1. **Design → Menu** → menu principale (`ps_mainmenu`)
2. Voce **Abbigliamento** → sottovoci nell’ordine dello schema:
   - Abiti, Camicie e bluse, Capispalla, Denimwear, Felperia, Giacche, Gonne, Maglieria, Pantaloni
3. Ogni sottovoce → tipo **Categoria** → seleziona la categoria corrispondente da Catalogo

Le categorie figlie vanno create prima in **Catalogo → Categorie** sotto Abbigliamento.

---

## 5. Interventi tema (sviluppatore)

Checklist per allineamento completo allo schema:

- [ ] **Hero overlay** — in `slider.tpl`: mostrare `$slide.title`, `$slide.description`, link `$slide.url` sopra l’immagine (testo bianco in basso, stile Gucci)
- [ ] **Hero full-page** — in `custom.css`: aspect ratio verticale o `min-height: 85vh` / `100svh` su `.gucci-home-hero-slider`
- [ ] **Quarta categoria** — aggiornare `gucci-home-categories.tpl` se il cliente definisce il 4° blocco
- [ ] **Selezione opzionale** — disattivare in CSS/BO o lasciare per scelta editoriale
- [ ] **Newsletter in home** — opzionale: sezione dedicata sotto la griglia
- [ ] **Deploy** — `npm run deploy` + verifica staging (regola `verify-deploy-verify.mdc`)

---

## 6. Verifica dopo le modifiche

### Checklist contenuti (BO)

- [ ] Una slide hero con foto reale (non `sample-*`)
- [ ] Titolo/descrizione slide compilati in IT
- [ ] Immagini `cat-3.jpg`, `cat-6.jpg`, `cat-9.jpg` presenti sul server
- [ ] Categorie e menu allineati (ID e nomi)
- [ ] Testi newsletter personalizzati
- [ ] Moduli demo disattivati su `displayHome` (se non servono)
- [ ] Cache PrestaShop svuotata

### Checklist visiva (staging)

| Controllo | Atteso |
|-----------|--------|
| Hero | Full-bleed, immagine editoriale, niente frecce blu Classic |
| Sotto hero | Griglia categorie 2 col (desktop), tile con foto o fallback grigio |
| Selezione | Presente solo se `ps_featuredproducts` è attivo su `displayHome` |
| Newsletter | Visibile in fondo pagina (footer) |
| Menu drawer | Abbigliamento con 9 sottovoci |
| Mobile | Hero leggibile, griglia 1 col, header con hamburger |

Apri in **incognito**: https://barbaraalvisi.it/

---

## 7. Roadmap consigliata

```
1. BO: lingua IT + slide hero + testi newsletter
2. BO: categorie e menu Abbigliamento (9 voci)
3. Contenuti: foto hero + JPG categorie (FTP / deploy)
4. Tema: overlay testo hero + altezza full-page (se richiesto)
5. BO: disattivare ps_featuredproducts su displayHome (se schema senza Selezione)
6. Deploy + verifica staging
```

---

## 8. Domande frequenti

**Perché vedo ancora «Hummingbird printed t-shirt»?**  
Sono prodotti demo del catalogo PrestaShop. Vanno sostituiti o la sezione «Selezione» va disattivata.

**Perché le categorie sono grigie?**  
Mancano i file `cat-{id}.jpg` in `assets/img/home/`. Vedi [IMMAGINI-HOME.md](./IMMAGINI-HOME.md).

**Posso gestire la griglia 2×2 solo da BO?**  
No: le voci e gli ID sono nel template `gucci-home-categories.tpl`. Le **immagini** si caricano via FTP/deploy; i **testi** derivano dalle etichette nel template (o dalle categorie BO per i link).

**La newsletter deve stare in home o nel footer?**  
Lo schema la mette sotto la griglia; oggi il tema la mette nel footer. Entrambe sono accettabili; per spostarla serve modifica al tema.

**Serve modificare `theme.yml`?**  
Solo se cambi l’elenco moduli agganciati a `displayHome`. Dopo ogni modifica: `npm run deploy`.
