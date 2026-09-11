# OmniWarehouse 3D — Sankhya

Mapeamento tridimensional de zonas, ruas, módulos e níveis de armazenagem com
base conceitual nas estruturas `TGFLOC`, `TGFEST` e `TGFPRO` do Sankhya ERP.

## Conteúdo do pacote

- `dist/OmniWarehouse3D.html`: componente autônomo pronto para teste/importação.
- `src/domain`: regras centrais de posições e ocupação.
- `src/application`: casos de uso de transferência e armazenagem.
- `src/infrastructure`: adaptadores mock e Sankhya.
- `src/presentation`: documentação da interface 3D.
- `docs/ARQUITETURA.md`: decisões e próximos passos.

## Execução

Abra `dist/OmniWarehouse3D.html` em um navegador com acesso à internet. O
protótipo carrega Three.js, Tailwind CSS e Font Awesome por CDN.

## Integração com o Sankhya

O HTML entregue utiliza dados simulados. O adaptador em
`src/infrastructure/sankhya` indica o ponto de substituição pelo acesso real.
Valide nomes de campos e permissões no ambiente do cliente antes de ativar
operações reais.

## Repositório sugerido

`omniwarehouse-3d-sankhya`
