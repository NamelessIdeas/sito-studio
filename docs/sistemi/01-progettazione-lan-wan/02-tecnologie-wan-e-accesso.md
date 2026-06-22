# Tecnologie WAN e accesso a Internet

Per collegare le proprie sedi e raggiungere la rete Internet, un'organizzazione
acquista servizi di connettività da operatori specializzati (**ISP**). Occorre
distinguere la **dorsale** della rete Internet, le **reti di accesso** che
portano la connettività fino all'utente, e i **collegamenti point-to-point** con
cui si realizzano le WAN private.

## La dorsale e le reti di accesso

- **Dorsale ottica (OTN).** Il *back-bone* della rete Internet è una **OTN**
  (*Optical Transport Network*) di cavi in **fibra ottica**, anche sottomarini,
  che interconnettono i continenti.
- **NGAN (Next Generation Access Network).** Sono le reti di accesso degli ISP
  che connettono case e aziende alla rete di distribuzione e, tramite questa,
  alla dorsale. Le tecnologie di livello 1 (fisico) e 2 (data-link) sono di due
  tipi: **wired** (tecnologia **DSL** sul cavo telefonico) e **wireless**
  (tecnologia **LTE** delle antenne mobili). L'interfacciamento tra il router e
  il sistema di accesso è realizzato da un **modem** (*modulator-demodulator*),
  spesso integrato nel router. Il principale parametro prestazionale è la
  **banda** (*bandwidth*), in bit/s.

## Sistemi di accesso *wired*: DSL e fibra

La tecnologia **DSL** (*Digital Subscriber Line*), definita a livello data-link,
sfrutta il cavo telefonico in **rame** per trasmettere dati digitali, con una
banda che dipende dalla **lunghezza** del cavo. Accorciando il tratto in rame
(portando la fibra sempre più vicino all'utente) si usa la variante ad alta
velocità **VDSL**. Le soluzioni **FTTx** si distinguono per quanto la fibra si
avvicina alla sede:

| Sistema | Tratto finale in rame | Banda download/upload (tipica) |
| --- | --- | --- |
| **FTTE** *(Fiber To The Exchange)* | oltre 400 m (ADSL classica) | 20 Mbps / 1 Mbps |
| **FTTC** *(Fiber To The Cabinet)* | 50–400 m (armadio in strada) | 300 Mbps / 20 Mbps |
| **FTTB** *(Fiber To The Building)* | meno di 50 m (base dell'edificio) | 1000 Mbps / 50 Mbps |
| **FTTH** *(Fiber To The Home)* | nessuno: **tutta fibra** | 2500 Mbps / 1250 Mbps |

Solo la **FTTH/FTTP** è interamente in fibra ottica; le altre sono soluzioni
**miste** rame-fibra, ancora oggi le più diffuse.

## Sistemi di accesso *wireless*

- **FWA (Fixed Wireless Access)**, talvolta detto **FTTT** (*Fiber To The
  Tower*): l'utenza fissa è raggiunta via **radio** anziché via cavo, riducendo
  i costi di cablaggio. Non definisce una specifica tecnologia: si usano
  **Wi-Fi** (IEEE 802.11, urbano, fino a ~5 Gbps entro 100 m), **WiMAX**
  (IEEE 802.16, rurale, fino a ~140 Mbps e ~50 km) o **LTE**. È spesso impiegato
  come accesso di **backup**.
- **Tecnologie mobili.** Dal 2000 le reti di telefonia mobile sono usate anche
  come accesso a Internet: **2G** (GPRS/EDGE), **3G** (UMTS/HSPA), **4G** (LTE,
  LTE-advanced) fino al **5G**. Oggi LTE ha prestazioni paragonabili
  all'accesso *wired*.
- **Satellite.** Dove manca sia la rete cablata sia la copertura mobile,
  l'accesso è fornito via **satellite** (geostazionario in orbita alta, o
  costellazioni in orbita bassa).

## Collegamenti point-to-point e WAN aziendali

Per la propria WAN privata un'azienda può acquistare **collegamenti
point-to-point** tra le sedi, oggi realizzati con **Ethernet su fibra ottica**,
che sta sostituendo tecnologie ormai obsolete come *frame-relay*, **ATM** e
**SONET**. In questo contesto il modem assume il ruolo di **DCE** (*Data
Communication Equipment*) e il router quello di **DTE** (*Data Terminal
Equipment*); un protocollo data-link molto usato sia per i collegamenti
point-to-point sia per l'accesso tramite ISP è il **PPP** (*Point-to-Point
Protocol*).

Storicamente i collegamenti tra sedi erano **leased line** (linee dedicate
noleggiate dall'operatore), costose; oggi le prestazioni e l'affidabilità degli
ISP hanno portato molte aziende a realizzare le proprie WAN **sulla rete
Internet** mediante **VPN** (vedi [Protocolli sicuri e
VPN](../04-sicurezza-reti/03-protocolli-sicuri-e-vpn.md)).

## SLA (Service Level Agreement)

In ambito aziendale i contratti di connettività prevedono uno **SLA** (*Service
Level Agreement*), cioè i livelli di qualità garantiti dal fornitore. I parametri
tipici:

- **uptime/downtime** — tempo minimo di disponibilità (o massimo di
  indisponibilità) del servizio, in percentuale;
- **banda** minima di download/upload (Mbps);
- **packet-loss** — percentuale di pacchetti IP persi;
- **packet-error** — percentuale di pacchetti ricevuti con errori;
- **delay** (latenza) — tempo medio origine→destinazione (ms), critico per le
  comunicazioni in tempo reale;
- **jitter** — variazione massima della latenza.

!!! note "Reti multiservizio (NGN)"
    Le reti **NGN** (*Next Generation Network*) sono **multiservizio**: oltre ai
    servizi tradizionali (mail, web, file) trasportano anche servizi in **tempo
    reale** (videoconferenze, telefonia, streaming, gaming). Per questi ultimi
    *delay* e *jitter* contano quanto la banda — da qui l'importanza della
    [qualità del servizio (QoS)](../05-gestione-reti/index.md#qos-qualita-del-servizio).
