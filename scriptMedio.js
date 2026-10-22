// Posições em % da cena. zone = área correta (x,y,w,h). outside = vale se o centro estiver fora da área.
const Q = [
  {
    t: "Coloque o ursinho <b>EM CIMA</b> da cama.", say: "Coloque o ursinho em cima da cama.",
    objs: [{ e: "🛏️", x: 50, y: 70, s: 150 }, { e: "🪑", x: 14, y: 72, s: 80 }], item: { e: "🧸", x: 84, y: 80, s: 70 }, zone: { x: 50, y: 65, w: 4, h: 4 }
  },
  {
    t: "Coloque o sapato <b>EMBAIXO</b> da cadeira.", say: "Coloque o sapato embaixo da cadeira.",
    objs: [{ e: "🪑", x: 50, y: 50, s: 150 }, { e: "🛏️", x: 88, y: 75, s: 60 }], item: { e: "👟", x: 85, y: 22, s: 64 }, zone: { x: 50, y: 60, w: 4, h: 10 }
  },
  {
    t: "Coloque o lápis <b>DENTRO</b> do estojo.", say: "Coloque o lápis dentro do estojo.",
    objs: [{ e: "📚", x: 12, y: 70, s: 70 }, { e: "🍎", x: 90, y: 70, s: 50 }], caseBox: { x: 50, y: 66, w: 52, h: 26 }, item: { e: "✏️", x: 82, y: 25, s: 70 }, zone: { x: 26, y: 52, w: 48, h: 28 }
  },
  {
    t: "Coloque a bola <b>FORA</b> da caixa.", say: "Coloque a bola fora da caixa.",
    objs: [{ e: "📦", x: 50, y: 60, s: 150 }], item: { e: "⚽", x: 50, y: 62, s: 56 }, outside: { x: 26, y: 25, w: 2, h: 2 }, zone: { x: 26, y: 25, w: 2, h: 2 }
  },
  {
    t: "Coloque a estrela do lado <b>ESQUERDO</b> da lua.", say: "Coloque a estrela do lado esquerdo da lua.",
    dark: true, objs: [{ e: "🌙", x: 50, y: 48, s: 140 }], item: { e: "⭐", x: 86, y: 78, s: 64 }, zone: { x: 4, y: 15, w: 34, h: 72 }
  },
  {
    t: "Coloque o sol do lado <b>DIREITO</b> da nuvem.", say: "Coloque o sol do lado direito da nuvem.",
    objs: [{ e: "☁️", x: 50, y: 48, s: 150 }], item: { e: "☀️", x: 14, y: 78, s: 70 }, zone: { x: 64, y: 15, w: 33, h: 72 }
  }
];

const $ = id => document.getElementById(id);
const scene = $("scene"), hint = $("hint"), msg = $("msg");
let cur = 0, score = 0, item = null, locked = false, tries = 0;

function beep(f, d = .15, type = "sine") {
  try {
    const a = beep.a || (beep.a = new (window.AudioContext || window.webkitAudioContext)());
    const o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.value = f; g.gain.value = .12; o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + d);
  } catch (e) { }
}
function speak(t) { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = "pt-BR"; u.rate = .85; u.pitch = 1.2; speechSynthesis.speak(u); } catch (e) { } }
function show(t, ms = 1300) { msg.textContent = t; msg.style.display = "block"; clearTimeout(show.t); show.t = setTimeout(() => msg.style.display = "none", ms); }

function buildProg() { const p = $("prog"); p.innerHTML = ""; Q.forEach((_, i) => { const d = document.createElement("div"); d.className = "dot" + (i < cur ? " on" : ""); p.appendChild(d); }); }

function load() {
  const q = Q[cur]; locked = false; tries = 0;
  scene.querySelectorAll(".obj,.case,#item").forEach(n => n.remove());
  hint.className = ""; hint.style.display = "none";
  scene.style.background = q.dark ? "linear-gradient(#1c2a6b,#3b4fa8)" : "";
  $("q").innerHTML = q.t; buildProg();
  if (q.caseBox) {
    const c = document.createElement("div"); c.className = "case";
    Object.assign(c.style, { left: q.caseBox.x + "%", top: q.caseBox.y + "%", width: q.caseBox.w + "%", height: q.caseBox.h + "%" }); scene.appendChild(c);
  }
  q.objs.forEach(o => {
    const d = document.createElement("div"); d.className = "obj"; d.textContent = o.e;
    Object.assign(d.style, { left: o.x + "%", top: o.y + "%", fontSize: o.s + "px" }); scene.appendChild(d);
  });
  item = document.createElement("div"); item.id = "item"; item.textContent = q.item.e;
  Object.assign(item.style, { left: q.item.x + "%", top: q.item.y + "%", fontSize: (q.item.s * 1.3) + "px" });
  scene.appendChild(item); bindDrag(); setTimeout(() => speak(q.say), 300);
}

function bindDrag() {
  let dragging = false, ox = 0, oy = 0;
  item.addEventListener("pointerdown", e => { if (locked) return; e.preventDefault(); dragging = true; item.setPointerCapture(e.pointerId); const ib = item.getBoundingClientRect(); ox = e.clientX - (ib.left + ib.width / 2); oy = e.clientY - (ib.top + ib.height / 2); item.classList.remove("back"); item.classList.add("drag"); });
  item.addEventListener("pointermove", e => {
    if (!dragging) return; const r = scene.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - ox - r.left, 20), r.width - 20), y = Math.min(Math.max(e.clientY - oy - r.top, 20), r.height - 20);
    item.style.left = x + "px"; item.style.top = y + "px";
  });
  const end = e => {
    if (!dragging) return; dragging = false; item.classList.remove("drag");
    const r = scene.getBoundingClientRect(), cx = (parseFloat(item.style.left) / r.width * 100), cy = (parseFloat(item.style.top) / r.height * 100);
    // se o valor ainda estiver em % (não moveu), parseFloat já dá %, então converte só se tiver "px"
    const px = item.style.left.endsWith("px");
    const X = px ? cx : parseFloat(item.style.left), Y = px ? cy : parseFloat(item.style.top);
    check(X, Y);
  };
  item.addEventListener("pointerup", end); item.addEventListener("pointercancel", end);
}

function inside(X, Y, z) { return X >= z.x && X <= z.x + z.w && Y >= z.y && Y <= z.y + z.h; }

function check(X, Y) {
  const q = Q[cur]; const P = 2, z = q.zone; const ok = q.outside ? (X < 36 || X > 64 || Y < 28 || Y > 92) : inside(X, Y, { x: z.x - P, y: z.y - P, w: z.w + 2 * P, h: z.h + 2 * P });
  if (ok) { win(); return; }
  tries++; beep(220, .25, "triangle"); show("Tente de novo! 💪");
  item.classList.add("back"); item.style.left = q.item.x + "%"; item.style.top = q.item.y + "%";
  if (tries >= 1 && !q.outside) {
    const z = q.zone; Object.assign(hint.style, { left: z.x + "%", top: z.y + "%", width: z.w + "%", height: z.h + "%" });
    hint.className = "show"; setTimeout(() => hint.className = "", 2000);
  }
  else if (tries >= 2) { show("Tire a bola da caixa! 📦", 1800); }
}

function win() {
  locked = true; score++; $("score").textContent = score;
  beep(660, .12); setTimeout(() => beep(880, .12), 130); setTimeout(() => beep(1100, .2), 260);
  show("Muito bem! 🎉", 1400); confetti();
  const t = Q[cur].say.replace("Coloque", "Isso mesmo!");
  setTimeout(() => { cur++; cur < Q.length ? load() : finish(); }, 1700);
}
function confetti() {
  const em = ["⭐", "🎉", "✨", "🎈"];
  for (let i = 0; i < 22; i++) {
    const c = document.createElement("div"); c.className = "conf"; c.textContent = em[i % 4];
    c.style.left = Math.random() * 100 + "%"; c.style.animationDelay = Math.random() * .5 + "s"; $("game").appendChild(c); setTimeout(() => c.remove(), 2400);
  }
}
function finish() { buildProg(); localStorage.setItem("jogo_pontos", score); localStorage.setItem("jogo_maximo", Q.length); localStorage.setItem("jogo_dificuldade", "medio"); $("final").textContent = score; $("end").style.display = "flex"; speak("Parabéns! Você acertou tudo!"); confetti(); setTimeout(() => { window.location.href = "telaDeResultado.html"; }, 2600); }
function restart() { cur = 0; score = 0; $("score").textContent = 0; $("end").style.display = "none"; load(); }

$("go").onclick = () => { $("start").style.display = "none"; beep(700); load(); };
$("again").onclick = restart; $("back").onclick = restart; $("say").onclick = () => speak(Q[cur].say);
