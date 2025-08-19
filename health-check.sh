#!/bin/bash
# health-check.sh - Verify all Oxlas services
echo "🔍 Running Oxlas Health Check..."

services=(
  "PostgreSQL: $(docker-compose exec postgres pg_isready -U oxlas &>/dev/null && echo '✅' || echo '❌')"
  "Nextcloud: $(curl -s -f http://localhost:8080 &>/dev/null && echo '✅' || echo '❌')"
  "OnlyOffice: $(curl -s -f http://localhost:8002 &>/dev/null && echo '✅' || echo '❌')"
  "Planka: $(curl -s -f http://localhost:10240 &>/dev/null && echo '✅' || echo '❌')"
  "Ollama: $(curl -s -f http://localhost:11434/api/tags &>/dev/null && echo '✅' || echo '❌')"
  "API Gateway: $(curl -s -f http://localhost:3000/api/health &>/dev/null && echo '✅' || echo '❌')"
)

for service in "${services[@]}"; do
  echo "  $service"
done

echo "✅ Health check complete"