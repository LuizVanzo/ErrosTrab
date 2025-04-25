const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

// Configuração do pool com parâmetros para evitar expiração
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  // Configurações do pool
  max: 10, // Máximo de conexões no pool
  min: 2, // Mínimo de conexões mantidas
  idleTimeoutMillis: 30000, // Tempo máximo que uma conexão pode ficar inativa (30 segundos)
  connectionTimeoutMillis: 2000, // Tempo máximo para estabelecer uma conexão
  // SSL para todos os ambientes, já que Tembo.io provavelmente exige
  ssl: {
    rejectUnauthorized: false // Ignora validação de certificado (use com cuidado)
  }
};

const pool = new Pool(poolConfig);

// Tratamento de erros no pool
pool.on('error', (err, client) => {
  console.error('Erro inesperado no pool de conexões:', err.message);
  // Não encerra o pool, permite que tente reconectar
});

// Função para manter conexões ativas (opcional)
async function keepAlive() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Keep-alive query executed:', res.rows[0]);
  } catch (err) {
    console.error('Erro na query keep-alive:', err.message);
  }
}

// Executa keep-alive a cada 5 minutos (300000 ms)
setInterval(keepAlive, 300000);

// Exporta o pool
module.exports = { pool };