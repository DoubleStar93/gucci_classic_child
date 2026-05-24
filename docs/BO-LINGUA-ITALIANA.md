# Impostare l’italiano come lingua predefinita (PrestaShop)

Senza questo passaggio la home e molte pagine restano in **inglese** (`id_lang=1`), anche con il tema Classic Gucci localizzato.

## Passi in Back Office

1. **Internazionale → Localizzazione → Lingue**
   - Verifica che **Italiano** sia attivo.
   - Imposta **Italiano** come lingua predefinita del negozio.

2. **Internazionale → Traduzioni** (opzionale)
   - Traduci stringhe modulo/tema se mancano voci in italiano.

3. **Parametri avanzati → Prestazioni → Svuota cache**

4. Apri lo shop in **incognito**: [staging](https://chocolate-ferret-940937.hostingersite.com/)

## Verifica rapida

| Controllo | Atteso |
|-----------|--------|
| Footer | «Tutti i diritti riservati», link IT |
| Header | Carrello, Accedi, Cerca |
| URL home | Preferibilmente senza forzare `id_lang=2` |

## Nota

I **nomi prodotti demo** (es. «Hummingbird printed t-shirt») sono contenuti catalogo: vanno tradotti in **Catalogo → Prodotti**, non nel tema child.
