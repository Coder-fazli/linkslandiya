export const CAMPAIGN_AUDIENCES = [
    { value: "all", label: "All Users", desc: "Everyone with an account" },
    { value: "buyer", label: "Buyers", desc: "Buying only, not publishing" },
    { value: "publisher", label: "Publishers", desc: "Publishing only, not buying" },
    { value: "both", label: "Buyer + Publisher", desc: "Does both" },
    { value: "admin", label: "Admins", desc: "Admin accounts" },
    { value: "specific", label: "Specific User", desc: "Search and pick one person" },
    { value: "manual", label: "Manual Email List", desc: "Paste any email addresses" },
] as const
export type CampaignAudience = (typeof CAMPAIGN_AUDIENCES)[number]["value"]
