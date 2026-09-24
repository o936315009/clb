@echo off
chcp 65001 >nul
echo ===================================================
echo     DANG DAY CODE LEN GITHUB: o936315009/clb
echo ===================================================
echo.
cd /d "%~dp0"
echo Dang thuc hien: git push -u origin main ...
echo (Neu co cua so trinh duyet bat len, vui long chon 'Sign in with your browser' de xac thuc)
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ===================================================
    echo    CHUC MUNG! CODE DA DUOC DAY LEN GITHUB THANH CONG!
    echo ===================================================
) else (
    echo [LOI] Khong the day code. Vui long kiem tra lai quyen truy cap tai khoan GitHub.
)
echo.
pause
