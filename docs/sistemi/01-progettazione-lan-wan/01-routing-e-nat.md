# Routing dinamico OSPF e NAT

Per far comunicare le sottoreti di un'organizzazione tra loro e con Internet,
ogni **router** deve sapere su quale interfaccia inoltrare un pacchetto in base
all'indirizzo IP di destinazione: questa conoscenza è la **tabella di
instradamento** (*routing table*). Con il **routing dinamico** le tabelle si
costruiscono e si aggiornano da sole grazie a un **protocollo di routing**; con
il **NAT** gli indirizzi privati della LAN vengono tradotti negli indirizzi
pubblici necessari per la rete Internet.

## Routing statico e dinamico

- **Routing statico:** le rotte sono inserite a mano dall'amministratore.
  Semplice e prevedibile, ma non si adatta ai guasti e diventa ingestibile su
  reti grandi.
- **Routing dinamico:** i router si scambiano informazioni sui percorsi con un
  protocollo e ricalcolano automaticamente le rotte quando la topologia cambia
  (un collegamento cade, se ne aggiunge uno nuovo…).

I protocolli **interni** a un'organizzazione (*Interior Gateway Protocol*, IGP)
si dividono in due famiglie: a **vettore di distanza** (es. RIP) e a **stato dei
collegamenti** (*link-state*), a cui appartiene **OSPF**.

## OSPF (Open Shortest Path First)

**OSPF** è un protocollo di routing dinamico **link-state**, standard aperto
IETF, oggi il più usato all'interno delle reti aziendali. Idea di fondo: ogni
router costruisce una **mappa completa** della rete e poi calcola da solo i
percorsi migliori.

- **Scoperta dei vicini.** Ogni router invia pacchetti **Hello** sulle proprie
  interfacce per individuare i router adiacenti e instaurare con loro
  un'*adiacenza*.
- **Scambio dello stato dei collegamenti.** I router si scambiano messaggi
  **LSA** (*Link-State Advertisement*) che descrivono le proprie interfacce e i
  costi associati; tutti convergono così sullo **stesso** database della
  topologia (*Link-State Database*).
- **Calcolo dei percorsi.** A partire da quel database ogni router applica
  l'algoritmo di **Dijkstra** (*Shortest Path First*) per costruire l'albero dei
  cammini minimi verso ogni destinazione. Il **costo** di un collegamento è
  inversamente proporzionale alla sua **banda**: OSPF preferisce i percorsi più
  veloci, non semplicemente quelli con meno salti.
- **Aree.** Per limitare la dimensione del database nelle reti grandi, OSPF
  organizza la rete in **aree** che fanno capo a un'area dorsale (*area 0*),
  riducendo il traffico di aggiornamento e i tempi di calcolo.

!!! note "Convergenza"
    Si dice **convergenza** il processo con cui, dopo un cambiamento di
    topologia, tutti i router tornano ad avere tabelle di instradamento coerenti.
    OSPF converge rapidamente perché propaga solo le **variazioni** di stato, non
    l'intera tabella periodicamente.

## NAT (Network Address Translation)

Gli indirizzi IPv4 **pubblici** sono una risorsa scarsa: una LAN usa quindi
indirizzi **privati** (RFC 1918, es. `192.168.0.0/16`, `10.0.0.0/8`) e il router
di confine traduce gli indirizzi quando i pacchetti entrano o escono dalla rete
Internet. Questa traduzione è il **NAT**.

| Tipo | Funzionamento | Uso tipico |
| --- | --- | --- |
| **NAT statico** | associazione **fissa** uno-a-uno tra un indirizzo privato e uno pubblico | esporre un server interno con un indirizzo pubblico stabile |
| **NAT dinamico** | associazione **temporanea** presa da un *pool* di indirizzi pubblici | più host privati che accedono a Internet a turno |
| **PAT** *(NAT overload)* | molti host privati condividono **un solo** indirizzo pubblico, distinti dal **numero di porta** | il caso domestico/aziendale più comune |

Il **PAT** (*Port Address Translation*) è la forma più diffusa: il router tiene
una tabella che, per ogni connessione uscente, associa la coppia
*(indirizzo privato, porta)* a una coppia *(indirizzo pubblico, porta)*, così da
smistare correttamente i pacchetti di risposta.

!!! warning "NAT non è sicurezza"
    Nascondere gli indirizzi privati dietro il NAT rende gli host interni non
    raggiungibili *direttamente* dall'esterno, ma **non** sostituisce un
    *firewall*: la protezione vera è data dalle regole di filtraggio (vedi
    [Firewall e ACL](../04-sicurezza-reti/02-firewall-acl.md)). Per pubblicare un
    servizio interno si usa il NAT statico o il *port-forwarding*, che però
    aprono un varco verso la LAN e vanno accompagnati da ACL adeguate.

!!! tip "Collegamenti"
    Il NAT entra in gioco anche nella difesa perimetrale: di norma le ACL sono
    applicate **prima** della traduzione per i pacchetti in uscita e **dopo** per
    quelli in ingresso. Le tecnologie con cui la WAN raggiunge fisicamente
    Internet sono in [Tecnologie WAN e accesso a
    Internet](02-tecnologie-wan-e-accesso.md).
