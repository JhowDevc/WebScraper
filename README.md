# Web Scraper para Análise de SEO

Este é um **Web Scraper** desenvolvido em Node.js que extrai informações de páginas web para análise de SEO. Ele coleta dados como título da página, meta descrição, textos alternativos de imagens, títulos (headings), links internos e externos, dados estruturados (schema), URL canônica, meta robots e contagem de palavras no conteúdo visível. A ferramenta inclui um frontend simples em HTML/CSS/JavaScript para interação com o usuário e pode ser compilada em um executável (`.exe`) para uso em sistemas Windows.

## Funcionalidades
- **Título da Página**: Extrai o `<title>` da página.
- **Meta Descrição**: Coleta o conteúdo da tag `<meta name="description">`.
- **Contagem de Palavras**: Calcula o número de palavras no conteúdo visível da página.
- **Imagens**: Lista textos alternativos (`alt`) e URLs (`src`) de todas as imagens.
- **Títulos (Headings)**: Extrai todos os `<h1>` a `<h6>` com seus textos.
- **Links Internos e Externos**: Separa links com seus textos âncora.
- **URL Canônica**: Verifica a tag `<link rel="canonical">`.
- **Meta Robots**: Coleta instruções de indexação da tag `<meta name="robots">`.
- **Dados Estruturados**: Exibe o conteúdo de `<script type="application/ld+json">`.
- **Interface Web**: Um frontend simples para inserir URLs e visualizar resultados.

## Tecnologias Utilizadas
- **Node.js**: Backend da aplicação.
- **Puppeteer-core**: Navegação e scraping de páginas web.
- **Cheerio**: Parsing de HTML para extração de dados.
- **Express**: Servidor HTTP para comunicação com o frontend.
- **HTML/CSS/JavaScript**: Interface de usuário.

## Pré-requisitos
- **Node.js** (versão 18 ou superior recomendada): [Download](https://nodejs.org/)
- **Google Chrome**: Necessário para o `puppeteer-core` funcionar.
- **npm**: Gerenciador de pacotes do Node.js (incluso com o Node.js).

## Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/web-scraper.git
   cd web-scraper
