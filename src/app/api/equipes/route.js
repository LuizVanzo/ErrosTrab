import { getAllEquipes } from '../../../db/useCases/equipe.js';

export async function GET() {
  try {
    const equipes = await getAllEquipes();
    return new Response(JSON.stringify(equipes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao buscar equipes na API:', error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar equipes', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}