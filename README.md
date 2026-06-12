# Sito di Studio

Sito di studio personale generato con **MkDocs Material**, in italiano, con
navigazione **automatica** dalla struttura delle cartelle, formule LaTeX
(MathJax 3), ricerca, tema **Material Design 3** chiaro/scuro e copia-codice.
Pensato per girare in **Docker** e trasformare un PC in un piccolo server di
rete locale, con **CI/CD** su GitHub Actions verso GHCR e **aggiornamento
automatico** del container via Watchtower.

---

## Aggiungere materie e argomenti

La navigazione si costruisce da sola: **non c'è alcun elenco `nav:`** da
mantenere in `mkdocs.yml`.

- **Nuova materia** → crea una cartella in `docs/`, per esempio
  `docs/fisica/`. Comparirà automaticamente nel **menu laterale** a sinistra.
  Aggiungi `docs/fisica/index.md` come pagina introduttiva della materia.
- **Nuovo argomento** → crea un file `.md` dentro la cartella della materia,
  per esempio `docs/fisica/cinematica.md`. Comparirà nel menu della materia.
- **Sottosezione a tendina** (es. i moduli di letteratura) → crea una
  sottocartella dentro la materia, per esempio
  `docs/letteratura/04-decadentismo/`, e mettici dentro gli argomenti. Il
  prefisso numerico decide l'ordine nel menu; il titolo mostrato va nel file
  `.pages` della cartella (una riga: `title: Il Decadentismo`). Un `index.md`
  nella sottocartella rende cliccabile la voce di sezione.

Il titolo della voce di menu è il primo titolo `#` del file (oppure il nome del
file/cartella se assente; per le sottosezioni usa il `.pages`).

### Formule LaTeX

Usa la sintassi LaTeX:

- in linea: `\( e^{i\pi} + 1 = 0 \)`
- in blocco:

  ```text
  \[
  \int_0^1 x^2 \, dx = \frac{1}{3}
  \]
  ```

> Le formule sono renderizzate con MathJax 3 caricato da unpkg tramite il file
> `docs/javascripts/mathjax.js` (metodo ufficiale, **senza** polyfill.io).

---

## Avvio in locale

### Anteprima rapida durante la scrittura

Con Python installato:

```bash
pip install -r requirements.txt
mkdocs serve
```

Apri <http://localhost:8000>: l'anteprima si ricarica a ogni salvataggio.

### Con Docker (build locale)

```bash
docker compose up -d --build
```

Sito su <http://localhost:8080>.

### Con Docker (immagine pronta da GHCR)

L'immagine è già configurata su `ghcr.io/namelessideas/sito-studio:latest`
(se forki il progetto, cambia l'owner in `docker-compose.yml`):

```bash
docker compose pull
docker compose up -d
```

### Script tutto-in-uno

```bash
./setup.sh
```

Verifica Docker, prova il `pull` da GHCR e in **fallback** costruisce in locale,
poi stampa gli URL di accesso (localhost e IP in LAN).

---

## Pubblicare su GitHub e attivare la pipeline

1. Crea il repository su GitHub e collega il remote (se non già fatto):

   ```bash
   git add .
   git commit -m "Sito di studio iniziale"
   git push -u origin main
   ```

2. `docker-compose.yml` punta già a `ghcr.io/namelessideas/sito-studio:latest`.
   Se usi un owner diverso, aggiornalo (sempre in minuscolo).

3. Al primo `push` su `main`, GitHub Actions (`.github/workflows/ci-cd.yml`):
   - **CI** — esegue `mkdocs build --strict`; se ci sono link rotti, fallisce.
   - **CD** — costruisce l'immagine Docker e la pubblica su
     `ghcr.io/<owner>/sito-studio:latest`.

   La CD usa `GITHUB_TOKEN` con permesso `packages: write`: non servono secret
   aggiuntivi.

   Sul PC che ospita il sito, **Watchtower** (incluso in `docker-compose.yml`)
   controlla GHCR ogni 5 minuti: quando la pipeline pubblica una nuova
   `:latest`, scarica l'immagine e ricrea il container da solo. Dopo un push su
   `main` il sito si aggiorna quindi **senza alcun intervento manuale**.

4. (Opzionale) Per scaricare l'immagine da un'altra macchina, rendi il package
   pubblico nelle impostazioni del package su GitHub, **oppure** esegui il login
   a GHCR (vedi sotto).

---

## PC come server

Trasformare il PC in un server che ospita il sito per tutta la rete locale.

### 1. Far partire Docker (e il sito) all'avvio del sistema

- **Docker al boot** (Linux con systemd):

  ```bash
  sudo systemctl enable --now docker
  ```

  Su Docker Desktop (Windows/macOS): impostazioni → *Start Docker Desktop when
  you log in*.

- **Sito al boot**: il servizio in `docker-compose.yml` ha
  `restart: unless-stopped`, quindi una volta avviato (con `./setup.sh` o
  `docker compose up -d`) Docker lo **riavvia automaticamente** a ogni
  riaccensione del PC, senza altri interventi.

### 2. Raggiungere il sito dagli altri dispositivi della rete

1. Scopri l'IP del PC in LAN:

   ```bash
   hostname -I        # Linux
   ```

   (oppure `ip addr`, su Windows `ipconfig`). Esempio: `192.168.1.50`.

2. Da qualsiasi dispositivo nella stessa rete apri:
   `http://192.168.1.50:8080`.

3. Se non si apre, controlla il **firewall** del PC: deve permettere le
   connessioni in entrata sulla porta **8080**. Per un indirizzo stabile,
   imposta un IP statico o una prenotazione DHCP sul router.

### 3. Cosa è già nel repo e cosa va rifatto a mano su una macchina nuova

**Già nel repo (versionato, pronto all'uso):**

- contenuti del sito (`docs/`), configurazione (`mkdocs.yml`), dipendenze
  pinnate (`requirements.txt`);
- `Dockerfile`, `docker-compose.yml` (incluso il servizio **Watchtower** per
  l'aggiornamento automatico), `.dockerignore`;
- pipeline CI/CD (`.github/workflows/ci-cd.yml`);
- script di avvio (`setup.sh`).

**Da fare a mano su un PC nuovo:**

1. **Installare Docker** (con il plugin `compose`): non è incluso nel repo.
2. Ottenere il progetto: `git clone <url-del-repo>`.
3. **Eventuale login a GHCR** se l'immagine è privata:

   ```bash
   echo <TOKEN> | docker login ghcr.io -u <username> --password-stdin
   ```

   (token GitHub con scope `read:packages`). Se l'immagine è pubblica, oppure
   se lasci che `setup.sh` costruisca in locale, questo passaggio non serve.
4. **Abilitare l'avvio al boot** di Docker (punto 1 qui sopra) e lanciare una
   volta `./setup.sh`.

In sintesi, su una macchina nuova: *installa Docker → clona il repo → esegui
`./setup.sh`* e il sito torna online.
