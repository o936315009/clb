@echo off
chcp 65001 >nul
echo ===================================================
echo     DANG DAY CODE LEN GITHUB: o936315009/clb
echo ===================================================
echo.
cd /d "%~dp0"

echo 1. Dang dong bo cac thay doi moi tu GitHub (git pull) ...
git pull --rebase origin main >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    git rebase --abort >nul 2>&1
)

echo.
echo 2. Dang them tat ca cac thay doi moi (git add .) ...
git add .

echo.
echo 3. Dang ghi nhan thay doi (git commit) ...
git commit -m "Moi ngay chi tao 1 hoat dong, quan tri co quyen sua va hoan tac cho den khi chot so cuoi thang"

echo.
echo 4. Dang day code len GitHub (git push) ...
git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [THONG BAO] Dang dong bo cuong che phien ban moi nhat tu may len GitHub...
    git push -u origin main --force
)

echo.
if %ERRORLEVEL% EQU 0 (
    echo ===================================================
    echo    CHUC MUNG! CODE DA DUOC DAY LEN GITHUB THANH CONG!
    echo    Vercel se tu dong cap nhat website sau 1-2 phut.
    echo ===================================================
) else (
    echo ===================================================
    echo [THONG BAO] Neu can dang nhap lai tai khoan GitHub:
    echo Hay chay file 'dang-nhap-lai-github.bat' trong thu muc.
    echo ===================================================
)
echo.
pause
