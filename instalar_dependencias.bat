@echo off
echo.
echo ==========================================
echo      SISTEMA DE VENDAS - INSTALACAO
echo ==========================================
echo.
echo Este script ira instalar todas as dependencias
echo do projeto (backend e frontend)
echo.
pause

echo.
echo [1/2] Instalando dependencias do BACKEND...
cd backend
npm install

echo.
echo [2/2] Instalando dependencias do FRONTEND...  
cd ../frontend
npm install

echo.
echo ==========================================
echo         INSTALACAO CONCLUIDA!
echo ==========================================
echo.
echo Para executar o sistema:
echo 1. Execute: executar_backend.bat
echo 2. Execute: executar_frontend.bat (em outro terminal)
echo.
echo Lembre-se de configurar o banco MySQL primeiro!
echo Consulte o arquivo GUIA_INSTALACAO.md para detalhes.
echo.
pause