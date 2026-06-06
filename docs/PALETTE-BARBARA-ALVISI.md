# Palette Barbara Alvisi

Estrazione dai materiali cliente:

- **Immagine moodboard:** `materials/palette.jpeg` (marmo, travertino, velluto bordeaux, legno, ottone)
- **Linee guida:** `docs/LINEEE_GUIDA_ANTONIO.md` — panna, bianco, sabbia, taupe, marrone, bordeaux, nero, oro, bronzo; fondi chiari + accenti; finiture dorate

**Implementazione tema:** token in `classic-gucci/assets/css/custom.css` (`:root` + sezione «Palette Barbara Alvisi»).

---

## Token colore

| Nome | Hex | Campo CSS | Uso |
|------|-----|-----------|-----|
| **Panna** | `#F6F1E8` | `--ba-panna` | **Unico sfondo chiaro** — body, header, drawer, modali, card |
| **Avorio** | `#FAF6EF` | `--ba-avorio` | Testo su bordeaux, cioccolato, hero scuro (non bianco puro) |
| **Sabbia** | `#E4D9C8` | `--ba-sabbia` | Superfici secondarie, placeholder immagini, separatori |
| **Taupe** | `#9A8B7A` | `--ba-taupe` | Testi secondari, placeholder |
| **Cioccolato** | `#3D2B22` | `--ba-cioccolato` | Testo principale, footer scuro |
| **Bordeaux** | `#6B2A28` | `--ba-bordeaux` | CTA primari, accenti editoriali |
| **Bordeaux scuro** | `#541F1D` | `--ba-bordeaux-dark` | Hover bottoni |
| **Nero caldo** | `#1A1412` | `--ba-nero` | Contrasto forte (titoli, icone su panna) |
| **Oro** | `#C9A962` | `--ba-oro` | Finiture: bordi newsletter, hover link |
| **Bronzo** | `#8F7348` | `--ba-bronzo` | Accento metallico secondario |

### Mapping semantico (tema)

| Token legacy | Valore |
|--------------|--------|
| `--bg-primary` | Panna |
| `--bg-secondary` | Sabbia |
| `--gucci-color-surface` | Panna |
| `--gucci-color-on-dark` | Avorio |
| `--text-color` | Cioccolato |
| `--text-muted` | Taupe |
| `--border-color` | Sabbia scurita (`#D9CFC0`) |
| `--gucci-color-accent` | Bordeaux |

---

## Bianco puro: sì o no?

**No per le superfici UI.** Il bianco `#FFFFFF` crea “strisce” fredde contro il panna (header, aree prodotto, modali) e spezza il filo caldo della moodboard (marmo, travertino, velluto).

**Sì solo come concetto di “chiaro su scuro”** — ma implementato come **avorio** (`#FAF6EF`), leggermente più caldo del bianco puro:

- Testo bottoni bordeaux
- Icone header su hero
- Testi footer su cioccolato

In sintesi: **panna ovunque per gli sfondi, avorio per il testo su scuro, sabbia per i riempimenti secondari.** Il bianco puro non è un token attivo del tema.

---

## Regole d’uso (brief)

1. **Sfondi** — Solo panna e sabbia (mai grigi freddi PrestaShop, mai `#FFF` su layout).
2. **Accenti** — Bordeaux e cioccolato per CTA, titoli di sezione, footer.
3. **Oro / bronzo** — Con parsimonia: bordi sottili, underline hover.
4. **Testi** — Cioccolato su panna; avorio su bordeaux/cioccolato.
5. **Fotografie** — Hero e tile categorie con toni caldi coerenti con la palette.

---

## Dove si vede nel sito

| Area | Trattamento |
|------|-------------|
| Body, wrapper, header (anche scrolled) | Panna |
| Drawer, modali, checkout | Panna |
| Placeholder prodotto / tile senza foto | Sabbia o gradiente panna → sabbia |
| Bottoni primari | Bordeaux + testo avorio |
| Footer | Cioccolato + testo avorio + bordo oro newsletter |
| Hero (header overlay) | Icone avorio su immagine |

---

## Riferimenti

- [HOMEPAGE-STRUCTURE.md](./HOMEPAGE-STRUCTURE.md)
- [LINEEE_GUIDA_ANTONIO.md](./LINEEE_GUIDA_ANTONIO.md)
- [GUCCI-DESIGN-REFERENCE.md](./GUCCI-DESIGN-REFERENCE.md)
