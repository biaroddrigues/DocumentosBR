// ---------------------------------------------------------------------------
// DocMicroDemo.jsx, microdemonstração REAL do mecanismo de merge tags do
// produto (Documentos Profissionais), reaproveitando só o estritamente
// necessário do app real, sem importar Auth, Supabase ou o conteúdo clínico
// das fichas (esses continuam a viver só dentro de FichaEditorApp.jsx, no
// repositório FichasClinicas).
//
// ORIGEM DO CONTEÚDO, para manter isso sincronizado se o contrato mudar
// dentro do produto (DocumentosBR e FichasClinicas são repositórios e
// deploys separados, não há import automático entre os dois):
//
// - buildMergeMap: copiada verbatim do mecanismo real de merge tags de
//   FichaEditorApp.jsx (por volta das linhas 6063-6069).
// - renderMergedClauseNodes: variante em nós React de renderMergedClause
//   (mesma origem, linhas 6070-6076), reescrita para permitir destacar cada
//   valor individualmente em vez de só devolver uma string.
// - Rótulo, placeholder e mergeKey dos quatro campos usados aqui, copiados
//   verbatim de FichaEditorApp.jsx, case "doc-contrato-servicos":
//   "Nome completo do(a) paciente" -> pacienteNome, seção 02, linha ~8964.
//   "CPF" (paciente) -> pacienteCPF, seção 02, linha ~8969.
//   "Nome completo do(a) fisioterapeuta" -> fisioNome, seção 03, linha ~8977.
//   "Valor por atendimento (R$)" -> valorAtendimento, seção 09, linha ~9025.
// - Trechos de cláusula: montados só com substrings literais e não
//   reescritas do texto real das seções 04 ("Preâmbulo, Qualificação das
//   Partes", linha ~8988) e 09 ("Cláusula Oitava, Preço e Condições de
//   Pagamento", linha ~9027), unidas por marcadores explícitos "..." nos
//   pontos em que o trecho pula tokens reais que esta demonstração não expõe
//   como campo (nacionalidade, estado civil, profissão, RG, endereço). Nada
//   entre os "..." foi reescrito, resumido ou parafraseado; cada pedaço
//   mantido é uma cópia exata do texto do contrato real.
//
// SE O TEXTO REAL DO CONTRATO DE PRESTAÇÃO DE SERVIÇOS MUDAR dentro do
// produto, esta demonstração precisa ser revisada manualmente para
// continuar batendo com o documento real.
// ---------------------------------------------------------------------------
import { useEffect, useRef, useState } from "react";
import { FileSignature, User, Hash, Stethoscope, Scale, Wand2 } from "lucide-react";

const BRAND = {
  bg: "#FAFAF4",
  ink: "#172014",
  inkMuted: "#7B8374",
  accent: "#A7B800",
  highlight: "#F3F5B0",
};

// ---------------------------------------------------------------------------
// Motor de merge real (buildMergeMap copiada verbatim, ver nota de origem no
// topo). renderMergedClauseNodes é a mesma lógica de substituição de
// {{token}}, mas devolvendo nós React em vez de uma string, para que cada
// valor mesclado possa reagir individualmente quando muda.
// ---------------------------------------------------------------------------
function buildMergeMap(fields) {
  const map = {};
  for (const f of fields) {
    if (f.mergeKey) map[f.mergeKey] = { value: (f.value || "").trim(), label: f.label };
  }
  return map;
}
function renderMergedClauseNodes(text, mergeMap, registerTokenRef) {
  const partes = String(text || "").split(/(\{\{\w+\}\})/g);
  return partes.map((parte, i) => {
    const m = parte.match(/^\{\{(\w+)\}\}$/);
    if (!m) return parte;
    const key = m[1];
    const entry = mergeMap[key];
    if (!entry) return null;
    const preenchido = !!entry.value;
    return (
      <span
        key={key}
        ref={(el) => registerTokenRef(key, el)}
        className={preenchido ? "bdr-docdemo-token bdr-docdemo-token-preenchido" : "bdr-docdemo-token bdr-docdemo-token-vazio"}
      >
        {preenchido ? entry.value : `[${entry.label}]`}
      </span>
    );
  });
}

// ---------------------------------------------------------------------------
// Conteúdo real: rótulos, placeholders e trechos de cláusula (ver nota de
// origem no topo do arquivo). Nada aqui foi inventado ou reescrito, os "..."
// marcam explicitamente onde o trecho pula texto real não exposto.
// ---------------------------------------------------------------------------
const CAMPOS = [
  { mergeKey: "pacienteNome", label: "Nome completo do(a) paciente", placeholder: "Nome completo...", icon: User },
  { mergeKey: "pacienteCPF", label: "CPF do(a) paciente", placeholder: "000.000.000-00", icon: Hash },
  { mergeKey: "fisioNome", label: "Nome completo do(a) fisioterapeuta", placeholder: "Nome completo...", icon: Stethoscope },
  { mergeKey: "valorAtendimento", label: "Valor por atendimento (R$)", placeholder: "Ex: 150,00", icon: Scale },
];

const TRECHO_PREAMBULO =
  "Pelo presente instrumento particular, de um lado {{pacienteNome}}, ... e do CPF nº {{pacienteCPF}}, ... doravante denominado(a) simplesmente CONTRATANTE; e de outro lado {{fisioNome}}, ... doravante denominado(a) simplesmente CONTRATADO(A)...";
const TRECHO_CLAUSULA_VALOR =
  "O serviço contratado no presente instrumento será remunerado pelo valor de R$ {{valorAtendimento}} por atendimento, ...";

// ---------------------------------------------------------------------------
// Sinalização de affordance, mesmo princípio da rodada de UX das Fichas:
// campo que pode ser usado chama atenção (halo + leve escala) -> pessoa
// interage -> o halo para para aquela sessão -> só o VALOR correspondente
// dentro do documento reage com uma microanimação curta (não o parágrafo
// inteiro) -> só então o próximo campo passa a chamar atenção. Nunca dois
// campos pulsando ao mesmo tempo. Reduced motion: sem halo/pulso, só um
// realce estático no campo da vez.
// ---------------------------------------------------------------------------
const HALO_STYLE_ID = "bdr-docdemo-halo-styles";
const HALO_CSS = `
@keyframes bdrDocHaloBurst {
  0%   { box-shadow: 0 0 0 0 rgba(167,184,0,0.45); transform: scale(1); }
  6%   { box-shadow: 0 0 0 6px rgba(167,184,0,0); transform: scale(1.012); }
  13%  { box-shadow: 0 0 0 0 rgba(167,184,0,0); transform: scale(1); }
  20%  { box-shadow: 0 0 0 0 rgba(167,184,0,0.45); transform: scale(1); }
  26%  { box-shadow: 0 0 0 6px rgba(167,184,0,0); transform: scale(1.012); }
  33%  { box-shadow: 0 0 0 0 rgba(167,184,0,0); transform: scale(1); }
  40%  { box-shadow: 0 0 0 0 rgba(167,184,0,0.45); transform: scale(1); }
  46%  { box-shadow: 0 0 0 6px rgba(167,184,0,0); transform: scale(1.012); }
  53%  { box-shadow: 0 0 0 0 rgba(167,184,0,0); transform: scale(1); }
  100% { box-shadow: 0 0 0 0 rgba(167,184,0,0); transform: scale(1); }
}
@keyframes bdrDocTokenPulse {
  0%   { box-shadow: 0 0 0 0 rgba(167,184,0,0); background-color: #FDF3B0; }
  30%  { box-shadow: 0 0 0 4px rgba(167,184,0,0.22); background-color: #F3F5B0; }
  100% { box-shadow: 0 0 0 0 rgba(167,184,0,0); background-color: #F3F5B0; }
}
.bdr-docdemo-halo { animation: bdrDocHaloBurst 6s ease-in-out infinite; border-radius: 8px; }
.bdr-docdemo-static { box-shadow: 0 0 0 3px rgba(167,184,0,0.35); border-radius: 8px; }
.bdr-docdemo-token { border-radius: 3px; padding: 0 2px; }
.bdr-docdemo-token-preenchido { background-color: #F3F5B0; color: #172014; font-weight: 600; }
.bdr-docdemo-token-vazio { color: #ABB39D; font-style: italic; }
.bdr-docdemo-token-pulse { animation: bdrDocTokenPulse 0.7s ease-out 1; }
`;
function ensureHaloStylesInjected() {
  if (typeof document === "undefined" || document.getElementById(HALO_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = HALO_STYLE_ID;
  style.textContent = HALO_CSS;
  document.head.appendChild(style);
}
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);
  return reduced;
}

function CampoFormulario({ campo, numero, ativo, value, onChange, onFocus, inputRef }) {
  const Icon = campo.icon;
  return (
    <div className="flex items-start gap-3">
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold mt-0.5"
        style={{ borderColor: BRAND.highlight, backgroundColor: ativo ? BRAND.highlight : "#fff", color: BRAND.ink }}
      >
        {numero}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: BRAND.accent }} />
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: BRAND.inkMuted }}>
            {campo.label}
          </span>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          placeholder={campo.placeholder}
          onChange={onChange}
          onFocus={onFocus}
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2"
          style={{ borderColor: "#CBD5C4", color: BRAND.ink }}
        />
      </div>
    </div>
  );
}

export default function DocMicroDemo() {
  const reducedMotion = usePrefersReducedMotion();
  const [values, setValues] = useState(() => Object.fromEntries(CAMPOS.map((c) => [c.mergeKey, ""])));
  const [stage, setStage] = useState(0);

  const doneRefs = useRef(CAMPOS.map(() => false));
  const inputRefs = useRef(CAMPOS.map(() => null));
  const tokenRefs = useRef({});
  const debounceRefs = useRef(CAMPOS.map(() => null));

  useEffect(() => { ensureHaloStylesInjected(); }, []);

  // Relay sequencial: só o campo da vez chama atenção; nunca dois ao mesmo
  // tempo. Ao focar um campo, seu halo para para aquela sessão e, se era o
  // campo da vez, o relay avança para o próximo.
  useEffect(() => {
    if (stage >= CAMPOS.length || doneRefs.current[stage]) return;
    const el = inputRefs.current[stage];
    if (!el) return;
    if (reducedMotion) {
      const t = setTimeout(() => { if (!doneRefs.current[stage]) el.classList.add("bdr-docdemo-static"); }, 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { if (!doneRefs.current[stage]) el.classList.add("bdr-docdemo-halo"); }, stage === 0 ? 600 : 500);
    return () => clearTimeout(t);
  }, [stage, reducedMotion]);

  function handleFocus(i) {
    if (doneRefs.current[i]) return;
    doneRefs.current[i] = true;
    inputRefs.current[i]?.classList.remove("bdr-docdemo-halo", "bdr-docdemo-static");
    if (i === stage) setStage(i + 1);
  }

  function pulseToken(mergeKey) {
    const el = tokenRefs.current[mergeKey];
    if (!el || reducedMotion) return;
    el.classList.remove("bdr-docdemo-token-pulse");
    void el.offsetWidth;
    el.classList.add("bdr-docdemo-token-pulse");
    setTimeout(() => el.classList.remove("bdr-docdemo-token-pulse"), 750);
  }

  function handleChange(i, campo) {
    return (e) => {
      const raw = e.target.value;
      const v = campo.mergeKey === "pacienteCPF" || campo.mergeKey === "valorAtendimento"
        ? raw.replace(/[^0-9.,-]/g, "")
        : raw;
      setValues((prev) => ({ ...prev, [campo.mergeKey]: v }));
      clearTimeout(debounceRefs.current[i]);
      if (!v.trim()) return;
      debounceRefs.current[i] = setTimeout(() => pulseToken(campo.mergeKey), 400);
    };
  }

  const mergeMap = buildMergeMap(CAMPOS.map((c) => ({ mergeKey: c.mergeKey, value: values[c.mergeKey], label: c.label })));
  const registerTokenRef = (key, el) => { tokenRefs.current[key] = el; };

  return (
    <section id="demonstracao" className="pt-16 sm:pt-24 pb-12 sm:pb-16 scroll-mt-16" style={{ backgroundColor: BRAND.bg }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div
            className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] rounded-full px-3 py-1.5 mb-4"
            style={{ backgroundColor: BRAND.highlight, color: BRAND.ink }}
          >
            <Wand2 className="h-3.5 w-3.5" />
            Veja como funciona na prática
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Preencha os campos. Veja as informações entrarem automaticamente no documento.</h2>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: BRAND.inkMuted }}>
            Trechos reais do Contrato de Prestação de Serviços, o mesmo documento que você recebe no seu acesso.
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,280px)_1fr] gap-5 lg:gap-8 items-start">
          <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-5" style={{ borderColor: BRAND.highlight }}>
            {CAMPOS.map((campo, i) => (
              <CampoFormulario
                key={campo.mergeKey}
                campo={campo}
                numero={i + 1}
                ativo={stage === i && !doneRefs.current[i]}
                value={values[campo.mergeKey]}
                onChange={handleChange(i, campo)}
                onFocus={() => handleFocus(i)}
                inputRef={(el) => { inputRefs.current[i] = el; }}
              />
            ))}
          </div>

          <div className="rounded-2xl border shadow-sm overflow-hidden bg-white" style={{ borderColor: BRAND.highlight }}>
            <div
              className="px-5 sm:px-7 py-4 flex items-center gap-2.5 border-b"
              style={{ backgroundColor: BRAND.bg, borderColor: BRAND.highlight }}
            >
              <FileSignature className="h-4 w-4 shrink-0" style={{ color: BRAND.accent }} />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide truncate" style={{ color: BRAND.ink }}>
                  Contrato de Prestação de Serviços
                </p>
                <p className="text-[10px]" style={{ color: BRAND.inkMuted }}>BR Recovery</p>
              </div>
            </div>
            <div className="px-5 sm:px-7 py-5 sm:py-6 space-y-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: BRAND.inkMuted }}>
                  Preâmbulo, Qualificação das Partes
                </p>
                <p className="text-sm leading-relaxed" style={{ color: BRAND.ink }}>
                  {renderMergedClauseNodes(TRECHO_PREAMBULO, mergeMap, registerTokenRef)}
                </p>
              </div>
              <div className="border-t" style={{ borderColor: BRAND.highlight }} />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: BRAND.inkMuted }}>
                  Cláusula Oitava, Preço e Condições de Pagamento
                </p>
                <p className="text-sm leading-relaxed" style={{ color: BRAND.ink }}>
                  {renderMergedClauseNodes(TRECHO_CLAUSULA_VALOR, mergeMap, registerTokenRef)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs mt-6 text-center max-w-md mx-auto leading-relaxed" style={{ color: BRAND.inkMuted }}>
          <FileSignature className="h-3.5 w-3.5 inline-block mr-1 align-text-bottom" style={{ color: BRAND.accent }} />
          Isso é o mecanismo real do produto. Os dados digitados aqui não são salvos e desaparecem ao recarregar a página.
        </p>
      </div>
    </section>
  );
}
