import { resetTempoEquipe } from '../../../../db/useCases/equipe.js';

export async function POST(request) {
  try {
    const { cd_equipe } = await request.json();
    if (!cd_equipe) {
      return new Response(JSON.stringify({ error: 'cd_equipe é obrigatório' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await resetTempoEquipe(cd_equipe);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao resetar tempo na API:', error);
    return new Response(JSON.stringify({ error: 'Erro ao resetar tempo', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}