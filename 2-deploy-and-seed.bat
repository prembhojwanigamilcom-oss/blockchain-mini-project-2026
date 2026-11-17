@echo off
title Deploy & Seed VERITAS Smart Contracts
echo ========================================================
echo Deploying MarksheetVerification Smart Contract...
echo ========================================================
call npx hardhat run scripts/deploy.ts --network localhost
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Deployment failed!
    echo Please make sure the Hardhat Node is running (run 1-start-hardhat-node.bat first).
    echo.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================================
echo Seeding Sample Marksheets for Viva / Demo...
echo ========================================================
call npx hardhat run scripts/seed-sample-records.ts --network localhost

echo.
echo ========================================================
echo SUCCESS! Smart contract deployed and sample records seeded.
echo You can now refresh http://localhost:5173 in your browser.
echo ========================================================
pause
