# Changelog tema Classic Gucci

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
