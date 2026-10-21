#!/usr/bin/env bash
set -euo pipefail
repo=$(cd "$(dirname "$0")/.." && pwd)
test_root=$(mktemp -d "${RUNNER_TEMP:-/tmp}/itadbeer-release-test-XXXXXXXX")
trap 'rm -rf -- "$test_root"' EXIT
mkdir -p "$test_root"/{incoming,releases,history,fixture}

fixture() {
  local commit=$1
  printf '<html lang="en" dir="ltr"><h1>English</h1></html>\n' > "$test_root/fixture/index.html"
  printf '<html lang="fa" dir="rtl"><h1>فارسی</h1></html>\n' > "$test_root/fixture/fa.html"
  printf 'User-agent: *\n' > "$test_root/fixture/robots.txt"
  printf '<urlset/>\n' > "$test_root/fixture/sitemap.xml"
  printf '{"commit":"%s"}' "$commit" > "$test_root/fixture/release.json"
}
package() {
  tar -czf "$test_root/incoming/$1.tar.gz" -C "$test_root/fixture" .
  sha256sum "$test_root/incoming/$1.tar.gz" | cut -d ' ' -f 1
}
first=$(printf 'a%.0s' {1..40})
second=$(printf 'b%.0s' {1..40})
fixture "$first"
first_release="$first-1-1"
first_digest=$(package "$first_release")
bash "$repo/deploy/remote-release.sh" activate "$test_root" "$first_release" "$first_digest" "$first"
[[ "$(readlink "$test_root/current")" == "releases/$first_release" ]]

fixture "$second"
second_release="$second-2-1"
second_digest=$(package "$second_release")
bash "$repo/deploy/remote-release.sh" activate "$test_root" "$second_release" "$second_digest" "$second"
[[ "$(readlink "$test_root/current")" == "releases/$second_release" ]]
bash "$repo/deploy/remote-release.sh" rollback "$test_root" "$second_release" "$second_digest" "$second"
[[ "$(readlink "$test_root/current")" == "releases/$first_release" ]]
[[ -d "$test_root/releases/$second_release" ]]

bad_release="$second-3-1"
bad_digest=$(package "$bad_release")
zeros=$(printf '0%.0s' {1..64})
if bash "$repo/deploy/remote-release.sh" activate "$test_root" "$bad_release" "$zeros" "$second"; then
  echo 'Invalid checksum was accepted.'; exit 1
fi
[[ "$(readlink "$test_root/current")" == "releases/$first_release" ]]
ln -s /etc/passwd "$test_root/fixture/unsafe-link"
linked_release="$second-4-1"
linked_digest=$(package "$linked_release")
if bash "$repo/deploy/remote-release.sh" activate "$test_root" "$linked_release" "$linked_digest" "$second"; then
  echo 'Symlink archive was accepted.'; exit 1
fi
[[ "$(readlink "$test_root/current")" == "releases/$first_release" ]]
echo 'Release tests passed: activate, update, rollback, checksum rejection, symlink rejection, previous-release preservation.'
