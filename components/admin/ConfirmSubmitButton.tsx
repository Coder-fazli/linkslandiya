"use client"

import { CSSProperties, ReactNode } from "react"

type Props = {
    /** Question shown in the confirmation dialog before the form submits */
    message: string
    className?: string
    style?: CSSProperties
    title?: string
    children: ReactNode
}

// Submit button that asks for confirmation first — for irreversible actions
export default function ConfirmSubmitButton({ message, className, style, title, children }: Props) {
    return (
        <button
            type="submit"
            className={className}
            style={style}
            title={title}
            onClick={e => { if (!confirm(message)) e.preventDefault() }}
        >
            {children}
        </button>
    )
}
