const axios = require('axios');

// Configuração da API
const API_BASE = 'http://localhost:3001/api';

async function testarAutenticacao() {
  console.log('🔐 TESTANDO SISTEMA DE AUTENTICAÇÃO JWT');
  console.log('=====================================\n');

  try {
    // Teste 1: Fazer login com admin
    console.log('1️⃣ Testando login do administrador...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@sistema.com',
      password: 'admin123'
    });

    if (loginResponse.data.token) {
      console.log('✅ Login realizado com sucesso!');
      console.log(`   Token: ${loginResponse.data.token.substring(0, 20)}...`);
      console.log(`   Usuário: ${loginResponse.data.user.username}`);
      console.log(`   Role: ${loginResponse.data.user.role}\n`);

      // Teste 2: Verificar token
      console.log('2️⃣ Testando verificação de token...');
      const verifyResponse = await axios.get(`${API_BASE}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${loginResponse.data.token}`
        }
      });

      console.log('✅ Token válido!');
      console.log(`   Usuário verificado: ${verifyResponse.data.user.username}\n`);

      // Teste 3: Buscar perfil
      console.log('3️⃣ Testando busca de perfil...');
      const profileResponse = await axios.get(`${API_BASE}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${loginResponse.data.token}`
        }
      });

      console.log('✅ Perfil obtido com sucesso!');
      console.log(`   ID: ${profileResponse.data.user.id}`);
      console.log(`   Email: ${profileResponse.data.user.email}`);
      console.log(`   Criado em: ${new Date(profileResponse.data.user.created_at).toLocaleString('pt-BR')}\n`);

    }

    // Teste 4: Login com usuário comum
    console.log('4️⃣ Testando login de usuário comum...');
    const userLoginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'usuario@sistema.com',
      password: 'user123'
    });

    if (userLoginResponse.data.token) {
      console.log('✅ Login de usuário comum realizado com sucesso!');
      console.log(`   Usuário: ${userLoginResponse.data.user.username}`);
      console.log(`   Role: ${userLoginResponse.data.user.role}\n`);
    }

    console.log('🎉 TODOS OS TESTES PASSARAM!');
    console.log('=====================================');
    console.log('✅ Sistema de autenticação funcionando perfeitamente!');

  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error.response?.data?.error || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 DICA: Certifique-se de que:');
      console.log('   1. O backend está rodando (executar_backend.bat)');
      console.log('   2. O MySQL está ativo e conectado');
      console.log('   3. A tabela users foi criada no banco');
    }
  }
}

// Executar teste apenas se chamado diretamente
if (require.main === module) {
  testarAutenticacao();
}

module.exports = testarAutenticacao;