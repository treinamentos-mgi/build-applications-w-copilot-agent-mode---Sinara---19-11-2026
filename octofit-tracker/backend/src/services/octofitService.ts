// API do OctoFit: atividades, equipes, placar ordenado por pontos e sugestões de treino.
import mongoose from 'mongoose';
import { Activity, Team, User, Workout } from '../models/index.js';

type Body = Record<string, unknown>;

function httpError(status: number, message: string) {
  return Object.assign(new Error(message), { status });
}

function bodyOf(input: unknown): Body {
  return input && typeof input === 'object' && !Array.isArray(input) ? (input as Body) : {};
}

function isObjectId(value: unknown) {
  return typeof value === 'string' && mongoose.isObjectIdOrHexString(value);
}

// Atividades mapeiam para um foco de treino; tipos fora desta lista usam a meta da pessoa.
const focusByActivityType: Record<string, string> = {
  run: 'endurance',
  cycle: 'endurance',
  walk: 'endurance',
  swim: 'endurance',
  strength: 'strength',
  yoga: 'mobility',
};

export async function listActivities() {
  return Activity.find().lean();
}

export async function createActivity(input: unknown) {
  const { userId, teamId, type, minutes } = bodyOf(input);
  if (!isObjectId(userId) || !isObjectId(teamId)) {
    throw httpError(400, 'Os identificadores de pessoa usuária e equipe devem ser válidos');
  }

  const activity = new Activity({
    user: userId,
    team: teamId,
    type,
    minutes,
    points: minutes,
    occurredAt: new Date(),
  });
  const validationError = activity.validateSync();
  if (validationError) {
    const firstMessage = Object.values(validationError.errors)[0]?.message ?? 'Atividade inválida';
    throw httpError(400, firstMessage);
  }

  const [userExists, teamExists] = await Promise.all([User.exists({ _id: userId }), Team.exists({ _id: teamId })]);
  if (!userExists) throw httpError(404, 'Pessoa usuária não encontrada');
  if (!teamExists) throw httpError(404, 'Equipe não encontrada');

  await activity.save();
  return activity.toObject();
}

export async function listTeams() {
  return Team.find().lean();
}

export async function createTeam(input: unknown) {
  const { name, mascot, members = [] } = bodyOf(input);
  if (!Array.isArray(members) || !members.every(isObjectId)) {
    throw httpError(400, 'Os integrantes devem ser identificadores válidos');
  }

  const team = new Team({ name, mascot, members });
  const validationError = team.validateSync();
  if (validationError) {
    const firstMessage = Object.values(validationError.errors)[0]?.message ?? 'Equipe inválida';
    throw httpError(400, firstMessage);
  }

  await team.save();
  return team.toObject();
}

export async function getLeaderboard() {
  const totals = await Activity.aggregate<{ _id: mongoose.Types.ObjectId; totalPoints: number }>([
    { $group: { _id: '$team', totalPoints: { $sum: '$points' } } },
    { $sort: { totalPoints: -1, _id: 1 } },
  ]);
  const teams = await Team.find({ _id: { $in: totals.map((row) => row._id) } }).select('name mascot').lean();
  const teamById = new Map(teams.map((team) => [team._id.toString(), team]));

  return totals.map((row, index) => {
    const team = teamById.get(row._id.toString());
    return {
      teamId: row._id,
      teamName: team?.name ?? 'Equipe removida',
      mascot: team?.mascot ?? null,
      totalPoints: row.totalPoints,
      rank: index + 1,
    };
  });
}

export async function suggestWorkouts(userEmail: string) {
  const email = String(userEmail).trim().toLowerCase();
  const user = await User.findOne({ email }).lean();
  if (!user) throw httpError(404, 'Pessoa usuária não encontrada');

  const latest = await Activity.findOne({ user: user._id }).sort({ occurredAt: -1 }).lean();
  const focus = (latest && focusByActivityType[latest.type]) ?? user.fitnessGoal;
  const reason = latest
    ? `Sugestão baseada na sua atividade recente (${latest.type}), com foco em ${focus}.`
    : `Sugestão baseada na sua meta de condicionamento (${user.fitnessGoal}).`;

  let workouts = await Workout.find({ focus }).limit(3).lean();
  if (workouts.length === 0) workouts = await Workout.find().limit(3).lean();
  return workouts.map((workout) => ({ ...workout, reason }));
}

export { User };
