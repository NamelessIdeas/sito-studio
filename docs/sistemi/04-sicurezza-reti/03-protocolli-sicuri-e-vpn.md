# Protocolli sicuri e VPN

La sicurezza di una comunicazione si può ottenere a **livelli diversi** dello
stack di rete: più in basso si opera, più protocolli soprastanti ne beneficiano
in modo trasparente.

| Livello | Protocollo sicuro | Protegge |
| --- | --- | --- |
| 7 — Applicazione | **HTTPS** | il traffico web |
| 5 — Sessione | **TLS / DTLS** | qualsiasi protocollo applicativo (TCP/UDP) |
| 3 — Rete | **IPsec** | i pacchetti IP (base delle **VPN**) |
| 2 — Collegamento | **MACsec** | i frame Ethernet sul singolo collegamento |

Tutti questi protocolli applicano il modello della [cifratura
ibrida](../03-sicurezza-crittografia/02-crittografia.md#cifratura-ibrida):
scambio asimmetrico di una **chiave di sessione**, poi cifratura **simmetrica**
veloce e autenticazione con **MAC**.

## IPsec e VPN

**IPsec** *(IP-security)* (RFC 4301–4303) garantisce **autenticazione e
cifratura** dei pacchetti IPv4/IPv6 a **livello di rete**, in modo trasparente
per trasporto e applicazione. È costituito da due protocolli alternativi:

- **AH** *(Authentication Header)* — autentica l'origine e garantisce l'integrità,
  ma **non cifra**;
- **ESP** *(Encapsulating Security Payload)* — **cifra** e autentica il contenuto;
  è quello usato quasi sempre per le VPN.

E da due **modalità**:

- **transport** — mantiene l'header IP originale (host-to-host);
- **tunnel** — **incapsula** l'intero pacchetto in uno nuovo, con header IP
  diversi: è la modalità delle VPN tra reti.

!!! note "SA, SAD, SPD e IKE"
    Poiché in IP i pacchetti non appartengono a un flusso prestabilito, IPsec
    stabilisce connessioni logiche unidirezionali, le **Security Association
    (SA)**, identificate da un valore **SPI**. Ogni dispositivo mantiene due
    tabelle: il **SAD** *(Security Association Database)*, con i parametri di ogni
    SA, e lo **SPD** *(Security Policy Database)*, che per ogni *selettore* di
    pacchetti decide la politica **DISCARD** (scarta), **BYPASS** (non cifra) o
    **PROTECT** (incapsula). La negoziazione delle SA usa il protocollo **IKE**
    *(Internet Key Exchange)*, su UDP porta 500, che implementa una variante di
    Diffie-Hellman.

Una **VPN** *(Virtual Private Network)* realizza una rete privata **sopra**
Internet:

- **end-to-end** — interconnette due *end device* (IPsec transport o tunnel);
- **site-to-site** — interconnette due **LAN** (due sedi della stessa
  organizzazione); i router di confine generano/ricevono i pacchetti IPsec in
  **modalità tunnel**. È il modo economico con cui le aziende realizzano una
  [WAN](../01-progettazione-lan-wan/02-tecnologie-wan-e-accesso.md#collegamenti-point-to-point-e-wan-aziendali).

## SSH

**SSH** *(Secure Shell)*, versione 2 (RFC 4250-4256), è un protocollo di
**livello di sessione** che crea un **tunnel cifrato** per protocolli di livello
superiore; usa di norma **TCP** sulla **porta 22**. Tipicamente serve per la
connessione sicura alla **shell** di comando di un sistema remoto (es. un server
Linux su [AWS](../02-server-e-cloud/index.md#la-piattaforma-aws)). Comprende:

- **transport layer protocol** — riservatezza, integrità e autenticazione (scambio
  chiavi DH o RSA, cifratura AES, MAC HMAC-SHA);
- **authentication protocol** — autentica il **client** presso il server con
  **password** o **public-key** (il client si registra inviando la propria chiave
  pubblica);
- **connection protocol** — gestisce i **tunnel** (shell, *direct-tcpip*,
  *forwarded-tcpip*), anche per il *tunneling* di connessioni TCP legacy.

I protocolli applicativi **SFTP** (FTP su SSH) ne sono un esempio d'uso.

## TLS, DTLS e HTTPS

**TLS** *(Transport Layer Security)* — erede di **SSL** — è il protocollo di
**livello di sessione** che rende sicuro qualsiasi protocollo applicativo su TCP.
La versione **1.3** (RFC 8446, 2018) ha ridotto drasticamente gli algoritmi
ammessi rispetto alla **1.2**. Si fonda su un **record protocol** e su alcuni
protocolli di servizio: **handshake** (negozia algoritmi e chiavi di sessione),
**change cipher spec**, **alert**, **heartbeat**.

L'**handshake** parte con crittografia **asimmetrica** (il server invia il
proprio **certificato**, che il client verifica) e, scambiata la chiave *master*
e generate le chiavi di sessione, passa alla crittografia **simmetrica**. In TLS
1.3 bastano **2 messaggi (1 round-trip)** usando solo Diffie-Hellman.

- **DTLS** *(Datagram TLS)* offre le stesse garanzie ai protocolli su **UDP**,
  gestendo perdita e riordino dei datagram con numeri di sequenza.
- **HTTPS** è il protocollo applicativo **HTTP** reso sicuro da TLS al livello di
  sessione: schema `https://`, porta **TCP 443**, handshake TLS dopo la
  connessione TCP.

!!! note "Evoluzione di HTTP: HTTP/2 e HTTP/3"
    - **HTTP/2** (2015) mantiene la semantica di HTTP/1.1 ma introduce il
      **multiplexing** di più *stream* su un'unica connessione TCP, la
      compressione degli header e la modalità *push*.
    - **HTTP/3** (2020) usa **UDP** come trasporto tramite il protocollo
      **QUIC**, che **incorpora** affidabilità, controllo di flusso e le
      funzionalità di **cifratura TLS** (obbligatoria); le connessioni hanno un
      identificatore univoco e sopravvivono al cambio di indirizzo IP.

## MACsec

**MACsec** (IEEE 802.1AE) è un protocollo sicuro del **livello di collegamento**
per LAN Ethernet: sul **singolo collegamento** (end-device↔switch o
switch↔switch) garantisce **confidenzialità, integrità e autenticità** dei frame.
Opera **hop-by-hop** (cifra e decifra a ogni salto) con AES-GCM, calcolando un
**ICV** *(Integrity Check Value)*. A differenza di IPsec, l'elaborazione
crittografica è fatta **in hardware** dalle porte degli switch, scalando fino a
oltre 100 Gbps. Le chiavi sono gestite da **MKA** *(MACsec Key Agreement)*, con
una **CAK** *(Connectivity Association Key)* installata manualmente (PSK) o
ottenuta via **IEEE 802.1X/EAP** e una **SAK** *(Secure Association Key)*
distribuita dal *Key Server*.

!!! tip "Collegamenti"
    Tutti questi protocolli si appoggiano agli stessi mattoni: cifratura
    simmetrica, scambio di chiavi DH e **certificati** della
    [crittografia](../03-sicurezza-crittografia/02-crittografia.md). La cifratura
    del traffico Wi-Fi e l'uso di 802.1X sono trattati in [Autenticazione e
    controllo dell'accesso](../03-sicurezza-crittografia/03-autenticazione-e-accesso.md).
