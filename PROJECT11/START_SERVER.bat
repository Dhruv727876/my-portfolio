@echo off
echo ============================================
echo  Starting DRIP Portfolio Server...
echo ============================================
echo.
echo IMPORTANT: Move this file to your PORTFOLIO ROOT:
echo   D:\portfolio\START_SERVER.bat
echo.
echo Your portfolio: http://localhost:3000/index.html
echo DRIP project:   http://localhost:3000/PROJECT11/
echo.
echo Press Ctrl+C to stop the server.
echo.

cd /d "%~dp0"

start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000/index.html"

npx -y serve . -p 3000

pause
