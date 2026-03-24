export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* Force light mode for planting tool — overrides dark theme from root */
        [data-tool-light],
        [data-tool-light] * {
          --foreground: oklch(0.145 0 0);
          --background: oklch(0.985 0 0);
          --input: oklch(0 0 0 / 0.15);
          --border: oklch(0 0 0 / 0.12);
          --ring: oklch(0.45 0.18 155);
        }
        [data-tool-light] input,
        [data-tool-light] textarea,
        [data-tool-light] select {
          color: #1a1a1a !important;
        }
        [data-tool-light] input::placeholder,
        [data-tool-light] textarea::placeholder {
          color: #a3a3a3 !important;
        }
      `}</style>
      <div data-tool-light>{children}</div>
    </>
  );
}
