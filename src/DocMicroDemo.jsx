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
// - buildMergeMap / renderMergedClause: copiadas verbatim do mecanismo real
//   de merge tags de FichaEditorApp.jsx (por volta das linhas 6063-6080,
//   funções usadas ali para todos os Documentos Burocráticos).
// - Rótulo, placeholder e mergeKey dos dois campos usados aqui:
//   "Nome completo do(a) paciente" -> pacienteNome, copiado verbatim de
//   FichaEditorApp.jsx, case "doc-contrato-servicos", seção 02
//   (CONTRATANTE), por volta da linha 8964.
//   "Valor por atendimento (R$)" -> valorAtendimento, copiado verbatim da
//   seção 09 (Cláusula Oitava), por volta da linha 9025.
// - Trechos de cláusula: prefixos literais e não reescritos do texto real
//   das seções 04 ("Preâmbulo, Qualificação das Partes", linha 8988) e 09
//   ("Cláusula Oitava, Preço e Condições de Pagamento", linha 9027).
//   Cada trecho para com "..." no primeiro ponto natural (vírgula) antes de
//   um token que esta demonstração não expõe como campo (nacionalidade, RG,
//   CPF, endereço etc.), por decisão explícita de não mostrar o Preâmbulo
//   inteiro com vários campos vazios entre colchetes.
//
// SE O TEXTO REAL DO CONTRATO DE PRESTAÇÃO DE SERVIÇOS MUDAR dentro do
// produto, esta demonstração precisa ser revisada manualmente para
// continuar batendo com o documento real.
// ---------------------------------------------------------------------------
import { useEffect, useRef, useState } from "react";
import { FileSignature, User, Scale, Wand2 } from "lucide-react";

const BRAND = {
  bg: "#FAFAF4",
  ink: "#172014",
  inkMuted: "#7B8374",
  accent: "#A7B800",
  highlight: "#F3F5B0",
};

// ---------------------------------------------------------------------------
// Motor de merge real (copiado verbatim, ver nota de origem no topo).
// ---------------------------------------------------------------------------
function buildMergeMap(fields) {
  const map = {};
  for (const f of fields) {
    if (f.mergeKey) map[f.mergeKey] = { value: (f.value || "").trim(), label: f.label };
  }
  return map;
}
function renderMergedClause(text, mergeMap) {
  return String(text || "").replace(/\{\{(\w+)\}\}/g, (full, key) => {
    const entry = mergeMap && mergeMap[key];
    if (!entry) return "";
    return entry.value ? entry.value : `[${entry.label}]`;
  });
}

// ---------------------------------------------------------------------------
// Conteúdo real: rótulos, placeholders e trechos de cláusula (ver nota de
// origem no topo do arquivo). Nada aqui foi inventado ou reescrito.
// ---------------------------------------------------------------------------
const CAMPO_NOME = { mergeKey: "pacienteNome", label: "Nome completo do(a) paciente", placeholder: "Nome completo..." };
const CAMPO_VALOR = { mergeKey: "valorAtendimento", label: "Valor por atendimento (R$)", placeholder: "Ex: 150,00" };
const TRECHO_PREAMBULO = "Pelo presente instrumento particular, de um lado {{pacienteNome}}, ...";
const TRECHO_CLAUSULA_VALOR = "O serviço contratado no presente instrumento será remunerado pelo valor de R$ {{valorAtendimento}} por atendimento, ...";

// ---------------------------------------------------------------------------
// Sinalização de affordance, mesmo princípio da rodada de UX das Fichas:
// campo que pode ser usado chama atenção (halo + leve escala) -> pessoa
// interage -> o halo para para aquela sessão -> o trecho correspondente do
// documento reage com uma microanimação curta -> só então o próximo campo
// passa a chamar atenção. Nunca dois elementos pulsando ao mesmo tempo.
// Reduced motion: sem halo/pulso, só um realce estático.
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
@keyframes bdrDocResultUpdate {
  0%   { box-shadow: 0 0 0 0 rgba(167,184,0,0); background-color: rgba(167,184,0,0); }
  28%  { box-shadow: 0 0 0 5px rgba(167,184,0,0.16); background-color: rgba(167,184,0,0.22); }
  100% { box-shadow: 0 0 0 0 rgba(167,184,0,0); background-color: rgba(167,184,0,0); }
}
.bdr-docdemo-halo { animation: bdrDocHaloBurst 6s ease-in-out infinite; border-radius: 8px; }
.bdr-docdemo-static { box-shadow: 0 0 0 3px rgba(167,184,0,0.35); border-radius: 8px; }
.bdr-docdemo-result { animation: bdrDocResultUpdate 0.6s ease-out 1; border-radius: 8px; }
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

function ExemploCampo({ icon: Icon, tituloTrecho, campo, value, onChange, inputRef, onFocus, resultRef, trecho, mergeMap, numero }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 items-start">
      <div className="bg-white rounded-2xl border shadow-sm p-5" style={{ borderColor: BRAND.highlight }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold" style={{ borderColor: BRAND.highlight, backgroundColor: BRAND.highlight, color: BRAND.ink }}>
            {numero}
          </span>
          <Icon className="h-4 w-4" style={{ color: BRAND.accent }} />
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: BRAND.inkMuted }}>{campo.label}</span>
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
      <div className="rounded-2xl border shadow-sm overflow-hidden bg-white" style={{ borderColor: BRAND.highlight }}>
        <div className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide" style={{ backgroundColor: BRAND.bg, color: BRAND.inkMuted }}>
          {tituloTrecho}
        </div>
        <div ref={resultRef} className="p-4 text-sm leading-relaxed" style={{ color: BRAND.ink }}>
          {renderMergedClause(trecho, mergeMap)}
        </div>
      </div>
    </div>
  );
}

export default function DocMicroDemo() {
  const reducedMotion = usePrefersReducedMotion();
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [stage, setStage] = useState("nome"); // "nome" -> "valor"
  const nomeDoneRef = useRef(false);
  const valorDoneRef = useRef(false);
  const nomeInputRef = useRef(null);
  const valorInputRef = useRef(null);
  const nomeResultRef = useRef(null);
  const valorResultRef = useRef(null);
  const nomeDebounce = useRef(null);
  const valorDebounce = useRef(null);

  useEffect(() => { ensureHaloStylesInjected(); }, []);

  // Campo 1 (nome): halo entra em cena pouco depois da seção aparecer.
  useEffect(() => {
    if (nomeDoneRef.current) return;
    const el = nomeInputRef.current;
    if (!el) return;
    if (reducedMotion) {
      const t = setTimeout(() => { if (!nomeDoneRef.current) el.classList.add("bdr-docdemo-static"); }, 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { if (!nomeDoneRef.current) el.classList.add("bdr-docdemo-halo"); }, 600);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  // Campo 2 (valor): só começa a chamar atenção depois que o campo 1 foi
  // interagido, nunca os dois pulsando ao mesmo tempo.
  useEffect(() => {
    if (stage !== "valor" || valorDoneRef.current) return;
    const el = valorInputRef.current;
    if (!el) return;
    if (reducedMotion) {
      const t = setTimeout(() => { if (!valorDoneRef.current) el.classList.add("bdr-docdemo-static"); }, 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { if (!valorDoneRef.current) el.classList.add("bdr-docdemo-halo"); }, 500);
    return () => clearTimeout(t);
  }, [stage, reducedMotion]);

  function pulseResult(el) {
    if (!el || reducedMotion) return;
    el.classList.remove("bdr-docdemo-result");
    void el.offsetWidth;
    el.classList.add("bdr-docdemo-result");
    setTimeout(() => el.classList.remove("bdr-docdemo-result"), 650);
  }

  function handleNomeFocus() {
    if (nomeDoneRef.current) return;
    nomeDoneRef.current = true;
    nomeInputRef.current?.classList.remove("bdr-docdemo-halo", "bdr-docdemo-static");
    setStage("valor");
  }
  function handleValorFocus() {
    if (valorDoneRef.current) return;
    valorDoneRef.current = true;
    valorInputRef.current?.classList.remove("bdr-docdemo-halo", "bdr-docdemo-static");
  }

  function handleNomeChange(e) {
    const v = e.target.value;
    setNome(v);
    clearTimeout(nomeDebounce.current);
    if (!v.trim()) return;
    nomeDebounce.current = setTimeout(() => pulseResult(nomeResultRef.current), 400);
  }
  function handleValorChange(e) {
    const v = e.target.value.replace(/[^0-9.,]/g, "");
    setValor(v);
    clearTimeout(valorDebounce.current);
    if (!v.trim()) return;
    valorDebounce.current = setTimeout(() => pulseResult(valorResultRef.current), 400);
  }

  const mergeMap = buildMergeMap([
    { mergeKey: CAMPO_NOME.mergeKey, value: nome, label: CAMPO_NOME.label },
    { mergeKey: CAMPO_VALOR.mergeKey, value: valor, label: CAMPO_VALOR.label },
  ]);

  return (
    <section id="demonstracao" className="pt-16 sm:pt-24 pb-12 sm:pb-16 scroll-mt-16" style={{ backgroundColor: BRAND.bg }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div
            className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] rounded-full px-3 py-1.5 mb-4"
            style={{ backgroundColor: BRAND.highlight, color: BRAND.ink }}
          >
            <Wand2 className="h-3.5 w-3.5" />
            Veja como funciona na prática
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Preencha os campos. Veja as informações entrarem automaticamente no documento.</h2>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: BRAND.inkMuted }}>
            Dois trechos reais do Contrato de Prestação de Serviços, o mesmo documento que você recebe no seu acesso.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <ExemploCampo
            numero="1"
            icon={User}
            tituloTrecho="Preâmbulo, Qualificação das Partes"
            campo={CAMPO_NOME}
            value={nome}
            onChange={handleNomeChange}
            onFocus={handleNomeFocus}
            inputRef={nomeInputRef}
            resultRef={nomeResultRef}
            trecho={TRECHO_PREAMBULO}
            mergeMap={mergeMap}
          />
          <ExemploCampo
            numero="2"
            icon={Scale}
            tituloTrecho="Cláusula Oitava, Preço e Condições de Pagamento"
            campo={CAMPO_VALOR}
            value={valor}
            onChange={handleValorChange}
            onFocus={handleValorFocus}
            inputRef={valorInputRef}
            resultRef={valorResultRef}
            trecho={TRECHO_CLAUSULA_VALOR}
            mergeMap={mergeMap}
          />
        </div>

        <p className="text-xs mt-6 text-center max-w-md mx-auto leading-relaxed" style={{ color: BRAND.inkMuted }}>
          <FileSignature className="h-3.5 w-3.5 inline-block mr-1 align-text-bottom" style={{ color: BRAND.accent }} />
          Isso é o mecanismo real do produto. Os dados digitados aqui não são salvos e desaparecem ao recarregar a página.
        </p>
      </div>
    </section>
  );
}
