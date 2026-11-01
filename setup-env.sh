#!/usr/bin/env bash
# Creates .env for the solar site on the server, with fresh random secrets.
# Run once, inside the cloned repo:   cd /opt/solar && bash setup-env.sh
# It asks (hidden) only for the admin password; nothing is printed or stored elsewhere.
set -euo pipefail

cd "$(dirname "$0")"

if [ -e .env ]; then
  echo ".env already exists. Delete it first if you really want a new one." >&2
  exit 1
fi

ADMIN_PASSWORD=""
while [ "${#ADMIN_PASSWORD}" -lt 12 ]; do
  read -rsp "Admin password for solarlc.com/admin (12+ characters): " ADMIN_PASSWORD
  echo
done

umask 077

cat > .env <<EOF
POSTGRES_PASSWORD=$(openssl rand -hex 24)
SITE_URL=https://solarlc.com
WHATSAPP_NUMBER=916392554283
PHONE_1=+91 63925 54283
PHONE_2=+91 87267 90180
EMAIL=info@solarlc.com
ADDRESS=Saraihazi, Sonwara Mod, Rani ki Sarai, Azamgarh, Uttar Pradesh 276207
GA_ID=
ADMIN_USER=admin
ADMIN_PASSWORD=${ADMIN_PASSWORD}
ADMIN_TOKEN=$(openssl rand -hex 32)
SCRIPTDP_AI_URL=https://app.scriptdp.com/api/v1/ask
SCRIPTDP_AI_KEY=
EOF

echo "Done: .env created (readable only by root)."
echo "Next: docker compose up -d --build"
