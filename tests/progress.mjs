/**
 * Проверка трекера автошколы: XP только за первое закрытие, бонус за первый
 * сданный экзамен и достижимость уровней Junior → Middle → Pro.
 *
 * Запуск: node driving-school-platform/tests/progress.mjs
 */

const store = new Map();
globalThis.window = {
  localStorage: {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  },
};

const tracker = await import("../js/tracker.js");

let failed = 0;
function check(label, actual, expected) {
  const ok =
    Object.is(actual, expected) || JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed += 1;
  console.log(
    `${ok ? "OK  " : "FAIL"} ${label}: ${JSON.stringify(actual)}${
      ok ? "" : ` — ожидалось ${JSON.stringify(expected)}`
    }`
  );
}

const answer = (id, correct = true, category = "cat-b") =>
  tracker.recordAnswer({ questionId: id, category, correct });

/* --------------------------------------------------- 1. Первое закрытие */
tracker.resetProgress();
const first = answer("q1");
check("первый верный ответ даёт 12 XP", first.gained, 12);
check("повтор даёт 0 XP", answer("q1").gained, 0);
check("повтор помечен", answer("q1").repeat, true);
check("XP не вырос", tracker.stats().xp, 12);
check("вопрос закрыт один раз", tracker.stats().solved, 1);

/* ------------------------------------------- 2. Ошибка, затем закрытие */
check("неверный ответ даёт 0 XP", answer("q2", false).gained, 0);
check("закрытие со второй попытки — 8 XP", answer("q2").gained, 8);
check("закрытых вопросов два", tracker.stats().solved, 2);

/* ------------------------------------------- 3. Бонус за сданный экзамен */
const pass = tracker.recordExam({
  category: "cat-b",
  correct: 18,
  total: 20,
  pass: true,
  minutes: 20,
});
check("первый сданный экзамен даёт 300 XP", pass.bonusXp, 300);
const again = tracker.recordExam({
  category: "cat-b",
  correct: 20,
  total: 20,
  pass: true,
  minutes: 20,
});
check("повторная сдача не даёт бонус", again.bonusXp, 0);
const other = tracker.recordExam({
  category: "cat-a",
  correct: 20,
  total: 20,
  pass: true,
  minutes: 20,
});
check("другое направление даёт свой бонус", other.bonusXp, 300);
check("история экзаменов сохранена", tracker.examHistory(5).length, 3);
check("сданных экзаменов три", tracker.stats().examsPassed, 3);

/* --------------------------------------------------------- 4. Уровни */
tracker.resetProgress();
for (let i = 0; i < 83; i += 1) answer(`x${i}`);
check("83 вопроса — ещё Junior", tracker.stats().level.id, "junior");
check("83 вопроса = 996 XP", tracker.stats().xp, 996);
answer("x83");
check("84 вопроса — Middle", tracker.stats().level.id, "middle");
check("84 вопроса = 1 008 XP", tracker.stats().xp, 1008);

for (let i = 84; i < 266; i += 1) answer(`x${i}`);
check("266 вопросов — ещё Middle", tracker.stats().level.id, "middle");
check("266 вопросов = 3 192 XP", tracker.stats().xp, 3192);
answer("x266");
check("267 вопросов — Pro", tracker.stats().level.id, "pro");
check("267 вопросов = 3 204 XP", tracker.stats().xp, 3204);

/* ------------------------------------------------ 5. Сброс прогресса */
tracker.resetProgress();
check("после сброса 0 XP", tracker.stats().xp, 0);
check("после сброса нет ответов", tracker.stats().answered, 0);
check("localStorage очищен от истории", store.has("apex.progress.v1"), false);

console.log(
  failed === 0
    ? "\nВсе проверки трекера автошколы пройдены."
    : `\nПровалено проверок: ${failed}`
);
process.exitCode = failed === 0 ? 0 : 1;
