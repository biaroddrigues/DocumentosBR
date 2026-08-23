import { useState, useEffect } from "react";
import {
  CheckCircle2,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ListChecks,
  ClipboardList,
  Image as ImageIcon,
  CalendarCheck,
  HeartPulse,
  Video,
  Pencil,
  Wand2,
  LayoutGrid,
  Package,
  Infinity as InfinityIcon,
  RefreshCw,
  Mail,
  PlayCircle,
  Plus,
} from "lucide-react";

const BRAND = {
  bg: "#FAFAF4", // Branco Neutro Clean
  bgAlt: "#F4F2E7", // Off White Calmante
  ink: "#172014", // Verde Profundo Recovery
  inkMuted: "#7B8374", // Verde Acinzentado Natural
  accent: "#A7B800", // Verde Lima Terapêutico
  highlight: "#F3F5B0", // Amarelo Suave Revitalizante
  vital: "#0C2205", // Verde Vital, o fundo escuro mais profundo da paleta
  musgo: "#3D5A12", // Verde Musgo Ativo
  energia: "#DFE100", // Amarelo Energia, usado só como acento pontual
  laranja: "#F25E2A", // Laranja Cenoura, usado com muita moderação
};

// Checkout real dos Documentos Profissionais BR Recovery (Kiwify).
const CHECKOUT_URL = "https://pay.kiwify.com.br/ehcdbOb";

// Checkout real do Kit Consultório Ortopédico (Kiwify).
const KIT_INFO_URL = "https://pay.kiwify.com.br/qTJN4vC";

// Checkout real do Cérebro Digital de Ortopedia (Kiwify).
const CEREBRO_URL = "https://pay.kiwify.com.br/Luvd6Lr";

// Site real das Fichas de Avaliação Ortopédica.
const FICHAS_SITE_URL = "https://fichas.brrecovery.com.br";

// Login de quem já é cliente. O mesmo app das Fichas também atende os
// clientes de Documentos (confirmado no histórico de commits do projeto:
// "Login direto e tela de acesso neutra para clientes de Documentos").
const ENTRAR_URL = "https://fichas.brrecovery.com.br/?entrar=1";

const DOCUMENTOS = [
  {
    icon: ClipboardList,
    nome: "Contrato de Prestação de Serviços",
    oQueE: "Define o tratamento combinado, valores, forma de pagamento e regras de remarcação e cancelamento.",
    quando: "Antes de iniciar o acompanhamento com um paciente novo.",
  },
  {
    icon: Video,
    nome: "Contrato de Telerreabilitação",
    oQueE: "Cobre as sessões feitas à distância, com as obrigações de cada parte e orientações para o paciente.",
    quando: "Quando parte ou todo o acompanhamento acontece por telerreabilitação.",
  },
  {
    icon: FileText,
    nome: "Termo de Consentimento Livre e Esclarecido",
    oQueE: "Registra que o paciente entendeu o tratamento proposto, os riscos e os benefícios envolvidos.",
    quando: "Na avaliação inicial, antes de começar os atendimentos.",
  },
  {
    icon: ImageIcon,
    nome: "Autorização de Uso de Imagem, Voz e Depoimento",
    oQueE: "Autoriza o uso de fotos, vídeos ou depoimentos do paciente para divulgar o trabalho do consultório.",
    quando: "Antes de postar evolução, resultado ou depoimento de um paciente.",
  },
  {
    icon: CalendarCheck,
    nome: "Controle de Presença",
    oQueE: "Uma tabela simples para registrar data e assinatura de cada sessão realizada.",
    quando: "No dia a dia do consultório, sessão após sessão.",
  },
  {
    icon: HeartPulse,
    nome: "Controle de Dados Vitais",
    oQueE: "Uma estrutura para registrar pressão, frequência cardíaca e saturação quando isso fizer sentido no atendimento.",
    quando: "Nos casos em que acompanhar esses dados faz parte da sua avaliação.",
  },
];

const COMO_O_PREENCHIMENTO_FUNCIONA = [
  { n: "1", titulo: "Escolha o documento", texto: "Selecione qual dos 6 documentos você precisa nesse momento." },
  { n: "2", titulo: "Preencha os campos", texto: "Nome, dados do paciente, valores e demais informações da rotina." },
  { n: "3", titulo: "O texto se organiza sozinho", texto: "As informações preenchidas entram automaticamente no corpo do documento." },
  { n: "4", titulo: "Revise e adapte", texto: "Ajuste o que quiser antes de usar, editar não é um passo extra." },
];

const FAQ = [
  { pergunta: "O acesso é vitalício?", resposta: "Sim. Pagamento único e o acesso não expira, incluindo atualizações futuras dos documentos." },
  { pergunta: "Posso editar os documentos?", resposta: "Pode. Qualquer campo ou trecho de texto pode ser ajustado, tanto no preenchimento quanto depois dele." },
  { pergunta: "Consigo usar mais de uma vez?", resposta: "Consegue, para quantos pacientes precisar. Os documentos ficam disponíveis no seu acesso para reutilizar sempre que quiser." },
  { pergunta: "As informações entram automaticamente no documento?", resposta: "Entram. Os dados que você preenche nos campos aparecem direto no corpo do texto, sem copiar e colar." },
  { pergunta: "Posso adaptar o conteúdo?", resposta: "Pode. Além dos campos, o texto do documento também pode ser editado para se adequar à sua rotina." },
  { pergunta: "Funciona no celular?", resposta: "Funciona. É um site responsivo, abre igual num notebook, tablet ou celular." },
  { pergunta: "Recebo atualizações?", resposta: "Recebe, sem custo extra. Novos documentos e melhorias entram direto no seu acesso." },
  { pergunta: "Os documentos substituem orientação jurídica?", resposta: "Não. São modelos padrão para organizar a rotina do consultório. Em situações específicas ou de maior complexidade, pode ser adequada a revisão por um advogado, adaptando o conteúdo às normas do seu conselho regional e à legislação do seu estado ou município." },
  { pergunta: "Como recebo o acesso?", resposta: "Depois da compra aprovada, o acesso é liberado por e-mail para você entrar na sua conta." },
  { pergunta: "Preciso comprar de novo se já tenho as Fichas de Avaliação?", resposta: "Não. Documentos e Fichas são compras separadas, mas entram na mesma conta. Quem já tem um dos dois e compra o outro passa a ter os dois reunidos no mesmo acesso." },
];

// Pilares do Kit. Nesta página, Documentar aparece primeiro, já que é o
// produto de entrada, mas os três recebem o mesmo peso visual.
const PILARES_KIT = [
  { verbo: "Documentar", nome: "Documentos Profissionais", texto: "Contratos, termos e controles do consultório", preco: "R$ 47", icon: ListChecks },
  { verbo: "Avaliar", nome: "Fichas de Avaliação Ortopédica", texto: "Estrutura completa para suas avaliações", preco: "R$ 47", icon: FileText },
  { verbo: "Consultar", nome: "Cérebro Digital de Ortopedia", texto: "Apoio de evidências para o raciocínio clínico", preco: "R$ 97", icon: Sparkles },
];

function ScreenshotCard({ src, alt, legenda, eager = false, className = "", width = 1376, height = 768 }) {
  return (
    <figure className={className}>
      <div className="rounded-2xl border shadow-md overflow-hidden bg-white" style={{ borderColor: BRAND.highlight }}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={eager ? "eager" : "lazy"}
          className="w-full h-auto block"
        />
      </div>
      {legenda && (
        <figcaption className="mt-3 text-sm text-center sm:text-left leading-relaxed" style={{ color: BRAND.inkMuted }}>
          {legenda}
        </figcaption>
      )}
    </figure>
  );
}

function CTAButton({ children, className = "", big = false, href = CHECKOUT_URL, external = true }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold shadow-lg transition hover:brightness-110 hover:shadow-xl active:scale-[0.98] ${
        big ? "px-8 py-4 text-base sm:text-lg" : "px-6 py-3 text-sm"
      } ${className}`}
      style={{ backgroundColor: BRAND.accent, color: BRAND.ink, boxShadow: `0 8px 24px -8px ${BRAND.accent}99` }}
    >
      {children}
      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
    </a>
  );
}

function SecondaryCTAButton({ children, className = "", href = "#demonstracao", external = false }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold border-2 transition hover:bg-white ${className}`}
      style={{ borderColor: BRAND.ink, color: BRAND.ink, padding: "0.9rem 1.75rem" }}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}

function MicroInfoRow() {
  const itens = [
    { icon: LayoutGrid, texto: "6 documentos disponíveis" },
    { icon: InfinityIcon, texto: "Acesso vitalício" },
    { icon: RefreshCw, texto: "Atualizações incluídas" },
    { icon: Mail, texto: "Suporte por e-mail" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 justify-center lg:justify-start">
      {itens.map(({ icon: Icon, texto }) => (
        <div key={texto} className="flex items-center gap-1.5 text-xs sm:text-sm font-medium" style={{ color: BRAND.ink }}>
          <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: BRAND.accent }} />
          {texto}
        </div>
      ))}
    </div>
  );
}

function MobileStickyBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 640);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t px-4 py-2.5 bg-[#FAFAF4]/95 backdrop-blur flex items-center gap-3 transition-transform duration-200 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ borderColor: BRAND.highlight }}
    >
      <div className="text-sm font-bold shrink-0" style={{ color: BRAND.ink }}>R$ 47</div>
      <CTAButton className="flex-1 !px-4 !py-2.5 !text-sm">Quero acessar</CTAButton>
    </div>
  );
}

// Demonstração interativa. Estado 100% local, nada é salvo, nada é
// enviado para qualquer lugar. Recarregar a página limpa tudo. Os dois
// trechos de texto abaixo reproduzem, de forma resumida, estrutura real
// já usada no Contrato de Prestação de Serviços (preâmbulo com o nome das
// partes e cláusula de valor por atendimento), sem inventar cláusula nova.
function DemoPreenchimento() {
  const [paciente, setPaciente] = useState("");
  const [fisio, setFisio] = useState("");
  const [valor, setValor] = useState("");

  const nomePaciente = paciente.trim() || "Nome do paciente";
  const nomeFisio = fisio.trim() || "Nome do fisioterapeuta";
  const valorTexto = valor.trim() || "0";

  return (
    <section id="demonstracao" className="py-16 sm:py-24 scroll-mt-16" style={{ backgroundColor: BRAND.bg }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div
            className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] rounded-full px-3 py-1.5 mb-4"
            style={{ backgroundColor: BRAND.highlight, color: BRAND.ink }}
          >
            <Wand2 className="h-3.5 w-3.5" />
            Teste você mesma
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Veja como funciona</h2>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: BRAND.inkMuted }}>
            Preencha alguns campos e veja as informações entrarem no documento.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6 order-1" style={{ borderColor: BRAND.highlight }}>
            <div className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: BRAND.inkMuted }}>
              Contrato de Prestação de Serviços, trecho de exemplo
            </div>
            <label className="block mb-4">
              <span className="block text-xs font-semibold mb-1.5" style={{ color: BRAND.ink }}>Nome do(a) paciente</span>
              <input
                type="text"
                value={paciente}
                onChange={(e) => setPaciente(e.target.value)}
                placeholder="Ex: Maria Fulana"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2"
                style={{ borderColor: BRAND.inkMuted, color: BRAND.ink }}
              />
            </label>
            <label className="block mb-4">
              <span className="block text-xs font-semibold mb-1.5" style={{ color: BRAND.ink }}>Nome do(a) fisioterapeuta</span>
              <input
                type="text"
                value={fisio}
                onChange={(e) => setFisio(e.target.value)}
                placeholder="Ex: Beatriz Rodrigues"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2"
                style={{ borderColor: BRAND.inkMuted, color: BRAND.ink }}
              />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold mb-1.5" style={{ color: BRAND.ink }}>Valor por atendimento (R$)</span>
              <input
                type="text"
                inputMode="numeric"
                value={valor}
                onChange={(e) => setValor(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Ex: 150"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2"
                style={{ borderColor: BRAND.inkMuted, color: BRAND.ink }}
              />
            </label>
            <p className="text-xs mt-5 leading-relaxed" style={{ color: BRAND.inkMuted }}>
              Isso é só uma demonstração. Os dados preenchidos aqui não são salvos e desaparecem ao recarregar a página.
            </p>
          </div>

          <div className="rounded-2xl border shadow-md overflow-hidden bg-white order-2" style={{ borderColor: BRAND.highlight }}>
            <div className="px-5 sm:px-6 py-3 text-xs font-semibold uppercase tracking-wide" style={{ backgroundColor: BRAND.bgAlt, color: BRAND.inkMuted }}>
              Prévia do documento
            </div>
            <div className="p-5 sm:p-6 text-sm leading-relaxed" style={{ color: BRAND.ink }}>
              <p className="mb-4">
                Pelo presente instrumento particular, de um lado{" "}
                <strong style={{ backgroundColor: BRAND.highlight }}>{nomePaciente}</strong>, doravante denominado(a)
                CONTRATANTE, e de outro{" "}
                <strong style={{ backgroundColor: BRAND.highlight }}>{nomeFisio}</strong>, fisioterapeuta responsável,
                doravante denominado(a) CONTRATADO(A), têm entre si justo e acordado o presente Contrato de Prestação
                de Serviços.
              </p>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: BRAND.inkMuted }}>
                Cláusula Oitava, Preço e Condições de Pagamento
              </p>
              <p>
                O serviço contratado no presente instrumento será remunerado pelo valor de{" "}
                <strong style={{ backgroundColor: BRAND.highlight }}>R$ {valorTexto}</strong> por atendimento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DocumentosLandingPage() {
  return (
    <div className="min-h-screen w-full pb-16 sm:pb-0" style={{ backgroundColor: BRAND.bg, color: BRAND.ink }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b backdrop-blur bg-[#FAFAF4]/90" style={{ borderColor: BRAND.highlight }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: BRAND.highlight }}
            >
              <ListChecks className="h-5 w-5" style={{ color: BRAND.accent }} />
            </div>
            <span className="font-bold text-sm sm:text-base leading-tight">
              Documentos Profissionais
              <br className="hidden sm:block" /> BR Recovery
            </span>
          </div>
          <a
            href={ENTRAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-semibold rounded-lg px-3 sm:px-4 py-2 border transition hover:bg-white"
            style={{ borderColor: BRAND.inkMuted, color: BRAND.ink }}
          >
            Já sou cliente, entrar
          </a>
        </div>
      </header>

      {/* 1. Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <div
              className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] rounded-full px-3 py-1.5 mb-5"
              style={{ backgroundColor: BRAND.highlight, color: BRAND.ink }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Documentos prontos para a rotina do consultório
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-[1.15]">
              Os documentos que a sua rotina pede, sem começar do zero toda vez
            </h1>
            <p className="mt-4 text-sm sm:text-lg leading-relaxed" style={{ color: BRAND.inkMuted }}>
              6 documentos profissionais editáveis para a fisioterapia. Você preenche os dados, as informações
              entram no documento, e ainda pode adaptar o conteúdo quando precisar.
            </p>

            <div className="mt-6 flex items-center justify-center lg:justify-start gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold" style={{ color: BRAND.accent }}>R$ 47</span>
              <span className="text-xs sm:text-sm" style={{ color: BRAND.inkMuted }}>pagamento único<br />acesso liberado na hora</span>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3">
              <CTAButton big>Quero acessar os documentos</CTAButton>
              <SecondaryCTAButton href="#demonstracao" className="!border-transparent !px-3">
                <PlayCircle className="h-4 w-4" style={{ color: BRAND.accent }} />
                Ver como funciona
              </SecondaryCTAButton>
            </div>

            <div className="mt-7">
              <MicroInfoRow />
            </div>
          </div>

          <div className="max-w-xl mx-auto lg:max-w-none select-none">
            <img
              src="/screenshots/contrato-prestacao-capa.jpg"
              alt="Contrato de Prestação de Serviços da BR Recovery, com cabeçalho de logo, nome e CREFITO, e campos organizados por seção numerada"
              width={1376}
              height={768}
              loading="eager"
              className="w-full h-auto block rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* 2. Problema, sem terror jurídico */}
      <section className="py-14 sm:py-20" style={{ backgroundColor: BRAND.bgAlt }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xl sm:text-2xl font-semibold leading-snug mb-6" style={{ color: BRAND.ink }}>
            "Eu sei que preciso desses documentos, mas sempre deixo para depois ou procuro um modelo quando
            preciso."
          </p>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: BRAND.inkMuted }}>
            Um paciente novo chega e ainda não existe um contrato pronto para assinar. Uma sessão passa a ser por
            telerreabilitação e não há nada formalizando isso. Uma evolução boa merece ser compartilhada, mas falta
            a autorização de imagem. Nenhuma dessas situações é urgente até que aconteça no meio de um atendimento
            cheio. Organizar antes é mais simples do que improvisar na hora.
          </p>
        </div>
      </section>

      {/* 3. Produto real */}
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">O documento de verdade, não um exemplo</h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: BRAND.inkMuted }}>
              Cada documento já vem com o seu nome, CREFITO e logo no cabeçalho, dividido em seções numeradas e
              fácil de seguir do começo ao fim.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 mb-5 sm:mb-6">
            <ScreenshotCard
              src="/screenshots/tcle.jpg"
              alt="Termo de Consentimento Livre e Esclarecido da BR Recovery, com o aviso importante recomendando revisão por advogado e os campos de dados do paciente e do profissional"
              legenda="Termo de Consentimento Livre e Esclarecido, com o aviso de revisão jurídica já incluído no próprio documento."
              width={594}
              height={841}
              className="max-w-xs mx-auto sm:max-w-none"
            />
            <ScreenshotCard
              src="/screenshots/autorizacao-imagem.jpg"
              alt="Autorização de Uso de Imagem, Voz e Depoimento da BR Recovery, documento completo com texto de autorização e campos de data e assinatura"
              legenda="Autorização de Uso de Imagem, Voz e Depoimento, pronta para assinatura."
              width={594}
              height={841}
              className="max-w-xs mx-auto sm:max-w-none"
            />
          </div>
          <ScreenshotCard
            src="/screenshots/telerreabilitacao.jpg"
            alt="Contrato de Telerreabilitação da BR Recovery, com o aviso importante de revisão jurídica, os campos do contratante e do contratado e o início do preâmbulo de qualificação das partes"
            legenda="Contrato de Telerreabilitação, com os mesmos campos organizados por seção e o preâmbulo pronto para ser preenchido."
            className="max-w-2xl mx-auto"
          />
        </div>
      </section>

      {/* 4. Demonstração interativa */}
      <DemoPreenchimento />

      {/* 5. Como o preenchimento funciona */}
      <section className="py-14 sm:py-20 text-white" style={{ backgroundColor: BRAND.vital }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-white">Como o preenchimento funciona</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMO_O_PREENCHIMENTO_FUNCIONA.map((p) => (
              <div key={p.n} className="rounded-xl p-5" style={{ backgroundColor: "rgba(244,242,231,0.06)" }}>
                <div className="text-2xl font-extrabold mb-2" style={{ color: BRAND.accent }}>{p.n}</div>
                <div className="font-bold text-sm mb-1 text-white">{p.titulo}</div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(244,242,231,0.75)" }}>{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Os 6 documentos, escaneável */}
      <section className="py-14 sm:py-20" style={{ backgroundColor: BRAND.bg }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Os 6 documentos incluídos</h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: BRAND.inkMuted }}>
              Cada um cobre um momento diferente da rotina, prontos para preencher quando a situação aparecer.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOCUMENTOS.map((d) => (
              <div key={d.nome} className="bg-white rounded-xl border shadow-sm p-5 flex flex-col" style={{ borderColor: BRAND.highlight }}>
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: BRAND.highlight }}
                >
                  <d.icon className="h-5 w-5" style={{ color: BRAND.accent }} />
                </div>
                <div className="font-bold text-sm mb-2">{d.nome}</div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: BRAND.ink }}>{d.oQueE}</p>
                <p className="text-xs leading-relaxed mt-auto" style={{ color: BRAND.inkMuted }}>
                  <span className="font-semibold">Quando usar:</span> {d.quando}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Edição e personalização */}
      <section className="py-14 sm:py-20" style={{ backgroundColor: BRAND.bgAlt }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div
                className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] rounded-full px-3 py-1.5 mb-4"
                style={{ backgroundColor: BRAND.highlight, color: BRAND.ink }}
              >
                <Pencil className="h-3.5 w-3.5" />
                Não é um PDF travado
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Você preenche, edita e adapta quando precisar</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: BRAND.inkMuted }}>
                Depois de preenchido, qualquer campo ou trecho de texto pode ser ajustado. Seu nome, CREFITO e logo
                aparecem automaticamente no cabeçalho de cada documento, e você pode voltar a editar sempre que a
                situação pedir algo diferente do padrão.
              </p>
              <ul className="space-y-2.5">
                {[
                  "Editar qualquer campo já preenchido",
                  "Ajustar o texto do documento, além dos campos",
                  "Nome, CREFITO e logo aplicados automaticamente no cabeçalho",
                  "Reutilizar o mesmo documento para outros pacientes",
                ].map((texto) => (
                  <li key={texto} className="flex items-start gap-2.5 text-sm" style={{ color: BRAND.ink }}>
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: BRAND.accent }} />
                    {texto}
                  </li>
                ))}
              </ul>
            </div>
            <ScreenshotCard
              src="/screenshots/contrato-preenchido-2.jpg"
              alt="Contrato de Prestação de Serviços com os campos de contratante e contratado preenchidos, incluindo o preâmbulo do documento já com os dados mesclados no texto"
              legenda="Os dados preenchidos nos campos entram direto no corpo do documento."
            />
          </div>
        </div>
      </section>

      {/* 8. Como funciona o acesso */}
      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Como funciona o acesso</h2>
          <p className="text-sm sm:text-base leading-relaxed mb-8" style={{ color: BRAND.inkMuted }}>
            Depois da compra aprovada, o acesso é liberado por e-mail. A partir daí, é só entrar na sua conta,
            escolher o documento, preencher, revisar e usar.
          </p>
          <ScreenshotCard
            src="/screenshots/contrato-preenchido-1.jpg"
            alt="Detalhe do Contrato de Prestação de Serviços preenchido, mostrando os campos do contratante e do contratado organizados por seção"
            className="max-w-2xl mx-auto"
          />
        </div>
      </section>

      {/* 9. Oferta individual */}
      <section className="py-14 sm:py-20" style={{ backgroundColor: BRAND.bg }}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-2">Documentos Profissionais BR Recovery</h2>
          <div className="text-5xl sm:text-6xl font-extrabold my-4" style={{ color: BRAND.ink }}>R$ 47</div>
          <p className="text-sm sm:text-base mb-6" style={{ color: BRAND.inkMuted }}>Pagamento único, acesso liberado na hora.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-7">
            {[
              { icon: LayoutGrid, texto: "6 documentos disponíveis" },
              { icon: InfinityIcon, texto: "Acesso vitalício" },
              { icon: RefreshCw, texto: "Atualizações incluídas" },
              { icon: Mail, texto: "Suporte por e-mail" },
              { icon: ShieldCheck, texto: "Garantia de 7 dias" },
            ].map(({ icon: Icon, texto }) => (
              <div key={texto} className="flex items-center gap-1.5 text-xs sm:text-sm font-medium" style={{ color: BRAND.ink }}>
                <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: BRAND.accent }} />
                {texto}
              </div>
            ))}
          </div>
          <CTAButton big className="w-full sm:w-auto">Quero acessar os documentos</CTAButton>
        </div>
      </section>

      {/* 10. Kit Consultório Ortopédico, mini hero em Verde Vital */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: BRAND.vital }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <div
              className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] rounded-full px-3 py-1.5 mb-5"
              style={{ backgroundColor: "rgba(167,184,0,0.16)", color: BRAND.accent }}
            >
              <Package className="h-3.5 w-3.5" />
              A opção mais completa
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold leading-[1.15] text-white mb-4">
              Quer sair daqui com o consultório ainda mais completo?
            </h2>
            <p className="text-sm sm:text-lg leading-relaxed" style={{ color: "rgba(244,242,231,0.8)" }}>
              Leve os Documentos junto com as Fichas de Avaliação Ortopédica e o Cérebro Digital de Ortopedia.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-10 sm:mb-14 max-w-3xl mx-auto">
            <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(244,242,231,0.06)", border: "1px solid rgba(244,242,231,0.16)" }}>
              <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "rgba(244,242,231,0.6)" }}>Documentos · R$ 47</div>
              <p className="text-sm leading-relaxed text-white">Para quem quer organizar a documentação profissional do consultório.</p>
            </div>
            <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(167,184,0,0.1)", border: `1px solid ${BRAND.accent}` }}>
              <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: BRAND.accent }}>Kit Consultório · R$ 147</div>
              <p className="text-sm leading-relaxed text-white">Para quem quer reunir documentação, avaliação e consulta clínica.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-2 mb-10 sm:mb-14">
            {PILARES_KIT.map((p, i) => (
              <div key={p.nome} className="flex items-center gap-3 sm:gap-2 flex-1">
                <div className="rounded-2xl p-5 flex-1 text-center" style={{ backgroundColor: BRAND.musgo }}>
                  <div
                    className="h-11 w-11 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: BRAND.accent }}
                  >
                    <p.icon className="h-5 w-5" style={{ color: BRAND.ink }} />
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-1.5" style={{ color: BRAND.accent }}>{p.verbo}</div>
                  <div className="font-bold text-sm text-white mb-1">{p.nome}</div>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: "rgba(244,242,231,0.7)" }}>{p.texto}</p>
                  <div className="text-xs font-semibold" style={{ color: "rgba(244,242,231,0.85)" }}>{p.preco}</div>
                </div>
                {i < PILARES_KIT.length - 1 && (
                  <Plus className="h-5 w-5 shrink-0 hidden sm:block" style={{ color: "rgba(244,242,231,0.35)" }} />
                )}
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto text-center mb-6">
            <div className="flex items-center justify-center gap-4 flex-wrap mb-3">
              <span className="text-xl sm:text-2xl font-medium line-through" style={{ color: "rgba(244,242,231,0.45)" }}>R$ 191</span>
              <ArrowRight className="h-5 w-5" style={{ color: "rgba(244,242,231,0.45)" }} />
              <span className="text-5xl sm:text-6xl font-extrabold" style={{ color: BRAND.energia }}>R$ 147</span>
            </div>
            <span
              className="inline-block text-xs font-semibold rounded-full px-3 py-1.5"
              style={{ backgroundColor: BRAND.accent, color: BRAND.ink }}
            >
              Você economiza R$ 44
            </span>
          </div>

          <div
            className="max-w-2xl mx-auto text-center rounded-xl p-4 sm:p-5 mb-10"
            style={{ backgroundColor: "rgba(244,242,231,0.06)", borderLeft: `3px solid ${BRAND.laranja}` }}
          >
            <p className="text-sm sm:text-base leading-relaxed text-white">
              Se você está comprando os Documentos agora, pagaria R$ 47. Por mais <strong>R$ 100</strong>, o Kit
              leva também as Fichas de Avaliação Ortopédica e o Cérebro Digital de Ortopedia.
            </p>
          </div>

          <div className="text-center">
            <a
              href={KIT_INFO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl font-bold shadow-lg transition hover:brightness-110 hover:shadow-xl active:scale-[0.98] px-8 py-4 text-base sm:text-lg w-full sm:w-auto"
              style={{ backgroundColor: BRAND.accent, color: BRAND.ink, boxShadow: `0 8px 24px -8px ${BRAND.accent}99` }}
            >
              Quero o Kit Consultório
              <ArrowRight className="h-5 w-5" />
            </a>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-4">
              {["R$ 147", "Acesso vitalício", "Atualizações incluídas", "Garantia de 7 dias"].map((texto) => (
                <span key={texto} className="text-xs font-medium" style={{ color: "rgba(244,242,231,0.65)" }}>{texto}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11. Garantia */}
      <section className="py-10 sm:py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left" style={{ borderColor: BRAND.highlight }}>
            <ShieldCheck className="h-10 w-10 shrink-0" style={{ color: BRAND.accent }} />
            <div>
              <div className="font-bold text-base mb-1">Garantia de 7 dias</div>
              <p className="text-sm leading-relaxed" style={{ color: BRAND.inkMuted }}>
                Você tem 7 dias para pedir reembolso, garantidos por lei em qualquer compra feita pela internet no
                Brasil. Se não for o que você esperava, é só avisar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ */}
      <section className="pt-4 sm:pt-6 pb-16 sm:pb-20" style={{ backgroundColor: BRAND.bgAlt }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 pt-10">Perguntas frequentes</h2>
          <div className="space-y-3">
            {FAQ.map((o) => (
              <div key={o.pergunta} className="bg-white rounded-xl border p-5" style={{ borderColor: BRAND.highlight }}>
                <div className="font-bold text-sm mb-1.5">{o.pergunta}</div>
                <div className="text-sm leading-relaxed" style={{ color: BRAND.inkMuted }}>{o.resposta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Ecossistema BR Recovery */}
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">O ecossistema BR Recovery</h2>
            <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: BRAND.inkMuted }}>
              Documentar, avaliar e conduzir o atendimento ortopédico, cada parte com seu produto.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border-2 p-5" style={{ borderColor: BRAND.accent }}>
              <ListChecks className="h-6 w-6 mb-2" style={{ color: BRAND.accent }} />
              <div className="font-bold text-sm mb-1">Documentos Profissionais</div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: BRAND.inkMuted }}>Organizar contratos, termos e controles do consultório.</p>
              <span className="text-xs font-semibold" style={{ color: BRAND.accent }}>R$ 47, você está aqui</span>
            </div>
            <a href={FICHAS_SITE_URL} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl border p-5 transition hover:shadow-md" style={{ borderColor: BRAND.highlight }}>
              <FileText className="h-6 w-6 mb-2" style={{ color: BRAND.accent }} />
              <div className="font-bold text-sm mb-1">Fichas de Avaliação Ortopédica</div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: BRAND.inkMuted }}>Avaliar com os testes certos para cada condição.</p>
              <span className="text-xs font-semibold underline" style={{ color: BRAND.ink }}>R$ 47, conhecer</span>
            </a>
            <a href={CEREBRO_URL} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl border p-5 transition hover:shadow-md" style={{ borderColor: BRAND.highlight }}>
              <Sparkles className="h-6 w-6 mb-2" style={{ color: BRAND.accent }} />
              <div className="font-bold text-sm mb-1">Cérebro Digital de Ortopedia</div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: BRAND.inkMuted }}>Consultar evidências para apoiar o raciocínio clínico.</p>
              <span className="text-xs font-semibold underline" style={{ color: BRAND.ink }}>R$ 97, conhecer</span>
            </a>
            <a href={KIT_INFO_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl border-2 p-5 bg-white shadow-md" style={{ borderColor: BRAND.accent }}>
              <Package className="h-6 w-6 mb-2" style={{ color: BRAND.accent }} />
              <div className="font-bold text-sm mb-1">Kit Consultório Ortopédico</div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: BRAND.inkMuted }}>Os três produtos juntos, por menos do que separados.</p>
              <span className="text-xs font-semibold underline" style={{ color: BRAND.ink }}>R$ 147, conhecer</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-10 sm:py-14 text-center px-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-3">Tenha os documentos prontos antes de precisar deles</h2>
        <p className="text-sm mb-4 max-w-xs sm:max-w-sm mx-auto" style={{ color: BRAND.inkMuted }}>
          Garanta seu acesso agora e use no próximo atendimento.
        </p>
        <CTAButton big>Quero acessar os documentos</CTAButton>
        <div className="mt-5">
          <a
            href={ENTRAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm underline underline-offset-2"
            style={{ color: BRAND.inkMuted }}
          >
            Já sou cliente, entrar na minha conta
          </a>
        </div>
      </section>

      <MobileStickyBar />
    </div>
  );
}
