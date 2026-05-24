# Checklist verifica staging — Classic Gucci

**URL:** https://chocolate-ferret-940937.hostingersite.com/  
**Lingua test:** aggiungi `id_lang=2` oppure imposta IT predefinita in BO.

## Back office (una tantum)

- [ ] Lingua predefinita → **Italiano** ([BO-LINGUA-ITALIANA.md](BO-LINGUA-ITALIANA.md))
- [ ] Logo monocromatico in Design → Tema
- [ ] Modulo **blockwishlist** disattivato
- [ ] Immagini home: `themes/classic-gucci/assets/img/home/cat-3.jpg`, `cat-6.jpg`, `cat-9.jpg` ([IMMAGINI-HOME.md](IMMAGINI-HOME.md))
- [ ] Slider hero: sostituire immagini demo
- [ ] Footer Link list: colonne IT (vedi `config/bo-recommendations.json`)

## Pagine da aprire in incognito

| Pagina | URL |
|--------|-----|
| Home | `/index.php?id_lang=2` |
| Categoria | `?id_category=3&controller=category&id_lang=2` |
| Prodotto | `?id_product=1&controller=product&id_lang=2` |
| Carrello | `?controller=cart&id_lang=2` |
| Checkout | `?controller=order&id_lang=2` |
| Contatti | `?controller=contact&id_lang=2` |
| CMS Spedizioni | `?id_cms=1&controller=cms&id_lang=2` |
| Mappa sito | `?controller=sitemap&id_lang=2` |
| Negozi | `?controller=stores&id_lang=2` |
| Login | `?controller=authentication&id_lang=2` |

## Cosa controllare

- Header: Carrello, Accedi, Cerca, Menu (no testo “Sign in” in barra)
- Footer: link IT, copyright «Tutti i diritti riservati»
- Nessun blu PrestaShop `#24b9d7` su pagine principali
- Form contatti: label IT, pulsante «Invia messaggio»
- Mobile 390px: menu drawer, PLP filtri

## Deploy tema

Dopo modifiche in `classic-gucci/`: `npm run deploy` + svuota cache BO.
