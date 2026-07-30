# Scene-plan schema

Set the top-level `template` to exactly `editorial-illustrated` or `neon-infographic`. The two scene shapes are intentionally different and cannot be mixed.

## Shared fields

```json
{
  "version": 1,
  "template": "editorial-illustrated",
  "canvas": { "width": 1080, "height": 1920, "fps": 30 },
  "durationInFrames": 150,
  "branding": {
    "seriesLabel": "观点手记",
    "brandText": "",
    "source": "default"
  },
  "scenes": []
}
```

`startFrame` is inclusive and `endFrame` is exclusive. Scenes must be contiguous and cover `durationInFrames` exactly. Keyword frames are absolute narration-timeline frames, not visual guesses. Every scene must:

- last 3–6 seconds, targeting 3.5–5.5 seconds;
- contain two or three ordered keywords;
- hold its final keyword for at least 0.8 seconds;
- use a non-empty title;
- use only explicitly supplied branding when `branding.source` is `user`.

## Editorial illustrated plan

```json
{
  "version": 1,
  "template": "editorial-illustrated",
  "canvas": { "width": 1080, "height": 1920, "fps": 30 },
  "durationInFrames": 150,
  "branding": {
    "seriesLabel": "观点手记",
    "brandText": "",
    "source": "default"
  },
  "scenes": [
    {
      "id": "scene-01",
      "startFrame": 0,
      "endFrame": 150,
      "kicker": "一个常见想法",
      "title": "先去大厂几年，创业更稳？",
      "keywords": [
        { "text": "能力", "startFrame": 30 },
        { "text": "履历", "startFrame": 58 },
        { "text": "资源", "startFrame": 86 }
      ],
      "conclusion": "",
      "illustration": {
        "motif": "path-choice",
        "variant": "career-to-startup"
      },
      "drawFrames": 12,
      "fillFrames": 8
    }
  ]
}
```

Editorial scenes require `illustration`, `drawFrames`, and `fillFrames`; they must not contain `visualModule`.

### Supported editorial motifs

```text
path-choice
balance-tradeoff
growth-stairs
filter-funnel
cashflow-account
resource-network
magnifier-discovery
door-entry
risk-gauge
calendar-time
proof-comparison
action-checklist
```

## Neon infographic plan

```json
{
  "version": 1,
  "template": "neon-infographic",
  "canvas": { "width": 1080, "height": 1920, "fps": 30 },
  "durationInFrames": 150,
  "branding": {
    "seriesLabel": "观点手记",
    "brandText": "",
    "source": "default"
  },
  "scenes": [
    {
      "id": "scene-01",
      "startFrame": 0,
      "endFrame": 150,
      "kicker": "真正的验证",
      "title": "愿意付钱，才算验证",
      "supportingText": "态度反馈和付款行为不是一回事",
      "keywords": [
        { "text": "不是点赞", "startFrame": 28 },
        { "text": "现在付款", "startFrame": 66 },
        { "text": "真实验证", "startFrame": 106 }
      ],
      "conclusion": "",
      "visualModule": {
        "type": "split-comparison",
        "left": { "label": "口头认可", "detail": "想法不错" },
        "right": { "label": "付款行为", "detail": "现在掏钱" },
        "conclusion": "行为比态度更有分量"
      },
      "moduleFrames": 14
    }
  ]
}
```

Neon scenes require a non-empty `kicker`, `visualModule`, and `moduleFrames`.
`supportingText` is optional; when present it must be a non-empty sentence. Neon
scenes must not contain `illustration`, `drawFrames`, or `fillFrames`.
`moduleFrames` must be 10–16.

## Neon module shapes

### `metric-stack`

Use for one source-backed metric or claim with one to three supporting signals.

```json
{
  "type": "metric-stack",
  "label": "现金流压力",
  "value": "账上少一万",
  "items": [
    { "label": "决策变谨慎" },
    { "label": "心态会变化" }
  ]
}
```

`value` may be empty. Display it only when the source or user supplied it.

### `node-network`

Use for relationships among customers, channels, resources, causes, or capabilities.

```json
{
  "type": "node-network",
  "centerLabel": "下场",
  "nodes": [
    { "label": "客户" },
    { "label": "渠道" },
    { "label": "交付" }
  ],
  "edges": [[0, 1], [0, 2]]
}
```

Use two to four nodes. Edge indexes refer to `nodes`; keep every index in range.

### `bar-trend`

Use for relative magnitude or direction. `relativeValue` controls visual length from 0 to 1 and is not a visible percentage.

```json
{
  "type": "bar-trend",
  "bars": [
    { "label": "口头认可", "relativeValue": 0.36, "displayValue": "" },
    { "label": "付款行为", "relativeValue": 0.86, "displayValue": "" }
  ]
}
```

Use two to five bars. Show `displayValue` only when the source contains that exact value. Never calculate or display a percentage from `relativeValue`.

### `split-comparison`

Use for two positions, states, choices, or behaviors.

```json
{
  "type": "split-comparison",
  "left": { "label": "继续想", "detail": "信息仍然模糊" },
  "right": { "label": "小成本试", "detail": "快速得到反馈" },
  "conclusion": "行动让差距显形"
}
```

### `step-flow`

Use for an ordered action, process, or causal chain.

```json
{
  "type": "step-flow",
  "steps": [
    { "label": "观察" },
    { "label": "试做" },
    { "label": "验证" }
  ]
}
```

Use two to four steps.

## Validation and compilation

`scripts/validate-scene-plan.mjs` exports `validateScenePlan` and `assertValidScenePlan`. Compile with:

```bash
node scripts/build-motion-graphic.mjs \
  --plan <plan.json> \
  --out-dir <build-dir>
```

The compiler validates the plan before writing the two Motion Graphic manifests.
