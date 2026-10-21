# Linux production deployment

Repository: https://github.com/itadbeer/itadbeer-website

Primary origin: https://itadbeer.com. The web server should redirect www.itadbeer.com to the primary origin. Set the static document root to `<DEPLOY_PATH>/current`, and resolve `/fa` to `fa.html` while returning actual 404s for unknown paths. Preserve the server's other websites and existing TLS configuration.

## Installed production setup

Nginx serves `/srv/itadbeer/current` on this server. The deployment account is `edris`. The repository deployment switch is enabled, the production environment is restricted to `main`, and the SSH key/verified host keys are encrypted environment secrets. Server address and SSH port are environment variables, not source-code values.

Nginx configurations in `deploy/nginx/` provide apex/www routing, extensionless Persian URLs, real 404 responses, gzip and static-asset caching. HTML and `release.json` are not cached. Certbot manages a certificate covering the apex and www domains; its existing renewal timer is active, and an Itadbeer-specific renewal hook validates and reloads Nginx.

The one-time `setup-nginx.sh` uses sudo and an already-tested GitHub artifact. It creates only Itadbeer's dedicated release directories and site configuration. With ArvanCloud forcing HTTPS, the bootstrap configuration routes challenge requests over the origin's existing default TLS state, verifies the public challenge path, then replaces it with Itadbeer's own certificate. The final active configuration uses `itadbeer-https.conf`, not the bootstrap certificate. Other site files are not edited.

## GitHub Actions

Every push to `main`, pull request to `main`, and manual workflow dispatch builds and verifies the static site. Core GitHub actions are pinned to commit SHAs. Node and all build dependencies run on the GitHub runner; production needs only a static web server, SSH, Bash, GNU tar/coreutils, and standard Unix tools.

The production job runs only on `main` when the repository variable `DEPLOY_ENABLED` is `true`. Set it to `false` to temporarily stop automatic deployments while retaining builds and tests. The `production` environment permits only `main` and needs no manual approval for the requested automatic flow. Entire workflow runs are serialized per ref to prevent competing main-branch builds from deploying out of order.

Set these **production environment variables**:

| Variable | Meaning |
| --- | --- |
| `SSH_HOST` | Linux server hostname or IP |
| `SSH_USER` | Deployment account |
| `SSH_PORT` | SSH port |
| `DEPLOY_PATH` | Absolute directory dedicated to this website, without spaces or `..` |

Set these **production environment secrets**:

| Secret | Meaning |
| --- | --- |
| `DEPLOY_SSH_KEY` | Dedicated SSH private key authorized for the deployment account |
| `SSH_KNOWN_HOSTS` | Verified server host-key lines; never use disabled host-key checking |

Secrets are used only in the production job, never in pull-request builds. No SSH password or key belongs in the repository. The workflow stores temporary key files with restricted permissions and removes them afterwards.

## Release layout and behavior

The deployment account must own writable `incoming/`, `releases/` and `history/` directories inside `DEPLOY_PATH`. `current` must be absent or a symlink to `releases/<release-name>`. It must not be an existing content directory. When migrating an existing website, preserve it as a separate initial release before changing the document root.

The workflow uploads one compressed artifact, checks its SHA-256 on the server, rejects traversal paths and links, extracts into a fresh staging directory, checks required language/discovery documents and commit metadata, then atomically switches `current`. Existing releases are retained. It serializes production deployments and never runs `git pull`, Node builds, package installation, or service restarts on every push.

After switching, it requests `https://itadbeer.com/release.json` and `/fa`, checks the exact commit and RTL document, and rolls back if verification fails. CDN and web-server configuration must bypass caching for HTML and `release.json`; a unique query plus `Cache-Control: no-cache` is used for the health check. CSS/fonts/images may use long-lived caching. Keep `release.json` public for deployment verification.

`remote-release.sh` is passed over the authenticated SSH connection; it is not installed as a public web endpoint. Old release cleanup is deliberately manual. To roll back, use that script's `rollback` mode with the release ID that is currently active; its prior target is recorded in `history/`.

## Verification

`bash deploy/test-release.sh` verifies activation, updating, rollback and rejection of bad checksums/symlink archives inside a disposable directory. It never connects to production. The build job also runs TypeScript, the production export and `verify:static` before producing the deployment artifact.
