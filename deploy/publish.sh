#!/usr/bin/env bash
set -euo pipefail

: "${SSH_HOST:?}" "${SSH_USER:?}" "${SSH_PORT:?}" "${DEPLOY_PATH:?}" "${RELEASE_ID:?}" "${GITHUB_SHA:?}" "${RUNNER_TEMP:?}"
[[ "$SSH_HOST" =~ ^[A-Za-z0-9.-]+$ && "$SSH_USER" =~ ^[a-z_][a-z0-9_-]*$ ]]
[[ "$SSH_PORT" =~ ^[0-9]+$ && "$SSH_PORT" -gt 0 && "$SSH_PORT" -lt 65536 ]]
[[ "$DEPLOY_PATH" =~ ^/[A-Za-z0-9_/-]+$ && "$DEPLOY_PATH" != / && "$DEPLOY_PATH" != *..* ]]
[[ "$RELEASE_ID" =~ ^[0-9a-f]{40}-[0-9]+-[0-9]+$ && "$GITHUB_SHA" =~ ^[0-9a-f]{40}$ ]]
[[ -s site.tar.gz && -n "${DEPLOY_SSH_KEY:-}" && -n "${SSH_KNOWN_HOSTS:-}" ]]

umask 077
key="$RUNNER_TEMP/itadbeer-deploy-key"
hosts="$RUNNER_TEMP/itadbeer-known-hosts"
printf '%s\n' "$DEPLOY_SSH_KEY" > "$key"
printf '%s\n' "$SSH_KNOWN_HOSTS" > "$hosts"
unset DEPLOY_SSH_KEY SSH_KNOWN_HOSTS
options=(-i "$key" -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=$hosts" -o ConnectTimeout=15 -o ServerAliveInterval=15 -o ServerAliveCountMax=3)
remote="$SSH_USER@$SSH_HOST"
digest=$(sha256sum site.tar.gz | cut -d ' ' -f 1)

scp "${options[@]}" -P "$SSH_PORT" site.tar.gz "$remote:$DEPLOY_PATH/incoming/$RELEASE_ID.tar.gz"
ssh "${options[@]}" -p "$SSH_PORT" "$remote" "bash -s -- activate '$DEPLOY_PATH' '$RELEASE_ID' '$digest' '$GITHUB_SHA'" < deploy/remote-release.sh

health_ok=false
for attempt in {1..6}; do
  if curl --fail --silent --show-error --max-time 20 -H 'Cache-Control: no-cache' "${PRODUCTION_URL%/}/release.json?release=$RELEASE_ID" -o "$RUNNER_TEMP/itadbeer-release.json" &&
     node -e 'const r=require(process.argv[1]);if(r.commit!==process.argv[2])process.exit(1)' "$RUNNER_TEMP/itadbeer-release.json" "$GITHUB_SHA" &&
     curl --fail --silent --show-error --max-time 20 "${PRODUCTION_URL%/}/fa?release=$RELEASE_ID" -o "$RUNNER_TEMP/itadbeer-fa.html" &&
     grep -q 'lang="fa" dir="rtl"' "$RUNNER_TEMP/itadbeer-fa.html"; then
    health_ok=true
    break
  fi
  sleep 5
done

if [[ "$health_ok" != true ]]; then
  echo 'Production verification failed; restoring the previous release.'
  ssh "${options[@]}" -p "$SSH_PORT" "$remote" "bash -s -- rollback '$DEPLOY_PATH' '$RELEASE_ID' '$digest' '$GITHUB_SHA'" < deploy/remote-release.sh
  exit 1
fi
echo "Production verified at commit $GITHUB_SHA."
