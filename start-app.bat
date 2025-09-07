@echo off
echo Starting Bus Tracker App...
echo.

echo Starting Server...
start "Server" cmd /k "cd server && node server.js"

echo Waiting for server to start...
timeout /t 5 /nobreak > nul

echo Starting React App...
start "React App" cmd /k "npm start"

echo.
echo Both apps are starting...
echo Server: http://localhost:3001
echo React App: http://localhost:3000/bus-timetable
echo.
echo Press any key to exit...
pause > nul


