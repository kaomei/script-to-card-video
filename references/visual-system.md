# Card Video Visual System

This reference defines two structural templates for editable portrait ChatCut videos. The default canvas is 1080×1920 at 30fps; custom portrait dimensions use the same proportions.

## Shared rules

- Keep the full-timeline background static so scene changes do not look like card cuts.
- Keep visible content inside the 6%–94% horizontal safe zone.
- Reserve 78%–100% of the canvas for native ChatCut captions.
- Use two or three transcript-timed keywords per scene.
- Hold the last keyword and settled visual for at least 0.8 seconds.
- Make the incoming scene visible on its first boundary frame; do not render the previous scene beneath it.
- Use no page numbers or bundled personal branding.
- Use supported cloud fonts and editable color properties.
- Use one coherent template for one timeline unless the user asks for a deliberate style change.

Captions use white text on a square-corner translucent dark band, bottom-center placement, and natural 8–14 Chinese-character phrase pages.

## `editorial-illustrated`

Use the accepted warm editorial composition without changing its title, progressive-keyword, or illustration behavior.

### Palette

| Token | Value | Use |
| --- | --- | --- |
| Background | `#F8F1E6` → `#F5ECDE` | Static warm-paper gradient |
| `textColor` | `#573225` | Titles and open SVG strokes |
| `accentColor` | `#E86F2A` | Focus and semantic outcome |
| `creamColor` | `#FFF8F0` | Light paper surface |
| `surfaceColor` | `#FFF8F0` | Keyword blocks and filled SVG areas |
| `surfaceInkColor` | `#573225` | Text and outlines on light surfaces |

Use the paper grid at 4.5% brown alpha and static grain at 12% alpha.

### Layout

| Zone | Vertical range | Rules |
| --- | --- | --- |
| Series label | starts at 8% | Optional generic series label and explicit user brand |
| Title and keywords | 17%–40% | One title, optional kicker/conclusion, and 2–3 keywords |
| Illustration | 42%–75% | One centered semantic SVG composition |
| Buffer | 75%–78% | Keep clear |
| Captions | 78%–100% | Native caption layer only |

The settled illustration should occupy 70%–88% of the illustration-zone width and height.

### Motion

- Reveal only the incoming title with a six-frame mask.
- Reveal each keyword over six frames with wrapper opacity and a short upward settle.
- Draw the illustration over 10–14 frames with SVG dash-on strokes.
- Crossfade outline and fill through HTML wrapper opacity.
- Start the incoming title and illustration slightly above zero at a scene boundary.

### Semantic motifs

| Motif | Visual job |
| --- | --- |
| `path-choice` | Building/door, target, character, and branching path |
| `balance-tradeoff` | Two semantic objects on a balance beam |
| `growth-stairs` | Activated steps moving toward an outcome |
| `filter-funnel` | Many inputs narrowing to one validated output |
| `cashflow-account` | Falling balance bars and warning coin |
| `resource-network` | Person connected to customer, channel, and delivery |
| `magnifier-discovery` | Magnifier revealing hidden facts |
| `door-entry` | Closed door versus crossing an open threshold |
| `risk-gauge` | Gauge, needle, and three risk ticks |
| `calendar-time` | Short experiment versus long calendar stack |
| `proof-comparison` | Approval signals versus payment proof |
| `action-checklist` | Ordered actions leading to an outcome |

Adjacent scenes should differ in at least two of silhouette, spatial composition, focal point, motion direction, or core prop.

## `neon-infographic`

Use a dark technical canvas with dynamic typography and one semantic infographic module per scene. Do not generate or import raster images, character illustrations, or decorative AI art.

### Palette

| Token | Value | Use |
| --- | --- | --- |
| Background | `#06101D` → `#0B1728` | Static dark technology canvas |
| `textColor` | `#EAFBFF` | Primary title and labels |
| `accentColor` | `#43E7FF` | Cyan structure and first emphasis |
| `secondaryColor` | `#8B6CFF` | Violet relationship and secondary emphasis |
| `emphasisColor` | `#FF4FD8` | Magenta contrast or opposing state |
| `signalColor` | `#B8FF5A` | Verified outcome or final step |
| `surfaceColor` | `#0E2035` | Dark bounded data surfaces |
| `surfaceInkColor` | `#EAFBFF` | Text on those surfaces |

Glow is a semantic activation cue, not a continuous decoration. Use one restrained 18–24px bloom only on active structures.

### Layout

| Zone | Vertical range | Rules |
| --- | --- | --- |
| Series label | starts at 8% | Optional generic label; no page number |
| Dynamic text | 15%–42% | Kicker, headline, supporting text, 2–3 keyword blocks |
| Infographic | 43%–76% | One module centered in a shared 1000×560 coordinate system |
| Buffer | 76%–78% | Keep clear |
| Captions | 78%–100% | Native caption layer only |

Use square or slightly softened 0–12px corners. Avoid pill-shaped cards and repeated generic dashboard tiles.

### Motion

- Reveal the incoming headline over six frames with a horizontal mask.
- Start the module at `scene.startFrame - 1` so the scene boundary already has a visible mark.
- Reveal supporting text and keyword blocks in narration order.
- Draw connectors before activating nodes or steps.
- Grow data rails and bars from their origin; do not use looping scan lines or shimmer.
- Complete module motion in 10–16 frames, then hold.
- Never retain outgoing text or modules under the incoming scene.

### Module selection

| Module | Choose when the source expresses | Visual mechanism |
| --- | --- | --- |
| `metric-stack` | One metric/claim with supporting signals | Large claim plus 1–3 activation rails |
| `node-network` | Relationships, dependencies, or resources | Central node, radial edges, and related nodes |
| `bar-trend` | Relative magnitude or direction | Two to five proportional bars |
| `split-comparison` | Two positions, states, choices, or behaviors | Unequal opposing panels plus conclusion bridge |
| `step-flow` | Ordered action, process, or causal chain | Drawn connectors followed by numbered nodes |

Do not fabricate visible data. `relativeValue` controls bar length only. Display `value` or `displayValue` only when the source or user supplies the exact visible text.

## Canvas-pipeline constraints

Motion Graphic code must use pure JavaScript JSX, no imports, no `export default`, no `Remotion.*`, and a root `<div style={rootStyle}>`.

SVG code must not animate CSS on `<svg>`, use inner-element `transform` attributes, or use inner SVG `opacity` presentation attributes. Use absolute SVG coordinates. Draw-on motion belongs on dash attributes; opacity motion belongs on HTML wrappers.
