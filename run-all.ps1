Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  HELLO Hyperlocal Platform — Starting All Services...   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Backend API (NestJS):        http://localhost:4000/api/v1" -ForegroundColor Green
Write-Host "     Swagger Documentation:       http://localhost:4000/api/docs" -ForegroundColor Green
Write-Host "  2. Customer & Partner Website:  http://localhost:3000" -ForegroundColor Yellow
Write-Host "  3. Super Admin Console:         http://localhost:3001" -ForegroundColor Magenta
Write-Host "  4. Mobile Interactive Web Sim:  http://localhost:3002" -ForegroundColor Blue
Write-Host "  5. Mobile Expo Metro Bundler:   http://localhost:8081" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting Turbo Monorepo Parallel Runner..." -ForegroundColor White

pnpm dev
