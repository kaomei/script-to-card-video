const MOTIFS = [
  "path-choice",
  "balance-tradeoff",
  "growth-stairs",
  "filter-funnel",
  "cashflow-account",
  "resource-network",
  "magnifier-discovery",
  "door-entry",
  "risk-gauge",
  "calendar-time",
  "proof-comparison",
  "action-checklist",
];

const MODULE_TYPES = [
  "metric-stack",
  "node-network",
  "bar-trend",
  "split-comparison",
  "step-flow",
];

const makeVisualModule = (type, index) => {
  if (type === "metric-stack") {
    return {
      type,
      label: `核心指标 ${index + 1}`,
      value: "",
      items: [{ label: "状态 A" }, { label: "状态 B" }],
    };
  }
  if (type === "node-network") {
    return {
      type,
      centerLabel: "核心",
      nodes: [{ label: "客户" }, { label: "渠道" }, { label: "交付" }],
      edges: [[0, 1], [0, 2]],
    };
  }
  if (type === "bar-trend") {
    return {
      type,
      bars: [
        { label: "之前", relativeValue: 0.38, displayValue: "" },
        { label: "之后", relativeValue: 0.82, displayValue: "" },
      ],
    };
  }
  if (type === "split-comparison") {
    return {
      type,
      left: { label: "轻飘飘的认可", detail: "点赞" },
      right: { label: "真实验证", detail: "现在付款" },
      conclusion: "行为比态度更有分量",
    };
  }
  return {
    type,
    steps: [{ label: "观察" }, { label: "试做" }, { label: "验证" }],
  };
};

export const makeFixture = ({
  seconds,
  sceneCount,
  template = "editorial-illustrated",
}) => {
  const fps = 30;
  const durationInFrames = seconds * fps;
  const base = Math.floor(durationInFrames / sceneCount);
  let cursor = 0;
  const scenes = Array.from({ length: sceneCount }, (_, index) => {
    const endFrame = index === sceneCount - 1 ? durationInFrames : cursor + base;
    const result = {
      id: `scene-${String(index + 1).padStart(2, "0")}`,
      startFrame: cursor,
      endFrame,
      kicker:
        template === "neon-infographic"
          ? `信息节点 ${index + 1}`
          : index === 0
            ? "一个常见想法"
            : "",
      title: `测试观点 ${index + 1}`,
      keywords: [
        { text: `关键词${index + 1}A`, startFrame: cursor + 24 },
        { text: `关键词${index + 1}B`, startFrame: cursor + 52 },
      ],
      conclusion: "",
    };
    if (template === "editorial-illustrated") {
      result.illustration = {
        motif: MOTIFS[index % MOTIFS.length],
        variant: `variant-${index + 1}`,
      };
      result.drawFrames = 12;
      result.fillFrames = 8;
    } else if (template === "neon-infographic") {
      result.supportingText = `补充信息 ${index + 1}`;
      result.visualModule = makeVisualModule(
        MODULE_TYPES[index % MODULE_TYPES.length],
        index,
      );
      result.moduleFrames = 14;
    }
    cursor = endFrame;
    return result;
  });

  return {
    version: 1,
    canvas: { width: 1080, height: 1920, fps },
    template,
    durationInFrames,
    branding: {
      seriesLabel: "观点手记",
      brandText: "",
      source: "default",
    },
    scenes,
  };
};
