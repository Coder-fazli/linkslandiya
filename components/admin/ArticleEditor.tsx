"use client"

import {
  defineSchema,
  EditorProvider,
  PortableTextEditable,
  useEditor,
  useEditorSelector,
} from "@portabletext/editor"
import { EventListenerPlugin } from "@portabletext/editor/plugins"
import type {
  PortableTextBlock,
  RenderDecoratorFunction,
  RenderStyleFunction,
  RenderListItemFunction,
  RenderAnnotationFunction,
  RenderBlockFunction,
  EditorSelection,
} from "@portabletext/editor"
import { useState, useRef } from "react"

const schemaDefinition = defineSchema({
  decorators: [
    { name: "strong" },
    { name: "em" },
    { name: "underline" },
    { name: "code" },
  ],
  styles: [
    { name: "normal" },
    { name: "h2" },
    { name: "h3" },
    { name: "h4" },
    { name: "blockquote" },
  ],
  lists: [
    { name: "bullet" },
    { name: "number" },
  ],
  annotations: [
    { name: "link", fields: [{ name: "href", type: "string" }] },
  ],
  inlineObjects: [],
  blockObjects: [
    { name: "image", fields: [{ name: "url", type: "string" }, { name: "alt", type: "string" }] },
  ],
})

const renderStyle: RenderStyleFunction = (props) => {
  if (props.value === "h2") return <h2 className="pte-h2">{props.children}</h2>
  if (props.value === "h3") return <h3 className="pte-h3">{props.children}</h3>
  if (props.value === "h4") return <h4 className="pte-h4">{props.children}</h4>
  if (props.value === "blockquote") return <blockquote className="pte-blockquote">{props.children}</blockquote>
  return <p className="pte-p">{props.children}</p>
}

const renderDecorator: RenderDecoratorFunction = (props) => {
  if (props.value === "strong") return <strong>{props.children}</strong>
  if (props.value === "em") return <em>{props.children}</em>
  if (props.value === "underline") return <u>{props.children}</u>
  if (props.value === "code") return <code className="pte-inline-code">{props.children}</code>
  return <>{props.children}</>
}

const renderListItem: RenderListItemFunction = (props) => {
  return <span className={`pte-list-item pte-list-${props.value}`}>{props.children}</span>
}

const renderAnnotation: RenderAnnotationFunction = (props) => {
  if (props.schemaType.name === "link") {
    const href = (props.value as any)?.href
    return <a href={href} className="pte-link" target="_blank" rel="noopener noreferrer">{props.children}</a>
  }
  return <>{props.children}</>
}

const renderBlock: RenderBlockFunction = (props) => {
  if (props.schemaType.name === "image") {
    const url = (props.value as any)?.url
    const alt = (props.value as any)?.alt || ""
    return (
      <div className="pte-image-block" contentEditable={false}>
        {url
          ? <img src={url} alt={alt} className="pte-image" />
          : <div className="pte-image-placeholder">Image</div>
        }
      </div>
    )
  }
  return <div>{props.children}</div>
}

type ArticleEditorProps = {
  value: PortableTextBlock[] | undefined
  onChange: (value: PortableTextBlock[] | undefined) => void
}

export function ArticleEditor({ value, onChange }: ArticleEditorProps) {
  return (
    <div className="article-editor-wrapper">
      <EditorProvider
        initialConfig={{
          schemaDefinition,
          initialValue: value,
        }}
      >
        <EventListenerPlugin
          on={(event) => {
            if (event.type === "mutation") {
              onChange(event.value)
            }
          }}
        />
        <Toolbar />
        <PortableTextEditable
          className="article-editor-content"
          renderStyle={renderStyle}
          renderDecorator={renderDecorator}
          renderBlock={renderBlock}
          renderListItem={renderListItem}
          renderAnnotation={renderAnnotation}
        />
      </EditorProvider>
    </div>
  )
}

function Toolbar() {
  const editor = useEditor()
  const selection = useEditorSelector(editor, (snapshot) => snapshot.context.selection)

  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [showImageInput, setShowImageInput] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")

  // Save selection before focus is lost to the input panel
  const savedSelection = useRef<EditorSelection>(null)

  function sendAndFocus(type: string, payload: Record<string, unknown> = {}) {
    editor.send({ type, ...payload } as any)
    editor.send({ type: "focus" })
  }

  function openLinkPanel(e: React.MouseEvent) {
    e.preventDefault()
    savedSelection.current = selection
    setShowImageInput(false)
    setShowLinkInput((v) => !v)
  }

  function insertLink() {
    if (!linkUrl) return
    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`
    // Restore saved selection first
    if (savedSelection.current) {
      editor.send({ type: "select", at: savedSelection.current } as any)
    }
    editor.send({
      type: "annotation.add",
      annotation: { name: "link", value: { href: url } },
    } as any)
    editor.send({ type: "focus" })
    setLinkUrl("")
    setShowLinkInput(false)
    savedSelection.current = null
  }

  function insertImage() {
    if (!imageUrl) return
    editor.send({
      type: "insert.block",
      block: { _type: "image", url: imageUrl, alt: imageAlt },
      placement: "after",
    } as any)
    editor.send({ type: "focus" })
    setImageUrl("")
    setImageAlt("")
    setShowImageInput(false)
  }

  const hasSelection = selection && selection.anchor.offset !== selection.focus.offset

  return (
    <>
      <div className="article-editor-toolbar">
        {/* Styles */}
        <div className="toolbar-group">
          {[
            { name: "normal", label: "P" },
            { name: "h2", label: "H2" },
            { name: "h3", label: "H3" },
            { name: "h4", label: "H4" },
            { name: "blockquote", label: "❝" },
          ].map((s) => (
            <button
              key={s.name}
              type="button"
              className="editor-btn"
              title={s.name}
              onMouseDown={(e) => {
                e.preventDefault()
                sendAndFocus("style.toggle", { style: s.name })
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <span className="editor-sep" />

        {/* Decorators */}
        <div className="toolbar-group">
          {[
            { name: "strong", label: "B", title: "Bold" },
            { name: "em", label: "I", title: "Italic" },
            { name: "underline", label: "U", title: "Underline" },
            { name: "code", label: "</>", title: "Inline Code" },
          ].map((d) => (
            <button
              key={d.name}
              type="button"
              className="editor-btn"
              title={d.title}
              onMouseDown={(e) => {
                e.preventDefault()
                sendAndFocus("decorator.toggle", { decorator: d.name })
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        <span className="editor-sep" />

        {/* Lists */}
        <div className="toolbar-group">
          <button
            type="button"
            className="editor-btn"
            title="Bullet list"
            onMouseDown={(e) => {
              e.preventDefault()
              sendAndFocus("list.toggle", { listItem: "bullet" })
            }}
          >
            ≡ UL
          </button>
          <button
            type="button"
            className="editor-btn"
            title="Numbered list"
            onMouseDown={(e) => {
              e.preventDefault()
              sendAndFocus("list.toggle", { listItem: "number" })
            }}
          >
            1. OL
          </button>
        </div>

        <span className="editor-sep" />

        {/* Link & Image */}
        <div className="toolbar-group">
          <button
            type="button"
            className={`editor-btn${showLinkInput ? " editor-btn-active" : ""}`}
            title="Insert link (select text first)"
            onMouseDown={openLinkPanel}
          >
            🔗 Link
          </button>
          <button
            type="button"
            className={`editor-btn${showImageInput ? " editor-btn-active" : ""}`}
            title="Insert image"
            onMouseDown={(e) => {
              e.preventDefault()
              setShowLinkInput(false)
              setShowImageInput((v) => !v)
            }}
          >
            🖼 Image
          </button>
        </div>
      </div>

      {/* Link input panel */}
      {showLinkInput && (
        <div className="editor-input-panel">
          <span className="editor-panel-label">
            {hasSelection ? "Add link to selection:" : "No text selected — select text first"}
          </span>
          <input
            type="url"
            className="editor-panel-input"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); insertLink() } }}
            autoFocus
          />
          <button type="button" className="editor-panel-btn" onClick={insertLink}>Apply</button>
          <button type="button" className="editor-panel-btn editor-panel-btn-cancel" onClick={() => setShowLinkInput(false)}>✕</button>
        </div>
      )}

      {/* Image input panel */}
      {showImageInput && (
        <div className="editor-input-panel">
          <input
            type="url"
            className="editor-panel-input"
            placeholder="Image URL (https://...)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            autoFocus
          />
          <input
            type="text"
            className="editor-panel-input"
            placeholder="Alt text"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); insertImage() } }}
          />
          <button type="button" className="editor-panel-btn" onClick={insertImage}>Insert</button>
          <button type="button" className="editor-panel-btn editor-panel-btn-cancel" onClick={() => setShowImageInput(false)}>✕</button>
        </div>
      )}
    </>
  )
}
