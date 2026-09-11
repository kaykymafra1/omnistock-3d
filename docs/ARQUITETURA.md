# Arquitetura do OmniWarehouse 3D

O projeto usa uma adaptação pragmática da Clean Architecture para componentes
HTML executados dentro do Sankhya.

## Dependências

`presentation → application → domain`

`infrastructure` implementa o acesso a dados utilizado pela aplicação. O domínio
não conhece Three.js, HTML, banco de dados ou serviços do Sankhya.

## Camadas

- **domain**: cálculo de status e invariantes de uma posição de estoque.
- **application**: transferência de produto e criação de tarefa de armazenagem.
- **infrastructure/mock**: dados simulados para desenvolvimento e demonstração.
- **infrastructure/sankhya**: consultas e integrações com o runtime Sankhya/JX.
- **presentation**: Three.js, árvore TGFLOC, painel lateral e modais.
- **dist**: HTML autônomo pronto para importação no ERP.

## Evolução recomendada

1. Substituir os dados simulados por consultas à TGFLOC/TGFEST/TGFPRO.
2. Passar `CODEMP` pelo contexto autenticado ou parâmetro do componente.
3. Executar transferências reais por ação de negócio, procedure ou API validada.
4. Não executar alterações de estoque diretamente pelo navegador.
