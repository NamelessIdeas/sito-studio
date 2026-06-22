# Principi di sicurezza e attacchi

Lo standard internazionale **Common Criteria** (ISO/IEC 15408) associa la
sicurezza alla **protezione delle risorse**: i *proprietari* valorizzano le
risorse e impongono **contromisure** per ridurre il **rischio** generato dalle
**minacce**, concretizzate da **agenti malevoli** (non solo hacker, ma anche
errori umani, malfunzionamenti software, incidenti). Le contromisure si
considerano adeguate quando la loro **valutazione** genera fiducia che siano
**sufficienti** (efficaci contro le minacce individuate) e **corrette**
(fanno davvero ciò che dichiarano).

## La triade RID (CIA)

Gli obiettivi della sicurezza sono riassunti nella **triade RID** —
**R**iservatezza, **I**ntegrità, **D**isponibilità — in inglese **CIA**
(*Confidentiality, Integrity, Availability*):

- **Riservatezza** *(Confidentiality)* — non deve essere possibile **accedere** a
  una risorsa senza esserne autorizzati;
- **Integrità** *(Integrity)* — non deve essere possibile **creare, modificare o
  eliminare** una risorsa senza autorizzazione;
- **Disponibilità** *(Availability)* — non deve essere possibile **impedire**
  l'accesso a una risorsa a chi è autorizzato.

Alla triade si aggiunge spesso un quarto obiettivo, l'**autenticità**: la
possibilità di **verificare l'origine** dei dati e l'identità di utenti e sistemi.

!!! note "Privacy"
    La **privacy** è una forma di riservatezza per la quale una persona mantiene
    il **controllo dei propri dati personali**: è il fondamento del
    [GDPR](../04-sicurezza-reti/01-gdpr.md).

## La triade AAA

Il controllo degli accessi alle risorse si fonda sulla triade **AAA**
(*Authentication, Authorization, Accounting*):

- **Autenticazione** *(Authentication)* — verifica dell'**identità dichiarata** di
  un utente;
- **Autorizzazione** *(Authorization)* — assegnazione all'utente autenticato dei
  **privilegi** di accesso, secondo il **principio del privilegio minimo** (ogni
  utente deve avere il minimo livello di autorizzazione necessario al proprio
  ruolo);
- **Accounting** — **registrazione** delle attività (connessioni, modifiche
  rilevanti…) con data e ora, per la tracciabilità.

## Superfici di attacco

L'analisi del rischio parte dalle **superfici di attacco** di un sistema:

- **fisica** — mitigata con il controllo dell'accesso fisico e la **ridondanza**
  di apparati e alimentazioni;
- **umana** — statisticamente la **più pericolosa**; si mitiga con le funzionalità
  **AAA** (privilegio minimo) e la **formazione** degli utenti;
- **rete** — statisticamente la più attaccata; si mitiga con la **difesa
  perimetrale** (*firewall*, IDS/IPS) o con architetture **Zero-Trust**;
- **software** — si mitiga con la **firma digitale** di applicazioni e
  aggiornamenti e con la gestione delle vulnerabilità della *supply chain*.

## Tipologie di attacco (RFC 4949)

La RFC 4949 classifica gli attacchi in base alla **conseguenza**:

| Conseguenza | Esempi di attacco |
| --- | --- |
| **Divulgazione non autorizzata** | esposizione, **intercettazione**, inferenza, intrusione |
| **Inganno** | **finzione** (*spoofing*), falsificazione, ripudio |
| **Interruzione** | impedimento, corruzione, **ostruzione** (es. DoS) |
| **Usurpazione** | appropriazione indebita, abuso |

## Best-practice e difesa in profondità

La **difesa perimetrale** separa la rete «interna» da quella «esterna» con
*firewall* e **IDS/IPS** (*Intrusion Detection/Prevention System*) configurati
sui router di confine. Ma fidarsi di tutto ciò che sta «dentro le mura» è
rischioso: la **difesa in profondità** adotta un'architettura **Zero-Trust**
(ZTA), basata sul principio **«non fidarti mai, verifica sempre»**, con *firewall*
software e IDS/IPS sui singoli sistemi a realizzare una **micro-segmentazione**
della rete.

!!! tip "Collegamenti"
    La riservatezza si ottiene **cifrando**, l'integrità e l'autenticità con
    **funzioni hash e firme digitali**: tutto questo è la
    [crittografia](02-crittografia.md). La difesa perimetrale concreta —
    *firewall*, ACL, DMZ — è in [Firewall e
    ACL](../04-sicurezza-reti/02-firewall-acl.md).
