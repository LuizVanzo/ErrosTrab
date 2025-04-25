'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';

// Função para formatar o tempo em dias, horas, minutos e segundos
const formatarTempo = (segundos) => {
  if (!segundos || isNaN(segundos)) return '0d 0h 0m 0s';
  const dias = Math.floor(segundos / (3600 * 24));
  segundos %= 3600 * 24;
  const horas = Math.floor(segundos / 3600);
  segundos %= 3600;
  const minutos = Math.floor(segundos / 60);
  segundos = Math.floor(segundos % 60);

  return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
};

export default function Home() {
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar os dados das equipes
  const fetchEquipes = async () => {
    try {
      const response = await fetch('/api/equipes', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setEquipes(data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar equipes:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Função para zerar o tempo de uma equipe
  const resetTempo = async (cd_equipe) => {
    try {
      const response = await fetch('/api/equipes/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cd_equipe }),
      });
      if (!response.ok) {
        throw new Error('Erro ao zerar o tempo');
      }
      // Atualiza o tempo da equipe localmente para 0
      setEquipes((prevEquipes) =>
        prevEquipes.map((equipe) =>
          equipe.cd_equipe === cd_equipe ? { ...equipe, tempo: 0 } : equipe
        )
      );
    } catch (err) {
      console.error('Erro ao resetar tempo:', err);
      setError(err.message);
    }
  };

  // Atualiza os contadores a cada segundo
  useEffect(() => {
    fetchEquipes();
    const interval = setInterval(() => {
      setEquipes((prevEquipes) =>
        prevEquipes.map((equipe) => ({
          ...equipe,
          tempo: equipe.tempo + 1,
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center py-8">
      <Head>
        <title>Contador de Tempo Sem Bugs</title>
        <meta name="description" content="Contador de tempo sem bugs por equipe" />
      </Head>

      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 drop-shadow-md">
          Dias sem acidentes
        </h1>
        <p className="text-lg text-gray-600 mt-2">Acompanhe o desempenho das equipes em tempo real!</p>
      </header>

      <main className="container mx-auto px-4 max-w-6xl">
        {loading ? (
          <p className="text-center text-xl text-gray-700 animate-pulse">Carregando...</p>
        ) : error ? (
          <p className="text-center text-xl text-red-600 bg-red-100 p-4 rounded-lg">
            Erro: {error}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1">
            {equipes.map((equipe) => (
              <div
                key={equipe.cd_equipe}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <h2 className="text-4xl font-semibold text-gray-800 mb-3 text-center">
                  {equipe.nm_equipe}
                </h2>
                <p className="text-3xl font-semi-bold text-blue-600 text-center mb-4">
                  {formatarTempo(equipe.tempo)}
                </p>
                <button
                  onClick={() => resetTempo(equipe.cd_equipe)}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Zerar Tempo
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}