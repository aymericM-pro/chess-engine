```bash
#!/usr/bin/env bash

set -e

# --- CONFIG ---
REPO_NAME=$(basename "$PWD")
DEFAULT_BRANCH="main"
DEV_BRANCH="dev"
REMOTE_URL=$1

echo "→ Setup du repo: $REPO_NAME"

# --- INIT GIT ---
if [ ! -d ".git" ]; then
  git init
fi

# --- BRANCHE MAIN ---
git checkout -B $DEFAULT_BRANCH

# --- .gitignore ---
if [ ! -f ".gitignore" ]; then
cat <<EOF > .gitignore
node_modules/
dist/
build/
.env
.DS_Store
coverage/
*.log
EOF
fi

# --- README ---
if [ ! -f "README.md" ]; then
  echo "# $REPO_NAME" > README.md
fi

# --- COMMIT INITIAL ---
git add .
git commit -m "chore: initial commit" || echo "→ Rien à commit"

# --- REMOTE + PUSH MAIN ---
if [ -n "$REMOTE_URL" ]; then
  git remote remove origin 2>/dev/null || true
  git remote add origin "$REMOTE_URL"
  git push -u origin $DEFAULT_BRANCH
else
  echo "→ Aucun remote fourni"
fi

# --- BRANCHE DEV ---
git checkout -b $DEV_BRANCH

# --- PUSH DEV ---
if [ -n "$REMOTE_URL" ]; then
  git push -u origin $DEV_BRANCH
fi

# --- RETOUR SUR MAIN ---
git checkout $DEFAULT_BRANCH

echo "✔ Repo prêt avec branches: main + dev"
```
