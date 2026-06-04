import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950/50 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="font-bold text-2xl tracking-tighter text-white">
            DailyXP
          </Link>
          <p className="text-zinc-500 text-sm">Level up your life, one day at a time.</p>
        </div>

        <div className="flex gap-8 text-sm text-zinc-400">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
        </div>
      </div>
    </footer>
  )
}
