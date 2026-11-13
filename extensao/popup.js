"use strict";
(() => {
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
  function selected(c, items2 = catalog) {
    if (!["sequencial", "fixo"].includes(c.mode) || !["group", "rodizio"].includes(c.order) || !["todos", "azul", "cinza"].includes(c.category)) throw Error("Configura\xE7\xE3o inv\xE1lida");
    integer(c.repeats);
    integer(c.speed, 5);
    if (c.mode === "sequencial") integer(c.sequences);
    if (!Array.isArray(c.ids) || new Set(c.ids).size !== c.ids.length || c.ids.some((id) => !items2.some((i) => i.id === id))) throw Error("Sele\xE7\xE3o inv\xE1lida");
    const chosen = items2.filter((i) => c.ids.includes(i.id) && (c.category === "todos" || i.lixeira === c.category));
    if (!chosen.length || c.mode === "fixo" && chosen.length !== 1) throw Error("Selecione res\xEDduos; modo fixo exige exatamente um");
    return chosen;
  }
  function plan(c, items2 = catalog) {
    const chosen = selected(c, items2), sequences = c.mode === "fixo" ? 1 : c.sequences;
    if (chosen.length * c.repeats * sequences > 1e4) throw Error("Limite de 10.000 partidas por plano");
    const tasks = [];
    const add = (s, i, r) => tasks.push({ id: `${s}:${i.id}:${r}`, sequence: s, repeat: r, item: { ...i } });
    for (let s = 1; s <= sequences; s++) {
      if (c.order === "group") for (const i of chosen) for (let r = 1; r <= c.repeats; r++) add(s, i, r);
      else for (let r = 1; r <= c.repeats; r++) for (const i of chosen) add(s, i, r);
    }
    return tasks;
  }

  // src/machine.ts
  var initial = () => ({ version: 1, state: "IDLE", queue: [], cursor: 0, uncertain: false, message: "Diagn\xF3stico \u2014 nenhuma partida executada" });

  // src/storage.ts
  async function readCheckpoint() {
    const data = await chrome.storage.local.get("checkpoint");
    if (data.checkpoint === void 0) return initial();
    const cp = data.checkpoint;
    if (cp?.version !== 1 || !Array.isArray(cp.queue) || !Number.isSafeInteger(cp.cursor) || cp.cursor < 0 || cp.cursor > cp.queue.length || !["IDLE", "HOME", "OPENING", "READY", "AIMING", "FLYING", "FEEDBACK", "RETRY", "RETURNING", "PAUSED", "COMPLETED", "ERROR"].includes(cp.state)) throw Error("Checkpoint incompat\xEDvel; n\xE3o executar");
    return cp;
  }

  // package.json
  var package_default = {
    name: "ecobot",
    version: "0.10.2",
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
  function assertBuild(reply) {
    if (reply?.buildVersion !== BUILD_VERSION) throw Error(`Vers\xF5es desencontradas. Esta tela \xE9 ${BUILD_VERSION}, mas o componente carregado \xE9 ${reply?.buildVersion ?? "antigo"}. Recarregue o EcoBot na p\xE1gina de extens\xF5es e depois recarregue a aba do jogo.`);
  }

  // src/aim.ts
  function validateProfile(p) {
    if (!p || !Number.isFinite(p.force) || p.force < 0.1 || p.force > 1 || !Number.isFinite(p.spin) || Math.abs(p.spin) > Math.PI / 4) throw Error("For\xE7a fixa deve estar entre 10 e 100%; giro entre \u221245\xB0 e 45\xB0");
    if (p.range) {
      const r = p.range;
      if (![r.forceMin, r.forceMax, r.angleMin, r.angleMax].every(Number.isSafeInteger) || r.forceMin < 10 || r.forceMax > 100 || r.forceMin > r.forceMax || r.angleMin < -45 || r.angleMax > 45 || r.angleMin > r.angleMax) throw Error("Faixas devem ter limites inteiros ordenados: for\xE7a 10\u2013100% e \xE2ngulo \u221245\u201345\xB0");
    }
  }

  // src/pacing.ts
  function paceRange(speed) {
    if (!Number.isInteger(speed) || speed < 1 || speed > 5) throw Error("Velocidade deve estar entre 1 e 5");
    return [{ min: 1600, max: 2400 }, { min: 1300, max: 2100 }, { min: 800, max: 1800 }, { min: 500, max: 1200 }, { min: 300, max: 850 }][speed - 1];
  }

  // src/popup.ts
  var el = (id) => document.getElementById(id);
  var input = (id) => el(id);
  var list = el("ids");
  var items = catalog;
  var snapshot;
  var compatible = false;
  var busy = false;
  var running = false;
  var menuReady = false;
  var loading = true;
  var latest;
  var previewTimer;
  var revision = 0;
  var readiness;
  function error(value) {
    const text = value instanceof Error ? value.message : String(value);
    el("log").textContent = text;
    el("action-feedback").textContent = text;
    if (!running && !latest?.uncertain) el("status").textContent = "A\xE7\xE3o pendente \xB7 confira o aviso";
    el("status").scrollIntoView({ block: "nearest" });
  }
  function controls() {
    const disabled = !compatible || busy || running || !menuReady || !!latest?.uncertain || !!latest?.execution?.active;
    el("measure-aim").disabled = disabled;
    el("start-series").disabled = disabled || !input("auto-calibrate").checked && (!readiness || readiness.pendingThisRun > 0);
    for (const id of ["background-enabled", "auto-calibrate"]) input(id).disabled = !compatible || busy || running;
  }
  function schedulePreview() {
    if (loading || !compatible || running) return;
    clearTimeout(previewTimer);
    const request = ++revision;
    previewTimer = setTimeout(() => void (async () => {
      try {
        const limit = input("series-limit").value;
        const r = await rpc("series-preview", { config: config(), calibration: calibration(), ...limit ? { limit: Number(limit) } : {} });
        if (request !== revision) return;
        readiness = r;
        el("readiness").textContent = `${r.readyItems}/${r.totalItems} res\xEDduos com pares observados. ` + (r.pendingThisRun ? input("auto-calibrate").checked ? `${r.pendingThisRun} pendentes ser\xE3o medidos durante as ${r.runTotal} partidas desta execu\xE7\xE3o. Pode haver erro; pausa no primeiro resultado sem acerto.` : "Ative a medi\xE7\xE3o autom\xE1tica ou selecione apenas res\xEDduos j\xE1 calibrados." : "Esta execu\xE7\xE3o usa pares j\xE1 observados.");
        controls();
      } catch (e) {
        if (request === revision) {
          readiness = void 0;
          el("readiness").textContent = e.message;
          controls();
        }
      }
    })(), 180);
  }
  async function persistDraft() {
    if (loading) return;
    const cfg = config();
    plan(cfg, items);
    const c = calibration();
    await chrome.storage.local.set({ draftConfig: cfg, aimSettings: { calibration: c, vary: true, limit: input("series-limit").value } });
  }
  function changed() {
    preview();
    void persistDraft().catch(() => {
    });
  }
  function options(next, ids = Array.from(list.selectedOptions, (o) => o.value)) {
    items = next;
    list.replaceChildren();
    for (const i of items) list.add(new Option(i.nome + " \xB7 " + i.lixeira, i.id, false, ids.includes(i.id)));
  }
  options(catalog, defaults.ids);
  function config() {
    const fixed = input("mode").value === "fixo";
    return { mode: fixed ? "fixo" : "sequencial", category: input("category").value, ids: Array.from(list.selectedOptions, (o) => o.value), repeats: Number(input("repeats").value), sequences: fixed ? 1 : Number(input("sequences").value), order: fixed ? "group" : input("order").value, speed: Number(input("speed").value) };
  }
  function preview() {
    const fixed = input("mode").value === "fixo";
    el("sequence-label").hidden = fixed;
    el("order-label").hidden = fixed;
    el("selection-help").hidden = fixed;
    list.multiple = !fixed;
    list.size = fixed ? 1 : 4;
    try {
      el("total").textContent = plan(config(), items).length + " partidas selecionadas";
    } catch (e) {
      el("total").textContent = e.message;
    }
    el("aim-preview").textContent = input("auto-calibrate").checked ? "Iniciar mede os itens pendentes nas pr\xF3prias partidas selecionadas. Com dois pares aprovados, passa a sortear entre eles. Pausa no primeiro resultado sem acerto." : "Iniciar usa somente pares j\xE1 observados. Os itens pendentes precisam de medi\xE7\xE3o antes de iniciar.";
    for (const bin of ["azul", "cinza"]) {
      input("force-max-" + bin).disabled = !input("vary-aim").checked;
      input("spin-max-" + bin).disabled = !input("vary-aim").checked;
    }
    try {
      const r = paceRange(Number(input("speed").value));
      el("timing-preview").textContent = `Ritmo sorteado por lance: espera ${r.min}\u2013${r.max} ms; arraste alvo 220\u2013420 ms.`;
    } catch {
      el("timing-preview").textContent = "Velocidade deve estar entre 1 e 5";
    }
    controls();
    schedulePreview();
  }
  function render(cp) {
    latest = cp;
    running = cp.execution?.status === "RUNNING";
    el("config-fields").disabled = running;
    el("machine-state").textContent = cp.state + " \xB7 " + cp.cursor + "/" + cp.queue.length + " \xB7 " + cp.message;
    el("status").textContent = running ? "Jogando" + (cp.execution?.calibration.background ? " em segundo plano" : "") + " \xB7 " + cp.cursor + "/" + cp.queue.length + " partidas conclu\xEDdas" : cp.uncertain ? "Pausado: confira o jogo e a pend\xEAncia" : cp.execution?.status === "PAUSED" ? "Pausado \xB7 " + cp.cursor + "/" + cp.queue.length + " partidas conclu\xEDdas" : cp.execution?.status === "COMPLETED" ? "Execu\xE7\xE3o conclu\xEDda \xB7 " + cp.cursor + "/" + cp.queue.length : menuReady ? "Menu conectado \xB7 configure e inicie" : "Abra o menu dos res\xEDduos para iniciar";
    if (cp.execution || cp.uncertain) el("log").textContent = cp.message;
    el("pause").disabled = !running;
    el("resume").disabled = cp.execution?.status !== "PAUSED" || cp.uncertain;
    const pending = !!cp.uncertain || !!cp.execution?.active && !running;
    el("recovery").hidden = !pending;
    el("recovery-reason").textContent = cp.message;
    el("review-round").disabled = running;
    if (!pending) input("round-reviewed").checked = false;
    controls();
  }
  async function rpc(type, data = {}) {
    const r = await chrome.runtime.sendMessage({ type, ...data, buildVersion: BUILD_VERSION });
    if (r?.buildVersion !== BUILD_VERSION) {
      compatible = false;
      controls();
      el("open-extensions").hidden = false;
      assertBuild(r);
    }
    if (!r?.ok) {
      if (r?.error?.includes("Vers\xF5es desencontradas")) {
        compatible = false;
        controls();
        el("open-extensions").hidden = false;
      }
      throw Error(r?.error ?? "A extens\xE3o n\xE3o respondeu. Recarregue o EcoBot e a aba do jogo.");
    }
    return r;
  }
  function renderCatalog() {
    el("catalog-warning").textContent = snapshot ? snapshot.items.length + " res\xEDduos \xB7 " + (!menuReady ? "\xFAltimo cat\xE1logo salvo; abra o menu para atualizar" : (snapshot.warning || "cat\xE1logo confere") + (snapshot.reviewedAt ? " \xB7 revisado" : "")) : "Abra o menu do jogo para ler o cat\xE1logo.";
    el("catalog-items").textContent = snapshot?.items.map((i) => i.nome + " \xB7 " + i.lixeira + " (" + i.id + ")").join("\n") ?? "";
    el("review-catalog").disabled = !snapshot || snapshot.warning.includes("N\xE3o executar");
    if (snapshot?.reviewedAt) {
      options(snapshot.items);
      preview();
    }
  }
  async function inspect() {
    menuReady = false;
    controls();
    const r = await rpc("inspect");
    menuReady = r.result.screen === "HOME" && !r.result.catalog?.warning?.includes("N\xE3o executar");
    snapshot = (await rpc("catalog-status")).catalogReview;
    renderCatalog();
    if (latest) render(latest);
    if (r.result.screen !== "HOME" || snapshot?.warning.includes("N\xE3o executar")) throw Error("Volte ao menu dos res\xEDduos na aba do jogo antes de iniciar.");
    return snapshot;
  }
  async function review() {
    if (!snapshot) throw Error("Atualize o cat\xE1logo primeiro.");
    snapshot = (await rpc("review-catalog", { inspectedAt: snapshot.inspectedAt })).catalogReview;
    renderCatalog();
  }
  function calibration() {
    const c = { level: input("calibration-level").value.trim(), background: input("background-enabled").checked, observedOnly: true, pauseOnMiss: true, learnMissing: input("auto-calibrate").checked };
    for (const bin of ["azul", "cinza"]) if (input("force-" + bin).value) {
      c[bin] = { force: input("force-" + bin).valueAsNumber / 100, spin: input("spin-" + bin).valueAsNumber * Math.PI / 180, ...input("vary-aim").checked ? { range: { forceMin: input("force-" + bin).valueAsNumber, forceMax: input("force-max-" + bin).valueAsNumber, angleMin: input("spin-" + bin).valueAsNumber, angleMax: input("spin-max-" + bin).valueAsNumber } } : {} };
      validateProfile(c[bin]);
    }
    return c;
  }
  async function evidence() {
    const { rows } = await rpc("aim-evidence");
    const host = el("aim-evidence");
    host.replaceChildren();
    if (!rows?.length) {
      host.textContent = "Sem pares registrados por este hist\xF3rico. N\xE3o h\xE1 faixa de acerto comprovada.";
      return;
    }
    const table = document.createElement("table");
    const header = table.insertRow();
    for (const text of ["Res\xEDduo / n\xEDvel", "For\xE7a", "\xC2ngulo", "Acertos locais / pr\xE9vios", "Erros", "\u0394 HUD", "Feedback"]) {
      const th = document.createElement("th");
      th.textContent = text;
      header.append(th);
    }
    const extent = (values) => !values?.length ? "\u2014" : Math.min(...values) === Math.max(...values) ? String(values[0]) : Math.min(...values) + " a " + Math.max(...values);
    for (const row of rows) {
      const tr = table.insertRow();
      for (const text of [row.itemId + " / " + row.level, row.force + "%", row.angle + "\xB0", row.successes + " / " + (row.priorSuccesses ?? 0), String(row.misses), extent(row.hudDeltas), extent(row.feedbackScores)]) tr.insertCell().textContent = text;
    }
    host.append(table);
  }
  async function metrics() {
    const r = await rpc("metrics");
    const m = r.metrics;
    if (m) el("metrics").textContent = (m.rounds ?? 0) + " partidas \xB7 " + m.attempts + " registros de tentativa \xB7 " + m.success + " acertos na UI";
  }
  async function act(action) {
    if (busy) return;
    busy = true;
    controls();
    el("log").textContent = "";
    el("action-feedback").textContent = "";
    try {
      await action();
    } catch (e) {
      error(e);
    } finally {
      busy = false;
      controls();
    }
  }
  el("config").addEventListener("input", changed);
  el("config").addEventListener("submit", (e) => {
    e.preventDefault();
    void start(e.isTrusted);
  });
  el("aim-details").addEventListener("input", changed);
  el("auto-calibrate").addEventListener("input", changed);
  el("background-enabled").addEventListener("input", changed);
  input("series-limit").addEventListener("input", changed);
  el("review-catalog").addEventListener("click", () => void act(review));
  el("inspect").addEventListener("click", () => void act(async () => {
    await inspect();
  }));
  el("open-extensions").addEventListener("click", () => {
    void chrome.tabs.create({ url: "chrome://extensions/?id=" + chrome.runtime.id });
  });
  function start(trusted, measure = false) {
    return act(async () => {
      if (!trusted || !input("series-permission").checked) throw Error("Marque a autoriza\xE7\xE3o das partidas selecionadas para iniciar.");
      await persistDraft();
      const c = calibration();
      let cfg = config();
      if (measure) {
        if (cfg.mode !== "fixo") throw Error("Para medir, selecione Fixo e um res\xEDduo.");
        cfg = { ...cfg, repeats: 2, sequences: 1 };
        c.observedOnly = false;
        c.measuring = true;
      }
      for (const task of plan(cfg, items)) {
        const p = c[task.item.lixeira];
        if (!p?.range || p.range.forceMin === p.range.forceMax && p.range.angleMin === p.range.angleMax) throw Error("Configure uma faixa com pelo menos duas combina\xE7\xF5es. O modo fixo de for\xE7a/\xE2ngulo foi removido.");
      }
      const s = await inspect();
      if (!s.reviewedAt) {
        if (s.warning) {
          el("catalog-details").open = true;
          throw Error("O cat\xE1logo mudou. Confira os itens e clique em Revisei: aplicar cat\xE1logo atual.");
        }
        await review();
      }
      const settings = { calibration: c, vary: input("vary-aim").checked, limit: input("series-limit").value };
      await chrome.storage.local.set({ aimSettings: settings });
      const r = await rpc("series-start", { config: cfg, calibration: c, ...measure ? { limit: 2 } : settings.limit ? { limit: Number(settings.limit) } : {} });
      render(r.cp);
    });
  }
  el("start-series").addEventListener("click", (event) => {
    void start(event.isTrusted);
  });
  el("measure-aim").addEventListener("click", (event) => {
    void start(event.isTrusted, true);
  });
  for (const id of ["pause", "resume", "stop"]) el(id).addEventListener("click", () => void act(async () => {
    const r = await rpc(id);
    render(r.cp);
    el("log").textContent = r.cp.message;
  }));
  el("prepare-assisted").addEventListener("click", () => void act(async () => {
    const r = await rpc("prepare-assisted");
    el("log").textContent = r.notice;
  }));
  el("review-round").addEventListener("click", () => void act(async () => {
    if (!input("round-reviewed").checked) throw Error("Confira o jogo e marque a confirma\xE7\xE3o antes de arquivar.");
    await inspect();
    const cp = await readCheckpoint();
    const r = await rpc("series-review", { id: cp.execution?.active?.id, reviewed: true });
    render(r.cp);
    el("log").textContent = r.cp.message;
    await metrics();
  }));
  for (const [id, type, name] of [["export-attempts", "export-attempts", "tentativas"], ["export-rounds", "export-rounds", "partidas"]]) el(id).addEventListener("click", () => void act(async () => {
    const r = await rpc(type);
    const url = URL.createObjectURL(new Blob([r.csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "ecobot-" + name + ".csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
  }));
  chrome.storage.onChanged?.addListener((changes, area) => {
    if (area === "local" && changes.checkpoint?.newValue) {
      render(changes.checkpoint.newValue);
      void metrics().then(evidence).catch(error);
    }
  });
  async function load() {
    const status = await rpc("status");
    compatible = true;
    render(status.cp);
    snapshot = (await rpc("catalog-status")).catalogReview;
    if (snapshot?.reviewedAt) options(snapshot.items, defaults.ids);
    const saved = await readCheckpoint();
    const { aimSettings, draftConfig } = await chrome.storage.local.get(["aimSettings", "draftConfig"]);
    const c = (running ? saved.config : draftConfig) ?? saved.config ?? defaults;
    for (const key of ["mode", "category", "repeats", "sequences", "order", "speed"]) input(key).value = String(c[key]);
    for (const o of list.options) o.selected = c.ids.includes(o.value);
    const s = aimSettings;
    if (s?.calibration) {
      input("calibration-level").value = s.calibration.level;
      input("series-limit").value = s.limit;
      input("auto-calibrate").checked = s.calibration.learnMissing !== false;
      input("background-enabled").checked = s.calibration.background !== false;
      for (const bin of ["azul", "cinza"]) {
        const p = s.calibration[bin];
        if (p?.range && (p.range.forceMin !== p.range.forceMax || p.range.angleMin !== p.range.angleMax)) {
          input("force-" + bin).value = String(p.range.forceMin);
          input("force-max-" + bin).value = String(p.range.forceMax);
          input("spin-" + bin).value = String(p.range.angleMin);
          input("spin-max-" + bin).value = String(p.range.angleMax);
        }
      }
    }
    preview();
    renderCatalog();
    await metrics();
    await evidence();
    try {
      await inspect();
    } catch (e) {
      menuReady = false;
      error(e);
    }
    loading = false;
    preview();
    controls();
  }
  preview();
  void load().catch(error);
})();
