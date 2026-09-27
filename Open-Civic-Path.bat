@echo off
title CIVIC PATH Launcher
echo ===================================================
echo Starting CIVIC PATH - Intelligent Civic Navigator
echo ===================================================

:: Ensure node is found
set "PATH=C:\Program Files\nodejs;%PATH%"

:: Open in default browser
start http://localhost:3000

:: Start server if not running
cd /d "%~dp0"
node server/server.js
pause
