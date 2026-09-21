# Documentos Profissionais BR Recovery — Contexto Operacional

## Regra de ouro

Este arquivo é a fonte de verdade operacional atual.
Toda IA deve lê-lo antes de trabalhar.
Conversas antigas podem estar desatualizadas.
Atualizar somente após mudanças realmente executadas.

## Produto

Documentos Profissionais para fisioterapeutas.

Documentos atuais:

1. Contrato de Prestação de Serviços
2. Contrato de Telerreabilitação
3. TCLE
4. Autorização de Uso de Imagem, Voz e Depoimento
5. Controle de Presença
6. Controle de Dados Vitais
7. Declaração de Comparecimento
8. Encaminhamento Fisioterapêutico
9. Relatório de Alta Fisioterapêutica
10. Solicitação de Exame Complementar
11. Consentimento para Dry Needling
12. Notificação de Interrupção do Acompanhamento

Características:

- documentos editáveis
- campos automáticos inseridos no corpo do documento
- produto vendido separadamente
- também integra o Kit Consultório Ortopédico

## Produção

- domínio oficial: documentos.brrecovery.com.br
- GitHub oficial: biaroddrigues/DocumentosBR
- branch atual confirmada na auditoria: `main`
- arquitetura de deploy encontrada: aplicação React + Vite gerada em `dist`, publicada como assets estáticos via Wrangler/Cloudflare
- o domínio oficial foi informado operacionalmente e não está declarado no arquivo local `wrangler.jsonc`
- não assumir projeto/Worker alternativo como produção sem confirmação

## Integração de acesso

- acesso é controlado por entitlement de produto
- compra de Documentos libera documentos
- Kit libera fichas + documentos
- IA não faz parte dessa liberação automática e continua separada/manual
- não alterar regras de entitlement sem solicitação explícita
- nunca registrar tokens, `service_role` ou webhook secrets

## Estado atual

- landing atual já foi revisada/aprovada
- demonstração prática e prints reais são importantes para explicar o produto
- não redesenhar sem solicitação explícita
- produto continua disponível isoladamente e dentro do Kit

## Direção visual

- preservar identidade BR Recovery atual
- visual premium/editorial
- assets e screenshots reais
- evitar “cara de IA”
- evitar excesso de texto/cards
- não alterar design aprovado sem pedido

## Segurança

- nunca expor secrets
- não fazer deploy sem autorização
- preservar rollback
- alterações mínimas/cirúrgicas
- verificar produção antes de afirmar que algo está publicado

## Não mexer sem solicitação explícita

- documentos existentes
- lógica de preenchimento
- entitlement/acesso
- checkout
- domínio
- landing aprovada
- integrações com Fichas/Kit

## Pendências

Somente pendências comprovadas.
Não inventar melhorias.

## Protocolo de handoff

Após trabalhos, registrar:

- data
- executado
- produção alterada? sim/não
- arquivos alterados
- validações
- próximo passo
- rollback quando aplicável
- status: PLANEJADO / IMPLEMENTADO NÃO TESTADO / TESTADO / PRODUÇÃO VALIDADA

### 2026-09-21 — atualização comercial para 12 documentos

- executado: atualização da landing de 6 para 12 documentos no hero, transição editorial, oferta e meta description; inclusão dos seis documentos adicionais no catálogo visual em composição tipográfica, preservando os seis screenshots reais existentes
- produção alterada? não
- arquivos alterados: `index.html`, `src/DocumentosLandingPage.jsx`, `src/index.css` e `AI_CONTEXT.md`
- validações: build de produção em diretório temporário; revisão visual em desktop largo e mobile; 12 itens renderizados; seis imagens reais carregadas; sem overflow horizontal; console sem erros ou avisos
- assets ausentes: não existem neste repositório screenshots reais de Declaração de Comparecimento, Encaminhamento Fisioterapêutico, Relatório de Alta Fisioterapêutica, Solicitação de Exame Complementar, Consentimento para Dry Needling e Notificação de Interrupção do Acompanhamento
- próximo passo: revisão e commit seletivo, se aprovado
- rollback: reverter somente os quatro arquivos desta atualização; nenhum estado remoto precisa ser revertido
- status: TESTADO

### 2026-09-15 — Contexto compartilhado

- executado: criação da base de contexto compartilhado para ChatGPT, Codex e Claude
- produção alterada? não
- arquivos alterados: `AI_CONTEXT.md`, `AGENTS.md`, `CLAUDE.md`
- validações: conteúdo revisado e estado do Git verificado
- próximo passo: nenhum
- rollback: remover os três arquivos criados nesta alteração
- status: TESTADO
