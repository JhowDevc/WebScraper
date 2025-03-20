const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteerCore = require('puppeteer-core');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

puppeteer.use(StealthPlugin());

// Função para encontrar o caminho do Chrome
function findChromeExecutable() {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Padrão 64-bit
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', // Padrão 32-bit
    'C:\\Users\\All Users\\Google\\Chrome\\Application\\chrome.exe', // Alternativa
    path.join(process.env.LOCALAPPDATA, 'Google\\Chrome\\Application\\chrome.exe'), // Instalação por usuário
  ];

  for (const chromePath of possiblePaths) {
    if (fs.existsSync(chromePath)) {
      return chromePath;
    }
  }

  return null; // Retorna null se o Chrome não for encontrado
}

// Função para contar palavras no texto visível
function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

async function scrapeWebsite(url) {
  let browser;
  try {
    const chromePath = findChromeExecutable();
    if (!chromePath) {
      throw new Error('Google Chrome não encontrado. Por favor, instale o Google Chrome para usar este aplicativo.');
    }

    const launchOptions = {
      headless: true,
      executablePath: chromePath, // Usa o caminho dinâmico do Chrome
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      ],
    };

    browser = await puppeteerCore.launch(launchOptions);
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    await page.goto(url, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    const html = await page.content();
    const $ = cheerio.load(html);

    // Dados existentes
    const pageTitle = $('title').text().trim() || 'Não encontrado';
    const metaDescription = $('meta[name="description"]').attr('content') || 'Não encontrado';
    const altTextsWithLinks = $('img')
      .map((i, el) => ({
        alt: $(el).attr('alt') || 'Sem texto alt',
        src: $(el).attr('src') || 'Sem link'
      }))
      .get();
    const headings = $('h1, h2, h3, h4, h5, h6')
      .map((i, el) => ({
        tag: el.tagName.toLowerCase(),
        text: $(el).text().trim() || 'Sem texto'
      }))
      .get();

    // Novos dados sugeridos
    const canonical = $('link[rel="canonical"]').attr('href') || 'Não encontrado';
    const robots = $('meta[name="robots"]').attr('content') || 'Não especificado';
    const internalLinks = $('a[href*="' + new URL(url).hostname + '"]')
      .map((i, el) => ({
        text: $(el).text().trim(),
        href: $(el).attr('href')
      }))
      .get();
    const externalLinks = $('a[href^="http"]:not([href*="' + new URL(url).hostname + '"])')
      .map((i, el) => ({
        text: $(el).text().trim(),
        href: $(el).attr('href')
      }))
      .get();
    const schemaData = $('script[type="application/ld+json"]').html() || 'Nenhum dado estruturado encontrado';

    // Contagem de palavras no conteúdo visível
    const visibleText = $('body')
      .clone() // Clona o body para evitar modificações no original
      .find('script, style, noscript, header, footer, nav, aside') // Remove elementos não visíveis ou menos relevantes
      .remove()
      .end()
      .text()
      .trim();
    const wordCount = countWords(visibleText);

    return {
      pageTitle,
      metaDescription,
      altTextsWithLinks: altTextsWithLinks.length > 0 ? altTextsWithLinks : [{ alt: 'Nenhuma imagem encontrada', src: 'N/A' }],
      headings: headings.length > 0 ? headings : [{ tag: 'N/A', text: 'Nenhum título encontrado' }],
      canonical,
      robots,
      internalLinks: internalLinks.length > 0 ? internalLinks : [{ text: 'Nenhum link interno encontrado', href: 'N/A' }],
      externalLinks: externalLinks.length > 0 ? externalLinks : [{ text: 'Nenhum link externo encontrado', href: 'N/A' }],
      schemaData,
      wordCount
    };
  } catch (error) {
    console.error('Erro ao raspar o site:', error.message);
    return {
      pageTitle: 'Erro',
      metaDescription: error.message,
      altTextsWithLinks: [{ alt: 'Erro', src: 'Erro' }],
      headings: [{ tag: 'Erro', text: 'Erro' }],
      canonical: 'Erro',
      robots: 'Erro',
      internalLinks: [{ text: 'Erro', href: 'Erro' }],
      externalLinks: [{ text: 'Erro', href: 'Erro' }],
      schemaData: 'Erro',
      wordCount: 0
    };
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { scrapeWebsite };