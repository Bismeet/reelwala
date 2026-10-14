"use client";
import { RotateCcw } from "lucide-react";
import s from "./celebration.module.css";

export default function ReplayMoment() {
  return (
    <button
      type="button"
      className={s.replay}
      onClick={() => window.dispatchEvent(new Event("reelwala:replay"))}
    >
      <RotateCcw size={14} /> Replay the moment
    </button>
  );
}
