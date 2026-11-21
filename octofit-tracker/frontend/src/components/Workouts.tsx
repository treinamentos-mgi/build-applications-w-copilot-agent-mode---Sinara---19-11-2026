import { useEffect, useState } from 'react';
import { CapabilityCard } from './CapabilityCard.js';
import { getJson } from '../api/client.js';

type Suggestion = { title: string; reason: string };

export default function Workouts() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJson<{ suggestions: Suggestion[] }>(`/api/workouts/suggestions/${encodeURIComponent('mona@example.com')}`)
      .then((data) => setSuggestions(data.suggestions))
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Erro ao carregar'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CapabilityCard
      title="Sugestões de treino"
      description="Receba recomendações de treino com base nos seus padrões de atividade."
      loading={loading}
      error={error}
      empty={suggestions.length === 0}
      emptyText="Nenhuma sugestão disponível."
    >
      <ul className="list-group">
        {suggestions.map((suggestion, index) => (
          <li className="list-group-item" key={`${suggestion.title}-${index}`}>
            <strong>{suggestion.title}</strong> — {suggestion.reason}
          </li>
        ))}
      </ul>
    </CapabilityCard>
  );
}
