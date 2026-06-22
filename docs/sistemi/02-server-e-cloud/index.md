# Server e servizi cloud

Le applicazioni software moderne hanno una componente **front-end** (eseguita sul
dispositivo dell'utente) e una **back-end** (eseguita su un server remoto,
spesso tramite il protocollo HTTP). Il modo in cui si collocano i server della
componente back-end è cambiato profondamente: dalla sala macchine aziendale al
**cloud**.

## Dove stanno i server: dall'on-premise al cloud

- **on-premise** — server fisici collocati nell'infrastruttura di rete
  dell'organizzazione;
- **hosted/housed** — server fisici collocati in un **data-center** che noleggia
  hardware, software di base e connettività;
- **cloud** — **server virtuali** in esecuzione su schiere di server fisici in un
  data-center; hardware e software si configurano tramite servizi accessibili via
  Internet.

La soluzione **cloud** è oggi la più adottata.

## Il data-center

Un **data-center** è una struttura che ospita server, storage e connettività con
elevati standard di continuità: **gruppi di continuità (UPS)**, **generatori**
di emergenza, **condizionamento**, **pavimento rialzato**, controllo degli
accessi e un **NOC** (*Network Operation Center*) per il monitoraggio. Lo
standard *Uptime Institute* classifica l'affidabilità in **Tier** crescenti:

| Tier | Caratteristica principale | Disponibilità |
| --- | --- | --- |
| **1** | nessuna ridondanza | 99,671 % (~28,8 h/anno di interruzione) |
| **2** | alimentazione e raffreddamento ridondati | 99,749 % (~22 h/anno) |
| **3** | manutenzione senza interruzione del servizio | 99,982 % (~1,6 h/anno) |
| **4** | tollerante ai guasti, percorsi sempre attivi | 99,995 % (~0,4 h/anno) |

### Organizzazione e infrastruttura

L'integrazione di computazione, connettività e storage in un'unica
infrastruttura è detta **HCI** (*Hyper-Converged Infrastructure*). Lo storage ad
alte prestazioni è realizzato con reti dedicate **SAN** (*Storage Area Network*),
in tecnologia *Fibre Channel* o Ethernet su fibra. La virtualizzazione e le SAN
hanno fatto esplodere il **traffico est-ovest** (tra rack), superando quello
**sud-nord** (verso Internet): per questo l'architettura gerarchica a tre livelli
ha lasciato il posto a quella a due livelli **leaf-spine** (gli *switch* *leaf*
dei rack collegati a una matrice di *switch* *spine*).

## Virtualizzazione

I server virtuali sono **macchine virtuali** (VM) simulate da software detti
**hypervisor**:

- **hypervisor di tipo 1** — sostituiscono il sistema operativo del server
  fisico ospite (eseguono direttamente sull'hardware);
- **hypervisor di tipo 2** — sono eseguiti come applicazioni dentro il sistema
  operativo *host* del server fisico.

Ogni VM esegue il proprio **sistema operativo guest** e, dentro di esso, le
applicazioni. Il vantaggio è poter **ridefinire dinamicamente** le risorse di
una VM (CPU, RAM, rete) in base al carico, pagando un costo proporzionale
all'uso effettivo.

!!! note "Container"
    Un **container** impacchetta tutto il necessario all'esecuzione di
    un'applicazione (codice, librerie, database, web server…) condividendo però
    il **kernel** del sistema operativo *host*, senza un sistema operativo guest
    completo: è quindi molto più **leggero** di una VM. L'ambiente più diffuso è
    **Docker**, alternativa agli hypervisor di tipo 2.

## Cloud computing

I servizi **cloud computing** hanno cinque caratteristiche: **accesso via rete**
(con strumenti standard come il browser), **elasticità** (le risorse crescono e
calano rapidamente), **misurazione** (l'uso è monitorato e fatturato),
**accesso a richiesta** (senza intervento del fornitore) e **condivisione di
risorse** tra più clienti. Si articolano in tre **modelli di servizio**:

| Modello | Cosa offre | Esempio |
| --- | --- | --- |
| **SaaS** *(Software as a Service)* | l'**applicazione** pronta all'uso, senza installarla (si usa via browser/APP) | Google Workspace, web-mail |
| **PaaS** *(Platform as a Service)* | un **ambiente di sviluppo/esecuzione** (database, web server, librerie esposti come API) | Google Cloud Platform |
| **IaaS** *(Infrastructure as a Service)* | **server, storage e reti** virtualizzati da configurare | Amazon AWS |

Scendendo da SaaS verso IaaS aumenta ciò che resta a carico del cliente
(*runtime*, middleware, sistema operativo…) e diminuisce ciò che gestisce il
*cloud service provider*; all'estremo opposto sta l'**on-premise**, dove tutto è
a carico del proprietario.

!!! info "DevSecOps"
    La distribuzione cloud favorisce un ciclo continuo di sviluppo e operazioni
    (**DevOps**, *Continuous Integration / Continuous Deployment*) in cui la
    **sicurezza** è integrata in ogni fase: *plan, code, build, test, release,
    deploy, operate, monitor* — da cui **DevSecOps**.

## La piattaforma AWS

**Amazon Web Services (AWS)** è la più vasta offerta pubblica di servizi cloud,
con data-center distribuiti in **regioni** in tutto il mondo. I principali
servizi **IaaS**:

- **EC2** *(Elastic Compute Cloud)* — creazione e gestione di **server virtuali**
  (istanze), con la possibilità di modificarne le caratteristiche nel tempo;
- **EBS** *(Elastic Block Store)* — **unità di memoria permanente** virtuali da
  connettere alle istanze EC2;
- **VPC** *(Virtual Private Cloud)* — **reti LAN virtuali** che interconnettono
  le istanze tra loro e con Internet.

La gestione di un server Linux su EC2 avviene tipicamente con una connessione
remota sicura **SSH** alla *shell* dei comandi (vedi [Protocolli sicuri e
VPN](../04-sicurezza-reti/03-protocolli-sicuri-e-vpn.md#ssh)).
