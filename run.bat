@echo off
REM Create virtual environment if it doesn't exist
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install requirements
echo Installing requirements...
pip install -r requirements.txt

REM Run Flask application
echo Starting Flask application...
echo.
echo Opening browser at http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
python app.py
pause
