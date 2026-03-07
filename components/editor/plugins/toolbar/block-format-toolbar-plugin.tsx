"use client"

import { useRef } from "react"
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list"
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from "@lexical/rich-text"
import { $setBlocksType } from "@lexical/selection"
import { $createCodeNode } from "@lexical/code"
import { $findMatchingParent, $getNearestNodeOfType } from "@lexical/utils"
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  BaseSelection,
  EditorState,
} from "lexical"

import { useToolbarContext } from "@/components/editor/context/toolbar-context"
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar"
import { blockTypeToBlockName } from "@/components/editor/plugins/toolbar/block-format/block-format-data"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
} from "@/components/ui/select"

export function BlockFormatDropDown({
  children,
}: {
  children: React.ReactNode
}) {
  const { activeEditor, blockType, setBlockType } = useToolbarContext()
  const savedStateRef = useRef<EditorState | null>(null)

  function $updateToolbar(selection: BaseSelection) {
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent()
              return parent !== null && $isRootOrShadowRoot(parent)
            })

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow()
      }

      const elementKey = element.getKey()
      const elementDOM = activeEditor.getElementByKey(elementKey)

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          )
          const type = parentList
            ? parentList.getListType()
            : element.getListType()
          setBlockType(type)
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType()
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName)
          }
        }
      }
    }
  }

  useUpdateToolbarHandler($updateToolbar)

  function handleTriggerPointerDown() {
    savedStateRef.current = activeEditor.getEditorState()
  }

  function handleValueChange(value: string) {
    setBlockType(value as keyof typeof blockTypeToBlockName)

    const savedState = savedStateRef.current

    // For list commands, dispatch directly — they don't need selection
    if (value === "bullet") {
      activeEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
      return
    }
    if (value === "number") {
      activeEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
      return
    }
    if (value === "check") {
      activeEditor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
      return
    }

    // For block-type formats, restore selection from saved state then format
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
      if (selection === null) return

      switch (value) {
        case "paragraph":
          $setBlocksType(selection, () => $createParagraphNode())
          break
        case "h1":
        case "h2":
        case "h3":
          $setBlocksType(selection, () => $createHeadingNode(value as "h1" | "h2" | "h3"))
          break
        case "quote":
          $setBlocksType(selection, () => $createQuoteNode())
          break
        case "code": {
          if ($isRangeSelection(selection) && selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode())
          } else {
            const textContent = selection.getTextContent()
            const codeNode = $createCodeNode()
            selection.insertNodes([codeNode])
            const newSel = $getSelection()
            if ($isRangeSelection(newSel)) {
              newSel.insertRawText(textContent)
            }
          }
          break
        }
      }
    })
  }

  return (
    <Select
      value={blockType}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="!h-8 w-min gap-1" onPointerDown={handleTriggerPointerDown}>
        {blockTypeToBlockName[blockType].icon}
        <span>{blockTypeToBlockName[blockType].label}</span>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </Select>
  )
}
