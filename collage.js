// Collage para Instagram: el invitado elige hasta 3 fotos y se arma una imagen
// con el nombre del evento y @zingproducciones, lista para compartir (historia
// 1080x1920 o publicacion 1080x1350). Todo se hace en el celular (canvas).
(() => {
  const MAX = 3;
  const INSTAGRAM = "@zingproducciones";
  const FORMATOS = { historia: [1080, 1920], post: [1080, 1350] };
  let ctx = null, elegidas = [], formato = "historia", ultimo = null;

  const css = `
  .c-barra { position: fixed; z-index: 25; left: 10px; right: 10px; bottom: calc(14px + env(safe-area-inset-bottom)); display: flex; gap: 8px; align-items: center;
    padding: 10px 10px 10px 16px; border-radius: 16px; background: rgba(18, 9, 52, .96); border: 1px solid var(--linea-2); box-shadow: 0 10px 30px rgba(0,0,0,.5); }
  .c-barra .txt { flex: 1; font: 600 14px var(--cuerpo); line-height: 1.25; }
  .c-barra .txt small { display: block; font: 11px var(--mono); color: var(--suave); letter-spacing: .04em; }
  .c-barra .btn { padding: 12px 16px; font-size: 13px; }
  .c-barra .x { width: 40px; height: 40px; flex: none; border-radius: 50%; border: 1px solid var(--linea-2); background: transparent; font-size: 16px; cursor: pointer; }
  .foto.c-elegible { cursor: pointer; }
  .foto .c-marca { position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center;
    font: 700 14px var(--titulo); border: 2px solid #fff; background: rgba(7,3,26,.45); color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.4); }
  .foto.c-on { box-shadow: 0 0 0 3px var(--rosa), 0 0 20px rgba(255,50,102,.5); }
  .foto.c-on img { opacity: .82; }
  .foto.c-on .c-marca { background: var(--zing); color: #1a0630; border-color: transparent; }
  .c-modal { position: fixed; inset: 0; z-index: 35; background: rgba(4, 2, 14, .97); display: flex; flex-direction: column; align-items: center;
    padding: calc(12px + env(safe-area-inset-top)) 16px calc(16px + env(safe-area-inset-bottom)); gap: 12px; }
  .c-modal .prev { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; width: 100%; }
  .c-modal .prev img { max-width: 100%; max-height: 100%; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,.6); }
  .c-modal .formatos { display: flex; gap: 6px; }
  .c-modal .acc { display: flex; gap: 10px; width: 100%; max-width: 440px; }
  .c-modal .acc .btn { flex: 1; padding: 14px 10px; }
  .c-modal .tip { font: 12px var(--mono); color: var(--suave); text-align: center; }
  .c-modal .cerrar { position: absolute; top: calc(10px + env(safe-area-inset-top)); right: 12px; width: 42px; height: 42px; border-radius: 50%;
    border: 1px solid var(--linea-2); background: rgba(7,3,26,.7); font-size: 20px; cursor: pointer; }
  .b-collage { cursor: pointer; display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: 99px; border: 1px solid var(--linea-2);
    background: rgba(255,255,255,.05); font: 600 11px var(--titulo); letter-spacing: .1em; text-transform: uppercase; color: var(--texto); }
  `;

  function estilos() {
    if (document.getElementById("c-css")) return;
    const s = document.createElement("style"); s.id = "c-css"; s.textContent = css; document.head.append(s);
  }

  // --- Elegir fotos ----------------------------------------------------------
  function iniciar(c) {
    ctx = c; estilos(); elegidas = [];
    document.body.classList.add("c-activo");
    document.querySelectorAll(".foto").forEach((el) => el.classList.add("c-elegible"));
    document.getElementById("b-subir").hidden = true;
    const b = document.createElement("div");
    b.className = "c-barra"; b.id = "c-barra";
    b.innerHTML = `<div class="txt" id="c-txt"></div><button class="btn" id="c-crear" disabled>Armar</button><button class="x" id="c-salir" aria-label="Cancelar">✕</button>`;
    document.body.append(b);
    document.getElementById("c-salir").onclick = salir;
    document.getElementById("c-crear").onclick = armar;
    api.activo = true;
    actualizar();
  }

  function salir() {
    api.activo = false; elegidas = [];
    document.getElementById("c-barra")?.remove();
    document.querySelectorAll(".foto").forEach((el) => { el.classList.remove("c-elegible", "c-on"); el.querySelector(".c-marca")?.remove(); });
    document.getElementById("b-subir").hidden = false;
  }

  function tocar(f, el) {
    const i = elegidas.findIndex((x) => x.id === f.id);
    if (i >= 0) elegidas.splice(i, 1);
    else if (elegidas.length >= MAX) return ctx.aviso(`Podés elegir hasta ${MAX} fotos.`);
    else elegidas.push(f);
    actualizar();
  }

  function actualizar() {
    document.querySelectorAll(".foto").forEach((el) => {
      el.classList.add("c-elegible");
      const i = elegidas.findIndex((f) => String(f.id) === el.dataset.id);
      el.classList.toggle("c-on", i >= 0);
      let m = el.querySelector(".c-marca");
      if (!m) { m = document.createElement("span"); m.className = "c-marca"; el.append(m); }
      m.textContent = i >= 0 ? i + 1 : "";
    });
    const n = elegidas.length;
    document.getElementById("c-txt").innerHTML = n ? `${n} de ${MAX} elegidas<small>Tocá ${n < MAX ? "otra foto o armá el collage" : "Armar"}</small>`
      : `Elegí hasta ${MAX} fotos<small>Tocá las que más te gusten</small>`;
    document.getElementById("c-crear").disabled = !n;
  }

  // --- Dibujar -----------------------------------------------------------------
  async function cargar(f) {
    const blob = await (await fetch(ctx.url(f.path, f.id))).blob();
    return createImageBitmap(blob);
  }

  function redondeado(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }

  // La foto llena el recuadro (recorta lo que sobra), centrada un poco arriba: ahi suelen estar las caras.
  function foto(g, img, x, y, w, h) {
    const k = Math.max(w / img.width, h / img.height);
    const sw = w / k, sh = h / k;
    const sx = (img.width - sw) / 2, sy = Math.max(0, Math.min(img.height - sh, (img.height - sh) * 0.4));
    g.save();
    g.shadowColor = "rgba(0,0,0,.55)"; g.shadowBlur = 40; g.shadowOffsetY = 14;
    redondeado(g, x, y, w, h, 26); g.fillStyle = "#000"; g.fill();
    g.restore();
    g.save(); redondeado(g, x, y, w, h, 26); g.clip(); g.drawImage(img, sx, sy, sw, sh, x, y, w, h); g.restore();
    g.save(); redondeado(g, x, y, w, h, 26); g.lineWidth = 3; g.strokeStyle = "rgba(255,255,255,.18)"; g.stroke(); g.restore();
  }

  // Recuadros segun cuantas fotos y el formato (x, y, ancho, alto)
  function recuadros(n, W, H, arriba, abajo) {
    const m = 60, gap = 26, w = W - 2 * m, h = H - arriba - abajo;
    if (n === 1) return [[m, arriba, w, h]];
    if (n === 2) { const hh = (h - gap) / 2; return [[m, arriba, w, hh], [m, arriba + hh + gap, w, hh]]; }
    const grande = Math.round(h * 0.56), chica = h - grande - gap, mitad = (w - gap) / 2;
    return [[m, arriba, w, grande], [m, arriba + grande + gap, mitad, chica], [m + mitad + gap, arriba + grande + gap, mitad, chica]];
  }

  async function dibujar(imgs) {
    const [W, H] = FORMATOS[formato];
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d");
    // Fondo de la marca
    g.fillStyle = "#07031a"; g.fillRect(0, 0, W, H);
    for (const [x, y, r, col] of [[0, 0, W * 0.9, "rgba(255,122,0,.30)"], [W, H * 0.08, W * 0.9, "rgba(213,13,126,.32)"], [W / 2, H * 1.1, W, "rgba(33,0,117,.95)"]]) {
      const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, "rgba(7,3,26,0)");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
    }
    await Promise.all([document.fonts.load("700 60px Chakra"), document.fonts.load("400 30px JetBrains"), document.fonts.load("600 30px Barlow")]).catch(() => {});
    const historia = formato === "historia";
    const arriba = historia ? 330 : 200, abajo = historia ? 250 : 150;

    // Logo y nombre del evento
    const logo = await new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = "/logo.png"; });
    const lh = historia ? 96 : 70;
    if (logo) g.drawImage(logo, (W - logo.width * lh / logo.height) / 2, historia ? 70 : 34, logo.width * lh / logo.height, lh);
    const nombre = (ctx.ev.nombre || "").toUpperCase();
    let tam = historia ? 66 : 54;
    g.font = `700 ${tam}px Chakra, sans-serif`;
    while (g.measureText(nombre).width > W - 120 && tam > 30) { tam -= 2; g.font = `700 ${tam}px Chakra, sans-serif`; }
    const tw = g.measureText(nombre).width;
    const grad = g.createLinearGradient((W - tw) / 2, 0, (W + tw) / 2, 0);
    grad.addColorStop(0, "#ffe02f"); grad.addColorStop(0.32, "#ff7a00"); grad.addColorStop(0.68, "#ff3266"); grad.addColorStop(1, "#d50d7e");
    g.fillStyle = grad; g.textAlign = "center"; g.textBaseline = "alphabetic";
    g.fillText(nombre, W / 2, historia ? 260 : 160);

    recuadros(imgs.length, W, H, arriba, abajo).forEach((r, i) => foto(g, imgs[i], ...r));

    // Pie: fecha y @
    const f = ctx.ev.fecha ? new Date(ctx.ev.fecha + "T12:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }) : "";
    g.fillStyle = "#f6efff"; g.font = `600 ${historia ? 44 : 36}px Barlow, sans-serif`;
    g.fillText(`📸 ${INSTAGRAM}`, W / 2, H - (historia ? 150 : 82));
    g.fillStyle = "#b3a7d6"; g.font = `400 ${historia ? 26 : 22}px JetBrains, monospace`;
    g.fillText(`${f ? f.toUpperCase() + "  ·  " : ""}FOTOS EN VIVO`, W / 2, H - (historia ? 98 : 44));
    return new Promise((ok) => c.toBlob(ok, "image/jpeg", 0.92));
  }

  // --- Vista previa y compartir --------------------------------------------------
  let imgs = [];
  async function armar() {
    const btn = document.getElementById("c-crear"); btn.disabled = true; btn.textContent = "Armando…";
    try { imgs = await Promise.all(elegidas.map(cargar)); }
    catch (e) { ctx.aviso("No se pudieron cargar las fotos. Probá de nuevo.", { error: true }); btn.disabled = false; btn.textContent = "Armar"; return; }
    btn.textContent = "Armar"; btn.disabled = false;
    const m = document.createElement("div"); m.className = "c-modal"; m.id = "c-modal";
    m.innerHTML = `<button class="cerrar" id="c-cerrar" aria-label="Cerrar">✕</button>
      <div class="formatos"><button class="pestana on" data-f="historia">Historia</button><button class="pestana" data-f="post">Publicación</button></div>
      <div class="prev"><div class="cargando"></div></div>
      <div class="tip">¡Etiquetanos en tu historia! ${INSTAGRAM} 💜</div>
      <div class="acc"><button class="btn" id="c-compartir">Compartir</button><button class="btn sec" id="c-bajar">Guardar</button></div>`;
    document.body.append(m); document.body.style.overflow = "hidden";
    m.querySelector(".formatos").onclick = (e) => {
      const b = e.target.closest("[data-f]"); if (!b) return;
      formato = b.dataset.f; m.querySelectorAll("[data-f]").forEach((x) => x.classList.toggle("on", x === b)); vista();
    };
    document.getElementById("c-cerrar").onclick = () => { m.remove(); document.body.style.overflow = ""; };
    document.getElementById("c-compartir").onclick = () => entregar(true);
    document.getElementById("c-bajar").onclick = () => entregar(false);
    formato = "historia";
    await vista();
  }

  async function vista() {
    const prev = document.querySelector("#c-modal .prev");
    prev.innerHTML = `<div class="cargando"></div>`;
    ultimo = await dibujar(imgs);
    const u = URL.createObjectURL(ultimo);
    prev.innerHTML = `<img src="${u}" alt="Tu collage" />`;
  }

  async function entregar(compartir) {
    if (!ultimo) return;
    const nombre = `${(ctx.ev.nombre || "zing").replace(/[^\w\s-]/g, "").trim() || "zing"} - collage.jpg`;
    const archivo = new File([ultimo], nombre, { type: "image/jpeg" });
    try {
      if (navigator.canShare?.({ files: [archivo] })) {
        await navigator.share({ files: [archivo], title: ctx.ev.nombre, text: `${INSTAGRAM} 📸` });
        return;
      }
      const a = document.createElement("a"); a.href = URL.createObjectURL(ultimo); a.download = nombre; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      if (compartir) ctx.aviso("Lo guardamos en tu compu. Para Instagram, abrí la galería desde el celular 📱");
    } catch (err) { if (err.name !== "AbortError") ctx.aviso("No se pudo compartir. Probá con Guardar.", { error: true }); }
  }

  const api = { activo: false, iniciar, tocar, salir, actualizar };
  window.ZingCollage = api;
})();
