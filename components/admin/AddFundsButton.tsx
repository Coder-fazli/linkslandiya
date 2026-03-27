"use client"

import { useState } from "react"
import AddFundsModal from "./AddFundsModal"

export default function AddFundsButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="browse-add-funds-btn"
        style={{ border: "none", cursor: "pointer" }}
      >
        + Add Funds
      </button>
      {open && <AddFundsModal onClose={() => setOpen(false)} />}
    </>
  )
}
