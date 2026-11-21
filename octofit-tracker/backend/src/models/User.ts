// Pessoa usuária: nome e e-mail obrigatórios; e-mail único.
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: [true, 'O nome é obrigatório'], trim: true },
  email: { type: String, required: [true, 'O e-mail é obrigatório'], trim: true, lowercase: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  fitnessGoal: { type: String, required: [true, 'A meta de condicionamento é obrigatória'], trim: true },
});

export const User = model('User', userSchema);
