import { useEffect, useState } from 'react';
import { CapabilityCard } from './CapabilityCard.js';
import { getJson } from '../api/client.js';

type Team = { name: string; members: unknown[] };

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJson<{ teams: Team[] }>('/api/teams')
      .then((data) => setTeams(data.teams))
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Erro ao carregar'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CapabilityCard
      title="Equipes"
      description="Gerencie equipes e integrantes."
      loading={loading}
      error={error}
      empty={teams.length === 0}
      emptyText="Nenhuma equipe cadastrada."
    >
      <ul className="list-group">
        {teams.map((team, index) => (
          <li className="list-group-item" key={`${team.name}-${index}`}>
            {team.name} — {team.members.length} integrante(s)
          </li>
        ))}
      </ul>
    </CapabilityCard>
  );
}
