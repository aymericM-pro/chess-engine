import { useState, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { COUNTRIES } from "../models";

interface CountrySelectProps {
  value: string;
  onChange: (v: string) => void;
}

export function CountrySelect({ value, onChange }: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const selected = COUNTRIES.find((c) => c.code === value)!;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-country-select]")) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div style={{ position: "relative" }} data-country-select="">
      <Button
        variant="profile-select"
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={open ? "border-[rgba(201,169,110,0.5)]" : ""}
      >
        <span style={{ fontSize: 20 }}>{selected.flag}</span>
        <span style={{ flex: 1, textAlign: "left" }}>{selected.label}</span>
        <ChevronDown size={14} style={{ color: "var(--color-text-muted)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
      </Button>

      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 400, background: "var(--color-bg-2)", border: "1px solid var(--color-border)", borderRadius: 10, overflow: "hidden", boxShadow: "0 12px 32px rgba(0,0,0,0.5)" }}>
          {COUNTRIES.map((c) => (
            <Button
              key={c.code}
              variant="profile-option"
              type="button"
              onClick={() => { onChange(c.code); setOpen(false); }}
              className={c.code === value ? "bg-[rgba(201,169,110,0.08)] text-[var(--color-gold)] hover:bg-[rgba(201,169,110,0.08)]" : ""}
            >
              <span style={{ fontSize: 20 }}>{c.flag}</span>
              <span style={{ flex: 1 }}>{c.label}</span>
              {c.code === value && <Check size={14} color="var(--color-gold)" />}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
