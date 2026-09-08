@echo off
setlocal
cd /d "%~dp0"

set "CODEX_NODE=C:\Users\rebor\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
set "CODEX_TOOLS=C:\Users\rebor\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback"

if exist "%CODEX_NODE%\node.exe" if exist "%CODEX_TOOLS%\pnpm.cmd" (
  set "PATH=%CODEX_NODE%;%CODEX_TOOLS%;%PATH%"
  set "PNPM=%CODEX_TOOLS%\pnpm.cmd"
  goto run
)

where pnpm >nul 2>nul
if %errorlevel% equ 0 (
  set "PNPM=pnpm"
  goto run
)

echo.
echo Nao foi possivel encontrar Node.js e pnpm.
echo Instale o Node.js 20 ou superior em https://nodejs.org/
echo Depois execute: corepack enable
echo.
pause
exit /b 1

:run
if not exist "node_modules" (
  echo Instalando dependencias...
  call "%PNPM%" install
  if errorlevel 1 goto failed
)

echo.
echo Iniciando BORANGA em http://localhost:3000
echo Para encerrar, pressione Ctrl+C.
echo.
call "%PNPM%" dev
exit /b %errorlevel%

:failed
echo.
echo Nao foi possivel instalar as dependencias.
pause
exit /b 1
