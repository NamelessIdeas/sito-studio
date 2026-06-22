# Gestione delle reti

Alla rete di un'organizzazione si chiede di funzionare con prestazioni adeguate
**24 ore su 24, 7 giorni su 7**. Il **NOC** *(Network Operation Center)* monitora
la rete per assicurarne la continuità; il modello gestionale tradizionale,
**FCAPS**, individua cinque aree: *Fault, Configuration, Accounting, Performance,
Security management*. Una tecnica comune è registrare i parametri durante il
funzionamento normale per definire una **baseline**: uno scostamento
significativo segnala un sovraccarico, un guasto o un attacco.

## QoS (qualità del servizio)

Le reti moderne sono **multiservizio**: trasportano insieme servizi tradizionali
(mail, web, file) e servizi in **tempo reale** (voce, video, gaming), che
tollerano poco **delay** e **jitter**. La **QoS** *(Quality of Service)* è
l'insieme delle tecniche con cui si gestisce il traffico per garantire a ogni
classe i parametri necessari, anche in condizioni di congestione.

- **Classificazione e marcatura** — i pacchetti sono assegnati a **classi di
  servizio** e marcati di conseguenza (es. campo *DSCP* nell'header IP, tag
  IEEE 802.1Q nelle LAN).
- **Gestione delle code** *(queuing)* — i router servono le code con politiche di
  **priorità** (il traffico in tempo reale prima di quello *best-effort*).
- **Controllo del traffico** — *policing* (scarta il traffico oltre soglia) e
  *shaping* (lo ritarda livellandolo).

Due modelli: **IntServ** (prenotazione di risorse per singolo flusso, poco
scalabile) e **DiffServ** (gestione per **classi** aggregate, scalabile, oggi
prevalente).

## Protocollo SNMP

Il **SNMP** *(Simple Network Management Protocol)* è un protocollo di **livello
applicativo** su **UDP** che permette di **monitorare** da remoto i dispositivi
di rete (server, router, switch, stampanti) e, all'occorrenza, modificarne la
configurazione. I suoi attori:

- **managed device** — il dispositivo gestito su cui SNMP è abilitato;
- **MIB** *(Management Information Base)* — un database, presente su ogni
  *managed device*, con i parametri **statici** (banda massima, versione del SO) e
  **dinamici** (pacchetti ricevuti, temperatura della CPU) del dispositivo;
- **agent** — modulo software sul *managed device* che popola e aggiorna il MIB;
- **manager** *(NMS, Network Management Station)* — il punto di centralizzazione,
  nel NOC, che interroga gli agent.

!!! note "OID e gerarchia del MIB"
    I parametri del MIB sono organizzati in un albero gerarchico di **namespace**
    contenenti **OID** *(Object IDentifier)* secondo la notazione **SMIv2**. Ogni
    ramo ha un numero: il percorso dalla radice all'oggetto **è** il suo OID. I
    parametri standard stanno sotto `1.3.6.1` (`...mib-2`), quelli specifici di
    ogni produttore sotto il nodo *enterprise* (`1.3.6.1.4.1`).

### Operazioni e versioni

La comunicazione avviene su **UDP porta 161** per richieste/risposte e **porta
162** per le *trap*. I principali tipi di **PDU**:

- **GetRequest / GetNextRequest / GetBulkRequest** — il manager legge variabili
  del MIB;
- **SetRequest** — il manager modifica una variabile;
- **Response** — l'agent risponde con i valori richiesti;
- **Trap** — notifica **asincrona** dall'agent al manager al verificarsi di un
  evento significativo (l'*InformRequest* è una trap con conferma).

Le versioni: **v1** (priva di sicurezza), **v2c** (base della v3), **v3** (2004),
che aggiunge **riservatezza** (AES) e **autenticazione** (HMAC-SHA) con i modelli
**USM** *(User-based Security Model)* e **VACM** *(View-based Access Control
Model)*; in alternativa si rende sicuro con **DTLS**.

## Architettura MPLS

**MPLS** *(Multi-Protocol Label Switching)* è una tecnologia di inoltro che opera
«tra» il livello 2 e il livello 3 (talvolta detta «livello 2,5»): invece di
instradare ogni pacchetto in base all'indirizzo IP di destinazione, i router di
confine **MPLS** (*Label Edge Router*) applicano al pacchetto una **etichetta**
(*label*), e i router interni (*Label Switch Router*) lo inoltrano lungo un
percorso predeterminato — il **LSP** *(Label Switched Path)* — guardando **solo
l'etichetta**, che viene scambiata a ogni salto (*label swapping*).

Vantaggi:

- **velocità** — l'inoltro per etichetta è più semplice del *lookup* sulla
  tabella di routing IP;
- **traffic engineering** — i percorsi LSP si possono pianificare per bilanciare
  il carico e rispettare gli SLA;
- **QoS** e **VPN** — l'etichetta consente di trasportare classi di servizio e di
  realizzare VPN di livello operatore.

!!! note "MPLS e SD-WAN"
    Per anni le WAN aziendali si sono fondate su circuiti **MPLS** acquistati
    dall'operatore, affidabili ma costosi. Le architetture
    [SD-WAN](../06-sd-wan-sase/index.md) li sostituiscono o affiancano con un
    *overlay* su connessioni Internet eterogenee.
