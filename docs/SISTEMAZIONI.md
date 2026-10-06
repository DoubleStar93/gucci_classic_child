# Barbara Alvisi — sistemazioni e richieste

Raccolta dei messaggi di Gloria / Alessia / Nicola (24 settembre – 2 ottobre 2026), più le sistemazioni chiuse il 5 ottobre 2026.

Ogni voce si chiude con un solo stato.

## Come leggere lo stato

| Stato | Significato |
| --- | --- |
| Fatto | La richiesta è chiusa. È online, oppure la risposta è già nel negozio e non resta nulla da costruire |
| Guida | Non è codice del tema. Il link apre i passi, più sotto |
| Non fatto | Resta da fare. Tema, pannello o procedura: il materiale c’è |
| Manca materiale | Non si chiude finché non arriva il file, la foto o la decisione |
| Preventivo | C’è un prezzo. Non si inizia finché non si accetta |

## Riepilogo

| Richiesta | Stato | Nota |
| --- | --- | --- |
| Email e telefono in footer e form contatti | Fatto | Tema |
| Newsletter in home: non tornare in alto sul banner | Fatto | Tema |
| Spedizione 10 € Italia, 15 € estero, gratis da 199 € | Fatto | Corriere GLS |
| Scritta in movimento più piccola sul telefono | Fatto | Fascia newsletter, sotto i 768 px |
| Tabella taglie in scheda prodotto | Fatto | Guida IT e EN, con download del PDF |
| Elenco clienti e iscritti newsletter | Fatto | [Guida](#guida-clienti) |
| Dove si modifica il form Contattaci | [Guida](#guida-form-contatti) | Oggetti e email da Contatti. Testi fissi nel tema |
| Procedura ordini e mail di conferma | Fatto | [Guida](#guida-ordini) |
| Avviso «capo di nuovo disponibile» | [Guida](#guida-alert) | Modulo Mail alerts |
| Pagina Rimborsi e resi nel footer | [Guida](#guida-resi) | Pagina CMS + voce nel footer |
| Search Console, Merchant, sitemap | [Guida](#guida-google) | Nessun abbonamento per essere trovati |
| Sconto 10% al primo acquisto | Fatto | Codice `BENVENUTOALVISI10` nella mail di iscrizione |
| Seconda scritta «Scopri la qualità del vero Made in Italy» | Fatto | Fascia al posto di «Prodotti in vetrina» |
| Rimpicciolire entrambe le scritte | Fatto | Stessa misura: 52 px su desktop, 36 px sul telefono |
| Mail di iscrizione newsletter | Fatto | Parte dallo shop. Brevo non serve |
| Testi delle mail | [Guida](#guida-testi-mail) | Traduzioni email, tema barbaraalvisi. Senza Brevo |
| Prodotti correlati nell’ordine impostato | Fatto | Stesso ordine dell’elenco accessori in scheda |
| Chat WhatsApp | Preventivo | 20 €. Bottone fisso. Il link nel pannello Contatti c’è già |
| Immagine nella mail di benvenuto | Fatto | Foto nelle due mail di iscrizione, IT e EN |
| Brand World, galleria senza link | Preventivo | 60 €. Le 17 immagini non sono ancora nel tema |

Conteggi: 13 fatto, 5 guide, 0 non fatto, 0 manca materiale, 2 preventivi.

---

## Già fatto (5 ottobre 2026)

### Email e telefono

**Fatto.** `servizioclienti@barbaraalvisi.it` e `352 276 6033` sono nel footer, sopra il modulo Contattaci, e nel pannello Contatti (telefono e WhatsApp).

### Newsletter in home

**Fatto.** Iscriversi dal footer non riporta in cima e non fa ripartire il banner. La conferma resta sul modulo.

### Spedizione

**Fatto.** Corriere GLS:

- Italia: 10 €
- Estero (paesi attivi fuori Italia: Francia e Stati Uniti): 15 €
- Gratis da 199 € di prodotti (prima la soglia era 150 € e l’Italia era a 9,50 €, nella stessa zona della Francia)

L’Italia ha una zona di spedizione propria, altrimenti non si poteva distinguere il prezzo nazionale da quello estero.

### Scritta che scorre, solo telefono

**Fatto.** La fascia newsletter e la riga Made in Italy hanno la stessa misura: 52 px su desktop, 36 px sul telefono.

### Guida alle taglie

**Fatto.** In scheda prodotto, sotto le taglie, c’è «Guida alle taglie» (in inglese «Size guide»). Apre le tabelle di abbigliamento, maglieria e conversione internazionale, più la figura per misurare busto, vita e fianchi. Dal pannello si scarica anche il PDF della lingua in uso.

---

## 24 settembre 2026

### Tabella taglie in scheda prodotto

**Fatto** il 5 ottobre 2026. I PDF in italiano e in inglese sono in scheda: link «Guida alle taglie» / «Size guide», con tabelle, figura di misurazione e download del PDF.

### Chat WhatsApp

**Preventivo: 20 €.**

Oggi WhatsApp è una voce del pannello Contatti, numero `352 276 6033`. Il preventivo è il bottone fisso in pagina, quello che resta visibile mentre si naviga. Il link `wa.me/393522766033` c’è già. La foto di Gloria, se arriva, serve solo per avvicinarsi al suo esempio.

### Capo esaurito: mail quando torna disponibile {#guida-alert}

**Guida.** Da pannello. Non è una modifica del tema.

1. Moduli → Gestione moduli. Cercare **Mail alerts** (`ps_emailalerts`). Se non è installato, installarlo.
2. Configura. Attivare l’avviso di disponibilità: il cliente lascia l’email sulla taglia esaurita.
3. In scheda, su una taglia a quantità zero, deve comparire il campo per l’email. Provare con un capo davvero esaurito.
4. Quando quella taglia torna con quantità maggiore di zero, il modulo manda la mail da solo. Gloria non la scrive a mano.
5. Il testo della mail si cambia da Internazionale → Traduzioni → Traduzioni email.

Lo stile del pulsante in scheda si tocca solo se stona con il resto della pagina.

---

## 25 settembre 2026

### Pagina Rimborsi e resi nel footer {#guida-resi}

**Guida.** Da pannello. Il tema ha già lo stile delle pagine di testo.

Recesso e reso non sono la stessa cosa.

- **Recesso:** il cliente cambia idea entro 14 giorni e rimanda il capo, anche se non è difettoso.
- **Reso:** di solito un problema (difetto, capo sbagliato, cambio taglia concordato).

Oggi il recesso sta dentro Termini e condizioni. Manca una pagina sua, visibile nel footer.

1. Design → Pagine. Nuova pagina, titolo **Rimborsi e resi**, in italiano e in inglese. Nel testo tenere distinti recesso e reso, con i tempi e come si scrive a `servizioclienti@barbaraalvisi.it`.
2. Design → Posizioni, oppure Moduli → **Elenco link** (`ps_linklist`) → Configura. Aggiungere la pagina nel blocco del footer, nella colonna più adatta (informazioni o assistenza).
3. Aprire il sito e controllare che la voce sia nel footer e che la pagina si legga.

Non serve codice, salvo un impianto grafico diverso da quello delle altre pagine.

### Dove vedere clienti e newsletter {#guida-clienti}

**Fatto.** Gli elenchi ci sono già. Gloria li consulta dal pannello.

- **Messaggi del form contatti:** Servizio clienti → Servizio clienti. Arrivano a `servizioclienti@barbaraalvisi.it`.
- **Clienti registrati:** Clienti → Clienti. La spunta newsletter indica chi l’ha accettata in account.
- **Iscritti alla newsletter** (anche senza account): Migliora → Moduli → Gestione moduli, cercare «Newsletter» (`ps_emailsubscription`) → Configura. Da lì si filtra e si esporta il CSV. La spunta «Attivato» disiscrive un nominativo.

### Dove si modifica il form Contattaci {#guida-form-contatti}

**Guida.** Due parti diverse.

**Dal pannello.** Servizio clienti → Contatti.

1. Ogni riga è una voce del menu **Oggetto** nel form.
2. Il titolo è il nome che vede il cliente. L’email è dove arriva quel tipo di messaggio: oggi `servizioclienti@barbaraalvisi.it`.
3. Si aggiunge, si rinomina o si toglie una voce, poi si salva.
4. Se resta una sola voce, il form non mostra il menu Oggetto: la scelta è già quella.

I messaggi inviati si leggono in Servizio clienti → Servizio clienti. Non si modificano da qui i campi del form.

**Nel tema, non nel pannello.** La frase sotto il titolo («Scrivici per assistenza su ordini, prodotti o informazioni generali»), le etichette dei campi e il pulsante «Invia messaggio» sono scritte nella pagina. Per cambiarle serve un intervento sul tema.

### Google Search Console, Merchant Center, sitemap {#guida-google}

**Guida.** Nessun abbonamento Google serve per essere trovati. Comparire in alto nei risultati a pagamento è Google Ads, ed è un’altra cosa: la ricerca normale non si compra.

Account da usare: `Brb.derwix@gmail.com`.

**Sitemap.** È l’elenco degli indirizzi del sito.

1. Moduli → Gestione moduli. Cercare **Google sitemap** (`gsitemap`) → Configura.
2. Generare la mappa. Annotare l’indirizzo che mostra il modulo. Di solito è `https://barbaraalvisi.it/1_index_sitemap.xml`: va aperto nel browser e deve elencare le pagine, non dare errore.

**Search Console.** Dice a Google che il sito esiste.

1. Aprire [Google Search Console](https://search.google.com/search-console) con l’account sopra.
2. Aggiungere la proprietà `https://barbaraalvisi.it`.
3. Verificare di essere i proprietari. I due modi soliti sono un record DNS dal pannello SiteGround, oppure un file o un tag che si carica sul sito. Finire la verifica prima di passare oltre.
4. Sitemap → aggiungi la mappa generata al punto sopra.
5. Controllare dopo qualche giorno la copertura: pagine indicizzate ed eventuali errori. Non mette il sito in prima posizione da solo.

**Merchant Center.** È il catalogo per Google Shopping. È gratuito. Da solo non mette il sito in alto.

1. Aprire [Google Merchant Center](https://merchants.google.com) con lo stesso account.
2. Creare l’account negozio, paese Italia, e verificare lo stesso sito.
3. Collegare il catalogo prodotti. Nel tema non c’è un feed: serve il modulo Google di PrestaShop, oppure un file di prodotti che Merchant legge a orari fissi. Senza questo passaggio Shopping non parte.
4. Sistemare gli avvisi sui prodotti (prezzo, disponibilità, immagine) finché il catalogo non è rifiutato.

Google Ads, se Alessia vuole la pubblicità a pagamento, si apre dopo e si collega a Merchant. Non fa parte di questa voce.

### Procedura ordini {#guida-ordini}

**Fatto.** Il flusso c’è già e la mail di conferma parte da sola.

1. Ordini → Ordini, aprire l’ordine.
2. Lo stato parte da solo (in genere «Pagamento accettato» se il pagamento è andato a buon fine).
3. Gloria aggiorna lo stato quando spedisce (per esempio «Spedito») e, se c’è, inserisce il tracking.
4. Il cliente riceve da solo la mail di riepilogo all’ordine, e le mail legate al cambio stato, se la posta del negozio è configurata. Non va inviata a mano ogni volta.

Se una di quelle mail non parte, è configurazione SMTP, non il tema.

### Brand World: galleria immagini

**Preventivo: 60 €.**

17 immagini, vicine, più grandi di una galleria telefono, **senza link** ai prodotti (se un capo finisce, la pagina resta valida). Nel tema questa pagina non c’è. Il prezzo è per la griglia, a materiale ricevuto: le 17 immagini e il testo della pagina non sono nel progetto. I file non vanno collegati alle schede prodotto.

---

## 28 settembre 2026

Spedizione 10 / 15 / gratis da 199 €: **fatto**.

Scritta in movimento più piccola sul telefono: **fatto**. La scritta Made in Italy è fatta. Entrambe le righe sono rimpicciolite, alla stessa misura.

---

## 29 settembre 2026

### Newsletter e sconto 10%

**Fatto.** Chi si iscrive alla newsletter riceve la mail «Buono sconto newsletter», con il codice **BENVENUTOALVISI10**. È lo sconto del 10% sul primo acquisto. La fascia in home («iscriviti e ricevi il 10% sul primo acquisto») corrisponde a questa mail.

### Seconda scritta al posto di «Prodotti in vetrina»

**Fatto.** Al posto del titolo fisso, in home scorre **«Scopri la qualità del vero Made in Italy»**. In inglese: «Discover the quality of true Made in Italy». Carrello, 404 e pagine vuote tengono il titolo «Prodotti in vetrina».

### Rimpicciolire entrambe le scritte

**Fatto.** La fascia newsletter e la riga «Scopri la qualità del vero Made in Italy» hanno la stessa misura: 52 px su desktop e 36 px sul telefono. Prima erano 72 px, e sul telefono solo la newsletter era scesa a 52 px.

### Mail dopo l’ordine

**Fatto.** È la stessa voce della procedura ordini: la mail è automatica.

---

## 30 settembre 2026

### Mail di iscrizione

**Fatto.** All’iscrizione la mail parte da PrestaShop. Brevo non serve. La gestione della newsletter, liste e invii, si farà in futuro e non è una modifica del tema.

### Testi delle mail {#guida-testi-mail}

**Guida.** Gloria li modifica da sola. Brevo non serve. Si possono cambiare anche dopo.

1. Internazionale → Traduzioni.
2. Tipo: **Traduzioni email**.
3. Scegliere il tema **barbaraalvisi** e la lingua, italiano o inglese.
4. Aprire la mail: conferma newsletter, buono di benvenuto, oppure le mail dell’ordine e della spedizione.
5. Modificare oggetto e testo, poi salvare. La mail successiva usa il testo nuovo.

Le mail di iscrizione sono quelle con la foto. La verifica del link, se un giorno si attiva, è un’altra mail e non ha la foto.

---

## 1 ottobre 2026

### Immagine nella mail di benvenuto

**Fatto.** La foto è nelle due mail che partono con l’iscrizione, in italiano e in inglese: conferma newsletter e buono di benvenuto. Non è nella mail di verifica del link, che resta solo testo.

Indirizzo dell’immagine: `https://barbaraalvisi.it/themes/barbaraalvisi/assets/img/newsletter/benvenuto.jpg`.

I modelli stanno nel tema, non nel modulo nativo: `themes/barbaraalvisi/modules/ps_emailsubscription/mails/`.

---

## 2 ottobre 2026

### Prodotti correlati in ordine diverso da quello impostato

**Fatto.** In scheda, «Potrebbe piacerti anche» segue l’ordine dell’elenco accessori nel pannello prodotto. Prima la pagina li metteva in ordine alfabetico. Il core PrestaShop non è stato modificato.

---

## Cosa non è codice

Per Gloria, senza intervento sul tema:

- [leggere i messaggi del form](#guida-clienti)
- [vedere dove si modifica il form Contattaci](#guida-form-contatti)
- [vedere i clienti e gli iscritti alla newsletter, esportare il CSV, disiscrivere](#guida-clienti)
- [creare la pagina Resi e metterla nel footer](#guida-resi)
- [seguire un ordine e cambiarne lo stato](#guida-ordini)
- [contare sulla mail automatica di conferma ordine e di spedizione](#guida-ordini)
- [modificare i testi delle mail da Traduzioni](#guida-testi-mail)
- [attivare la mail quando un capo torna disponibile](#guida-alert)
- [collegare Search Console, sitemap e Merchant Center](#guida-google)
