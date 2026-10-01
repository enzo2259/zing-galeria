// Panel de la familia: fotos.zingproducciones.com/<slug>?editar=<clave>
// Configuran la invitacion (con vista previa), la publican y ven quien
// confirmo, que canciones pidieron y los mensajes. Usa lo de index.html
// (sb, slug, esc, url, achicar, BUCKET) y ZingInvitacion (invitacion.js).
(function () {
  const clave = new URLSearchParams(location.search).get("editar") || "";
  const COLORES = { Rosa: "#e9a3b4", Celeste: "#8ec5ef", Lila: "#c3a6e6", Rojo: "#e0525f", Dorado: "#e8c48a", Fucsia: "#e0479e", Azul: "#5b8fe6", Verde: "#5fc49d", Blanco: "#f1e7d6", Negro: "#9a9aa8" };
  let datos = null, config = {};

  const CSS = `
  body.fam { background:#0b0620; color:#fff; font-family:"Montserrat",system-ui,sans-serif; }
  body.fam > :not(#fam):not(#inv):not(script):not(.aviso) { display:none !important; }
  #fam { max-width:720px; margin:0 auto; padding:22px 18px 120px; }
  #fam * { box-sizing:border-box; }
  #fam, #fam * { font-family:"Montserrat",system-ui,sans-serif; text-transform:none; letter-spacing:normal; }
  #fam .top { display:flex; justify-content:space-between; align-items:center; gap:12px; }
  #fam .top img { height:28px; }
  #fam .estado { font-size:12px; font-weight:700; padding:6px 12px; border-radius:99px; background:rgba(255,255,255,.08); }
  #fam .estado.pub { background:rgba(56,245,91,.15); color:#6dfa86; }
  #fam h1 { font-size:26px; margin:22px 0 4px; letter-spacing:-.02em; }
  #fam .fam-sub { color:rgba(255,255,255,.65); font-size:14px; line-height:1.5; }
  #fam .tabs { display:flex; gap:6px; margin:22px 0 18px; overflow-x:auto; }
  #fam .tabs button { flex:none; padding:10px 16px; border-radius:99px; border:1px solid rgba(255,255,255,.18); background:none; color:rgba(255,255,255,.8); font-weight:700; font-size:13px; font-family:inherit; cursor:pointer; }
  #fam .tabs button.on { background:linear-gradient(135deg,#ffbd42,#ff9d19); color:#17092e; border-color:transparent; }
  #fam .tabs small { opacity:.7; margin-left:4px; }
  #fam .caja { padding:20px; border-radius:18px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); margin-bottom:14px; }
  #fam .caja h2 { font-size:15px; margin:0 0 14px; letter-spacing:.02em; }
  #fam label { display:block; font-size:12px; font-weight:700; color:rgba(255,255,255,.7); margin:12px 0 0; }
  #fam label:first-of-type { margin-top:0; }
  #fam input, #fam select, #fam textarea { width:100%; margin-top:6px; padding:12px 14px; border-radius:12px; border:1px solid rgba(255,255,255,.16); background:rgba(255,255,255,.06); color:#fff; font-size:15px; font-family:inherit; outline:none; }
  #fam input:focus, #fam select:focus, #fam textarea:focus { border-color:#ffbd42; }
  #fam select option { color:#222; }
  #fam .dos { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  #fam .ayuda { font-size:12px; color:rgba(255,255,255,.5); margin-top:6px; line-height:1.45; }
  #fam .colores { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; align-items:center; }
  #fam .colores button { width:34px; height:34px; border-radius:50%; border:2px solid rgba(255,255,255,.3); cursor:pointer; }
  #fam .colores button.on { border-color:#fff; transform:scale(1.12); box-shadow:0 0 0 3px rgba(255,255,255,.15); }
  #fam .colores input[type=color] { width:44px; height:36px; padding:2px; margin:0; }
  #fam .chk { display:flex; align-items:center; gap:10px; margin-top:12px; font-size:14px; font-weight:600; color:#fff; }
  #fam .chk input { width:20px; height:20px; margin:0; accent-color:#ff9d19; }
  #fam .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:13px 20px; border-radius:99px; border:1px solid rgba(255,255,255,.2); background:rgba(255,255,255,.05); color:#fff; font-weight:800; font-size:14px; font-family:inherit; cursor:pointer; text-decoration:none; }
  #fam .btn.oro { border:0; background:linear-gradient(135deg,#ffbd42,#ff9d19); color:#17092e; }
  #fam .btn:disabled { opacity:.5; }
  #fam .barra { position:fixed; left:0; right:0; bottom:0; z-index:15; display:flex; gap:10px; justify-content:center; padding:12px 16px calc(12px + env(safe-area-inset-bottom)); background:rgba(11,6,32,.92); border-top:1px solid rgba(255,255,255,.1); backdrop-filter:blur(10px); }
  #fam .barra .btn { flex:1; max-width:220px; }
  #fam .compartir { display:flex; flex-wrap:wrap; gap:10px; margin-top:12px; }
  #fam .link { font:13px ui-monospace,Menlo,monospace; padding:10px 12px; border-radius:10px; background:rgba(0,0,0,.3); overflow-wrap:anywhere; }
  #fam .numeros { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:14px; }
  #fam .numeros div { padding:14px; border-radius:14px; background:rgba(255,255,255,.05); text-align:center; }
  #fam .numeros b { display:block; font-size:28px; color:#ffbd42; }
  #fam .numeros span { font-size:11px; color:rgba(255,255,255,.65); }
  #fam .fila { padding:12px 0; border-top:1px solid rgba(255,255,255,.08); font-size:14px; line-height:1.45; }
  #fam .fila small { color:rgba(255,255,255,.55); }
  #fam .fila.no { opacity:.55; }
  #fam .msgf { display:flex; gap:12px; justify-content:space-between; align-items:flex-start; }
  #fam .msgf.oculto p { text-decoration:line-through; opacity:.5; }
  #fam .vacio { color:rgba(255,255,255,.55); font-size:14px; padding:10px 0; }
  #fam .portada-prev { width:100%; aspect-ratio:3/2; border-radius:12px; margin-top:10px; background:center/cover no-repeat rgba(255,255,255,.05); }
  .volver-ed { position:fixed; z-index:40; left:12px; top:calc(44px + env(safe-area-inset-top)); padding:10px 16px; border-radius:99px; border:0; background:#fff; color:#17092e; font:800 13px "Montserrat",sans-serif; box-shadow:0 8px 24px rgba(0,0,0,.4); cursor:pointer; }`;

  const $f = (q) => document.querySelector("#fam " + q);
  const linkPublico = () => `${location.origin}/${slug}`;
  const tipo = () => window.ZingInvitacion.TIPOS[config.tipo] || window.ZingInvitacion.TIPOS["15"];

  async function cargar() {
    const { data, error } = await sb.rpc("galeria_familia", { p_slug: slug, p_clave: clave });
    if (error) { mensaje("Sin conexión", "Probá de nuevo en un ratito."); return false; }
    if (data.error) { mensaje("Link no válido", "Este link de edición no es correcto o el evento ya terminó. Pedile a Zing el link de tu invitación."); return false; }
    datos = data;
    config = { ...(data.config || {}) };
    return true;
  }

  function campo(nombre, etiqueta, extra = "", ayuda = "") {
    return `<label>${etiqueta}<input name="${nombre}" value="${esc(config[nombre] ?? "")}" ${extra}></label>${ayuda ? `<div class="ayuda">${ayuda}</div>` : ""}`;
  }
  // datetime-local trabaja en hora local, sin zona.
  const local = (iso) => { if (!iso) return ""; const d = new Date(iso); const p = (n) => String(n).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; };

  function pintar() {
    document.body.classList.add("fam");
    let raiz = document.getElementById("fam");
    if (!raiz) { raiz = document.createElement("div"); raiz.id = "fam"; document.body.appendChild(raiz); }
    const respuestas = datos.respuestas || [], mensajes = datos.todos_mensajes || [];
    const canciones = respuestas.filter((r) => r.cancion);
    const t = tipo();
    raiz.innerHTML = `
      <div class="top"><img src="/logo.png" alt="Zing"><span class="estado ${datos.publicada ? "pub" : ""}">${datos.publicada ? "● Publicada" : "Borrador"}</span></div>
      <h1>Tu invitación</h1>
      <p class="fam-sub">Completá los datos, mirá cómo queda y publicala. Después compartí el link con tus invitados por WhatsApp.</p>
      <div class="caja" ${datos.publicada ? "" : "hidden"}>
        <h2>🔗 Link para tus invitados</h2>
        <div class="link">${esc(linkPublico())}</div>
        <div class="compartir">
          <a class="btn oro" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(`${config.titulo || t.titulo} · ${config.nombre || datos.nombre} 💌 ${linkPublico()}`)}">Compartir por WhatsApp</a>
          <button class="btn" type="button" data-copiar-link>Copiar link</button>
        </div>
      </div>
      <nav class="tabs">
        <button data-tab="diseno" class="on">✏️ Diseño</button>
        <button data-tab="confirmados">✅ Confirmados<small>${respuestas.filter((r) => r.viene).reduce((a, r) => a + r.cuantos, 0)}</small></button>
        <button data-tab="canciones">🎵 Canciones<small>${canciones.length}</small></button>
        <button data-tab="mensajes">💌 Mensajes<small>${mensajes.length}</small></button>
      </nav>
      <div data-panel="diseno">
        <form id="fam-form">
          <div class="caja"><h2>La fiesta</h2>
            <div class="dos">${campo("titulo", "Título", `placeholder="${esc(t.titulo)}" maxlength="40"`)}${campo("nombre", config.tipo === "boda" ? "Nombres" : "Nombre", `placeholder="${esc(datos.nombre)}" maxlength="40"`)}</div>
            <label>Día y hora<input type="datetime-local" name="fiesta" value="${local(config.fiesta || datos.fiesta)}" required></label>
            ${campo("lugar", "Salón", 'placeholder="Ej: Salón Los Álamos" maxlength="60"')}
            ${campo("direccion", "Dirección", 'placeholder="Ej: Av. Colón 1234, Córdoba" maxlength="100"', "Se usa para el botón “Cómo llegar”.")}
            <div class="dos">${campo("vestimenta", "Vestimenta", 'placeholder="Ej: Elegante sport" maxlength="40"')}${campo("rsvp_hasta", "Confirmar antes del", 'type="date"')}</div>
          </div>
          <div class="caja"><h2>🎨 Color ${config.tipo === "15" || !config.tipo ? "del vestido" : "de la fiesta"}</h2>
            <div class="colores" id="fam-colores">${Object.entries(COLORES).map(([n, c]) => `<button type="button" title="${n}" data-color="${c}" style="background:${c}" class="${(config.color || t.color) === c ? "on" : ""}"></button>`).join("")}
              <input type="color" value="${esc(config.color || t.color)}" title="Otro color" id="fam-color"></div>
            <div class="ayuda">Toda la invitación se adapta a este color.</div>
          </div>
          <div class="caja"><h2>📸 Foto de portada</h2>
            ${datos.fotos?.length ? `<div class="ayuda">Ya están las fotos de tu book: se van a ver de fondo en la portada. ✨</div>`
              : `<div class="ayuda">Mientras no estén las fotos del book, podés subir una foto tuya para la portada.</div>
                 <div class="portada-prev" id="fam-portada" style="${config.portada ? `background-image:url('${url(config.portada)}')` : ""}"></div>
                 <div class="compartir"><button class="btn" type="button" id="fam-subir">Elegir foto</button></div>
                 <input type="file" id="fam-archivo" accept="image/*" hidden>`}
          </div>
          <div class="caja"><h2>Textos</h2>
            <label>Frase<textarea name="frase" rows="3" maxlength="200" placeholder="${esc(t.frase)}">${esc(config.frase || "")}</textarea></label>
            ${campo("cierre", "Remate (en letra elegante)", `placeholder="${esc(t.cierre)}" maxlength="40"`)}
          </div>
          <div class="caja"><h2>🎵 Música</h2>
            <label>Música de fondo (con botón ▶)<select name="musica"><option value="">Sin música</option>${Object.entries(window.ZingInvitacion.MUSICA).map(([k, m]) => `<option value="${k}" ${config.musica === k ? "selected" : ""}>${esc(m.nombre)}</option>`).join("")}</select></label>
            ${campo("cancion_url", "Nuestra canción (opcional)", 'placeholder="Link de Spotify o YouTube"', "Pegá el link de la canción y aparece un reproductor en la invitación.")}
          </div>
          <div class="caja"><h2>🎁 Regalo</h2>
            <label class="chk"><input type="checkbox" name="regalo_on" ${config.regalo_on ? "checked" : ""}> Mostrar datos para regalo</label>
            ${campo("alias", "Alias o CBU", 'maxlength="60" placeholder="Ej: martina.xv"')}
            ${campo("regalo_txt", "Texto (opcional)", 'maxlength="160" placeholder="Tu presencia es el mejor regalo…"')}
          </div>
          <div class="caja"><h2>Preguntas al confirmar</h2>
            <label class="chk"><input type="checkbox" name="preguntar_menu" ${config.preguntar_menu !== false ? "checked" : ""}> ¿Alguna comida especial? <small style="opacity:.6">(para el salón)</small></label>
            <label class="chk"><input type="checkbox" name="preguntar_cancion" ${config.preguntar_cancion !== false ? "checked" : ""}> ¿Qué canción no puede faltar? <small style="opacity:.6">(para el DJ)</small></label>
            <label class="chk"><input type="checkbox" name="mensajes_on" ${config.mensajes_on !== false ? "checked" : ""}> Mensajes de los invitados <small style="opacity:.6">(salen en la pantalla)</small></label>
          </div>
        </form>
      </div>
      <div data-panel="confirmados" hidden>${panelConfirmados(respuestas)}</div>
      <div data-panel="canciones" hidden>${panelCanciones(canciones)}</div>
      <div data-panel="mensajes" hidden>${panelMensajes(mensajes)}</div>
      <div class="barra">
        <button class="btn" type="button" id="fam-ver">👁 Ver cómo queda</button>
        <button class="btn oro" type="button" id="fam-publicar">${datos.publicada ? "Guardar cambios" : "Publicar"}</button>
      </div>`;
    eventos();
  }

  function panelConfirmados(rs) {
    const van = rs.filter((r) => r.viene), personas = van.reduce((a, r) => a + r.cuantos, 0);
    const menus = {}; van.forEach((r) => { if (r.menu) menus[r.menu] = (menus[r.menu] || 0) + r.cuantos; });
    return `<div class="numeros"><div><b>${personas}</b><span>personas van</span></div><div><b>${van.length}</b><span>confirmaciones</span></div><div><b>${rs.length - van.length}</b><span>no pueden ir</span></div></div>
      ${Object.keys(menus).length ? `<div class="caja"><h2>🍽 Menús especiales <small style="opacity:.6">(para el salón)</small></h2>${Object.entries(menus).map(([m, n]) => `<div class="fila">${esc(m)}: <b>${n}</b></div>`).join("")}</div>` : ""}
      <div class="caja"><h2>Respuestas</h2>${rs.length ? rs.map((r) => `<div class="fila ${r.viene ? "" : "no"}"><b>${esc(r.nombre)}</b> · ${r.viene ? `va${r.cuantos > 1 ? ` (${r.cuantos})` : ""}` : "no puede ir"}${r.menu ? ` · <small>${esc(r.menu)}</small>` : ""}</div>`).join("") : `<div class="vacio">Todavía nadie confirmó.</div>`}</div>`;
  }
  function panelCanciones(cs) {
    const lista = cs.map((r) => `• ${r.cancion} (${r.nombre})`).join("\n");
    return `<div class="caja"><h2>🎵 Canciones que pidieron</h2>${cs.length ? cs.map((r) => `<div class="fila">${esc(r.cancion)} <small>· ${esc(r.nombre)}</small></div>`).join("")
      + `<div class="compartir"><a class="btn oro" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent("Canciones que pidieron los invitados 🎵\n\n" + lista)}">Mandar al DJ por WhatsApp</a></div>`
      : `<div class="vacio">Todavía no pidieron canciones.</div>`}</div>`;
  }
  function panelMensajes(ms) {
    return `<div class="caja"><h2>💌 Mensajes</h2><div class="ayuda" style="margin-bottom:8px">Salen en la pantalla gigante durante la fiesta. Si alguno no te gusta, ocultalo.</div>${ms.length ? ms.map((m) => `<div class="fila msgf ${m.oculto ? "oculto" : ""}"><p>“${esc(m.texto)}”<br><small>${esc(m.firma)}</small></p><button class="btn" type="button" data-ocultar="${m.id}" data-oculto="${m.oculto ? 1 : 0}">${m.oculto ? "Mostrar" : "Ocultar"}</button></div>`).join("") : `<div class="vacio">Todavía no hay mensajes.</div>`}</div>`;
  }

  function leerFormulario() {
    const f = $f("#fam-form"), d = new FormData(f);
    ["titulo", "nombre", "lugar", "direccion", "vestimenta", "rsvp_hasta", "frase", "cierre", "musica", "cancion_url", "alias", "regalo_txt"]
      .forEach((k) => { const v = (d.get(k) || "").toString().trim(); if (v) config[k] = v; else delete config[k]; });
    const fiesta = d.get("fiesta"); if (fiesta) config.fiesta = new Date(fiesta).toISOString();
    ["regalo_on", "preguntar_menu", "preguntar_cancion", "mensajes_on"].forEach((k) => (config[k] = !!f.querySelector(`[name=${k}]`).checked));
    return config;
  }

  function eventos() {
    document.querySelectorAll("#fam .tabs button").forEach((b) => (b.onclick = () => {
      document.querySelectorAll("#fam .tabs button").forEach((x) => x.classList.toggle("on", x === b));
      document.querySelectorAll("#fam [data-panel]").forEach((p) => (p.hidden = p.dataset.panel !== b.dataset.tab));
      $f(".barra").hidden = b.dataset.tab !== "diseno";
    }));
    const elegirColor = (c) => { config.color = c; document.querySelectorAll("#fam-colores button").forEach((x) => x.classList.toggle("on", x.dataset.color === c)); $f("#fam-color").value = c; };
    document.querySelectorAll("#fam-colores button").forEach((b) => (b.onclick = () => elegirColor(b.dataset.color)));
    $f("#fam-color").oninput = (e) => elegirColor(e.target.value);
    $f("[data-copiar-link]")?.addEventListener("click", async (e) => { try { await navigator.clipboard.writeText(linkPublico()); e.target.textContent = "¡Copiado! ✓"; } catch {} });
    $f("#fam-subir")?.addEventListener("click", () => $f("#fam-archivo").click());
    $f("#fam-archivo")?.addEventListener("change", subirPortada);
    $f("#fam-ver").onclick = verPrevia;
    $f("#fam-publicar").onclick = () => guardar(true);
    document.querySelectorAll("#fam [data-ocultar]").forEach((b) => (b.onclick = async () => {
      b.disabled = true;
      await sb.rpc("galeria_familia_mensaje", { p_slug: slug, p_clave: clave, p_id: Number(b.dataset.ocultar), p_oculto: b.dataset.oculto !== "1" });
      if (await cargar()) { pintar(); document.querySelector('#fam .tabs [data-tab="mensajes"]').click(); }
    }));
  }

  async function subirPortada(e) {
    const archivo = e.target.files[0]; e.target.value = ""; if (!archivo) return;
    aviso("Subiendo la foto…", { fijo: true });
    try {
      const { blob } = await achicar(archivo, 2000);
      const path = `${datos.token}/invitacion/${(crypto.randomUUID?.() || Date.now().toString(16)).replace(/-/g, "")}.jpg`;
      const r = await sb.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000", upsert: false });
      if (r.error) throw r.error;
      config.portada = path;
      $f("#fam-portada").style.backgroundImage = `url('${url(path)}')`;
      aviso("¡Listo! Acordate de guardar los cambios.");
    } catch (err) { console.error(err); aviso("No se pudo subir la foto. Probá con otra.", { error: true }); }
  }

  function verPrevia() {
    leerFormulario();
    const vista = { ...datos, config, mensajes: (datos.mensajes || []) };
    window.ZingInvitacion.render(vista, { previa: true });
    window.scrollTo(0, 0);
    const b = document.createElement("button"); b.className = "volver-ed"; b.textContent = "← Volver a editar";
    b.onclick = () => { document.getElementById("inv")?.remove(); b.remove(); document.body.classList.remove("inv"); document.body.style.background = ""; window.scrollTo(0, 0); };
    document.body.appendChild(b);
  }

  async function guardar(publicar) {
    leerFormulario();
    if (!config.fiesta) return aviso("Falta el día y la hora de la fiesta.", { error: true });
    const b = $f("#fam-publicar"); b.disabled = true;
    const { data, error } = await sb.rpc("galeria_familia_guardar", { p_slug: slug, p_clave: clave, p_config: config, p_publicar: publicar });
    b.disabled = false;
    if (error || data?.error) return aviso("No se pudo guardar. Probá de nuevo.", { error: true });
    const eraBorrador = !datos.publicada;
    if (await cargar()) pintar();
    aviso(eraBorrador ? "🎉 ¡Tu invitación está publicada! Ya podés compartir el link." : "✓ Cambios guardados.");
    if (eraBorrador) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  window.ZingFamilia = {
    async iniciar() {
      const s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s);
      const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap"; document.head.appendChild(l);
      document.title = "Tu invitación · Zing";
      if (await cargar()) pintar();
    },
  };
})();
