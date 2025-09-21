const bcrypt = require('bcryptjs');

async function generateHashes() {
  try {
    const saltRounds = 10;
    
    // Gerar hash para admin123
    const adminHash = await bcrypt.hash('admin123', saltRounds);
    console.log('Hash para admin123:', adminHash);
    
    // Gerar hash para user123
    const userHash = await bcrypt.hash('user123', saltRounds);
    console.log('Hash para user123:', userHash);
    
  } catch (error) {
    console.error('Erro ao gerar hashes:', error);
  }
}

generateHashes();