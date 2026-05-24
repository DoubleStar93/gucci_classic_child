# Immagini home — Esplora (categorie)

La sezione **Esplora** in homepage usa immagini opzionali per categoria.

## Percorso sul server

```
themes/classic-gucci/assets/img/home/
  cat-3.jpg   → Abbigliamento (id categoria 3)
  cat-6.jpg   → Accessori (id 6)
  cat-9.jpg   → Arte (id 9)
```

Formato consigliato: **JPG** verticale, min. **800×1000 px**, soggetto editoriale (packshot o lifestyle neutro).

## Se mancano le immagini

Il tema mostra una **cella grigio chiaro** con titolo e link **Scopri** (classe `is-no-image`).

## Aggiornare gli ID categoria

Se in BO le categorie hanno ID diversi, modifica `templates/_partials/gucci-home-categories.tpl` (array `gucciHomeCats`).
