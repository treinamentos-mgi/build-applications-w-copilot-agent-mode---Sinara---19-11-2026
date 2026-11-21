import { useEffect, useState } from 'react';
import { CapabilityCard } from './CapabilityCard.js';
import { getJson } from '../api/client.js';

type LeaderboardEntry = { teamName: string; totalPoints: number; rank: number };

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJson<{ leaderboard: LeaderboardEntry[] }>('/api/leaderboard')
      .then((data) => setEntries(data.leaderboard))
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Erro ao carregar'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CapabilityCard
      title="Placar"
      description="Compare a pontuação total das equipes."
      loading={loading}
      error={error}
      empty={entries.length === 0}
      emptyText="Sem classificação disponível."
    >
      <ol className="list-group list-group-numbered">
        {entries.map((entry) => (
          <li className="list-group-item" key={entry.rank}>
            {entry.teamName} — {entry.totalPoints} pontos
          </li>
        ))}
      </ol>
    </CapabilityCard>
  );
}
