import { writeFile, mkdir, unlink } from "fs/promises"
import path from "path"
import sharp from "sharp"
import { chromium } from "playwright"
import { getDb } from "./db"
import { ObjectId } from "mongodb"

const SCREENSHOTS_DIR = path.join(process.cwd(), "public", "uploads", "website-screenshots")
const CAPTURE_TIMEOUT_MS = 25_000
// Viewport size — captures the hero/fold, not the whole page (matches what
// buyers actually want to see in a preview, and keeps file size small)
const VIEWPORT = { width: 1280, height: 800 }
// A normal browser UA — some donor sites block anything that looks
// obviously automated (default Playwright UA advertises "HeadlessChrome")
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

// Simple in-process queue: only one Chromium capture runs at a time, so a
// burst of website approvals can never spike VPS memory/CPU all at once.
type Job = { websiteId: string; url: string }
const queue: Job[] = []
let running = false

export function enqueueScreenshotCapture(websiteId: string, url: string) {
    queue.push({ websiteId, url })
    if (!running) void processQueue()
}

async function processQueue() {
    running = true
    while (queue.length > 0) {
        const job = queue.shift()!
        await captureOne(job).catch(async err => {
            const message = describeError(err)
            console.error(`Screenshot capture failed for ${job.url}:`, err)
            await setFailed(job.websiteId, message).catch(() => {})
        })
    }
    running = false
}

// Turn common Playwright failures into a message that's actually useful when
// read from the admin UI, instead of a raw stack trace
function describeError(err: unknown): string {
    const raw = err instanceof Error ? err.message : String(err)
    if (raw.includes("Executable doesn't exist")) {
        return "Chromium isn't installed on the server. Run: npx playwright install --with-deps chromium"
    }
    if (raw.includes("Timeout") && raw.includes("exceeded")) {
        return "The website took too long to load (timed out)."
    }
    if (raw.includes("net::ERR_NAME_NOT_RESOLVED")) {
        return "The website's domain could not be resolved — check the URL is correct."
    }
    if (raw.includes("net::ERR_CONNECTION_REFUSED") || raw.includes("net::ERR_CONNECTION_TIMED_OUT")) {
        return "Could not connect to the website — it may be down or blocking automated requests."
    }
    if (raw.includes("net::ERR_CERT") || raw.includes("SSL")) {
        return "The website has an invalid SSL certificate."
    }
    return raw.split("\n")[0].slice(0, 200)
}

async function setStatus(websiteId: string, status: "pending" | "ready") {
    const db = await getDb()
    await db.collection("websites").updateOne(
        { _id: new ObjectId(websiteId) },
        { $set: { screenshotStatus: status }, $unset: { screenshotError: "" } }
    )
}

async function setFailed(websiteId: string, message: string) {
    const db = await getDb()
    await db.collection("websites").updateOne(
        { _id: new ObjectId(websiteId) },
        { $set: { screenshotStatus: "failed", screenshotError: message } }
    )
}

async function removeOldScreenshot(url?: string) {
    if (!url?.startsWith("/uploads/website-screenshots/")) return
    try {
        await unlink(path.join(process.cwd(), "public", url))
    } catch {
        // already gone
    }
}

async function captureOne({ websiteId, url }: Job) {
    await setStatus(websiteId, "pending")

    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`
    let buffer: Buffer

    const browser = await chromium.launch({ headless: true })
    try {
        const page = await browser.newPage({
            viewport: VIEWPORT,
            userAgent: USER_AGENT,
            ignoreHTTPSErrors: true,
        })
        // domcontentloaded, not load — many sites never fire "load" promptly
        // because of trackers/ads that keep the network busy indefinitely
        await page.goto(normalizedUrl, { waitUntil: "domcontentloaded", timeout: CAPTURE_TIMEOUT_MS })
        // Brief settle time for hero animations/lazy-loaded images
        await page.waitForTimeout(1500)
        const raw = await page.screenshot({ type: "png" })
        buffer = Buffer.from(
            await sharp(raw).resize(VIEWPORT.width, VIEWPORT.height, { fit: "cover" }).webp({ quality: 80 }).toBuffer()
        )
    } finally {
        await browser.close()
    }

    const db = await getDb()
    const website = await db.collection("websites").findOne({ _id: new ObjectId(websiteId) })

    const filename = `${websiteId}_${Date.now()}.webp`
    await mkdir(SCREENSHOTS_DIR, { recursive: true })
    await writeFile(path.join(SCREENSHOTS_DIR, filename), buffer)

    await db.collection("websites").updateOne(
        { _id: new ObjectId(websiteId) },
        { $set: {
            screenshotUrl: `/uploads/website-screenshots/${filename}`,
            screenshotStatus: "ready",
            screenshotUpdatedAt: new Date().toISOString(),
        }, $unset: { screenshotError: "" } }
    )

    await removeOldScreenshot(website?.screenshotUrl)
}
