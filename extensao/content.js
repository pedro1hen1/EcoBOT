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
  function inspectCatalog(doc, base) {
    const items = [];
    for (const a of doc.querySelectorAll(".categoria[data-lixeira] a.cartao[href]")) {
      let u;
      try {
        u = new URL(a.getAttribute("href"), base);
      } catch {
        continue;
      }
      const id = u.searchParams.get("residuo");
      const lixeira = a.closest(".categoria")?.dataset.lixeira;
      const name = a.querySelector(".cartao__nome,h2,h3,strong")?.textContent ?? a.textContent?.trim().split("\n")[0];
      if (allowed(u.href) && u.pathname === "/ResiduoGo/public/index.php/ar" && id && id.length <= 150 && ["azul", "cinza"].includes(lixeira ?? "") && !items.some((i) => i.id === id)) items.push({ id, nome: name?.trim().slice(0, 150) || id, lixeira });
    }
    if (!items.length) return { items: catalog, warning: "Cat\xE1logo local de refer\xEAncia; DOM do menu n\xE3o dispon\xEDvel. N\xE3o executar." };
    const diverges = items.length !== catalog.length || items.some((i) => !catalog.some((c) => c.id === i.id && c.lixeira === i.lixeira && c.nome === i.nome));
    return { items, warning: diverges ? "Diverg\xEAncia no cat\xE1logo atual. Revise a sele\xE7\xE3o." : "" };
  }
  var visible = (doc, s) => {
    const e = doc.querySelector(s);
    return !!e && !e.hidden && e.getClientRects().length > 0;
  };
  function observe(doc) {
    if (doc.querySelector("input[type=password]")) return "session";
    if (visible(doc, "#feedback") && doc.querySelector("#feedback-titulo")?.textContent?.includes("N\xE3o foi poss\xEDvel confirmar")) return "network";
    if (visible(doc, "#feedback")) return "FEEDBACK";
    if (visible(doc, "#abertura")) return "OPENING";
    if (visible(doc, "#cena")) return "READY";
    if (doc.querySelector(".categoria[data-lixeira] a.cartao[href]")) return "HOME";
    return "UNKNOWN";
  }

  // src/feedback.ts
  function visible2(doc, selector) {
    const node = doc.querySelector(selector);
    return !!node && !node.hidden && node.getClientRects().length > 0 && doc.defaultView?.getComputedStyle(node).visibility !== "hidden";
  }
  function feedback(doc) {
    if (doc.querySelector("input[type=password]")) return "session";
    if (!visible2(doc, "#feedback")) return;
    const title = doc.querySelector("#feedback-titulo")?.textContent?.trim();
    if (title === "N\xE3o foi poss\xEDvel confirmar o resultado") return "network";
    const panel = doc.querySelector("#feedback");
    if (title === "Voc\xEA acertou!" && panel.classList.contains("painel--sucesso")) return "success";
    if (panel.classList.contains("painel--erro") && ["Caiu fora da lixeira!", "Lixeira errada!"].includes(title ?? "")) {
      const retry = doc.querySelector("#btn-proximo");
      if (retry && visible2(doc, "#btn-proximo") && !retry.disabled) return "retry";
      if (doc.querySelector("#hud-tentativas")?.textContent?.trim() === "Rodada encerrada") return "ended-failure";
    }
  }
  function waitFeedback(doc, signal, timeoutMs = 15e3) {
    return new Promise((resolve) => {
      let timer;
      let done = false;
      const observer = new MutationObserver(check);
      function settle(result) {
        if (done) return;
        done = true;
        observer.disconnect();
        clearTimeout(timer);
        signal.removeEventListener("abort", cancel);
        doc.defaultView?.removeEventListener("offline", offline);
        resolve(result);
      }
      function cancel() {
        settle("cancelled");
      }
      function offline() {
        settle("network");
      }
      function check() {
        const result = feedback(doc);
        if (result) settle(result);
      }
      if (signal.aborted) {
        resolve("cancelled");
        return;
      }
      observer.observe(doc.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
      signal.addEventListener("abort", cancel, { once: true });
      doc.defaultView?.addEventListener("offline", offline, { once: true });
      timer = setTimeout(() => settle("timeout"), timeoutMs);
      check();
    });
  }

  // src/assisted.ts
  function requireReady(doc) {
    if (doc.defaultView?.navigator.onLine === false) throw Error("Sem conex\xE3o: n\xE3o iniciar lan\xE7amento");
    const hint = doc.querySelector("#hud-dica")?.textContent?.trim();
    if (!visible2(doc, "#hud-dica") || !["Clique, puxe para baixo como um estilingue e solte", "Toque, puxe para baixo como um estilingue e solte"].includes(hint ?? "")) throw Error("O jogo ainda n\xE3o confirma que est\xE1 pronto para arremessar");
    if (doc.querySelector("input[type=password]") || visible2(doc, "#feedback") || visible2(doc, "#abertura") || !visible2(doc, "#cena")) throw Error("Abra a partida e clique em Jogar sem c\xE2mera antes de preparar o teste");
  }
  async function runAssisted(doc, candidate, deps, signal, timeoutMs = 15e3) {
    requireReady(doc);
    signal.throwIfAborted();
    const id = await deps.reserve();
    const local = new AbortController();
    const combined = AbortSignal.any([signal, local.signal]);
    let result = "gesture-error";
    let timer;
    try {
      requireReady(doc);
      combined.throwIfAborted();
      let watchdog = false;
      timer = setTimeout(() => {
        watchdog = true;
        local.abort();
      }, timeoutMs);
      const pending = waitFeedback(doc, combined, timeoutMs).then((outcome) => {
        if (["network", "session"].includes(outcome)) local.abort();
        return outcome;
      });
      try {
        await deps.adapter.throwOnce(candidate, combined);
        result = await pending;
      } catch {
        local.abort();
        const observed = await pending;
        result = observed === "network" || observed === "session" ? observed : watchdog ? "timeout" : signal.aborted ? "cancelled" : "gesture-error";
      }
      if (watchdog && result === "cancelled") result = "timeout";
    } catch {
      result = signal.aborted ? "cancelled" : "gesture-error";
    } finally {
      clearTimeout(timer);
      local.abort();
    }
    if (deps.adapter.measurement) await deps.finish(id, result, deps.adapter.measurement);
    else await deps.finish(id, result);
    return result;
  }

  // src/solver.ts
  function gesture(c, height) {
    if (!Number.isFinite(height) || height <= 0 || !Number.isFinite(c.force) || c.force < 0 || c.force > 1 || !Number.isFinite(c.spin) || Math.abs(c.spin) > Math.PI / 4) throw Error("Gesto inv\xE1lido");
    const length = c.force * 0.3 * height;
    if (length < 18) throw Error("Gesto abaixo do m\xEDnimo");
    return { dx: Math.sin(c.spin) * length, dy: Math.cos(c.spin) * length };
  }

  // src/pointer.ts
  function endpoints(canvas, candidate) {
    const rect = canvas.getBoundingClientRect();
    const { dx, dy } = gesture(candidate, rect.height);
    const start = { x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.4 };
    const end = { x: start.x + dx, y: start.y + dy };
    if (rect.width <= 0 || end.x < rect.left || end.x >= rect.right || end.y >= rect.bottom) throw Error("Gesto fora do canvas");
    return { start, end };
  }
  var PointerThrowAdapter = class {
    constructor(canvas) {
      this.canvas = canvas;
    }
    async throwOnce(candidate, signal) {
      const { start, end } = endpoints(this.canvas, candidate);
      const win = this.canvas.ownerDocument.defaultView;
      let capturedError = false, down = false, released = false;
      const onError = () => {
        capturedError = true;
      };
      const emit = (type, x, y, buttons) => {
        signal.throwIfAborted();
        this.canvas.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, composed: true, pointerId: 987, pointerType: "mouse", isPrimary: true, button: 0, buttons, clientX: x, clientY: y }));
        if (capturedError) throw Error("O navegador/jogo rejeitou o gesto sint\xE9tico. N\xE3o repetir.");
      };
      win.addEventListener("error", onError);
      try {
        down = true;
        emit("pointerdown", start.x, start.y, 1);
        for (let step = 1; step <= 8; step++) {
          await new Promise((resolve, reject) => {
            let frame = 0;
            const abort2 = () => {
              win.cancelAnimationFrame(frame);
              signal.removeEventListener("abort", abort2);
              reject(signal.reason);
            };
            signal.addEventListener("abort", abort2, { once: true });
            if (signal.aborted) {
              abort2();
              return;
            }
            frame = win.requestAnimationFrame(() => {
              signal.removeEventListener("abort", abort2);
              resolve();
            });
          });
          emit("pointermove", start.x + (end.x - start.x) * step / 8, start.y + (end.y - start.y) * step / 8, 1);
        }
        emit("pointerup", end.x, end.y, 0);
        released = true;
      } finally {
        win.removeEventListener("error", onError);
        if (down && !released) this.canvas.dispatchEvent(new PointerEvent("pointercancel", { bubbles: true, pointerId: 987, pointerType: "mouse", isPrimary: true, buttons: 0 }));
      }
    }
  };
  var ManualThrowAdapter = class {
    constructor(canvas) {
      this.canvas = canvas;
    }
    measurement;
    async throwOnce(candidate, signal) {
      const { start, end } = endpoints(this.canvas, candidate), doc = this.canvas.ownerDocument;
      const markers = [{ ...start, label: "1 \xB7 Segure aqui" }, { ...end, label: "2 \xB7 Puxe e solte aqui" }].map((point) => {
        const marker = doc.createElement("div");
        marker.textContent = point.label;
        Object.assign(marker.style, { position: "fixed", left: point.x + "px", top: point.y + "px", transform: "translate(-50%, -50%)", padding: "10px", border: "3px solid #e39d00", borderRadius: "20px", background: "#fff6ce", color: "#173d32", font: "bold 12px system-ui", zIndex: "2147483646", pointerEvents: "none" });
        doc.documentElement.append(marker);
        return marker;
      });
      return new Promise((resolve, reject) => {
        let origin;
        const cleanup = () => {
          for (const marker of markers) marker.remove();
          this.canvas.removeEventListener("pointerdown", down, true);
          this.canvas.removeEventListener("pointerup", up, true);
          this.canvas.removeEventListener("pointercancel", cancel, true);
          signal.removeEventListener("abort", abort2);
        };
        const abort2 = () => {
          cleanup();
          reject(signal.reason ?? Error("Captura cancelada"));
        };
        const cancel = (event) => {
          if (origin && event.pointerId === origin.id) {
            cleanup();
            reject(Error("Arraste cancelado"));
          }
        };
        const down = (event) => {
          if (!event.isTrusted || event.button !== 0 || origin) return;
          origin = { x: event.clientX, y: event.clientY, id: event.pointerId };
        };
        const up = (event) => {
          if (!event.isTrusted || !origin || event.pointerId !== origin.id) return;
          const dx = event.clientX - origin.x, dy = event.clientY - origin.y, length = Math.hypot(dx, dy), height = this.canvas.getBoundingClientRect().height;
          cleanup();
          if (dy <= 0 || length < 18 || height <= 0) {
            reject(Error("Arraste inv\xE1lido"));
            return;
          }
          this.measurement = { force: Math.min(1, length / (0.3 * height)), spin: Math.max(-Math.PI / 4, Math.min(Math.PI / 4, Math.atan2(dx, Math.max(dy, 1)))), trusted: true };
          resolve();
        };
        this.canvas.addEventListener("pointerdown", down, true);
        this.canvas.addEventListener("pointerup", up, true);
        this.canvas.addEventListener("pointercancel", cancel, true);
        signal.addEventListener("abort", abort2, { once: true });
        if (signal.aborted) abort2();
      });
    }
  };

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
  function assertBuild(reply) {
    if (reply?.buildVersion !== BUILD_VERSION) throw Error(`Vers\xF5es desencontradas. Esta tela \xE9 ${BUILD_VERSION}, mas o componente carregado \xE9 ${reply?.buildVersion ?? "antigo"}. Recarregue o EcoBot na p\xE1gina de extens\xF5es e depois recarregue a aba do jogo.`);
  }

  // src/debugger-adapter.ts
  var DebuggerThrowAdapter = class {
    constructor(id, command = "assisted-input") {
      this.id = id;
      this.command = command;
    }
    failure;
    async throwOnce(_candidate, signal) {
      signal.throwIfAborted();
      const cancel = () => {
        void chrome.runtime.sendMessage({ type: "assisted-input-cancel", id: this.id(), buildVersion: BUILD_VERSION }).catch(() => {
        });
      };
      signal.addEventListener("abort", cancel, { once: true });
      try {
        const reply = await chrome.runtime.sendMessage({ type: this.command, id: this.id(), buildVersion: BUILD_VERSION });
        if (!reply?.ok) throw Error(reply?.error ?? "Entrada indispon\xEDvel");
        signal.throwIfAborted();
      } catch (error) {
        this.failure = error instanceof Error ? error.message : "Entrada indispon\xEDvel";
        throw error;
      } finally {
        signal.removeEventListener("abort", cancel);
      }
    }
  };

  // src/assisted-panel.ts
  var labels = { success: "Acerto confirmado na UI.", retry: "Erro confirmado; h\xE1 nova tentativa. Nenhuma nova tentativa autom\xE1tica.", "ended-failure": "Rodada encerrada sem acerto.", network: "Resultado n\xE3o confirmado pelo jogo. Confira a p\xE1gina.", session: "Sess\xE3o expirada. Confira a p\xE1gina.", timeout: "Tempo esgotado: resultado incerto. N\xE3o repetir automaticamente.", cancelled: "Teste interrompido: confira o jogo.", "gesture-error": "Gesto rejeitado ou n\xE3o conclu\xEDdo. Confira o jogo; n\xE3o repetir automaticamente." };
  var activePanel;
  async function send(type, data = {}) {
    const reply = await chrome.runtime.sendMessage({ type, ...data, buildVersion: BUILD_VERSION });
    if (!reply?.ok) throw Error(reply?.error ?? "Falha ao salvar o teste; n\xE3o repetir");
    return reply;
  }
  function cancelAssisted() {
    activePanel?.cancel.abort();
  }
  async function showAssistedPanel() {
    if (activePanel?.host.isConnected) return;
    const host = document.createElement("div");
    host.id = "ecobot-assisted";
    const root = host.attachShadow({ mode: "closed" });
    const cancel = new AbortController();
    activePanel = { host, cancel };
    root.innerHTML = `<style>:host{all:initial;position:fixed;top:12px;right:12px;z-index:2147483647;width:310px;font:14px system-ui;color:#173d32}section{background:#f3f7f4;border:2px solid #176b50;border-radius:10px;padding:16px;box-shadow:0 3px 20px #0005}h2{margin:0;font-size:18px}label{display:block;margin:10px 0}input[type=number]{width:75px;padding:6px}button{padding:8px;margin:4px;background:#176b50;color:white;border:0;border-radius:5px}button:disabled{opacity:.5}p{line-height:1.4}output{display:block;font-weight:bold}small{display:block}input:focus-visible,button:focus-visible{outline:3px solid #c29816}</style>
 <section aria-label="EcoBot teste assistido"><h2>EcoBot \xB7 1 lan\xE7amento</h2><p>PROT\xD3TIPO. Abra o res\xEDduo e clique em Jogar sem c\xE2mera. Sem nova tentativa autom\xE1tica.</p><label>Entrada <select id="method"><option value="debugger">Mouse real pela extens\xE3o (debugger)</option><option value="manual" selected>Arraste manual guiado</option><option value="synthetic">Sint\xE9tico (diagn\xF3stico)</option></select></label>
 <label>For\xE7a (1\u2013100%) <input id="force" type="number" min="1" max="100" step="1" placeholder="%"></label>
 <label>Giro (\u221245 a 45\xB0) <input id="spin" type="number" min="-45" max="45" value="0" step="1"></label>
 <small>Use valores de calibra\xE7\xE3o manual. A precis\xE3o ainda n\xE3o foi medida no jogo.</small>
 <label><input id="permission" type="checkbox"> Confirmei que o jogo permite automa\xE7\xE3o e autorizo apenas este lan\xE7amento.</label>
 <button id="launch">Armar 1 teste</button><button id="cancel">Cancelar / fechar</button>
 <output id="status" role="status" aria-live="polite">Carregando checkpoint\u2026</output>
 <label><input id="reviewed" type="checkbox"> Conferi o jogo e quero encerrar este teste, inclusive se o resultado ficou incerto.</label>
 <button id="review" disabled>Encerrar ap\xF3s confer\xEAncia</button><small>Este teste n\xE3o avan\xE7a a fila de partidas.</small></section>`;
    document.documentElement.append(host);
    const get = (id) => root.getElementById(id);
    const status = get("status"), launch = get("launch"), review = get("review");
    launch.disabled = true;
    let attempt, busy = false;
    const pagehide = () => cancel.abort();
    window.addEventListener("pagehide", pagehide, { once: true });
    function render() {
      launch.disabled = busy || !!attempt || cancel.signal.aborted;
      review.disabled = busy || !attempt;
    }
    try {
      attempt = (await send("assisted-status")).attempt;
      status.textContent = attempt ? "Teste anterior bloqueia novo lan\xE7amento. Confira o jogo e encerre abaixo." : "Pronto para configurar um \xFAnico teste.";
    } catch (e) {
      status.textContent = e.message;
      cancel.abort();
    }
    render();
    launch.addEventListener("click", async (event) => {
      if (!event.isTrusted || busy || attempt || cancel.signal.aborted) return;
      try {
        if (!get("permission").checked) throw Error("Confirme a permiss\xE3o de um \xFAnico lan\xE7amento.");
        const forceInput = get("force"), spinInput = get("spin");
        if (!forceInput.value || !spinInput.value || !forceInput.checkValidity() || !spinInput.checkValidity()) throw Error("Informe for\xE7a e giro v\xE1lidos.");
        const candidate = { force: forceInput.valueAsNumber / 100, spin: spinInput.valueAsNumber * Math.PI / 180, margin: 0 };
        requireReady(document);
        const canvas = document.querySelector("canvas#cena");
        if (!canvas) throw Error("Canvas do jogo n\xE3o encontrado.");
        const itemId = new URL(location.href).searchParams.get("residuo");
        if (!itemId) throw Error("Res\xEDduo atual n\xE3o reconhecido.");
        const manual = get("method").value === "manual";
        endpoints(canvas, candidate);
        busy = true;
        render();
        status.textContent = "Salvando bloqueio antes do gesto\u2026";
        const adapter = manual ? new ManualThrowAdapter(canvas) : get("method").value === "debugger" ? new DebuggerThrowAdapter(() => attempt.id) : new PointerThrowAdapter(canvas);
        const result = await runAssisted(document, candidate, {
          reserve: async () => {
            const reply = await send("assisted-reserve", { itemId, candidate });
            attempt = reply.attempt;
            status.textContent = manual ? "Fa\xE7a um \xFAnico arraste seguindo os marcadores no canvas (30 segundos)." : "Teste em andamento. Aguardando feedback do jogo\u2026";
            return attempt.id;
          },
          finish: async (id, outcome, measurement) => {
            const reply = await send("assisted-finish", { id, outcome, ...measurement ? { measurement } : {} });
            attempt = reply.attempt;
          },
          adapter
        }, cancel.signal, manual ? 3e4 : 15e3);
        status.textContent = labels[result] + ("failure" in adapter && adapter.failure ? " " + adapter.failure : "");
      } catch (e) {
        status.textContent = e.message;
      } finally {
        busy = false;
        render();
      }
    });
    review.addEventListener("click", async (event) => {
      if (!event.isTrusted || busy || !attempt) return;
      if (!get("reviewed").checked) {
        status.textContent = "Confira o jogo e marque a confirma\xE7\xE3o de encerramento.";
        return;
      }
      busy = true;
      render();
      try {
        await send("assisted-review", { id: attempt.id });
        attempt = void 0;
        cancel.abort();
        status.textContent = "Teste encerrado manualmente. Para outro teste, prepare novamente pelo popup.";
      } catch (e) {
        status.textContent = e.message;
      } finally {
        busy = false;
        render();
      }
    });
    get("cancel").addEventListener("click", (event) => {
      if (!event.isTrusted) return;
      cancel.abort();
      if (busy) {
        status.textContent = "Interrompendo; confira o jogo antes de encerrar o teste.";
        return;
      }
      window.removeEventListener("pagehide", pagehide);
      host.remove();
      activePanel = void 0;
    });
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
  function visibleText(doc, selector) {
    const e = doc.querySelector(selector);
    if (!e || e.hidden || !e.getClientRects().length) return;
    return e.textContent?.trim().slice(0, 120);
  }
  function hudPoints(doc) {
    const text = visibleText(doc, "#hud-pontos");
    return text === void 0 ? void 0 : parsePoints(text);
  }
  function readScore(doc, hudBefore) {
    const hudAfter = hudPoints(doc), feedbackText = visibleText(doc, "#feedback-pontos");
    const feedbackPoints = feedbackText === void 0 ? void 0 : parsePoints(feedbackText);
    return sanitizeScore({ hudBefore, hudAfter, feedbackPoints, feedbackText });
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

  // src/series-content.ts
  var running = false;
  var abort;
  function cancelSeries() {
    abort?.abort();
  }
  async function send2(type, data = {}) {
    const r = await chrome.runtime.sendMessage({ type, ...data, buildVersion: BUILD_VERSION });
    assertBuild(r);
    if (!r?.ok) throw Error("Comunica\xE7\xE3o de execu\xE7\xE3o indispon\xEDvel");
    return r;
  }
  function wait(doc, predicate, signal) {
    return new Promise((resolve, reject) => {
      const observer = new MutationObserver(check);
      const timer = setTimeout(() => done(Error("Tempo de UI esgotado")), 15e3);
      function done(error) {
        clearTimeout(timer);
        observer.disconnect();
        signal.removeEventListener("abort", cancel);
        error ? reject(error) : resolve();
      }
      function cancel() {
        done(Error("Execu\xE7\xE3o interrompida"));
      }
      function check() {
        if (signal.aborted) {
          cancel();
          return;
        }
        if (predicate()) done();
      }
      observer.observe(doc.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
      signal.addEventListener("abort", cancel, { once: true });
      check();
    });
  }
  async function driveSeries() {
    if (running) return;
    running = true;
    abort = new AbortController();
    const signal = abort.signal;
    try {
      if (navigator.onLine === false) throw Error("Offline");
      const screen = observe(document);
      const current = screen === "HOME" ? inspectCatalog(document, location.href) : void 0;
      const state = await send2("series-document", { screen, hasCatalog: !!current && !current.warning.includes("N\xE3o executar"), items: current?.items });
      if (state.action === "open") {
        const card = [...document.querySelectorAll(".categoria[data-lixeira] a.cartao[href]")].find((a) => {
          const u = new URL(a.href);
          return u.origin === location.origin && u.pathname === "/ResiduoGo/public/index.php/ar" && u.searchParams.get("residuo") === state.itemId;
        });
        if (!card) throw Error("Card ausente");
        signal.throwIfAborted();
        card.click();
        return;
      }
      if (state.action !== "play") return;
      const calibration = state.calibration;
      if (!calibration[state.category]) throw Error("Sem calibra\xE7\xE3o");
      if (document.querySelector("#abertura") && !document.querySelector("#abertura").hidden) {
        await wait(document, () => document.querySelector("#btn-sem-camera")?.textContent?.trim() === "Jogar", signal);
        document.querySelector("#btn-sem-camera").click();
      }
      for (let i = 0; i < 3; i++) {
        await wait(document, () => {
          try {
            requireReady(document);
            return true;
          } catch {
            return false;
          }
        }, signal);
        const candidate = { ...calibration[state.category], margin: 0 };
        let id = "";
        let next = "pause";
        let before;
        await runAssisted(document, candidate, {
          reserve: async () => {
            before = hudPoints(document);
            const r = await send2("series-reserve", { level: document.querySelector("#hud-nivel")?.textContent?.trim() });
            if (!r.id) throw Error("Reserva bloqueada");
            id = r.id;
            Object.assign(candidate, r.candidate);
            return id;
          },
          adapter: new DebuggerThrowAdapter(() => id, "series-input"),
          finish: async (attemptId, outcome) => {
            const r = await send2("series-finish", { id: attemptId, outcome, score: readScore(document, before), ended: document.querySelector("#hud-tentativas")?.textContent?.trim() === "Rodada encerrada" });
            next = r.action;
          }
        }, signal);
        signal.throwIfAborted();
        if (next === "retry") {
          const retry = document.querySelector("#btn-proximo");
          if (!retry || retry.hidden || retry.disabled) throw Error("Nova tentativa indispon\xEDvel");
          retry.click();
          continue;
        }
        if (next === "return") {
          const menu = [...document.querySelectorAll("#feedback a[href]")].find((a) => {
            const u = new URL(a.href);
            return u.origin === location.origin && u.pathname === "/ResiduoGo/public/index.php" && !u.search;
          });
          if (!menu) throw Error("Controle de retorno ao menu ausente");
          menu.click();
          return;
        }
        return;
      }
    } catch {
      void send2("series-fault").catch(() => {
      });
    } finally {
      running = false;
    }
  }
  window.addEventListener("pagehide", cancelSeries);

  // src/content.ts
  if (allowed(location.href)) chrome.runtime.onMessage.addListener((message, sender, respond) => {
    const reply = (payload) => respond({ ...payload, buildVersion: BUILD_VERSION });
    if (sender.id !== chrome.runtime.id) return false;
    if (message?.type === "series-wake") {
      void driveSeries();
      reply({ ok: true });
    } else if (message?.type === "probe-document") {
      reply({ ok: true });
    } else if (message?.type === "probe-gesture") {
      try {
        requireReady(document);
        const canvas = document.querySelector("canvas#cena");
        if (!canvas) throw Error("Canvas ausente");
        reply({ ok: true, ...endpoints(canvas, message.candidate), width: innerWidth, height: innerHeight });
      } catch {
        reply({ ok: false });
      }
    } else if (message?.type === "inspect") reply({ catalog: inspectCatalog(document, location.href), screen: observe(document) });
    else if (message?.type === "prepare-assisted") {
      if (location.pathname !== "/ResiduoGo/public/index.php/ar") {
        reply({ ok: false, error: "Abra uma partida antes de preparar o lan\xE7amento assistido." });
        return false;
      }
      void showAssistedPanel();
      reply({ ok: true });
      return false;
    } else if (message?.type === "cancel-assisted") {
      cancelAssisted();
      cancelSeries();
      reply({ ok: true });
    }
    return false;
  });
  if (allowed(location.href)) void driveSeries();
})();
