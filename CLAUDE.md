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
requirements.txt            Dipendenza pinnata: mkdocs-material==9.7.6
Dockerfile                  Multi-stage: python:3.12-slim (build) -> nginx:alpine (serve :80)
docker-compose.yml          Servizi "studio" (8080:80) e "watchtower" (auto-update da GHCR)
.dockerignore               Esclude .git/.github/site/README/compose, NON i .md
setup.sh                    Avvio "PC come server": check Docker, pull+fallback build, URL LAN
.github/workflows/ci-cd.yml CI (mkdocs build --strict) + CD (push immagine su GHCR)
docs/                       Contenuti del sito (vedi sotto)
  index.md
  javascripts/mathjax.js    Config MathJax 3 (metodo ufficiale, no polyfill.io)
  stylesheets/extra.css     Material Design 3: token colore e movimento --m3-*, theme-aware
  letteratura/              Materia (menu laterale) -> index.md + argomenti .md
  matematica/               Materia (menu laterale) -> index.md + argomenti .md
  storia/                   Materia (menu laterale) -> index.md + argomenti .md
```

## Regole importanti (non violare)

- **Navigazione automatica.** Non aggiungere mai un blocco `nav:` in `mkdocs.yml`.
  Il menu si genera dalla struttura di `docs/`. Una **materia** = una cartella
  (compare nel menu laterale, NIENTE tab in alto: `navigation.tabs` resta
  disattivato); un **argomento** = un file `.md`; ogni materia ha un
  `index.md` come landing. La home è esclusa dalla nav via `not_in_nav`.
- **Formule LaTeX via MathJax 3 ufficiale.** MathJax è caricato da unpkg in
  `mkdocs.yml` (`extra_javascript`) insieme a `docs/javascripts/mathjax.js`.
  **Mai** usare `polyfill.io` (compromesso). Sintassi: `\( ... \)` inline,
  `\[ ... \]` in blocco.
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

## CI/CD

`.github/workflows/ci-cd.yml`:
- **ci** (push + PR su `main`): `mkdocs build --strict`.
- **cd** (solo push su `main`): login GHCR con `GITHUB_TOKEN`
  (`packages: write`), build e push su `ghcr.io/<repo-in-minuscolo>:latest`.
  Il nome immagine è forzato in minuscolo perché GHCR lo richiede.

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
