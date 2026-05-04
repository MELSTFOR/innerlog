$githubUser = "MELSTFOR"
$githubPassword = "mforgiarini89"
$repoName = "innerlog"
$projectPath = "c:\Users\Usuario\Desktop\INNERLOG"

Write-Host "🔄 Pushing code to GitHub..."
cd $projectPath

git config user.email "mforgiarini.89@gmail.com"
git config user.name "Melina Forgiarini"

$remoteUrl = "https://${githubUser}:${githubPassword}@github.com/${githubUser}/${repoName}.git"
git remote remove origin 2>$null
git remote add origin $remoteUrl

git branch -M main
git push -u origin main --force 2>&1

Write-Host ""
Write-Host "OK Code pushed to GitHub!"
Write-Host ""
Write-Host "Next step: Deploy to Render.com"
Write-Host "1. Go to https://render.com/dashboard"
Write-Host "2. Click New Web Service"
Write-Host "3. Connect GitHub and select innerlog"
Write-Host ""
Write-Host "Repository: https://github.com/${githubUser}/${repoName}"
