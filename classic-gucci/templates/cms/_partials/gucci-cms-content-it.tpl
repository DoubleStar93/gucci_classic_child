{**
 * Classic Gucci — contenuti CMS demo in italiano (fino a traduzione BO)
 * Richiede: $gucciCmsKey (delivery|legal|terms|about|payment)
 *}
{if $gucciCmsKey == 'delivery'}
  <p>Le spedizioni vengono generalmente evase entro 2 giorni lavorativi dalla conferma del pagamento. Riceverai un&apos;email con il tracking non appena il pacco sarà affidato al corriere.</p>
  <h3>Costi di spedizione</h3>
  <p>Le spese di spedizione includono imballo e trasporto. Il costo varia in base al peso e alla destinazione. Ti consigliamo di raggruppare più articoli in un unico ordine per ottimizzare i costi.</p>
  <h3>Resi</h3>
  <p>Puoi richiedere un reso entro 14 giorni dalla consegna, per articoli non indossati e con etichette originali. Contattaci per avviare la procedura.</p>
{elseif $gucciCmsKey == 'legal'}
  <p>Questo sito è gestito da {$shop.name|escape:'htmlall':'UTF-8'}. I contenuti pubblicati (testi, immagini, marchi) sono protetti dalle norme sul diritto d&apos;autore e sulla proprietà intellettuale.</p>
  <p>Per informazioni sul titolare del trattamento dei dati personali e sui diritti degli interessati, consulta l&apos;informativa privacy e i termini di utilizzo del sito.</p>
{elseif $gucciCmsKey == 'terms'}
  <p>L&apos;utilizzo di questo sito implica l&apos;accettazione delle presenti condizioni. I prezzi e la disponibilità dei prodotti possono essere aggiornati senza preavviso.</p>
  <p>Gli ordini sono vincolanti dopo la conferma via email. Ci riserviamo il diritto di annullare ordini in caso di errore manifesto su prezzi o disponibilità.</p>
{elseif $gucciCmsKey == 'about'}
  <p>{$shop.name|escape:'htmlall':'UTF-8'} è uno spazio dedicato a una selezione curata di prodotti, con attenzione alla qualità, al design e all&apos;esperienza di acquisto.</p>
  <p>Per assistenza, informazioni su ordini o collaborazioni, utilizza la pagina Contatti o scrivici all&apos;indirizzo indicato nel footer.</p>
{elseif $gucciCmsKey == 'payment'}
  <p>Accettiamo i principali metodi di pagamento disponibili in checkout. Le transazioni sono elaborate tramite gateway certificati; i dati della carta non vengono memorizzati sui nostri server.</p>
  <p>In caso di problemi con un pagamento, verifica i dati inseriti o contattaci prima di ripetere l&apos;ordine.</p>
{/if}
