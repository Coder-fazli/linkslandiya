'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'

type Props = {
  content: string
}

export default function TipTapViewer({ content }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: true }),
      Image,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
    ],
    content: content || '<p>No content provided.</p>',
    editable: false,
    immediatelyRender: false,
  })

  return (
    <div className="tiptap-viewer">
      <EditorContent editor={editor} />
    </div>
  )
}
