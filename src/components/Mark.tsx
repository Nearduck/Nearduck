/** Round badge of the mascot for the header. Plain <img>: small icons render
    reliably without the image optimiser. */
export function MarkBadge({ size = 36 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-mint bg-[#f7f2e3] shadow-[0_0_18px_rgba(0,236,151,0.35)]"
      style={{ width: size, height: size }}
    >
      <img src="/brand/nearduck-plate.webp" alt="" width={size} height={size} className="size-full scale-125 object-cover" />
    </span>
  );
}
