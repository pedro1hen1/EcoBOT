"use strict";
(() => {
  // src/machine.ts
  var initial = () => ({ version: 1, state: "IDLE", queue: [], cursor: 0, uncertain: false, message: "Diagn\xF3stico \u2014 nenhuma partida executada" });
  var routes = { IDLE: { home: "HOME" }, HOME: { open: "OPENING" }, OPENING: { ready: "READY" }, READY: { aim: "AIMING" }, AIMING: { throw: "FLYING" }, FLYING: { feedback: "FEEDBACK" }, FEEDBACK: { retry: "RETRY", return: "RETURNING" }, RETRY: { ready: "READY" }, RETURNING: { confirmed: "HOME" } };
  function transition(cp, event) {
    const next = structuredClone(cp);
    if (["network", "session", "timeout"].includes(event)) return { ...next, state: "PAUSED", uncertain: true, message: "Interven\xE7\xE3o necess\xE1ria: " + event };
    if (event === "pause" && cp.state === "PAUSED") return next;
    if (event === "pause") return { ...next, previous: cp.state, state: "PAUSED", uncertain: cp.uncertain || ["FLYING", "FEEDBACK", "RETURNING"].includes(cp.state), message: "Pausado" };
    if (event === "stop") return { ...next, state: "IDLE", uncertain: cp.uncertain || ["FLYING", "FEEDBACK", "RETURNING"].includes(cp.state), message: "Parado; checkpoint preservado" };
    if (event === "resume") {
      if (cp.state !== "PAUSED" || cp.uncertain) throw Error("Retomada bloqueada: resultado incerto ou estado inv\xE1lido");
      return { ...next, state: cp.previous ?? "HOME", message: "Retomado em diagn\xF3stico" };
    }
    const target = routes[cp.state]?.[event];
    if (!target) throw Error(`Transi\xE7\xE3o inv\xE1lida: ${cp.state}/${event}`);
    next.state = target;
    if (event === "confirmed") {
      next.cursor++;
      if (next.cursor >= next.queue.length) next.state = "COMPLETED";
    }
    return next;
  }
  function recover(cp) {
    if (["IDLE", "PAUSED", "COMPLETED"].includes(cp.state)) return cp;
    return { ...cp, previous: cp.state, state: "PAUSED", uncertain: true, message: "Contexto interrompido: confira a rodada antes de criar outro plano" };
  }

  // data/residuos.json
  var residuos_default = [
    {
      id: "jornal",
      nome: "Jornal",
      lixeira: "azul"
    },
    {
      id: "caixa-papelao",
      nome: "Caixa de papel\xE3o",
      lixeira: "azul"
    },
    {
      id: "revista",
      nome: "Revista",
      lixeira: "azul"
    },
    {
      id: "folha-sulfite",
      nome: "Folha de sulfite",
      lixeira: "azul"
    },
    {
      id: "embalagem-longa-vida",
      nome: "Caixa longa vida",
      lixeira: "azul"
    },
    {
      id: "garrafa-pet",
      nome: "Garrafa PET",
      lixeira: "azul"
    },
    {
      id: "frasco-shampoo",
      nome: "Frasco de shampoo",
      lixeira: "azul"
    },
    {
      id: "copo-plastico",
      nome: "Copo pl\xE1stico",
      lixeira: "azul"
    },
    {
      id: "sacola-plastica",
      nome: "Sacola pl\xE1stica",
      lixeira: "azul"
    },
    {
      id: "pote-margarina",
      nome: "Pote de margarina",
      lixeira: "azul"
    },
    {
      id: "bandeja-isopor",
      nome: "Bandeja de isopor",
      lixeira: "azul"
    },
    {
      id: "garrafa-vidro",
      nome: "Garrafa de vidro",
      lixeira: "azul"
    },
    {
      id: "pote-conserva",
      nome: "Pote de conserva",
      lixeira: "azul"
    },
    {
      id: "frasco-perfume",
      nome: "Frasco de perfume",
      lixeira: "azul"
    },
    {
      id: "lata-aluminio",
      nome: "Lata de alum\xEDnio",
      lixeira: "azul"
    },
    {
      id: "lata-aco",
      nome: "Lata de a\xE7o (conserva)",
      lixeira: "azul"
    },
    {
      id: "tampinha-metal",
      nome: "Tampinha met\xE1lica",
      lixeira: "azul"
    },
    {
      id: "papel-aluminio",
      nome: "Papel alum\xEDnio limpo",
      lixeira: "azul"
    },
    {
      id: "caixa-remedio",
      nome: "Caixa de rem\xE9dio e bula",
      lixeira: "azul"
    },
    {
      id: "cartela-comprimido",
      nome: "Cartela de comprimidos",
      lixeira: "cinza"
    },
    {
      id: "frasco-remedio",
      nome: "Frasco ou ampola de rem\xE9dio",
      lixeira: "cinza"
    },
    {
      id: "casca-banana",
      nome: "Casca de banana",
      lixeira: "cinza"
    },
    {
      id: "borra-cafe",
      nome: "Borra de caf\xE9",
      lixeira: "cinza"
    },
    {
      id: "restos-comida",
      nome: "Restos de comida",
      lixeira: "cinza"
    },
    {
      id: "papel-higienico-usado",
      nome: "Papel higi\xEAnico usado",
      lixeira: "cinza"
    },
    {
      id: "guardanapo-sujo",
      nome: "Guardanapo engordurado ou molhado",
      lixeira: "cinza"
    },
    {
      id: "caixa-pizza-engordurada",
      nome: "Caixa de pizza engordurada",
      lixeira: "cinza"
    },
    {
      id: "fralda-descartavel",
      nome: "Fralda descart\xE1vel",
      lixeira: "cinza"
    },
    {
      id: "esponja-cozinha",
      nome: "Esponja de cozinha",
      lixeira: "cinza"
    },
    {
      id: "bituca-cigarro",
      nome: "Bituca de cigarro",
      lixeira: "cinza"
    },
    {
      id: "espelho-quebrado",
      nome: "Espelho quebrado",
      lixeira: "cinza"
    },
    {
      id: "caneca-ceramica",
      nome: "Caneca de cer\xE2mica quebrada",
      lixeira: "cinza"
    },
    {
      id: "embalagem-bala-chiclete",
      nome: "Embalagem de bala ou chiclete",
      lixeira: "cinza"
    },
    {
      id: "capsula-cafe",
      nome: "C\xE1psula de caf\xE9",
      lixeira: "cinza"
    },
    {
      id: "sache-sal-acucar",
      nome: "Sach\xEA de sal ou a\xE7\xFAcar",
      lixeira: "cinza"
    },
    {
      id: "embalagem-suja-comida",
      nome: "Embalagem com resto de comida",
      lixeira: "cinza"
    },
    {
      id: "adesivo",
      nome: "Adesivo ou etiqueta",
      lixeira: "cinza"
    },
    {
      id: "fita-isolante",
      nome: "Fita isolante",
      lixeira: "cinza"
    },
    {
      id: "fita-adesiva",
      nome: "Fita adesiva",
      lixeira: "cinza"
    },
    {
      id: "plastico-bolha",
      nome: "Pl\xE1stico bolha",
      lixeira: "cinza"
    },
    {
      id: "escova-dente",
      nome: "Escova de dente",
      lixeira: "cinza"
    },
    {
      id: "caneta",
      nome: "Caneta",
      lixeira: "cinza"
    },
    {
      id: "objeto-plastico-misto",
      nome: "Objeto pl\xE1stico misto",
      lixeira: "cinza"
    },
    {
      id: "embalagem-laminada",
      nome: "Embalagem laminada",
      lixeira: "cinza"
    },
    {
      id: "algodao",
      nome: "Algod\xE3o ou cotonete usado",
      lixeira: "cinza"
    },
    {
      id: "chiclete-bala",
      nome: "Chiclete e bala",
      lixeira: "cinza"
    },
    {
      id: "palito-madeira-plastico",
      nome: "Palito de madeira ou pl\xE1stico",
      lixeira: "cinza"
    },
    {
      id: "lixa-unha",
      nome: "Lixa de unha",
      lixeira: "cinza"
    }
  ];

  // src/planner.ts
  var catalog = residuos_default;
  var defaults = { mode: "sequencial", ids: catalog.map((x) => x.id), category: "todos", repeats: 3, sequences: 2, order: "group", speed: 3 };
  function integer(n, max = 1e4) {
    if (typeof n !== "number" || !Number.isSafeInteger(n) || n < 1 || n > max) throw Error("Use um inteiro positivo dentro do limite " + max);
    return n;
  }
  function selected(c, items = catalog) {
    if (!["sequencial", "fixo"].includes(c.mode) || !["group", "rodizio"].includes(c.order) || !["todos", "azul", "cinza"].includes(c.category)) throw Error("Configura\xE7\xE3o inv\xE1lida");
    integer(c.repeats);
    integer(c.speed, 5);
    if (c.mode === "sequencial") integer(c.sequences);
    if (!Array.isArray(c.ids) || new Set(c.ids).size !== c.ids.length || c.ids.some((id) => !items.some((i) => i.id === id))) throw Error("Sele\xE7\xE3o inv\xE1lida");
    const chosen = items.filter((i) => c.ids.includes(i.id) && (c.category === "todos" || i.lixeira === c.category));
    if (!chosen.length || c.mode === "fixo" && chosen.length !== 1) throw Error("Selecione res\xEDduos; modo fixo exige exatamente um");
    return chosen;
  }
  function plan(c, items = catalog) {
    const chosen = selected(c, items), sequences = c.mode === "fixo" ? 1 : c.sequences;
    if (chosen.length * c.repeats * sequences > 1e4) throw Error("Limite de 10.000 partidas por plano");
    const tasks = [];
    const add = (s, i, r) => tasks.push({ id: `${s}:${i.id}:${r}`, sequence: s, repeat: r, item: { ...i } });
    for (let s = 1; s <= sequences; s++) {
      if (c.order === "group") for (const i of chosen) for (let r = 1; r <= c.repeats; r++) add(s, i, r);
      else for (let r = 1; r <= c.repeats; r++) for (const i of chosen) add(s, i, r);
    }
    return tasks;
  }

  // src/dom.ts
  var HOST = "atlasserver-anbefqardqe8b0f5.brazilsouth-01.azurewebsites.net";
  function allowed(url) {
    try {
      const u = new URL(url);
      return u.protocol === "https:" && u.hostname === HOST && u.pathname.startsWith("/ResiduoGo/public/");
    } catch {
      return false;
    }
  }

  // src/storage.ts
  async function readCheckpoint() {
    const data = await chrome.storage.local.get("checkpoint");
    if (data.checkpoint === void 0) return initial();
    const cp = data.checkpoint;
    if (cp?.version !== 1 || !Array.isArray(cp.queue) || !Number.isSafeInteger(cp.cursor) || cp.cursor < 0 || cp.cursor > cp.queue.length || !["IDLE", "HOME", "OPENING", "READY", "AIMING", "FLYING", "FEEDBACK", "RETRY", "RETURNING", "PAUSED", "COMPLETED", "ERROR"].includes(cp.state)) throw Error("Checkpoint incompat\xEDvel; n\xE3o executar");
    return cp;
  }

  // src/assisted-store.ts
  var emptyAssisted = () => ({ version: 1, active: {}, history: [] });
  var outcomes = ["success", "retry", "ended-failure", "network", "session", "timeout", "cancelled", "gesture-error"];
  function reserve(store, context, itemId, candidate, id, now, items = catalog) {
    if (store.active[String(context.tabId)]) throw Error("Confira e encerre o teste anterior antes de outro lan\xE7amento");
    if (!items.some((i) => i.id === itemId)) throw Error("Res\xEDduo n\xE3o reconhecido; inspecione e revise o cat\xE1logo");
    if (!Number.isFinite(candidate.force) || candidate.force < 0 || candidate.force > 1 || !Number.isFinite(candidate.spin) || Math.abs(candidate.spin) > Math.PI / 4) throw Error("For\xE7a ou giro inv\xE1lido");
    const attempt = { id, ...context, itemId, force: candidate.force, spin: candidate.spin, startedAt: now };
    return { ...store, active: { ...store.active, [String(context.tabId)]: attempt } };
  }
  function finish(store, context, id, outcome, now, measurement) {
    const attempt = store.active[String(context.tabId)];
    if (!attempt || attempt.id !== id || attempt.documentId !== context.documentId) throw Error("Teste pertence a outro documento");
    if (!outcomes.includes(outcome)) throw Error("Resultado inv\xE1lido");
    if (attempt.finishedAt !== void 0) return store;
    if (measurement && (!Number.isFinite(measurement.force) || measurement.force < 0 || measurement.force > 1 || !Number.isFinite(measurement.spin) || Math.abs(measurement.spin) > Math.PI / 4 || typeof measurement.trusted !== "boolean")) throw Error("Medi\xE7\xE3o inv\xE1lida");
    return { ...store, active: { ...store.active, [String(context.tabId)]: { ...attempt, outcome, finishedAt: now, ...measurement ? { measurement: { force: measurement.force, spin: measurement.spin, trusted: measurement.trusted } } : {} } } };
  }
  function review(store, tabId, id, now) {
    const attempt = store.active[String(tabId)];
    if (!attempt || attempt.id !== id) throw Error("Teste n\xE3o encontrado");
    const active = { ...store.active };
    delete active[String(tabId)];
    return { ...store, active, history: [...store.history, { ...attempt, reviewedAt: now }].slice(-1e3) };
  }

  // src/catalog-store.ts
  function validateItems(value) {
    if (!Array.isArray(value) || !value.length || value.length > 500) throw Error("Cat\xE1logo vazio ou excede 500 itens");
    const ids = /* @__PURE__ */ new Set();
    return value.map((item) => {
      if (!item || typeof item.id !== "string" || !item.id.trim() || item.id.length > 150 || ids.has(item.id) || typeof item.nome !== "string" || !item.nome.trim() || item.nome.length > 150 || !["azul", "cinza"].includes(item.lixeira)) throw Error("Cat\xE1logo inv\xE1lido ou duplicado");
      ids.add(item.id);
      return { id: item.id, nome: item.nome, lixeira: item.lixeira };
    });
  }
  function reviewCatalog(snapshot, inspectedAt, now) {
    if (!snapshot || snapshot.inspectedAt !== inspectedAt || snapshot.warning.includes("N\xE3o executar")) throw Error("Inspecione o menu atual antes de revisar");
    return { ...snapshot, items: validateItems(snapshot.items), reviewedAt: now };
  }

  // src/score.ts
  function parsePoints(text) {
    const clean = text.trim().replace(/\s+/g, " ");
    const totals = [...clean.matchAll(/Total:\s*([+−-]?(?:\d{1,3}(?:\.\d{3})+|\d+))\s*pontos/gi)];
    if (totals.length === 1 && clean.endsWith(totals[0][0])) return parsePoints(totals[0][1]);
    if (!/^[+−-]?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:\s*(?:ponto|pontos|pts))?$/i.test(clean)) return;
    const n = Number(clean.replace(/(?:pontos?|pts)$/i, "").trim().replace(/\./g, "").replace("\u2212", "-"));
    return Number.isSafeInteger(n) && Math.abs(n) <= 1e9 ? n : void 0;
  }
  function sanitizeScore(value) {
    if (!value || typeof value !== "object") return {};
    const v = value;
    const out = {};
    for (const key of ["hudBefore", "hudAfter", "feedbackPoints"]) if (Number.isSafeInteger(v[key]) && Math.abs(v[key]) <= 1e9) out[key] = v[key];
    if (out.hudBefore !== void 0 && out.hudAfter !== void 0) out.hudDelta = out.hudAfter - out.hudBefore;
    if (typeof v.feedbackText === "string") out.feedbackText = v.feedbackText.replace(/[\u0000-\u001f]/g, " ").slice(0, 120);
    if (out.feedbackText) {
      const parsed = parsePoints(out.feedbackText);
      if (parsed !== void 0) out.feedbackPoints = parsed;
    }
    return out;
  }

  // src/audit.ts
  function roundsCSV(rounds) {
    const rows = [["tipo", "execucao", "partida", "residuo_id", "residuo_nome", "categoria", "sequencia", "repeticao", "tentativas", "acertos_ui", "erros_ui", "inicio_utc", "fim_utc", "duracao_ms", "estado", "pontos_hud_final", "pontos_feedback_final"]];
    for (const r of rounds) rows.push(["partida", r.runId, r.id, r.task.item.id, r.task.item.nome, r.task.item.lixeira, r.task.sequence, r.task.repeat, r.attempts.length, r.attempts.filter((a) => a.outcome === "success").length, r.attempts.filter((a) => a.outcome === "retry" || a.outcome === "ended-failure").length, new Date(r.startedAt).toISOString(), r.endedAt === void 0 ? "" : new Date(r.endedAt).toISOString(), r.endedAt === void 0 ? "" : r.endedAt - r.startedAt, r.phase, r.attempts.at(-1)?.score?.hudAfter, sanitizeScore(r.attempts.at(-1)?.score).feedbackPoints]);
    return "\uFEFF" + rows.map((row) => row.map(csvCell).join(";")).join("\r\n");
  }
  function csvCell(value) {
    let text = String(value ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "");
    if (/^\s*[=+@\-]/.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  }
  function attemptsCSV(store, rounds = []) {
    const rows = [["tipo", "id_local", "residuo", "inicio_utc", "fim_utc", "resultado_ui", "conferido_utc", "forca_solicitada", "giro_rad", "forca_medida", "giro_medido_rad", "entrada_real", "hud_antes", "hud_depois", "delta_hud", "feedback_pontos", "feedback_texto", "espera_sorteada_ms", "arraste_alvo_ms"]];
    for (const a of [...store.history, ...Object.values(store.active)]) rows.push(["tentativa_assistida", a.id, a.itemId, new Date(a.startedAt).toISOString(), a.finishedAt === void 0 ? "" : new Date(a.finishedAt).toISOString(), a.outcome ?? "incerto", a.reviewedAt === void 0 ? "" : new Date(a.reviewedAt).toISOString(), a.force, a.spin, a.measurement?.force, a.measurement?.spin, a.measurement?.trusted, "", "", "", "", "", "", ""]);
    for (const r of rounds) for (const a of r.attempts) rows.push(["tentativa_de_partida", a.id, r.task.item.id, new Date(a.startedAt).toISOString(), a.finishedAt === void 0 ? "" : new Date(a.finishedAt).toISOString(), a.outcome ?? "incerto", "", a.force, a.spin, "", "", "", sanitizeScore(a.score).hudBefore, sanitizeScore(a.score).hudAfter, sanitizeScore(a.score).hudDelta, sanitizeScore(a.score).feedbackPoints, sanitizeScore(a.score).feedbackText, a.pacing?.waitMs, a.pacing?.dragMs]);
    return "\uFEFF" + rows.map((row) => row.map(csvCell).join(";")).join("\r\n");
  }
  function attemptMetrics(store) {
    const attempts = [...store.history, ...Object.values(store.active)];
    return { attempts: attempts.length, success: attempts.filter((a) => a.outcome === "success").length, blocked: Object.keys(store.active).length };
  }

  // package.json
  var package_default = {
    name: "ecobot",
    version: "0.8.0",
    private: true,
    type: "module",
    scripts: {
      build: "tsc --noEmit && node build.mjs",
      lint: "tsc --noEmit --noUnusedLocals --noUnusedParameters"
    },
    devDependencies: {
      "@types/chrome": "0.1.43",
      esbuild: "0.25.12",
      typescript: "5.9.3"
    }
  };

  // src/version.ts
  var BUILD_VERSION = package_default.version;
  var PROTOCOL = 8;
  function assertBuild(reply) {
    if (reply?.buildVersion !== BUILD_VERSION) throw Error(`Vers\xF5es desencontradas. Esta tela \xE9 ${BUILD_VERSION}, mas o componente carregado \xE9 ${reply?.buildVersion ?? "antigo"}. Recarregue o EcoBot na p\xE1gina de extens\xF5es e depois recarregue a aba do jogo.`);
  }

  // src/debugger-input.ts
  var controls = /* @__PURE__ */ new Map();
  function cancelDebugger(tabId) {
    controls.get(tabId)?.abort();
  }
  function validateProbe(probe) {
    if (!probe?.ok || ![probe.start?.x, probe.start?.y, probe.end?.x, probe.end?.y, probe.width, probe.height].every(Number.isFinite) || probe.width <= 0 || probe.height <= 0) throw Error("Geometria de entrada inv\xE1lida");
    for (const p of [probe.start, probe.end]) if (p.x < 0 || p.y < 0 || p.x >= probe.width || p.y >= probe.height) throw Error("Gesto fora da janela");
    if (probe.end.y <= probe.start.y || Math.hypot(probe.end.x - probe.start.x, probe.end.y - probe.start.y) < 18) throw Error("Arraste inv\xE1lido");
  }
  async function debuggerThrow(attempt) {
    const waitMs = attempt.waitMs ?? 0, dragMs = attempt.dragMs ?? 192;
    if (!Number.isInteger(waitMs) || waitMs < 0 || waitMs > 2400 || !Number.isInteger(dragMs) || dragMs < 120 || dragMs > 1e3) throw Error("Ritmo fora dos limites permitidos");
    const { tabId, documentId, itemId } = attempt;
    if (controls.has(tabId)) throw Error("Entrada j\xE1 em andamento nesta aba");
    const abort = new AbortController();
    controls.set(tabId, abort);
    const target = { tabId };
    let attached = false, pressed = false, released = false;
    let probe;
    const check = async () => {
      abort.signal.throwIfAborted();
      const tab = await chrome.tabs.get(tabId);
      if (!tab.url || !allowed(tab.url) || new URL(tab.url).pathname !== "/ResiduoGo/public/index.php/ar" || new URL(tab.url).searchParams.get("residuo") !== itemId) throw Error("A aba deixou a partida autorizada");
      const alive = await chrome.tabs.sendMessage(tabId, { type: "probe-document" }, { documentId });
      assertBuild(alive);
      if (!alive?.ok) throw Error("Documento reservado indispon\xEDvel");
      abort.signal.throwIfAborted();
    };
    const command = async (method, params) => {
      await check();
      await chrome.debugger.sendCommand(target, method, params);
      abort.signal.throwIfAborted();
    };
    const detach = (source) => {
      if (source.tabId === tabId) abort.abort();
    };
    chrome.debugger.onDetach.addListener(detach);
    const timer = setTimeout(() => abort.abort(), 8e3);
    try {
      await check();
      if (waitMs) await new Promise((resolve, reject) => {
        const done = () => {
          abort.signal.removeEventListener("abort", cancel);
          resolve();
        };
        const delay = setTimeout(done, waitMs);
        const cancel = () => {
          clearTimeout(delay);
          reject(Error("Espera cancelada"));
        };
        abort.signal.addEventListener("abort", cancel, { once: true });
        if (abort.signal.aborted) cancel();
      });
      await check();
      if (!await chrome.permissions.contains({ permissions: ["debugger"] })) throw Error("Permiss\xE3o debugger n\xE3o concedida pelo navegador");
      await chrome.debugger.attach(target, "1.3");
      attached = true;
      await check();
      probe = await chrome.tabs.sendMessage(tabId, { type: "probe-gesture", candidate: { force: attempt.force, spin: attempt.spin, margin: 0 } }, { documentId });
      validateProbe(probe);
      abort.signal.throwIfAborted();
      const { start, end } = probe;
      await command("Input.dispatchMouseEvent", { type: "mouseMoved", x: start.x, y: start.y, buttons: 0 });
      pressed = true;
      await command("Input.dispatchMouseEvent", { type: "mousePressed", x: start.x, y: start.y, button: "left", buttons: 1, clickCount: 1 });
      for (let i = 1; i <= 12; i++) {
        await new Promise((resolve) => setTimeout(resolve, dragMs / 12));
        await command("Input.dispatchMouseEvent", { type: "mouseMoved", x: start.x + (end.x - start.x) * i / 12, y: start.y + (end.y - start.y) * i / 12, buttons: 1 });
      }
      await check();
      released = true;
      await chrome.debugger.sendCommand(target, "Input.dispatchMouseEvent", { type: "mouseReleased", x: end.x, y: end.y, button: "left", buttons: 0, clickCount: 1 });
    } finally {
      clearTimeout(timer);
      let sameDocument = false;
      if (attached && pressed && !released) {
        try {
          const tab = await chrome.tabs.get(tabId);
          const alive = await chrome.tabs.sendMessage(tabId, { type: "probe-document" }, { documentId });
          sameDocument = !!tab.url && allowed(tab.url) && new URL(tab.url).pathname === "/ResiduoGo/public/index.php/ar" && new URL(tab.url).searchParams.get("residuo") === itemId && alive?.ok === true;
        } catch {
        }
      }
      if (attached && pressed && !released && sameDocument) {
        await chrome.debugger.sendCommand(target, "Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 }).catch(() => {
        });
        await chrome.debugger.sendCommand(target, "Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 }).catch(() => {
        });
        if (probe) await chrome.debugger.sendCommand(target, "Input.dispatchMouseEvent", { type: "mouseReleased", x: probe.start.x, y: probe.start.y, button: "left", buttons: 0 }).catch(() => {
        });
      }
      if (attached) await chrome.debugger.detach(target).catch(() => {
      });
      chrome.debugger.onDetach.removeListener(detach);
      controls.delete(tabId);
    }
  }

  // src/round.ts
  function openRound(runId, id, task, tabId, now) {
    return { runId, id, task: structuredClone(task), tabId, phase: "OPENING", startedAt: now, attempts: [] };
  }
  function pauseRound(round, reason) {
    if (round.phase === "COMPLETED") return round;
    return { ...round, phase: "PAUSED", reason };
  }
  function enterAR(round, context) {
    if (round.tabId !== context.tabId || round.task.item.id !== context.itemId) throw Error("Aba ou res\xEDduo diverge da partida");
    if (round.documentId === context.documentId) return round;
    if (round.phase !== "OPENING" || round.documentId) return pauseRound(round, "Documento interrompido; conferir a rodada");
    return { ...round, documentId: context.documentId, phase: "READY" };
  }
  function reserveThrow(round, documentId, id, now) {
    if (round.documentId !== documentId || !["READY", "RETRY"].includes(round.phase)) throw Error("Lan\xE7amento bloqueado por estado ou documento");
    if (round.attempts.length >= 3 || round.attempts.some((a) => a.id === id)) throw Error("Limite de tentativas ou ID duplicado");
    return { ...round, phase: "FLYING", attempts: [...round.attempts, { id, startedAt: now }] };
  }
  function observeThrow(round, documentId, id, outcome, ended, now) {
    if (round.documentId !== documentId) throw Error("Feedback de outro documento");
    const attempt = round.attempts.at(-1);
    if (!attempt || attempt.id !== id) throw Error("Tentativa n\xE3o corresponde \xE0 reserva");
    if (attempt.finishedAt !== void 0) return round;
    if (round.phase !== "FLYING") throw Error("Resultado sem lan\xE7amento reservado");
    const attempts = round.attempts.map((a) => a.id === id ? { ...a, outcome, finishedAt: now } : a);
    const next = { ...round, attempts };
    if ((outcome === "success" || outcome === "ended-failure") && ended) return { ...next, phase: "RETURNING", terminal: outcome };
    if (outcome === "retry" && !ended && attempts.length < 3) return { ...next, phase: "RETRY" };
    return pauseRound(next, "Resultado incerto: " + outcome);
  }
  function confirmMenu(round, context, now) {
    if (round.phase === "COMPLETED") return round;
    if (round.phase !== "RETURNING" || !round.terminal || !context.hasCatalog || context.tabId !== round.tabId || context.documentId === round.documentId) throw Error("Retorno ao menu ainda n\xE3o confirmado");
    return { ...round, phase: "COMPLETED", menuDocumentId: context.documentId, endedAt: now };
  }
  function commitRound(ledger, round) {
    if (round.runId !== ledger.runId) throw Error("Partida de outra execu\xE7\xE3o");
    if (ledger.history.some((r) => r.id === round.id)) return ledger;
    if (ledger.active?.id !== round.id || round.phase !== "COMPLETED" || !round.endedAt) throw Error("Partida ainda n\xE3o confirmada");
    return { ...ledger, cursor: ledger.cursor + 1, active: void 0, history: [...ledger.history, round] };
  }

  // src/aim.ts
  function validateProfile(p) {
    if (!p || !Number.isFinite(p.force) || p.force < 0.1 || p.force > 1 || !Number.isFinite(p.spin) || Math.abs(p.spin) > Math.PI / 4) throw Error("For\xE7a fixa deve estar entre 10 e 100%; giro entre \u221245\xB0 e 45\xB0");
    if (p.range) {
      const r = p.range;
      if (![r.forceMin, r.forceMax, r.angleMin, r.angleMax].every(Number.isSafeInteger) || r.forceMin < 10 || r.forceMax > 100 || r.forceMin > r.forceMax || r.angleMin < -45 || r.angleMax > 45 || r.angleMin > r.angleMax) throw Error("Faixas devem ter limites inteiros ordenados: for\xE7a 10\u2013100% e \xE2ngulo \u221245\u201345\xB0");
    }
  }
  function drawInt(min, max, random = () => crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296) {
    const n = random();
    if (!Number.isFinite(n) || n < 0 || n >= 1) throw Error("Fonte de sorteio inv\xE1lida");
    return min + Math.floor(n * (max - min + 1));
  }
  var samePair = (a, b) => Math.abs(a.force - b.force) < 1e-8 && Math.abs(a.spin - b.spin) < 1e-8;
  function chooseDifferent(p, previous, random) {
    requireVariation(p);
    return pickPair(rangePairs(p.range), previous, random);
  }
  function requireVariation(p) {
    validateProfile(p);
    if (!p.range || p.range.forceMin === p.range.forceMax && p.range.angleMin === p.range.angleMax) throw Error("Configure ao menos duas combina\xE7\xF5es; execu\xE7\xE3o fixa antiga exige nova configura\xE7\xE3o");
  }
  function rangePairs(r) {
    const pairs = [];
    for (let f = r.forceMin; f <= r.forceMax; f++) for (let a = r.angleMin; a <= r.angleMax; a++) pairs.push({ force: f / 100, spin: a * Math.PI / 180 });
    return pairs;
  }
  function unmeasuredPairs(rounds, itemId, category, level2, range, verified = []) {
    const known = combinedEvidence(rounds, verified).filter((r) => r.itemId === itemId && r.category === category && r.level === level2);
    return rangePairs(range).filter((p) => !known.some((r) => samePair(p, { force: r.force / 100, spin: r.angle * Math.PI / 180 })));
  }
  function pickPair(pairs, previous, random) {
    const unique = pairs.filter((p, i) => pairs.findIndex((x) => samePair(p, x)) === i);
    if (unique.length < 2) throw Error("S\xE3o necess\xE1rias ao menos duas combina\xE7\xF5es para variar a cada lance");
    const options = unique.filter((p) => !previous || !samePair(p, previous));
    return { ...options[drawInt(0, options.length - 1, random)], margin: 0 };
  }
  function observedPairs(rounds, itemId, category, level2, range, verified = []) {
    return combinedEvidence(rounds, verified).filter((r) => r.itemId === itemId && r.category === category && r.level === level2 && r.successes + (r.priorSuccesses ?? 0) > 0 && r.misses === 0 && (!range || r.force >= range.forceMin && r.force <= range.forceMax && r.angle >= range.angleMin && r.angle <= range.angleMax)).map((r) => ({ force: r.force / 100, spin: r.angle * Math.PI / 180 }));
  }
  function combinedEvidence(rounds, verified) {
    const rows = aimEvidence(rounds);
    for (const v of verified) {
      let row = rows.find((r) => r.itemId === v.itemId && r.category === v.category && r.level === v.level && r.force === v.force && r.angle === v.angle);
      if (!row) {
        row = { ...v, successes: 0, misses: 0, hudDeltas: [], feedbackScores: [] };
        rows.push(row);
      }
      row.priorSuccesses = (row.priorSuccesses ?? 0) + 1;
      if (v.points !== void 0) row.feedbackScores.push(v.points);
    }
    return rows;
  }
  function aimEvidence(rounds) {
    const groups = /* @__PURE__ */ new Map();
    for (const round of rounds) for (const a of round.attempts) {
      if (!["success", "retry", "ended-failure"].includes(a.outcome ?? "") || a.force === void 0 || a.spin === void 0) continue;
      const force = Math.round(a.force * 1e4) / 100, angle = Math.round(a.spin * 180 / Math.PI * 100) / 100;
      const key = JSON.stringify([round.task.item.id, round.task.item.lixeira, round.level ?? "n\xE3o registrado", force, angle]);
      const row = groups.get(key) ?? { itemId: round.task.item.id, category: round.task.item.lixeira, level: round.level ?? "n\xE3o registrado", force, angle, successes: 0, misses: 0, hudDeltas: [], feedbackScores: [] };
      const score = sanitizeScore(a.score);
      if (score.hudDelta !== void 0) row.hudDeltas.push(score.hudDelta);
      if (score.feedbackPoints !== void 0) row.feedbackScores.push(score.feedbackPoints);
      if (a.outcome === "success") row.successes++;
      else row.misses++;
      groups.set(key, row);
    }
    return [...groups.values()];
  }

  // src/pacing.ts
  function paceRange(speed) {
    if (!Number.isInteger(speed) || speed < 1 || speed > 5) throw Error("Velocidade deve estar entre 1 e 5");
    return [{ min: 1600, max: 2400 }, { min: 1300, max: 2100 }, { min: 800, max: 1800 }, { min: 500, max: 1200 }, { min: 300, max: 850 }][speed - 1];
  }
  function choosePacing(speed, random) {
    const r = paceRange(speed);
    return { waitMs: drawInt(r.min, r.max, random), dragMs: drawInt(220, 420, random) };
  }

  // src/verified.ts
  var level = "N\xEDvel Especialista";
  var VERIFIED_PAIRS = [
    ...[[38, 26], [36, 26, 338], [37, 27, 342], [38, 27, 344], [33, 30, 310], [34, 31, 312], [32, 33, 294], [33, 33, 298], [32, 32, 298], [32, 34, 290]].map(([force, angle, points]) => ({ itemId: "jornal", category: "azul", level, force, angle, points })),
    ...[[38, -26], [36, -25, 336], [37, -26, 344]].map(([force, angle, points]) => ({ itemId: "casca-banana", category: "cinza", level, force, angle, points }))
  ];

  // src/execution.ts
  async function seriesMessage(message, sender, reply) {
    let cp = await readCheckpoint();
    let roundHistory;
    const save = async () => {
      await chrome.storage.local.set({ checkpoint: cp, ...roundHistory ? { roundHistory } : {} });
    };
    if (message.type === "series-start") {
      if (sender.tab && sender.url !== chrome.runtime.getURL("popup.html")) throw Error("Somente o painel pode iniciar");
      if (cp.uncertain || cp.execution?.status === "RUNNING" || cp.execution?.active) throw Error("Pause e confira a rodada pendente antes de iniciar outra execu\xE7\xE3o");
      const stored = await chrome.storage.local.get(["catalogReview", "assisted"]);
      const catalogReview = stored.catalogReview;
      const assisted = stored.assisted;
      if (message.config) {
        const config = message.config;
        cp = { ...initial(), config, queue: plan(config, catalogReview?.reviewedAt ? catalogReview.items : void 0), state: "PAUSED" };
      }
      if (cp.cursor >= cp.queue.length) throw Error("Selecione res\xEDduos e uma quantidade de partidas");
      const limit = message.limit ?? cp.queue.length - cp.cursor;
      if (!Number.isInteger(limit) || limit < 1 || limit > 1e4) throw Error("Use um limite entre 1 e 10.000 partidas");
      const calibration = message.calibration;
      if (!calibration || typeof calibration.level !== "string" || !calibration.level.trim()) throw Error("Informe o n\xEDvel da calibra\xE7\xE3o");
      if (calibration.measuring && (limit !== 2 || cp.queue.length !== 2 || cp.queue[0].item.id !== cp.queue[1].item.id)) throw Error("Medi\xE7\xE3o exige um res\xEDduo e exatamente duas partidas");
      for (const bin of ["azul", "cinza"]) if (calibration[bin]) requireVariation(calibration[bin]);
      if (calibration.measuring) {
        const item = cp.queue[cp.cursor].item;
        const range = calibration[item.lixeira]?.range;
        const history = (await chrome.storage.local.get("roundHistory")).roundHistory ?? [];
        if (!range || unmeasuredPairs(history, item.id, item.lixeira, calibration.level, range, VERIFIED_PAIRS).length < 2) throw Error("H\xE1 menos de dois pares ainda n\xE3o medidos nesta faixa. Amplie a faixa ou inicie com os pares j\xE1 observados.");
      }
      if (calibration.observedOnly) {
        const history = (await chrome.storage.local.get("roundHistory")).roundHistory ?? [];
        const missing = [...new Map(cp.queue.slice(cp.cursor, cp.cursor + limit).map((t) => [t.item.id, t.item])).values()].filter((item) => observedPairs(history, item.id, item.lixeira, calibration.level, calibration[item.lixeira]?.range, VERIFIED_PAIRS).length < 2);
        if (missing.length) throw Error("Faltam 2 pares com acerto e sem erro neste n\xEDvel para: " + missing.slice(0, 5).map((i) => i.nome).join(", ") + ". Selecione um res\xEDduo e use Medir 2 lances. Nenhuma partida iniciada.");
      }
      if (!catalogReview?.reviewedAt || catalogReview.warning.includes("N\xE3o executar")) throw Error("Inspecione e revise o cat\xE1logo do menu atual");
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id || !tab.url || !allowed(tab.url) || new URL(tab.url).pathname !== "/ResiduoGo/public/index.php") throw Error("Inicie na aba do menu do jogo");
      if (Object.keys(assisted?.active ?? {}).length) throw Error("Confira e encerre o teste assistido antes da s\xE9rie");
      const previousRounds = (await chrome.storage.local.get("roundHistory")).roundHistory ?? [];
      const last = previousRounds.flatMap((r) => r.attempts).filter((a) => a.force !== void 0 && a.spin !== void 0 && a.inputClaimedAt !== void 0).at(-1);
      cp = { ...cp, state: "HOME", message: "Execu\xE7\xE3o em andamento pela interface do jogo", execution: { id: crypto.randomUUID(), tabId: tab.id, status: "RUNNING", limit: Math.min(limit, cp.queue.length - cp.cursor), completed: 0, calibration, history: [], ...last ? { lastAim: { force: last.force, spin: last.spin } } : {} } };
      await save();
      void chrome.tabs.sendMessage(tab.id, { type: "series-wake" }).catch(() => {
      });
      reply({ ok: true, cp });
      return;
    }
    const run = cp.execution;
    if (message.type === "series-status") {
      reply({ ok: true, cp });
      return;
    }
    if (message.type === "series-review") {
      if (sender.url !== chrome.runtime.getURL("popup.html") || message.reviewed !== true || !run?.active || run.active.id !== message.id || run.status === "RUNNING") throw Error("Pause e confira a pend\xEAncia atual antes de arquivar");
      const archived = { ...pauseRound(run.active, "Arquivada manualmente ap\xF3s confer\xEAncia; partida n\xE3o contabilizada"), reviewedAt: Date.now() };
      const stored = await chrome.storage.local.get("roundHistory");
      const previous = stored.roundHistory ?? [];
      if (!Array.isArray(previous)) throw Error("Hist\xF3rico incompat\xEDvel");
      roundHistory = previous.some((r) => r.id === archived.id) ? previous : [...previous, archived].slice(-1e4);
      run.active = void 0;
      run.status = "STOPPED";
      cp.state = "IDLE";
      cp.uncertain = false;
      cp.message = "Pend\xEAncia arquivada ap\xF3s confer\xEAncia. Cursor preservado; nenhum resultado reenviado.";
      await save();
      reply({ ok: true, cp });
      return;
    }
    if (!sender.tab?.id || sender.frameId !== 0 || !sender.documentId || !sender.url || !allowed(sender.url)) throw Error("Documento de execu\xE7\xE3o inv\xE1lido");
    if (!run || run.tabId !== sender.tab.id) {
      reply({ ok: true, action: "idle" });
      return;
    }
    const documentId = sender.documentId;
    const path = new URL(sender.url).pathname;
    const pause = async (reason) => {
      cancelDebugger(run.tabId);
      run.status = "PAUSED";
      if (run.active) run.active = pauseRound(run.active, reason);
      cp.state = "PAUSED";
      cp.uncertain = !!run.active;
      cp.message = reason;
      await save();
      reply({ ok: true, action: "pause", cp });
    };
    if (message.type === "series-fault") {
      await pause("Execu\xE7\xE3o interrompida; confira a rodada antes de retomar");
      return;
    }
    if (run.status !== "RUNNING") {
      reply({ ok: true, action: "pause" });
      return;
    }
    if (message.type === "series-document") {
      if (path === "/ResiduoGo/public/index.php" && message.screen === "HOME") {
        if (run.active) {
          if (run.active.phase !== "RETURNING") {
            await pause("Retorno sem encerramento confirmado; partida n\xE3o contabilizada");
            return;
          }
          const done = confirmMenu(run.active, { tabId: run.tabId, documentId, hasCatalog: message.hasCatalog === true }, Date.now());
          const ledger = commitRound({ version: 1, runId: run.id, cursor: cp.cursor, active: run.active, history: run.history }, done);
          cp.cursor = ledger.cursor;
          run.history = ledger.history;
          run.active = void 0;
          run.completed++;
          const storedHistory = await chrome.storage.local.get("roundHistory");
          const previous = storedHistory.roundHistory ?? [];
          if (!Array.isArray(previous)) throw Error("Hist\xF3rico de partidas incompat\xEDvel");
          roundHistory = previous.some((r) => r.id === done.id) ? previous : [...previous, done].slice(-1e4);
        }
        if (cp.cursor >= cp.queue.length || run.completed >= run.limit) {
          run.status = "COMPLETED";
          cp.state = cp.cursor >= cp.queue.length ? "COMPLETED" : "PAUSED";
          cp.previous = "HOME";
          cp.message = `Execu\xE7\xE3o conclu\xEDda: ${run.completed} partidas confirmadas. Fila preservada.`;
          await save();
          reply({ ok: true, action: "pause", cp });
          return;
        }
        const { catalogReview } = await chrome.storage.local.get("catalogReview");
        const reviewed = catalogReview;
        if (!reviewed?.reviewedAt || !Array.isArray(message.items) || message.items.length !== reviewed.items.length || reviewed.items.some((i) => !message.items.some((actual) => actual.id === i.id && actual.nome === i.nome && actual.lixeira === i.lixeira))) {
          await pause("Cat\xE1logo mudou: inspecione e revise a sele\xE7\xE3o antes de continuar");
          return;
        }
        const task = cp.queue[cp.cursor];
        if (!message.items.some((item) => item.id === task.item.id && item.nome === task.item.nome && item.lixeira === task.item.lixeira)) {
          await pause("Sele\xE7\xE3o planejada diverge do menu; prepare uma fila revisada");
          return;
        }
        if (!run.calibration[task.item.lixeira]) {
          await pause("Categoria sem calibra\xE7\xE3o; nenhuma nova partida aberta");
          return;
        }
        run.active = openRound(run.id, crypto.randomUUID(), task, run.tabId, Date.now());
        cp.state = "OPENING";
        await save();
        reply({ ok: true, action: "open", itemId: task.item.id });
        return;
      }
      if (path === "/ResiduoGo/public/index.php/ar" && run.active) {
        const oldDocument = run.active.documentId;
        run.active = enterAR(run.active, { tabId: run.tabId, documentId, itemId: new URL(sender.url).searchParams.get("residuo") ?? "" });
        if (run.active.phase === "PAUSED") {
          await pause("Recarga da partida: confira o resultado, sem repetir");
          return;
        }
        if (oldDocument === documentId) {
          reply({ ok: true, action: "idle" });
          return;
        }
        cp.state = "READY";
        await save();
        reply({ ok: true, action: "play", calibration: run.calibration, category: run.active.task.item.lixeira });
        return;
      }
      await pause("Tela n\xE3o reconhecida ou sess\xE3o perdida");
      return;
    }
    const round = run.active;
    if (!round || round.documentId !== documentId || path !== "/ResiduoGo/public/index.php/ar") throw Error("Partida de outro documento");
    if (message.type === "series-reserve") {
      if (message.level !== run.calibration.level) {
        await pause("N\xEDvel mudou: requer nova calibra\xE7\xE3o");
        return;
      }
      const profile = run.calibration[round.task.item.lixeira];
      if (!profile) throw Error("Categoria sem calibra\xE7\xE3o");
      const storedRounds = (await chrome.storage.local.get("roundHistory")).roundHistory ?? [];
      const candidate = run.calibration.measuring ? (() => {
        const options = unmeasuredPairs(storedRounds, round.task.item.id, round.task.item.lixeira, run.calibration.level, profile.range, VERIFIED_PAIRS);
        if (options.length === 1) return { ...options[0], margin: 0 };
        return pickPair(options, run.lastAim);
      })() : run.calibration.observedOnly ? pickPair(observedPairs([...storedRounds, round], round.task.item.id, round.task.item.lixeira, run.calibration.level, profile.range, VERIFIED_PAIRS), run.lastAim) : chooseDifferent(profile, run.lastAim);
      run.active = reserveThrow(round, documentId, crypto.randomUUID(), Date.now());
      run.active.level = message.level;
      run.lastAim = { force: candidate.force, spin: candidate.spin };
      Object.assign(run.active.attempts.at(-1), { force: candidate.force, spin: candidate.spin, pacing: choosePacing(cp.config?.speed ?? 3) });
      cp.state = "FLYING";
      await save();
      reply({ ok: true, id: run.active.attempts.at(-1).id, candidate });
      return;
    }
    const attempt = round.attempts.at(-1);
    if (message.type === "series-input") {
      if (!attempt || attempt.id !== message.id || attempt.finishedAt !== void 0 || attempt.inputClaimedAt !== void 0 || round.phase !== "FLYING") throw Error("Entrada j\xE1 consumida ou sem reserva");
      if (attempt.force === void 0 || attempt.spin === void 0) throw Error("Par\xE2metros da reserva n\xE3o encontrados; n\xE3o sortear novamente");
      const candidate = { force: attempt.force, spin: attempt.spin };
      attempt.inputClaimedAt = Date.now();
      await save();
      void debuggerThrow({ id: attempt.id, tabId: run.tabId, documentId, itemId: round.task.item.id, ...candidate, ...attempt.pacing, startedAt: attempt.startedAt }).then(() => reply({ ok: true }), () => reply({ ok: false, error: "Entrada interrompida; n\xE3o repetir" }));
      return;
    }
    if (message.type === "series-finish") {
      const alreadyFinished = round.attempts.at(-1)?.finishedAt !== void 0;
      run.active = observeThrow(round, documentId, message.id, message.outcome, message.ended === true, Date.now());
      if (!alreadyFinished) run.active.attempts.at(-1).score = sanitizeScore(message.score);
      if ((run.calibration.measuring || run.calibration.pauseOnMiss) && run.active.attempts.at(-1)?.outcome !== "success") {
        await pause("Lance sem acerto confirmado. Execu\xE7\xE3o pausada; confira o jogo. O par com erro ser\xE1 exclu\xEDdo ap\xF3s arquivar a pend\xEAncia.");
        return;
      }
      if (run.active.phase === "PAUSED") {
        await pause("Resultado amb\xEDguo; partida preservada sem contabilizar");
        return;
      }
      cp.state = run.active.phase === "RETRY" ? "RETRY" : "RETURNING";
      await save();
      reply({ ok: true, action: run.active.phase === "RETRY" ? "retry" : "return" });
      return;
    }
    throw Error("Comando de execu\xE7\xE3o desconhecido");
  }

  // src/worker.ts
  var serial = Promise.resolve();
  async function assistedStore() {
    const data = await chrome.storage.local.get("assisted");
    const store = data.assisted;
    if (store && (store.version !== 1 || !store.active || !Array.isArray(store.history))) throw Error("Checkpoint de teste incompat\xEDvel");
    return store ?? emptyAssisted();
  }
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    const reply = (payload) => respond({ ...payload, buildVersion: BUILD_VERSION });
    if (sender.id !== chrome.runtime.id) return false;
    if (message?.type === "assisted-input-cancel" && sender.tab?.id && sender.frameId === 0 && sender.url && allowed(sender.url)) cancelDebugger(sender.tab.id);
    serial = serial.catch(() => {
    }).then(async () => {
      const popupUrl = chrome.runtime.getURL?.("popup.html");
      const fromPopup = !!popupUrl && sender.url === popupUrl;
      if (sender.tab && !fromPopup) assertBuild(message);
      if (fromPopup && message.type === "series-start") assertBuild(message);
      if (typeof message?.type === "string" && message.type.startsWith("series-")) {
        await seriesMessage(message, sender, reply);
        return;
      }
      if (sender.tab && !fromPopup) {
        if (sender.frameId !== 0 || !sender.documentId || !sender.url || !allowed(sender.url) || !sender.tab.id || new URL(sender.url).pathname !== "/ResiduoGo/public/index.php/ar") throw Error("Contexto de teste inv\xE1lido");
        const context = { tabId: sender.tab.id, documentId: sender.documentId };
        let store = await assistedStore();
        const { catalogReview } = await chrome.storage.local.get("catalogReview");
        const snapshot = catalogReview;
        const items = snapshot?.reviewedAt ? snapshot.items : catalog;
        if (message.type === "assisted-input") {
          const attempt = store.active[String(context.tabId)];
          if (!attempt || attempt.id !== message.id || attempt.documentId !== context.documentId || attempt.finishedAt !== void 0 || attempt.inputClaimedAt !== void 0) throw Error("Entrada bloqueada: reserva ausente, j\xE1 consumida ou documento divergente");
          attempt.inputClaimedAt = Date.now();
          await chrome.storage.local.set({ assisted: store });
          void debuggerThrow(attempt).then(() => reply({ ok: true }), () => reply({ ok: false, error: "Gesto interrompido ou recusado. Confira o jogo; n\xE3o repetir." }));
          return;
        }
        if (message.type === "assisted-input-cancel") {
          reply({ ok: true });
          return;
        }
        if (message.type === "assisted-reserve") {
          const itemId = new URL(sender.url).searchParams.get("residuo");
          if (itemId !== message.itemId) throw Error("Res\xEDduo diverge da aba atual");
          store = reserve(store, context, message.itemId, message.candidate, crypto.randomUUID(), Date.now(), items);
        } else if (message.type === "assisted-finish") store = finish(store, context, message.id, message.outcome, Date.now(), message.measurement);
        else if (message.type === "assisted-review") store = review(store, context.tabId, message.id, Date.now());
        else if (message.type !== "assisted-status") throw Error("Comando de teste desconhecido");
        await chrome.storage.local.set({ assisted: store });
        reply({ ok: true, attempt: store.active[String(context.tabId)], itemKnown: items.some((i) => i.id === new URL(sender.url).searchParams.get("residuo")) });
        return;
      }
      let cp = await readCheckpoint();
      let wakeTab;
      if (message.type === "plan") {
        if (cp.state !== "IDLE" && cp.state !== "COMPLETED") throw Error("Pare o plano atual antes de substitu\xED-lo");
        if (cp.uncertain) throw Error("Checkpoint incerto: confira a rodada antes de substituir o plano");
        const { catalogReview } = await chrome.storage.local.get("catalogReview");
        const snapshot = catalogReview;
        const config = message.config;
        cp = { ...initial(), config, queue: plan(config, snapshot?.reviewedAt ? snapshot.items : void 0), state: "PAUSED", previous: "HOME", message: "Fila preparada. Confira o total e clique em Iniciar na aba do menu." };
      } else if (message.type === "pause" || message.type === "stop") {
        cp = transition(cp, message.type);
        if (cp.execution) {
          cp.execution.status = message.type === "stop" ? "STOPPED" : "PAUSED";
          cp.uncertain = cp.uncertain || !!cp.execution.active;
          cancelDebugger(cp.execution.tabId);
          void chrome.tabs.sendMessage(cp.execution.tabId, { type: "cancel-assisted" }).catch(() => {
          });
        }
        const store = await assistedStore();
        await Promise.all(Object.values(store.active).map((a) => {
          cancelDebugger(a.tabId);
          return chrome.tabs.sendMessage(a.tabId, { type: "cancel-assisted" }, { documentId: a.documentId }).catch(() => {
          });
        }));
      } else if (message.type === "resume") {
        if (!cp.execution) throw Error("N\xE3o h\xE1 execu\xE7\xE3o pausada. Configure a quantidade e clique em Iniciar.");
        for (const p of [cp.execution.calibration.azul, cp.execution.calibration.cinza]) if (p) requireVariation(p);
        if (!cp.execution.calibration.observedOnly && !cp.execution.calibration.measuring) throw Error("Execu\xE7\xE3o antiga sem calibra\xE7\xE3o observada. Confira o jogo e configure uma nova execu\xE7\xE3o pelo Iniciar.");
        cp.execution.calibration.pauseOnMiss = true;
        cp = transition(cp, "resume");
        if (cp.execution?.status === "PAUSED") {
          cp.execution.status = "RUNNING";
          wakeTab = cp.execution.tabId;
        }
      } else if (message.type === "inspect" || message.type === "prepare-assisted") {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id || !tab.url || !allowed(tab.url)) throw Error("Abra a aba do jogo no dom\xEDnio e caminho corretos");
        const result = await chrome.tabs.sendMessage(tab.id, { type: message.type }).catch(() => {
          throw Error("A extens\xE3o n\xE3o est\xE1 conectada \xE0 aba. Recarregue o jogo depois de recarregar o EcoBot na p\xE1gina de extens\xF5es.");
        });
        assertBuild(result);
        if (result?.ok === false) throw Error(result.error);
        if (message.type === "inspect") {
          const previous = (await chrome.storage.local.get("catalogReview")).catalogReview;
          const same = previous?.reviewedAt && previous.items.length === result.catalog.items.length && previous.items.every((item, index) => {
            const actual = result.catalog.items[index];
            return actual.id === item.id && actual.nome === item.nome && actual.lixeira === item.lixeira;
          });
          const catalogReview = { version: 1, items: result.catalog.items, warning: result.catalog.warning, inspectedAt: Date.now(), ...same ? { reviewedAt: previous.reviewedAt } : {} };
          await chrome.storage.local.set({ catalogReview });
        }
        reply({ ok: true, cp, ...message.type === "inspect" ? { result } : { notice: "Painel aberto na aba. Nenhum gesto enviado; confirme o teste l\xE1." } });
        return;
      } else if (message.type === "review-catalog") {
        const { catalogReview } = await chrome.storage.local.get("catalogReview");
        const snapshot = reviewCatalog(catalogReview, message.inspectedAt, Date.now());
        await chrome.storage.local.set({ catalogReview: snapshot });
        reply({ ok: true, cp, catalogReview: snapshot });
        return;
      } else if (message.type === "catalog-status") {
        const { catalogReview } = await chrome.storage.local.get("catalogReview");
        reply({ ok: true, cp, catalogReview });
        return;
      } else if (message.type === "export-attempts" || message.type === "export-rounds" || message.type === "metrics" || message.type === "aim-evidence") {
        const store = await assistedStore();
        const { roundHistory } = await chrome.storage.local.get("roundHistory");
        const rounds = roundHistory ?? [];
        if (!Array.isArray(rounds)) throw Error("Hist\xF3rico de partidas incompat\xEDvel");
        const allRounds = cp.execution?.active ? [...rounds, cp.execution.active] : rounds;
        const roundAttempts = allRounds.flatMap((r) => r.attempts);
        const metrics = attemptMetrics(store);
        if (message.type === "aim-evidence") {
          reply({ ok: true, rows: combinedEvidence(allRounds, VERIFIED_PAIRS) });
          return;
        }
        reply({ ok: true, cp, metrics: { ...metrics, attempts: metrics.attempts + roundAttempts.length, success: metrics.success + roundAttempts.filter((a) => a.outcome === "success").length, rounds: rounds.filter((r) => r.phase === "COMPLETED").length }, ...message.type === "export-attempts" ? { csv: attemptsCSV(store, allRounds) } : message.type === "export-rounds" ? { csv: roundsCSV(allRounds) } : {} });
        return;
      } else if (message.type !== "status") throw Error("Comando desconhecido");
      await chrome.storage.local.set({ checkpoint: cp });
      reply({ ok: true, cp, protocol: PROTOCOL });
      if (wakeTab !== void 0) void chrome.tabs.sendMessage(wakeTab, { type: "series-wake" }).catch(() => {
      });
    }).catch((error) => reply({ ok: false, error: error instanceof Error ? error.message : "Opera\xE7\xE3o indispon\xEDvel. Revise a aba, sele\xE7\xE3o e estado do plano." }));
    return true;
  });
  chrome.runtime.onStartup.addListener(() => {
    serial = serial.catch(() => {
    }).then(async () => {
      const cp = await readCheckpoint();
      await chrome.storage.local.set({ checkpoint: recover(cp) });
    });
  });
})();
