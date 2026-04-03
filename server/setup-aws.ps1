#!/usr/bin/env pwsh
# AWS Elastic Beanstalk First Time Setup Script
# Usage: .\setup-aws.ps1

Write-Host "🚀 AWS Elastic Beanstalk Setup" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host ""

# Step 1: Check if EB CLI is installed
Write-Host "Step 1: Checking EB CLI..." -ForegroundColor Cyan
$ebCheck = eb --version 2>$null
if (-not $ebCheck) {
    Write-Host "❌ EB CLI not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install using pip:" -ForegroundColor Yellow
    Write-Host "  pip install awsebcli --upgrade --user" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or using Chocolatey (if installed):" -ForegroundColor Yellow
    Write-Host "  choco install awsebcli" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ EB CLI found: $ebCheck" -ForegroundColor Green

# Step 2: Configure AWS credentials
Write-Host ""
Write-Host "Step 2: Checking AWS credentials..." -ForegroundColor Cyan
$awsIdentity = aws sts get-caller-identity 2>$null
if (-not $awsIdentity) {
    Write-Host "❌ AWS credentials not configured!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Run the following command:" -ForegroundColor Yellow
    Write-Host "  aws configure" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You'll need:" -ForegroundColor Cyan
    Write-Host "  • AWS Access Key ID (from AWS IAM console)" -ForegroundColor Cyan
    Write-Host "  • AWS Secret Access Key" -ForegroundColor Cyan
    Write-Host "  • Default region: ap-south-1 (or your preferred region)" -ForegroundColor Cyan
    exit 1
}
Write-Host "✅ AWS credentials configured" -ForegroundColor Green

# Step 3: Initialize Elastic Beanstalk
Write-Host ""
Write-Host "Step 3: Initializing Elastic Beanstalk..." -ForegroundColor Cyan
Write-Host ""

# Check if already initialized
if (Test-Path ".elasticbeanstalk") {
    Write-Host "⚠️  Elastic Beanstalk already initialized in this directory" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To create a new environment, run:" -ForegroundColor Cyan
    Write-Host "  eb create brainspark-api-dev --instance_type t2.micro" -ForegroundColor Yellow
    exit 0
}

# Get app name
$appName = Read-Host "Enter application name (default: brainspark-api)"
if ([string]::IsNullOrWhiteSpace($appName)) {
    $appName = "brainspark-api"
}

# Get environment name
$envName = Read-Host "Enter environment name (default: brainspark-api-dev)"
if ([string]::IsNullOrWhiteSpace($envName)) {
    $envName = "brainspark-api-dev"
}

# Get region
Write-Host ""
Write-Host "Available regions:" -ForegroundColor Yellow
Write-Host "  • ap-south-1 (India - Mumbai)" -ForegroundColor Gray
Write-Host "  • ap-southeast-1 (Singapore)" -ForegroundColor Gray
Write-Host "  • us-east-1 (US - N. Virginia)" -ForegroundColor Gray
Write-Host "  • eu-west-1 (EU - Ireland)" -ForegroundColor Gray
Write-Host ""
$region = Read-Host "Enter region (default: ap-south-1)"
if ([string]::IsNullOrWhiteSpace($region)) {
    $region = "ap-south-1"
}

# Initialize
Write-Host ""
Write-Host "Running: eb init $appName -p node.js-20 --region $region" -ForegroundColor Yellow
eb init $appName -p node.js-20 --region $region

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Initialization failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Elastic Beanstalk initialized successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next step: Create your first environment" -ForegroundColor Cyan
Write-Host "  Run: .\setup-environment.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "or manually:" -ForegroundColor Cyan
Write-Host "  eb create $envName --instance_type t2.micro" -ForegroundColor Yellow
