// "IA editando en vivo": animacion que muestra como se edito una foto.
// Usa datos reales de la edicion (los guarda la app de Zing junto a cada foto):
// la foto "antes" (mismo encuadre), las caras detectadas, cuanta luz subio,
// el enderezado, la limpieza de ruido y los segundos que tardo.
//
//   await ZingIA.animar({ raiz, antes, despues, llena, datos })
//     raiz:    elemento a pantalla completa donde se dibuja (position relative/absolute)
//     antes:   <img> ya cargada de la foto sin editar
//     despues: <img> ya cargada de la foto editada (la que queda al final, debajo)
//     llena:   true si la foto se muestra recortada llenando la pantalla (object-fit: cover)
//     datos:   { caras: [[x0,y0,x1,y1]...] (0-1), exposicion, enderezado, ruido, balance, segundos }
(() => {
  const css = `
  .ia { position: absolute; inset: 0; z-index: 4; pointer-events: none; --uu: var(--u, min(1vw, 1.78vh)); font-family: var(--titulo, sans-serif);
    opacity: 0; transition: opacity 1s ease; }
  .ia.on { opacity: 1; }
  .ia.fuera { opacity: 0; transition: opacity .9s ease; }
  .ia .antes { position: absolute; inset: 0; overflow: hidden; }
  .ia .antes .fondo { position: absolute; inset: -40px; background-size: cover; background-position: center; filter: blur(40px) brightness(.45) saturate(1.1); transform: scale(1.1); }
  .ia .antes .foto { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
  .ia .antes img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .ia.llena .antes img { width: 100%; height: 100%; object-fit: cover; }
  .ia .grilla { position: absolute; inset: 0; opacity: 0; mix-blend-mode: screen;
    background: repeating-linear-gradient(0deg, rgba(255,50,102,.10) 0 1px, transparent 1px calc(4 * var(--uu))),
                repeating-linear-gradient(90deg, rgba(255,50,102,.10) 0 1px, transparent 1px calc(4 * var(--uu))); }
  .ia .barrido { position: absolute; top: 0; bottom: 0; left: 0; width: calc(.5 * var(--uu)); transform: translateX(-50%); opacity: 0;
    background: linear-gradient(180deg, #ffe02f, #ff7a00 30%, #ff3266 70%, #d50d7e);
    box-shadow: 0 0 calc(2 * var(--uu)) #ff3266, 0 0 calc(6 * var(--uu)) rgba(255,50,102,.8), 0 0 calc(14 * var(--uu)) rgba(255,122,0,.5); }
  .ia .cara { position: absolute; opacity: 0; transform: scale(1.25); transition: opacity .35s, transform .5s cubic-bezier(.2,1.4,.4,1); }
  .ia .cara.on { opacity: 1; transform: none; }
  .ia .cara i { position: absolute; width: 28%; height: 28%; max-width: calc(4 * var(--uu)); max-height: calc(4 * var(--uu)); border: calc(.35 * var(--uu)) solid #37f5b0; filter: drop-shadow(0 0 calc(.6 * var(--uu)) rgba(55,245,176,.8)); }
  .ia .cara i:nth-child(1) { top: 0; left: 0; border-right: 0; border-bottom: 0; }
  .ia .cara i:nth-child(2) { top: 0; right: 0; border-left: 0; border-bottom: 0; }
  .ia .cara i:nth-child(3) { bottom: 0; left: 0; border-right: 0; border-top: 0; }
  .ia .cara i:nth-child(4) { bottom: 0; right: 0; border-left: 0; border-top: 0; }
  .ia .cara b { position: absolute; left: 0; bottom: 100%; margin-bottom: calc(.6 * var(--uu)); white-space: nowrap; padding: calc(.25 * var(--uu)) calc(.7 * var(--uu));
    border-radius: calc(.3 * var(--uu)); background: rgba(7,3,26,.75); color: #37f5b0; font: 500 calc(1 * var(--uu)) var(--mono, monospace); letter-spacing: .12em; }
  @keyframes iaLatido { 50% { opacity: .25; } }
  .ia .panel { position: absolute; left: calc(3 * var(--uu)); top: 50%; transform: translate(-30%, -50%); opacity: 0; transition: .7s cubic-bezier(.2,.9,.3,1);
    min-width: calc(30 * var(--uu)); padding: calc(2 * var(--uu)) calc(2.4 * var(--uu)); border-radius: calc(1.2 * var(--uu));
    background: rgba(7,3,26,.78); border: 1px solid rgba(255,122,150,.38); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: 0 calc(1 * var(--uu)) calc(5 * var(--uu)) rgba(0,0,0,.5); }
  .ia .panel.on { opacity: 1; transform: translate(0, -50%); }
  .ia .panel.der { left: auto; right: calc(3 * var(--uu)); transform: translate(30%, -50%); }
  .ia .panel.der.on { transform: translate(0, -50%); }
  .ia .vivo-ia { display: inline-flex; align-items: center; gap: calc(.9 * var(--uu)); margin-bottom: calc(1.6 * var(--uu)); padding: calc(.8 * var(--uu)) calc(1.6 * var(--uu));
    border-radius: 99px; background: var(--zing, #ff3266); color: #1a0630; font: 700 calc(1.5 * var(--uu)) var(--titulo, sans-serif); letter-spacing: .1em;
    text-transform: uppercase; white-space: nowrap; box-shadow: 0 0 calc(3 * var(--uu)) rgba(255,50,102,.6); }
  .ia .vivo-ia i { width: calc(.9 * var(--uu)); height: calc(.9 * var(--uu)); border-radius: 50%; background: #1a0630; animation: iaLatido 1s infinite; }
  .ia .panel h3 { margin: 0 0 calc(1.4 * var(--uu)); font: 700 calc(1.7 * var(--uu)) var(--titulo, sans-serif); letter-spacing: .14em; text-transform: uppercase; }
  .ia .panel h3 span { background: var(--zing, #ff3266); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .ia .paso { display: flex; align-items: center; gap: calc(1.1 * var(--uu)); margin: calc(.9 * var(--uu)) 0; font: 500 calc(1.55 * var(--uu)) var(--titulo, sans-serif); color: rgba(246,239,255,.35); transition: color .3s; }
  .ia .paso em { font-style: normal; margin-left: auto; padding-left: calc(1.5 * var(--uu)); font: calc(1.25 * var(--uu)) var(--mono, monospace); color: #ffe02f; opacity: 0; transition: opacity .3s; }
  .ia .paso s { flex: none; width: calc(1.8 * var(--uu)); height: calc(1.8 * var(--uu)); border-radius: 50%; border: calc(.25 * var(--uu)) solid rgba(255,255,255,.18); text-decoration: none; display: grid; place-items: center; font-size: calc(1.1 * var(--uu)); }
  .ia .paso.trabaja { color: #f6efff; }
  .ia .paso.trabaja s { border-color: rgba(255,255,255,.12); border-top-color: #ff3266; animation: iaGira .7s linear infinite; }
  .ia .paso.listo { color: #f6efff; }
  .ia .paso.listo s { border-color: transparent; background: #37f5b0; color: #07031a; }
  .ia .paso.listo s::after { content: "✓"; font-weight: 700; }
  .ia .paso.listo em { opacity: 1; }
  @keyframes iaGira { to { transform: rotate(360deg); } }
  .ia .total { margin-top: calc(1.6 * var(--uu)); padding-top: calc(1.4 * var(--uu)); border-top: 1px solid rgba(255,122,150,.25); opacity: 0; transition: opacity .5s;
    font: 700 calc(1.9 * var(--uu)) var(--titulo, sans-serif); letter-spacing: .06em; text-transform: uppercase; color: #37f5b0; }
  .ia .total.on { opacity: 1; }
  `;
  function estilos(raiz) {
    if (!document.getElementById("ia-css")) {
      const s = document.createElement("style"); s.id = "ia-css"; s.textContent = css; document.head.append(s);
    }
    // En las paginas de la web (#zing-landing) hay estilos generales que pisan a estos:
    // se repiten con mas prioridad, solo dentro de la pantalla de la animacion.
    if (raiz.closest("#zing-landing") && !document.getElementById("ia-css-web")) {
      const s = document.createElement("style"); s.id = "ia-css-web";
      s.textContent = css.replace(/^  \.ia/gm, "  #zing-landing .zl-ia-escena .ia");
      document.head.append(s);
    }
  }
  const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms));
  const num = (x, d = 1) => (Math.round(x * 10 ** d) / 10 ** d).toLocaleString("es-AR", { minimumFractionDigits: d, maximumFractionDigits: d });

  // Donde queda un punto (0-1) de la foto en la pantalla, para "contain" o "cover".
  function mapeo(raiz, img, llena) {
    const R = raiz.getBoundingClientRect(), W = R.width, H = R.height;
    const nw = img.naturalWidth, nh = img.naturalHeight;
    const k = llena ? Math.max(W / nw, H / nh) : Math.min(W / nw, H / nh);
    const w = nw * k, h = nh * k, x0 = (W - w) / 2, y0 = (H - h) / 2;
    return (u, v) => [x0 + u * w, y0 + v * h];
  }

  async function animar({ raiz, antes, despues, llena, datos }) {
    estilos(raiz);
    const d = datos || {};
    const el = document.createElement("div");
    el.className = "ia" + (llena ? " llena" : "");
    el.innerHTML = `<div class="antes"><div class="fondo"></div><div class="foto"><img alt="" /></div></div>
      <div class="grilla"></div><div class="barrido"></div>
      <div class="panel"><div class="vivo-ia"><i></i>IA editando en vivo</div><h3><span>✦ IA Zing</span></h3><div class="pasos"></div><div class="total"></div></div>`;
    el.querySelector(".fondo").style.backgroundImage = `url("${antes.src}")`;
    el.querySelector(".antes img").src = antes.src;
    raiz.append(el);

    const pasos = [["Analizando la escena", ""]];
    if (d.caras?.length) pasos.push([d.caras.length === 1 ? "Rostro detectado" : "Rostros detectados", String(d.caras.length)]);
    if (d.balance !== false) pasos.push(["Balance de blancos", "auto"]);
    if (typeof d.exposicion === "number") pasos.push(["Exposición", `${d.exposicion >= 0 ? "+" : "−"}${num(Math.abs(d.exposicion))} EV`]);
    if (d.ruido) pasos.push(["Reducción de ruido", `${d.ruido}%`]);
    if (d.enderezado) pasos.push(["Enderezado", `${num(Math.abs(d.enderezado))}°`]);
    pasos.push(["Color y nitidez", "Zing"]);
    el.querySelector(".pasos").innerHTML = pasos.map(([t, v]) => `<div class="paso"><s></s>${t}<em>${v}</em></div>`).join("");
    const filas = [...el.querySelectorAll(".paso")];

    // Recuadros en las caras (posicion real que detecto la edicion)
    const donde = mapeo(raiz, despues, llena);
    const caras = (d.caras || []).slice(0, 6).map((c) => {
      const [x0, y0] = donde(c[0], c[1]), [x1, y1] = donde(c[2], c[3]);
      const m = (x1 - x0) * 0.12;
      const b = document.createElement("div");
      b.className = "cara";
      Object.assign(b.style, { left: x0 - m + "px", top: y0 - m + "px", width: x1 - x0 + 2 * m + "px", height: y1 - y0 + 2 * m + "px" });
      b.innerHTML = "<i></i><i></i><i></i><i></i><b>ROSTRO</b>";
      el.append(b);
      return b;
    });

    // El panel va del lado donde no estan las caras.
    if (d.caras?.length) {
      const medio = d.caras.reduce((s, c) => s + (c[0] + c[2]) / 2, 0) / d.caras.length;
      if (medio < 0.45) el.querySelector(".panel").classList.add("der");
    }

    // --- Linea de tiempo (~7 s) ---
    requestAnimationFrame(() => el.classList.add("on"));
    await esperar(1100);
    el.querySelector(".panel").classList.add("on");
    el.querySelector(".grilla").animate([{ opacity: 0 }, { opacity: 1 }, { opacity: .6 }], { duration: 1400, fill: "forwards" });
    filas[0].classList.add("trabaja");
    await esperar(500);
    caras.forEach((b, i) => setTimeout(() => b.classList.add("on"), i * 220));
    await esperar(700);
    filas[0].classList.replace("trabaja", "listo");

    // Barrido: la foto editada aparece a medida que pasa la linea
    const DURA = 3200;
    const curva = "cubic-bezier(.55,.05,.35,1)";
    el.querySelector(".antes").animate([{ clipPath: "inset(0 0 0 0%)" }, { clipPath: "inset(0 0 0 100%)" }], { duration: DURA, easing: curva, fill: "forwards" });
    el.querySelector(".grilla").animate([{ clipPath: "inset(0 0 0 0%)" }, { clipPath: "inset(0 0 0 100%)" }], { duration: DURA, easing: curva, fill: "forwards" });
    const b = el.querySelector(".barrido");
    b.animate([{ left: "0%", opacity: 1 }, { left: "100%", opacity: 1 }], { duration: DURA, easing: curva, fill: "forwards" });
    const resto = filas.slice(1);
    const tramo = DURA / Math.max(1, resto.length);
    for (const f of resto) {
      f.classList.add("trabaja");
      await esperar(tramo * 0.75);
      f.classList.replace("trabaja", "listo");
      await esperar(tramo * 0.25);
    }
    b.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" });
    caras.forEach((c) => (c.style.transition = "opacity .8s", c.style.opacity = "0"));
    const total = el.querySelector(".total");
    total.textContent = d.segundos ? `✓ Lista en ${num(d.segundos)} segundos` : "✓ Lista";
    total.classList.add("on");
    await esperar(1700);
    el.classList.add("fuera");
    await esperar(900);
    el.remove();
  }

  window.ZingIA = { animar };
})();
