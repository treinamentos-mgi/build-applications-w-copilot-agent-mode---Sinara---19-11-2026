import { Schema, model } from 'mongoose';

const workoutSchema = new Schema({
  title: { type: String, required: [true, 'O título do treino é obrigatório'], trim: true },
  focus: { type: String, required: [true, 'O foco do treino é obrigatório'], trim: true },
  minutes: { type: Number, required: [true, 'A duração do treino é obrigatória'], min: [1, 'A duração deve ser de pelo menos 1 minuto'] },
  difficulty: { type: String, required: [true, 'A dificuldade do treino é obrigatória'], trim: true },
});

export const Workout = model('Workout', workoutSchema);
