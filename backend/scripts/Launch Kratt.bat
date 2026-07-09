@echo off
cd /d "%~dp0"
title kratt.exe -- youtube comment scraper
color 0A

echo.
echo    K R A T T
echo    how much of the internet is even real?
echo    ---------------------------------------
echo.

:: --- 1. find python -------------------------------------------------
set "PY="
where py >nul 2>nul && set "PY=py"
if not defined PY where python >nul 2>nul && set "PY=python"
if not defined PY (
    echo    [x] Python not found. Install it from python.org, then rerun.
    echo.
    pause
    exit /b 1
)

:: --- 2. dependency, installed once ----------------------------------
%PY% -c "import googleapiclient" >nul 2>nul
if errorlevel 1 (
    echo    [*] first run -- installing google-api-python-client...
    %PY% -m pip install --quiet --disable-pip-version-check google-api-python-client
    if errorlevel 1 (
        echo    [x] pip install failed. Check your connection and rerun.
        echo.
        pause
        exit /b 1
    )
    echo    [ok] installed.
    echo.
)

:: --- 3. api key, asked once then remembered --------------------------
:: (no parentheses here on purpose -- batch expands %VAR% too early inside a block)
if defined YOUTUBE_API_KEY goto haskey
echo    [ ] i am not a robot
echo.
echo    Paste your YouTube Data API key ^(saved for next time^):
set /p "YOUTUBE_API_KEY=    ^> "
if not defined YOUTUBE_API_KEY goto nokey
setx YOUTUBE_API_KEY "%YOUTUBE_API_KEY%" >nul
echo.
echo    [x] verified. key saved -- you won't be asked again.
echo.
:haskey

:: --- 4. the link list, in Notepad instead of a terminal --------------
if not exist videos_to_scrape.csv (
    > videos_to_scrape.csv echo url_or_id,niche_tag
    echo    [*] created videos_to_scrape.csv
)

echo    Opening your link list in Notepad.
echo.
echo      - one video per line, as:  LINK,niche_tag
echo      - the comma and tag are required
echo      - save, then CLOSE Notepad to start scraping
echo.
pause
start /wait notepad videos_to_scrape.csv

:: --- 5. run your script, untouched -----------------------------------
echo.
echo    ---------------------------------------
%PY% scrape_comments.py
echo    ---------------------------------------
echo.
echo    Output appended to raw_comments.csv
echo.
pause
exit /b 0

:nokey
echo.
echo    [x] no key, no kratt.
echo.
pause
exit /b 1
