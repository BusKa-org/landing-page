#!/usr/bin/env bash
#
# Publica a landing page em https://buska.lsd.ufcg.edu.br/landing-page/
#
# O nginx do host serve os arquivos direto de /var/www/buska/landing-page, que
# e um clone deste repositorio. Publicar e atualizar esse clone. Nao existe
# container: o docker-compose que morava aqui servia um caminho que o servidor
# abandonou, e seguir por ele subia um container que ninguem le.
#
# Rode na VM, como ubuntu:  ./deploy.sh
#
set -euo pipefail

WEBROOT=${WEBROOT:-/var/www/buska/landing-page}

if [ ! -d "$WEBROOT/.git" ]; then
  echo "erro: $WEBROOT nao e um clone git" >&2
  exit 1
fi

# Se alguem editou arquivo direto no servidor, o pull apagaria em silencio.
if [ -n "$(sudo git -C "$WEBROOT" status --porcelain)" ]; then
  echo "erro: ha alteracao nao commitada em $WEBROOT, publicar apagaria:" >&2
  sudo git -C "$WEBROOT" status --short >&2
  exit 1
fi

sudo git -C "$WEBROOT" pull --ff-only origin main
echo "publicado: $(sudo git -C "$WEBROOT" log --oneline -1)"

# A VM nao resolve o proprio nome, entao apontamos o nome para o loopback e
# batemos no nginx local. Assim o teste cobre TLS, SNI e o location, sem DNS.
curl -fsSL -o /dev/null -w "no ar: HTTP %{http_code}\n" \
  --resolve buska.lsd.ufcg.edu.br:443:127.0.0.1 \
  --resolve buska.lsd.ufcg.edu.br:80:127.0.0.1 \
  https://buska.lsd.ufcg.edu.br/landing-page/
