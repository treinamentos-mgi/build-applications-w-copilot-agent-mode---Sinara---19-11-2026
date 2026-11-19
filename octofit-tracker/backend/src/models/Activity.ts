import { Schema, model } from 'mongoose';

export const activityTypes = ['run', 'cycle', 'walk', 'swim', 'strength', 'yoga'] as const;

const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'A pessoa usuária é obrigatória'] },
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: [true, 'A equipe é obrigatória'] },
  type: { type: String, required: [true, 'O tipo de atividade é obrigatório'], enum: { values: activityTypes, message: 'Tipo de atividade inválido' } },
  minutes: { type: Number, required: [true, 'A duração em minutos é obrigatória'], min: [1, 'A duração deve ser de pelo menos 1 minuto'] },
  points: { type: Number, required: [true, 'A pontuação é obrigatória'], min: [1, 'A pontuação deve ser positiva'] },
  occurredAt: { type: Date, required: [true, 'A data da atividade é obrigatória'] },
});

export const Activity = model('Activity', activitySchema);
