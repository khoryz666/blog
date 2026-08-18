import { chromium } from 'playwright-core'
import { createServer } from 'node:http'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'

const dist = resolve(process.cwd(), 'dist')
if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html not found, run `npm run build` first')
  process.exit(1)
}

const types = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.txt': 'text/plain',
}

const server = createServer(async (req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0])
  if (p.endsWith('/')) p += 'index.html'
  const file = join(dist, p)
  if (!file.startsWith(dist)) {
    res.writeHead(403)
    return res.end()
  }
  try {
    const data = await readFile(file)
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' })
    res.end(data)
  } catch {
    res.writeHead(404)
    res.end('not found')
  }
})

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${server.address().port}/`

let browser
try {
  browser = await chromium.launch({ headless: true })
} catch (error) {
  console.error('Failed to launch Chromium. Install browsers with: npx playwright install chromium')
  console.error(error.message)
  server.close()
  process.exit(1)
}

const scenarios = [
  { name: 'mobile 375x667', width: 375, height: 667, mobile: true },
  { name: 'mobile 320x568', width: 320, height: 568, mobile: true },
  { name: 'mobile landscape 667x375', width: 667, height: 375, mobile: true },
  { name: 'desktop 1280x800', width: 1280, height: 800, mobile: false },
]

const snapshot = (page) =>
  page.evaluate(() => {
    const menu = document.getElementById('menu')
    const footer = document.querySelector('.menu-footer')
    const mr = menu.getBoundingClientRect()
    const fr = footer.getBoundingClientRect()
    return {
      innerW: window.innerWidth,
      menuTop: mr.top,
      menuBottom: mr.bottom,
      footerTop: fr.top,
      footerBottom: fr.bottom,
      visible: fr.top >= mr.top && fr.bottom <= mr.bottom + 1 && fr.top < mr.bottom,
    }
  })

let failed = 0

for (const scenario of scenarios) {
  const context = await browser.newContext({
    viewport: { width: scenario.width, height: scenario.height },
    screen: { width: scenario.width, height: scenario.height },
    deviceScaleFactor: 2,
    isMobile: scenario.mobile,
    hasTouch: scenario.mobile,
  })
  const page = await context.newPage()
  await page.goto(base, { waitUntil: 'networkidle' })

  if (scenario.mobile) {
    await page.click('#menuLink')
    await page.waitForTimeout(300)
  }

  const problems = []
  const atTop = await snapshot(page)
  if (atTop.innerW !== scenario.width) {
    problems.push(`layout viewport inflated: innerWidth=${atTop.innerW}, expected ${scenario.width}`)
  }
  if (!atTop.visible) {
    problems.push(`footer not visible: top=${atTop.footerTop.toFixed(1)}, bottom=${atTop.footerBottom.toFixed(1)}`)
  }

  if (scenario.mobile) {
    await page.evaluate(() => {
      document.getElementById('menu').scrollTop = 300
    })
    await page.waitForTimeout(200)
    const scrolled = await snapshot(page)
    if (!scrolled.visible) {
      problems.push(`footer not visible while menu scrolled: top=${scrolled.footerTop.toFixed(1)}, bottom=${scrolled.footerBottom.toFixed(1)}`)
    }
  }

  if (problems.length) {
    failed++
    console.error(`FAIL ${scenario.name}`)
    for (const problem of problems) console.error(`  ${problem}`)
  } else {
    console.log(`PASS ${scenario.name}`)
  }

  await context.close()
}

await browser.close()
server.close()
process.exit(failed ? 1 : 0)
