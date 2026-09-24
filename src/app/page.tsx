import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DepthRail } from "@/components/DepthRail";
import { MobileDock } from "@/components/MobileDock";
import { Hero } from "@/components/home/Hero";
import { Dispatch } from "@/components/home/Dispatch";
import { Nest } from "@/components/home/Nest";
import { Steps } from "@/components/home/Steps";
import { Calculator } from "@/components/home/Calculator";
import { Flock } from "@/components/home/Flock";
import { PondMap } from "@/components/home/PondMap";
import { Entrance } from "@/components/home/Entrance";
import { PropRow } from "@/components/home/Props";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <DepthRail />
      <main className="pond-bed">
        <Hero />
        <Dispatch />
        <Nest />
        <PropRow kind="kelp" />
        <Steps />
        <Calculator />
        <PropRow kind="chair" />
        <Flock />
        <PropRow kind="chest" />
        <PondMap />
        <PropRow kind="kelp" />
        <Entrance />
        <SiteFooter />
      </main>
      <MobileDock />
    </>
  );
}
