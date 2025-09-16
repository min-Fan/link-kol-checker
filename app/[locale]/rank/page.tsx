"use client";
import { LogoHorizontalPrimary } from "@/app/assets/svg";
import RankList from "./components/RankList";
import FaultyTerminal from "@/app/components/FaultyTerminal/FaultyTerminal";
import React, { useMemo } from "react";
// 缓存的 FaultyTerminal 组件，防止因为页面数据改变而重新渲染
const CachedFaultyTerminal = React.memo(() => {
  const terminalProps = useMemo(
    () => ({
      scale: 2.7,
      gridMul: [2, 1] as [number, number],
      digitSize: 1.2,
      timeScale: 0.4,
      pause: false,
      scanlineIntensity: 0.5,
      glitchAmount: 1,
      flickerAmount: 1,
      noiseAmp: 1,
      chromaticAberration: 0,
      dither: 0,
      curvature: 0.35,
      tint: "#007AFF",
      mouseReact: true,
      mouseStrength: 0.5,
      pageLoadAnimation: false,
      brightness: 0.6,
    }),
    [],
  );

  return <FaultyTerminal {...terminalProps} />;
});

CachedFaultyTerminal.displayName = "CachedFaultyTerminal";
export default function RankPage() {
  return (
    <>
      <div className="w-full h-full absolute z-0 inset-0 pointer-events-none">
        <CachedFaultyTerminal />
        <div className="w-full h-full absolute z-0 inset-0 bg-black/60 pointer-events-none"></div>
      </div>
      <div className="w-full min-h-[calc(100vh-130px)] pb-10 z-10 relative">
        <div className="flex flex-col items-center gap-4 px-4 sm:px-0">
          <RankList />
        </div>
      </div>
    </>
  );
}
