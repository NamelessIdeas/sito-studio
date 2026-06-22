# Firewall e ACL

La **difesa perimetrale** di una rete LAN consiste in sistemi di protezione
installati sul **router** che fa da interfaccia con la rete esterna (o su server
specifici), per **prevenire, rilevare e mitigare** gli attacchi. I sistemi
principali:

- **firewall** — regole di **analisi e filtraggio** dei pacchetti IP in base
  all'header del pacchetto e a quello dei protocolli incapsulati (ICMP, UDP,
  TCP);
- **IDS** *(Intrusion Detection System)* — analisi in tempo reale del contenuto
  dei pacchetti con rilevazione statistica delle anomalie o riconoscimento di
  schemi di attacco noti;
- **IPS** *(Intrusion Prevention System)* — un IDS con **risposta** automatica
  (riconfigurazione del firewall, disconnessione della rete sospetta).

Spesso si chiama «firewall» lo stesso router su cui sono configurate le regole.

!!! note "Stateless e stateful"
    Un firewall **stateless** analizza ogni pacchetto **indipendentemente** dagli
    altri: efficiente, ma inefficace contro alcuni attacchi. Un firewall
    **stateful** tiene invece traccia dei **flussi** (es. lo stato di una
    connessione TCP), filtrando in base alla relazione tra i pacchetti.
    Su Linux il filtraggio è realizzato da **nftables** (successore di
    *iptables*, nel progetto *netfilter*, che comprende anche il NAT/PAT).

## Access Control List (ACL)

Le regole di filtraggio dei pacchetti IPv4/IPv6 che realizzano un firewall sulle
**interfacce di un router** sono dette **ACL** *(Access Control List)*: liste i
cui elementi vengono **scansionati in sequenza** per ogni pacchetto in ingresso o
in uscita, fino a trovare una corrispondenza. Alla prima corrispondenza il
pacchetto è **accettato/inoltrato** o **scartato** secondo l'elemento; se
**nessun** elemento corrisponde, il pacchetto è **scartato** (*default deny*).

Per ogni elemento si definiscono tipicamente:

- indirizzo IP di **provenienza** e di **destinazione** (o intervalli);
- **protocollo** incapsulato (ICMP, UDP, TCP);
- **porta** di origine e di destinazione (TCP/UDP) o **tipo di messaggio** (ICMP);
- stato dei **flag SYN e ACK** del TCP, per distinguere le **richieste di
  connessione** dai segmenti di una connessione **già stabilita**.

L'applicazione di ACL alle interfacce produce un'analisi **stateless**.

!!! example "ACL di base per la navigazione (in ingresso sulla porta WAN)"
    Una regola tipica per consentire la navigazione e bloccare le connessioni
    *entranti* non richieste:

    | Protocollo | Origine | Porta orig. | Destinazione | Porta dest. | Tipo ICMP | Esito |
    | --- | --- | --- | --- | --- | --- | --- |
    | TCP | qualsiasi | qualsiasi | qualsiasi | qualsiasi | – | accettato **solo se** ACK=1 e SYN=0 |
    | UDP | 8.8.8.8 | 53 | qualsiasi | qualsiasi | – | accettato *(risposte DNS)* |
    | ICMP | qualsiasi | – | qualsiasi | – | 0, 3, 11 | accettato *(echo-reply, errori)* |
    | qualsiasi | qualsiasi | qualsiasi | qualsiasi | qualsiasi | qualsiasi | **scartato** |

    Accettando i soli segmenti TCP con `ACK=1` e `SYN=0` si lascia passare il
    traffico delle connessioni **aperte dall'interno**, ma si bloccano le
    **richieste di connessione** provenienti da Internet.

## Reti DMZ

Per **esporre** su Internet servizi propri (web server, mail server) bisogna
rilassare le ACL, accettando richieste di connessione dall'esterno. Poiché questi
server potrebbero essere compromessi e usati come «trampolino» per attaccare la
LAN, li si **segrega** in una rete separata, la **DMZ** *(De-Militarized Zone)*.

Il router/firewall filtra allora **tre** interfacce — Internet, DMZ e LAN — con
ACL distinte: in particolare si filtrano i pacchetti **in ingresso dalla DMZ**,
così che un server compromesso non possa aprire connessioni verso la LAN.

!!! tip "Il cloud riduce la DMZ"
    Eseguire i servizi aziendali su un **server virtuale cloud** evita di creare
    una DMZ nella propria rete e ne aumenta la sicurezza (vedi [Server e servizi
    cloud](../02-server-e-cloud/index.md)).

!!! note "ACL e NAT"
    Su una LAN con indirizzamento IPv4 privato il router applica **NAT/PAT**: di
    norma le ACL sono valutate **prima** della traduzione per i pacchetti in
    uscita e **dopo** per quelli in ingresso. La scelta di usare il *port-forwarding*
    per la DMZ non sostituisce le regole del firewall.

La difesa **in profondità** (Zero-Trust) estende questo approccio dai confini ai
**singoli sistemi**: vedi [Principi di sicurezza e
attacchi](../03-sicurezza-crittografia/01-principi-e-attacchi.md#best-practice-e-difesa-in-profondita).
