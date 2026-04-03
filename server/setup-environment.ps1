#!/usr/bin/env pwsh
# AWS Elastic Beanstalk Environment Setup Script
# Run this after eb init to create your environment

Write-Host "🚀 Creating AWS Elastic Beanstalk Environment" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Check if EB is initialized
if (-not (Test-Path ".elasticbeanstalk")) {
    Write-Host "❌ Error: Elastic Beanstalk not initialized!" -ForegroundColor Red
    Write-Host "Run: .\setup-aws.ps1" -ForegroundColor Yellow
    exit 1
}

# Get environment name
$envName = Read-Host "Enter environment name (default: brainspark-api-dev)"
if ([string]::IsNullOrWhiteSpace($envName)) {
    $envName = "brainspark-api-dev"
}

Write-Host ""
Write-Host "Creating environment: $envName" -ForegroundColor Cyan
Write-Host "Instance type: t2.micro (free tier eligible)" -ForegroundColor Yellow
Write-Host ""
Write-Host "This will take 3-5 minutes. Please wait..." -ForegroundColor Yellow
Write-Host ""

# Create environment
eb create $envName --instance_type t2.micro --envvars PORT=5000,NODE_ENV=production

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Environment creation failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Environment created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Set environment variables:" -ForegroundColor Cyan
Write-Host "     eb setenv MONGO_URI='your-mongodb-uri' JWT_SECRET='your-secret' ..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  2. Deploy code:" -ForegroundColor Cyan
Write-Host "     eb deploy" -ForegroundColor Yellow
Write-Host ""
Write-Host "  3. View logs:" -ForegroundColor Cyan
Write-Host "     eb logs -f" -ForegroundColor Yellow
Write-Host ""
Write-Host "  4. Get your API URL:" -ForegroundColor Cyan
Write-Host "     eb status" -ForegroundColor Yellow
