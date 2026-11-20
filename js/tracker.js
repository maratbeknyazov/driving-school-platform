/**
 * Трекер автошколы (localStorage).
 *
 * Схема:
 *   answers — { [questionId]: { ok, closed, firstTry, attempts, last, cat } }
 *   tally   — { [categoryId]: { attempts, correct } }
 *   exams   — [{ cat, correct, total, pass, minutes, at }], новые сверху
 *   bonus   — { [categoryId]: true } — бонус за первый сданный экзамен
 *
 * XP не хранится числом: он выводится из закрытых вопросов (8 XP, +4 за
 * ответ с первой попытки) и бонусов за сданные экзамены (300 XP один раз
 * за направление). Поэтому повторный ответ не даёт опыта, а ручная правка
 * сохранения не поднимает уровень.
 *
 * Уровни: Junior 0 → Middle 1 000 → Pro 3 200 XP.
 */

const KEY = "apex.progress.v1";
const QUESTION_XP = 8;
const FIRST_TRY_XP = 4;
const EXAM_BONUS_XP = 300;

export const LEVELS = [
  {
    id: "junior",
    min: 0,
    accent: "#D9F99D",
    title: { ru: "Junior", en: "Junior" },
    desc: {
      ru: "Знаете знаки и базовые правила. Ошибки ещё случайны: скорость, дистанция и перекрёстки требуют повторения.",
      en: "You know the signs and core rules. Mistakes are still random: speed, following distance and junctions need work.",
    },
  },
  {
    id: "middle",
    min: 1000,
    accent: "#FACC15",
    title: { ru: "Middle", en: "Middle" },
    desc: {
      ru: "Держите 18 из 20 на тренировках, читаете ситуацию по разметке и знакам, уверенно проходите сложные перекрёстки.",
      en: "You hold 18 of 20 in practice, read the scene from markings and signs, and handle complex junctions.",
    },
  },
  {
    id: "pro",
    min: 3200,
    accent: "#4ADE80",
    title: { ru: "Pro", en: "Pro" },
    desc: {
      ru: "Экзаменационный уровень: стабильные 19–20 из 20, разбор ошибок по пунктам ПДД и понимание устройства автомобиля.",
      en: "Exam-ready: consistent 19–20 of 20, debriefs tied to traffic-rules clauses and a working knowledge of the car.",
    },
  },
];

const empty = () => ({ answers: {}, tally: {}, exams: [], bonus: {} });

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function normalizeAnswer(answer) {
  if (!answer || typeof answer !== "object") return null;
  const attempts = num(answer.attempts);
  const closed = Boolean(answer.closed ?? answer.ok);
  return {
    ok: Boolean(answer.ok),
    closed,
    firstTry: Boolean(answer.firstTry ?? (closed && attempts === 1)),
    attempts,
    last: num(answer.last),
    cat: typeof answer.cat === "string" ? answer.cat : "mixed",
  };
}

function normalizeExam(exam) {
  if (!exam || typeof exam !== "object") return null;
  const total = num(exam.total);
  const correct = num(exam.correct);
  return {
    cat: typeof exam.cat === "string" ? exam.cat : "cat-b",
    correct: Math.min(correct, total),
    total,
    pass: Boolean(exam.pass),
    minutes: num(exam.minutes),
    at: num(exam.at) || Date.now(),
  };
}

function load() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return empty();

    const state = empty();

    if (parsed.answers && typeof parsed.answers === "object") {
      for (const [id, value] of Object.entries(parsed.answers)) {
        const answer = normalizeAnswer(value);
        if (answer) state.answers[id] = answer;
      }
    }

    if (parsed.tally && typeof parsed.tally === "object") {
      for (const [cat, value] of Object.entries(parsed.tally)) {
        if (!value || typeof value !== "object") continue;
        state.tally[cat] = {
          attempts: num(value.attempts),
          correct: num(value.correct),
        };
      }
    }

    if (Array.isArray(parsed.exams)) {
      state.exams = parsed.exams
        .map(normalizeExam)
        .filter(Boolean)
        .slice(0, 50);
    }

    if (parsed.bonus && typeof parsed.bonus === "object") {
      for (const [cat, value] of Object.entries(parsed.bonus)) {
        if (value) state.bonus[cat] = true;
      }
    }

    return state;
  } catch {
    return empty();
  }
}

let state = load();

function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* приватный режим: живём до перезагрузки */
  }
}

save();

function answerXp(answer) {
  if (!answer.closed) return 0;
  return QUESTION_XP + (answer.firstTry ? FIRST_TRY_XP : 0);
}

function totalXp() {
  const fromAnswers = Object.values(state.answers).reduce(
    (sum, answer) => sum + answerXp(answer),
    0
  );
  return fromAnswers + Object.keys(state.bonus).length * EXAM_BONUS_XP;
}

export function getState() {
  return state;
}

export function levelFor(xp) {
  let current = LEVELS[0];
  for (const level of LEVELS) if (xp >= level.min) current = level;
  return current;
}

export function nextLevelFor(xp) {
  return LEVELS.find((level) => level.min > xp) || null;
}

/**
 * Фиксирует ответ на вопрос. XP — только за первое закрытие; повторный
 * верный ответ возвращает gained = 0 и repeat = true.
 */
export function recordAnswer({ questionId, category, correct }) {
  if (!questionId) return { gained: 0, firstTry: false, repeat: false };

  const prev = state.answers[questionId];
  const attempts = (prev?.attempts || 0) + 1;
  const alreadyClosed = Boolean(prev?.closed);
  const firstTry = Boolean(correct) && attempts === 1;
  const xpBefore = totalXp();

  state.answers[questionId] = {
    ok: Boolean(correct),
    closed: alreadyClosed || Boolean(correct),
    firstTry: Boolean(prev?.firstTry) || firstTry,
    attempts,
    last: Date.now(),
    cat: category || prev?.cat || "mixed",
  };

  const tally = state.tally[category] || { attempts: 0, correct: 0 };
  tally.attempts += 1;
  if (correct) tally.correct += 1;
  state.tally[category] = tally;

  const gained = totalXp() - xpBefore;
  save();

  return {
    gained,
    firstTry,
    repeat: Boolean(correct) && alreadyClosed,
  };
}

/**
 * Сохраняет результат экзамена и один раз на направление начисляет бонус
 * за сдачу. XP за сами вопросы уже учтён recordAnswer.
 */
export function recordExam({ category, correct, total, pass, minutes }) {
  const xpBefore = totalXp();
  const firstPass = Boolean(pass) && !state.bonus[category];
  if (firstPass) state.bonus[category] = true;

  state.exams.unshift({
    cat: category,
    correct,
    total,
    pass: Boolean(pass),
    minutes,
    at: Date.now(),
  });
  state.exams = state.exams.slice(0, 50);

  save();
  return { firstPass, bonusXp: totalXp() - xpBefore };
}

export function stats() {
  const answers = Object.values(state.answers);
  const solved = answers.filter((a) => a.closed).length;
  const weak = answers.filter((a) => !a.ok).length;

  const attempts = Object.values(state.tally).reduce(
    (n, t) => n + t.attempts,
    0
  );
  const correct = Object.values(state.tally).reduce(
    (n, t) => n + t.correct,
    0
  );

  const xp = totalXp();
  const level = levelFor(xp);
  const next = nextLevelFor(xp);

  return {
    xp,
    level,
    next,
    toNext: next ? next.min - xp : 0,
    progress: next
      ? Math.max(
          0,
          Math.min(100, Math.round(((xp - level.min) / (next.min - level.min)) * 100))
        )
      : 100,
    answered: answers.length,
    solved,
    weak,
    accuracy: attempts ? Math.round((correct / attempts) * 100) : 0,
    exams: state.exams.length,
    examsPassed: state.exams.filter((e) => e.pass).length,
  };
}

export function categoryStats(categoryId) {
  const tally = state.tally[categoryId] || { attempts: 0, correct: 0 };
  return {
    attempts: tally.attempts,
    correct: tally.correct,
    accuracy: tally.attempts
      ? Math.round((tally.correct / tally.attempts) * 100)
      : 0,
  };
}

export function solvedQuestionIds(categoryId) {
  return Object.entries(state.answers)
    .filter(([, a]) => a.closed && (!categoryId || a.cat === categoryId))
    .map(([id]) => id);
}

export function weakQuestionIds(categoryId) {
  return Object.entries(state.answers)
    .filter(([, a]) => !a.ok && (!categoryId || a.cat === categoryId))
    .map(([id]) => id);
}

export function examHistory(limit = 5) {
  return state.exams.slice(0, limit);
}

export function resetProgress() {
  state = empty();
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* приватный режим */
  }
}
