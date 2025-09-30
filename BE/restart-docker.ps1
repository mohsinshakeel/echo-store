Write-Host "🔄 Stopping and removing existing containers..." -ForegroundColor Yellow
docker-compose down

Write-Host "🧹 Cleaning up old images (optional)..." -ForegroundColor Yellow
docker system prune -f

Write-Host "🚀 Building and starting services..." -ForegroundColor Green
docker-compose up --build -d

Write-Host "📊 Checking service status..." -ForegroundColor Cyan
docker-compose ps

Write-Host "📝 Viewing logs..." -ForegroundColor Magenta
docker-compose logs -f
