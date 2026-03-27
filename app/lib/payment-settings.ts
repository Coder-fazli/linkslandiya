import { getDb } from "./db"

export type PaymentMethod = {
  id: string
  label: string
  address: string
}

export type PaymentSettings = {
  bonusPercent: number
  bonusMethod: string
  minimumTopUp: number
  note: string
  methods: PaymentMethod[]
}

const DEFAULT: PaymentSettings = {
  bonusPercent: 3,
  bonusMethod: "Bank Wire Transfer",
  minimumTopUp: 25,
  note: "Once you make a payment, please send us a link to that transaction in the network where you sent it. It can take 1–2 business days to add funds to your account. IMPORTANT: your funds will be LOST if you send them using a wrong network, so please double check everything before making a payment.",
  methods: [
    { id: "usdt_trc20", label: "USDT (Tether) via Tron Network (TRC20)", address: "" },
    { id: "eth_multi", label: "ETH, USDT, USDC via Ethereum, BSC, Base, Arbitrum", address: "" },
    { id: "btc", label: "Bitcoin (BTC) via Bitcoin Network", address: "" },
  ],
}

export async function getPaymentSettings(): Promise<PaymentSettings> {
  const db = await getDb()
  const doc = await db.collection("settings").findOne({ _id: "payment" as any })
  if (!doc) return DEFAULT
  const { _id, ...rest } = doc
  return rest as PaymentSettings
}

export async function updatePaymentSettings(data: PaymentSettings) {
  const db = await getDb()
  await db.collection("settings").updateOne(
    { _id: "payment" as any },
    { $set: data },
    { upsert: true }
  )
}
