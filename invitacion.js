// Invitacion digital (pack Premium). La carga index.html cuando el evento tiene
// invitacion publicada y la galeria todavia no abrio. Tambien la usa el panel
// de la familia para la vista previa (ZingInvitacion.render con un borrador).
// Usa lo que define index.html: sb, slug, esc, url.
(function () {
  const TIPOS = {
    "15": { titulo: "Mis XV", frase: "Hay sueños que se esperan toda la vida, y noches que se recuerdan para siempre.", cierre: "Te espero para celebrarla", color: "#e9a3b4" },
    boda: { titulo: "Nos casamos", frase: "Queremos compartir con vos el día más feliz de nuestras vidas.", cierre: "Te esperamos", color: "#e8c48a" },
    egresados: { titulo: "Fiesta de egresados", frase: "Después de tantos años juntos, llegó la noche que esperamos.", cierre: "No te la podés perder", color: "#8ec5ef" },
  };
  const MUSICA = { "zing-1": { nombre: "Vals de piano", url: "/musica/zing-1.mp3" } };
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  const CSS = `
  :root { --fondo:#120a14; --tinta:#fff8f3; --suave:rgba(255,248,243,.72); --tenue:rgba(255,248,243,.5); --oro:#e8c48a; --rosa:#e9a3b4;
    --vidrio:rgba(255,255,255,.09); --borde:rgba(255,255,255,.22);
    --nombre:"Great Vibes",cursive; --serif:"Cormorant Garamond",Georgia,serif; --sans:"Montserrat",system-ui,sans-serif; }
  body.inv { background:var(--fondo); color:var(--tinta); font-family:var(--serif); font-size:19px; line-height:1.5; }
  body.inv > :not(#inv):not(script):not(.aviso) { display:none !important; }
  #inv * { box-sizing:border-box; margin:0; padding:0; }
  #inv a { color:inherit; }
  #inv .portada { position:relative; min-height:100svh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:60px 22px 40px; overflow:hidden; }
  #inv .fotos { position:absolute; inset:0; background:radial-gradient(70% 60% at 50% 40%, color-mix(in srgb, var(--rosa) 35%, transparent), transparent 70%); }
  #inv .fotos div { position:absolute; inset:-4%; background-size:cover; background-position:center 30%; opacity:0; transition:opacity 2.2s ease; }
  #inv .fotos div.on { opacity:1; animation:invLento 11s linear both; }
  @keyframes invLento { from { transform:scale(1.12) translateY(1.5%); } to { transform:scale(1.02) translateY(-1.5%); } }
  #inv .portada::after { content:""; position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,.15) 35%, color-mix(in srgb, var(--fondo) 75%, transparent) 78%, var(--fondo) 100%); }
  #inv .portada > *:not(.fotos) { position:relative; z-index:1; }
  #inv .mis { font-family:var(--sans); font-size:12px; font-weight:700; letter-spacing:.5em; text-transform:uppercase; color:var(--oro); padding-left:.5em; }
  #inv .nombre { font-family:var(--nombre); font-weight:400; font-size:clamp(70px, 21vw, 150px); line-height:1; margin:12px 0 6px; text-shadow:0 6px 40px rgba(0,0,0,.45); overflow-wrap:anywhere; }
  #inv .fecha { font-size:22px; font-style:italic; color:var(--suave); }
  #inv .cuenta { display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; margin-top:34px; width:min(100%, 400px); }
  #inv .cuenta div { padding:14px 4px 10px; border-radius:18px; background:var(--vidrio); border:1px solid var(--borde); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); }
  #inv .cuenta b { display:block; font-weight:600; font-size:34px; line-height:1; }
  #inv .cuenta small { font-family:var(--sans); font-size:9.5px; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:var(--suave); }
  #inv .bajar { margin-top:30px; font-family:var(--sans); font-size:10px; letter-spacing:.3em; text-transform:uppercase; color:var(--tenue); text-decoration:none; animation:invFlota 2.4s ease-in-out infinite; }
  @keyframes invFlota { 50% { transform:translateY(6px); } }
  #inv .musica { position:fixed; z-index:20; right:16px; bottom:calc(16px + env(safe-area-inset-bottom)); display:flex; align-items:center; gap:9px; padding:11px 16px 11px 12px; border-radius:99px; border:1px solid var(--borde);
    background:rgba(0,0,0,.45); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); color:var(--tinta); font:600 12px var(--sans); letter-spacing:.06em; cursor:pointer; }
  #inv .musica .ico { width:30px; height:30px; border-radius:50%; display:grid; place-items:center; background:linear-gradient(135deg, var(--oro), var(--rosa)); color:#2a1420; font-size:12px; }
  #inv .musica .ondas { display:none; gap:2px; align-items:flex-end; height:14px; }
  #inv .musica.sonando .ondas { display:flex; }
  #inv .musica .ondas i { width:3px; background:var(--oro); border-radius:2px; animation:invOnda 1s ease-in-out infinite; }
  #inv .musica .ondas i:nth-child(2) { animation-delay:.2s; } #inv .musica .ondas i:nth-child(3) { animation-delay:.4s; }
  @keyframes invOnda { 0%,100% { height:4px; } 50% { height:14px; } }
  #inv section.bloque { padding:64px 22px; max-width:560px; margin:0 auto; text-align:center; }
  #inv .frase { font-size:26px; font-style:italic; line-height:1.35; color:var(--suave); }
  #inv .frase b { font-family:var(--nombre); font-weight:400; font-style:normal; font-size:42px; color:var(--tinta); display:block; margin-top:10px; }
  #inv .titulo { font-family:var(--sans); font-size:11px; font-weight:700; letter-spacing:.4em; text-transform:uppercase; color:var(--oro); margin-bottom:14px; }
  #inv .tarjeta { margin-top:18px; padding:28px 22px; border-radius:26px; background:linear-gradient(160deg, rgba(255,255,255,.08), rgba(255,255,255,.02)); border:1px solid var(--borde); }
  #inv .tarjeta h3 { font-size:30px; font-weight:600; line-height:1.15; }
  #inv .tarjeta p { color:var(--suave); margin-top:6px; }
  #inv .botones { display:flex; flex-wrap:wrap; justify-content:center; gap:10px; margin-top:20px; }
  #inv .btn, #inv button { text-transform:none; box-shadow:none; }
  #inv .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:13px 20px; border-radius:99px; border:1px solid var(--borde); background:var(--vidrio); color:var(--tinta); font:600 13px var(--sans); letter-spacing:.04em; text-decoration:none; cursor:pointer; }
  #inv .btn.oro { border:0; background:linear-gradient(135deg, var(--oro), var(--rosa)); color:#2a1420; }
  #inv .btn:disabled { opacity:.6; }
  #inv .separador { width:60px; height:1px; margin:0 auto; background:linear-gradient(90deg, transparent, var(--oro), transparent); }
  #inv .alias { margin-top:14px; font-family:var(--sans); font-weight:700; font-size:16px; letter-spacing:.04em; overflow-wrap:anywhere; }
  #inv form { margin-top:18px; display:grid; gap:12px; text-align:left; }
  #inv label { font-family:var(--sans); font-size:12px; font-weight:600; letter-spacing:.06em; color:var(--suave); }
  #inv input, #inv select, #inv textarea { width:100%; margin-top:6px; padding:13px 15px; border-radius:14px; border:1px solid var(--borde); background:rgba(255,255,255,.06); color:var(--tinta); font:16px var(--sans); outline:none; }
  #inv input:focus, #inv select:focus, #inv textarea:focus { border-color:var(--oro); }
  #inv select option { color:#222; }
  #inv .dos { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  #inv .gracias { margin-top:18px; padding:20px; border-radius:18px; background:color-mix(in srgb, var(--oro) 14%, transparent); border:1px solid color-mix(in srgb, var(--oro) 45%, transparent); font-size:20px; }
  #inv .muro { position:relative; margin-top:22px; border-radius:26px; overflow:hidden; min-height:200px; }
  #inv .muro .fondo-m { position:absolute; inset:0; background-size:cover; background-position:center; background-color:color-mix(in srgb, var(--rosa) 25%, #000); }
  #inv .muro::after { content:""; position:absolute; inset:0; background:rgba(0,0,0,.45); }
  #inv .muro .msgs { position:relative; z-index:1; display:grid; gap:12px; padding:22px; max-height:640px; overflow:auto; }
  #inv .msg { padding:18px 20px; border-radius:20px; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.25); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); text-align:left; animation:invEntra .6s ease both; }
  #inv .msg p { font-size:21px; font-style:italic; line-height:1.35; overflow-wrap:anywhere; }
  #inv .msg span { display:block; margin-top:6px; font-family:var(--nombre); font-size:26px; color:var(--oro); }
  #inv .vacio-m { color:var(--suave); font-style:italic; text-align:center; padding:30px 10px; }
  @keyframes invEntra { from { opacity:0; transform:translateY(10px); } }
  #inv .galeria-aviso { padding:26px 22px; border-radius:26px; border:1px dashed color-mix(in srgb, var(--oro) 55%, transparent); background:color-mix(in srgb, var(--oro) 7%, transparent); }
  #inv .galeria-aviso b { font-size:24px; }
  #inv .reproductor { margin-top:18px; border-radius:16px; overflow:hidden; border:1px solid var(--borde); }
  #inv .reproductor iframe { display:block; width:100%; border:0; }
  #inv footer { padding:50px 22px calc(100px + env(safe-area-inset-bottom)); text-align:center; font-family:var(--sans); font-size:11px; color:var(--tenue); line-height:1.7; }
  #inv footer img { height:22px; margin:0 auto 10px; display:block; opacity:.9; }
  #inv .franja { position:fixed; z-index:30; top:0; left:0; right:0; padding:8px 12px; text-align:center; font:600 12px var(--sans); color:#2a1420; background:linear-gradient(90deg, var(--oro), var(--rosa)); }
  #inv .rev { opacity:0; transform:translateY(18px); transition:opacity .9s, transform .9s; }
  #inv .rev.ve { opacity:1; transform:none; }
  @media (prefers-reduced-motion: reduce) { #inv .fotos div.on { animation:none; } #inv .rev { opacity:1; transform:none; } }`;

  function fuentes() {
    if (document.getElementById("inv-fuentes")) return;
    const l = document.createElement("link");
    l.id = "inv-fuentes"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,500&family=Montserrat:wght@400;600;700&display=swap";
    document.head.appendChild(l);
    const s = document.createElement("style"); s.id = "inv-css"; s.textContent = CSS; document.head.appendChild(s);
  }

  function hsl(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || ""); if (!m) return [340, 60, 78];
    let [r, g, b] = [0, 2, 4].map((k) => parseInt(m[1].slice(k, k + 2), 16) / 255);
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
    if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
      h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
    return [h, s * 100, l * 100];
  }
  // El color del vestido tiñe toda la invitacion.
  function tenir(raiz, hex) {
    const [h, s] = hsl(hex);
    raiz.style.setProperty("--rosa", /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#e9a3b4");
    raiz.style.setProperty("--oro", `hsl(${(h + 25) % 360} ${Math.min(70, s + 10)}% 78%)`);
    raiz.style.setProperty("--fondo", `hsl(${h} ${Math.min(45, s)}% 6%)`);
    document.body.style.background = `hsl(${h} ${Math.min(45, s)}% 6%)`;
  }

  function fechaLarga(d) { return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`; }
  function hora(d) { const m = d.getMinutes(); return `${d.getHours()}${m ? ":" + String(m).padStart(2, "0") : ""} h`; }

  function reproductor(link) {
    let m = /open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist)\/([A-Za-z0-9]+)/.exec(link || "");
    if (m) return `<iframe src="https://open.spotify.com/embed/${m[1]}/${m[2]}" height="152" allow="encrypted-media" loading="lazy" title="Nuestra canción"></iframe>`;
    m = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{11})/.exec(link || "");
    if (m) return `<iframe src="https://www.youtube-nocookie.com/embed/${m[1]}" height="220" allow="encrypted-media; picture-in-picture" allowfullscreen loading="lazy" title="Nuestra canción"></iframe>`;
    return "";
  }

  /**
   * Arma la invitacion dentro de la pagina.
   * datos: lo que devuelve galeria_invitacion (o el borrador del panel).
   * opciones.previa: vista previa del panel (no guarda respuestas ni mensajes).
   */
  function render(datos, opciones = {}) {
    fuentes();
    const c = { ...(datos.config || {}) };
    const tipo = TIPOS[c.tipo] || TIPOS["15"];
    const previa = !!opciones.previa;
    const fiesta = c.fiesta ? new Date(c.fiesta) : datos.fiesta ? new Date(datos.fiesta) : new Date(datos.fecha + "T21:00");
    const fotos = (datos.fotos || []).map(url);
    if (!fotos.length && c.portada) fotos.push(url(c.portada));
    const nombre = c.nombre || datos.nombre || "";
    const titulo = c.titulo || tipo.titulo;

    let raiz = document.getElementById("inv");
    if (raiz) raiz.remove();
    raiz = document.createElement("div"); raiz.id = "inv";
    document.body.classList.add("inv");
    document.title = `${titulo} · ${nombre}`;

    const lugar = [c.lugar, c.direccion].filter(Boolean).join(", ");
    const mapa = c.mapa || (lugar ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(lugar) : "");
    const cancion = reproductor(c.cancion_url);
    const musica = MUSICA[c.musica];

    raiz.innerHTML = `
      ${previa ? `<div class="franja">Vista previa · así la van a ver tus invitados</div>` : ""}
      <header class="portada">
        <div class="fotos"></div>
        <div class="mis">${esc(titulo)}</div>
        <h1 class="nombre">${esc(nombre)}</h1>
        <p class="fecha">${esc(fechaLarga(fiesta))} · ${esc(hora(fiesta))}</p>
        <div class="cuenta"><div><b data-c="d">0</b><small>Días</small></div><div><b data-c="h">0</b><small>Horas</small></div><div><b data-c="m">0</b><small>Min</small></div><div><b data-c="s">0</b><small>Seg</small></div></div>
        <a class="bajar" href="#inv-mas">Deslizá ↓</a>
      </header>
      ${musica ? `<button class="musica" type="button"><span class="ico">▶</span><span>${esc(c.musica_texto || "Nuestra canción")}</span><span class="ondas"><i></i><i></i><i></i></span></button><audio src="${musica.url}" loop preload="none"></audio>` : ""}
      <section class="bloque rev" id="inv-mas"><p class="frase">${esc(c.frase || tipo.frase)}<b>${esc(c.cierre || tipo.cierre)}</b></p></section>
      <div class="separador"></div>
      <section class="bloque rev">
        <div class="titulo">Cuándo y dónde</div>
        <div class="tarjeta">
          <h3>${esc(fechaLarga(fiesta))}</h3>
          <p>${esc(hora(fiesta))}${c.lugar ? " · " + esc(c.lugar) : ""}${c.direccion ? "<br>" + esc(c.direccion) : ""}</p>
          <div class="botones">
            ${mapa ? `<a class="btn oro" href="${esc(mapa)}" target="_blank" rel="noopener">📍 Cómo llegar</a>` : ""}
            <a class="btn" data-agendar target="_blank" rel="noopener">🗓 Agendar</a>
          </div>
        </div>
        ${c.vestimenta ? `<div class="tarjeta"><div class="titulo" style="margin:0 0 6px">Vestimenta</div><h3>${esc(c.vestimenta)}</h3>${c.vestimenta_txt ? `<p>${esc(c.vestimenta_txt)}</p>` : ""}</div>` : ""}
      </section>
      ${cancion ? `<section class="bloque rev"><div class="titulo">Nuestra canción</div><div class="reproductor">${cancion}</div></section>` : ""}
      ${c.regalo_on && c.alias ? `<section class="bloque rev">
        <div class="titulo">Regalo</div>
        <p class="frase" style="font-size:22px">${esc(c.regalo_txt || "Tu presencia es el mejor regalo. Si querés hacer un obsequio, te dejamos los datos:")}</p>
        <div class="tarjeta"><p>Alias</p><div class="alias">${esc(c.alias)}</div><div class="botones"><button class="btn oro" type="button" data-copiar>Copiar alias</button></div></div>
      </section>` : ""}
      <section class="bloque rev">
        <div class="titulo">Confirmá tu asistencia</div>
        ${c.rsvp_hasta ? `<p class="frase" style="font-size:22px">Antes del ${esc(new Date(c.rsvp_hasta + "T12:00").getDate())} de ${esc(MESES[new Date(c.rsvp_hasta + "T12:00").getMonth()])}, así te guardamos el lugar.</p>` : ""}
        <form data-rsvp>
          <label>Tu nombre y apellido<input name="nombre" required maxlength="80" placeholder="Ej: Sofía Pérez"></label>
          <div class="dos">
            <label>¿Venís?<select name="viene"><option value="1">¡Sí, voy!</option><option value="0">No puedo ir</option></select></label>
            <label>¿Cuántos son?<input name="cuantos" type="number" min="1" max="20" value="1"></label>
          </div>
          ${c.preguntar_menu !== false ? `<label>¿Alguna comida especial?<select name="menu"><option value="">No</option><option>Celíaco</option><option>Vegetariano</option><option>Vegano</option><option>Otra</option></select></label>` : ""}
          ${c.preguntar_cancion !== false ? `<label>🎵 ¿Qué canción no puede faltar?<input name="cancion" maxlength="120" placeholder="Se la pasamos al DJ"></label>` : ""}
          <button class="btn oro" type="submit">Confirmar</button>
        </form>
        <div class="gracias" data-gracias hidden>¡Gracias! Ya quedó confirmado. 💛</div>
      </section>
      ${c.mensajes_on !== false ? `<section class="bloque rev">
        <div class="titulo">Dejale un mensaje${c.tipo === "boda" ? " a los novios" : nombre ? " a " + esc(nombre.split(/\s|&/)[0]) : ""}</div>
        <p class="frase" style="font-size:22px">Los mensajes van a aparecer en la pantalla gigante durante la fiesta.</p>
        <form data-msg>
          <label>Tu mensaje<textarea name="texto" rows="3" maxlength="180" required placeholder="Escribí algo lindo…"></textarea></label>
          <label>Firmado por<input name="firma" maxlength="40" required placeholder="Ej: Tía Ana"></label>
          <button class="btn oro" type="submit">Enviar mensaje</button>
        </form>
        <div class="muro"><div class="fondo-m"></div><div class="msgs"></div></div>
      </section>` : ""}
      <section class="bloque rev"><div class="galeria-aviso">
        <div class="titulo">La noche de la fiesta</div>
        <b>📸 Este mismo link se convierte en la galería de fotos en vivo</b>
        <p style="color:var(--suave);margin-top:8px">Guardalo: esa noche vas a ver acá las fotos de la fiesta, recién editadas, mientras seguimos bailando.</p>
      </div></section>
      <footer><img src="/logo.png" alt="Zing">Invitación digital y fotos en vivo por Zing Producciones</footer>`;
    document.body.appendChild(raiz);
    tenir(raiz, c.color || tipo.color);
    const $i = (q) => raiz.querySelector(q);

    // Fotos del book (o la portada) pasando de fondo
    const caja = $i(".fotos");
    fotos.forEach((u, k) => { const d = document.createElement("div"); d.style.backgroundImage = `url("${u}")`; if (!k) d.className = "on"; caja.appendChild(d); });
    clearInterval(render._fotos); clearInterval(render._cuenta);
    if (fotos.length > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let i = 0; render._fotos = setInterval(() => { caja.children[i].classList.remove("on"); i = (i + 1) % caja.children.length; caja.children[i].classList.add("on"); }, 5500);
    }

    // Cuenta regresiva
    const dos = (n) => String(n).padStart(2, "0");
    const contar = () => {
      let s = Math.max(0, Math.floor((fiesta - new Date()) / 1000)); const d = Math.floor(s / 86400); s %= 86400;
      $i('[data-c="d"]').textContent = d; $i('[data-c="h"]').textContent = dos(Math.floor(s / 3600));
      $i('[data-c="m"]').textContent = dos(Math.floor(s % 3600 / 60)); $i('[data-c="s"]').textContent = dos(s % 60);
    };
    contar(); render._cuenta = setInterval(contar, 1000);

    // Musica (con boton: los celulares no dejan que suene sola)
    const bm = $i(".musica"), audio = raiz.querySelector("audio");
    if (bm) bm.onclick = () => {
      if (audio.paused) audio.play().then(() => { bm.classList.add("sonando"); bm.querySelector(".ico").textContent = "❚❚"; }).catch(() => {});
      else { audio.pause(); bm.classList.remove("sonando"); bm.querySelector(".ico").textContent = "▶"; }
    };

    // Agendar en Google Calendar
    const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    $i("[data-agendar]").href = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(`${titulo} · ${nombre}`)
      + "&dates=" + fmt(fiesta) + "/" + fmt(new Date(fiesta.getTime() + 6 * 3600e3))
      + (lugar ? "&location=" + encodeURIComponent(lugar) : "") + "&details=" + encodeURIComponent(location.origin + "/" + slug);

    const copiar = $i("[data-copiar]");
    if (copiar) copiar.onclick = async () => {
      try { await navigator.clipboard.writeText(c.alias); copiar.textContent = "¡Copiado! ✓"; } catch { copiar.textContent = "Mantené apretado el alias para copiarlo"; }
    };

    // Confirmar asistencia
    const fr = $i("[data-rsvp]");
    fr.onsubmit = async (e) => {
      e.preventDefault(); const f = new FormData(fr), b = fr.querySelector("button");
      if (!previa) {
        b.disabled = true;
        const { error } = await sb.rpc("galeria_responder", { p_slug: slug, p_nombre: f.get("nombre"), p_viene: f.get("viene") === "1",
          p_cuantos: Number(f.get("cuantos") || 1), p_menu: f.get("menu") || "", p_cancion: f.get("cancion") || "" });
        b.disabled = false;
        if (error) return alert("No se pudo enviar. Probá de nuevo.");
      }
      fr.hidden = true; $i("[data-gracias]").hidden = false;
      $i("[data-gracias]").textContent = f.get("viene") === "1" ? "¡Gracias! Ya quedó confirmado. 💛" : "¡Gracias por avisar! Te vamos a extrañar. 💛";
    };

    // Mensajes
    const muro = $i(".msgs");
    if (muro) {
      $i(".fondo-m").style.backgroundImage = fotos[0] ? `url("${fotos[fotos.length > 1 ? 1 : 0]}")` : "";
      const pintar = (t, f, arriba) => { const m = document.createElement("div"); m.className = "msg"; m.innerHTML = "<p></p><span></span>";
        m.querySelector("p").textContent = "“" + t + "”"; m.querySelector("span").textContent = f; arriba ? muro.prepend(m) : muro.append(m); muro.querySelector(".vacio-m")?.remove(); };
      (datos.mensajes || []).forEach((m) => pintar(m.texto, m.firma));
      if (!muro.children.length) muro.innerHTML = `<p class="vacio-m">¡Sé el primero en dejar un mensaje!</p>`;
      const fm = $i("[data-msg]");
      fm.onsubmit = async (e) => {
        e.preventDefault(); const f = new FormData(fm), b = fm.querySelector("button");
        if (!previa) {
          b.disabled = true;
          const { error } = await sb.rpc("galeria_dejar_mensaje", { p_slug: slug, p_texto: f.get("texto"), p_firma: f.get("firma") });
          b.disabled = false;
          if (error) return alert("No se pudo enviar. Probá de nuevo.");
        }
        pintar(f.get("texto"), f.get("firma"), true); fm.reset();
      };
    }

    // Aparecer al bajar
    const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("ve"); io.unobserve(x.target); } }), { threshold: .12 });
    raiz.querySelectorAll(".rev").forEach((el) => io.observe(el));
    return raiz;
  }

  window.ZingInvitacion = { render, TIPOS, MUSICA, reproductor };
})();
