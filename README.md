# GitHub Dependency Webhook

Reusable GitHub Action that posts Composer dependency data to a webhook whenever `composer.json` / `composer.lock` change (or when run manually).

On each run it reads the repository’s Composer files, collects **direct** dependencies (from `require` and `require-dev`), and `POST`s a JSON payload to the URL stored in `DEPENDENCY_WEBHOOK`.

## Setup

1. In the **consuming** repository, add a repository secret named `DEPENDENCY_WEBHOOK` with your webhook endpoint URL.
2. Add a workflow that calls this reusable workflow (see below).

## Usage

Create a workflow in your repo (for example `.github/workflows/push-composer-dependencies.yml`):

```yaml
name: Push Composer Dependencies

on:
  push:
    paths:
      - composer.lock
      - composer.json

  workflow_dispatch:

jobs:
  dependency-sync:
    uses: kayleegherrmann/github-dependancy-webhook/.github/workflows/push_dependancies.yml@main
    secrets:
      DEPENDENCY_WEBHOOK: ${{ secrets.DEPENDENCY_WEBHOOK }}
```

- **`push`** — runs when Composer files change.
- **`workflow_dispatch`** — allows a manual run from the Actions tab.
- Pin `@main` (or a tag/SHA) to the version of this workflow you want.

## Payload

The webhook receives JSON shaped like:

```json
{
  "repository": "owner/repo",
  "branch": "main",
  "commit": "abc123...",
  "actor": "username",
  "message": "commit message or Manual workflow dispatch",
  "ecosystem": "composer",
  "dependencies": [
    {
      "name": "vendor/package",
      "version": "1.2.3",
      "type": "library",
      "source_reference": "git-sha-or-null"
    }
  ]
}
```

Only packages listed in `composer.json` (`require` / `require-dev`) are included; transitive dependencies from the lockfile are omitted.
