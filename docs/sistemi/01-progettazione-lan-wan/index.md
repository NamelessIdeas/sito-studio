# Progettazione di reti LAN/WAN

La progettazione di una rete integrata **LAN/WAN** parte dalla distinzione tra la
rete **locale** di un'organizzazione (LAN) e la rete **geografica** (WAN) che ne
interconnette le diverse sedi e la collega alla rete Internet. Una buona
progettazione tiene insieme tre esigenze: **prestazioni** (banda, latenza),
**affidabilità** (ridondanza dei collegamenti e degli apparati) e **sicurezza**
(segmentazione, difesa perimetrale).

## Principi di progettazione

- **Indirizzamento gerarchico.** Si assegnano gli indirizzi IP per sottoreti
  coerenti con la topologia (una o più sottoreti per sede/reparto), così da
  rendere efficiente l'instradamento e semplice l'applicazione delle politiche
  di sicurezza. In ambito LAN si usano gli indirizzi **privati** (RFC 1918), con
  **NAT/PAT** sul router di confine verso Internet.
- **Architettura a livelli.** Le LAN tradizionali sono organizzate sui tre
  livelli **accesso**, **distribuzione** e **core**; nei data-center prevale
  invece l'architettura a due livelli *leaf-spine* (vedi
  [Server e servizi cloud](../02-server-e-cloud/index.md)).
- **Routing.** All'interno dell'organizzazione (sistema autonomo) si usa il
  **routing dinamico** — tipicamente **OSPF** — perché le tabelle di
  instradamento si aggiornino da sole al variare della topologia.
- **WAN su Internet.** Le sedi remote si collegano oggi quasi sempre tramite la
  rete Internet con **VPN** cifrate, anziché con costose linee dedicate.

## Argomenti

- [**Routing dinamico OSPF e NAT**](01-routing-e-nat.md) — come i router
  apprendono i percorsi e come si traducono gli indirizzi privati in pubblici.
- [**Tecnologie WAN e accesso a Internet**](02-tecnologie-wan-e-accesso.md) —
  dalla dorsale ottica alle reti di accesso DSL/fibra/radio, fino agli SLA.
