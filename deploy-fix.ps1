# Fix for gh-pages deployment when branch doesn't exist
# This script creates the gh-pages branch if it doesn't exist

Write-Host "Building project..." -ForegroundColor Green
npm run build

Write-Host "Checking for gh-pages branch..." -ForegroundColor Yellow
$branchExists = git ls-remote --heads origin gh-pages

if (-not $branchExists) {
    Write-Host "gh-pages branch doesn't exist. Creating it..." -ForegroundColor Yellow
    # Create an orphan branch
    git checkout --orphan gh-pages
    git rm -rf .
    # Copy dist contents
    Copy-Item -Path dist\* -Destination . -Recurse -Force
    git add .
    git commit -m "Initial gh-pages commit"
    git push origin gh-pages
    git checkout main
    Write-Host "gh-pages branch created successfully!" -ForegroundColor Green
} else {
    Write-Host "gh-pages branch exists. Deploying..." -ForegroundColor Green
    npm run deploy
}

