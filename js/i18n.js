/**
 * i18n автошколы. Язык интерфейса — RU/EN, язык билетов — отдельная настройка
 * (банк ПДД существует на русском, узбекском и кириллическом узбекском).
 */

const KEY = "apex.lang";

export const STRINGS = {
  ru: {
    "a11y.skip": "К разделам",
    "brand.sub": "driving academy",

    "nav.categories": "Категории",
    "nav.exam": "Экзамен",
    "nav.vehicle": "3D-разбор",
    "nav.progress": "Прогресс",

    "hero.eyebrow": "Apex Drive · 1351 вопрос · экзамен 18/20",
    "hero.titleA": "Дорога начинается",
    "hero.titleB": "с решения",
    "hero.lead":
      "Полный банк ПДД в 68 блоках, экзамен с таймером и разбором каждой ошибки. Устройство автомобиля — на интерактивной 3D-модели, где каждая деталь объясняет, почему машина едет, тормозит и ломается.",
    "hero.ctaExam": "Сдать пробный экзамен",
    "hero.ctaVehicle": "Разобрать автомобиль",
    "hero.tag": "ЭКЗАМЕН · 20 ВОПРОСОВ · 20 МИНУТ",
    "hero.stat.level": "Уровень",
    "hero.stat.xp": "Опыт",
    "hero.stat.exams": "Экзамены",
    "hero.stat.accuracy": "Точность",

    "sec.categories.kicker": "01 / Программа",
    "sec.categories.title": "Семь направлений — один экзамен",
    "sec.categories.lead":
      "Карточки собраны из данных: категории прав, теория, практика и 3D-разбор. Внутри — темы занятий, правила экзамена и тренировка по вопросам.",

    "sec.exam.kicker": "02 / Экзамен",
    "sec.exam.title": "20 вопросов. 20 минут. 18 верных.",
    "sec.exam.lead":
      "Ошибки не исчезают: каждая попадает в разбор и в слабые темы. Пересдача собирает новый билет из банка.",

    "sec.vehicle.kicker": "03 / Устройство",
    "sec.vehicle.title": "Автомобиль в разрезе",
    "sec.vehicle.lead":
      "Exploded-view модель: потяните сцену, чтобы обойти машину, нажмите на деталь или узел в списке. Каждый узел — с ресурсом, признаками износа и ценой ошибки.",

    "sec.progress.kicker": "04 / Прогресс",
    "sec.progress.title": "Уровень, ошибки и экзамены",

    "group.license": "Права",
    "group.theory": "Теория",
    "group.practice": "Практика",

    "cat.theoryTopics": "Тем программы",
    "cat.questions": "вопросов в теме",
    "cat.examRule": "Экзамен {pass} из {total} · {minutes} мин",
    "cat.practice": "Тренировка",
    "cat.exam": "Экзамен",
    "cat.vehicle": "3D-разбор",
    "cat.open": "Программа",
    "cat.explained": "с разбором",
    "cat.progress": "Пройдено {solved} / {total}",
    "cat.dialogLead": "Что входит в направление и как проходит проверка.",

    "exam.rulesTitle": "Правила экзамена",
    "exam.rule1": "20 вопросов из банка, по одному на экран.",
    "exam.rule2": "20 минут; таймер не останавливается при переключении вкладки.",
    "exam.rule3": "Сдать можно с 18 верными ответами из 20.",
    "exam.rule4": "Ответ нельзя изменить после подтверждения.",
    "exam.bankTitle": "Банк вопросов",
    "exam.questions": "вопросов",
    "exam.blocks": "блоков",
    "exam.explained": "с разбором",
    "exam.lang": "Язык билетов",
    "exam.langHint": "Язык билета можно сменить до старта; во время попытки он заблокирован.",
    "exam.asideNote":
      "Вопросы с иллюстрацией открываются вместе с изображением. Разбор ссылается на пункт ПДД, а не просто показывает верный вариант.",

    "exam.startTitle": "Соберите билет",
    "exam.startLead":
      "Выберите направление. Билет собирается случайно из вопросов с разбором; иллюстрации подгружаются вместе с вопросом.",
    "exam.chooseCat": "Направление",
    "exam.start": "Начать экзамен",
    "exam.startPractice": "Тренировка без таймера",
    "exam.timer": "Осталось",
    "exam.question": "Вопрос",
    "exam.of": "из",
    "exam.block": "Блок",
    "exam.answer": "Ответить",
    "exam.next": "Следующий",
    "exam.finish": "Завершить",
    "exam.selectHint": "Выберите один вариант",
    "exam.correct": "Верно",
    "exam.wrong": "Ошибка",
    "exam.pass": "Сдано",
    "exam.fail": "Не сдано",
    "exam.score": "Результат",
    "exam.time": "Время",
    "exam.mistakes": "Разбор ошибок",
    "exam.noMistakes": "Ни одной ошибки — билет закрыт чисто.",
    "exam.review": "Разобрать ошибки",
    "exam.newExam": "Новый билет",
    "exam.explanation": "Разбор",
    "exam.noExplanation": "Для этого вопроса в банке нет текстового разбора.",
    "exam.yourAnswer": "Ваш ответ",
    "exam.rightAnswer": "Верный ответ",
    "exam.passMark": "Проходной балл: {pass} из {total}",
    "exam.passShort": "проходной",
    "exam.resultTitle": "Экзамен завершён",
    "exam.practiceDone": "Тренировка завершена",
    "exam.practiceLead": "Верных ответов: {correct} из {total}. Ошибки уже в слабых темах.",
    "exam.backToStart": "К выбору билета",
    "exam.xpEarned": "Получено опыта",
    "exam.bonus": "Бонус за первый сданный экзамен",
    "exam.attempts": "Попытка",
    "exam.passedWord": "сдан",
    "exam.failedWord": "не сдан",
    "exam.timerLow": "меньше минуты",
    "exam.leaveConfirm": "Завершить текущую попытку?",

    "practice.correct": "Верное решение",
    "practice.wrong": "Ошибка в билете",
    "practice.xp": "+{xp} XP",
    "practice.repeat": "вопрос уже закрыт — опыт начислен при первом верном ответе",
    "practice.firstTry": "бонус за первый ответ",
    "practice.next": "Следующий вопрос",

    "progress.level": "Текущий уровень",
    "progress.nextLevel": "До {level} — {xp} XP",
    "progress.maxLevel": "Максимальный уровень достигнут",
    "progress.xp": "Опыт",
    "progress.accuracy": "Точность",
    "progress.exams": "Экзамены",
    "progress.examsValue": "{passed} сдано из {total}",
    "progress.solved": "Вопросов закрыто",
    "progress.byCategory": "По направлениям",
    "progress.history": "История экзаменов",
    "progress.lastFive": "последние 5",
    "progress.noHistory": "Экзаменов ещё не было. Первый билет — в разделе «Экзамен».",
    "progress.weak": "Слабые темы",
    "progress.noWeak": "Ошибок нет. Продолжайте тренировку, чтобы удержать точность.",
    "progress.reviewWeak": "Повторить ошибки",
    "progress.reset": "Сбросить прогресс",
    "progress.resetConfirm": "Удалить весь прогресс, историю экзаменов и слабые темы?",
    "progress.pass": "сдано",
    "progress.fail": "не сдано",
    "progress.attemptShort": "Экзамен",
    "progress.minutesShort": "мин",
    "progress.bankLang": "Билеты",

    "vehicle.explode": "Разобрать",
    "vehicle.assemble": "Собрать",
    "vehicle.drag": "Потяните, чтобы повернуть",
    "vehicle.caption": "Apex Drive · процедурная модель · 6 узлов",
    "vehicle.select": "Выберите узел",
    "vehicle.facts": "Что важно знать",
    "vehicle.hotspot": "Открыть узел",
    "vehicle.resource": "Ресурс",
    "vehicle.failure": "Цена ошибки",

    "footer.note": "автономная платформа автошколы"
  },

  en: {
    "a11y.skip": "Skip to sections",
    "brand.sub": "driving academy",

    "nav.categories": "Categories",
    "nav.exam": "Exam",
    "nav.vehicle": "3D teardown",
    "nav.progress": "Progress",

    "hero.eyebrow": "Apex Drive · 1,351 questions · pass 18/20",
    "hero.titleA": "The road starts",
    "hero.titleB": "with a decision",
    "hero.lead":
      "The complete traffic-rules bank in 68 blocks, a timed exam and a debrief for every mistake. The car itself becomes an interactive 3D model where each part explains why it drives, brakes and fails.",
    "hero.ctaExam": "Take a mock exam",
    "hero.ctaVehicle": "Take the car apart",
    "hero.tag": "EXAM · 20 QUESTIONS · 20 MINUTES",
    "hero.stat.level": "Level",
    "hero.stat.xp": "XP",
    "hero.stat.exams": "Exams",
    "hero.stat.accuracy": "Accuracy",

    "sec.categories.kicker": "01 / Curriculum",
    "sec.categories.title": "Seven tracks, one exam",
    "sec.categories.lead":
      "Cards come from data: licence categories, theory, practice and the 3D teardown. Inside are lesson topics, exam rules and question practice.",

    "sec.exam.kicker": "02 / Exam",
    "sec.exam.title": "20 questions. 20 minutes. 18 correct.",
    "sec.exam.lead":
      "Mistakes stay: every one goes into the debrief and the weak-topic list. A retake builds a fresh ticket from the bank.",

    "sec.vehicle.kicker": "03 / Mechanics",
    "sec.vehicle.title": "The car, cut open",
    "sec.vehicle.lead":
      "An exploded view: drag the scene to walk around the car, click a part or a node in the list. Each node covers service life, wear symptoms and the cost of getting it wrong.",

    "sec.progress.kicker": "04 / Progress",
    "sec.progress.title": "Level, mistakes and exams",

    "group.license": "Licence",
    "group.theory": "Theory",
    "group.practice": "Practice",

    "cat.theoryTopics": "Lesson topics",
    "cat.questions": "questions in this track",
    "cat.examRule": "Exam {pass} of {total} · {minutes} min",
    "cat.practice": "Practice",
    "cat.exam": "Exam",
    "cat.vehicle": "3D teardown",
    "cat.open": "Syllabus",
    "cat.explained": "with a debrief",
    "cat.progress": "Completed {solved} / {total}",
    "cat.dialogLead": "What the track covers and how you are tested.",

    "exam.rulesTitle": "Exam rules",
    "exam.rule1": "20 questions from the bank, one per screen.",
    "exam.rule2": "20 minutes; the timer keeps running when you switch tabs.",
    "exam.rule3": "18 correct answers out of 20 is a pass.",
    "exam.rule4": "An answer cannot be changed after you confirm it.",
    "exam.bankTitle": "Question bank",
    "exam.questions": "questions",
    "exam.blocks": "blocks",
    "exam.explained": "with a debrief",
    "exam.lang": "Ticket language",
    "exam.langHint": "You can switch the ticket language before the start; it locks during an attempt.",
    "exam.asideNote":
      "Questions with an illustration show it alongside the text. The debrief cites a traffic-rules clause instead of only revealing the right option.",

    "exam.startTitle": "Build your ticket",
    "exam.startLead":
      "Pick a track. The ticket is drawn at random from questions that have a debrief; illustrations load with the question.",
    "exam.chooseCat": "Track",
    "exam.start": "Start exam",
    "exam.startPractice": "Practice without a timer",
    "exam.timer": "Time left",
    "exam.question": "Question",
    "exam.of": "of",
    "exam.block": "Block",
    "exam.answer": "Answer",
    "exam.next": "Next",
    "exam.finish": "Finish",
    "exam.selectHint": "Choose one option",
    "exam.correct": "Correct",
    "exam.wrong": "Wrong",
    "exam.pass": "Passed",
    "exam.fail": "Failed",
    "exam.score": "Score",
    "exam.time": "Time",
    "exam.mistakes": "Mistake debrief",
    "exam.noMistakes": "No mistakes — a clean ticket.",
    "exam.review": "Review mistakes",
    "exam.newExam": "New ticket",
    "exam.explanation": "Debrief",
    "exam.noExplanation": "The bank has no written debrief for this question.",
    "exam.yourAnswer": "Your answer",
    "exam.rightAnswer": "Correct answer",
    "exam.passMark": "Pass mark: {pass} of {total}",
    "exam.passShort": "pass mark",
    "exam.resultTitle": "Exam complete",
    "exam.practiceDone": "Practice complete",
    "exam.practiceLead": "{correct} of {total} correct. Mistakes are already in your weak topics.",
    "exam.backToStart": "Back to tickets",
    "exam.xpEarned": "XP earned",
    "exam.bonus": "Bonus for the first passed exam",
    "exam.attempts": "Attempt",
    "exam.passedWord": "passed",
    "exam.failedWord": "failed",
    "exam.timerLow": "under a minute",
    "exam.leaveConfirm": "Finish the current attempt?",

    "practice.correct": "Correct call",
    "practice.wrong": "Wrong answer",
    "practice.xp": "+{xp} XP",
    "practice.repeat": "question already closed — XP was awarded on the first correct answer",
    "practice.firstTry": "first-answer bonus",
    "practice.next": "Next question",

    "progress.level": "Current level",
    "progress.nextLevel": "{xp} XP to {level}",
    "progress.maxLevel": "Top level reached",
    "progress.xp": "XP",
    "progress.accuracy": "Accuracy",
    "progress.exams": "Exams",
    "progress.examsValue": "{passed} passed of {total}",
    "progress.solved": "Questions closed",
    "progress.byCategory": "By track",
    "progress.history": "Exam history",
    "progress.lastFive": "last 5",
    "progress.noHistory": "No exams yet. Your first ticket is in the Exam section.",
    "progress.weak": "Weak topics",
    "progress.noWeak": "No mistakes. Keep practising to hold the accuracy.",
    "progress.reviewWeak": "Review mistakes",
    "progress.reset": "Reset progress",
    "progress.resetConfirm": "Delete all progress, exam history and weak topics?",
    "progress.pass": "passed",
    "progress.fail": "failed",
    "progress.attemptShort": "Exam",
    "progress.minutesShort": "min",
    "progress.bankLang": "Tickets",

    "vehicle.explode": "Explode",
    "vehicle.assemble": "Assemble",
    "vehicle.drag": "Drag to rotate",
    "vehicle.caption": "Apex Drive · procedural model · 6 nodes",
    "vehicle.select": "Pick a node",
    "vehicle.facts": "What matters",
    "vehicle.hotspot": "Open node",
    "vehicle.resource": "Service life",
    "vehicle.failure": "Cost of failure",

    "footer.note": "standalone driving-school platform"
  }
};

export function getLang() {
  try {
    const saved = window.localStorage.getItem(KEY);
    return saved === "en" ? "en" : "ru";
  } catch {
    return "ru";
  }
}

export function setLang(next) {
  const lang = next === "en" ? "en" : "ru";
  try {
    window.localStorage.setItem(KEY, lang);
  } catch {
    /* приватный режим */
  }
  return lang;
}

export function t(key, vars = {}) {
  const lang = getLang();
  const dict = STRINGS[lang] || STRINGS.ru;
  const template = dict[key] ?? STRINGS.ru[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, name) =>
    vars[name] === undefined ? `{${name}}` : String(vars[name])
  );
}

/** Поле данных { ru, en } → строка текущего языка. */
export function pick(field) {
  if (field == null) return "";
  if (typeof field === "string") return field;
  return field[getLang()] ?? field.ru ?? field.en ?? "";
}

export function formatNumber(n) {
  const lang = getLang();
  return new Intl.NumberFormat(lang === "ru" ? "ru-RU" : "en-US").format(n);
}

export function formatDate(ts) {
  const lang = getLang();
  return new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

export function formatClock(seconds) {
  const safe = Math.max(0, Math.round(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
