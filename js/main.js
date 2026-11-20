/**
 * Apex Drive — автошкола.
 *
 * Данные: js/data/categories.js (направления), js/data/bank.js (1351 вопрос
 * × 3 языка), js/data/vehicle.js (узлы 3D-разбора).
 *
 * Экзамен и тренировка работают на одних и тех же вопросах банка; билет
 * собирается только из вопросов с текстовым разбором, чтобы каждая ошибка
 * получала объяснение. XP начисляет tracker.js, 3D — scene.js.
 */

import {
  CATEGORIES,
  CATEGORY_BY_ID,
  BANK_META,
} from "./data/categories.js";
import { BANK, QUESTION_COUNT, BLOCK_COUNT } from "./data/bank.js";
import { VEHICLE_PARTS, VEHICLE_BY_ID } from "./data/vehicle.js";
import {
  t,
  pick,
  getLang,
  setLang,
  formatNumber,
  formatDate,
  formatClock,
} from "./i18n.js";
import * as tracker from "./tracker.js";

const BANK_LANG_KEY = "apex.banklang";
const BANK_LANGS = ["ru", "uzb", "uzc"];

const $ = (selector) => document.querySelector(selector);

const els = {
  heroCanvas: $("#heroCanvas"),
  vehicleCanvas: $("#vehicleCanvas"),
  hotspotHost: $("#hotspotHost"),
  heroStats: $("#heroStats"),
  levelPill: $("#levelPill"),
  lang: $("#langToggle"),
  catGrid: $("#catGrid"),
  examHost: $("#examHost"),
  bankLang: $("#bankLang"),
  bankQuestions: $("#bankQuestions"),
  bankBlocks: $("#bankBlocks"),
  bankExplained: $("#bankExplained"),
  progressGrid: $("#progressGrid"),
  examHistory: $("#examHistory"),
  weakList: $("#weakList"),
  weakCount: $("#weakCount"),
  reviewWeak: $("#reviewWeak"),
  reset: $("#resetProgress"),
  heroExam: $("#heroExam"),
  explode: $("#explodeBtn"),
  partList: $("#partList"),
  partPanel: $("#partPanel"),
  dialog: $("#catDialog"),
  dialogBody: $("#dialogBody"),
  dialogClose: $("#dialogClose"),
};

const state = {
  bankLang: readBankLang(),
  examCat: "cat-b",
  session: null,
  result: null,
  part: "engine",
  exploded: false,
  poolCache: new Map(),
};

let timerId = null;
let vehicleScene = null;
let heroScene = null;

/* ------------------------------------------------------------------ utils */

const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c])
  );

function readBankLang() {
  try {
    const saved = window.localStorage.getItem(BANK_LANG_KEY);
    return BANK_LANGS.includes(saved) ? saved : "ru";
  } catch {
    return "ru";
  }
}

function saveBankLang(lang) {
  try {
    window.localStorage.setItem(BANK_LANG_KEY, lang);
  } catch {
    /* приватный режим */
  }
}

const bank = () => BANK[state.bankLang] || BANK.ru;
const explained = (q) => Boolean(q[4] && q[4].trim());
const correctIndex = (q) => q[5].findIndex((answer) => answer[1]);

function bankIndex() {
  if (!state.index || state.indexLang !== state.bankLang) {
    state.index = new Map(bank().map((q) => [q[0], q]));
    state.indexLang = state.bankLang;
  }
  return state.index;
}

function poolFor(cat) {
  const key = `${cat.id}:${state.bankLang}`;
  if (state.poolCache.has(key)) return state.poolCache.get(key);

  let list;
  if (cat.bank) {
    list = bank();
  } else if (cat.filter) {
    const re = new RegExp(cat.filter.source, "i");
    list = bank().filter((q) =>
      cat.filter.fields.some((field) => {
        const value = field === "q" ? q[2] : field === "explanation" ? q[4] : "";
        return re.test(String(value || ""));
      })
    );
  } else {
    list = [];
  }

  const result = list.filter(explained);
  state.poolCache.set(key, result);
  return result;
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const imageUrl = (q) =>
  q[3] ? `./assets/media/${q[3].replace(/^media\//, "")}` : "";

const catTitle = (catId) => {
  const cat = CATEGORY_BY_ID[catId];
  return cat ? pick(cat.title) : t("progress.weak");
};

function scrollToSection(id) {
  const node = document.getElementById(id);
  if (!node) return;
  node.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ----------------------------------------------------------------- i18n UI */

const TITLES = {
  ru: "Apex Drive — автошкола и 3D-тренажёр ПДД",
  en: "Apex Drive — driving school and 3D rules trainer",
};

const DESCRIPTIONS = {
  ru: "Автошкола Apex Drive: 1351 вопрос ПДД в 68 блоках, экзамен 18 из 20 с таймером, разбор каждой ошибки, тренировка слабых тем и 3D-разбор устройства автомобиля.",
  en: "Apex Drive driving school: 1,351 traffic-rules questions in 68 blocks, a timed 18-of-20 exam, a debrief for every mistake, weak-topic practice and an interactive 3D teardown of the car.",
};

function applyStatic() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.title = TITLES[lang];
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", DESCRIPTIONS[lang]);

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  els.lang.textContent = lang === "ru" ? "EN" : "RU";
  els.lang.setAttribute(
    "aria-label",
    lang === "ru" ? "Switch to English" : "Переключить на русский"
  );

  els.dialogClose.setAttribute("aria-label", lang === "ru" ? "Закрыть" : "Close");
}

/* ------------------------------------------------------------------- hero */

function renderHero() {
  const info = tracker.stats();
  els.levelPill.textContent = pick(info.level.title);
  els.levelPill.style.setProperty("--level-accent", info.level.accent);

  const items = [
    {
      label: t("hero.stat.level"),
      value: pick(info.level.title),
      accent: info.level.accent,
    },
    { label: t("hero.stat.xp"), value: formatNumber(info.xp) },
    {
      label: t("hero.stat.exams"),
      value: `${info.examsPassed} / ${info.exams}`,
    },
    { label: t("hero.stat.accuracy"), value: `${info.accuracy}%` },
  ];

  els.heroStats.innerHTML = items
    .map(
      (item) => `
      <div class="hero-stat" ${item.accent ? `style="--stat-accent:${item.accent}"` : ""}>
        <dt>${esc(item.label)}</dt>
        <dd>${esc(item.value)}</dd>
      </div>`
    )
    .join("");
}

/* ------------------------------------------------------------- categories */

function renderCategories() {
  els.catGrid.innerHTML = CATEGORIES.map((cat, index) => {
    const pool = poolFor(cat);
    const solvedSet = new Set(tracker.solvedQuestionIds(cat.id));
    const solved = pool.filter((q) => solvedSet.has(q[0])).length;
    const pct = pool.length ? Math.round((solved / pool.length) * 100) : 0;
    const group = t(`group.${cat.group}`);

    return `
      <article class="cat-card" data-cat="${cat.id}" style="--card-accent:${cat.accent}">
        <div class="cat-top">
          <span class="cat-icon" aria-hidden="true">
            <svg><use href="#i-${esc(cat.icon)}"></use></svg>
          </span>
          <span class="cat-code">${String(index + 1).padStart(2, "0")} · ${esc(group)}</span>
        </div>
        <h3>${esc(pick(cat.title))}</h3>
        <p class="cat-sub">${esc(pick(cat.subtitle))}</p>
        <p class="cat-desc">${esc(pick(cat.description))}</p>
        <div class="cat-meter" aria-hidden="true"><span style="width:${pct}%"></span></div>
        <p class="cat-meta">
          <span>${esc(t("cat.progress", { solved, total: pool.length }))}</span>
          <span>${esc(t("cat.examRule", {
            pass: cat.exam.pass,
            total: cat.exam.questions,
            minutes: cat.exam.minutes,
          }))}</span>
        </p>
        <div class="cat-actions">
          <button type="button" class="btn btn-tiny btn-ghost" data-open="${cat.id}">
            ${esc(t("cat.open"))}
          </button>
          <button type="button" class="btn btn-tiny btn-primary" data-exam="${cat.id}">
            ${esc(t("cat.exam"))}
            <svg aria-hidden="true"><use href="#i-arrow"></use></svg>
          </button>
        </div>
      </article>`;
  }).join("");
}

/* ------------------------------------------------------------------- exam */

function renderBankMeta() {
  els.bankQuestions.textContent = formatNumber(QUESTION_COUNT);
  els.bankBlocks.textContent = String(BLOCK_COUNT);
  els.bankExplained.textContent = formatNumber(bank().filter(explained).length);
  els.bankLang.value = state.bankLang;
  els.bankLang.disabled = Boolean(state.session);
}

function renderExam() {
  if (state.session) {
    renderSession();
  } else if (state.result) {
    renderResult();
  } else {
    renderExamStart();
  }
  renderBankMeta();
}

function renderExamStart() {
  const active = CATEGORY_BY_ID[state.examCat] || CATEGORY_BY_ID["cat-b"];
  const pool = poolFor(active);

  els.examHost.innerHTML = `
    <div class="exam-start">
      <div class="exam-start-head">
        <p class="kicker">${esc(t("exam.startTitle"))}</p>
        <h3>${esc(t("exam.startLead"))}</h3>
      </div>

      <p class="micro-label">${esc(t("exam.chooseCat"))}</p>
      <div class="cat-chips" role="group" aria-label="${esc(t("exam.chooseCat"))}">
        ${CATEGORIES.map(
          (cat) => `
          <button
            type="button"
            class="chip ${cat.id === active.id ? "is-active" : ""}"
            data-exam-cat="${cat.id}"
            style="--chip-accent:${cat.accent}"
          >
            <span class="chip-dot" aria-hidden="true"></span>
            ${esc(pick(cat.title))}
          </button>`
        ).join("")}
      </div>

      <div class="ticket-preview">
        <div><b>${active.exam.questions}</b><span>${esc(t("exam.questions"))}</span></div>
        <div><b>${active.exam.pass}</b><span>${esc(t("exam.passShort"))}</span></div>
        <div><b>${active.exam.minutes}</b><span>${esc(t("progress.minutesShort"))}</span></div>
        <div><b>${formatNumber(pool.length)}</b><span>${esc(t("exam.explained"))}</span></div>
      </div>

      <div class="exam-start-actions">
        <button type="button" class="btn btn-primary" data-action="start-exam">
          ${esc(t("exam.start"))}
          <svg aria-hidden="true"><use href="#i-arrow"></use></svg>
        </button>
        <button type="button" class="btn btn-ghost" data-action="start-practice">
          ${esc(t("exam.startPractice"))}
        </button>
      </div>

      <p class="exam-note">${esc(t("exam.passMark", {
        pass: active.exam.pass,
        total: active.exam.questions,
      }))} · ${esc(pick(active.title))}</p>
    </div>`;
}

function currentQuestion() {
  const session = state.session;
  if (!session) return null;
  const id = session.ids[session.index];
  return bankIndex().get(id) || null;
}

function renderSession() {
  const session = state.session;
  const q = currentQuestion();
  if (!q) {
    finishSession();
    return;
  }

  const isExam = session.mode === "exam";
  const cat = CATEGORY_BY_ID[session.catId];
  const total = session.ids.length;
  const progress = Math.round((session.index / total) * 100);
  const selected = session.selected;
  const checked = session.checked;
  const ci = correctIndex(q);
  const answers = q[5];
  const media = imageUrl(q);

  const options = answers
    .map((answer, index) => {
      const letter = String.fromCharCode(65 + index);
      let status = "";
      if (checked) {
        if (index === ci) status = "is-correct";
        else if (index === selected) status = "is-wrong";
      } else if (index === selected) {
        status = "is-selected";
      }
      return `
        <button
          type="button"
          class="option ${status}"
          data-option="${index}"
          ${checked ? "disabled" : ""}
          aria-pressed="${selected === index}"
        >
          <span class="option-letter">${letter}</span>
          <span class="option-text">${esc(answer[0])}</span>
        </button>`;
    })
    .join("");

  const last = session.last;
  const feedback =
    !isExam && checked && last
      ? `
      <div class="feedback ${last.correct ? "is-good" : "is-bad"}" role="status">
        <div class="feedback-head">
          <strong>${esc(last.correct ? t("practice.correct") : t("practice.wrong"))}</strong>
          <span class="xp-badge">${esc(t("practice.xp", { xp: last.gained }))}</span>
        </div>
        ${last.firstTry ? `<span class="mini-note">${esc(t("practice.firstTry"))}</span>` : ""}
        ${last.repeat ? `<span class="mini-note">${esc(t("practice.repeat"))}</span>` : ""}
        <p class="feedback-answer">
          <span>${esc(t("exam.rightAnswer"))}:</span> ${esc(q[5][ci][0])}
        </p>
        <p class="feedback-label">${esc(t("exam.explanation"))}</p>
        <p class="feedback-text">${esc(q[4] || t("exam.noExplanation"))}</p>
      </div>`
      : "";

  const action = isExam
    ? `<button type="button" class="btn btn-primary" data-action="commit" ${selected === null ? "disabled" : ""}>
         ${esc(session.index === total - 1 ? t("exam.finish") : t("exam.answer"))}
         <svg aria-hidden="true"><use href="#i-arrow"></use></svg>
       </button>`
    : checked
    ? `<button type="button" class="btn btn-primary" data-action="next-practice">
         ${esc(session.index === total - 1 ? t("exam.finish") : t("practice.next"))}
         <svg aria-hidden="true"><use href="#i-arrow"></use></svg>
       </button>`
    : `<button type="button" class="btn btn-primary" data-action="check" ${selected === null ? "disabled" : ""}>
         ${esc(t("exam.answer"))}
       </button>`;

  els.examHost.innerHTML = `
    <div class="quiz">
      <header class="quiz-head">
        <div>
          <p class="kicker">${esc(isExam ? t("exam.attempts") : t("cat.practice"))} · ${esc(
            cat ? pick(cat.title) : t("progress.weak")
          )}</p>
          <p class="quiz-counter">
            ${esc(t("exam.question"))} <b>${session.index + 1}</b> ${esc(t("exam.of"))} ${total}
            <span class="quiz-block">· ${esc(t("exam.block"))} ${esc(q[1])}</span>
          </p>
        </div>
        ${
          isExam
            ? `<div class="timer" id="examTimer" aria-live="off">
                 <svg aria-hidden="true"><use href="#i-timer"></use></svg>
                 <span>${formatClock((session.deadline - Date.now()) / 1000)}</span>
               </div>`
            : `<div class="practice-badge">${esc(t("cat.practice"))}</div>`
        }
      </header>

      <div class="quiz-progress" aria-hidden="true"><span style="width:${progress}%"></span></div>

      <div class="quiz-body">
        <div class="quiz-text">
          <h3>${esc(q[2])}</h3>
          ${
            media
              ? `<figure class="quiz-media">
                   <img src="${media}" alt="${esc(q[2])}" loading="lazy" decoding="async" />
                 </figure>`
              : ""
          }
          <div class="options">${options}</div>
        </div>
      </div>

      ${feedback}

      <div class="quiz-actions">
        <span class="quiz-hint">${esc(
          checked ? t("exam.explanation") : t("exam.selectHint")
        )}</span>
        ${action}
      </div>
    </div>`;

  const img = els.examHost.querySelector(".quiz-media img");
  if (img) {
    img.addEventListener("error", () => {
      img.closest(".quiz-media")?.remove();
    });
  }

  if (isExam) tickTimer();
}

function startTimer(minutes) {
  clearInterval(timerId);
  if (!state.session) return;
  state.session.deadline = Date.now() + minutes * 60 * 1000;
  timerId = setInterval(tickTimer, 500);
}

function tickTimer() {
  const session = state.session;
  if (!session || session.mode !== "exam" || !session.deadline) return;

  const left = (session.deadline - Date.now()) / 1000;
  const node = document.getElementById("examTimer");
  if (node) {
    node.querySelector("span").textContent = formatClock(left);
    node.classList.toggle("is-low", left <= 60);
  }
  if (left <= 0) finishSession();
}

function clearTimer() {
  clearInterval(timerId);
  timerId = null;
}

function startExam(catId) {
  const cat = CATEGORY_BY_ID[catId] || CATEGORY_BY_ID["cat-b"];
  const pool = poolFor(cat);
  const ids = shuffle(pool)
    .slice(0, Math.min(cat.exam.questions, pool.length))
    .map((q) => q[0]);

  if (!ids.length) return;

  state.examCat = cat.id;
  state.result = null;
  state.session = {
    mode: "exam",
    catId: cat.id,
    ids,
    index: 0,
    selected: null,
    checked: false,
    last: null,
    answers: [],
    gained: 0,
    startedAt: Date.now(),
    deadline: Date.now() + cat.exam.minutes * 60 * 1000,
    minutes: cat.exam.minutes,
  };

  startTimer(cat.exam.minutes);
  renderExam();
  scrollToSection("exam");
}

function startPractice(catId, ids = null) {
  const cat = CATEGORY_BY_ID[catId];
  const pool = cat ? poolFor(cat) : bank().filter(explained);

  let chosen;
  if (ids && ids.length) {
    const index = bankIndex();
    chosen = ids.filter((id) => index.has(id));
  } else {
    const weak = new Set(tracker.weakQuestionIds(catId));
    const weakList = pool.filter((q) => weak.has(q[0]));
    const rest = shuffle(pool.filter((q) => !weak.has(q[0])));
    chosen = [...shuffle(weakList), ...rest]
      .slice(0, 12)
      .map((q) => q[0]);
  }

  if (!chosen.length) return;

  state.result = null;
  state.session = {
    mode: "practice",
    catId: cat ? cat.id : "mixed",
    ids: chosen,
    index: 0,
    selected: null,
    checked: false,
    last: null,
    answers: [],
    gained: 0,
    startedAt: Date.now(),
    deadline: null,
    minutes: 0,
  };

  clearTimer();
  renderExam();
  scrollToSection("exam");
}

function commitAnswer() {
  const session = state.session;
  const q = currentQuestion();
  if (!session || !q || session.selected === null) return;

  const ci = correctIndex(q);
  const correct = session.selected === ci;
  const category =
    session.catId === "mixed"
      ? tracker.getState().answers[q[0]]?.cat || "mixed"
      : session.catId;

  const outcome = tracker.recordAnswer({
    questionId: q[0],
    category,
    correct,
  });

  session.gained += outcome.gained;
  session.answers.push({
    id: q[0],
    chosenIndex: session.selected,
    chosenText: q[5][session.selected]?.[0] || "",
    correctText: q[5][ci]?.[0] || "",
    correct,
    question: q[2],
    explanation: q[4] || "",
    block: q[1],
  });

  if (session.mode === "practice") {
    session.checked = true;
    session.last = { ...outcome, correct };
    renderSession();
    renderHero();
    renderProgress();
    return;
  }

  session.selected = null;
  session.index += 1;
  renderHero();

  if (session.index >= session.ids.length) {
    finishSession();
  } else {
    renderSession();
  }
}

function finishSession() {
  const session = state.session;
  if (!session) return;
  clearTimer();

  const correct = session.answers.filter((answer) => answer.correct).length;
  const total = session.ids.length;
  const cat = CATEGORY_BY_ID[session.catId];
  const isExam = session.mode === "exam";
  const passed = isExam ? correct >= (cat?.exam.pass ?? 18) : null;
  const bonus = isExam
    ? tracker.recordExam({
        category: session.catId,
        correct,
        total,
        pass: passed,
        minutes: session.minutes,
      })
    : { firstPass: false, bonusXp: 0 };

  state.result = {
    mode: session.mode,
    catId: session.catId,
    correct,
    total,
    pass: passed,
    minutes: session.minutes,
    spent: Math.min(
      Math.round((Date.now() - session.startedAt) / 1000),
      (session.minutes || 120) * 60
    ),
    answers: session.answers,
    mistakes: session.answers.filter((answer) => !answer.correct),
    gained: session.gained,
    bonusXp: bonus.bonusXp,
    firstPass: bonus.firstPass,
  };
  state.session = null;

  renderHero();
  renderProgress();
  renderExam();
}

function renderResult() {
  const result = state.result;
  const cat = CATEGORY_BY_ID[result.catId];
  const isExam = result.mode === "exam";
  const pct = result.total ? Math.round((result.correct / result.total) * 100) : 0;
  const passClass = isExam ? (result.pass ? "is-pass" : "is-fail") : "is-practice";

  const mistakes = result.mistakes.length
    ? result.mistakes
        .map(
          (item) => `
        <details class="mistake">
          <summary>
            <span class="mistake-mark" aria-hidden="true">
              <svg><use href="#i-x"></use></svg>
            </span>
            <span class="mistake-title">${esc(item.question)}</span>
            <span class="mistake-block">${esc(t("exam.block"))} ${esc(item.block)}</span>
          </summary>
          <div class="mistake-body">
            <p><span>${esc(t("exam.yourAnswer"))}</span> ${esc(item.chosenText)}</p>
            <p class="is-right"><span>${esc(t("exam.rightAnswer"))}</span> ${esc(item.correctText)}</p>
            <p class="mistake-exp">${esc(item.explanation || t("exam.noExplanation"))}</p>
          </div>
        </details>`
        )
        .join("")
    : `<p class="clean-ticket">${esc(t("exam.noMistakes"))}</p>`;

  els.examHost.innerHTML = `
    <div class="result ${passClass}">
      <header class="result-head">
        <div>
          <p class="kicker">${esc(isExam ? t("exam.resultTitle") : t("exam.practiceDone"))}</p>
          <h3>${esc(cat ? pick(cat.title) : t("progress.weak"))}</h3>
          <p class="result-sub">${esc(
            isExam
              ? t("exam.passMark", { pass: cat?.exam.pass ?? 18, total: result.total })
              : t("exam.practiceLead", { correct: result.correct, total: result.total })
          )}</p>
        </div>
        <div class="score-ring" style="--pct:${pct}">
          <span>${result.correct}<small>/${result.total}</small></span>
        </div>
      </header>

      <div class="result-stats">
        <div><span>${esc(t("exam.score"))}</span><b>${pct}%</b></div>
        <div><span>${esc(t("exam.time"))}</span><b>${formatClock(result.spent)}</b></div>
        <div><span>${esc(t("exam.xpEarned"))}</span><b>+${formatNumber(result.gained)}</b></div>
        <div><span>${esc(t("exam.mistakes"))}</span><b>${result.mistakes.length}</b></div>
      </div>

      ${
        isExam
          ? `<div class="result-verdict">
               <span class="verdict-badge">${esc(
                 result.pass ? t("exam.pass") : t("exam.fail")
               )}</span>
               ${
                 result.bonusXp
                   ? `<span class="bonus-note">${esc(t("exam.bonus"))} +${formatNumber(
                       result.bonusXp
                     )} XP</span>`
                   : ""
               }
             </div>`
          : ""
      }

      <div class="mistakes">
        <p class="micro-label">${esc(t("exam.mistakes"))}</p>
        ${mistakes}
      </div>

      <div class="result-actions">
        ${
          isExam && result.mistakes.length
            ? `<button type="button" class="btn btn-primary" data-action="review-result">
                 ${esc(t("exam.review"))}
               </button>`
            : ""
        }
        ${
          isExam
            ? `<button type="button" class="btn btn-ghost" data-action="new-exam">
                 ${esc(t("exam.newExam"))}
               </button>`
            : `<button type="button" class="btn btn-ghost" data-action="start-practice">
                 ${esc(t("cat.practice"))}
               </button>`
        }
        <button type="button" class="btn btn-ghost" data-action="exam-home">
          ${esc(t("exam.backToStart"))}
        </button>
      </div>
    </div>`;
}

/* --------------------------------------------------------------- progress */

function renderProgress() {
  const info = tracker.stats();
  const next = info.next;

  els.progressGrid.innerHTML = `
    <div class="level-card" style="--level-accent:${info.level.accent}">
      <div class="level-card-head">
        <span class="level-dot" aria-hidden="true"></span>
        <span>${esc(t("progress.level"))}</span>
        <b>${esc(pick(info.level.title))}</b>
      </div>
      <p class="level-desc">${esc(pick(info.level.desc))}</p>
      <div class="level-bar"><span style="width:${info.progress}%"></span></div>
      <div class="level-foot">
        <span>${formatNumber(info.xp)} XP</span>
        <span>${esc(
          next
            ? t("progress.nextLevel", {
                level: pick(next.title),
                xp: formatNumber(info.toNext),
              })
            : t("progress.maxLevel")
        )}</span>
      </div>
    </div>

    <div class="stat-tile">
      <span>${esc(t("progress.solved"))}</span>
      <b>${formatNumber(info.solved)}</b>
      <small>${formatNumber(info.answered)} ${esc(t("exam.questions"))}</small>
    </div>
    <div class="stat-tile">
      <span>${esc(t("progress.accuracy"))}</span>
      <b>${info.accuracy}%</b>
      <small>${formatNumber(info.xp)} XP</small>
    </div>
    <div class="stat-tile">
      <span>${esc(t("progress.exams"))}</span>
      <b>${info.examsPassed} / ${info.exams}</b>
      <small>${esc(t("progress.examsValue", {
        passed: info.examsPassed,
        total: info.exams,
      }))}</small>
    </div>`;

  const history = tracker.examHistory(5);
  els.examHistory.innerHTML = history.length
    ? `<ul class="history">${history
        .map(
          (exam) => `
        <li>
          <span class="history-date">${esc(formatDate(exam.at))}</span>
          <span class="history-cat">${esc(catTitle(exam.cat))}</span>
          <span class="history-score">${exam.correct}/${exam.total}</span>
          <span class="history-badge ${exam.pass ? "is-pass" : "is-fail"}">${esc(
            exam.pass ? t("progress.pass") : t("progress.fail")
          )}</span>
        </li>`
        )
        .join("")}</ul>`
    : `<p class="empty">${esc(t("progress.noHistory"))}</p>`;

  const weakIds = tracker.weakQuestionIds();
  const index = bankIndex();
  const weakItems = weakIds
    .map((id) => ({ id, q: index.get(id) }))
    .filter((item) => item.q)
    .slice(0, 6);

  els.weakCount.textContent = String(weakIds.length);
  els.reviewWeak.disabled = weakIds.length === 0;

  els.weakList.innerHTML = weakItems.length
    ? `<ul class="weak">${weakItems
        .map(
          ({ q }) => `
        <li>
          <span class="weak-q">${esc(q[2])}</span>
          <span class="weak-meta">${esc(t("exam.block"))} ${esc(q[1])}</span>
        </li>`
        )
        .join("")}</ul>`
    : `<p class="empty">${esc(t("progress.noWeak"))}</p>`;

}

/* ---------------------------------------------------------------- vehicle */

function renderPartPanel() {
  const part = VEHICLE_BY_ID[state.part] || VEHICLE_PARTS[0];

  els.partPanel.style.setProperty("--part-accent", part.accent);
  els.partPanel.innerHTML = `
    <p class="kicker">${esc(t("vehicle.select"))} · ${esc(pick(part.subtitle))}</p>
    <h3>${esc(pick(part.title))}</h3>
    <p class="part-note">${esc(pick(part.note))}</p>

    <div class="part-block">
      <span class="micro-label">${esc(t("vehicle.resource"))}</span>
      <p>${esc(pick(part.resource))}</p>
    </div>
    <div class="part-block part-block--warn">
      <span class="micro-label">${esc(t("vehicle.failure"))}</span>
      <p>${esc(pick(part.failure))}</p>
    </div>

    <div class="part-block">
      <span class="micro-label">${esc(t("vehicle.facts"))}</span>
      <ul class="facts">
        ${part.facts.map((fact) => `<li>${esc(pick(fact))}</li>`).join("")}
      </ul>
    </div>`;

  els.partList.innerHTML = VEHICLE_PARTS.map(
    (item, index) => `
    <button
      type="button"
      class="part-row ${item.id === part.id ? "is-active" : ""}"
      data-part="${item.id}"
      style="--row-accent:${item.accent}"
    >
      <span class="part-index">${String(index + 1).padStart(2, "0")}</span>
      <span class="part-name">${esc(pick(item.title))}</span>
      <span class="part-arrow" aria-hidden="true">
        <svg><use href="#i-arrow"></use></svg>
      </span>
    </button>`
  ).join("");
}

function updateExplodeButton() {
  const label = els.explode.querySelector("span");
  if (label) label.textContent = t(state.exploded ? "vehicle.assemble" : "vehicle.explode");
  els.explode.disabled = !vehicleScene?.ok;
  els.explode.setAttribute("aria-pressed", String(state.exploded));
}

function selectPart(id, { explode = false } = {}) {
  if (!VEHICLE_BY_ID[id]) return;
  state.part = id;
  renderPartPanel();
  vehicleScene?.focus(id);
  if (explode && vehicleScene?.ok && !state.exploded) {
    state.exploded = true;
    vehicleScene?.setExploded(true);
    updateExplodeButton();
  }
  vehicleScene?.setLabels(
    Object.fromEntries(VEHICLE_PARTS.map((part) => [part.id, pick(part.title)]))
  );
}

/* ----------------------------------------------------------------- dialog */

function openCategory(catId) {
  const cat = CATEGORY_BY_ID[catId];
  if (!cat) return;
  const pool = poolFor(cat);
  const solvedSet = new Set(tracker.solvedQuestionIds(cat.id));
  const solved = pool.filter((q) => solvedSet.has(q[0])).length;

  els.dialogBody.innerHTML = `
    <p class="kicker">${esc(t(`group.${cat.group}`))} · ${esc(pick(cat.subtitle))}</p>
    <h2>${esc(pick(cat.title))}</h2>
    <p class="dialog-lead">${esc(pick(cat.description))}</p>

    <div class="dialog-stats">
      <div><b>${cat.theory.length}</b><span>${esc(t("cat.theoryTopics"))}</span></div>
      <div><b>${formatNumber(pool.length)}</b><span>${esc(t("cat.questions"))}</span></div>
      <div><b>${solved}</b><span>${esc(t("progress.solved"))}</span></div>
      <div><b>${cat.exam.pass}/${cat.exam.questions}</b><span>${esc(t("exam.score"))}</span></div>
    </div>

    <h3 class="dialog-sub">${esc(t("cat.theoryTopics"))}</h3>
    <ul class="theory-list">
      ${cat.theory.map((topic) => `<li>${esc(pick(topic))}</li>`).join("")}
    </ul>

    <p class="dialog-rule">${esc(t("cat.examRule", {
      pass: cat.exam.pass,
      total: cat.exam.questions,
      minutes: cat.exam.minutes,
    }))}</p>

    <div class="dialog-actions">
      <button type="button" class="btn btn-primary" data-dialog-exam="${cat.id}">
        ${esc(t("cat.exam"))}
      </button>
      <button type="button" class="btn btn-ghost" data-dialog-practice="${cat.id}">
        ${esc(t("cat.practice"))}
      </button>
      ${
        cat.id === "vehicle"
          ? `<button type="button" class="btn btn-ghost" data-dialog-vehicle="1">
               ${esc(t("cat.vehicle"))}
             </button>`
          : ""
      }
    </div>`;

  els.dialog.showModal();
}

/* ------------------------------------------------------------------ scenes */

function preferredReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

async function initScenes() {
  if (!window.WebGLRenderingContext) {
    els.heroCanvas.classList.add("is-off");
    els.vehicleCanvas.classList.add("is-off");
    return;
  }
  try {
    const mod = await import("./scene.js");
    const reducedMotion = preferredReducedMotion();

    heroScene = mod.createHeroScene(els.heroCanvas, { reducedMotion });
    vehicleScene = mod.createVehicleScene(els.vehicleCanvas, {
      host: els.hotspotHost,
      reducedMotion,
      onPartClick: (id) => selectPart(id, { explode: true }),
    });

    els.heroCanvas.classList.toggle("is-off", !heroScene.ok);
    els.vehicleCanvas.classList.toggle("is-off", !vehicleScene.ok);
    if (state.exploded) vehicleScene.setExploded(true);
    updateExplodeButton();
    selectPart(state.part);
  } catch (error) {
    console.warn("3D scene unavailable:", error);
    heroScene?.dispose?.();
    vehicleScene?.dispose?.();
    heroScene = null;
    vehicleScene = null;
    els.heroCanvas?.classList.add("is-off");
    els.vehicleCanvas?.classList.add("is-off");
    updateExplodeButton();
  }
}

/* ------------------------------------------------------------------ events */

function renderAll() {
  renderHero();
  renderCategories();
  renderExam();
  renderProgress();
  renderPartPanel();
  updateExplodeButton();
}

els.lang.addEventListener("click", () => {
  setLang(getLang() === "ru" ? "en" : "ru");
  applyStatic();
  renderAll();
  vehicleScene?.setLabels(
    Object.fromEntries(VEHICLE_PARTS.map((part) => [part.id, pick(part.title)]))
  );
});

els.bankLang.addEventListener("change", (event) => {
  if (state.session) {
    event.target.value = state.bankLang;
    return;
  }
  state.bankLang = BANK_LANGS.includes(event.target.value)
    ? event.target.value
    : "ru";
  saveBankLang(state.bankLang);
  state.poolCache.clear();
  state.index = null;
  state.result = null;
  renderAll();
});

els.catGrid.addEventListener("click", (event) => {
  const exam = event.target.closest("[data-exam]");
  if (exam) {
    startExam(exam.dataset.exam);
    return;
  }
  const open = event.target.closest("[data-open]");
  if (open) {
    openCategory(open.dataset.open);
    return;
  }
  const card = event.target.closest("[data-cat]");
  if (card) openCategory(card.dataset.cat);
});

els.examHost.addEventListener("click", (event) => {
  const option = event.target.closest("[data-option]");
  if (option && state.session && !state.session.checked) {
    state.session.selected = Number(option.dataset.option);
    renderSession();
    return;
  }

  const chip = event.target.closest("[data-exam-cat]");
  if (chip && !state.session) {
    state.examCat = chip.dataset.examCat;
    renderExamStart();
    return;
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

  if (action === "start-exam") {
    startExam(state.examCat);
  } else if (action === "start-practice") {
    startPractice(state.result?.catId || state.examCat);
  } else if (action === "commit") {
    commitAnswer();
  } else if (action === "check") {
    commitAnswer();
  } else if (action === "next-practice") {
    const session = state.session;
    if (!session) return;
    session.index += 1;
    session.selected = null;
    session.checked = false;
    session.last = null;
    if (session.index >= session.ids.length) finishSession();
    else renderSession();
  } else if (action === "review-result") {
    const result = state.result;
    if (!result) return;
    startPractice(
      result.catId,
      result.mistakes.map((item) => item.id)
    );
  } else if (action === "new-exam") {
    startExam(state.result?.catId || state.examCat);
  } else if (action === "exam-home") {
    state.result = null;
    renderExam();
  }
});

els.reviewWeak.addEventListener("click", () => {
  const ids = tracker.weakQuestionIds();
  if (!ids.length) return;
  startPractice("mixed", ids.slice(0, 20));
});

els.reset.addEventListener("click", () => {
  if (!window.confirm(t("progress.resetConfirm"))) return;
  clearTimer();
  tracker.resetProgress();
  state.session = null;
  state.result = null;
  renderAll();
});

els.explode.addEventListener("click", () => {
  state.exploded = !state.exploded;
  vehicleScene?.setExploded(state.exploded);
  updateExplodeButton();
});

els.partList.addEventListener("click", (event) => {
  const row = event.target.closest("[data-part]");
  if (row) selectPart(row.dataset.part, { explode: true });
});

els.dialogClose.addEventListener("click", () => els.dialog.close());

els.dialog.addEventListener("click", (event) => {
  if (event.target === els.dialog) els.dialog.close();
});

els.dialogBody.addEventListener("click", (event) => {
  const exam = event.target.closest("[data-dialog-exam]");
  const practice = event.target.closest("[data-dialog-practice]");
  const vehicle = event.target.closest("[data-dialog-vehicle]");

  if (exam) {
    els.dialog.close();
    startExam(exam.dataset.dialogExam);
  } else if (practice) {
    els.dialog.close();
    startPractice(practice.dataset.dialogPractice);
  } else if (vehicle) {
    els.dialog.close();
    state.part = "engine";
    renderPartPanel();
    scrollToSection("vehicle");
    vehicleScene?.focus("engine");
  }
});

els.heroExam.addEventListener("click", () => {
  scrollToSection("exam");
});

/* --------------------------------------------------------------------- init */

applyStatic();
renderAll();
initScenes();
