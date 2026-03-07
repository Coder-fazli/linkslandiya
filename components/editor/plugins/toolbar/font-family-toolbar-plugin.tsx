"use client"

import { useCallback, useRef, useState } from "react"
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection"
import {
  $getSelection,
  $isRangeSelection,
  $setSelection,
  BaseSelection,
  EditorState,
} from "lexical"
import { TypeIcon } from "lucide-react"

import { useToolbarContext } from "@/components/editor/context/toolbar-context"
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

const FONT_FAMILY_OPTIONS = [
  "Arial",
  "Verdana",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Trebuchet MS",
]

export function FontFamilyToolbarPlugin() {
  const style = "font-family"
  const [fontFamily, setFontFamily] = useState("Arial")
  const savedStateRef = useRef<EditorState | null>(null)

  const { activeEditor } = useToolbarContext()

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, "font-family", "Arial")
      )
    }
  }

  useUpdateToolbarHandler($updateToolbar)

  const handleClick = useCallback(
    (option: string) => {
      const savedState = savedStateRef.current
      activeEditor.update(() => {
        let restoredSelection = null
        if (savedState) {
          savedState.read(() => {
            const sel = $getSelection()
            if ($isRangeSelection(sel)) {
              restoredSelection = sel.clone()
            }
          })
        }
        if (restoredSelection) {
          $setSelection(restoredSelection)
        }
        const selection = $getSelection()
        if (selection !== null) {
          $patchStyleText(selection, { [style]: option })
        }
      })
    },
    [activeEditor, style]
  )

  return (
    <Select
      value={fontFamily}
      onValueChange={(value) => {
        setFontFamily(value)
        handleClick(value)
      }}
      aria-label="Formatting options for font family"
      modal={false}
    >
      <SelectTrigger
        className="!h-8 w-min gap-1"
        onPointerDown={() => {
          savedStateRef.current = activeEditor.getEditorState()
        }}
      >
        <TypeIcon className="size-4" />
        <span style={{ fontFamily }}>{fontFamily}</span>
      </SelectTrigger>
      <SelectContent>
        {FONT_FAMILY_OPTIONS.map((option) => (
          <SelectItem key={option} value={option} style={{ fontFamily: option }}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
