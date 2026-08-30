import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, Plus } from "lucide-react";
import DocMicroDemo from "./DocMicroDemo.jsx";

const CHECKOUT_URL = "https://pay.kiwify.com.br/ehcdbOb";
const KIT_INFO_URL = "https://pay.kiwify.com.br/qTJN4vC";
const ENTRAR_URL = "https://fichas.brrecovery.com.br/?entrar=1";

const docs = [
  { n: "01", name: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS", text: "Para formalizar as condições do atendimento.", image: "/screenshots/contrato-prestacao-capa.jpg", className: "doc-one" },
  { n: "02", name: "CONTRATO DE TELERREABILITAÇÃO", text: "Para organizar atendimentos realizados à distância.", image: "/screenshots-originais/telerreabilitacao.jpeg", className: "doc-two" },
  { n: "03", name: "TCLE", text: "Termo de Consentimento Livre e Esclarecido.", image: "/screenshots/tcle.jpg", className: "doc-three" },
  { n: "04", name: "AUTORIZAÇÃO DE USO DE IMAGEM, VOZ E DEPOIMENTO", text: "Para registrar a autorização do paciente.", image: "/screenshots/autorizacao-imagem.jpg", className: "doc-four" },
  { n: "05", name: "CONTROLE DE PRESENÇA", text: "Para acompanhar os atendimentos realizados.", image: "/screenshots/controle-presenca.jpg", className: "doc-five" },
  { n: "06", name: "CONTROLE DE DADOS VITAIS", text: "Para registrar informações ao longo dos atendimentos.", image: "/screenshots/controle-dados-vitais.jpg", className: "doc-six" },
];

const faq = [
  ["Os documentos são editáveis?", "Sim. Qualquer campo ou trecho de texto pode ser ajustado, tanto no preenchimento quanto depois dele."],
  ["Posso reutilizá-los com outros pacientes?", "Sim. Você pode reutilizar os documentos para quantos pacientes precisar."],
  ["O acesso expira?", "Não. O acesso é vitalício e inclui as atualizações futuras dos documentos."],
  ["Como recebo o acesso?", "Depois da compra aprovada, o acesso é liberado por e-mail para você entrar na sua conta."],
  ["Posso personalizar com meus dados?", "Sim. Você pode preencher seus dados, inserir sua identidade profissional e adaptar o conteúdo à sua rotina."],
  ["Preciso pagar mensalidade?", "Não. O pagamento é único."],
  ["Como funciona a garantia?", "Você tem 7 dias para pedir reembolso em compras feitas pela internet no Brasil."],
];

function BuyButton({ kit = false, children }) {
  return <a className={`buy-button ${kit ? "buy-button-kit" : ""}`} href={kit ? KIT_INFO_URL : CHECKOUT_URL} target="_blank" rel="noreferrer">{children}<ArrowRight aria-hidden="true" /></a>;
}

function HeroDocuments() {
  return <div className="hero-documents" aria-label="Páginas reais dos documentos incluídos">
    <div className="hero-gridline" />
    <figure className="paper paper-main"><img src="/screenshots/contrato-prestacao-capa.jpg" alt="Contrato de Prestação de Serviços" /></figure>
    <figure className="paper paper-back"><img src="/screenshots/tcle.jpg" alt="Termo de Consentimento Livre e Esclarecido" /></figure>
    <figure className="paper paper-detail"><img src="/screenshots/contrato-preenchido-1.jpg" alt="Detalhe do contrato preenchido" /></figure>
    <span className="proof-note">DOCUMENTOS REAIS<br />PRONTOS PARA EDITAR</span><span className="proof-line" />
  </div>;
}

function StickyBuy() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const update = () => setVisible(window.scrollY > 620); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []);
  return <div className={`sticky-buy ${visible ? "is-visible" : ""}`}><strong>R$47</strong><BuyButton>QUERO MEUS DOCUMENTOS</BuyButton></div>;
}

export default function DocumentosLandingPage() {
  return <main>
    <header className="site-header"><a className="brand" href="#top"><img src="/logo-wordmark-dark.webp" alt="BR Recovery" /></a><a className="client-link" href={ENTRAR_URL} target="_blank" rel="noreferrer">JÁ SOU CLIENTE</a></header>
    <section className="hero" id="top"><div className="hero-copy"><h1>A PARTE BUROCRÁTICA<br />DO SEU CONSULTÓRIO<br /><mark>NÃO PRECISA COMEÇAR</mark><br />DO ZERO.</h1><p>6 documentos profissionais, editáveis e reutilizáveis para sua rotina como fisioterapeuta.</p><div className="hero-offer"><strong>R$47</strong><span>PAGAMENTO<br />ÚNICO</span></div><BuyButton>QUERO MEUS DOCUMENTOS</BuyButton></div><HeroDocuments /><a className="scroll-cue" href="#demonstracao">VER COMO FUNCIONA <ArrowDown /></a></section>
    <section className="problem-statement"><p>UM PACIENTE NOVO CHEGA.</p><h2>O ATENDIMENTO PODE ESTAR PRONTO.<br /><span>O DOCUMENTO TAMBÉM.</span></h2></section>
    <DocMicroDemo />
    <section className="documents-section"><div className="section-heading"><h2>E NÃO É SÓ<br />O CONTRATO.</h2><p>SEIS DOCUMENTOS PARA MOMENTOS REAIS DA ROTINA.</p></div><div className="documents-editorial">{docs.map(doc => <article className={`document-piece ${doc.className}`} key={doc.name}><div className="document-shot"><img src={doc.image} alt={`Página real: ${doc.name}`} loading="lazy" /></div><div className="document-caption"><span>{doc.n}</span><h3>{doc.name}</h3><p>{doc.text}</p></div></article>)}</div></section>
    <section className="positioning-section"><div className="positioning-line" /><h2>O ATENDIMENTO É<br /><span>CLÍNICO.</span></h2><h2>A ORGANIZAÇÃO TAMBÉM<br />PRECISA SER <mark>PROFISSIONAL.</mark></h2><p>Contrato, consentimento, autorização e controles organizados para você não precisar improvisar cada documento do zero.</p></section>
    <section className="main-offer"><div><h2>OS 6 DOCUMENTOS.<br /><mark>R$47 UMA VEZ.</mark></h2><ul><li>ACESSO VITALÍCIO</li><li>EDITÁVEIS E REUTILIZÁVEIS</li><li>PAGAMENTO ÚNICO</li><li>7 DIAS DE GARANTIA</li></ul></div><BuyButton>QUERO MEUS DOCUMENTOS</BuyButton></section>
    <section className="kit-section"><div className="kit-intro"><h2>DOCUMENTOS ORGANIZAM<br />O CONSULTÓRIO.<br /><span>E A PARTE CLÍNICA?</span></h2></div><div className="kit-flow"><div><strong>FICHAS</strong><p>Avalie com direção.</p></div><ArrowRight /><div><strong>DOCUMENTOS</strong><p>Organize sua rotina profissional.</p></div><ArrowRight /><div><strong>CÉREBRO DIGITAL</strong><p>Apoie suas decisões clínicas com evidências.</p></div></div><p className="kit-signature">AVALIE <span>→</span> ORGANIZE <span>→</span> DECIDA.</p><div className="kit-offer"><div><s>R$191 SEPARADOS</s><strong>OS 3 POR R$147</strong><small>ECONOMIZE R$44</small></div><BuyButton kit>QUERO O KIT COMPLETO</BuyButton></div></section>
    <section className="faq-section"><div className="faq-heading"><h2>SEM LETRAS<br />MIÚDAS.</h2><p>AS DÚVIDAS ESSENCIAIS, RESPONDIDAS.</p></div><div className="faq-list">{faq.map(([q,a],i)=><details key={q}><summary><span>{String(i+1).padStart(2,"0")}</span>{q}<Plus /></summary><p>{a}</p></details>)}</div></section>
    <footer className="final-cta"><p>SEU CONSULTÓRIO NÃO PRECISA COMEÇAR DO ZERO.</p><h2>COMECE COM OS<br /><mark>DOCUMENTOS PRONTOS.</mark></h2><BuyButton>QUERO MEUS DOCUMENTOS</BuyButton><a href={ENTRAR_URL} target="_blank" rel="noreferrer">JÁ SOU CLIENTE, ENTRAR NA MINHA CONTA</a></footer>
    <StickyBuy />
  </main>;
}
