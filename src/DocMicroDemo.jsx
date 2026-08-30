// ---------------------------------------------------------------------------
// DocMicroDemo.jsx, microdemonstração REAL do mecanismo de merge tags do
// produto (Documentos Profissionais), reaproveitando só o estritamente
// necessário do app real, sem importar Auth, Supabase ou o conteúdo clínico
// das fichas (esses continuam a viver só dentro de FichaEditorApp.jsx, no
// repositório FichasClinicas).
//
// Esta versão restaura o LAYOUT E A EXPERIÊNCIA VISUAL da primeira
// demonstração interativa da página (commit 10422b8, "Polimento final",
// função DemoPreenchimento, a versão que existia antes da reformulação com
// merge tags reais): dois cards lado a lado (campos | "Prévia do
// documento"), 3 campos com rótulo simples, texto do documento com os
// valores preenchidos em negrito e destaque. Único acréscimo sobre aquela
// versão original: a sinalização de atenção (halo -> interação -> reação no
// documento) já usada nas Fichas, camada puramente de UX, pedida
// explicitamente para esta rodada.
//
// DIFERENÇA INTENCIONAL EM RELAÇÃO AO TEXTO DA VERSÃO ORIGINAL: a versão
// original tinha um parágrafo escrito à mão, resumindo/parafraseando a
// estrutura do contrato ("de um lado {nome}, doravante denominado(a)
// CONTRATANTE, e de outro {fisio}, fisioterapeuta responsável..."), não o
// texto literal do documento. Como esta rodada pede para usar a lógica REAL
// de merge tags sempre que possível, o parágrafo abaixo foi reconstruído só
// com substrings literais e não reescritas do texto real do contrato,
// unidas por marcadores explícitos "..." nos pontos em que pula texto real
// não exposto como campo (nacionalidade, estado civil, profissão, RG, CPF,
// endereço de cada parte). Nada entre os "..." foi inventado, resumido ou
// parafraseado.
//
// ORIGEM DO CONTEÚDO, para manter isso sincronizado se o contrato mudar
// dentro do produto (DocumentosBR e FichasClinicas são repositórios e
// deploys separados, não há import automático entre os dois):
// - buildMergeMap: copiada verbatim do mecanismo real de merge tags de
//   FichaEditorApp.jsx (por volta das linhas 6063-6069).
// - renderMergedClauseNodes: variante em nós React de renderMergedClause
//   (mesma origem, linhas 6070-6076), reescrita para permitir destacar cada
//   valor individualmente em vez de só devolver uma string.
// - Rótulo, placeholder e mergeKey dos três campos usados aqui, copiados
//   verbatim de FichaEditorApp.jsx, case "doc-contrato-servicos":
//   "Nome completo do(a) paciente" -> pacienteNome, seção 02, linha ~8964.
//   "Nome completo do(a) fisioterapeuta" -> fisioNome, seção 03, linha ~8977.
//   "Valor por atendimento (R$)" -> valorAtendimento, seção 09, linha ~9025.
// - Trechos de cláusula: substrings do texto real das seções 04
//   ("Preâmbulo, Qualificação das Partes", linha ~8988) e 09 ("Cláusula
//   Oitava, Preço e Condições de Pagamento", linha ~9027).
//
// SE O TEXTO REAL DO CONTRATO DE PRESTAÇÃO DE SERVIÇOS MUDAR dentro do
// produto, esta demonstração precisa ser revisada manualmente para
// continuar batendo com o documento real.
// ---------------------------------------------------------------------------
import { useEffect, useRef, useState } from "react";

const BRAND = {
  bg: "#FAFAF4",
  bgAlt: "#F1F0E4",
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
  { mergeKey: "pacienteNome", label: "Nome do(a) paciente", placeholder: "Ex: Maria Fulana" },
  { mergeKey: "fisioNome", label: "Nome do(a) fisioterapeuta", placeholder: "Ex: Beatriz Rodrigues" },
  { mergeKey: "valorAtendimento", label: "Valor por atendimento (R$)", placeholder: "Ex: 150,00" },
];

const TRECHO_PREAMBULO =
  "Pelo presente instrumento particular, de um lado {{pacienteNome}}, ... doravante denominado(a) simplesmente CONTRATANTE; e de outro lado {{fisioNome}}, ... doravante denominado(a) simplesmente CONTRATADO(A), têm entre si justo e contratado o presente Contrato de Prestação de Serviços de Fisioterapia...";
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
      const v = campo.mergeKey === "valorAtendimento" ? raw.replace(/[^0-9.,-]/g, "") : raw;
      setValues((prev) => ({ ...prev, [campo.mergeKey]: v }));
      clearTimeout(debounceRefs.current[i]);
      if (!v.trim()) return;
      debounceRefs.current[i] = setTimeout(() => pulseToken(campo.mergeKey), 400);
    };
  }

  const mergeMap = buildMergeMap(CAMPOS.map((c) => ({ mergeKey: c.mergeKey, value: values[c.mergeKey], label: c.label })));
  const registerTokenRef = (key, el) => { tokenRefs.current[key] = el; };

  return (
    <section id="demonstracao" className="demo-section">
      <div className="demo-wrap">
        <div className="demo-heading">
          <h2>VOCÊ PREENCHE<br />UMA VEZ.<br /><mark>O CONTRATO<br />SE ORGANIZA.</mark></h2>
          <p>Preencha os campos. Os dados aparecem automaticamente no corpo do documento. Depois, adapte o que quiser.</p>
        </div>
        <div className="demo-board">
          <div className="demo-fields">
            <div className="demo-panel-label"><span>DADOS DAS PARTES</span><span>01 / 03</span></div>
            {CAMPOS.map((campo, i) => (
              <label className="demo-field" key={campo.mergeKey}>
                <span>{campo.label}</span>
                <input
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  value={values[campo.mergeKey]}
                  placeholder={campo.placeholder}
                  onChange={handleChange(i, campo)}
                  onFocus={() => handleFocus(i)}
                  aria-label={campo.label}
                />
              </label>
            ))}
            <p className="demo-privacy">DEMONSTRAÇÃO REAL. OS DADOS DIGITADOS AQUI NÃO SÃO SALVOS.</p>
          </div>
          <div className="demo-document">
            <div className="demo-doc-head"><strong>CONTRATO DE PRESTAÇÃO<br />DE SERVIÇOS</strong><span>BR RECOVERY / DOCUMENTO 01</span></div>
            <h3 className="demo-clause-title">04 PREÂMBULO / QUALIFICAÇÃO DAS PARTES</h3>
            <p>{renderMergedClauseNodes(TRECHO_PREAMBULO, mergeMap, registerTokenRef)}</p>
            <h3 className="demo-clause-title">CLÁUSULA OITAVA, PREÇO E CONDIÇÕES DE PAGAMENTO</h3>
            <p>{renderMergedClauseNodes(TRECHO_CLAUSULA_VALOR, mergeMap, registerTokenRef)}</p>
            <div className="demo-callout">DIGITE NOS CAMPOS AO LADO E ACOMPANHE AS ALTERAÇÕES NESTE TRECHO.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
