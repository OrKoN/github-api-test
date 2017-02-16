# Onboarding

API for getting GitHub users by language with pagination.

## Installation

```sh
npm i
```

## Configuration

 - `PORT` - server's port
 - `GITHUB_TOKEN` - Github API token (you can get one here https://github.com/settings/tokens)


## Docker build

```sh
docker build -t onboarding .
```

## Docker run

```sh
docker run \
  -d \
  -e "NODE_ENV=production" \
  -e "GITHUB_TOKEN=$GITHUB_TOKEN" \
  -u "node" \
  -p 3000:3000 \
  --name "onboarding" \
  onboarding
```
