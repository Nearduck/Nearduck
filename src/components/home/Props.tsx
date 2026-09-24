import { Chest, Kelp, Shell, SunkenChair } from "@/components/art/Scenes";

/** Decorations between panels, the pond-floor version of roots and fossils. */
export function PropRow({ kind }: { kind: "kelp" | "chair" | "chest" }) {
  if (kind === "kelp") {
    return (
      <div className="relative mx-auto flex h-[150px] max-w-[1180px] justify-center" aria-hidden="true">
        <Kelp className="h-full w-16" />
      </div>
    );
  }
  if (kind === "chair") {
    return (
      <div className="relative mx-auto grid h-[210px] max-w-[1180px] grid-cols-2 items-center px-6" aria-hidden="true">
        <Kelp className="mx-auto h-full w-14" />
        <SunkenChair className="w-60 max-w-full justify-self-center sm:w-72" />
      </div>
    );
  }
  return (
    <div className="relative mx-auto grid h-[210px] max-w-[1180px] grid-cols-3 items-center px-6" aria-hidden="true">
      <Chest className="w-44 max-w-full justify-self-center sm:w-56" />
      <Kelp className="mx-auto h-full w-14" />
      <Shell className="w-16 justify-self-center sm:w-20" />
    </div>
  );
}
