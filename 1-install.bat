@echo off
echo
echo [Please run this script as Admin]
echo
SET currentPath=%~dp0
call cd %currentPath%
echo    UD-Souscription
echo  etapes de validation
pause
echo ^|______^>START^<______
echo ^|
echo ^|-[1/6]-node.js
goto:node

:node
call node -v
SET node=%ERRORLEVEL%
if %node% == 1 (goto:nodeKO)
echo ^|-[OK]
echo ^|
goto:npm

:npm
echo ^|-[2/6]-npm
call npm -v
SET npm=%ERRORLEVEL%
if %npm% == 1 (goto:npmKO)
echo ^|-[OK]
echo ^|
goto:electron

:electron
echo ^|-[3/6]-electron
call electron -v
SET electron=%ERRORLEVEL%
if %electron% == 1 (goto:electronRETRY)
echo ^|-[OK]
echo ^|
goto:electronpackager

:electronRETRY
call npm install electron -g
SET electronpackager2=%ERRORLEVEL%
if %electronpackager2% == 1 (goto:electronKO)
echo ^|-[OK]
echo ^|
goto:electronpackager

:electronpackager
echo ^|-[4/6]-electron-packager
call electron-packager --version
SET electronpackager=%ERRORLEVEL%
if %electronpackager% == 1 (goto:electronpackagerRETRY)
echo ^|-[OK]
echo ^|
goto:electronReload

:electronpackagerRETRY
call npm install electron-packager --save-dev
call npm install electron-packager -g
SET electronpackager2=%ERRORLEVEL%
if %electronpackager2% == 1 (goto:electronpackagerKO)
echo ^|-[OK]
echo ^|
goto:electronReload

:electronReload
echo ^|-[5/6]-electron-reload
call npm view electron-reload version
SET electronReload=%ERRORLEVEL%
if %electronReload% == 1 (goto:electronReloadRETRY)
echo ^|-[OK]
echo ^|
goto:electronIsDev

:electronReloadRETRY
call npm install electron-reload --save-dev
call npm install electron-reload -g
SET electronReload2=%ERRORLEVEL%
if %electronReload2% == 1 (goto:electronReloadKO)
echo ^|-[OK]
echo ^|
goto:electronIsDev

:electronIsDev
echo ^|-[6/6]-electron-is-dev
call npm view electron-is-dev version
SET electronIsDev=%ERRORLEVEL%
if %electronIsDev% == 1 (goto:electronIsDevRETRY)
echo ^|-[OK]
echo ^|
goto:end

:electronIsDevRETRY
call npm install electron-is-dev --save-dev
call npm install electron-is-dev -g
SET electronIsDev2=%ERRORLEVEL%
if %electronIsDev2% == 1 (goto:electronIsDevKO)
echo ^|-[OK]
echo ^|
goto:end

:nodeKO
echo [Vous devez installer node.js avec l'option ajoutant node et npm au path windows]
goto:end

:npmKO
echo [Vous devez réinstaller node.js afin d'avoir accès à npm (ne pas oublier le path)]
goto:end

:electronKO
echo ^|
echo ^|---/^!\--- Electron n'est pas installe ---/^!\--- (commande: npm install electron -g)
echo ^|
goto:end

:electronpackagerKO
echo ^|
echo ^|---/^!\--- Electron-Packager n'est pas installe ---/^!\--- (commande: npm install electron-packager -g)
echo ^|
goto:end

:electronReloadKO
echo ^|
echo ^|---/^!\--- Electron-reload n'est pas installe ---/^!\--- (commande: npm install electron-reload -g)
echo ^|
goto:end

:electronIsDevKO
echo ^|
echo ^|---/^!\--- Electron-reload n'est pas installe ---/^!\--- (commande: npm install electron-reload -g)
echo ^|
goto:end

:end
echo ^|______^>END^<______
pause
