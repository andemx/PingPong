@echo off
call npm run package-win
echo copy to release repo
pause
Xcopy ".\release-builds\UD44-souscription-win32-ia32\*.*" "..\UD44-souscription-release\" /e /y
pause