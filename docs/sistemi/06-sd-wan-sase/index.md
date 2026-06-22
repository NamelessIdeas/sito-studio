# SD-WAN e SASE

Le WAN aziendali tradizionali, fondate su circuiti dedicati
[MPLS](../05-gestione-reti/index.md#architettura-mpls) acquistati dall'operatore,
sono affidabili ma **costose** e **rigide**: ogni nuova sede richiede tempi e
contratti lunghi, e il traffico verso i servizi **cloud** è costretto a passare
dal data-center centrale (*backhauling*), con spreco di banda e latenza. Da qui
due evoluzioni recenti e collegate: **SD-WAN** (l'evoluzione della rete) e
**SASE** (la convergenza di rete e sicurezza nel cloud).

## SD-WAN

**SD-WAN** *(Software-Defined Wide Area Network)* è un'architettura WAN
**virtuale** che disaccoppia la rete logica dai collegamenti fisici, applicando
alla WAN i principi delle **reti definite dal software** (SDN): la separazione
tra **control plane** (le decisioni, centralizzate) e **data plane** (l'inoltro,
sui dispositivi).

### Underlay e overlay

- **underlay** — i collegamenti **fisici** di trasporto: MPLS, fibra/DSL
  *broadband*, **LTE/5G**. SD-WAN può usarne **qualsiasi combinazione**
  contemporaneamente.
- **overlay** — la rete virtuale (un insieme di **tunnel cifrati**, tipicamente
  IPsec) che SD-WAN costruisce **sopra** l'underlay, astraendone le differenze.

In altre parole, **MPLS è underlay**, **SD-WAN è overlay**: non sono alternative
sullo stesso piano, e infatti spesso convivono.

### Come funziona

Un **controller** centralizzato (gestito via cloud) definisce le **politiche**;
gli apparati nelle sedi (*edge*) le applicano in autonomia. Caratteristiche
chiave:

- **gestione centralizzata** — configurazione e monitoraggio di tutte le sedi da
  un'unica console (provisioning rapido di nuove sedi, *zero-touch*);
- **instradamento application-aware** — l'apparato **riconosce le applicazioni** e
  sceglie dinamicamente il collegamento migliore per ciascuna (es. la
  videoconferenza sul link a bassa latenza, i backup sul *broadband*),
  rispettando le esigenze di [QoS](../05-gestione-reti/index.md#qos-qualita-del-servizio);
- **resilienza** — se un collegamento si degrada o cade, il traffico viene
  spostato sugli altri in modo trasparente;
- **sicurezza** — i tunnel dell'overlay sono **cifrati** (IPsec); il traffico
  verso i servizi cloud può uscire **direttamente** dalla sede (*local
  breakout*), senza *backhauling* al data-center.

| | MPLS | SD-WAN |
| --- | --- | --- |
| **Piano** | underlay (circuito fisico) | overlay (rete virtuale) |
| **Trasporto** | dedicato dell'operatore | qualsiasi (MPLS, broadband, LTE/5G) |
| **SLA** | garantito dal contratto | dipende dai collegamenti usati |
| **Costo** | alto | più basso (sfrutta Internet) |
| **Gestione** | per sede, lenta | centralizzata, rapida |
| **Verso il cloud** | *backhauling* al data-center | *local breakout* diretto |

## SASE

Spostare il *breakout* verso Internet nelle singole sedi (e per gli utenti in
mobilità) sposta però anche il **perimetro di sicurezza**: non basta più
difendere il solo data-center. La risposta è **SASE** *(Secure Access Service
Edge*, pronuncia «sassi»*)*, modello descritto da **Gartner nel 2019**: la
**convergenza** delle funzioni di **rete** (SD-WAN) e di **sicurezza** in un
unico servizio **cloud-nativo**, erogato «al bordo» (*edge*), vicino a utenti e
dispositivi ovunque si trovino.

### Le componenti

SASE = **SD-WAN** (la parte di rete) **+ SSE** *(Security Service Edge*, la parte
di sicurezza erogata dal cloud). Le funzioni di sicurezza tipiche:

- **ZTNA** *(Zero Trust Network Access)* — sostituisce le VPN tradizionali: dà
  accesso **solo alle singole applicazioni** di cui l'utente ha bisogno (non
  all'intera rete), verificando di continuo identità e stato del dispositivo. È
  l'applicazione concreta del principio
  [Zero-Trust](../03-sicurezza-crittografia/01-principi-e-attacchi.md#best-practice-e-difesa-in-profondita).
- **SWG** *(Secure Web Gateway)* — filtra il traffico web, bloccando siti
  malevoli, malware e contenuti non consentiti.
- **CASB** *(Cloud Access Security Broker)* — controlla l'uso sicuro delle
  applicazioni cloud (prevenzione della fuga di dati, conformità, visibilità).
- **FWaaS** *(Firewall as a Service)* — il *firewall* erogato dal cloud
  (*intrusion prevention*, *deep packet inspection* di livello 7), senza
  apparati fisici in ogni sede.

!!! note "SASE e SSE"
    **SSE** è il **sottoinsieme di sola sicurezza** di SASE (ZTNA, SWG, CASB,
    FWaaS erogati dal cloud), **senza** la componente di rete SD-WAN. Quando tutte
    le funzioni sono fornite da **un unico fornitore** si parla di *single-vendor
    SASE*.

### Perché conta

SASE risponde a una rete che è cambiata: utenti **in mobilità**, applicazioni nel
**cloud**, perimetro tradizionale dissolto. Invece di concentrare la sicurezza in
un punto (il data-center) e farvi convergere tutto il traffico, SASE la
**distribuisce nel cloud** vicino all'utente, unificando rete e sicurezza in
un'unica policy gestita centralmente: è l'approdo, su scala globale e
cloud-nativa, della **difesa in profondità** e dei principi
[Zero-Trust](../03-sicurezza-crittografia/01-principi-e-attacchi.md).

!!! info "Fonti"
    Definizioni verificate su Palo Alto Networks (*SD-WAN architecture*,
    *SD-WAN vs MPLS*), Cato Networks e Fortinet (*SASE secondo Gartner*, *SSE*),
    Cisco (*SASE/SSE architecture guide*) e *Secure access service edge*
    (Wikipedia). Il termine SASE è stato coniato da **Gartner** nel **2019**.
