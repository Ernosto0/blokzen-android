@echo off
rem Blokzen: opens the game as its own app window using Microsoft Edge (or Chrome) already on this PC.
setlocal
set "DIR=%~dp0"
set "URL=file:///%DIR:\=/%game/index.html"
set "PROFILE=%LOCALAPPDATA%\Blokzen"
set FLAGS=--app="%URL%" --user-data-dir="%PROFILE%" --allow-file-access-from-files --window-size=520,940

set "BROWSER="
for %%P in (
  "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
  "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
  "%ProgramFiles%\Google\Chrome\Application\chrome.exe"
  "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
  "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
) do if not defined BROWSER if exist %%P set "BROWSER=%%~P"

if not defined BROWSER (
  echo Microsoft Edge or Google Chrome was not found. Please install one of them.
  pause
  exit /b 1
)
start "" "%BROWSER%" %FLAGS%
