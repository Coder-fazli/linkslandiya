'use client'
import { useEditor, EditorContent, Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Underline from "@tiptap/extension-underline"
import Placeholder from "@tiptap/extension-placeholder"
import { useState, useRef, useEffect } from "react"

type Props = {
  value: string
  onChange: (html: string) => void
}

export function ArticleEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: "Write your article here..." }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="pte-wrapper">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="pte-editable" />
    </div>
  )
}

function Toolbar({ editor }: { editor: Editor | null }) {
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const linkBtnRef = useRef<HTMLButtonElement>(null)
  const linkPopoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        linkPopoverRef.current &&
        !linkPopoverRef.current.contains(e.target as Node) &&
        linkBtnRef.current &&
        !linkBtnRef.current.contains(e.target as Node)
      ) {
        setLinkOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  if (!editor) return null

  function applyLink() {
    if (!linkUrl) return
    const href = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`
    editor!.chain().focus().setLink({ href }).run()
    setLinkUrl("")
    setLinkOpen(false)
  }

  function removeLink() {
    editor!.chain().focus().unsetLink().run()
    setLinkOpen(false)
  }

  function btn(active: boolean) {
    return `pte-btn${active ? " pte-btn--active" : ""}`
  }

  return (
    <div className="pte-toolbar">

      {/* Text style */}
      <div className="pte-group">
        <button type="button" title="Bold" className={btn(editor.isActive("bold"))}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h8a4 4 0 0 1 0 8H6zm0 8h9a4 4 0 0 1 0 8H6z"/></svg>
        </button>
        <button type="button" title="Italic" className={btn(editor.isActive("italic"))}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
        </button>
        <button type="button" title="Underline" className={btn(editor.isActive("underline"))}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run() }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" y1="20" x2="20" y2="20"/></svg>
        </button>
        <button type="button" title="Strike" className={btn(editor.isActive("strike"))}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run() }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" y1="12" x2="20" y2="12"/><path d="M8 6.5C8 4.6 9.8 3 12 3s4 1.6 4 3.5c0 1-.4 1.9-1 2.5M7 17c0 1.9 2.2 3.5 5 3.5s5-1.6 5-3.5"/></svg>
        </button>
      </div>

      <span className="pte-sep" />

      {/* Headings */}
      <div className="pte-group">
        <button type="button" title="Heading 2" className={btn(editor.isActive("heading", { level: 2 }))}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run() }}>
          H2
        </button>
        <button type="button" title="Heading 3" className={btn(editor.isActive("heading", { level: 3 }))}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run() }}>
          H3
        </button>
        <button type="button" title="Blockquote" className={btn(editor.isActive("blockquote"))}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run() }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
        </button>
      </div>

      <span className="pte-sep" />

      {/* Lists */}
      <div className="pte-group">
        <button type="button" title="Bullet list" className={btn(editor.isActive("bulletList"))}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
        </button>
        <button type="button" title="Ordered list" className={btn(editor.isActive("orderedList"))}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run() }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M4 10h2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
        </button>
      </div>

      <span className="pte-sep" />

      {/* Link & Image */}
      <div className="pte-group" style={{ position: "relative" }}>
        <button
          ref={linkBtnRef}
          type="button"
          title="Insert link"
          className={btn(editor.isActive("link"))}
          onMouseDown={(e) => {
            e.preventDefault()
            if (editor.isActive("link")) {
              removeLink()
            } else {
              setLinkOpen((v) => !v)
            }
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>

        {linkOpen && (
          <div ref={linkPopoverRef} className="pte-link-popover">
            <input
              className="pte-link-input"
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyLink() } }}
              autoFocus
            />
            <button type="button" className="pte-link-apply" onMouseDown={(e) => { e.preventDefault(); applyLink() }}>
              Apply
            </button>
          </div>
        )}

        <button type="button" title="Insert image" className="pte-btn"
          onMouseDown={(e) => {
            e.preventDefault()
            const url = prompt("Image URL")
            if (url) editor.chain().focus().setImage({ src: url }).run()
          }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        </button>
      </div>

      <span className="pte-sep" />

      {/* Undo / Redo */}
      <div className="pte-group">
        <button type="button" title="Undo" className="pte-btn"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().undo().run() }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
        </button>
        <button type="button" title="Redo" className="pte-btn"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().redo().run() }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
        </button>
      </div>

    </div>
  )
}
