#!/usr/bin/env bash
#
# setup.sh — avvia il sito di studio su questa macchina ("PC come server").
#
# Cosa fa:
#   1. verifica che Docker sia installato e che il daemon sia attivo;
#   2. prova a scaricare l'immagine già pronta da GHCR (docker compose pull);
#   3. se il pull fallisce (immagine privata o assente), la costruisce in
#      locale (docker compose up -d --build);
#   4. stampa gli URL di accesso, incluso l'IP di questa macchina in LAN.
#
set -euo pipefail

cd "$(dirname "$0")"

PORT=8080

err()  { printf '\033[31m[errore]\033[0m %s\n' "$*" >&2; }
ok()   { printf '\033[32m[ok]\033[0m %s\n' "$*"; }
info() { printf '\033[34m[info]\033[0m %s\n' "$*"; }

# --- 1. Docker installato? -------------------------------------------------
if ! command -v docker >/dev/null 2>&1; then
  err "Docker non è installato. Installalo da https://docs.docker.com/get-docker/ e riprova."
  exit 1
fi

# Sceglie "docker compose" (v2) o "docker-compose" (v1) a seconda di cosa c'è.
if docker compose version >/dev/null 2>&1; then
  COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE=(docker-compose)
else
  err "Plugin 'docker compose' non disponibile. Aggiorna Docker."
  exit 1
fi

# --- 2. Daemon attivo e raggiungibile? -------------------------------------
if ! docker info >/dev/null 2>&1; then
  # Distingue "daemon spento" da "utente senza permessi sul socket".
  sock="/var/run/docker.sock"
  if [ -S "$sock" ] && ! [ -r "$sock" -a -w "$sock" ]; then
    err "Docker è attivo ma l'utente non ha i permessi per usarlo."
    err "Aggiungi l'utente al gruppo docker e ri-accedi:"
    err "  sudo usermod -aG docker \"\$USER\"   (poi logout/login)"
    err "oppure rilancia con sudo:  sudo ./setup.sh"
  else
    err "Il daemon Docker non è attivo. Avvialo e riprova:"
    err "  sudo systemctl enable --now docker"
  fi
  exit 1
fi
ok "Docker presente e attivo."

# --- 3. Pull con fallback su build locale ----------------------------------
info "Provo a scaricare l'immagine già pronta da GHCR..."
if "${COMPOSE[@]}" pull 2>/dev/null && "${COMPOSE[@]}" up -d; then
  ok "Avviato dall'immagine remota (GHCR)."
else
  info "Pull non riuscito (immagine privata/assente o segnaposto non sostituito): costruisco in locale."
  "${COMPOSE[@]}" up -d --build
  ok "Avviato dall'immagine costruita in locale."
fi

# --- 4. URL di accesso -----------------------------------------------------
# Determina l'IP LAN della macchina in modo portabile.
lan_ip=""
if command -v hostname >/dev/null 2>&1 && hostname -I >/dev/null 2>&1; then
  lan_ip="$(hostname -I 2>/dev/null | awk '{print $1}')"
fi
if [ -z "$lan_ip" ] && command -v ip >/dev/null 2>&1; then
  lan_ip="$(ip route get 1.1.1.1 2>/dev/null | awk '{for(i=1;i<=NF;i++) if($i=="src"){print $(i+1); exit}}')"
fi

echo
ok "Sito di studio in esecuzione."
echo "   • Su questo PC:        http://localhost:${PORT}"
if [ -n "$lan_ip" ]; then
  echo "   • Da altri dispositivi: http://${lan_ip}:${PORT}"
else
  echo "   • Da altri dispositivi: http://<IP-di-questo-PC>:${PORT}"
fi
echo
info "Per fermarlo:  ${COMPOSE[*]} down"
