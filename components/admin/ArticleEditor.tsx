'use client'
import { useEditor, EditorContent, Editor } from "@tiptap/react"
  import StarterKit from "@tiptap/starter-kit"
  import Link from "@tiptap/extension-link"
  import Image from "@tiptap/extension-image"
  import Underline from "@tiptap/extension-underline"
  import Placeholder from "@tiptap/extension-placeholder"

  type Props = {
    value: string;
    onChange: (html: string) => void;
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
    <div className="article-editor-wrapper">
      <Toolbar editor={editor}/>
      <EditorContent editor={editor} className="article-editor-content" />
    </div>
  )
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  return (
    <div className="article-editor-toolbar">
      <div className="toolbar-group">
        <button type="button" className="editor-btn" onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button type="button" className="editor-btn" onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button type="button" className="editor-btn" onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
      </div>
      <span className="editor-sep" />
      <div className="toolbar-group">
        <button type="button" className="editor-btn" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className="editor-btn" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      </div>
      <span className="editor-sep" />
      <div className="toolbar-group">
        <button type="button" className="editor-btn" onClick={() => editor.chain().focus().toggleBulletList().run()}>• UL</button>
        <button type="button" className="editor-btn" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. OL</button>
      </div>
      <span className="editor-sep" />
      <div className="toolbar-group">
        <button type="button" className="editor-btn" onClick={() => {
          const url = prompt("Enter URL")
          if (url) editor.chain().focus().setLink({ href: url }).run()
        }}>🔗 Link</button>
        <button type="button" className="editor-btn" onClick={() => {
          const url = prompt("Enter image URL")
          if (url) editor.chain().focus().setImage({ src: url }).run()
        }}>🖼 Image</button>
      </div>
    </div>
  )
}