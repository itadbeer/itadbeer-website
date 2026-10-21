#!/usr/bin/env bash
set -euo pipefail
mode=${1:?}
base=${2:?}
release=${3:?}
digest=${4:?}
commit=${5:?}
[[ "$base" =~ ^/[A-Za-z0-9_/-]+$ && "$base" != / && "$base" != *..* ]]
[[ "$release" =~ ^[0-9a-f]{40}-[0-9]+-[0-9]+$ && "$digest" =~ ^[0-9a-f]{64}$ && "$commit" =~ ^[0-9a-f]{40}$ ]]
base=$(realpath -e -- "$base")
[[ -d "$base/releases" && -d "$base/incoming" && -d "$base/history" ]]
[[ ! -e "$base/current" || -L "$base/current" ]]

if [[ "$mode" == rollback ]]; then
  [[ "$(readlink "$base/current")" == "releases/$release" ]] || { echo 'A newer release is active; refusing rollback.'; exit 1; }
  previous=$(cat "$base/history/$release.previous")
  if [[ -n "$previous" ]]; then
    [[ "$previous" =~ ^releases/[A-Za-z0-9._-]+$ && -d "$base/$previous" ]]
    ln -s "$previous" "$base/.rollback-$release"
    mv -Tf "$base/.rollback-$release" "$base/current"
  else
    rm -- "$base/current"
  fi
  echo 'Previous release restored.'
  exit 0
fi

[[ "$mode" == activate ]]
archive="$base/incoming/$release.tar.gz"
printf '%s  %s\n' "$digest" "$archive" | sha256sum --check --status
[[ ! -e "$base/releases/$release" ]]
listing=$(tar -tzf "$archive")
if grep -Eq '(^/|(^|/)\.\.(/|$))' <<< "$listing"; then
  echo 'Unsafe path in release archive.'; exit 1
fi
types=$(tar -tvzf "$archive")
if grep -Eq '^[^d-]' <<< "$types"; then
  echo 'Links and special files are not allowed in release archives.'; exit 1
fi

staging=$(mktemp -d "$base/releases/.staging-$release.XXXXXX")
cleanup() {
  if [[ -n "${staging:-}" && "$staging" == "$base/releases/.staging-$release."* ]]; then rm -rf -- "$staging"; fi
}
trap cleanup EXIT
tar --extract --gzip --file "$archive" --directory "$staging" --no-same-owner --no-same-permissions
[[ -s "$staging/index.html" && -s "$staging/fa.html" && -s "$staging/robots.txt" && -s "$staging/sitemap.xml" ]]
grep -q 'lang="fa" dir="rtl"' "$staging/fa.html"
grep -Fq "\"commit\":\"$commit\"" "$staging/release.json"
chmod -R u=rwX,go=rX -- "$staging"
previous=$(readlink "$base/current" || true)
[[ -z "$previous" || ( "$previous" =~ ^releases/[A-Za-z0-9._-]+$ && -d "$base/$previous" ) ]]
printf '%s\n' "$previous" > "$base/history/$release.previous"
mv -- "$staging" "$base/releases/$release"
staging=
ln -s "releases/$release" "$base/.current-$release"
mv -Tf "$base/.current-$release" "$base/current"
rm -- "$archive"
echo "Activated release $release. Older releases are retained for rollback."
