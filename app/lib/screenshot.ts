import { writeFile, mkdir, unlink } from "fs/promises"
import path from "path"
import sharp from "sharp"
import { chromium } from "playwright"
import { getDb } from "./db"
import { ObjectId } from "mongodb"

const SCREENSHOTS_DIR = path.join(process.cwd(), "public", "uploads", "website-screenshots")
const CAPTURE_TIMEOUT_MS = 20_000
// Viewport size — captures the hero/fold, not the whole page (matches what
// buyers actually want to see in a preview, and keeps file size small)
const VIEWPORT = { width: 1280, height: 800 }

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
            console.error(`Screenshot capture failed for ${job.url}:`, err)
            await setStatus(job.websiteId, "failed").catch(() => {})
        })
    }
    running = false
}

async function setStatus(websiteId: string, status: "pending" | "ready" | "failed") {
    const db = await getDb()
    await db.collection("websites").updateOne(
        { _id: new ObjectId(websiteId) },
        { $set: { screenshotStatus: status } }
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
        const page = await browser.newPage({ viewport: VIEWPORT })
        await page.goto(normalizedUrl, { waitUntil: "load", timeout: CAPTURE_TIMEOUT_MS })
        // Brief settle time for hero animations/lazy-loaded images
        await page.waitForTimeout(1200)
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
        } }
    )

    await removeOldScreenshot(website?.screenshotUrl)
}
