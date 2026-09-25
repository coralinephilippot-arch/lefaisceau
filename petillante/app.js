/* Pétillante — logique de l'app. Aucune dépendance, aucune donnée envoyée. */
(() => {
  "use strict";

  const C = window.PETILLANTE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ——— Stockage local, préfixé : le domaine peut héberger d'autres apps,
         on ne lit et n'efface JAMAIS autre chose que nos propres clés. ——— */
  const NS = "petillante:";
  const store = {
    get(k, d) {
      try { const v = localStorage.getItem(NS + k); return v === null ? d : JSON.parse(v); }
      catch { return d; }
    },
    set(k, v) { try { localStorage.setItem(NS + k, JSON.stringify(v)); } catch { /* mode privé : tant pis */ } },
    clear() {
      try { Object.keys(localStorage).filter(k => k.startsWith(NS)).forEach(k => localStorage.removeItem(k)); } catch {}
    }
  };

  /* ——— Utilitaires ——— */
  const pad = n => String(n).padStart(2, "0");
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const hash = s => [...s].reduce((h, c) => (Math.imul(h ^ c.charCodeAt(0), 16777619)) >>> 0, 2166136261);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const dayOfYear = d => Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
  const fmtLong = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const fmtShort = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const name = () => (store.get("name", "") || "").trim();
  const vibrate = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch {} };

  /* Tirage sans répétition : on épuise le sac avant de le remélanger. */
  function bag(items) {
    let pool = [];
    return (avoid) => {
      if (!pool.length) pool = items.map((_, i) => i).sort(() => Math.random() - .5);
      let i = pool.pop();
      if (i === avoid && pool.length) { pool.unshift(i); i = pool.pop(); }
      return i;
    };
  }

  function swapText(el, text) {
    el.classList.remove("is-swapping");
    void el.offsetWidth;
    el.textContent = text;
    el.classList.add("is-swapping");
  }

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-on"), 2600);
  }

  async function share(text) {
    const url = location.origin + location.pathname;
    if (navigator.share) {
      try { await navigator.share({ title: "Pétillante", text, url }); return; }
      catch (e) { if (e.name === "AbortError") return; }
    }
    try { await navigator.clipboard.writeText(`${text}\n— ${url}`); toast("Copié ! Colle-le où tu veux."); }
    catch { toast("Partage indisponible sur cet appareil."); }
  }

  /* ——— Confettis ——— */
  const confetti = (() => {
    const cv = $("#confetti"), ctx = cv.getContext("2d");
    const colors = ["#FF5B3A", "#FFCB47", "#F7B7C8", "#CBB9FF", "#A8CBB2", "#9CCBF0"];
    let parts = [], raf = 0;
    function resize() { const r = devicePixelRatio || 1; cv.width = innerWidth * r; cv.height = innerHeight * r; ctx.setTransform(r, 0, 0, r, 0, 0); }
    addEventListener("resize", resize); resize();
    function tick() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts = parts.filter(p => p.life > 0);
      for (const p of parts) {
        p.vy += .32; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
        ctx.save(); ctx.globalAlpha = Math.min(1, p.life / 30); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, 7); ctx.fill(); }
        else ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      }
      raf = parts.length ? requestAnimationFrame(tick) : 0;
    }
    return (x = innerWidth / 2, y = innerHeight / 2.5, n = 110) => {
      if (reduceMotion) return;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 9;
        parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 7, s: 7 + Math.random() * 9, c: pick(colors),
          rot: Math.random() * 6, vr: (Math.random() - .5) * .4, life: 70 + Math.random() * 50, round: Math.random() < .35 });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
  })();
  const burstFrom = el => { const r = el.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + r.height / 2); };

  /* ═════════ AUJOURD'HUI ═════════ */
  function greeting() {
    const h = new Date().getHours();
    const slot = h < 5 ? "nuit" : h < 12 ? "matin" : h < 14 ? "midi" : h < 18 ? "aprem" : h < 23 ? "soir" : "nuit";
    const list = C.saluts[slot];
    return list[hash(dayKey() + slot) % list.length];
  }
  function renderHello() {
    const n = name();
    const el = $("#hello");
    el.textContent = "";
    const g = greeting();
    el.append(document.createTextNode(g + ", "));
    const em = document.createElement("em"); em.textContent = n || "toi"; el.append(em);
    el.append(document.createTextNode("."));
  }

  const nextDose = bag(C.doses);
  let doseIdx = hash("dose" + dayKey()) % C.doses.length;
  function renderDose(animate) {
    const el = $("#dose-text");
    animate ? swapText(el, C.doses[doseIdx]) : (el.textContent = C.doses[doseIdx]);
    const favs = store.get("favs", []);
    const on = favs.includes(C.doses[doseIdx]);
    $("#dose-fav").setAttribute("aria-pressed", on);
    $("#dose-fav").setAttribute("aria-label", on ? "Ne plus garder cette phrase" : "Garder cette phrase");
  }
  function renderFavs() {
    const favs = store.get("favs", []);
    $("#favs-block").hidden = !favs.length;
    const ul = $("#favs-list");
    ul.textContent = "";
    favs.slice().reverse().forEach(txt => {
      const li = document.createElement("li");
      const p = document.createElement("p"); p.textContent = txt;
      const b = document.createElement("button");
      b.className = "icon-btn"; b.setAttribute("aria-label", "Retirer cette phrase");
      b.innerHTML = '<svg width="18" height="18"><use href="#i-x"/></svg>';
      b.onclick = () => { store.set("favs", store.get("favs", []).filter(f => f !== txt)); renderFavs(); renderDose(false); };
      li.append(p, b); ul.append(li);
    });
  }

  function renderMeteo() {
    const wrap = $("#meteo-pills");
    const today = store.get("meteo", null);
    C.meteo.forEach(m => {
      const b = document.createElement("button");
      b.className = "meteo-pill"; b.dataset.id = m.id;
      b.setAttribute("role", "radio"); b.setAttribute("aria-checked", "false");
      b.innerHTML = `<svg aria-hidden="true"><use href="#i-${m.glyph}"/></svg><span></span>`;
      b.querySelector("span").textContent = m.label;
      b.onclick = () => chooseMeteo(m.id, true);
      wrap.append(b);
    });
    if (today && today.day === dayKey()) chooseMeteo(today.id, false);
  }
  function chooseMeteo(id, fresh) {
    const m = C.meteo.find(x => x.id === id);
    if (!m) return;
    $$(".meteo-pill").forEach(b => b.setAttribute("aria-checked", b.dataset.id === id));
    const saved = store.get("meteo", null);
    const bi = fresh ? Math.floor(Math.random() * m.bulletins.length) : (saved && saved.b) || 0;
    store.set("meteo", { day: dayKey(), id, b: bi });
    $("#bulletin").hidden = false;
    $("#bulletin-text").textContent = m.bulletins[bi];
    $("#bulletin-tip").textContent = m.conseil;
    if (fresh) { const bl = $("#bulletin"); bl.style.animation = "none"; void bl.offsetWidth; bl.style.animation = ""; }
  }

  function renderMission() {
    const d = new Date();
    $("#mission-num").textContent = "n° " + dayOfYear(d);
    $("#mission-text").textContent = C.missions[hash("mission" + dayKey()) % C.missions.length];
    const m = store.get("mission", { last: null, streak: 0 });
    const done = m.last === dayKey();
    $(".mission").classList.toggle("is-done", done);
    $("#mission-done span").textContent = done ? "Bravo, c'est fait !" : "C'est fait !";
    const y = new Date(); y.setDate(y.getDate() - 1);
    const alive = done || m.last === dayKey(y);
    const s = alive ? m.streak : 0;
    $("#streak").hidden = s < 2;
    $("#streak").textContent = `🔥 ${s} jours d'affilée`;
  }
  function completeMission(btn) {
    const m = store.get("mission", { last: null, streak: 0 });
    if (m.last === dayKey()) { toast("Déjà fait aujourd'hui. Tu es en avance sur la vie."); return; }
    const y = new Date(); y.setDate(y.getDate() - 1);
    const streak = m.last === dayKey(y) ? m.streak + 1 : 1;
    store.set("mission", { last: dayKey(), streak });
    renderMission();
    burstFrom(btn); vibrate([20, 40, 20]);
    toast(streak > 1 ? `Mission accomplie. ${streak} jours de suite, légende !` : "Mission accomplie. Applaudissements dans la salle !");
  }

  /* ═════════ LE BOCAL ═════════ */
  const MARBLE_COLORS = ["#FF5B3A", "#FFCB47", "#F7B7C8", "#CBB9FF", "#A8CBB2", "#9CCBF0"];
  function marblePos(i) {
    // empilement en quinconce depuis le fond du bocal
    const r = 13, perRow = 8, row = Math.floor(i / perRow), col = i % perRow;
    const off = row % 2 ? r : 0;
    const j = (hash("m" + i) % 7) - 3;
    return { x: 40 + off + col * (r * 2 + 1.5) + j * .6, y: 290 - row * (r * 1.75) + (hash("y" + i) % 5) - 2, r };
  }
  function renderJar(newIndex = -1) {
    const wins = store.get("wins", []);
    const g = $("#jar-marbles");
    g.textContent = "";
    const shown = Math.min(wins.length, 88);
    for (let i = 0; i < shown; i++) {
      const p = marblePos(i);
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", p.x); c.setAttribute("cy", p.y); c.setAttribute("r", p.r);
      c.setAttribute("fill", MARBLE_COLORS[(wins[i].c ?? i) % MARBLE_COLORS.length]);
      c.setAttribute("class", "marble" + (i === newIndex ? " is-new" : ""));
      g.append(c);
    }
    $("#jar-count-num").textContent = wins.length;
    $("#jar-count").textContent = wins.length > 1 ? "fiertés" : "fierté";
    $("#jar").setAttribute("aria-label", `${wins.length} ${wins.length > 1 ? "fiertés" : "fierté"} dans le bocal`);
  }
  function renderWins() {
    const wins = store.get("wins", []);
    const ul = $("#wins");
    ul.textContent = "";
    if (!wins.length) {
      const li = document.createElement("li"); li.className = "wins-empty";
      li.style.display = "block";
      li.textContent = "Ton bocal attend sa première bille. Même minuscule, elle compte.";
      ul.append(li); return;
    }
    wins.map((w, i) => ({ w, i })).reverse().forEach(({ w, i }) => {
      const li = document.createElement("li");
      const dot = document.createElement("span"); dot.className = "dot"; dot.style.background = MARBLE_COLORS[(w.c ?? i) % MARBLE_COLORS.length];
      const body = document.createElement("div");
      const p = document.createElement("p"); p.textContent = w.t;
      const t = document.createElement("time"); t.dateTime = w.d; t.textContent = fmtShort.format(new Date(w.d));
      body.append(p, t);
      const del = document.createElement("button");
      del.className = "icon-btn"; del.setAttribute("aria-label", "Retirer cette fierté");
      del.innerHTML = '<svg width="18" height="18"><use href="#i-x"/></svg>';
      del.onclick = () => {
        const all = store.get("wins", []); all.splice(i, 1); store.set("wins", all);
        renderJar(); renderWins();
      };
      li.append(dot, body, del); ul.append(li);
    });
  }
  function addWin(text) {
    text = text.trim();
    if (!text) return;
    const wins = store.get("wins", []);
    wins.push({ t: cap(text), d: new Date().toISOString(), c: Math.floor(Math.random() * MARBLE_COLORS.length) });
    store.set("wins", wins);
    renderJar(wins.length - 1); renderWins();
    const cheers = ["Dans le bocal ! Quelle classe.", "Une bille de plus. Tu brilles.", "Noté, tamponné, admiré.", "Fierté enregistrée. Bravo, toi."];
    toast(pick(cheers)); vibrate(25);
    if (wins.length % 10 === 0) { confetti(); toast(`${wins.length} fiertés ! On sort le champagne (ou le thé).`); }
  }
  function shakeJar() {
    const wins = store.get("wins", []);
    const jar = $("#jar");
    jar.classList.remove("is-shaking"); void jar.getBoundingClientRect(); jar.classList.add("is-shaking");
    vibrate([15, 30, 15, 30, 15]);
    if (!wins.length) { toast("Le bocal est vide… pour l'instant. Ajoute ta première fierté !"); return; }
    const w = pick(wins);
    setTimeout(() => {
      $("#memory").hidden = false;
      $("#memory-date").textContent = `Le ${fmtShort.format(new Date(w.d))}, tu as été fière de :`;
      swapText($("#memory-text"), `« ${w.t} »`);
    }, reduceMotion ? 0 : 500);
  }

  /* ═════════ LES PERMIS ═════════ */
  const nextPermit = bag(C.permis);
  let permit = null, permitNo = "", permitIdx = -1;
  function newPermitNo() { return "N° PET-" + new Date().getFullYear() + "-" + String(Math.floor(10000 + Math.random() * 89999)); }
  function setPermit(p) {
    permit = p; permitNo = newPermitNo();
    $("#stamp").classList.remove("is-on");
    $("#permit-no").textContent = permitNo;
    swapText($("#permit-title"), p.titre);
    $("#permit-article").textContent = p.article;
    $("#permit-name").textContent = name() || "toi-même, évidemment";
    $("#permit-date").textContent = fmtShort.format(new Date());
    $("#permit-stamp").disabled = false;
  }
  function stampPermit() {
    const s = $("#stamp");
    if (s.classList.contains("is-on")) { toast("Déjà accordé. On ne revient pas sur une décision du Ministère."); return; }
    s.classList.add("is-on");
    const f = $("#permit"); f.classList.remove("is-thud"); void f.offsetWidth; f.classList.add("is-thud");
    setTimeout(() => { vibrate(40); burstFrom(s); toast("Accordé. Le Ministère te souhaite une excellente indulgence."); }, reduceMotion ? 0 : 420);
  }

  function wrapLines(ctx, text, maxW) {
    const words = text.split(" "), lines = [];
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    }
    if (line) lines.push(line);
    return lines;
  }
  async function permitImage() {
    await Promise.all([
      document.fonts.load('600 80px "Fraunces"'), document.fonts.load('italic 400 40px "Fraunces"'), document.fonts.load('700 30px "Outfit"')
    ]).catch(() => {});
    const W = 1080, H = 1350, cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const x = cv.getContext("2d");
    const INK = "#22162E", SOFT = "#5B4E66";
    x.fillStyle = "#FF5B3A"; x.fillRect(0, 0, W, H);
    // feuille
    x.fillStyle = "#FFFBF3"; x.beginPath(); x.roundRect(60, 60, W - 120, H - 120, 36); x.fill();
    // guilloché
    x.save(); x.beginPath(); x.roundRect(90, 90, W - 180, H - 180, 22); x.clip();
    x.strokeStyle = "rgba(255,91,58,.12)"; x.lineWidth = 2;
    for (let r = 20; r < 1500; r += 22) { x.beginPath(); x.arc(W / 2, H + 180, r, 0, Math.PI * 2); x.stroke(); }
    x.restore();
    x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.roundRect(90, 90, W - 180, H - 180, 22); x.stroke();
    x.setLineDash([8, 8]); x.lineWidth = 2; x.strokeStyle = "rgba(34,22,46,.4)"; x.beginPath(); x.roundRect(106, 106, W - 212, H - 212, 16); x.stroke(); x.setLineDash([]);

    x.textAlign = "center"; x.fillStyle = INK;
    x.font = '700 26px "Outfit", sans-serif'; x.letterSpacing = "6px";
    x.fillText("MINISTÈRE DE L'INDULGENCE PERSONNELLE", W / 2, 200);
    x.letterSpacing = "2px"; x.fillStyle = SOFT; x.font = '500 26px "Outfit", sans-serif';
    x.fillText(permitNo, W / 2, 246);
    x.letterSpacing = "0px";

    x.fillStyle = INK; x.font = '600 84px "Fraunces", serif';
    const tl = wrapLines(x, permit.titre, 780);
    let y = 400;
    tl.forEach(l => { x.fillText(l, W / 2, y); y += 92; });
    x.fillStyle = SOFT; x.font = 'italic 400 38px "Fraunces", serif';
    const al = wrapLines(x, permit.article, 760);
    y += 20; al.forEach(l => { x.fillText(l, W / 2, y); y += 50; });

    y = Math.max(y + 60, 900);
    x.fillStyle = INK; x.font = '400 32px "Outfit", sans-serif';
    x.fillText("Délivré à", W / 2, y);
    x.font = 'italic 600 48px "Fraunces", serif';
    x.fillText(name() || "toi-même, évidemment", W / 2, y + 60);
    x.font = '400 30px "Outfit", sans-serif';
    x.fillText("le " + fmtShort.format(new Date()), W / 2, y + 108);

    x.fillRect(W / 2 - 110, 1136, 220, 2);
    x.font = 'italic 400 36px "Fraunces", serif';
    x.fillText("La Direction de Toi-Même", W / 2, 1186);

    // tampon
    if ($("#stamp").classList.contains("is-on")) {
      x.save(); x.translate(830, 1045); x.rotate(-.28); x.globalAlpha = .9; x.strokeStyle = x.fillStyle = "#E2401F";
      x.lineWidth = 7; x.beginPath(); x.arc(0, 0, 130, 0, 7); x.stroke();
      x.lineWidth = 3; x.beginPath(); x.arc(0, 0, 112, 0, 7); x.stroke();
      x.font = '800 38px "Fraunces", serif'; x.letterSpacing = "3px"; x.textBaseline = "middle";
      x.fillText("ACCORDÉ", 0, 2);
      x.restore();
    }
    x.fillStyle = "#FFFBF3"; x.font = 'italic 600 34px "Fraunces", serif'; x.textAlign = "right";
    x.fillText("Pétillante", W - 70, H - 20);
    return new Promise(res => cv.toBlob(res, "image/png"));
  }
  async function savePermit() {
    const btn = $("#permit-save"); btn.disabled = true;
    try {
      const blob = await permitImage();
      const file = new File([blob], "permis-petillante.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: permit.titre }); return; }
        catch (e) { if (e.name === "AbortError") return; }
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast("Permis enregistré. À encadrer d'urgence.");
    } finally { btn.disabled = false; }
  }

  /* ═════════ FOU RIRE ═════════ */
  const nextJoke = bag(C.fourire);
  let jokeIdx = -1;
  function panic(btn) {
    jokeIdx = nextJoke(jokeIdx);
    swapText($("#panic-text"), C.fourire[jokeIdx]);
    btn.classList.add("is-pressed"); setTimeout(() => btn.classList.remove("is-pressed"), 140);
    vibrate(30);
    const r = btn.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top + r.height / 3, 60);
  }
  function renderDico() {
    const wrap = $("#dico");
    C.dico.forEach(e => {
      const a = document.createElement("article"); a.className = "dico-card";
      const h = document.createElement("h3"); h.textContent = e.mot;
      const g = document.createElement("p"); g.className = "genre"; g.textContent = e.genre;
      const p = document.createElement("p"); p.textContent = e.def;
      a.append(h, g, p); wrap.append(a);
    });
  }

  /* ═════════ NAVIGATION ═════════ */
  const VIEWS = ["jour", "bocal", "permis", "rire"];
  function route() {
    const v = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : "jour";
    $$(".view").forEach(s => { s.hidden = s.dataset.view !== v; });
    $$(".tabbar a").forEach(a => a.dataset.tab === v ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
    scrollTo({ top: 0, behavior: "instant" });
    if (v === "permis" && !permit) { permitIdx = nextPermit(); setPermit(C.permis[permitIdx]); }
  }

  /* ═════════ RÉGLAGES ═════════ */
  function applyPrefs() {
    document.documentElement.style.setProperty("--scale", store.get("scale", 1));
    const th = store.get("theme", "auto");
    th === "auto" ? document.documentElement.removeAttribute("data-theme") : document.documentElement.setAttribute("data-theme", th);
  }
  function openSettings() {
    const d = $("#settings");
    $("#set-name").value = name();
    $$('input[name="size"]', d).forEach(r => r.checked = +r.value === +store.get("scale", 1));
    $$('input[name="theme"]', d).forEach(r => r.checked = r.value === store.get("theme", "auto"));
    d.showModal();
  }

  /* ═════════ DÉMARRAGE ═════════ */
  function init() {
    applyPrefs();
    $("#today-date").textContent = cap(fmtLong.format(new Date()));
    renderHello(); renderDose(false); renderFavs(); renderMeteo(); renderMission();
    renderJar(); renderWins(); renderDico();

    // idées de fiertés
    C.bocalIdees.forEach(t => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = t;
      b.onclick = () => addWin(t);
      $("#win-ideas").append(b);
    });

    $("#dose-next").onclick = () => { doseIdx = nextDose(doseIdx); renderDose(true); };
    $("#dose-share").onclick = () => share(`« ${C.doses[doseIdx]} »`);
    $("#dose-fav").onclick = e => {
      const txt = C.doses[doseIdx];
      let favs = store.get("favs", []);
      if (favs.includes(txt)) favs = favs.filter(f => f !== txt);
      else { favs.push(txt); toast("Gardée précieusement."); }
      store.set("favs", favs); renderDose(false); renderFavs();
    };
    $("#mission-done").onclick = e => completeMission(e.currentTarget);

    $("#win-form").onsubmit = e => { e.preventDefault(); addWin($("#win-input").value); $("#win-input").value = ""; };
    $("#shake").onclick = shakeJar;

    $("#permit-stamp").onclick = stampPermit;
    $("#permit-random").onclick = () => { permitIdx = nextPermit(permitIdx); setPermit(C.permis[permitIdx]); };
    $("#permit-save").onclick = savePermit;
    $("#permit-form").onsubmit = e => {
      e.preventDefault();
      let t = $("#permit-custom").value.trim().replace(/^(permis\s+)?(de\s+|d['’]\s*)/i, m => /d['’]/i.test(m) ? "d'" : "");
      if (!t) return;
      const titre = /^d'/i.test(t) ? "Permis " + t : "Permis de " + t;
      setPermit({ titre, article: "délivré sur simple demande, sans justificatif" });
      $("#permit-custom").value = ""; $(".custom-permit").open = false;
      $("#permit").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    };

    $("#panic").onclick = e => panic(e.currentTarget);

    // réglages
    $("#open-settings").onclick = openSettings;
    $("#set-name").oninput = e => { store.set("name", e.target.value.trim()); renderHello(); if (permit) $("#permit-name").textContent = name() || "toi-même, évidemment"; };
    $$('#settings input[name="size"]').forEach(r => r.onchange = () => { store.set("scale", +r.value); applyPrefs(); });
    $$('#settings input[name="theme"]').forEach(r => r.onchange = () => { store.set("theme", r.value); applyPrefs(); });
    $("#reset").onclick = () => {
      if (!confirm("Tout effacer ? Ton prénom, ton bocal et tes phrases gardées disparaîtront de cet appareil.")) return;
      store.clear(); location.hash = ""; location.reload();
    };

    // première visite
    if (!store.get("onboarded", false)) {
      const ob = $("#onboarding");
      ob.addEventListener("close", () => {
        store.set("name", $("#ob-name").value.trim());
        store.set("onboarded", true);
        renderHello(); confetti();
      }, { once: true });
      ob.showModal();
    }

    addEventListener("hashchange", route);
    route();

    // l'app reste juste si on la rouvre le lendemain
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && $("#today-date").dataset.day !== dayKey()) {
        $("#today-date").dataset.day = dayKey();
        $("#today-date").textContent = cap(fmtLong.format(new Date()));
        renderHello(); renderMission();
      }
    });
    $("#today-date").dataset.day = dayKey();

    if ("serviceWorker" in navigator && location.protocol === "https:") {
      navigator.serviceWorker.register("sw.js", { scope: "./" }).catch(() => {});
    }
  }

  init();
})();
