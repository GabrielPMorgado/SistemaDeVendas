@echo off
echo.
echo ==========================================
echo    SISTEMA DE VENDAS - EXECUTAR FRONTEND
echo ==========================================
echo.

cd frontend

echo Verificando se as dependencias estao instaladas...
if not exist "node_modules" (
    echo Instalando dependencias do frontend...
    npm install
)

echo.
echo Iniciando aplicacao React + Vite em http://localhost:3000
echo A aplicacao abrira automaticamente no navegador
echo Pressione Ctrl+C para parar o servidor
echo.

npm run dev