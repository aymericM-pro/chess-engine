```bash
#!/usr/bin/env bash

set -e

PROJECT_KEY=$(basename "$PWD")
SONAR_PORT=9000
SONAR_CONTAINER="sonarqube"
SONAR_TOKEN_FILE=".sonar_token"

echo "→ Lancement SonarQube (Docker)..."

# Lance SonarQube
docker run -d \
  --name $SONAR_CONTAINER \
  -p $SONAR_PORT:9000 \
  sonarqube:community

echo "→ Attente du démarrage (≈40s)..."
sleep 40

echo "→ SonarQube: http://localhost:$SONAR_PORT (admin/admin)"

cat <<EOF > sonar-project.properties
sonar.projectKey=$PROJECT_KEY
sonar.projectName=$PROJECT_KEY
sonar.host.url=http://localhost:$SONAR_PORT
sonar.sourceEncoding=UTF-8
sonar.sources=src
sonar.exclusions=node_modules/**,dist/**,.next/**
EOF

echo "→ Config sonar créée"

if [ ! -f "$SONAR_TOKEN_FILE" ]; then
  echo "→ Colle ton token SonarQube"
  read -s SONAR_TOKEN
  echo $SONAR_TOKEN > $SONAR_TOKEN_FILE
else
  SONAR_TOKEN=$(cat $SONAR_TOKEN_FILE)
fi

# --- INSTALL SCANNER VIA PNPM ---
echo "→ Utilisation de sonar-scanner via pnpm dlx"

pnpm dlx sonar-scanner \
  -Dsonar.login=$SONAR_TOKEN

echo "✔ Analyse terminée"
```
