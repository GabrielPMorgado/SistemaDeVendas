@echo off
echo.
echo ==========================================
echo    SISTEMA DE VENDAS - EXECUTAR BACKEND
echo ==========================================
echo.

cd backend

echo Verificando se as dependencias estao instaladas...
if not exist "node_modules" (
    echo Instalando dependencias do backend...
    npm install
)

echo.
echo Iniciando servidor backend em http://localhost:3001
echo Pressione Ctrl+C para parar o servidor
echo.

npm run dev