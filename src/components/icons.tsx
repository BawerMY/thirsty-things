import type { ReactNode } from "react";

export function DropLogo() {
  return (
    <svg width="30" height="38" viewBox="0 0 30 38" aria-hidden>
      <path d="M15 2C15 2 3 17 3 25a12 12 0 0 0 24 0C27 17 15 2 15 2z" fill="#3fd0e6" stroke="#eaf7fb" strokeWidth="2.5" />
      <circle cx="10" cy="25" r="2.5" fill="#eaf7fb" />
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="#eaf7fb" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

/** A bottle outline filled to `fill` (0–1). */
export function Bottle({ fill = 1, width = 12, height = 22 }: { fill?: number; width?: number; height?: number }) {
  const h = 17 * fill;
  return (
    <svg width={width} height={height} viewBox="0 0 16 28" aria-hidden>
      <rect x="3" y={10 + 17 - h} width="10" height={h} fill="#3fd0e6" />
      <path d="M6 2h4v5l3 3v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10l3-3z" fill="none" stroke="#06294a" strokeWidth="1.5" />
    </svg>
  );
}

function TabIcon({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#06294a" : "#eaf7fb"}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export const tabIcons = {
  tap: (active: boolean) => (
    <TabIcon active={active}>
      <path d="M10 2h4v4l3 3v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9l3-3z" />
      <path d="M7 13h10" />
    </TabIcon>
  ),
  guess: (active: boolean) => (
    <TabIcon active={active}>
      <path d="M12 3s-7 8-7 12a7 7 0 0 0 14 0c0-4-7-12-7-12z" />
      <path d="M10.5 13a1.8 1.8 0 1 1 2.4 1.7c-.6.2-.9.6-.9 1.2M12 18.5h.01" />
    </TabIcon>
  ),
  surv: (active: boolean) => (
    <TabIcon active={active}>
      <path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 20c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
      <circle cx="12" cy="7" r="3" />
    </TabIcon>
  ),
};

export function HeaderWave() {
  return (
    <svg viewBox="0 0 240 18" preserveAspectRatio="none" className="drift" style={{ width: "200%", height: 18, display: "block", animationDuration: "9s" }}>
      <path
        d="M0 0h240v6c-15 0-15 10-30 10s-15-10-30-10-15 10-30 10-15-10-30-10-15 10-30 10-15-10-30-10-15 10-30 10S15 6 0 6z"
        fill="#06294a"
      />
    </svg>
  );
}

export function Surf() {
  const crest =
    "M0 7c10 0 10-5 20-5s10 5 20 5 10-5 20-5 10 5 20 5 10-5 20-5 10 5 20 5 10-5 20-5 10 5 20 5 10-5 20-5 10 5 20 5 10-5 20-5 10 5 20 5";
  return (
    <svg viewBox="0 0 240 14" preserveAspectRatio="none" className="drift" style={{ width: "200%", height: 14, display: "block", animationDuration: "5s" }}>
      <path d={`${crest}V14H0z`} fill="#bfeef6" />
      <path d={crest} fill="none" stroke="#3fd0e6" strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
