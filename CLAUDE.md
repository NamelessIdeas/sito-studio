# CLAUDE.md

Guida per agenti che lavorano su questo repository.

## Cos'è

Sito di studio personale generato con **MkDocs Material** (italiano, tema
Material Design 3), servito in **Docker** dietro nginx, con **CI/CD** su GitHub
Actions che pubblica l'immagine su **GHCR** e **Watchtower** che aggiorna il
container da solo. Obiettivo: su un PC nuovo deve bastare *installare Docker +
lanciare `./setup.sh`* per rimettere il sito online.

## Struttura

```
mkdocs.yml                  Config MkDocs Material. NESSUN blocco nav:.
requirements.txt            Dipendenze pinnate: mkdocs-material==9.7.6,
                            mkdocs-awesome-pages-plugin==2.10.1
Dockerfile                  Multi-stage: python:3.12-slim (build) -> nginx:alpine (serve :80)
docker-compose.yml          Servizi "studio" (8080:80) e "watchtower" (auto-update da GHCR)
.dockerignore               Esclude .git/.github/site/README/compose, NON i .md
setup.sh                    Avvio "PC come server": check Docker, pull+fallback build, URL LAN
.github/workflows/ci-cd.yml CI (mkdocs build --strict) + CD (push immagine su GHCR)
docs/                       Contenuti del sito (vedi sotto)
  index.md
  privacy.md                Nota privacy (fuori nav, linkata dal footer via copyright)
  javascripts/mathjax.js    Config MathJax 3 (metodo ufficiale, no polyfill.io)
  javascripts/mathjax/      MathJax 3.2.2 vendorizzato (bundle + font woff-v2): NIENTE CDN
  fonts/                    Roboto (variabile) e Roboto Mono self-hosted: NIENTE Google Fonts
  stylesheets/extra.css     Material Design 3: token colore e movimento --m3-*, theme-aware;
                            @font-face dei font self-hosted
  letteratura/              Materia (menu laterale) -> index.md + movimenti (sottocartelle)
    01-scapigliatura/       Movimento dell'albero delle correnti = sezione a tendina:
      .pages                  titolo della sezione (title: ...) via awesome-pages
      index.md                descrizione del movimento (landing cliccabile) + link autori
      01-eta-postunitaria.md  contesto storico; poi una pagina per autore:
      02-emilio-praga.md / 03-arrigo-boito.md / 04-igino-ugo-tarchetti.md
    02-positivismo/         Movimento con correnti annidate (sottocartelle di 2° livello):
      index.md                descrizione del Positivismo
      01-naturalismo-francese/  index.md + 01-gustave-flaubert.md + 02-emile-zola.md
      02-verismo/             corrente: index.md + 01-luigi-capuana.md + 02-giovanni-verga.md
    03-decadentismo/        Stesso schema: 01-simbolismo/ (Pascoli), 02-estetismo/,
                            03-superomismo/ (d'Annunzio), 04-narrativa-della-crisi/
                            (Svevo, Pirandello), 05-eredita-novecentesca/
                            (Ungaretti, Ermetismo, Montale)
    04-avanguardie-futurismo/  index.md (Marinetti, Palazzeschi) + crepuscolari/vociani
    05-poesia-anti-novecentesca/  index.md + 01-umberto-saba.md
  matematica/               Materia (menu laterale) -> index.md + argomenti .md
  storia/                   Materia (menu laterale) -> index.md + argomenti .md
Fonti/                      Materiale sorgente (PDF del programma, appunti): in
                            .gitignore, esiste solo sul PC locale
```

## Regole importanti (non violare)

- **Navigazione automatica.** Non aggiungere mai un blocco `nav:` in `mkdocs.yml`.
  Il menu si genera dalla struttura di `docs/`. Una **materia** = una cartella
  (compare nel menu laterale, NIENTE tab in alto: `navigation.tabs` resta
  disattivato); un **argomento** = un file `.md`; ogni materia ha un
  `index.md` come landing. La home è esclusa dalla nav via `not_in_nav`.
- **Sottosezioni a tendina = sottocartelle.** Dentro una materia, una
  sottocartella diventa una sezione espandibile; le sottocartelle si annidano
  (letteratura segue l'albero delle correnti: movimento -> correnti/sensibilità
  -> autori; i contenuti coprono comunque il programma 5B INT). Il prefisso
  numerico (`01-`, `02-`…) dà l'ordine — attenzione: a parità di livello MkDocs
  mette i file `.md` PRIMA delle sottocartelle, quindi un file deve venire prima
  delle cartelle sorelle anche nel prefisso (altrimenti trasformarlo in
  sottocartella con solo `index.md`, come `03-decadentismo/02-estetismo/`); il
  titolo pulito della sezione va nel file `.pages`
  (`title: Il Decadentismo`) gestito dal plugin **awesome-pages** — senza, nel
  menu comparirebbe "01 decadentismo". Un `index.md` nella sottocartella rende
  la sezione cliccabile (feature `navigation.indexes`). Il plugin NON va usato
  per definire `nav:` manuali nei `.pages`: solo `title:`. Un **autore con più
  testi/poesie** ha una **pagina dedicata** (`02-emilio-praga.md`,
  `01-gustave-flaubert.md`…): la `index.md` del movimento resta la panoramica e
  li elenca con i link, senza riportare i testi.
- **Schema unico delle pagine autore.** Ogni pagina autore segue lo stesso
  ordine: `# Nome` → paragrafo introduttivo → (`!!! note "Diritti d'autore"` se
  l'autore è sotto diritti) → `## La vita` → `## Poetica` (varianti ammesse:
  *Poetica e visione del mondo*, *La poetica*…) → `## Le opere` → le sezioni dei
  **testi** (`## *Titolo*` con i riquadri-scheda) → `!!! tip "Collegamenti"`. Per
  gli autori di sola prosa (Svevo, Pirandello) si omettono le sezioni dei testi.
  Riferimento: le pagine dei decadenti (Pascoli, d'Annunzio, Montale…).
- **Blocchi Testo/Parafrasi/Riassunto = admonition "scheda".** Per i testi e la
  loro analisi si usano admonition collassabili (estensione `pymdownx.details`
  in `mkdocs.yml`), NON le content-tab `=== "..."` (riservate ad altro, es. i
  generi in *età postunitaria*): `???+ quote "Testo"` per i testi integrali in
  pubblico dominio (`!!! quote "Dal testo"` per le citazioni brevi degli autori
  sotto diritti), `??? note "Parafrasi"`/`"Traduzione"` (collassabili, chiusi),
  `???+ abstract "Riassunto"` (anche per i riassunti in prosa: non lasciarli come
  testo libero). Corpo indentato di 4 spazi; l'analisi (`**Metro:**`,
  `**Figure retoriche:**`, `**Significato e temi:**`) resta testo normale a
  livello base. I tipi `quote` (Testo) e `abstract` (Riassunto) hanno un contorno
  pieno nell'accento M3 definito in `docs/stylesheets/extra.css`.
- **Formule LaTeX via MathJax 3 self-hosted.** Il bundle `tex-mml-chtml.js` e i
  font matematici sono vendorizzati in `docs/javascripts/mathjax/` (da npm
  `mathjax@3.2.2`) e caricati da `mkdocs.yml` (`extra_javascript`) insieme alla
  config `docs/javascripts/mathjax.js`. **Mai** usare `polyfill.io`
  (compromesso). Sintassi: `\( ... \)` inline, `\[ ... \]` in blocco.
- **Nessuna risorsa da CDN terzi (GDPR).** Il sito pubblico non deve generare
  richieste verso Google Fonts, unpkg o simili (trasmettono gli IP dei
  visitatori a terzi): font e librerie sono self-hosted (`docs/fonts/`,
  `docs/javascripts/mathjax/`, `theme.font: false`). Non reintrodurre URL
  esterni in `extra_javascript`/`extra_css`/`theme.font`.
- **Niente testi integrali di autori sotto diritti.** Le opere di autori morti
  da meno di 70 anni (oggi: Saba fino al 2027, Ungaretti 2040, Palazzeschi
  2044, Montale 2051…) NON vanno riprodotte per intero: solo brevi citazioni
  commentate (art. 70 L. 633/1941), come negli attuali blocchi
  `!!! quote "Dal testo"`. Autori in pubblico dominio (Verga, Pascoli,
  d'Annunzio, Marinetti…): testi integrali ok.
- **`requirements.txt` è pinnato** (`mkdocs-material==9.7.6`) per build
  riproducibili. Cambia il pin solo intenzionalmente.
- **`--strict` è obbligatorio.** Build CI e Dockerfile usano
  `mkdocs build --strict`: un link interno rotto fa fallire la build. Verifica
  sempre in strict prima di considerare fatto un cambiamento.
- **`.dockerignore`**: non escludere `docs/` né i `.md`, servono alla build.

## Comandi

```bash
# Anteprima durante la scrittura (richiede venv con requirements):
mkdocs serve                      # http://localhost:8000

# Verifica build (come fa la CI e lo stage 1 del Dockerfile):
mkdocs build --strict

# Avvio in Docker:
docker compose up -d --build      # build locale, http://localhost:8080
./setup.sh                        # pull da GHCR con fallback build + URL LAN
```

Per `mkdocs serve`/`build` localmente: creare un venv e
`pip install -r requirements.txt` (l'output `site/` è in `.gitignore`).
In questo checkout il venv è già in `.venv/` (`.venv/bin/mkdocs`).

## Template pagina autore

Scheletro da copiare per una nuova pagina autore (rispetta lo *Schema unico delle
pagine autore* tra le regole sopra):

```markdown
# Nome Cognome

**Nome Cognome** (Luogo, anno – Luogo, anno) è … (1-2 frasi di inquadramento,
con link al movimento).

<!-- SOLO se l'autore è morto da meno di 70 anni: -->
!!! note "Diritti d'autore"
    Le opere di X (morto nel ANNO) sono **sotto diritti** fino a tutto il
    ANNO+70: i testi integrali non sono riprodotti; solo brevi citazioni
    commentate (art. 70 L. 633/1941).

## La vita
…

## Poetica
- …

## Le opere
- ***Titolo*** (anno) — …

## *Titolo del testo* (da *Opera*, anno)

???+ quote "Testo"        <!-- usa !!! quote "Dal testo" se l'autore è sotto diritti -->

    > primo verso…

??? note "Parafrasi"      <!-- collassabile, chiuso -->

    Parafrasi in prosa…

???+ abstract "Riassunto"

    Riassunto in prosa…

**Metro:** …

**Figure retoriche:**

- …

**Significato e temi:** …

!!! tip "Collegamenti"
    Link ad autori/correnti collegati.
```

## Flusso di lavoro con l'agente

- **Verifica prima di dire "fatto"**: dopo ogni modifica ai contenuti esegui
  `mkdocs build --strict` (cattura i link rotti) **e** la skill `markdown-lint`
  (`pymarkdown … scan`). Niente "completato" senza entrambi verdi.
- **Commit/push solo su richiesta esplicita**: non committare di iniziativa.
- **Messaggi di commit** in italiano, con prefisso tematico (`Contenuti:`, `UI:`,
  `Docs:`, `Infra:`, `Legale:`…) e riga finale `Co-Authored-By: Claude …`. Un
  commit per ogni cambiamento logico (separa i temi).
- **Spostamenti/rinomini**: usa `git mv` per conservare la cronologia e aggiorna
  **tutti** i link interni che puntano al vecchio percorso.

## Trabocchetti noti

- **Liste annidate = 4 spazi.** MkDocs/Python-Markdown richiede **4 spazi** per
  annidare una lista (es. l'albero in `docs/letteratura/index.md`): a 2 spazi
  l'annidamento si **appiattisce** nel rendering. La regola lint MD007 è perciò
  tarata su `indent: 4` in `.claude/pymarkdown.json` — NON ridurre a 2 spazi.
- **Hook = gate sui comandi Bash.** Un hook esegue `mkdocs build --strict` PRIMA
  di ogni comando Bash e lo **blocca** se la build fallisce. Durante un rinomino:
  prima `git mv`, poi correggi i link con gli strumenti di edit (che non passano
  dal gate), infine torna a eseguire comandi Bash.

## CI/CD

`.github/workflows/ci-cd.yml`:
- **ci** (push + PR su `main`): `mkdocs build --strict`; su push carica anche
  `site/` come artefatto Pages.
- **cd** (solo push su `main`): login GHCR con `GITHUB_TOKEN`
  (`packages: write`), build e push su `ghcr.io/<repo-in-minuscolo>:latest`.
  Il nome immagine è forzato in minuscolo perché GHCR lo richiede.
- **pages** (solo push su `main`): pubblica l'artefatto su **GitHub Pages**
  (`actions/deploy-pages`, permessi `pages: write` + `id-token: write`).
  URL: <https://namelessideas.github.io/sito-studio/> (`site_url` in
  `mkdocs.yml`). Prerequisito una tantum nel repo GitHub:
  Settings -> Pages -> Source = "GitHub Actions".

Sul PC che ospita il sito, il servizio **watchtower** di `docker-compose.yml`
controlla GHCR ogni 5 minuti (solo i container con label
`watchtower.enable=true`) e ricrea `studio` quando esce una nuova `:latest`:
dopo il merge su `main` il deploy è automatico.

## Note ambientali

- `docker-compose.yml` punta a `ghcr.io/namelessideas/sito-studio:latest`
  (owner reale, minuscolo come richiede GHCR). Finché l'immagine non è
  pubblicata dalla pipeline, `setup.sh` fallisce il `pull` e ricade sulla
  build locale (comportamento atteso).
- Avviare il daemon Docker e l'avvio al boot richiedono privilegi
  (`sudo systemctl enable --now docker`): azioni manuali su una macchina nuova,
  non automatizzabili dal repo.
