import { Schema, model } from 'mongoose';

const teamSchema = new Schema({
  name: { type: String, required: [true, 'O nome da equipe é obrigatório'], trim: true },
  mascot: { type: String, required: [true, 'O mascote da equipe é obrigatório'], trim: true },
  members: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },
});

export const Team = model('Team', teamSchema);
