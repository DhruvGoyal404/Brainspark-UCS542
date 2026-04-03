#!/usr/bin/env pwsh
# AWS Elastic Beanstalk Quick Deploy Script
# Usage: .\deploy-aws.ps1

Write-Host "🚀 BrainSpark AWS Deployment Script" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""

# Check if AWS CLI is installed
Write-Host "✓ Checking AWS CLI..." -ForegroundColor Cyan
$awsCheck = aws --version 2>$null
if (-not $awsCheck) {
    Write-Host "❌ AWS CLI not found. Please install it from https://aws.amazon.com/cli/" -ForegroundColor Red
    exit 1
}
Write-Host "  AWS CLI: $awsCheck" -ForegroundColor Green

# Check if EB CLI is installed
Write-Host "✓ Checking EB CLI..." -ForegroundColor Cyan
$ebCheck = eb --version 2>$null
if (-not $ebCheck) {
    Write-Host "❌ EB CLI not found. Install with: pip install awsebcli" -ForegroundColor Red
    exit 1
}
Write-Host "  EB CLI: $ebCheck" -ForegroundColor Green

# Check if we're in the server directory
if (-not (Test-Path "server.js")) {
    Write-Host "❌ Error: Run this script from the server directory!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 1: Install dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Check if EB is initialized..." -ForegroundColor Yellow
if (-not (Test-Path ".elasticbeanstalk")) {
    Write-Host "⚠️  .elasticbeanstalk not found. You need to run: eb init" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "First time setup:" -ForegroundColor Cyan
    Write-Host "  1. eb init brainspark-api -p node.js-20 --region ap-south-1" -ForegroundColor Cyan
    Write-Host "  2. eb create brainspark-api-dev --instance_type t2.micro" -ForegroundColor Cyan
    Write-Host "  3. Then run this script again" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "Step 3: Deploy to Elastic Beanstalk..." -ForegroundColor Yellow
eb deploy

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Deployment successful!" -ForegroundColor Green
Write-Host ""
Write-Host "Getting your API URL..." -ForegroundColor Cyan
$status = eb status
Write-Host $status

Write-Host ""
Write-Host "🎉 Your API is live!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Update frontend API URL in client/src/utils/api.js" -ForegroundColor Cyan
Write-Host "  2. Run: npm run build && npm run deploy" -ForegroundColor Cyan
Write-Host "  3. View logs: eb logs -f" -ForegroundColor Cyan
