import Link from "next/link"

export default function AddFundsButton() {
  return (
    <Link href="/admin/top-up" target="_blank" rel="noopener noreferrer" className="browse-add-funds-btn">
      + Add Funds
    </Link>
  )
}
