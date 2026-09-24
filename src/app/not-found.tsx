import Link from "next/link";
import { Duck } from "@/components/art/Duck";

export default function NotFound() {
  return (
    <main className="pond-bed flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <Duck mood="sleep" className="w-40" />
      <p className="mt-6 font-mono text-xs tracking-[0.2em] text-mint uppercase">404 · too deep</p>
      <h1 className="h-display mt-3 text-5xl">Nothing down here.</h1>
      <p className="mt-3 text-muted">The duck dove for this page and came back with weeds.</p>
      <Link href="/" className="btn btn-mint mt-8 h-12 px-6">Back to the surface</Link>
    </main>
  );
}
