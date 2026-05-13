# RAIJIN — 雷神

> Ancient power. Modern velocity.

Landing page for **Raijin**, named after the Japanese god of lightning, thunder, and storms.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** + custom CSS variables
- **shadcn/ui** primitives
- Custom timeline-driven frame sequence for the storm/lightning hero
- Deployed via **GitHub Pages** (see `.github/workflows/deploy.yml`)

## Typography

| Role | Font |
|---|---|
| Display / wordmark | **Cinzel** |
| Editorial headings | **Cormorant Garamond** |
| Body | **Inter** |
| UI / labels / mono | **Geist Mono** |
| Kanji 雷神 brush | **Yuji Boku** |

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # outputs to dist/
```

## Project structure

```
src/
├── App.tsx              # Main component + FrameSequence storm scheduler
├── index.css            # Design tokens + section styling
└── assets/
    ├── frames/          # 21 optimized JPGs powering the lightning loop
    └── raijin-logo-cutout.png   # Brush 雷神 + RAIJIN, transparent BG
```

---

© MMXXVI · RAIJIN
