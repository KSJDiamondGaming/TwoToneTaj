# Production Release System

TwoToneTaj uses the standard KSJ production release flow.

## Production path

```txt
/home/twotonetaj/site
```

## Release a new version

Use GitHub Actions:

```txt
Actions -> Release Production -> Run workflow
```

Enter a version without the `v` prefix, for example:

```txt
1.0.0
```

The workflow will:

1. Run the full project check.
2. Create a Git tag such as `v1.0.0`.
3. Create a GitHub release.
4. Optionally deploy that exact tag to production.

## Roll back production

Use GitHub Actions:

```txt
Actions -> Rollback Production -> Run workflow
```

Enter a release tag or commit SHA, for example:

```txt
v1.0.0
```

The rollback workflow deploys the selected ref through `scripts/deploy-vps.sh`.

## Standard rule

Production deployments should prefer fixed release tags instead of moving branch state.

```txt
Release button -> deploy tag
Rollback button -> deploy older tag or commit
```
