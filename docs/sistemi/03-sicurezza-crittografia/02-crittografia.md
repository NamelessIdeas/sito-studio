# Crittografia

La crittografia è il fondamento tecnico della sicurezza informatica: la
**riservatezza** si ottiene **cifrando** i dati, l'**integrità** e
l'**autenticità** con **funzioni hash** e **firme digitali** (la
**disponibilità**, invece, *non* si ottiene con tecniche crittografiche).

## Lo scenario generale

I tre «attori» convenzionali sono **Ada** (mittente), **Brian** (destinatario) e
**Criminal** (l'attaccante che vuole leggere o alterare il messaggio). Il
mittente trasforma il **testo in chiaro** in un **messaggio offuscato**
(*crittogramma*) usando un algoritmo e una **chiave** (una sequenza di bit); il
destinatario applica la trasformazione inversa. La crittografia moderna si fonda
su due principi:

- **pubblicità del metodo** — l'algoritmo è noto a tutti;
- **segretezza delle chiavi** — la sicurezza dipende solo dalla chiave.

### Crittoanalisi e robustezza

La **crittoanalisi** studia come violare un codice. Un attacco **esaustivo** (o
**forza bruta**) prova tutte le \(N\) chiavi possibili, con successo statistico
dopo \(N/2\) tentativi; un **attacco statistico** sfrutta invece la frequenza dei
simboli. Un algoritmo è:

- **incondizionatamente sicuro** se il crittogramma non contiene informazioni
  sufficienti a risalire al testo in chiaro (sicurezza *matematica*; in pratica
  non esiste);
- **computazionalmente sicuro** se il costo della violazione **supera il valore**
  dell'informazione, o richiede **più tempo** di quello in cui l'informazione è
  utile (sicurezza *informatica*).

Per la robustezza, **Shannon** indica due principi: la **diffusione** (la
struttura statistica del testo si «spalma» sul crittogramma) e la **confusione**
(rendere complessa la relazione tra chiave e crittogramma). Una proprietà
correlata è l'**effetto valanga**: cambiare **un solo bit** del testo o della
chiave cambia **molti bit** del crittogramma.

!!! note "Cifrari storici"
    Il **cifrario di Cesare** (sostituzione con scorrimento) ha solo 25 chiavi:
    cade subito per forza bruta. La **sostituzione monoalfabetica** di Leon
    Battista Alberti usa una permutazione dell'alfabeto (\(26! \approx 4 \cdot
    10^{26}\) chiavi): l'attacco esaustivo è impraticabile, ma resta vulnerabile
    all'**attacco statistico** sulle frequenze delle lettere.

I **4 blocchi di base** della crittografia moderna sono: **cifratura
simmetrica**, **cifratura asimmetrica**, **hashing** e **firma digitale**.

## Cifratura simmetrica (a chiave segreta)

Mittente e destinatario condividono **un'unica chiave segreta** \(K\), usata sia
per cifrare \(X = C(K, T)\) sia per decifrare \(T = D(K, X)\). È **veloce**, ma
richiede un **canale sicuro** per scambiare preventivamente la chiave.

| Cifrario | Chiave | Note |
| --- | --- | --- |
| **DES** *(Data Encryption Standard)* | 56 bit | a blocchi di 64 bit, 16 *round*; dal 2001 violabile per forza bruta |
| **3DES** | 168 bit | DES applicato tre volte; uso «sicuro» legacy |
| **AES** *(Advanced Encryption Standard)* | 128/192/256 bit | famiglia *Rijndael*, blocchi di 128 bit; **oggi lo standard mondiale**, implementato in hardware nelle CPU |

Sia DES sia AES sono **cifrari a blocchi** e implementano l'effetto valanga.

### Modalità operative

Per cifrare messaggi più lunghi di un blocco si usano le **modalità operative**:

- **ECB** *(Electronic CodeBook)* — ogni blocco cifrato separatamente. **Da
  evitare:** blocchi di testo uguali producono blocchi cifrati uguali, rivelando
  le **regolarità** del messaggio (su un'immagine, la silhouette resta visibile).
- **CBC** *(Cipher Block Chaining)* — ogni blocco è messo in **XOR** con il
  crittogramma precedente prima di essere cifrato; il primo usa un **vettore di
  inizializzazione** (IV). Non parallelizzabile.
- **CTR** *(Counter)* — cifra un **nonce + contatore** e ne fa lo XOR con il
  testo; è la modalità oggi più usata.

## Cifratura asimmetrica (a chiave pubblica/privata)

Nel **1976 Diffie ed Hellman** dimostrarono che è possibile comunicare in modo
sicuro **senza** scambiare prima una chiave segreta; nel 1977 **Rivest, Shamir e
Adleman** ne diedero l'implementazione: **RSA**. Un crittosistema asimmetrico usa
**due chiavi distinte e complementari**: ciò che si cifra con una si decifra solo
con l'altra. Una è la **chiave privata** (segreta), l'altra la **chiave
pubblica** (divulgabile); deve essere computazionalmente **infattibile** risalire
dall'una all'altra.

- **Per la riservatezza:** Ada cifra con la **chiave pubblica di Brian**; solo
  Brian, con la propria chiave privata, può decifrare. Non serve un canale
  sicuro per lo scambio delle chiavi.

### Algoritmo RSA

RSA si fonda sulla difficoltà di **fattorizzare** numeri interi prodotto di due
grandi numeri primi. In sintesi, Ada sceglie due primi \(p, q\) e calcola:

\[
n = p \cdot q, \qquad f(n) = (p-1)\,(q-1), \qquad d = e^{-1} \bmod f(n)
\]

La chiave pubblica è la coppia \((e, n)\), la privata \((d, n)\). Cifratura e
decifratura di un messaggio \(T < n\):

\[
X = T^{e} \bmod n, \qquad T = X^{d} \bmod n
\]

Una dimensione oggi considerata sicura per \(n\) è **2048 bit**.

### Algoritmo ECC

**ECC** *(Elliptic Curve Cryptography)* basa la cifratura sui punti di una
**curva ellittica**: il messaggio è un punto \(P\), il crittogramma una coppia di
punti. È **più performante** di RSA e più costoso da violare a parità di
sicurezza, e si sta imponendo come algoritmo standard per la crittografia
asimmetrica.

| Sicurezza (≈ chiave simmetrica) | Chiave RSA | Modulo ECC |
| --- | --- | --- |
| 112 bit | 2048 bit | 224–255 bit |
| 128 bit | 3072 bit | 256–383 bit |
| 256 bit | 15360 bit | > 512 bit |

### Cifratura ibrida

Gli algoritmi asimmetrici sono **lenti**: si usa quindi la **cifratura ibrida**.
Ada genera una **chiave di sessione** casuale per un algoritmo simmetrico
(tipicamente AES), la cifra con la **chiave pubblica** di Brian e gliela invia;
da quel momento i due comunicano con l'algoritmo simmetrico **veloce**. È il
modello generale di ogni protocollo di comunicazione sicuro.

## Garantire l'integrità: hashing

Una **funzione hash** \(h = H(T)\) accetta un dato di lunghezza arbitraria e
restituisce un valore di **lunghezza fissa** (*hash*, *digest*). Allegando
l'*hash* al messaggio, il destinatario lo **ricalcola** e lo confronta: se
differiscono, il messaggio è stato alterato. Una **funzione hash crittografica**
è *one-way* (non invertibile) e ha:

- **determinismo** ed **efficienza computazionale**;
- **effetto valanga**;
- **pre-image resistance** — dato \(h\), è infattibile trovare \(T\) con
  \(H(T)=h\);
- **second pre-image resistance** e **collision resistance** — è infattibile
  trovare due input diversi con lo stesso *hash* (una **collisione**).

L'algoritmo standard è **SHA** *(Secure Hash Algorithm)*: **SHA-1** (oggi
debole), **SHA-2** (SHA-256, SHA-512…) e **SHA-3**. Il vecchio **MD5** è stato
violato intorno al 2005 (trovate collisioni).

### Memorizzazione delle password

Le password si memorizzano come **hash** (*fingerprint*), non in chiaro: al
*login* si ricalcola l'hash e si confronta. Due debolezze: hash uguali per
password uguali (attaccabili con **rainbow-table** precalcolate) e hash veloci
(attaccabili in **brute-force** con GPU). Rimedi:

- **salt** — una componente **casuale** aggiunta alla password prima dell'hash
  (e memorizzata), così password uguali danno *fingerprint* diversi;
- **algoritmi di salted-hash** appositi e **lenti**: **Argon2** (2015, il più
  robusto), **scrypt** (2009), **BCrypt** (1999, legacy), regolabili in numero di
  iterazioni e parallelismo.

### MAC: hash con chiave

Una funzione **hash con chiave** o **MAC** *(Message Authentication Code)* prende
in input il messaggio **e una chiave segreta condivisa**: garantisce integrità
**e** autenticità, perché un attaccante senza la chiave non può ricalcolare un
MAC valido. Realizzazioni standard: **C-MAC** (basato su un cifratore come AES in
CBC) e **H-MAC** (basato su una funzione hash, RFC 2104).

## Firma digitale

La **firma digitale** verifica l'**autenticità del mittente**. Brian cifra con la
**propria chiave privata**: chiunque può decifrare con la sua chiave pubblica
(quindi *leggere*), ma **nessuno può generare** un messaggio fingendosi Brian.
Poiché la crittografia asimmetrica è lenta, in pratica si firma **non il
messaggio ma il suo hash**: Brian calcola \(h = H(T)\), lo cifra con la chiave
privata e allega la firma; Ada decifra la firma con la chiave pubblica di Brian e
la confronta con l'hash ricalcolato.

!!! warning "Ma la chiave pubblica è autentica?"
    Lo schema regge solo se Ada è certa che la chiave pubblica sia **davvero** di
    Brian: altrimenti Criminal potrebbe impersonarlo. Il problema è risolto dai
    **certificati digitali**.

## Certificati digitali e PKI

Un **certificato digitale** (standard **ITU X.509**) associa una **chiave
pubblica** all'identità del suo proprietario; l'associazione è garantita da
un'autorità indipendente, la **CA** *(Certification Authority)*, che **firma
digitalmente** il certificato con la propria chiave privata. Un certificato
contiene: la CA emittente, il periodo di **validità**, l'**intestatario**, la sua
**chiave pubblica** e la **firma digitale della CA**.

La validità si verifica **a catena**: il certificato di un'entità è firmato da
una **CA intermedia**, il cui certificato è firmato da una **CA radice** assunta
come valida (*root of trust*). La gestione complessiva (emissione, distribuzione,
revoca) segue il modello **PKI** *(Public Key Infrastructure)*, con i ruoli:

- **Certification Authority** — emette e mantiene i certificati;
- **Registration Authority** — registra e autentica le *end-entity*;
- **Validation Authority** — pubblica i certificati e mantiene le **CRL**
  *(Certificate Revocation List)* dei certificati revocati;
- **end-entity** — l'utente che necessita di un certificato (es. per un servizio
  web HTTPS).

## Scambio delle chiavi: Diffie-Hellman

L'**algoritmo DH** *(Diffie-Hellman)* permette a due parti di **concordare una
chiave segreta condivisa** senza mai trasmetterla, scambiando solo valori
pubblici; la sua robustezza si fonda sulla difficoltà di calcolare i **logaritmi
discreti** di grandi numeri. Ada e Brian scelgono un primo \(p\) e una base
\(r\), poi ciascuno un numero segreto (\(a\) e \(b\)); scambiano \(A = r^{a}
\bmod p\) e \(B = r^{b} \bmod p\) e ricavano la **stessa** chiave:

\[
K = B^{a} \bmod p = A^{b} \bmod p = r^{ab} \bmod p
\]

La variante su curve ellittiche è **ECDH**.

!!! danger "Attacco man-in-the-middle"
    DH «puro» è vulnerabile all'attacco **man-in-the-middle**: Criminal si
    interpone, concorda una chiave con Ada e una con Brian, e legge tutto il
    traffico. Per questo lo scambio di chiavi reale va **autenticato** con i
    certificati. È lo schema impiegato da [TLS, IPsec e
    SSH](../04-sicurezza-reti/03-protocolli-sicuri-e-vpn.md).
