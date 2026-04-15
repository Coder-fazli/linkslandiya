export const BLOCKED_DOMAINS = new Set([
    // Mailinator family
    "mailinator.com", "mailinater.com", "mailinator2.com", "mailinator.net",
    "samemail.com", "safetymail.info", "inoutmail.de", "inoutmail.net",
    // Guerrilla Mail
    "guerrillamail.com", "guerrillamail.net", "guerrillamail.org",
    "guerrillamail.biz", "guerrillamail.de", "guerrillamail.info",
    "guerrillamailblock.com", "grr.la", "sharklasers.com", "guerrillamailblock.com",
    "spam4.me", "yopmail.com", "yopmail.fr", "cool.fr.nf", "jetable.fr.nf",
    // Temp Mail / Throwaway
    "tempmail.com", "tempmail.net", "tempmail.org", "temp-mail.org",
    "temp-mail.io", "throwam.com", "throwam.net", "throwaway.email",
    "dispostable.com", "disposablemail.com", "disposable.email",
    "fakeinbox.com", "fakeinbox.net", "filzmail.com", "trashmail.com",
    "trashmail.me", "trashmail.net", "trashmail.org", "trashmail.at",
    "trashmail.io", "trashmail.xyz", "trash-mail.at", "trashinbox.com",
    // 10 Minute Mail family
    "10minutemail.com", "10minutemail.net", "10minutemail.org",
    "10minutemail.co.uk", "10minutemail.de", "10minutemail.cf",
    "10minutemail.ga", "10minutemail.gq", "10minutemail.ml",
    "10minutemail.tk", "10minutemail.us", "10minemail.com",
    // Maildrop / Spamgourmet
    "maildrop.cc", "spamgourmet.com", "spamgourmet.net", "spamgourmet.org",
    // Others
    "getairmail.com", "mailnull.com", "spamspot.com", "spamthisplease.com",
    "binkmail.com", "bobmail.info", "dacoolest.com", "junk1.tk",
    "thankyou2010.com", "zippymail.info", "spamfree24.org", "spam.la",
    "spamfree.eu", "spamgob.com", "spamherelots.com", "spamhereplease.com",
    "spamthisplease.com", "spamtroll.net", "tapchicuoihoi.com",
    "rppkn.com", "rcpt.at", "kurzepost.de", "objectmail.com",
    "obobbo.com", "oneoffemail.com", "onewaymail.com", "otherinbox.com",
    "ovpn.to", "owlpic.com", "pookmail.com", "proxymail.eu",
    "put2.net", "qq.com", "safetypost.de", "selfdestructingmail.com",
    "sendspamhere.com", "sharklasers.com", "shieldemail.com",
    "skeefmail.com", "slippery.email", "slopsbox.com", "smellfear.com",
    "snkmail.com", "sofimail.com", "sogetthis.com", "soodonims.com",
    "spam.su", "spamavert.com", "spambo.com", "spamcannon.com",
    "spamcannon.net", "spamcero.com", "spamcon.org", "spamcorptastic.com",
    "spamcowboy.com", "spamcowboy.net", "spamcowboy.org",
    "spamday.com", "spamex.com", "spamfree24.de", "spamfree24.eu",
    "spamfree24.info", "spamfree24.net", "spamfree24.org",
    "yopmail.pp.ua", "nwldx.com", "kzccv.com", "coieo.com",
    "emkei.gq", "emkei.cf", "emkei.ga", "emkei.ml", "emkei.tk",
])

export function isDisposableEmail(email: string): boolean {
    const domain = email.split("@")[1]?.toLowerCase()
    if (!domain) return true
    return BLOCKED_DOMAINS.has(domain)
}
