/* Azim Travel CRM — демо на данных из Excel (без сервера, хранение в localStorage) */
(() => {
  "use strict";

  const DATA = window.AZIM_DATA;
  const STORE_KEY = "azim-crm-v1";
  const THEME_KEY = "azim-theme";

  /* ================= Справочники ================= */
  const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const MONTHS_GEN = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const MONTHS_SHORT = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  const DOW = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  const DOW_LONG = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
  const PERIOD_MONTHS = [7, 8, 9, 10, 11, 12];
  const YEAR = 2026;

  const SVC = {
    "вс аэ": { label: "Встреча в аэропорту", kind: "air", icon: "plane" },
    "пр аэ": { label: "Проводы в аэропорт", kind: "air", icon: "plane" },
    "вс ж/в": { label: "Встреча на вокзале", kind: "rail", icon: "train" },
    "пр ж/в": { label: "Проводы на вокзал", kind: "rail", icon: "train" },
    "вс гр": { label: "Встреча на границе", kind: "border", icon: "flag" },
    "пр гр": { label: "Проводы на границу", kind: "border", icon: "flag" },
    "экя": { label: "Экскурсия", kind: "exc", icon: "landmark" },
    "ноч экя": { label: "Ночная экскурсия", kind: "exc", icon: "moon" },
    "ужин": { label: "Ужин", kind: "food", icon: "utensils" },
    "выезд": { label: "Выезд", kind: "", icon: "arrow" },
    "альб": { label: "Комплекс Имама аль-Бухари", kind: "exc", icon: "landmark" },
    "регис": { label: "Регистан", kind: "exc", icon: "landmark" },
    "гост": { label: "Гостиница", kind: "", icon: "pin" },
    "???": { label: "Уточнить", kind: "unk", icon: "alert" },
  };
  const CITY = {
    "Таш": "Ташкент", "Сам": "Самарканд", "Бух": "Бухара", "Хива": "Хива", "Ург": "Ургенч", "Гиж": "Гиждуван",
    "Пендж": "Пенджикент", "Шах": "Шахрисабз", "Чим": "Чимган", "Китаб": "Китаб", "Шават": "Шават (граница)",
    "Нур": "Нурата", "АязК": "Аяз-Кала", "Янгиказ": "Янгиказган", "Джартеп": "Джартепа (граница)", "Нук": "Нукус",
    "Терм": "Термез", "Чар": "Чарвак", "Муй": "Муйнак", "Фарап": "Фарап (граница)", "Айдар": "Айдаркуль",
    "Сарыос": "Сариасия (граница)",
  };
  const TRANSPORT_TYPES = ["35", "40+", "45", "50", "50+", "55+2", "Еврайс", "Спринтер", "Хайс", "Стария", "30 мест вайфай"];

  /* ================= Иконки ================= */
  const ICONS = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6M9 16h6"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    bus: '<path d="M8 6v6M15 6v6M2 12h19.6M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    train: '<rect x="4" y="3" width="16" height="15" rx="2"/><path d="M4 11h16M12 3v8M8 22l2-4M16 22l-2-4M8 15h.01M16 15h.01"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    printer: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    ban: '<circle cx="12" cy="12" r="9"/><path d="m5.7 5.7 12.6 12.6"/>',
    restore: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    landmark: '<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4z"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h2M14 13h2M8 17h2M14 17h2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
  };
  const icon = (name) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ""}</svg>`;

  /* ================= Утилиты ================= */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseISO = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parseISO(s); d.setDate(d.getDate() + n); return iso(d); };
  const diffDays = (a, b) => Math.round((parseISO(b) - parseISO(a)) / 864e5);
  const TODAY = iso(new Date());
  const nowStamp = () => { const d = new Date(); return `${iso(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };

  const fmtNum = (n) => Math.round(n || 0).toLocaleString("ru-RU");
  const fmtUsd = (n) => (n < 0 ? "−" : "") + "$" + fmtNum(Math.abs(n));
  const fmtUzs = (n) => fmtNum(n) + " сум";
  const fmtDate = (s) => { if (!s) return "—"; const d = parseISO(s); return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`; };
  const fmtDateLong = (s) => { if (!s) return "—"; const d = parseISO(s); return `${d.getDate()} ${MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`; };
  const fmtRange = (a, b) => {
    if (!a) return "—";
    if (!b || a === b) return fmtDate(a);
    const da = parseISO(a), db = parseISO(b);
    if (da.getMonth() === db.getMonth()) return `${da.getDate()}–${db.getDate()} ${MONTHS_SHORT[db.getMonth()]}`;
    return `${fmtDate(a)} – ${fmtDate(b)}`;
  };
  const dow = (s) => DOW[parseISO(s).getDay()];
  const plural = (n, one, few, many) => {
    const m10 = n % 10, m100 = n % 100;
    return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many;
  };
  const initials = (s) => s.replace(/[^\p{L}\s]/gu, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  function parseEscort(s) {
    if (!s) return null;
    const m = String(s).match(/^(.*?)[\s,]*(\d{9})$/);
    if (!m) return { name: s, phone: null };
    const p = m[2];
    return { name: m[1].trim() || "—", phone: `+998 ${p.slice(0, 2)} ${p.slice(2, 5)} ${p.slice(5, 7)} ${p.slice(7)}`, tel: "+998" + p };
  }

  function svcInfo(name) {
    if (!name) return { label: "Время", kind: "", icon: "clock" };
    const key = name.toLowerCase().replace(/\s+/g, " ").trim();
    if (SVC[key]) return SVC[key];
    const kind = /аэ/.test(key) ? "air" : /ж\/в/.test(key) ? "rail" : /\bгр$/.test(key) ? "border"
      : /экя|экс/.test(key) ? "exc" : /ужин/.test(key) ? "food" : "";
    const ic = { air: "plane", rail: "train", border: "flag", exc: "landmark", food: "utensils" }[kind] || "pin";
    return { label: name, kind, icon: ic };
  }
  function svcChip(s) {
    const info = svcInfo(s.s);
    return `<span class="chip ${info.kind}" title="${esc(info.label)}">${icon(info.icon)}${s.t ? `<span class="tm">${esc(s.t)}</span>` : ""}${s.s ? esc(s.s) : ""}</span>`;
  }
  const svcChips = (list) => (list && list.length ? `<div class="chips">${list.map(svcChip).join("")}</div>` : "");
  const svcText = (list) => (list || []).map((s) => [s.t, s.s ? svcInfo(s.s).label : null].filter(Boolean).join(" ")).join(", ");

  function expandRoute(route) {
    if (!route) return "";
    return route.split(/\s*-\s*/).map((p) => CITY[p] || p).join(" → ");
  }
  function routeSummary(days) {
    const seq = [];
    for (const d of days) {
      if (!d.route) continue;
      for (const p of d.route.split(/\s*-\s*/)) {
        const c = p.trim();
        if (c && seq[seq.length - 1] !== c) seq.push(c);
      }
    }
    return seq.join(" → ");
  }
  /* ================= Хранилище ================= */
  // 9 хорошо различимых оттенков (OKLCH), в таком порядке соседние строки различаются и при нарушениях цветового зрения
  // (проверено валидатором палитр: светлая и тёмная тема, включая переход с последнего цвета на первый)
  const PALETTE = [30, 220, 145, 325, 65, 185, 255, 0, 290];
  const HUE_VERSION = 2;
  const autoHue = (i) => PALETTE[i % PALETTE.length];
  // цвета раздаём по порядку строк в графиках: заявки — по дате заезда, машины — по номеру
  function assignHues(d) {
    d.vehicles.forEach((v, i) => { v.hue = autoHue(i); });
    [...d.requests].sort((a, b) => (a.from || "").localeCompare(b.from || "") || a.no - b.no).forEach((r, i) => { r.hue = autoHue(i); });
    d.hueV = HUE_VERSION;
  }
  function fresh() {
    const d = structuredClone(DATA);
    for (const r of d.requests) r.log = [{ ts: d.importedAt, text: "Импортировано из Excel" }];
    for (const v of d.vehicles) v.log = [];
    assignHues(d);
    d.seq = Math.max(0, ...d.requests.map((r) => r.no)) + 1;
    return d;
  }
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY));
      if (saved && saved.importedAt === DATA.importedAt) {
        if (saved.hueV !== HUE_VERSION) assignHues(saved);
        return saved;
      }
    } catch (e) { /* хранилище недоступно — работаем без сохранения */ }
    return fresh();
  }
  let db = load();
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); } catch (e) { /* ignore */ }
  }

  /* ================= Расчёты ================= */
  const STATUS = { upcoming: "Ожидается", active: "В пути", done: "Завершена", cancelled: "Аннуляция" };
  const PAY = { paid: "Оплачено", partial: "Частично", unpaid: "Не оплачено", over: "Переплата", none: "—" };

  function reqStatus(r) {
    if (r.cancelled) return "cancelled";
    if (r.to && r.to < TODAY) return "done";
    if (r.from > TODAY) return "upcoming";
    return "active";
  }
  const paidOf = (x) => (x.payments || []).reduce((s, p) => s + (p.usd || 0), 0);
  const dueOf = (r) => (r.total || 0) - paidOf(r);
  function payStatus(r) {
    const total = r.total || 0, paid = paidOf(r);
    if (!total && !paid) return "none";
    if (paid > total + 1) return "over";
    if (paid >= total - 1) return "paid";
    return paid > 0 ? "partial" : "unpaid";
  }
  const toUzs = (usd, rate, vat) => usd * rate * (1 + vat / 100);
  const reqDays = (r) => (r.from && r.to ? diffDays(r.from, r.to) + 1 : r.days.length);
  const reqById = (id) => db.requests.find((r) => r.id === id);
  const vehById = (id) => db.vehicles.find((v) => v.id === id);
  const inMonth = (s, m) => s && +s.slice(5, 7) === m && +s.slice(0, 4) === YEAR;
  const daysInMonth = (m) => new Date(YEAR, m, 0).getDate();
  const curMonth = () => { const m = +TODAY.slice(5, 7); return +TODAY.slice(0, 4) === YEAR && PERIOD_MONTHS.includes(m) ? m : 10; };
  const vehCost = (v) => v.schedule.reduce((s, x) => s + (x.cost || 0), 0);
  const vehDue = (v) => vehCost(v) - paidOf(v);
  const vehDaysIn = (v, m) => v.schedule.filter((x) => inMonth(x.d, m)).length;
  const vehOn = (v, d) => v.schedule.find((x) => x.d === d);
  const vehTitle = (v) => (v.partner ? v.driver || v.name : `${v.brand} ${v.plate || ""}`.trim());
  const vehSub = (v) => (v.partner ? "Частный перевозчик" : [v.driver, v.seats && `мест: ${v.seats}`, v.sold && "продан"].filter(Boolean).join(" · ") || "—");
  const vdot = (v) => `<span class="vdot vc ${v.partner ? "gray" : ""}" style="--vh:${v.hue}"></span>`;
  const rdot = (r) => `<span class="vdot vc ${r.cancelled ? "gray" : ""}" style="--vh:${r.hue}"></span>`;
  const huePick = (action, id, cur) => `<div class="hue-pick">${(HUES.includes(cur) ? HUES : [cur, ...HUES]).map((h) =>
    `<button class="vc ${h === cur ? "on" : ""}" style="--vh:${h}" data-action="${action}" data-id="${id}" data-h="${h}" aria-label="Выбрать этот цвет"></button>`).join("")}</div>`;
  const HUES = [...PALETTE].sort((a, b) => a - b);
  // свой цвет клетки дня (оттенок палитры или "gray"), рисуется поверх цвета строки
  const tint = (x) => (x && x.color != null
    ? { cls: `vc tint${x.color === "gray" ? " gray" : ""}`, style: x.color === "gray" ? "" : `style="--vh:${x.color}"` }
    : { cls: "", style: "" });
  // новой заявке — цвет, который реже всего встречается у групп в те же даты
  function freshHue(from, to) {
    const used = new Map(PALETTE.map((h) => [h, 0]));
    for (const r of db.requests) {
      if (r.from && r.from <= to && (r.to || r.from) >= from && used.has(r.hue)) used.set(r.hue, used.get(r.hue) + 1);
    }
    return [...used].sort((a, b) => a[1] - b[1])[0][0];
  }
  const vehGroup = (v) => (v.partner ? "partner" : v.brand.toLowerCase());
  const fleetMonths = () => PERIOD_MONTHS.filter((m) => db.vehicles.some((v) => vehDaysIn(v, m)));
  function fleetMonth() {
    const ms = fleetMonths(), c = curMonth();
    return ms.includes(c) ? c : ms.filter((m) => m <= c).pop() || ms[0] || c;
  }

  function customers() {
    const map = new Map();
    for (const r of db.requests) {
      let c = map.get(r.customer);
      if (!c) map.set(r.customer, (c = { name: r.customer, reqs: [] }));
      c.reqs.push(r);
    }
    return [...map.values()].map((c) => {
      const live = c.reqs.filter((r) => !r.cancelled);
      const next = live.filter((r) => r.from >= TODAY).sort((a, b) => a.from.localeCompare(b.from))[0];
      return {
        ...c,
        count: live.length,
        cancelled: c.reqs.length - live.length,
        pax: live.reduce((s, r) => s + (r.pax || 0), 0),
        total: c.reqs.reduce((s, r) => s + (r.total || 0), 0),
        paid: c.reqs.reduce((s, r) => s + paidOf(r), 0),
        due: c.reqs.reduce((s, r) => s + dueOf(r), 0),
        dueUzs: c.reqs.reduce((s, r) => s + toUzs(Math.max(0, dueOf(r)), r.rate, r.vat), 0),
        countries: [...new Set(live.map((r) => r.country).filter((x) => x && !/групп/i.test(x)))],
        next,
      };
    });
  }

  /* ================= UI-состояние ================= */
  const REQ_VIEW_KEY = "azim-req-view";
  function savedReqView() {
    try { return localStorage.getItem(REQ_VIEW_KEY) === "list" ? "list" : "sheet"; } catch (e) { return "sheet"; }
  }
  const ui = {
    req: { q: "", customer: "", month: "", status: "all", pay: "all", sort: "no", dir: 1, view: savedReqView() },
    cal: { customer: "", cancelled: false, reanchor: false },
    fleet: { tab: "list", month: fleetMonth(), group: "all" },
    fin: { tab: "clients", open: new Set() },
    clients: { q: "" },
    dash: { svcDay: TODAY },
  };
  let drawer = null; // { type: 'request'|'vehicle'|'client', id }
  let modal = null; // { type, ... }

  /* ================= Навигация ================= */
  const VIEWS = [
    { id: "dashboard", title: "Обзор", icon: "grid", render: viewDashboard },
    { id: "requests", title: "Заявки", icon: "clipboard", render: viewRequests, count: () => db.requests.filter((r) => !r.cancelled).length },
    { id: "calendar", title: "График заявок", icon: "calendar", render: viewCalendar, after: calAfter },
    { id: "fleet", title: "Транспорт", icon: "bus", render: viewFleet, after: fleetAfter, count: () => db.vehicles.filter((v) => !v.sold).length },
    { id: "finance", title: "Взаиморасчёты", icon: "wallet", render: viewFinance },
    { id: "clients", title: "Заказчики", icon: "users", render: viewClients, count: () => customers().length },
    { id: "settings", title: "Настройки", icon: "sliders", render: viewSettings },
  ];
  function currentView() {
    const [path, qs] = location.hash.replace(/^#\/?/, "").split("?");
    const v = VIEWS.find((x) => x.id === path) || VIEWS[0];
    return { view: v, params: new URLSearchParams(qs || "") };
  }
  function go(id, params) {
    const qs = params ? "?" + new URLSearchParams(params) : "";
    location.hash = `#/${id}${qs}`;
  }

  function renderNav() {
    const { view } = currentView();
    $("#nav").innerHTML = `<div class="nav-label">Работа</div>` + VIEWS.map((v, i) =>
      (i === 4 ? `<div class="nav-label">Финансы и база</div>` : "") +
      `<a href="#/${v.id}" class="${v.id === view.id ? "active" : ""}">${icon(v.icon)}<span>${v.title}</span>${v.count ? `<span class="count">${v.count()}</span>` : ""}</a>`
    ).join("");
  }

  let lastViewId = null;
  function render() {
    const { view, params } = currentView();
    // фильтр из ссылки (например, со страницы заказчика)
    if (view.id === "requests" && params.has("customer")) {
      ui.req.customer = params.get("customer");
      history.replaceState(null, "", "#/requests");
    }
    renderNav();
    // кнопка в шапке: в разделе «Транспорт» добавляет машину, в остальных — заявку
    const nb = $(".new-btn"), fleet = view.id === "fleet";
    nb.dataset.action = fleet ? "new-vehicle" : "new-request";
    nb.title = fleet ? "Добавить авто" : "Новая заявка";
    nb.innerHTML = `${icon("plus")}<span>${nb.title}</span>`;
    $("#page-title").textContent = view.title;
    document.title = `${view.title} · Azim Travel CRM`;
    const scroll = window.scrollY;
    const kept = lastViewId === view.id ? $$("[data-keep-scroll]").map((el) => [el.dataset.keepScroll, el.scrollLeft, el.scrollTop]) : [];
    $("#view").innerHTML = view.render();
    if (lastViewId === view.id) window.scrollTo(0, scroll);
    for (const [k, left, top] of kept) {
      const el = $(`[data-keep-scroll="${k}"]`);
      if (el) { el.scrollLeft = left; el.scrollTop = top; }
    }
    if (view.after) view.after(new Set(kept.map(([k]) => k)));
    lastViewId = view.id;
    renderDrawer();
  }
  function rerender() { save(); render(); }

  /* ================= Обзор ================= */
  function viewDashboard() {
    const reqs = db.requests;
    const live = reqs.filter((r) => !r.cancelled);
    const todayGroups = live
      .map((r) => ({ r, day: r.days.find((d) => d.d === TODAY) }))
      .filter((x) => x.day || (x.r.from <= TODAY && x.r.to >= TODAY))
      .sort((a, b) => a.r.customer.localeCompare(b.r.customer) || a.r.no - b.r.no);
    const paxToday = todayGroups.reduce((s, x) => s + (x.r.pax || 0), 0);
    const total = reqs.reduce((s, r) => s + (r.total || 0), 0);
    const paid = reqs.reduce((s, r) => s + paidOf(r), 0);
    const receivable = reqs.reduce((s, r) => s + Math.max(0, dueOf(r)), 0);
    const debtors = reqs.filter((r) => dueOf(r) > 1).length;
    const carrierDue = db.vehicles.reduce((s, v) => s + Math.max(0, vehDue(v)), 0);
    const carriers = db.vehicles.filter((v) => vehDue(v) > 1).length;
    const week = addDays(TODAY, 7);
    const arrivals = live.filter((r) => r.from > TODAY && r.from <= week).sort((a, b) => a.from.localeCompare(b.from) || a.no - b.no);
    const td = parseISO(TODAY);

    return `
      <div class="page-head">
        <div>
          <h2>Сегодня, ${DOW_LONG[td.getDay()]} ${td.getDate()} ${MONTHS_GEN[td.getMonth()]}</h2>
          <p>Сводка по заявкам и автопарку за июль–декабрь ${YEAR}</p>
        </div>
        <div class="spacer"></div>
        <a class="btn" href="#/calendar">${icon("calendar")}График</a>
      </div>

      <div class="grid kpis">
        ${kpi("Групп в пути сегодня", todayGroups.length, `${fmtNum(paxToday)} ${plural(paxToday, "турист", "туриста", "туристов")}`)}
        ${kpi("Заявок за период", live.length, `${reqs.length - live.length} ${plural(reqs.length - live.length, "аннуляция", "аннуляции", "аннуляций")}`)}
        ${kpi("Начислено заказчикам", money(total), `оплачено ${fmtUsd(paid)}`)}
        ${kpi("Остаток к получению", money(receivable), `по ${debtors} ${plural(debtors, "заявке", "заявкам", "заявкам")}`)}
        ${kpi("Долг перевозчикам", money(carrierDue), `${carriers} ${plural(carriers, "перевозчик", "перевозчика", "перевозчиков")}`)}
      </div>

      <div class="grid cols-2" style="margin-bottom:16px">
        <section class="card">
          <div class="card-h"><h2>Группы в пути сегодня</h2><span class="sub">${todayGroups.length}</span><div class="spacer"></div><a class="small" href="#/requests" data-action="filter-active">Все заявки в пути</a></div>
          <div class="today-list">
            ${todayGroups.length ? todayGroups.map(({ r, day }) => `
              <div class="today-item" data-open-request="${r.id}">
                <div>
                  <div style="font-weight:600">${esc(r.customer)}</div>
                  <div class="small muted">№${r.no}${r.group ? " · " + esc(r.group) : ""}${r.pax ? ` · ${r.pax} чел.` : ""}</div>
                </div>
                <div class="today-route" title="${esc(expandRoute(day && day.route))}">${icon("pin")}${esc((day && day.route) || "—")}
                  <span class="small muted" style="font-weight:500">день ${day ? day.n : "—"}/${reqDays(r)}</span></div>
                <div>${day && day.svc.length ? svcChips(day.svc) : `<span class="small muted">${r.escort ? "Гид: " + esc(parseEscort(r.escort).name) : "без трансферов"}</span>`}</div>
              </div>`).join("") : `<div class="empty">Сегодня групп в пути нет</div>`}
          </div>
        </section>

        <section class="card">
          <div class="card-h"><h2>Заезды на 7 дней</h2><span class="sub">${arrivals.length}</span></div>
          <div class="mini-list">
            ${arrivals.length ? arrivals.map((r) => `
              <div class="mini-row" data-open-request="${r.id}">
                <div class="date-box"><b>${parseISO(r.from).getDate()}</b><span>${MONTHS_SHORT[parseISO(r.from).getMonth()]}</span></div>
                <div style="min-width:0;flex:1">
                  <div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.customer)}</div>
                  <div class="small muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(routeSummary(r.days) || "маршрут не указан")}</div>
                </div>
                <div class="small muted nowrap">${r.pax ? r.pax + " чел." : ""}</div>
              </div>`).join("") : `<div class="empty">В ближайшую неделю заездов нет</div>`}
          </div>
        </section>
      </div>

      <div class="grid cols-2" style="margin-bottom:16px">
        ${transfersCard()}
        ${fleetLoadCard()}
      </div>

      <div class="grid cols-2e">
        <section class="card">
          <div class="card-h"><h2>Начислено по месяцам заезда, USD</h2></div>
          <div class="card-b">${monthChart()}</div>
        </section>
        <section class="card">
          <div class="card-h"><h2>Крупнейшие заказчики, USD</h2><div class="spacer"></div><a class="small" href="#/clients">Все заказчики</a></div>
          <div class="card-b">${topClients()}</div>
        </section>
      </div>`;
  }
  function kpi(label, value, hint) {
    return `<div class="card kpi"><div class="label">${label}</div><div class="value">${typeof value === "number" ? fmtNum(value) : value}</div><div class="hint">${hint}</div></div>`;
  }
  const money = (n) => `${fmtNum(n)}<span class="cur">$</span>`;

  function transfersCard() {
    const day = ui.dash.svcDay;
    const items = [];
    for (const r of db.requests) {
      if (r.cancelled) continue;
      const d = r.days.find((x) => x.d === day);
      if (!d) continue;
      for (const s of d.svc) if (s.s && svcInfo(s.s).kind !== "exc") items.push({ r, d, s });
    }
    items.sort((a, b) => (a.s.t || "99").localeCompare(b.s.t || "99"));
    const tomorrow = addDays(TODAY, 1);
    return `<section class="card">
      <div class="card-h"><h2>Трансферы и услуги</h2><span class="sub">${items.length}</span><div class="spacer"></div>
        <div class="seg">
          <button class="${day === TODAY ? "on" : ""}" data-action="svc-day" data-day="${TODAY}">Сегодня</button>
          <button class="${day === tomorrow ? "on" : ""}" data-action="svc-day" data-day="${tomorrow}">Завтра</button>
        </div></div>
      <div class="card-b flush table-wrap" style="max-height:340px;overflow-y:auto">
        ${items.length ? `<table class="t"><thead><tr><th>Время</th><th>Услуга</th><th>Группа</th><th>Маршрут дня</th></tr></thead><tbody>
          ${items.map(({ r, d, s }) => `<tr class="clickable" data-open-request="${r.id}">
            <td class="num" style="font-weight:600">${s.t || '<span class="muted">—</span>'}</td>
            <td>${svcChip({ s: s.s })} <span class="small muted">${esc(svcInfo(s.s).label)}</span></td>
            <td><div class="cell-main">${esc(r.customer)}</div><div class="cell-sub">№${r.no}${r.group ? " · " + esc(r.group) : ""}</div></td>
            <td>${esc(d.route || "—")}</td></tr>`).join("")}
        </tbody></table>` : `<div class="empty">На ${fmtDateLong(day)} трансферов не запланировано</div>`}
      </div></section>`;
  }

  function fleetLoadCard() {
    const m = fleetMonth(), dim = daysInMonth(m);
    const rows = db.vehicles.filter((v) => !v.sold && !v.partner)
      .map((v) => ({ v, days: vehDaysIn(v, m) }))
      .sort((a, b) => b.days - a.days).slice(0, 8);
    return `<section class="card">
      <div class="card-h"><h2>Загрузка автопарка · ${MONTHS[m - 1].toLowerCase()}</h2>${m !== curMonth() ? '<span class="sub">последний заполненный месяц</span>' : ""}<div class="spacer"></div><a class="small" href="#/fleet">Весь транспорт</a></div>
      <div class="card-b">
        ${rows.map(({ v, days }) => `<div class="hbar-row" data-open-vehicle="${v.id}" style="cursor:pointer" data-tip="<b>${esc(vehTitle(v))}</b><br>${days} из ${dim} дней в работе">
          <div class="name">${vdot(v)}${esc(vehTitle(v))}</div>
          <div class="meter"><i style="width:${(days / dim) * 100}%"></i></div>
          <div class="val num">${days} дн.</div></div>`).join("")}
      </div></section>`;
  }

  function monthChart() {
    const vals = PERIOD_MONTHS.map((m) => {
      const rs = db.requests.filter((r) => inMonth(r.from, m));
      return { m, sum: rs.reduce((s, r) => s + (r.total || 0), 0), n: rs.filter((r) => !r.cancelled).length };
    });
    const max = Math.max(...vals.map((v) => v.sum), 1);
    const nice = niceMax(max);
    const W = 520, H = 230, L = 44, B = 26, T = 22, bw = 24;
    const step = (W - L) / vals.length;
    const y = (v) => T + (H - T - B) * (1 - v / nice);
    const ticks = [0, nice / 2, nice];
    return `<div class="chart-box"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Начислено по месяцам">
      ${ticks.map((t) => `<line class="grid-line" x1="${L}" x2="${W}" y1="${y(t)}" y2="${y(t)}"/><text x="${L - 8}" y="${y(t) + 4}" text-anchor="end">${t >= 1000 ? fmtNum(t / 1000) + "K" : t}</text>`).join("")}
      ${vals.map((v, i) => {
        const cx = L + step * i + step / 2, top = y(v.sum), h = y(0) - top;
        const r = Math.min(4, h);
        const path = h > 0 ? `M${cx - bw / 2},${y(0)} V${top + r} Q${cx - bw / 2},${top} ${cx - bw / 2 + r},${top} H${cx + bw / 2 - r} Q${cx + bw / 2},${top} ${cx + bw / 2},${top + r} V${y(0)} Z` : "";
        return `<g class="col" data-tip="<b>${MONTHS[v.m - 1]}</b><br>${fmtUsd(v.sum)} · ${v.n} ${plural(v.n, "заявка", "заявки", "заявок")}">
          <rect class="bar-hit" x="${cx - step / 2}" y="${T}" width="${step}" height="${H - T - B}"/>
          <path class="bar" d="${path}"/>
          ${v.sum ? `<text class="val" x="${cx}" y="${top - 7}" text-anchor="middle">${fmtNum(v.sum / 1000)}K</text>` : ""}
          <text x="${cx}" y="${H - 6}" text-anchor="middle">${MONTHS_SHORT[v.m - 1]}</text></g>`;
      }).join("")}
      <line class="axis" x1="${L}" x2="${W}" y1="${y(0)}" y2="${y(0)}"/>
    </svg></div>`;
  }
  function niceMax(v) {
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    for (const k of [1, 2, 2.5, 5, 10]) if (k * p >= v) return k * p;
    return 10 * p;
  }
  function topClients() {
    const list = customers().filter((c) => c.total > 0).sort((a, b) => b.total - a.total).slice(0, 8);
    const max = Math.max(...list.map((c) => c.total), 1);
    return list.map((c) => `<div class="hbar-row" style="cursor:pointer" data-open-client="${esc(c.name)}"
      data-tip="<b>${esc(c.name)}</b><br>${c.count} ${plural(c.count, "заявка", "заявки", "заявок")} · ${fmtUsd(c.total)}<br>Остаток: ${fmtUsd(c.due)}">
      <div class="name">${esc(c.name)}</div>
      <div class="hbar-track"><div class="hbar" style="width:${(c.total / max) * 100}%"></div></div>
      <div class="val num">${fmtUsd(c.total)}</div></div>`).join("");
  }

  /* ================= Заявки ================= */
  function filteredRequests() {
    const f = ui.req, q = f.q.trim().toLowerCase();
    let list = db.requests.filter((r) => {
      if (f.customer && r.customer !== f.customer) return false;
      if (f.month && !inMonth(r.from, +f.month)) return false;
      if (f.status !== "all" && reqStatus(r) !== f.status) return false;
      if (f.pay !== "all") {
        const p = payStatus(r);
        if (f.pay === "debt" ? !(p === "unpaid" || p === "partial") : p !== f.pay) return false;
      }
      if (q) {
        const hay = [r.no, r.customer, r.group, r.country, r.escort, r.transport, routeSummary(r.days)].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const k = f.sort, dir = f.dir;
    const val = (r) => (k === "no" ? r.no : k === "total" ? r.total || 0 : k === "pax" ? r.pax || 0 : k === "customer" ? r.customer : r.from || "");
    list.sort((a, b) => { const x = val(a), y = val(b); return (x < y ? -1 : x > y ? 1 : a.no - b.no) * dir; });
    return list;
  }

  function viewRequests() {
    const f = ui.req;
    const base = db.requests.filter((r) => (!f.customer || r.customer === f.customer) && (!f.month || inMonth(r.from, +f.month)));
    const cnt = (st) => base.filter((r) => st === "all" || reqStatus(r) === st).length;
    const list = filteredRequests();
    const names = [...new Set(db.requests.map((r) => r.customer))].sort((a, b) => a.localeCompare(b, "ru"));

    return `
      <div class="toolbar">
        <input class="input search-inline" type="search" placeholder="Поиск по заявкам…" value="${esc(f.q)}" data-filter="q">
        <select class="input" data-filter="customer"><option value="">Все заказчики</option>${names.map((n) => `<option ${n === f.customer ? "selected" : ""}>${esc(n)}</option>`).join("")}</select>
        <select class="input" data-filter="month"><option value="">Все месяцы</option>${PERIOD_MONTHS.map((m) => `<option value="${m}" ${String(m) === String(f.month) ? "selected" : ""}>${MONTHS[m - 1]}</option>`).join("")}</select>
        <select class="input" data-filter="pay">
          ${[["all", "Любая оплата"], ["debt", "Есть долг"], ["paid", "Оплачено"], ["over", "Переплата"]].map(([v, l]) => `<option value="${v}" ${f.pay === v ? "selected" : ""}>${l}</option>`).join("")}
        </select>
        <div class="grow"></div>
        <button class="btn" data-action="export-csv">${icon("download")}CSV</button>
      </div>
      <div class="toolbar">
        <div class="seg">
          ${[["all", "Все"], ["upcoming", "Ожидаются"], ["active", "В пути"], ["done", "Завершены"], ["cancelled", "Аннуляции"]]
            .map(([v, l]) => `<button class="${f.status === v ? "on" : ""}" data-action="req-status" data-v="${v}">${l}<span class="c">${cnt(v)}</span></button>`).join("")}
        </div>
        ${f.customer || f.month || f.q || f.pay !== "all" ? `<button class="btn ghost sm" data-action="reset-filters">${icon("x")}Сбросить фильтры</button>` : ""}
        <div class="grow"></div>
        <div class="seg" aria-label="Вид таблицы">
          ${[["sheet", "Как в Excel"], ["list", "Компактно"]].map(([v, l]) => `<button class="${f.view === v ? "on" : ""}" data-action="req-view" data-v="${v}">${l}</button>`).join("")}
        </div>
      </div>
      ${list.length ? (f.view === "list" ? reqList(list) : reqSheet(list))
        : `<div class="card"><div class="empty">Ничего не найдено. Измените фильтры или <a href="#" data-action="new-request">создайте заявку</a>.</div></div>`}`;
  }

  const sortTh = (key, label, cls = "", attrs = "") => {
    const f = ui.req;
    return `<th class="sortable ${cls}" data-sort="${key}" ${attrs}>${label}${f.sort === key ? `<span class="arrow">${f.dir > 0 ? "↑" : "↓"}</span>` : ""}</th>`;
  };
  const sumBy = (list, fn) => list.reduce((s, r) => s + fn(r), 0);

  // компактный список
  function reqList(list) {
    const th = sortTh, sum = (fn) => sumBy(list, fn);
    return `
      <div class="card">
        <div class="table-wrap">
        <table class="t">
          <thead><tr>
            ${th("no", "№")}${th("customer", "Заказчик / группа")}${th("from", "Даты")}<th>Маршрут</th>${th("pax", "Тур.", "r")}<th>Транспорт</th><th>Сопровождающий</th>${th("total", "Сумма", "r")}<th>Оплата</th><th>Статус</th>
          </tr></thead>
          <tbody>
          ${list.map((r) => {
            const st = reqStatus(r), ps = payStatus(r), paid = paidOf(r), e = parseEscort(r.escort);
            return `<tr class="clickable ${st === "cancelled" ? "cancelled" : ""}" data-open-request="${r.id}">
              <td class="num muted">${r.no}</td>
              <td><div class="cell-main">${esc(r.customer)}</div><div class="cell-sub">${esc([r.group, r.country].filter(Boolean).join(" · ") || "—")}</div></td>
              <td class="nowrap"><div class="${st === "cancelled" ? "strike" : ""}">${fmtRange(r.from, r.to)}</div><div class="cell-sub">${reqDays(r)} ${plural(reqDays(r), "день", "дня", "дней")}</div></td>
              <td><div class="route-line" title="${esc(routeSummary(r.days))}">${esc(routeSummary(r.days) || "—")}</div></td>
              <td class="r num">${r.pax || "—"}</td>
              <td class="nowrap">${esc(r.transport || "—")}</td>
              <td>${e ? `<div>${esc(e.name)}</div>${e.phone ? `<div class="cell-sub num nowrap">${e.phone}</div>` : ""}` : '<span class="muted">—</span>'}</td>
              <td class="r num nowrap" style="font-weight:600">${fmtUsd(r.total || 0)}</td>
              <td>${ps === "none" ? '<span class="muted">—</span>' : `<span class="badge ${ps}">${PAY[ps]}</span>${ps === "partial" ? `<div class="pay-bar" style="margin-top:5px"><i style="width:${Math.min(100, (paid / r.total) * 100)}%"></i></div>` : ""}`}</td>
              <td><span class="badge ${st}">${STATUS[st]}</span></td>
            </tr>`;
          }).join("")}
          </tbody>
          <tfoot><tr><td colspan="4">Итого: ${list.length} ${plural(list.length, "заявка", "заявки", "заявок")}</td><td class="r num">${fmtNum(sum((r) => r.pax || 0))}</td><td colspan="2"></td><td class="r num nowrap">${fmtUsd(sum((r) => r.total || 0))}</td><td colspan="2" class="num nowrap">оплачено ${fmtUsd(sum(paidOf))}</td></tr></tfoot>
        </table></div>
      </div>`;
  }

  // как лист «Заявки» в Excel: слева данные заявки, справа программа маршрута по дням
  function reqSheet(list) {
    const th = sortTh, sum = (fn) => sumBy(list, fn);
    const span = (r) => Math.max(reqDays(r), ...r.days.map((d) => d.n || 0));
    const n = Math.max(1, ...list.map(span));

    const dayCell = (r, i) => {
      const x = r.days.find((d) => d.n === i + 1);
      const inside = r.from && i < reqDays(r);
      if (!x && !inside) return `<td class="dc nd"></td>`;
      const date = (x && x.d) || addDays(r.from, i);
      const tip = [fmtDateLong(date), x && x.route ? expandRoute(x.route) : "маршрут не указан",
        x && x.svc.length ? svcText(x.svc) : "", x && x.cost ? fmtUsd(x.cost) : ""].filter(Boolean).join("\n");
      const tn = tint(x);
      return `<td class="dc ${r.cancelled ? "" : "ed"} ${tn.cls} ${date === TODAY ? "today" : ""}" ${tn.style} data-day="${date}" title="${esc(tip)}"><div class="in">
        <div class="dd">${fmtDate(date)}, ${date === TODAY ? "сегодня" : dow(date)}</div>
        ${x && x.route ? `<div class="dr">${esc(x.route)}</div>` : ""}
        ${x ? x.svc.map((s) => `<div class="sv ${s.s ? svcInfo(s.s).kind : ""}">${s.t ? `<span class="tm">${esc(s.t)}</span>` : ""}${esc(s.s || "")}</div>`).join("") : ""}
        ${x && x.cost ? `<div class="dm">${fmtUsd(x.cost)}</div>` : ""}
      </div></td>`;
    };

    return `
      <div class="card">
        <div class="sheet-wrap" data-keep-scroll="sheet">
        <table class="sheet">
          <thead>
            <tr>
              ${th("no", "№", "sk sk1", 'rowspan="2"')}${th("customer", "Заказчик", "sk sk2", 'rowspan="2"')}
              <th rowspan="2">Транспорт</th>${th("pax", "Кол-во<br>турис.", "", 'rowspan="2"')}<th colspan="2">Даты</th>
              <th rowspan="2">Гр. / Страна</th><th rowspan="2">№ группы</th><th rowspan="2" class="sep">Сопр.</th>
              <th colspan="${n}" class="prog sep"><span>Программа маршрута</span></th>
              ${th("total", "Итого", "", 'rowspan="2"')}<th rowspan="2">Оплата</th>
            </tr>
            <tr class="h2">
              ${th("from", "с")}<th>по</th>
              ${Array.from({ length: n }, (_, i) => `<th class="${i === n - 1 ? "sep" : ""}">День ${i + 1}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
          ${list.map((r) => {
            const st = reqStatus(r), ps = payStatus(r), paid = paidOf(r), e = parseEscort(r.escort);
            return `<tr class="clickable ${st === "cancelled" ? "cancelled" : ""}" data-open-request="${r.id}" data-cell="req" data-id="${r.id}">
              <td class="sk sk1 num">${r.no}</td>
              <td class="sk sk2"><div class="cust">${esc(r.customer)}</div><span class="badge ${st}">${STATUS[st]}</span></td>
              <td class="c">${esc(r.transport || "—")}</td>
              <td class="c num">${r.pax || "—"}</td>
              <td class="c num nowrap">${fmtDate(r.from)}</td>
              <td class="c num nowrap">${fmtDate(r.to)}</td>
              <td class="c">${esc(r.country || "—")}</td>
              <td class="c nowrap">${esc(r.group || "—")}</td>
              <td class="sep esc-cell">${e ? `<div>${esc(e.name)}</div>${e.phone ? `<div class="sub num nowrap">${e.phone}</div>` : ""}` : '<span class="muted">—</span>'}</td>
              ${Array.from({ length: n }, (_, i) => dayCell(r, i)).join("")}
              <td class="r num nowrap tot">${fmtUsd(r.total || 0)}</td>
              <td>${ps === "none" ? '<span class="muted">—</span>' : `<span class="badge ${ps}">${PAY[ps]}</span>${ps === "partial" ? `<div class="pay-bar" style="margin-top:5px"><i style="width:${Math.min(100, (paid / r.total) * 100)}%"></i></div>` : ""}`}</td>
            </tr>`;
          }).join("")}
          </tbody>
          <tfoot><tr>
            <td colspan="2" class="sk">Итого: ${list.length} ${plural(list.length, "заявка", "заявки", "заявок")}</td>
            <td></td><td class="c num">${fmtNum(sum((r) => r.pax || 0))}</td>
            <td colspan="${5 + n}"></td>
            <td class="r num nowrap">${fmtUsd(sum((r) => r.total || 0))}</td>
            <td class="num nowrap">оплачено ${fmtUsd(sum(paidOf))}</td>
          </tr></tfoot>
        </table></div>
      </div>`;
  }

  /* ---------- Карточка заявки ---------- */
  function drawerRequest(r) {
    const st = reqStatus(r), ps = payStatus(r), paid = paidOf(r), due = dueOf(r), e = parseEscort(r.escort);
    const dueUzs = toUzs(Math.max(0, due), r.rate, r.vat);
    return `
      <div class="drawer-h">
        <div style="min-width:0">
          <h3>${rdot(r)}Заявка №${r.no}</h3>
          <div class="sub">${esc(r.customer)}${r.group ? " · " + esc(r.group) : ""}</div>
          <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap"><span class="badge ${st}">${STATUS[st]}</span>${ps !== "none" ? `<span class="badge ${ps}">${PAY[ps]}</span>` : ""}</div>
        </div>
        <div class="actions">
          <button class="btn sm" data-action="edit-request" data-id="${r.id}">${icon("edit")}Изменить</button>
          <button class="btn sm" data-action="print-program" data-id="${r.id}">${icon("printer")}Программа</button>
          ${r.cancelled
            ? `<button class="btn sm" data-action="restore-request" data-id="${r.id}">${icon("restore")}Восстановить</button>`
            : `<button class="btn sm danger" data-action="cancel-request" data-id="${r.id}">${icon("ban")}Аннулировать</button>`}
          <button class="btn icon sm ghost" data-action="close-drawer" aria-label="Закрыть">${icon("x")}</button>
        </div>
      </div>
      <div class="drawer-b">
        <div class="section-t">Информация</div>
        <div class="info-grid">
          ${info("Заказчик", `<a href="#" data-open-client="${esc(r.customer)}">${esc(r.customer)}</a>`)}
          ${info("№ группы", esc(r.group || "—"))}
          ${info("Страна / группа", esc(r.country || "—"))}
          ${info("Даты", `${fmtRange(r.from, r.to)} ${r.to ? parseISO(r.to).getFullYear() : ""} · ${reqDays(r)} ${plural(reqDays(r), "день", "дня", "дней")}`)}
          ${info("Туристов", r.pax || "—")}
          ${info("Транспорт", esc(r.transport ? (/^\d/.test(r.transport) ? r.transport + " мест" : r.transport) : "—"))}
          ${info("Сопровождающий", e ? `${esc(e.name)}${e.phone ? `<br><a class="num" href="tel:${e.tel}">${e.phone}</a>` : ""}` : "—")}
          ${info("Курс / НДС", `${fmtNum(r.rate)} сум · ${r.vat}%`)}
          ${info("Маршрут", esc(routeSummary(r.days) || "—"))}
        </div>
        ${r.cancelled ? "" : `<div class="section-t">Цвет в графике</div>${huePick("req-hue", r.id, r.hue)}`}

        <div class="section-t">Программа по дням</div>
        ${r.days.length ? `<div class="days">${r.days.map((d) => `
          <div class="day ${d.d === TODAY ? "is-today" : ""}">
            <div><div class="dn">День ${d.n}</div><div class="dd">${d.d ? `${dow(d.d)}, ${fmtDate(d.d)}` : ""}</div></div>
            <div>
              <div class="route" title="${esc(expandRoute(d.route))}">${esc(d.route || "—")}${d.d === TODAY ? '<span class="badge active plain">сегодня</span>' : ""}</div>
              ${svcChips(d.svc) || '<span class="small muted">без трансферов</span>'}
            </div>
            <div class="cost num">${d.cost ? fmtUsd(d.cost) : '<span class="muted">—</span>'}</div>
          </div>`).join("")}</div>` : `<div class="empty">Программа не заполнена</div>`}

        <div class="section-t">Взаиморасчёты</div>
        <div class="money">
          <div><div class="k">Стоимость услуг</div><div class="v num">${fmtUsd(r.total || 0)}</div></div>
          <div><div class="k">Оплачено</div><div class="v num ok">${fmtUsd(paid)}</div></div>
          <div><div class="k">${due < -1 ? "Переплата" : "Остаток"}</div><div class="v num ${due > 1 ? "neg" : ""}">${fmtUsd(Math.abs(due))}</div></div>
        </div>
        ${due > 1 ? `<div class="note-box">При оплате перечислением: <b class="num">${fmtUzs(dueUzs)}</b> (курс ${fmtNum(r.rate)}, НДС ${r.vat}%)</div>` : ""}
        <div class="pay-list">
          ${(r.payments || []).map((p, i) => `<div class="pay-item">
            <span class="chip ${p.method === "transfer" ? "air" : "exc"}">${p.method === "transfer" ? "Перечисление" : "Наличные"}</span>
            <div style="min-width:0"><div>${esc(p.note || "")}</div><div class="small muted">${p.date ? fmtDateLong(p.date) : "дата не указана"}${p.uzs ? ` · ${fmtUzs(p.uzs)}` : ""}</div></div>
            <div class="amt num">${fmtUsd(p.usd)}</div>
            <button class="btn icon sm ghost" data-action="del-payment" data-id="${r.id}" data-i="${i}" aria-label="Удалить оплату">${icon("trash")}</button>
          </div>`).join("")}
        </div>
        <form class="pay-form" data-form="payment" data-id="${r.id}">
          <div class="field"><label>Способ</label><select class="input" name="method"><option value="cash">Наличные, USD</option><option value="transfer">Перечисление, сум</option></select></div>
          <div class="field"><label>Сумма</label><input class="input num" name="amount" type="number" min="0" step="any" placeholder="${due > 0 ? Math.round(due) : 0}" required></div>
          <div class="field"><label>Дата</label><input class="input" name="date" type="date" value="${TODAY}"></div>
          <div class="field"><label>Комментарий</label><input class="input" name="note" placeholder="напр. приложение №12"></div>
          <button class="btn primary" type="submit">${icon("plus")}Оплата</button>
        </form>

        <div class="section-t">История</div>
        <div class="log">${(r.log || []).slice().reverse().map((l) => `<div class="log-item"><span class="ts num">${esc(l.ts)}</span><span>${esc(l.text)}</span></div>`).join("")}</div>
      </div>`;
  }
  const info = (k, v) => `<div><div class="k">${k}</div><div class="v">${v}</div></div>`;

  /* ---------- Форма заявки ---------- */
  function openRequestForm(id, preset = {}) {
    const r = id ? reqById(id) : null;
    const src = r ? structuredClone(r) : {
      customer: preset.customer || "", group: "", country: "", pax: "", transport: "", escort: "",
      from: addDays(TODAY, 7), to: addDays(TODAY, 13), rate: db.settings.rate, vat: db.settings.vat, days: [],
    };
    modal = { type: "request-form", id, days: daySlots(src).map((d) => ({ route: d.route || "", svc: svcToText(d.svc), cost: d.cost || "", color: d.color })) };
    const customersList = [...new Set(db.requests.map((x) => x.customer))].sort((a, b) => a.localeCompare(b, "ru"));
    const routes = knownRoutes();
    const f = (name, label, value, attrs = "", cls = "") => `<div class="field ${cls}"><label>${label}</label><input class="input" name="${name}" value="${esc(value ?? "")}" ${attrs}></div>`;
    showModal(`
      <form class="modal" data-form="request" novalidate>
        <div class="modal-h"><h3>${r ? `Редактирование заявки №${r.no}` : "Новая заявка"}</h3><div class="spacer" style="flex:1"></div>
          <button class="btn icon sm ghost" type="button" data-action="close-modal" aria-label="Закрыть">${icon("x")}</button></div>
        <div class="modal-b">
          <div class="form-grid">
            ${f("customer", "Заказчик *", src.customer, 'list="dl-customers" required autocomplete="off"', "span2")}
            ${f("group", "№ группы", src.group)}
            ${f("country", "Страна", src.country)}
            ${f("pax", "Туристов", src.pax, 'type="number" min="0"')}
            ${f("transport", "Транспорт", src.transport, 'list="dl-transport" autocomplete="off"')}
            ${f("escort", "Сопровождающий (имя и телефон)", src.escort, 'placeholder="Шохрух 913174732"', "span2")}
            ${f("from", "Дата заезда *", src.from, 'type="date" required')}
            ${f("to", "Дата выезда *", src.to, 'type="date" required')}
            ${f("rate", "Курс USD, сум", src.rate, 'type="number" min="0"')}
            ${f("vat", "НДС, %", src.vat, 'type="number" min="0" step="any"')}
          </div>
          <div class="field" style="margin-top:6px"><span class="err" id="form-err"></span></div>
          <div class="section-t" style="margin-top:18px">Программа по дням</div>
          <div class="small muted" style="margin-bottom:4px">Маршрут: «Таш-Сам», «Бух». Услуги через запятую: «07:40 вс аэ, экя, ужин».</div>
          <div class="table-wrap"><table class="days-edit"><thead><tr><th>День</th><th>Маршрут</th><th>Услуги</th><th style="text-align:right">Стоимость, $</th></tr></thead><tbody id="days-body"></tbody></table></div>
        </div>
        <div class="modal-f">
          <div class="form-total num" id="form-total"></div>
          <button class="btn" type="button" data-action="close-modal">Отмена</button>
          <button class="btn primary" type="submit">${r ? "Сохранить" : "Создать заявку"}</button>
        </div>
        <datalist id="dl-customers">${customersList.map((c) => `<option value="${esc(c)}">`).join("")}</datalist>
        <datalist id="dl-transport">${TRANSPORT_TYPES.map((c) => `<option value="${esc(c)}">`).join("")}</datalist>
        <datalist id="dl-routes">${routes.map((c) => `<option value="${esc(c)}">`).join("")}</datalist>
      </form>`);
    renderFormDays();
  }
  // строки формы по дням тура: по дате, если она внутри тура, иначе по номеру дня (в программе бывают пустые дни)
  function daySlots(r) {
    const slots = [];
    for (const d of r.days) {
      let i = d.d && r.from && d.d >= r.from ? diffDays(r.from, d.d) : d.n - 1;
      while (slots[i]) i++;
      slots[i] = d;
    }
    return Array.from(slots, (d) => d || {});
  }
  const knownRoutes = () => [...new Set([...db.requests.flatMap((x) => x.days), ...db.vehicles.flatMap((v) => v.schedule)]
    .map((d) => d.route).filter(Boolean))].slice(0, 300);
  const svcToText = (svc) => (svc || []).map((s) => [s.t, s.s].filter(Boolean).join(" ")).join(", ");
  function textToSvc(text) {
    return String(text || "").split(",").map((x) => x.trim()).filter(Boolean).map((x) => {
      const m = x.match(/^(\d{1,2}[:.]\d{2})\s*(.*)$/);
      return m ? { t: m[1].replace(".", ":").padStart(5, "0"), s: m[2] || null } : { t: null, s: x };
    });
  }
  const MAX_TOUR_DAYS = 366; // защита от опечатки в годе, а не ограничение длины тура
  function formDates() {
    const el = $("form[data-form=request]").elements;
    return { from: el.from.value, to: el.to.value };
  }
  function syncFormDays() {
    $$("#days-body tr").forEach((tr, i) => {
      // строка-подсказка «укажите даты» без полей — пропускаем
      if (!modal.days[i] || !$("[name=route]", tr)) return;
      modal.days[i].route = $("[name=route]", tr).value;
      modal.days[i].svc = $("[name=svc]", tr).value;
      modal.days[i].cost = $("[name=cost]", tr).value;
    });
  }
  function renderFormDays() {
    const { from, to } = formDates();
    const body = $("#days-body");
    if (!from || !to || to < from || diffDays(from, to) > MAX_TOUR_DAYS - 1) {
      body.innerHTML = `<tr><td colspan="4" class="muted small" style="padding:14px 6px">Укажите даты заезда и выезда, чтобы заполнить программу.</td></tr>`;
      updateFormTotal();
      return;
    }
    const n = diffDays(from, to) + 1;
    while (modal.days.length < n) modal.days.push({ route: "", svc: "", cost: "" });
    body.innerHTML = Array.from({ length: n }, (_, i) => {
      const d = addDays(from, i), x = modal.days[i];
      return `<tr><td class="dlabel">День ${i + 1}<br><span class="muted">${dow(d)}, ${fmtDate(d)}</span></td>
        <td><input class="input" name="route" list="dl-routes" value="${esc(x.route)}" placeholder="Таш-Сам"></td>
        <td><input class="input" name="svc" value="${esc(x.svc)}" ${i === 0 ? 'placeholder="07:40 вс аэ, экя"' : ""}></td>
        <td><input class="input cost-in num" name="cost" type="number" min="0" step="any" value="${esc(x.cost)}"></td></tr>`;
    }).join("");
    updateFormTotal();
  }
  function updateFormTotal() {
    const total = $$("#days-body [name=cost]").reduce((s, i) => s + (+i.value || 0), 0);
    $("#form-total").textContent = `Итого: ${fmtUsd(total)}`;
  }
  function submitRequestForm(form) {
    syncFormDays();
    const el = form.elements;
    const v = (n) => el[n].value.trim();
    const err = $("#form-err");
    $$(".input.invalid", form).forEach((i) => i.classList.remove("invalid"));
    const bad = (name, msg) => { el[name].classList.add("invalid"); el[name].focus(); err.textContent = msg; };
    if (!v("customer")) return bad("customer", "Укажите заказчика");
    if (!v("from")) return bad("from", "Укажите дату заезда");
    if (!v("to") || v("to") < v("from")) return bad("to", "Дата выезда не может быть раньше заезда");
    if (diffDays(v("from"), v("to")) > MAX_TOUR_DAYS - 1) return bad("to", "Проверьте год: тур получается длиннее года");
    const n = diffDays(v("from"), v("to")) + 1;
    const days = modal.days.slice(0, n).map((x, i) => ({
      n: i + 1, d: addDays(v("from"), i), route: x.route.trim() || null, svc: textToSvc(x.svc), cost: +x.cost || 0,
      ...(x.color != null && { color: x.color }),
    })).filter((d) => d.route || d.svc.length || d.cost || d.color != null);
    const fields = {
      customer: v("customer"), group: v("group") || null, country: v("country") || null, pax: +v("pax") || null,
      transport: v("transport") || null, escort: v("escort") || null, from: v("from"), to: v("to"),
      rate: +v("rate") || db.settings.rate, vat: v("vat") === "" ? db.settings.vat : +v("vat"),
      days, total: days.reduce((s, d) => s + d.cost, 0),
    };
    let r;
    if (modal.id) {
      r = reqById(modal.id);
      const labels = { customer: "заказчик", group: "№ группы", country: "страна", pax: "туристы", transport: "транспорт", escort: "сопровождающий", from: "даты", to: "даты", rate: "курс", vat: "НДС" };
      const changed = new Set(Object.keys(labels).filter((k) => String(r[k] ?? "") !== String(fields[k] ?? "")).map((k) => labels[k]));
      if (JSON.stringify(r.days) !== JSON.stringify(days)) changed.add("программа");
      Object.assign(r, fields);
      r.log.push({ ts: nowStamp(), text: changed.size ? `Изменено: ${[...changed].join(", ")}` : "Сохранено без изменений" });
      toast("Заявка сохранена");
    } else {
      r = { id: "N" + Date.now(), no: db.seq++, hue: freshHue(fields.from, fields.to), cancelled: false, payments: [], log: [{ ts: nowStamp(), text: "Заявка создана" }], ...fields };
      db.requests.push(r);
      toast(`Заявка №${r.no} создана`);
    }
    closeModal();
    drawer = { type: "request", id: r.id };
    rerender();
  }

  /* ---------- Клетка графика: один день заявки или машины ---------- */
  const cellOwner = (kind, id) => (kind === "req" ? reqById(id) : vehById(id));
  const cellList = (kind, x) => (kind === "req" ? x.days : x.schedule);
  function openCellEditor(kind, id, d) {
    const x = cellOwner(kind, id);
    if (!x || !d) return;
    const day = cellList(kind, x).find((y) => y.d === d) || {};
    // день заявки листается только в её датах, у машины — без ограничений
    const lo = kind === "req" ? x.from : null, hi = kind === "req" ? x.to || x.from : null;
    const step = (n, label, ic, off) => `<button class="btn icon sm ghost" type="button" data-action="cell-step" data-step="${n}" aria-label="${label}" title="${label}" ${off ? "disabled" : ""}>${icon(ic)}</button>`;
    const sw = (c, label) => `<button type="button" class="vc ${c === "gray" ? "gray" : ""} ${day.color === c ? "on" : ""}" ${c === "gray" ? "" : `style="--vh:${c}"`}
      data-action="cell-color" data-c="${c}" aria-label="${label}" title="${label}"></button>`;
    modal = { type: "cell", kind, id, d };
    showModal(`
      <form class="modal sm" data-form="cell" novalidate style="width:min(540px,100%)">
        <div class="modal-h">
          <div style="min-width:0">
            <h3 class="nowrap" style="overflow:hidden;text-overflow:ellipsis">${kind === "req" ? `${rdot(x)}№${x.no} · ${esc(x.customer)}` : `${vdot(x)}${esc(vehTitle(x))}`}</h3>
            <div class="small muted" style="margin-top:3px">${DOW_LONG[parseISO(d).getDay()]}, ${fmtDateLong(d)}${kind === "req" ? ` · день ${diffDays(x.from, d) + 1} из ${reqDays(x)}` : ""}</div>
          </div>
          <div class="spacer" style="flex:1"></div>
          ${step(-1, "Предыдущий день", "chevronLeft", lo && d <= lo)}${step(1, "Следующий день", "chevron", hi && d >= hi)}
          <button class="btn icon sm ghost" type="button" data-action="close-modal" aria-label="Закрыть">${icon("x")}</button>
        </div>
        <div class="modal-b">
          <div class="form-grid" style="grid-template-columns:minmax(0,1fr) 120px">
            <div class="field"><label>Маршрут</label><input class="input" name="route" list="dl-routes" autocomplete="off" value="${esc(day.route || "")}" placeholder="Бух-Сам"></div>
            <div class="field"><label>Стоимость, $</label><input class="input num" name="cost" type="number" min="0" step="any" value="${day.cost || ""}"></div>
            <div class="field span4"><label>Услуги</label><input class="input" name="svc" autocomplete="off" value="${esc(svcToText(day.svc))}" placeholder="07:40 вс аэ, экя, ужин"></div>
            <div class="field span4"><label>Цвет клетки</label>
              <div class="hue-pick cell-colors">
                <button type="button" class="auto vc ${kind === "veh" && x.partner ? "gray" : ""} ${day.color == null ? "on" : ""}" style="--vh:${x.hue}" data-action="cell-color" data-c=""><span class="vdot"></span>${kind === "req" ? "Как у заявки" : "Как у машины"}</button>
                ${HUES.map((h) => sw(h, "Свой цвет")).join("")}${sw("gray", "Серый")}
              </div>
              <input type="hidden" name="color" value="${day.color ?? ""}">
            </div>
          </div>
          <p class="small muted" style="margin:10px 0 0">Услуги через запятую, время — в начале. Стрелки вверху сохраняют день и переходят к соседнему.</p>
        </div>
        <div class="modal-f">
          <button class="btn ghost" type="button" data-action="cell-open" style="margin-right:auto">${kind === "req" ? "Карточка заявки" : "Карточка машины"}</button>
          ${day.d ? `<button class="btn danger" type="button" data-action="cell-clear">${icon("trash")}Очистить</button>` : ""}
          <button class="btn" type="button" data-action="close-modal">Отмена</button>
          <button class="btn primary" type="submit">Сохранить</button>
        </div>
        <datalist id="dl-routes">${knownRoutes().map((c) => `<option value="${esc(c)}">`).join("")}</datalist>
      </form>`);
    setTimeout(() => { const i = $("#modal-layer [name=route]"); if (i) i.select(); }, 40);
  }
  function saveCell(form) {
    const { kind, id, d } = modal, x = cellOwner(kind, id), list = cellList(kind, x), el = form.elements;
    const val = { route: el.route.value.trim() || null, svc: textToSvc(el.svc.value), cost: +el.cost.value || 0 };
    const c = el.color.value, color = c === "" ? null : c === "gray" ? "gray" : +c;
    const i = list.findIndex((y) => y.d === d), old = list[i];
    const oldColor = (old && old.color) ?? null;
    const empty = !val.route && !val.svc.length && !val.cost && color == null;
    if (old ? JSON.stringify([old.route, old.svc, old.cost || 0, oldColor]) === JSON.stringify([val.route, val.svc, val.cost, color]) : empty) return;
    if (empty) list.splice(i, 1);
    else {
      let day = old;
      if (!day) {
        day = kind === "req" ? { n: diffDays(x.from, d) + 1, d } : { d };
        list.push(day);
        list.sort((p, q) => p.d.localeCompare(q.d));
      }
      Object.assign(day, val);
      if (color == null) delete day.color; else day.color = color;
    }
    if (kind === "req") x.total = x.days.reduce((s, y) => s + (y.cost || 0), 0);
    const recolor = oldColor !== color ? (color == null ? "цвет по умолчанию" : "свой цвет") : "";
    (x.log || (x.log = [])).push({ ts: nowStamp(), text: empty ? `Очищен день ${fmtDate(d)}`
      : `Изменён день ${fmtDate(d)}: ${[val.route, svcToText(val.svc), val.cost && fmtUsd(val.cost), recolor].filter(Boolean).join(" · ")}` });
    toast("Сохранено");
    rerender();
  }

  /* ---------- Форма машины ---------- */
  function openVehicleForm(id) {
    const v = id ? vehById(id) : null;
    const src = v || { partner: false, brand: "", plate: "", driver: "", seats: "" };
    const brands = [...new Set(db.vehicles.filter((x) => !x.partner).map((x) => x.brand))];
    const seats = [...new Set([...db.vehicles.map((x) => x.seats).filter(Boolean), ...TRANSPORT_TYPES])];
    const f = (name, label, value, attrs = "") => `<div class="field"><label>${label}</label><input class="input" name="${name}" value="${esc(value ?? "")}" autocomplete="off" ${attrs}></div>`;
    modal = { type: "vehicle-form", id };
    showModal(`
      <form class="modal sm" data-form="vehicle" novalidate>
        <div class="modal-h"><h3>${v ? "Изменить транспорт" : "Добавить авто"}</h3><div class="spacer" style="flex:1"></div>
          <button class="btn icon sm ghost" type="button" data-action="close-modal" aria-label="Закрыть">${icon("x")}</button></div>
        <div class="modal-b">
          <div class="form-grid" style="grid-template-columns:1fr 1fr">
            <div class="field span4"><label>Чей транспорт</label><select class="input" name="partner">
              <option value="" ${src.partner ? "" : "selected"}>Свой автопарк</option>
              <option value="1" ${src.partner ? "selected" : ""}>Частный перевозчик</option></select></div>
            ${f("brand", "Марка", src.partner ? "" : src.brand, 'list="dl-brands" placeholder="ASIASTAR"')}
            ${f("plate", "Госномер", src.plate, 'placeholder="30 577 ABA"')}
            ${f("driver", "Водитель / перевозчик", src.driver || (src.partner ? src.name : ""), 'placeholder="Озод"')}
            ${f("seats", "Мест / тип", src.seats, 'list="dl-seats" placeholder="55+2"')}
          </div>
          <div class="field" style="margin-top:6px"><span class="err" id="form-err"></span></div>
        </div>
        <div class="modal-f">
          ${v && !v.schedule.length && !(v.payments || []).length ? `<button class="btn danger" type="button" data-action="del-vehicle" data-id="${v.id}" style="margin-right:auto">${icon("trash")}Удалить</button>` : ""}
          <button class="btn" type="button" data-action="close-modal">Отмена</button>
          <button class="btn primary" type="submit">${v ? "Сохранить" : "Добавить"}</button>
        </div>
        <datalist id="dl-brands">${brands.map((c) => `<option value="${esc(c)}">`).join("")}</datalist>
        <datalist id="dl-seats">${seats.map((c) => `<option value="${esc(c)}">`).join("")}</datalist>
      </form>`);
  }
  function submitVehicleForm(form) {
    const el = form.elements, v = (n) => el[n].value.trim(), err = $("#form-err");
    $$(".input.invalid", form).forEach((i) => i.classList.remove("invalid"));
    const bad = (name, msg) => { el[name].classList.add("invalid"); el[name].focus(); err.textContent = msg; };
    const partner = el.partner.value === "1";
    if (!partner && !v("brand")) return bad("brand", "Укажите марку");
    if (partner && !v("driver")) return bad("driver", "Укажите имя перевозчика");
    const brand = partner ? "Партнёр"
      : db.vehicles.filter((x) => !x.partner).map((x) => x.brand).find((b) => b.toLowerCase() === v("brand").toLowerCase()) || v("brand");
    const fields = { partner, brand, plate: v("plate") || null, driver: v("driver") || null, seats: v("seats") || null };
    const name = (partner ? [fields.driver, fields.seats] : [brand, fields.seats, fields.plate, fields.driver]).filter(Boolean).join(" ");
    let x = modal.id && vehById(modal.id);
    if (x) {
      // название из Excel не трогаем, пока данные машины не изменились
      if (Object.keys(fields).some((k) => String(x[k] ?? "") !== String(fields[k] ?? ""))) {
        Object.assign(x, fields, { name });
        (x.log || (x.log = [])).push({ ts: nowStamp(), text: "Изменены данные машины" });
      }
      toast("Сохранено");
    } else {
      // свои машины — после последней своей, частные — в конец списка
      const at = partner ? db.vehicles.length : db.vehicles.findLastIndex((y) => !y.partner) + 1;
      x = { id: "V" + Date.now(), no: Math.max(0, ...db.vehicles.map((y) => y.no)) + 1, name, ...fields, sold: false, hue: autoHue(at),
        schedule: [], payments: [], log: [{ ts: nowStamp(), text: "Добавлен в транспорт" }] };
      db.vehicles.splice(at, 0, x);
      toast(`Добавлено: ${vehTitle(x)}`);
    }
    closeModal();
    drawer = { type: "vehicle", id: x.id };
    rerender();
  }

  /* ================= Ленты по дням (график заявок и транспорта) ================= */
  // лента не делится на месяцы: минимум июль–декабрь, а если есть даты раньше или позже — расширяется под них
  const PERIOD_START = `${YEAR}-${pad(PERIOD_MONTHS[0])}-01`;
  const PERIOD_END = `${YEAR}-${pad(PERIOD_MONTHS[PERIOD_MONTHS.length - 1])}-${pad(daysInMonth(PERIOD_MONTHS[PERIOD_MONTHS.length - 1]))}`;
  const ribbons = {}; // ключ ленты -> диапазон, нарисованный последним

  function ribbonRange(ds) {
    let a = PERIOD_START, b = PERIOD_END;
    for (const d of ds) {
      if (!d) continue;
      if (d < a) a = d;
      if (d > b) b = d;
    }
    const months = [];
    let y = +a.slice(0, 4), m = +a.slice(5, 7);
    const ey = +b.slice(0, 4), em = +b.slice(5, 7);
    while (y < ey || (y === ey && m <= em)) {
      months.push({ ym: `${y}-${pad(m)}`, y, m, dim: new Date(y, m, 0).getDate() });
      if (++m > 12) { m = 1; y++; }
    }
    const last = months[months.length - 1];
    const start = `${months[0].ym}-01`, end = `${last.ym}-${pad(last.dim)}`;
    const dates = Array.from({ length: diffDays(start, end) + 1 }, (_, i) => addDays(start, i));
    // классы колонок: сегодня и последний день месяца (граница между месяцами)
    const colCls = dates.map((d, i) => [d === TODAY ? "today" : "", i < dates.length - 1 && dates[i + 1].endsWith("-01") ? "me" : ""].join(" ").trim());
    return { start, end, months, dates, colCls };
  }
  function rangeTitle(rg) {
    const f = rg.months[0], l = rg.months[rg.months.length - 1];
    return f.y === l.y ? `${MONTHS[f.m - 1]} – ${MONTHS[l.m - 1].toLowerCase()} ${f.y}` : `${MONTHS[f.m - 1]} ${f.y} – ${MONTHS[l.m - 1].toLowerCase()} ${l.y}`;
  }
  const dayCell = (route, svc) => `${route ? `<b>${esc(route)}</b>` : ""}${(svc || []).map((x) =>
    `<span class="sl">${x.t ? `<i>${esc(x.t)}</i>` : ""}${esc(x.s || "")}</span>`).join("")}`;
  // ширины колонок заданы заранее (table-layout: fixed), чтобы не зависели от текста и загрузки шрифта
  function ribbonHead(rg, label) {
    return `<colgroup><col class="c-rowh">${'<col class="c-day">'.repeat(rg.dates.length)}</colgroup>
    <thead>
      <tr class="mrow"><th class="rowh" rowspan="2">${label}</th>${rg.months.map((x) => `<th class="mth" colspan="${x.dim}" data-month="${x.ym}"><span>${MONTHS[x.m - 1]} ${x.y}</span></th>`).join("")}</tr>
      <tr class="drow">${rg.dates.map((d, i) => {
        const wd = parseISO(d).getDay();
        return `<th class="${wd === 0 || wd === 6 ? "we" : ""} ${rg.colCls[i]}" data-d="${d}">${+d.slice(8)}<span class="dow">${DOW[wd]}</span></th>`;
      }).join("")}</tr>
    </thead>`;
  }
  // кнопки месяцев только прокручивают ленту
  function ribbonNav(key, rg) {
    return `<div class="seg">${rg.months.map((x) => `<button data-action="rb-jump" data-key="${key}" data-ym="${x.ym}">${MONTHS[x.m - 1]}${x.y !== YEAR ? ` ${x.y}` : ""}</button>`).join("")}</div>
      ${TODAY >= rg.start && TODAY <= rg.end ? `<button class="btn" data-action="rb-today" data-key="${key}">${icon("calendar")}Сегодня</button>` : ""}`;
  }

  const rbWrap = (key) => $(`[data-keep-scroll="${key}"]`);
  // позиция ячейки внутри таблицы (offsetLeft у sticky-ячеек считается от страницы, поэтому через getBoundingClientRect)
  const xInTable = (el, w) => el.getBoundingClientRect().left - $("table", w).getBoundingClientRect().left;
  // прокрутить ленту к дате; в графике заявок ещё и вниз — к первой группе, которая в этот день ещё в пути
  function ribbonScrollTo(key, d, smooth) {
    const w = rbWrap(key), th = w && $(`th[data-d="${d}"]`, w);
    if (!th) return;
    const opts = { left: xInTable(th, w) - $("thead .rowh", w).offsetWidth, behavior: smooth ? "smooth" : "auto" };
    const rows = $$("tbody tr[data-to]", w);
    if (rows.length) {
      const tr = rows.find((x) => x.dataset.to >= d);
      opts.top = tr ? tr.offsetTop - $("thead", w).offsetHeight : 0;
    }
    w.scrollTo(opts);
  }
  function ribbonTodayAnchor(key) {
    const rg = ribbons[key], d = addDays(TODAY, -2);
    return d < rg.start || TODAY > rg.end ? rg.start : d;
  }
  // подсветить в переключателе месяц, который сейчас у левого края ленты
  function updateRibbonMonth(key) {
    const w = rbWrap(key);
    if (!w || !$("th.mth", w)) return;
    const x = w.scrollLeft + $("thead .rowh", w).offsetWidth + 1;
    let cur = null;
    for (const th of $$("th.mth", w)) if (xInTable(th, w) <= x) cur = th.dataset.month;
    $$(`[data-action=rb-jump][data-key="${key}"]`).forEach((b) => b.classList.toggle("on", b.dataset.ym === cur));
  }

  /* ================= График заявок ================= */
  function viewCalendar() {
    const c = ui.cal;
    const rg = ribbons.cal = ribbonRange(db.requests.flatMap((r) => [r.from, r.to]));
    const names = [...new Set(db.requests.map((r) => r.customer))].sort((a, b) => a.localeCompare(b, "ru"));
    const rows = db.requests
      .filter((r) => r.from)
      .filter((r) => c.cancelled || !r.cancelled)
      .filter((r) => !c.customer || r.customer === c.customer)
      .sort((a, b) => a.from.localeCompare(b.from) || a.no - b.no);
    const pax = rows.filter((r) => !r.cancelled).reduce((s, r) => s + (r.pax || 0), 0);

    return `
      <div class="tl-head">
        ${ribbonNav("cal", rg)}
        <select class="input" style="width:auto" data-cal="customer"><option value="">Все заказчики</option>${names.map((n) => `<option ${n === c.customer ? "selected" : ""}>${esc(n)}</option>`).join("")}</select>
        <label class="small" style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-cal="cancelled" ${c.cancelled ? "checked" : ""}>Аннулированные</label>
      </div>
      <div class="card">
        <div class="card-h wrap">
          <h2>${rangeTitle(rg)}</h2>
          <span class="sub">${rows.length} ${plural(rows.length, "заявка", "заявки", "заявок")} · ${fmtNum(pax)} туристов</span>
          <div class="spacer"></div>
          <div class="legend"><span>У каждой заявки свой цвет</span><span><i class="vc gray" style="background:var(--c-solid)"></i>Переезд между городами</span><span><i class="vc gray" style="background:var(--c-soft);border:1px solid var(--border-strong)"></i>Работа в городе</span><span><i style="background:var(--today);border:1px solid var(--accent)"></i>Сегодня</span><span class="hint">${icon("edit")}Нажмите на клетку, чтобы изменить день или цвет</span></div>
        </div>
        <div class="tl-wrap" data-keep-scroll="cal">
          ${rows.length ? `<table class="tl tl-period" style="--days:${rg.dates.length}">${ribbonHead(rg, "Заявка")}
          <tbody>${rows.map((r) => {
            const byDate = new Map(r.days.map((d) => [d.d, d]));
            const to = r.to || r.from;
            return `<tr class="vc ${r.cancelled ? "gray" : ""}" style="--vh:${r.hue}" data-from="${r.from}" data-to="${to}" data-cell="req" data-id="${r.id}"><td class="rowh" data-open-request="${r.id}"><div class="t1">${rdot(r)}№${r.no} · ${esc(r.customer)}</div><div class="t2">${esc([r.group, r.pax && r.pax + " чел.", r.transport].filter(Boolean).join(" · ") || "—")}</div></td>
              ${rg.dates.map((d, i) => {
                if (d < r.from || d > to) return `<td class="tday ${rg.colCls[i]}"></td>`;
                const x = byDate.get(d);
                const tip = `№${r.no} ${r.customer}\n${fmtDateLong(d)}\n${x && x.route ? expandRoute(x.route) : "маршрут не указан"}${x && x.svc.length ? "\n" + svcText(x.svc) : ""}${x && x.cost ? `\n${fmtUsd(x.cost)}` : ""}${r.cancelled ? "" : "\n\nНажмите, чтобы изменить"}`;
                const moving = x && x.route && x.route.includes("-");
                // аннулированная заявка не редактируется по клеткам — открывается карточка
                const tn = tint(x);
                return `<td class="tday on ${r.cancelled ? "" : "ed"} ${tn.cls} ${rg.colCls[i]}" ${tn.style} ${r.cancelled ? `data-open-request="${r.id}"` : ""} title="${esc(tip)}"><div class="cellbar ${r.cancelled ? "cx" : moving ? "v" : "v l1"} ${d === r.from ? "s" : ""} ${d === to ? "e" : ""}">${dayCell(x && x.route, x && x.svc)}</div></td>`;
              }).join("")}</tr>`;
          }).join("")}</tbody></table>` : `<div class="empty">Заявок не найдено</div>`}
        </div>
      </div>`;
  }

  function calAfter(restored) {
    const w = rbWrap("cal");
    if (!w) return;
    if (!restored.has("cal") || ui.cal.reanchor) {
      const rows = $$("tbody tr", w);
      // у выбранного заказчика нет групп с сегодняшнего дня — показываем начало его первой заявки
      const past = ui.cal.customer && rows.length && !rows.some((x) => x.dataset.to >= TODAY);
      ribbonScrollTo("cal", past ? rows[0].dataset.from : ribbonTodayAnchor("cal"));
      ui.cal.reanchor = false;
    }
    updateRibbonMonth("cal");
  }

  /* ================= Транспорт ================= */
  function viewFleet() {
    const f = ui.fleet, m = f.month, dim = daysInMonth(m);
    const all = db.vehicles;
    const list = all.filter((v) => f.group === "all" || vehGroup(v) === f.group);
    const active = all.filter((v) => !v.sold);
    const onRoute = active.filter((v) => vehOn(v, TODAY));
    const own = active.filter((v) => !v.partner);
    const avg = own.length ? own.reduce((s, v) => s + vehDaysIn(v, m), 0) / (own.length * dim) : 0;
    const totalCost = all.reduce((s, v) => s + vehCost(v), 0);
    const totalDue = all.reduce((s, v) => s + Math.max(0, vehDue(v)), 0);
    const groups = [["all", "Все"], ["asiastar", "ASIASTAR"], ["eurise", "EURISE"], ["partner", "Частные"]];
    const rg = f.tab === "chart" ? (ribbons.fleet = ribbonRange(all.flatMap((v) => v.schedule.map((x) => x.d)))) : null;

    return `
      <div class="grid kpis">
        ${kpi("Единиц транспорта", active.length, `${own.length} ${plural(own.length, "автобус", "автобуса", "автобусов")} · ${active.length - own.length} частных`)}
        ${kpi("В рейсе сегодня", onRoute.length, `свободно ${active.length - onRoute.length}`)}
        ${kpi(`Загрузка · ${MONTHS[m - 1].toLowerCase()}`, Math.round(avg * 100) + "%", "в среднем по автобусам")}
        ${kpi("Начислено перевозчикам", money(totalCost), "июль–декабрь")}
        ${kpi("Остаток к оплате", money(totalDue), `выплачено ${fmtUsd(all.reduce((x, v) => x + paidOf(v), 0))}`)}
      </div>
      <div class="toolbar">
        <div class="seg"><button class="${f.tab === "list" ? "on" : ""}" data-action="fleet-tab" data-v="list">Список</button><button class="${f.tab === "chart" ? "on" : ""}" data-action="fleet-tab" data-v="chart">График по дням</button></div>
        <div class="seg">${groups.map(([v, l]) => `<button class="${f.group === v ? "on" : ""}" data-action="fleet-group" data-v="${v}">${l}<span class="c">${all.filter((x) => v === "all" || vehGroup(x) === v).length}</span></button>`).join("")}</div>
        <div class="grow"></div>
        ${f.tab === "chart" ? ribbonNav("fleet", rg)
          : `<select class="input" data-fleet="month">${PERIOD_MONTHS.map((x) => `<option value="${x}" ${x === m ? "selected" : ""}>${MONTHS[x - 1]}</option>`).join("")}</select>`}
      </div>
      ${fleetMonths().length < PERIOD_MONTHS.length ? `<div class="note-box" style="margin:0 0 14px;display:flex;gap:8px;align-items:center">${icon("alert")}<span>В Excel транспортный график заполнен только за: ${fleetMonths().map((x) => MONTHS[x - 1].toLowerCase()).join(", ") || "—"}. Остальные месяцы появятся после обновления файла.</span></div>` : ""}
      ${f.tab === "list" ? fleetTable(list, m, dim) : fleetChart(list, rg)}`;
  }

  function fleetTable(list, m, dim) {
    return `<div class="card"><div class="table-wrap"><table class="t">
      <thead><tr><th>№</th><th>Транспорт</th><th>Сегодня</th><th class="r">Дней в работе</th><th>Загрузка · ${MONTHS_SHORT[m - 1]}</th><th class="r">Начислено</th><th class="r">Оплачено</th><th class="r">Остаток</th></tr></thead>
      <tbody>${list.map((v) => {
        const t = vehOn(v, TODAY), d = vehDaysIn(v, m), due = vehDue(v);
        return `<tr class="clickable ${v.sold ? "cancelled" : ""}" data-open-vehicle="${v.id}">
          <td class="num muted">${v.no}</td>
          <td><div class="cell-main">${vdot(v)}${esc(vehTitle(v))}</div><div class="cell-sub">${esc(vehSub(v))}</div></td>
          <td>${v.sold ? '<span class="badge sold">Продан</span>' : t ? `<span class="badge active">${esc(t.route || "в работе")}</span>` : '<span class="badge plain">свободен</span>'}</td>
          <td class="r num">${v.schedule.length}</td>
          <td><div style="display:flex;align-items:center;gap:8px"><div class="meter" style="flex:1;max-width:120px"><i style="width:${(d / dim) * 100}%"></i></div><span class="small num muted">${d}/${dim}</span></div></td>
          <td class="r num">${fmtUsd(vehCost(v))}</td>
          <td class="r num">${fmtUsd(paidOf(v))}</td>
          <td class="r num" style="font-weight:600;${due < -1 ? "color:var(--violet)" : ""}">${fmtUsd(due)}</td>
        </tr>`;
      }).join("")}</tbody>
      <tfoot><tr><td colspan="3">Итого: ${list.length}</td><td class="r num">${fmtNum(list.reduce((s, v) => s + v.schedule.length, 0))}</td><td></td>
        <td class="r num">${fmtUsd(list.reduce((s, v) => s + vehCost(v), 0))}</td><td class="r num">${fmtUsd(list.reduce((s, v) => s + paidOf(v), 0))}</td><td class="r num">${fmtUsd(list.reduce((s, v) => s + vehDue(v), 0))}</td></tr></tfoot>
    </table></div></div>`;
  }

  function fleetChart(list, rg) {
    const rows = list.filter((v) => !v.sold || v.schedule.length);
    return `<div class="card"><div class="card-h wrap"><h2>График транспорта · ${rangeTitle(rg).toLowerCase()}</h2><div class="spacer"></div>
      <div class="legend"><span>У каждой машины свой цвет, частные — серые</span><span><i class="vc gray" style="background:var(--c-solid)"></i>Переезд между городами</span><span><i class="vc gray" style="background:var(--c-soft);border:1px solid var(--border-strong)"></i>Работа в городе</span><span class="hint">${icon("edit")}Нажмите на клетку, чтобы изменить рейс или цвет, на пустую — добавить рейс</span></div></div>
      <div class="tl-wrap" data-keep-scroll="fleet"><table class="tl tl-period" style="--days:${rg.dates.length}">${ribbonHead(rg, "Транспорт")}
      <tbody>${rows.map((v) => {
        const by = new Map(v.schedule.map((x) => [x.d, x]));
        return `<tr class="vc ${v.partner ? "gray" : ""}" style="--vh:${v.hue}" data-cell="veh" data-id="${v.id}"><td class="rowh" data-open-vehicle="${v.id}"><div class="t1">${vdot(v)}${esc(vehTitle(v))}</div><div class="t2">${esc([vehSub(v), v.schedule.length + " дн."].filter((x) => x !== "—").join(" · "))}</div></td>
          ${rg.dates.map((d, i) => {
            const x = by.get(d);
            // пустая клетка: клик добавляет рейс (у проданной машины — нет)
            if (!x) return `<td class="tday ${v.sold ? "" : "ed add"} ${rg.colCls[i]}"></td>`;
            const prev = by.get(addDays(d, -1)), next = by.get(addDays(d, 1));
            const moving = x.route && x.route.includes("-");
            const tip = `${vehTitle(v)}\n${fmtDateLong(d)}\n${x.route ? expandRoute(x.route) : "—"}${x.svc.length ? "\n" + svcText(x.svc) : ""}${x.cost ? "\n" + fmtUsd(x.cost) : ""}\n\nНажмите, чтобы изменить`;
            const tn = tint(x);
            return `<td class="tday on ed ${tn.cls} ${rg.colCls[i]}" ${tn.style} title="${esc(tip)}"><div class="cellbar v ${moving ? "" : "l1"} ${!prev ? "s" : ""} ${!next ? "e" : ""}">${dayCell(x.route, x.svc)}</div></td>`;
          }).join("")}</tr>`;
      }).join("")}</tbody></table></div></div>`;
  }

  function fleetAfter(restored) {
    if (ui.fleet.tab !== "chart" || !rbWrap("fleet")) return;
    if (!restored.has("fleet")) {
      // если сегодня есть рейсы — к сегодняшнему дню, иначе к началу последнего заполненного месяца
      const m = fleetMonth();
      ribbonScrollTo("fleet", TODAY.slice(0, 7) === `${YEAR}-${pad(m)}` ? ribbonTodayAnchor("fleet") : `${YEAR}-${pad(m)}-01`);
    }
    updateRibbonMonth("fleet");
  }

  function drawerVehicle(v) {
    const cost = vehCost(v), paid = paidOf(v), due = cost - paid, t = vehOn(v, TODAY);
    const byMonth = PERIOD_MONTHS.map((m) => ({ m, items: v.schedule.filter((x) => inMonth(x.d, m)) })).filter((g) => g.items.length);
    return `
      <div class="drawer-h">
        <div><h3>${vdot(v)}${esc(vehTitle(v))}</h3><div class="sub">${esc(v.name)}</div>
          <div style="margin-top:8px">${v.sold ? '<span class="badge sold">Продан</span>' : t ? `<span class="badge active">Сегодня: ${esc(t.route || "в работе")}</span>` : '<span class="badge plain">Сегодня свободен</span>'}</div></div>
        <div class="actions">
          <button class="btn sm" data-action="edit-vehicle" data-id="${v.id}">${icon("edit")}Изменить</button>
          <button class="btn icon sm ghost" data-action="close-drawer" aria-label="Закрыть">${icon("x")}</button>
        </div>
      </div>
      <div class="drawer-b">
        <div class="section-t">Информация</div>
        <div class="info-grid">
          ${info("Марка / тип", esc(v.partner ? "Частный перевозчик" : v.brand))}
          ${info("Госномер", esc(v.plate || "—"))}
          ${info("Водитель / владелец", esc(v.driver || "—"))}
          ${info("Мест", esc(v.seats || "—"))}
          ${info("Дней в работе", v.schedule.length)}
          ${info("Средняя ставка в день", v.schedule.length ? fmtUsd(cost / v.schedule.length) : "—")}
        </div>
        ${v.partner ? "" : `<div class="section-t">Цвет в графике</div>${huePick("veh-hue", v.id, v.hue)}`}
        <div class="section-t">Взаиморасчёты с перевозчиком</div>
        <div class="money">
          <div><div class="k">Начислено</div><div class="v num">${fmtUsd(cost)}</div></div>
          <div><div class="k">Оплачено</div><div class="v num ok">${fmtUsd(paid)}</div></div>
          <div><div class="k">${due < -1 ? "Переплата" : "Остаток"}</div><div class="v num ${due > 1 ? "neg" : ""}">${fmtUsd(Math.abs(due))}</div></div>
        </div>
        <div class="pay-list">${(v.payments || []).map((p, i) => `<div class="pay-item"><span class="chip exc">Выплата</span>
          <div><div>${esc(p.note || "")}</div><div class="small muted">${p.date ? fmtDateLong(p.date) : "дата не указана"}</div></div>
          <div class="amt num">${fmtUsd(p.usd)}</div>
          <button class="btn icon sm ghost" data-action="del-vpayment" data-id="${v.id}" data-i="${i}" aria-label="Удалить">${icon("trash")}</button></div>`).join("")}</div>
        <form class="pay-form" data-form="vpayment" data-id="${v.id}" style="grid-template-columns:1fr 1fr 1.6fr auto">
          <div class="field"><label>Сумма, USD</label><input class="input num" name="amount" type="number" min="0" step="any" placeholder="${due > 0 ? Math.round(due) : 0}" required></div>
          <div class="field"><label>Дата</label><input class="input" name="date" type="date" value="${TODAY}"></div>
          <div class="field"><label>Комментарий</label><input class="input" name="note" placeholder="напр. за октябрь"></div>
          <button class="btn primary" type="submit">${icon("plus")}Выплата</button>
        </form>
        <div class="section-t">График работы</div>
        ${byMonth.length ? byMonth.map((g) => `<div style="margin-bottom:14px"><div style="font-weight:600;margin-bottom:6px">${MONTHS[g.m - 1]} · ${g.items.length} дн. · ${fmtUsd(g.items.reduce((s, x) => s + x.cost, 0))}</div>
          <div class="days">${g.items.map((x) => `<div class="day ${x.d === TODAY ? "is-today" : ""}"><div><div class="dn">${fmtDate(x.d)}</div><div class="dd">${dow(x.d)}</div></div>
            <div><div class="route" title="${esc(expandRoute(x.route))}">${esc(x.route || "—")}</div>${svcChips(x.svc)}</div><div class="cost num">${x.cost ? fmtUsd(x.cost) : "—"}</div></div>`).join("")}</div></div>`).join("")
          : `<div class="empty">В графике нет рабочих дней</div>`}
      </div>`;
  }

  /* ================= Взаиморасчёты ================= */
  function viewFinance() {
    const f = ui.fin;
    return `
      <div class="toolbar"><div class="seg">
        <button class="${f.tab === "clients" ? "on" : ""}" data-action="fin-tab" data-v="clients">С заказчиками</button>
        <button class="${f.tab === "carriers" ? "on" : ""}" data-action="fin-tab" data-v="carriers">С перевозчиками</button>
      </div></div>
      ${f.tab === "clients" ? financeClients() : financeCarriers()}`;
  }
  function financeClients() {
    const list = customers().filter((c) => c.total || c.paid).sort((a, b) => b.due - a.due);
    const T = (k) => list.reduce((s, c) => s + c[k], 0);
    const over = db.requests.reduce((s, r) => s + Math.max(0, -dueOf(r)), 0);
    return `
      <div class="grid kpis">
        ${kpi("Начислено", money(T("total")), `${list.length} заказчиков`)}
        ${kpi("Оплачено", money(T("paid")), `${Math.round((T("paid") / (T("total") || 1)) * 100)}% от начисленного`)}
        ${kpi("Остаток к получению", money(db.requests.reduce((s, r) => s + Math.max(0, dueOf(r)), 0)), "без учёта переплат")}
        ${kpi("Переплаты", money(over), "проверить и зачесть")}
        ${kpi("Остаток перечислением", fmtNum(T("dueUzs") / 1e6) + '<span class="cur">млн сум</span>', `по курсу заявки + НДС`)}
      </div>
      <div class="card"><div class="table-wrap"><table class="t">
        <thead><tr><th style="width:28px"></th><th>Заказчик</th><th class="r">Заявок</th><th class="r">Начислено</th><th class="r">Оплачено</th><th class="r">Остаток, USD</th><th class="r">Остаток перечисл., сум</th><th></th></tr></thead>
        <tbody>${list.map((c) => {
          const open = f_open(c.name);
          return `<tr class="clickable" data-action="fin-toggle" data-name="${esc(c.name)}">
            <td class="muted">${icon(open ? "chevronDown" : "chevron")}</td>
            <td class="cell-main">${esc(c.name)}</td>
            <td class="r num">${c.count}${c.cancelled ? `<span class="muted"> +${c.cancelled}</span>` : ""}</td>
            <td class="r num">${fmtUsd(c.total)}</td>
            <td class="r num">${fmtUsd(c.paid)}</td>
            <td class="r num" style="font-weight:650;${c.due > 1 ? "color:var(--danger)" : c.due < -1 ? "color:var(--violet)" : ""}">${fmtUsd(c.due)}</td>
            <td class="r num muted">${c.dueUzs ? fmtNum(c.dueUzs) : "—"}</td>
            <td class="r"><button class="btn sm" data-action="print-statement" data-name="${esc(c.name)}">${icon("printer")}Акт сверки</button></td>
          </tr>
          ${open ? c.reqs.slice().sort((a, b) => (a.from || "").localeCompare(b.from || "")).map((r) => `<tr class="sub-row clickable" data-open-request="${r.id}">
            <td></td><td>№${r.no} · ${esc(r.group || "без группы")} · ${fmtRange(r.from, r.to)} ${r.cancelled ? '<span class="badge cancelled">Аннуляция</span>' : ""}</td><td></td>
            <td class="r num">${fmtUsd(r.total || 0)}</td><td class="r num">${fmtUsd(paidOf(r))}</td><td class="r num">${fmtUsd(dueOf(r))}</td>
            <td class="r num muted">${dueOf(r) > 1 ? fmtNum(toUzs(dueOf(r), r.rate, r.vat)) : "—"}</td><td></td></tr>`).join("") : ""}`;
        }).join("")}</tbody>
        <tfoot><tr><td></td><td>Итого</td><td class="r num">${T("count")}</td><td class="r num">${fmtUsd(T("total"))}</td><td class="r num">${fmtUsd(T("paid"))}</td><td class="r num">${fmtUsd(T("due"))}</td><td class="r num">${fmtNum(T("dueUzs"))}</td><td></td></tr></tfoot>
      </table></div></div>`;
  }
  const f_open = (name) => ui.fin.open.has(name);

  function financeCarriers() {
    const list = db.vehicles.filter((v) => vehCost(v) || paidOf(v)).sort((a, b) => vehDue(b) - vehDue(a));
    const cost = list.reduce((s, v) => s + vehCost(v), 0), paid = list.reduce((s, v) => s + paidOf(v), 0);
    return `
      <div class="grid kpis" style="grid-template-columns:repeat(3,minmax(0,1fr))">
        ${kpi("Начислено перевозчикам", money(cost), `${list.length} перевозчиков`)}
        ${kpi("Выплачено", money(paid), `${Math.round((paid / (cost || 1)) * 100)}%`)}
        ${kpi("Остаток к выплате", money(list.reduce((s, v) => s + Math.max(0, vehDue(v)), 0)), "по графику транспорта")}
      </div>
      <div class="card"><div class="table-wrap"><table class="t">
        <thead><tr><th>Исполнитель работ</th><th class="r">Дней</th><th class="r">Начислено</th><th class="r">Оплачено</th><th class="r">Остаток</th><th></th></tr></thead>
        <tbody>${list.map((v) => `<tr class="clickable" data-open-vehicle="${v.id}">
          <td><div class="cell-main">${vdot(v)}${esc(vehTitle(v))}</div><div class="cell-sub">${esc(vehSub(v))}</div></td>
          <td class="r num">${v.schedule.length}</td><td class="r num">${fmtUsd(vehCost(v))}</td><td class="r num">${fmtUsd(paidOf(v))}</td>
          <td class="r num" style="font-weight:650;${vehDue(v) > 1 ? "color:var(--danger)" : vehDue(v) < -1 ? "color:var(--violet)" : ""}">${fmtUsd(vehDue(v))}</td>
          <td class="r"><button class="btn sm" data-open-vehicle="${v.id}">${icon("wallet")}Выплатить</button></td></tr>`).join("")}</tbody>
        <tfoot><tr><td>Итого</td><td class="r num">${fmtNum(list.reduce((s, v) => s + v.schedule.length, 0))}</td><td class="r num">${fmtUsd(cost)}</td><td class="r num">${fmtUsd(paid)}</td><td class="r num">${fmtUsd(cost - paid)}</td><td></td></tr></tfoot>
      </table></div></div>`;
  }

  /* ================= Заказчики ================= */
  function viewClients() {
    const q = ui.clients.q.trim().toLowerCase();
    const list = customers().filter((c) => !q || c.name.toLowerCase().includes(q)).sort((a, b) => b.total - a.total);
    return `
      <div class="toolbar">
        <input class="input search-inline" type="search" placeholder="Найти заказчика…" value="${esc(ui.clients.q)}" data-clients="q">
        <span class="muted small">${list.length} ${plural(list.length, "заказчик", "заказчика", "заказчиков")}</span>
        <div class="grow"></div>
        <button class="btn primary" data-action="new-request">${icon("plus")}Новая заявка</button>
      </div>
      <div class="grid client-cards">
        ${list.map((c) => `<div class="card client-card" data-open-client="${esc(c.name)}">
          <div class="top"><div class="avatar">${esc(initials(c.name))}</div><div style="min-width:0"><div class="nm">${esc(c.name)}</div>
            <div class="small muted">${c.count} ${plural(c.count, "заявка", "заявки", "заявок")}${c.pax ? ` · ${fmtNum(c.pax)} ${plural(c.pax, "турист", "туриста", "туристов")}` : ""}</div></div></div>
          <div class="stats">
            <div><div class="k">Начислено</div><div class="v num">${fmtUsd(c.total)}</div></div>
            <div><div class="k">Оплачено</div><div class="v num">${fmtUsd(c.paid)}</div></div>
            <div><div class="k">Остаток</div><div class="v num" style="${c.due > 1 ? "color:var(--danger)" : ""}">${fmtUsd(c.due)}</div></div>
          </div>
          <div class="foot"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.countries.join(", ") || "—")}</span><span class="nowrap">${c.next ? "след. заезд " + fmtDate(c.next.from) : "нет новых заездов"}</span></div>
        </div>`).join("") || `<div class="empty">Не найдено</div>`}
      </div>`;
  }
  function drawerClient(name) {
    const c = customers().find((x) => x.name === name);
    if (!c) return "";
    const reqs = c.reqs.slice().sort((a, b) => (b.from || "").localeCompare(a.from || ""));
    return `
      <div class="drawer-h">
        <div style="display:flex;gap:12px;align-items:center"><div class="avatar" style="width:42px;height:42px">${esc(initials(c.name))}</div>
          <div><h3>${esc(c.name)}</h3><div class="sub">Заказчик · ${c.count} ${plural(c.count, "заявка", "заявки", "заявок")}${c.cancelled ? ` · ${c.cancelled} аннул.` : ""}</div></div></div>
        <div class="actions">
          <button class="btn sm primary" data-action="new-request" data-customer="${esc(c.name)}">${icon("plus")}Заявка</button>
          <button class="btn sm" data-action="print-statement" data-name="${esc(c.name)}">${icon("printer")}Акт сверки</button>
          <button class="btn icon sm ghost" data-action="close-drawer" aria-label="Закрыть">${icon("x")}</button>
        </div>
      </div>
      <div class="drawer-b">
        <div class="money">
          <div><div class="k">Начислено</div><div class="v num">${fmtUsd(c.total)}</div></div>
          <div><div class="k">Оплачено</div><div class="v num ok">${fmtUsd(c.paid)}</div></div>
          <div><div class="k">Остаток</div><div class="v num ${c.due > 1 ? "neg" : ""}">${fmtUsd(c.due)}</div></div>
        </div>
        <div class="info-grid" style="margin-top:16px">
          ${info("Туристов", fmtNum(c.pax))}
          ${info("Страны", esc(c.countries.join(", ") || "—"))}
          ${info("Следующий заезд", c.next ? `${fmtDateLong(c.next.from)}` : "—")}
        </div>
        <div class="section-t">Заявки</div>
        <div class="card" style="box-shadow:none"><div class="table-wrap"><table class="t">
          <thead><tr><th>№</th><th>Группа</th><th>Даты</th><th class="r">Тур.</th><th class="r">Сумма</th><th class="r">Остаток</th><th>Статус</th></tr></thead>
          <tbody>${reqs.map((r) => `<tr class="clickable ${r.cancelled ? "cancelled" : ""}" data-open-request="${r.id}">
            <td class="num muted">${r.no}</td><td>${esc(r.group || "—")}<div class="cell-sub">${esc(routeSummary(r.days))}</div></td>
            <td class="nowrap">${fmtRange(r.from, r.to)}</td><td class="r num">${r.pax || "—"}</td>
            <td class="r num">${fmtUsd(r.total || 0)}</td><td class="r num">${fmtUsd(dueOf(r))}</td>
            <td><span class="badge ${reqStatus(r)}">${STATUS[reqStatus(r)]}</span></td></tr>`).join("")}</tbody>
        </table></div></div>
      </div>`;
  }

  /* ================= Настройки ================= */
  function viewSettings() {
    const s = db.settings;
    return `
      <div class="grid cols-2e">
        <section class="card">
          <div class="card-h"><h2>Параметры расчётов</h2></div>
          <form class="card-b" data-form="settings">
            <div class="form-grid" style="grid-template-columns:1fr 1fr">
              <div class="field"><label>Курс USD по умолчанию, сум</label><input class="input num" name="rate" type="number" min="1" value="${s.rate}"></div>
              <div class="field"><label>НДС при перечислении, %</label><input class="input num" name="vat" type="number" min="0" step="any" value="${s.vat}"></div>
            </div>
            <p class="small muted">Применяется к новым заявкам. У импортированных заявок сохраняется курс из Excel.</p>
            <button class="btn primary" type="submit">Сохранить</button>
          </form>
        </section>
        <section class="card">
          <div class="card-h"><h2>Данные</h2></div>
          <div class="card-b">
            <div class="info-grid" style="grid-template-columns:1fr 1fr">
              ${info("Источник", esc(db.source))}
              ${info("Импортировано", esc(db.importedAt))}
              ${info("Заявок", db.requests.length)}
              ${info("Единиц транспорта", db.vehicles.length)}
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px">
              <button class="btn" data-action="export-csv">${icon("download")}Заявки в CSV (Excel)</button>
              <button class="btn" data-action="export-json">${icon("file")}Все данные JSON</button>
              <button class="btn danger" data-action="reset-data">${icon("restore")}Сбросить демо-данные</button>
            </div>
            <p class="small muted" style="margin-bottom:0">Обновить данные из нового Excel: <code>python3 tools/excel_to_data.py "файл.xlsx"</code></p>
          </div>
        </section>
      </div>
      <section class="card" style="margin-top:16px">
        <div class="card-h"><h2>Справочник сокращений</h2><span class="sub">как в графиках Excel</span></div>
        <div class="card-b">
          <div class="section-t">Услуги</div>
          <div class="gloss">${Object.entries(SVC).map(([k, v]) => `<div>${svcChip({ s: k })}<span>${esc(v.label)}</span></div>`).join("")}</div>
          <div class="section-t">Города и точки маршрута</div>
          <div class="gloss">${Object.entries(CITY).map(([k, v]) => `<div><code>${esc(k)}</code><span>${esc(v)}</span></div>`).join("")}</div>
        </div>
      </section>`;
  }

  /* ================= Слои: drawer, modal, toast, tooltip ================= */
  function layerEl(id) {
    let el = document.getElementById(id);
    if (!el) { el = document.createElement("div"); el.id = id; $("#layer").appendChild(el); }
    return el;
  }
  function renderDrawer() {
    const el = layerEl("drawer-layer");
    if (!drawer) { el.innerHTML = ""; return; }
    let html = "";
    if (drawer.type === "request") { const r = reqById(drawer.id); html = r ? drawerRequest(r) : ""; }
    if (drawer.type === "vehicle") { const v = vehById(drawer.id); html = v ? drawerVehicle(v) : ""; }
    if (drawer.type === "client") html = drawerClient(drawer.id);
    if (!html) { drawer = null; el.innerHTML = ""; return; }
    const prev = $(".drawer-b", el), top = prev && el.dataset.key === drawer.type + drawer.id ? prev.scrollTop : 0;
    const anim = el.innerHTML ? "animation:none" : "";
    el.innerHTML = `<div class="overlay" data-action="close-drawer" style="${anim}"></div><aside class="drawer" role="dialog" aria-modal="true" style="${anim}">${html}</aside>`;
    el.dataset.key = drawer.type + drawer.id;
    $(".drawer-b", el).scrollTop = top;
  }
  function openDrawer(type, id) {
    const el = layerEl("drawer-layer");
    if (!drawer) el.innerHTML = "";
    drawer = { type, id };
    renderDrawer();
  }
  function closeDrawer() { drawer = null; renderDrawer(); }

  function showModal(html) {
    layerEl("modal-layer").innerHTML = `<div class="overlay" style="z-index:65"></div><div class="modal-wrap" data-action="modal-bg">${html}</div>`;
    const first = $("#modal-layer input:not([type=hidden]), #modal-layer button.primary");
    if (first) setTimeout(() => first.focus(), 30);
  }
  function closeModal() { modal = null; layerEl("modal-layer").innerHTML = ""; }

  function confirmBox(text, okLabel = "Подтвердить", danger = false) {
    return new Promise((resolve) => {
      modal = { type: "confirm", resolve };
      showModal(`<div class="modal sm"><div class="modal-b" style="padding-top:22px">${text}</div>
        <div class="modal-f"><button class="btn" data-action="confirm-no">Отмена</button><button class="btn ${danger ? "primary" : "primary"}" data-action="confirm-yes" style="${danger ? "background:var(--danger);border-color:var(--danger);color:#fff" : ""}">${okLabel}</button></div></div>`);
    });
  }

  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    $("#toasts").appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  const tip = document.createElement("div");
  tip.className = "tooltip hidden";
  document.body.appendChild(tip);
  document.addEventListener("mousemove", (e) => {
    const el = e.target.closest && e.target.closest("[data-tip]");
    if (!el) { tip.classList.add("hidden"); return; }
    tip.innerHTML = el.dataset.tip;
    tip.classList.remove("hidden");
    const w = tip.offsetWidth, h = tip.offsetHeight;
    let x = e.clientX + 14, y = e.clientY + 14;
    if (x + w > innerWidth - 8) x = e.clientX - w - 14;
    if (y + h > innerHeight - 8) y = e.clientY - h - 14;
    tip.style.left = x + "px";
    tip.style.top = y + "px";
  });

  /* ================= Печать ================= */
  function printHtml(html) {
    $("#print-area").innerHTML = html;
    window.print();
  }
  function printProgram(r) {
    const e = parseEscort(r.escort);
    printHtml(`<h1>Программа обслуживания группы</h1>
      <div>Azim Travel · заявка №${r.no} · сформировано ${fmtDateLong(TODAY)}</div>
      <table><tr><td><b>Заказчик</b></td><td>${esc(r.customer)}</td><td><b>Группа</b></td><td>${esc(r.group || "—")} ${esc(r.country || "")}</td></tr>
      <tr><td><b>Даты</b></td><td>${fmtDateLong(r.from)} — ${fmtDateLong(r.to)}</td><td><b>Туристов</b></td><td>${r.pax || "—"}</td></tr>
      <tr><td><b>Транспорт</b></td><td>${esc(r.transport || "—")}</td><td><b>Сопровождающий</b></td><td>${e ? esc(e.name) + (e.phone ? ", " + e.phone : "") : "—"}</td></tr></table>
      <table><thead><tr><th>День</th><th>Дата</th><th>Маршрут</th><th>Услуги</th><th class="r">Стоимость, USD</th></tr></thead><tbody>
      ${r.days.map((d) => `<tr><td>${d.n}</td><td>${d.d ? `${fmtDate(d.d)}, ${dow(d.d)}` : ""}</td><td>${esc(expandRoute(d.route) || "—")}</td><td>${esc(svcText(d.svc) || "—")}</td><td class="r">${d.cost ? fmtNum(d.cost) : "—"}</td></tr>`).join("")}
      <tr><td colspan="4"><b>Итого</b></td><td class="r"><b>${fmtNum(r.total || 0)}</b></td></tr></tbody></table>`);
  }
  function printStatement(name) {
    const c = customers().find((x) => x.name === name);
    if (!c) return;
    const reqs = c.reqs.slice().sort((a, b) => (a.from || "").localeCompare(b.from || ""));
    printHtml(`<h1>Акт сверки взаиморасчётов</h1>
      <div>Azim Travel — ${esc(c.name)} · период июль–декабрь ${YEAR} · на ${fmtDateLong(TODAY)}</div>
      <table><thead><tr><th>№</th><th>Группа</th><th>Даты</th><th class="r">Туристов</th><th class="r">Начислено, USD</th><th class="r">Оплачено, USD</th><th class="r">Остаток, USD</th></tr></thead><tbody>
      ${reqs.map((r) => `<tr><td>${r.no}</td><td>${esc(r.group || "—")}${r.cancelled ? " (аннуляция)" : ""}</td><td>${fmtRange(r.from, r.to)}</td><td class="r">${r.pax || ""}</td><td class="r">${fmtNum(r.total || 0)}</td><td class="r">${fmtNum(paidOf(r))}</td><td class="r">${fmtNum(dueOf(r))}</td></tr>`).join("")}
      <tr><td colspan="4"><b>Итого</b></td><td class="r"><b>${fmtNum(c.total)}</b></td><td class="r"><b>${fmtNum(c.paid)}</b></td><td class="r"><b>${fmtNum(c.due)}</b></td></tr></tbody></table>
      <p>Остаток при оплате перечислением (курс заявки, НДС): <b>${fmtUzs(c.dueUzs)}</b></p>
      <table style="margin-top:40px;border:0"><tr><td style="border:0">Azim Travel ____________________</td><td style="border:0">${esc(c.name)} ____________________</td></tr></table>`);
  }

  /* ================= Экспорт ================= */
  function download(name, content, type) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function exportCsv() {
    const list = currentView().view.id === "requests" ? filteredRequests() : db.requests;
    const head = ["№", "Заказчик", "Группа", "Страна", "С", "По", "Туристов", "Транспорт", "Сопровождающий", "Маршрут", "Сумма USD", "Оплачено USD", "Остаток USD", "Статус"];
    const cell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = list.map((r) => [r.no, r.customer, r.group, r.country, r.from, r.to, r.pax, r.transport, r.escort, routeSummary(r.days), r.total || 0, Math.round(paidOf(r) * 100) / 100, Math.round(dueOf(r) * 100) / 100, STATUS[reqStatus(r)]]);
    download(`azim-zayavki-${TODAY}.csv`, "﻿" + [head, ...rows].map((r) => r.map(cell).join(";")).join("\r\n"), "text/csv;charset=utf-8");
    toast(`Выгружено заявок: ${list.length}`);
  }

  /* ================= Глобальный поиск ================= */
  function searchAll(q) {
    q = q.trim().toLowerCase();
    if (q.length < 2) return [];
    const out = [];
    for (const r of db.requests) {
      const hay = [r.no, r.customer, r.group, r.escort, r.country].join(" ").toLowerCase();
      if (hay.includes(q)) out.push({ kind: "request", id: r.id, title: `№${r.no} · ${r.customer}`, sub: `${r.group || "без группы"} · ${fmtRange(r.from, r.to)}` });
    }
    for (const v of db.vehicles) if (v.name.toLowerCase().includes(q)) out.push({ kind: "vehicle", id: v.id, title: vehTitle(v), sub: vehSub(v) });
    for (const c of customers()) if (c.name.toLowerCase().includes(q)) out.unshift({ kind: "client", id: c.name, title: c.name, sub: `Заказчик · ${c.count} заявок` });
    return out.slice(0, 10);
  }
  function renderSearch() {
    const box = $("#search-results"), q = $("#global-search").value;
    const res = searchAll(q);
    if (!q.trim()) { box.classList.add("hidden"); return; }
    box.classList.remove("hidden");
    box.innerHTML = res.length ? res.map((x, i) => `<a href="#" class="${i === 0 ? "focus" : ""}" data-search-kind="${x.kind}" data-search-id="${esc(x.id)}">
      <div style="font-weight:600">${esc(x.title)}</div><div class="small muted">${esc(x.sub)}</div></a>`).join("") : `<div class="empty" style="padding:16px">Ничего не найдено</div>`;
  }
  function openSearchResult(kind, id) {
    $("#global-search").value = "";
    $("#search-results").classList.add("hidden");
    openDrawer(kind, id);
  }

  /* ================= Обработчики ================= */
  const refocus = (sel) => { const i = $(sel); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } };
  const applyReqSearch = debounce(() => { render(); refocus("[data-filter=q]"); }, 200);
  const applyClientSearch = debounce(() => { render(); refocus("[data-clients=q]"); }, 200);

  document.addEventListener("input", (e) => {
    const t = e.target;
    if (t.id === "global-search") return renderSearch();
    if (t.dataset.filter === "q") { ui.req.q = t.value; applyReqSearch(); return; }
    if (t.dataset.clients === "q") { ui.clients.q = t.value; applyClientSearch(); return; }
    if (t.closest("form[data-form=request]")) {
      if (t.name === "cost") updateFormTotal();
      if (t.name === "from" || t.name === "to") { syncFormDays(); renderFormDays(); }
    }
  });

  document.addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.filter && t.dataset.filter !== "q") { ui.req[t.dataset.filter] = t.value; render(); }
    if (t.dataset.cal === "customer") { ui.cal.customer = t.value; ui.cal.reanchor = true; render(); }
    if (t.dataset.cal === "cancelled") { ui.cal.cancelled = t.checked; render(); }
    if (t.dataset.fleet === "month") { ui.fleet.month = +t.value; render(); }
  });

  document.addEventListener("submit", (e) => {
    const form = e.target;
    const kind = form.dataset.form;
    if (!kind) return;
    e.preventDefault();
    const f = form.elements;
    if (kind === "request") return submitRequestForm(form);
    if (kind === "vehicle") return submitVehicleForm(form);
    if (kind === "cell") { saveCell(form); return closeModal(); }
    if (kind === "payment") {
      const r = reqById(form.dataset.id), amount = +f.amount.value;
      if (!(amount > 0)) { f.amount.classList.add("invalid"); f.amount.focus(); return; }
      const method = f.method.value, date = f.date.value || null, note = f.note.value.trim();
      const p = method === "transfer"
        ? { method, date, uzs: amount, rate: r.rate, vat: r.vat, usd: Math.round((amount / r.rate / (1 + r.vat / 100)) * 100) / 100, note: note || "Перечисление" }
        : { method, date, usd: amount, note: note || "Наличные USD" };
      r.payments.push(p);
      r.log.push({ ts: nowStamp(), text: `Оплата ${fmtUsd(p.usd)}${p.uzs ? ` (${fmtUzs(p.uzs)})` : ""}` });
      toast("Оплата добавлена");
      return rerender();
    }
    if (kind === "vpayment") {
      const v = vehById(form.dataset.id), amount = +f.amount.value;
      if (!(amount > 0)) { f.amount.classList.add("invalid"); f.amount.focus(); return; }
      v.payments.push({ date: f.date.value || null, usd: amount, note: f.note.value.trim() || "Выплата перевозчику" });
      toast("Выплата добавлена");
      return rerender();
    }
    if (kind === "settings") {
      const rate = +f.rate.value, vat = +f.vat.value;
      if (!(rate > 0) || !(vat >= 0)) return toast("Проверьте значения");
      db.settings.rate = rate;
      db.settings.vat = vat;
      toast("Настройки сохранены");
      return rerender();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.target.id === "global-search") {
      const items = $$("#search-results a");
      const i = items.findIndex((a) => a.classList.contains("focus"));
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!items.length) return;
        const n = (i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items.forEach((a, k) => a.classList.toggle("focus", k === n));
      }
      if (e.key === "Enter" && items[i]) { e.preventDefault(); openSearchResult(items[i].dataset.searchKind, items[i].dataset.searchId); }
      if (e.key === "Escape") { e.target.value = ""; renderSearch(); }
      return;
    }
    if (e.key === "Escape") {
      if (modal) { if (modal.resolve) modal.resolve(false); closeModal(); }
      else if (drawer) closeDrawer();
    }
    if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); $("#global-search").focus(); }
  });

  document.addEventListener("click", async (e) => {
    const t = e.target;
    if (!t.closest("#search-results") && t.id !== "global-search") $("#search-results").classList.add("hidden");

    const sr = t.closest("[data-search-kind]");
    if (sr) { e.preventDefault(); return openSearchResult(sr.dataset.searchKind, sr.dataset.searchId); }

    const a = t.closest("[data-action]");
    const action = a && a.dataset.action;
    // клетка дня в графиках и в таблице «Как в Excel» — редактор этого дня
    const cell = !a && t.closest("td.ed");
    if (cell) {
      const row = cell.closest("[data-cell]"), w = cell.closest("[data-keep-scroll]");
      const d = cell.dataset.day || ribbons[w.dataset.keepScroll].dates[cell.cellIndex - 1];
      return openCellEditor(row.dataset.cell, row.dataset.id, d);
    }
    // открытие карточек; кнопка с действием внутри строки имеет приоритет
    const opener = t.closest("[data-open-request],[data-open-vehicle],[data-open-client]");
    if (opener && (!a || a.contains(opener))) {
      e.preventDefault();
      const d = opener.dataset;
      if (d.openRequest) return openDrawer("request", d.openRequest);
      if (d.openVehicle) return openDrawer("vehicle", d.openVehicle);
      return openDrawer("client", d.openClient);
    }
    if (!action) return;

    switch (action) {
      case "toggle-nav": $("#app").classList.toggle("nav-open"); break;
      case "toggle-theme": {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem(THEME_KEY, next); } catch (err) { /* ignore */ }
        $("#theme-btn").innerHTML = icon(next === "dark" ? "sun" : "moon");
        break;
      }
      case "new-request": e.preventDefault(); openRequestForm(null, { customer: a.dataset.customer }); break;
      case "edit-request": openRequestForm(a.dataset.id); break;
      case "new-vehicle": openVehicleForm(null); break;
      case "edit-vehicle": openVehicleForm(a.dataset.id); break;
      case "del-vehicle": {
        const v = vehById(a.dataset.id);
        if (!(await confirmBox(`<b>Удалить ${esc(vehTitle(v))}?</b><p class="muted" style="margin-bottom:0">У машины нет рейсов и выплат, больше ничего не изменится.</p>`, "Удалить", true))) return;
        db.vehicles.splice(db.vehicles.indexOf(v), 1);
        drawer = null;
        toast("Транспорт удалён");
        rerender();
        break;
      }
      case "cell-step": {
        const { kind, id, d } = modal;
        saveCell($("form[data-form=cell]"));
        openCellEditor(kind, id, addDays(d, +a.dataset.step));
        break;
      }
      case "cell-clear": {
        const f = $("form[data-form=cell]");
        for (const n of ["route", "svc", "cost", "color"]) f.elements[n].value = "";
        saveCell(f);
        closeModal();
        break;
      }
      case "cell-color": {
        const f = a.closest("form");
        f.elements.color.value = a.dataset.c;
        $$(".cell-colors button", f).forEach((b) => b.classList.toggle("on", b === a));
        break;
      }
      case "cell-open": {
        const { kind, id } = modal;
        closeModal();
        openDrawer(kind === "req" ? "request" : "vehicle", id);
        break;
      }
      case "close-drawer": closeDrawer(); break;
      case "close-modal": closeModal(); break;
      case "modal-bg": if (t === a && modal && modal.type === "confirm") { modal.resolve(false); closeModal(); } break;
      case "confirm-yes": { const m = modal; closeModal(); m.resolve(true); break; }
      case "confirm-no": { const m = modal; closeModal(); m.resolve(false); break; }
      case "cancel-request": {
        const r = reqById(a.dataset.id);
        if (!(await confirmBox(`<b>Аннулировать заявку №${r.no}?</b><p class="muted" style="margin-bottom:0">${esc(r.customer)}, ${fmtRange(r.from, r.to)}. Заявка останется в базе со статусом «Аннуляция», сумма в взаиморасчётах не изменится.</p>`, "Аннулировать", true))) return;
        r.cancelled = true;
        r.log.push({ ts: nowStamp(), text: "Заявка аннулирована" });
        toast("Заявка аннулирована");
        rerender();
        break;
      }
      case "restore-request": {
        const r = reqById(a.dataset.id);
        r.cancelled = false;
        r.log.push({ ts: nowStamp(), text: "Заявка восстановлена" });
        toast("Заявка восстановлена");
        rerender();
        break;
      }
      case "del-payment": {
        const r = reqById(a.dataset.id), p = r.payments[+a.dataset.i];
        if (!(await confirmBox(`<b>Удалить оплату ${fmtUsd(p.usd)}?</b>`, "Удалить", true))) return;
        r.payments.splice(+a.dataset.i, 1);
        r.log.push({ ts: nowStamp(), text: `Удалена оплата ${fmtUsd(p.usd)}` });
        rerender();
        break;
      }
      case "veh-hue":
        vehById(a.dataset.id).hue = +a.dataset.h;
        rerender();
        break;
      case "req-hue":
        reqById(a.dataset.id).hue = +a.dataset.h;
        rerender();
        break;
      case "del-vpayment": {
        const v = vehById(a.dataset.id), p = v.payments[+a.dataset.i];
        if (!(await confirmBox(`<b>Удалить выплату ${fmtUsd(p.usd)}?</b>`, "Удалить", true))) return;
        v.payments.splice(+a.dataset.i, 1);
        rerender();
        break;
      }
      case "print-program": printProgram(reqById(a.dataset.id)); break;
      case "print-statement": e.stopPropagation(); printStatement(a.dataset.name); break;
      case "req-status": ui.req.status = a.dataset.v; render(); break;
      case "req-view":
        ui.req.view = a.dataset.v;
        try { localStorage.setItem(REQ_VIEW_KEY, ui.req.view); } catch (err) { /* ignore */ }
        render();
        break;
      case "reset-filters": Object.assign(ui.req, { q: "", customer: "", month: "", status: "all", pay: "all" }); render(); break;
      case "filter-active": e.preventDefault(); Object.assign(ui.req, { q: "", customer: "", month: "", status: "active", pay: "all" }); go("requests"); break;
      case "svc-day": ui.dash.svcDay = a.dataset.day; render(); break;
      case "rb-jump": ribbonScrollTo(a.dataset.key, `${a.dataset.ym}-01`, true); break;
      case "rb-today": ribbonScrollTo(a.dataset.key, ribbonTodayAnchor(a.dataset.key), true); break;
      case "fleet-tab": ui.fleet.tab = a.dataset.v; render(); break;
      case "fleet-group": ui.fleet.group = a.dataset.v; render(); break;
      case "fin-tab": ui.fin.tab = a.dataset.v; render(); break;
      case "fin-toggle": {
        const n = a.dataset.name;
        ui.fin.open.has(n) ? ui.fin.open.delete(n) : ui.fin.open.add(n);
        render();
        break;
      }
      case "export-csv": exportCsv(); break;
      case "export-json": download(`azim-crm-${TODAY}.json`, JSON.stringify(db, null, 2), "application/json"); break;
      case "reset-data": {
        if (!(await confirmBox("<b>Сбросить демо-данные?</b><p class=\"muted\" style=\"margin-bottom:0\">Все изменения, сделанные в браузере, удалятся. Данные вернутся к состоянию из Excel.</p>", "Сбросить", true))) return;
        db = fresh();
        drawer = null;
        rerender();
        toast("Данные сброшены");
        break;
      }
    }
  });

  // при прокрутке ленты подсвечиваем текущий месяц
  document.addEventListener("scroll", (e) => {
    if (e.target instanceof Element && ribbons[e.target.dataset.keepScroll]) updateRibbonMonth(e.target.dataset.keepScroll);
  }, true);

  // сортировка таблицы заявок
  document.addEventListener("click", (e) => {
    const th = e.target.closest("th[data-sort]");
    if (!th) return;
    const k = th.dataset.sort;
    ui.req.dir = ui.req.sort === k ? -ui.req.dir : 1;
    ui.req.sort = k;
    render();
  });

  /* ================= Старт ================= */
  $(".menu-btn").innerHTML = icon("menu");
  $("#search-icon").innerHTML = icon("search");
  $("#theme-btn").innerHTML = icon(document.documentElement.dataset.theme === "dark" ? "sun" : "moon");
  window.addEventListener("hashchange", () => {
    $("#app").classList.remove("nav-open");
    drawer = null;
    if (modal) { if (modal.resolve) modal.resolve(false); closeModal(); }
    render();
    window.scrollTo(0, 0);
  });
  render();
})();
