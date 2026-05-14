// Fills `coverUrl` and `screenshots` in src/data/games.json using the IGDB API
// (real box art + gameplay screenshots). No images are stored locally — only URLs.
//
// Needs Twitch credentials in .env: TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET.
// Run: npm run scrape-covers   (loads .env via node --env-file)
import axios from 'axios'
import { readFile, writeFile } from 'fs/promises'

const DATA_PATH = new URL('../src/data/games.json', import.meta.url)
const HACKS_PATH = new URL('../src/data/hacks.json', import.meta.url)
const DELAY_MS = 300 // IGDB allows 4 req/s — stay polite
const MAX_SHOTS = 6

const CLIENT_ID = process.env.TWITCH_CLIENT_ID
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const img = (id, size) =>
  `https://images.igdb.com/igdb/image/upload/t_${size}/${id}.jpg`

// games.json uses combined titles ("Red & Blue"); IGDB indexes them separately.
function searchTerm(title) {
  let t = title.split(' & ')[0]
  t = t.replace(/^Mystery Dungeon:/, 'Pokémon Mystery Dungeon')
  // Gen 5 sequels are indexed as "Pokémon Black Version 2" on IGDB
  t = t.replace(/ (\d+)$/, ' Version $1')
  return t.trim()
}

const norm = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

// IGDB `search` ranks fan hacks high; pick the closest official title.
// category 5 = mod/ROM hack — always drop those. Mainline games are indexed
// as "Pokémon X Version", so an exact "<term> version" match counts as exact.
function pickBest(results, term) {
  const t = norm(term)
  const scored = results
    .filter((g) => g.category !== 5)
    .map((g) => {
      const n = norm(g.name)
      let score = 0
      if (n === t || n === `${t} version`) score = 4
      else if (n.startsWith(t)) score = 2
      else if (n.includes(t)) score = 1
      if (g.category === 0) score += 1 // main_game over remakes/ports/bundles
      if (g.screenshots?.length) score += 0.5
      return { g, score }
    })
    .sort((a, b) => b.score - a.score)
  return scored[0]?.g ?? results[0] ?? null
}

async function getToken() {
  const { data } = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials',
    },
  })
  return data.access_token
}

async function queryIGDB(token, term) {
  const body = `search "${term.replace(/"/g, '')}"; fields name, category, cover.image_id, screenshots.image_id, artworks.image_id; limit 20;`
  const { data } = await axios.post('https://api.igdb.com/v4/games', body, {
    headers: {
      'Client-ID': CLIENT_ID,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    timeout: 15000,
  })
  return pickBest(data, term)
}

async function main() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('Faltam TWITCH_CLIENT_ID / TWITCH_CLIENT_SECRET no .env')
    process.exit(1)
  }

  const token = await getToken()
  const games = JSON.parse(await readFile(DATA_PATH, 'utf8'))
  let covers = 0
  let withShots = 0

  for (const game of games) {
    try {
      const hit = await queryIGDB(token, searchTerm(game.title))
      if (!hit) {
        console.log(`· ${game.title} — não encontrado na IGDB`)
        await sleep(DELAY_MS)
        continue
      }

      if (hit.cover?.image_id) {
        game.coverUrl = img(hit.cover.image_id, 'cover_big')
        covers++
      }

      const shotIds = (hit.screenshots ?? []).map((s) => s.image_id)
      const artIds = (hit.artworks ?? []).map((a) => a.image_id)
      const ids = [...shotIds, ...artIds].slice(0, MAX_SHOTS)
      if (ids.length > 0) {
        game.screenshots = ids.map((id) => img(id, 'screenshot_huge'))
        withShots++
      }

      console.log(
        `✓ ${game.title} — ${hit.name} (${ids.length} imagem(ns))`,
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

  await linkHackImages(games)
}

// ROM hacks run on the base game's engine — same visuals — so they reuse the
// base game's cover and screenshots instead of needing their own.
async function linkHackImages(games) {
  const hacks = JSON.parse(await readFile(HACKS_PATH, 'utf8'))
  let linked = 0

  for (const hack of hacks) {
    const base =
      games.find((g) => g.title === hack.baseGame) ??
      games.find((g) => g.title.startsWith(hack.baseGame)) ??
      games.find((g) => g.title.includes(hack.baseGame))

    if (!base) {
      console.log(`· ${hack.title} — jogo base "${hack.baseGame}" não encontrado`)
      continue
    }
    hack.coverUrl = base.coverUrl
    hack.screenshots = base.screenshots ?? []
    linked++
    console.log(`✓ ${hack.title} — imagens de ${base.title}`)
  }

  await writeFile(HACKS_PATH, JSON.stringify(hacks, null, 2) + '\n')
  console.log(`${linked}/${hacks.length} hacks vinculados ao jogo base`)
}

main()
