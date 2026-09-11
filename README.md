# OmniWarehouse 3D

Componente visual para exploração tridimensional de armazéns e endereços de
estoque. O projeto representa zonas, ruas, módulos e níveis em uma cena 3D,
permitindo localizar posições, visualizar ocupação e iniciar operações de
transferência ou armazenagem.

A solução foi desenhada para funcionar como um componente HTML5/BI dentro do
ecossistema Sankhya ERP, mas o protótipo também pode ser aberto diretamente em
um navegador para demonstração e validação visual.

## Objetivo

O objetivo do OmniWarehouse 3D é transformar uma estrutura hierárquica de
endereços de estoque em uma visão operacional fácil de interpretar. Em vez de
consultar somente códigos e tabelas, o usuário consegue:

- visualizar o armazém em perspectiva 3D;
- navegar pela hierarquia de armazém, zona, rua, módulo e nível;
- identificar posições livres, parcialmente ocupadas e cheias por cores;
- localizar zonas ou endereços pelo campo de busca;
- selecionar uma rua, módulo ou nível e aproximar a câmera automaticamente;
- consultar produto, quantidade, ocupação e necessidade de ressuprimento;
- transferir uma quantidade para um endereço livre no modo demonstrativo;
- criar uma tarefa de armazenagem pendente no modo demonstrativo;
- alternar entre a visão preenchida e a visualização estrutural em wireframe.

## Estado atual

Este repositório contém um protótipo funcional de visualização e regras de
negócio locais. A interface inicia com dados gerados aleatoriamente para
demonstração; portanto, os valores exibidos não representam um estoque real.

As operações feitas na tela também ficam somente em memória do navegador. Elas
não gravam movimentações no Sankhya, não atualizam `TGFEST` e não persistem
tarefas após recarregar a página.

O adaptador `src/infrastructure/sankhya/sankhya-warehouse-repository.js` já
define o ponto de entrada para consulta via `JX.consultar`, mas a orquestração
completa de dados, autenticação, validação de permissões e gravação de
operações ainda precisa ser implementada no ambiente do cliente.

## Demonstração

Abra o arquivo abaixo em um navegador moderno:

```text
dist/OmniWarehouse3D.html
```

Também é possível servir a pasta com um servidor HTTP simples. Isso evita
restrições de alguns navegadores ao abrir arquivos `file://` diretamente:

```powershell
python -m http.server 8080
```

Depois acesse `http://localhost:8080/dist/OmniWarehouse3D.html`.

O navegador precisa de acesso à internet porque a página carrega as bibliotecas
visuais por CDN.

## Tecnologias utilizadas

### Interface e visualização

- **HTML5**: entrega do componente autônomo.
- **CSS**: layout, painel translúcido, estados visuais e responsividade básica.
- **Tailwind CSS via CDN**: classes utilitárias usadas na interface.
- **Three.js 0.128.0**: cena 3D, câmera, iluminação, materiais, estantes,
	caixas, áreas de chão e renderização WebGL.
- **OrbitControls**: rotação, zoom e navegação da câmera.
- **Tween.js 18.6.4**: animações de câmera e transições de foco.
- **Font Awesome 6.4.0**: ícones dos controles e estados da interface.
- **Google Fonts / Inter**: tipografia da interface.

### Código e validação

- **JavaScript moderno**: regras de domínio, casos de uso, geração da cena e
	interação da interface.
- **Node.js**: execução do script de validação.
- **ES Modules**: usado no script `scripts/validate.mjs`.
- **Git/GitHub**: versionamento e publicação do projeto.

Não há dependências npm de runtime neste momento. As bibliotecas do componente
visual são carregadas por CDN dentro do HTML distribuído.

## Arquitetura

O projeto utiliza uma adaptação pragmática da Clean Architecture:

```text
presentation -> application -> domain
			 |             |
			 +------ infrastructure
```

### `domain`

Contém regras independentes da interface e do Sankhya:

- estados `LIVRE`, `PARCIAL` e `CHEIO`;
- normalização de percentual de ocupação entre 0 e 100;
- normalização de quantidade para inteiro não negativo;
- remoção do produto quando o endereço fica livre.

Arquivo principal: `src/domain/location-domain.js`.

### `application`

Contém os casos de uso operacionais:

- validação de origem, destino e quantidade;
- transferência de produto entre posições;
- atualização da quantidade e ocupação estimada;
- criação de tarefas de armazenagem com origem, destino, produto e status.

Arquivo principal: `src/application/warehouse-operations.js`.

### `infrastructure`

Fornece implementações de acesso a dados:

- `mock/mock-warehouse-repository.js`: catálogo pequeno de produtos para
	demonstração;
- `sankhya/sankhya-warehouse-repository.js`: consulta de locais por empresa
	usando o runtime `JX` do Sankhya.

### `presentation`

Documenta a camada visual consolidada no HTML final. O componente contém a
cena Three.js, a árvore de navegação, o painel de detalhes, a busca e os
modais de operação.

### `dist`

Contém o artefato distribuível:

- `dist/OmniWarehouse3D.html`: arquivo único pronto para teste ou importação
	como componente HTML5/BI, sem etapa de build.

## Modelo de localização

As posições seguem uma hierarquia compatível com locais analíticos e
não analíticos do Sankhya:

```text
Armazém Principal
└── Zona: 1001000
		└── Rua: 1001000.01
				└── Módulo: 1001000.01.01
						└── Nível: 1001000.01.01.01
```

No protótipo:

- zonas, ruas e módulos são nós de agrupamento (`ANALITICO = N`);
- níveis são posições analíticas (`ANALITICO = S`);
- cada nível possui código, descrição, status, ocupação, produto, quantidade
	e coordenadas 3D;
- áreas como docas, inventário e divergência são representadas como zonas de
	chão, sem estantes altas.

As zonas demonstrativas estão configuradas em `CONFIG.zones` dentro do HTML
final. Essa configuração define código, descrição, tipo, quantidade de ruas,
módulos, níveis e posição física no mapa.

## Fluxo da aplicação

1. A página cria a cena, câmera, iluminação, chão e controles de navegação.
2. `generateData()` cria a árvore de locais e gera ocupações simuladas.
3. `build3D()` converte os dados em estantes, posições, caixas e marcadores.
4. `buildTreeUI()` monta a árvore lateral com os códigos de localização.
5. O usuário seleciona um elemento na cena ou na árvore.
6. O painel de detalhes mostra o estado da posição selecionada.
7. A camada de aplicação valida transferências ou tarefas de armazenagem.
8. A camada de domínio normaliza os dados e a cena é atualizada em memória.

## Integração com Sankhya

O modelo foi preparado para trabalhar com estruturas conceituais do Sankhya:

| Estrutura | Uso previsto |
| --- | --- |
| `TGFLOC` | Hierarquia, código, descrição e indicador de local analítico |
| `TGFEST` | Estoque, empresa, produto e quantidade por local |
| `TGFPRO` | Cadastro e descrição dos produtos |
| `JX` | Execução de consultas no runtime do Sankhya |

O adaptador atual consulta locais da empresa configurada:

```sql
SELECT LOC.CODLOCAL,
			 LOC.DESCRLOCAL,
			 LOC.ANALITICO
	FROM TGFLOC LOC
 WHERE LOC.CODEMP = :companyCode
 ORDER BY LOC.CODLOCAL
```

Para uma integração produtiva, os próximos passos são:

1. consultar e montar a hierarquia real de `TGFLOC`;
2. combinar os locais analíticos com estoque de `TGFEST` e produtos de `TGFPRO`;
3. obter `CODEMP` do contexto autenticado, sem confiar em valor fixo no cliente;
4. validar empresa, produto, origem, destino, lote e quantidade no servidor;
5. executar movimentações por ação de negócio, API ou procedimento homologado;
6. persistir tarefas de armazenagem e retornar o resultado para a interface;
7. tratar autorização, concorrência, auditoria, erros de rede e indisponibilidade
	 do runtime `JX`.

O navegador não deve atualizar estoque diretamente. A gravação deve passar por
uma operação autorizada no backend ou no próprio mecanismo de negócio do ERP.

## Configuração

O arquivo `src/config/warehouse.config.js` concentra a configuração inicial:

```js
{
	companyCode: 1,
	dataSource: "mock",
	locationTable: "TGFLOC",
	stockTable: "TGFEST",
	productTable: "TGFPRO"
}
```

No artefato atual, a interface usa dados mock consolidados diretamente no HTML.
Alterar o arquivo de configuração, sozinho, não troca a fonte da página
distribuída; a próxima etapa de integração deve conectar essa configuração ao
carregamento real de dados.

## Validação

Execute na raiz do projeto:

```powershell
npm run validate
```

O comando verifica:

- existência e validade estrutural do HTML principal;
- presença das camadas de domínio e aplicação no artefato consolidado;
- sintaxe dos scripts inline;
- existência das pastas esperadas em `src`.

Saída esperada:

```text
OmniWarehouse 3D validado: 2 scripts inline e estrutura completa.
```

## Estrutura do repositório

```text
OmniWarehouse_3D/
├── assets/css/                     # Recursos visuais complementares
├── dist/
│   └── OmniWarehouse3D.html        # Componente autônomo distribuível
├── docs/
│   └── ARQUITETURA.md              # Decisões e evolução arquitetural
├── scripts/
│   └── validate.mjs                # Validação estrutural e de sintaxe
├── src/
│   ├── application/
│   │   └── warehouse-operations.js
│   ├── config/
│   │   └── warehouse.config.js
│   ├── domain/
│   │   └── location-domain.js
│   ├── infrastructure/
│   │   ├── mock/mock-warehouse-repository.js
│   │   └── sankhya/sankhya-warehouse-repository.js
│   └── presentation/
│       └── README.md
├── .gitignore
├── package.json
└── README.md
```

## Limitações conhecidas

- os dados de ocupação são aleatórios e mudam a cada carregamento;
- transferências não são persistidas;
- tarefas criadas não possuem tela de acompanhamento;
- não há autenticação ou autorização própria no componente;
- não há testes automatizados de comportamento ou integração com ERP;
- o componente depende de CDNs externos para carregar a interface;
- o artefato distribuído ainda precisa de um adaptador de dados real para
	refletir o estoque do cliente.

## Próximas melhorias recomendadas

- adicionar testes unitários para domínio e aplicação;
- separar carregamento, transformação e renderização dos dados reais;
- criar estados de carregamento, vazio, erro e reconexão;
- incluir filtros por empresa, zona, produto e status;
- adicionar indicadores de ocupação agregada por zona e rua;
- persistir e acompanhar tarefas de armazenagem;
- substituir consultas interpoladas por mecanismo parametrizado do runtime;
- empacotar bibliotecas locais ou fixar integridade dos recursos CDN;
- criar uma pipeline de validação para alterações no HTML distribuído.

## Licença

O `package.json` declara o projeto como `UNLICENSED`. O uso, redistribuição e
integração devem seguir a política do proprietário do repositório e as regras
do ambiente Sankhya em que o componente for instalado.
