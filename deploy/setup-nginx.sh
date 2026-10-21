#!/usr/bin/env bash
set -euo pipefail
[[ "$EUID" -eq 0 ]] || { echo 'Run this one-time setup with sudo.'; exit 1; }
commit=${1:?Provide the GitHub build commit SHA}
[[ "$commit" =~ ^[0-9a-f]{40}$ ]]
source_dir=$(cd "$(dirname "$0")" && pwd)
base=/srv/itadbeer
owner=edris
marker="$base/.managed-by-itadbeer-deploy"
available=/etc/nginx/sites-available/itadbeer.com
enabled=/etc/nginx/sites-enabled/itadbeer.com

command -v nginx >/dev/null
command -v certbot >/dev/null
nginx -t
if [[ ( -e "$available" || -L "$enabled" || -e "$enabled" ) && ! -f "$marker" ]]; then
    echo 'An existing Itadbeer configuration needs inspection before replacement.'; exit 1
fi
[[ -s "$source_dir/site.tar.gz" && -f "$source_dir/remote-release.sh" ]]
install -d -o "$owner" -g "$owner" -m 755 "$base" "$base/releases"
install -d -o "$owner" -g "$owner" -m 700 "$base/incoming" "$base/history"
install -d -m 755 "$base/acme" /etc/nginx/snippets

if [[ ! -e "$base/current" && ! -L "$base/current" ]]; then
    release="$commit-0-1"
    digest=$(sha256sum "$source_dir/site.tar.gz" | cut -d ' ' -f 1)
    install -o "$owner" -g "$owner" -m 600 "$source_dir/site.tar.gz" "$base/incoming/$release.tar.gz"
    runuser -u "$owner" -- bash "$source_dir/remote-release.sh" activate "$base" "$release" "$digest" "$commit"
fi
[[ -L "$base/current" ]]
printf 'itadbeer/itadbeer-website\n' > "$marker"
install -m 644 "$source_dir/nginx/itadbeer-static.conf" /etc/nginx/snippets/itadbeer-static.conf
install -m 644 "$source_dir/nginx/itadbeer-http.conf" /etc/nginx/itadbeer-http.conf
if [[ ! -e "$enabled" ]]; then
    install -m 644 "$source_dir/nginx/itadbeer-http.conf" "$available"
    ln -s "$available" "$enabled"
fi
if [[ -f /etc/letsencrypt/live/itadbeer.com/fullchain.pem ]]; then
    install -m 644 "$source_dir/nginx/itadbeer-https.conf" "$available"
else
    # The CDN redirects HTTP challenges to HTTPS. Give those requests their own
    # host routing instead of the existing default site's redirect to adhkar.ir.
    install -m 644 "$source_dir/nginx/itadbeer-bootstrap-https.conf" "$available"
fi
if ! nginx -t; then
    rm -f -- "$enabled"
    echo 'The new site was disabled because validation failed. Nginx was not reloaded.'
    exit 1
fi
systemctl reload nginx

# Check the actual CDN path before consuming an ACME authorization attempt.
challenge="$base/acme/.well-known/acme-challenge"
mkdir -p "$challenge"
probe="itadbeer-$(date +%s)-$$"
printf '%s' "$probe" > "$challenge/$probe"
chmod 644 "$challenge/$probe"
for domain in itadbeer.com www.itadbeer.com; do
    if ! result=$(curl --fail --silent --show-error --max-time 30 "https://$domain/.well-known/acme-challenge/$probe") || [[ "$result" != "$probe" ]]; then
        rm -f -- "$challenge/$probe"
        echo "The CDN is not forwarding $domain to the matching origin host. Check ArvanCloud origin Host/SNI settings before retrying."
        exit 1
    fi
done
rm -f -- "$challenge/$probe"

# Reuse the server's existing ACME account. No new account or terms acceptance.
certbot certonly --non-interactive --webroot -w "$base/acme" --cert-name itadbeer.com -d itadbeer.com -d www.itadbeer.com --keep-until-expiring
install -m 644 "$source_dir/nginx/itadbeer-https.conf" "$available"
nginx -t
systemctl reload nginx

install -d -m 755 /etc/letsencrypt/renewal-hooks/deploy
cat > /etc/letsencrypt/renewal-hooks/deploy/itadbeer-reload-nginx <<'HOOK'
#!/bin/sh
if [ "${RENEWED_LINEAGE:-}" = /etc/letsencrypt/live/itadbeer.com ]; then
    /usr/sbin/nginx -t && /bin/systemctl reload nginx
fi
HOOK
chmod 755 /etc/letsencrypt/renewal-hooks/deploy/itadbeer-reload-nginx
systemctl enable --now certbot.timer
echo 'Itadbeer Nginx and HTTPS are configured. Other site configuration files were not edited.'
