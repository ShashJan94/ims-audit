@echo off
REM Quick Start Guide for IMS Audit Management System (Windows)

echo ==================================
echo IMS Audit Management System
echo Quick Start Script (Windows)
echo ==================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo. ^(X^) Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js installed
node --version
echo.
echo [OK] npm installed
npm --version
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
call npm install

if errorlevel 1 (
    echo [ERROR] Installation failed!
    pause
    exit /b 1
)

echo [OK] Dependencies installed successfully!
echo.
echo [INFO] Starting development server...
echo.
call npm run dev

pause
