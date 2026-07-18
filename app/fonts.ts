import localFont from "next/font/local"

// Self-hosted Helvetica — see public/fonts/helvetica
export const helvetica = localFont({
    src: [
        { path: "../public/fonts/helvetica/Helvetica-Light.ttf", weight: "300", style: "normal" },
        { path: "../public/fonts/helvetica/Helvetica.ttf", weight: "400", style: "normal" },
        { path: "../public/fonts/helvetica/Helvetica-Oblique.ttf", weight: "400", style: "italic" },
        { path: "../public/fonts/helvetica/Helvetica-Bold.ttf", weight: "700", style: "normal" },
        { path: "../public/fonts/helvetica/Helvetica-BoldOblique.ttf", weight: "700", style: "italic" },
    ],
    variable: "--font-helvetica",
    display: "swap",
})
