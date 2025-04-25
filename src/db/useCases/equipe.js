const { pool } = require('../config');

async function getAllEquipes() {
  try {
    const result = await pool.query('SELECT cd_equipe, nm_equipe, tempo FROM equipe');
    // Converte o campo tempo (TIMESTAMP) em segundos decorridos
    const equipes = result.rows.map((equipe) => {
      let segundos = 0;
      if (equipe.tempo) {
        // Converte o tempo do banco e o momento atual para America/Sao_Paulo
        const now = utcToZonedTime(new Date(), 'America/Sao_Paulo');
        const tempo = utcToZonedTime(new Date(equipe.tempo), 'America/Sao_Paulo');
        const diff = (now - tempo) / 1000;
        segundos = Math.floor(Math.max(0, diff)); // Evita valores negativos
      }
      return { ...equipe, tempo: segundos };
    });
    return equipes;
  } catch (error) {
    console.error('Erro ao buscar equipes:', error);
    throw error;
  }
}

async function resetTempoEquipe(cd_equipe) {
  try {
    await pool.query(
        "UPDATE equipe SET tempo = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo' WHERE cd_equipe = $1",
        [cd_equipe]
    );
    return { success: true };
  } catch (error) {
    console.error('Erro ao zerar tempo da equipe:', error);
    throw error;
  }
}

export { getAllEquipes, resetTempoEquipe };