// Fills `coverUrl` and `screenshots` in src/data/games.json with image URLs
// from Bulbapedia (public wiki, Creative Commons). Run: node scripts/scrape-covers.js
// No images are stored locally — only the remote URLs are saved.
import axios from 'axios'
import * as cheerio from 'cheerio'
import { readFile, writeFile } from 'fs/promises'

const DATA_PATH = new URL('../src/data/games.json', import.meta.url)
const DELAY_MS = 1200 // polite rate limit between requests
const MAX_SHOTS = 4

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const abs = (src) => (src.startsWith('http') ? src : `https:${src}`)

// Bulbapedia thumb URLs look like .../250px-Name.png — pull that width out.
function thumbWidth(src) {
  const m = src.match(/\/(\d+)px-/)
  return m ? Number(m[1]) : 0
}

async function fetchArticle(title) {
  const query = title.replace(/^Mystery Dungeon: /, 'Pokémon Mystery Dungeon ')
  const url =
    'https://bulbapedia.bulbagarden.net/w/index.php?search=' +
    encodeURIComponent(query)
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': 'PokeVault/1.0 (personal library)' },
    timeout: 15000,
  })
  return cheerio.load(data)
}

function getCover($) {
  const img = $('.infobox img').first().attr('src')
  return img ? abs(img) : null
}

// Grab a few sizeable content images, skipping the box-art and tiny sprites/icons.
function getScreenshots($, coverUrl) {
  const shots = []
  $('.mw-parser-output img').each((_, el) => {
    if (shots.length >= MAX_SHOTS) return
    const src = $(el).attr('src')
    if (!src) return
    const full = abs(src)
    if (full === coverUrl) return
    if (thumbWidth(full) < 200) return // filters icons, sprites, badges
    if (!shots.includes(full)) shots.push(full)
  })
  return shots
}

async function main() {
  const games = JSON.parse(await readFile(DATA_PATH, 'utf8'))
  let covers = 0
  let withShots = 0

  for (const game of games) {
    try {
      const $ = await fetchArticle(game.title)
      const cover = getCover($)
      if (cover) {
        game.coverUrl = cover
        covers++
      }
      const shots = getScreenshots($, cover)
      if (shots.length > 0) {
        game.screenshots = shots
        withShots++
      }
      console.log(
        `${cover ? '✓' : '·'} ${game.title} — ${shots.length} imagem(ns)`,
      )
    } catch (err) {
      console.log(`✗ ${game.title} — ${err.message}`)
    }
    await sleep(DELAY_MS)
  }

  await writeFile(DATA_PATH, JSON.stringify(games, null, 2) + '\n')
  console.log(
    `\n${covers}/${games.length} capas · ${withShots}/${games.length} com imagens`,
  )
}

main()
