import { useEffect, useState } from 'react';
import { CapabilityCard } from './CapabilityCard.js';
import { getJson } from '../api/client.js';

type Activity = {
  type: string;
  minutes: number;
  points: number;
};

const activityNames: Record<string, string> = {
  run: 'Corrida',
  cycle: 'Ciclismo',
  walk: 'Caminhada',
  swim: 'Natação',
  strength: 'Força',
  yoga: 'Yoga',
};

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJson<{ activities: Activity[] }>('/api/activities')
      .then((data) => setActivities(data.activities))
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Erro ao carregar'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CapabilityCard
      title="Atividades"
      description="Acompanhe os minutos de atividade e os pontos das pessoas participantes."
      loading={loading}
      error={error}
      empty={activities.length === 0}
      emptyText="Nenhuma atividade cadastrada."
    >
      <ul className="list-group">
        {activities.map((activity, index) => (
          <li className="list-group-item" key={`${activity.type}-${index}`}>
            {activityNames[activity.type] ?? activity.type} — {activity.minutes} minutos — {activity.points} pontos
          </li>
        ))}
      </ul>
    </CapabilityCard>
  );
}
