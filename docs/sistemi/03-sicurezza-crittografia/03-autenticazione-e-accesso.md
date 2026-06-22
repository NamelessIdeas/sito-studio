# Autenticazione e controllo dell'accesso

Autenticare **utenti** e **servizi** e controllare l'accesso alla rete sono
applicazioni dirette dei principi [AAA](01-principi-e-attacchi.md#la-triade-aaa)
e della [crittografia](02-crittografia.md). Qui si vedono la sicurezza delle
**W-LAN** (WPA-2/WPA-3) e le tecnologie di **Network Access Control** basate su
**IEEE 802.1X** e **RADIUS**.

## Sicurezza delle W-LAN

A differenza di una rete cablata, una **W-LAN** ha una vulnerabilità
**intrinseca**: non potendone delimitare con precisione l'area di copertura, è
fisicamente accessibile a chiunque abbia una scheda wireless. La sicurezza va
quindi affidata a tecniche **crittografiche** di autenticazione e cifratura del
traffico. Gli standard si sono evoluti nel tempo:

| Anno | Standard | Sicurezza | Note |
| --- | --- | --- | --- |
| 1997 | IEEE 802.11 | **WEP** | molto debole, deprecato nel 2004 |
| 2003 | Wi-Fi | **WPA** | bozza provvisoria dell'802.11i |
| 2004 | IEEE 802.11i | **WPA-2** (RSN) | AES-CCMP; standard per 15 anni |
| 2018 | Wi-Fi | **WPA-3** | SAE, protezione post-quantistica |

### Modalità *personal* ed *enterprise*

- **personal** — si condivide una **passphrase** (PSK, *Pre-Shared Key*) tra
  tutti gli utenti. Pratica e sicura solo in ambito domestico o piccola
  organizzazione; cambiare la chiave coinvolge tutti.
- **enterprise** — ogni utente ha **credenziali proprie** (username/password).
  Richiede un **server RADIUS** nel sistema di distribuzione, che usa il
  protocollo **IEEE 802.1X** per dialogare con l'access point. Scalabile e
  gestibile per singolo utente.

### Funzionamento di WPA-2

Da credenziali (PSK o 802.1X) e dagli indirizzi MAC si deriva una **PMK**
*(Pairwise Master Key)*; il **4-way handshake** scambia dei *nonce* (ANonce,
SNonce) e produce la **PTK** *(Pairwise Transient Key)*, usata per **cifrare** il
traffico unicast (AES) e calcolare il **MIC** *(Message Integrity Code)* a
garanzia dell'integrità. Vulnerabilità note di WPA-2: **brute-force offline**,
violazione del 4-way handshake, attacco **KRACK**, attacchi *side-channel*.

### WPA-3 e SAE

**WPA-3** sostituisce il 4-way handshake basato su PSK con **SAE** *(Simultaneous
Authentication of Equals)*, un *Password-Authenticated Key Exchange* su curve
ellittiche (protocollo *Dragonfly*) che **non rivela nulla** della password e
rende la PMK indipendente da essa, vanificando il brute-force offline. Aggiunge
inoltre **OWE** (cifratura anche sulle reti *Open*) e **Wi-Fi Easy Connect**
(DPP, alternativa sicura a WPS).

## Network Access Control (NAC)

Il **NAC** *(Network Access Control)* comprende le tecnologie che **autorizzano e
limitano** l'accesso degli utenti alle risorse di una LAN una volta autenticati;
molte impiegano un server **NAS** *(Network Access Server)*. La tecnologia NAC
più usata, per LAN Ethernet e soprattutto per le W-LAN, è **IEEE 802.1X**, che si
appoggia a **EAP** per autenticare gli utenti e a **RADIUS** per dialogare con il
NAS.

### IEEE 802.1X e RADIUS

L'architettura 802.1X ha tre attori:

- **supplicant** *(peer)* — il dispositivo che richiede l'accesso;
- **authenticator** — lo *switch* o l'access point che consente l'accesso
  partecipando all'autenticazione;
- **authentication server** — il server **NAS** (RADIUS) che verifica le
  credenziali.

**IEEE 802.1X** è un protocollo di **livello di collegamento** che prevede uno
stato **non autorizzato** (in cui passa solo il traffico **EAPOL**, *EAP Over
LAN*) e uno **autorizzato** (in cui passa il traffico dati). **RADIUS** *(Remote
Authentication Dial-In User Service)* è invece un protocollo **AAA** di livello
applicativo su **UDP** (porta 1812 per autenticazione/autorizzazione, 1813 per
l'accounting); se non si impiega MACsec o IPsec, la sua sicurezza può essere
garantita con **DTLS**.

### EAP (Extensible Authentication Protocol)

**EAP** è il quadro di autenticazione estensibile: il numero di messaggi scambiati
dipende dal **metodo** negoziato. I principali:

- **EAP-TLS** — mutua autenticazione con scambio di **certificati** da entrambe le
  parti, basata sull'handshake TLS;
- **EAP-TTLS** — handshake TLS in cui **solo il server** ha un certificato; il
  tunnel cifrato protegge l'autenticazione del *peer*;
- **EAP-GPSK** — scambio basato su chiave **pre-condivisa**, senza crittografia
  asimmetrica;
- **EAP-IKEv2** — usa lo scambio di chiavi derivato da Diffie-Hellman, come IPsec.

!!! note "Captive portal"
    Nelle reti Wi-Fi pubbliche (hotel, treni…) l'autenticazione avviene spesso
    tramite un **captive portal**: una pagina web di login mostrata forzatamente
    dal browser (reindirizzando le richieste HTTP/DNS). **Non** è considerato una
    tecnologia NAC sicura.

!!! tip "Collegamenti"
    L'autenticazione di **servizi** (es. un server web) si basa sui
    [certificati](02-crittografia.md#certificati-digitali-e-pki); la cifratura
    del traffico Wi-Fi a livello di collegamento è imparentata con
    [MACsec](../04-sicurezza-reti/03-protocolli-sicuri-e-vpn.md#macsec).
