@echo off
chcp 65001 >nul
echo ===================================================
echo     DANG DAY CODE LEN GITHUB: o936315009/clb
echo ===================================================
echo.
cd /d "%~dp0"
echo 1. Dang them tat ca cac thay doi moi (git add .) ...
git add .
echo.
echo 2. Dang ghi nhan thay doi (git commit) ...
git commit -m "Fix luu tru du lieu CLB moi tao, bo sung luu session diem danh va chot tru vi nhanh"
echo.
echo 3. Dang day code len GitHub (git push -u origin main) ...
echo (Neu co cua so trinh duyet bat len, vui long chon 'Sign in with your browser' de xac thuc)
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ===================================================
    echo    CHUC MUNG! CODE DA DUOC DAY LEN GITHUB THANH CONG!
    echo ===================================================
) else (
    echo [THONG BAO] Kiem tra lai ket noi hoac quyen truy cap tai khoan GitHub.
)
echo.
pause
