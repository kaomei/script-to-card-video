const clamp01 = (value) => Math.max(0, Math.min(1, value));
const easeOut = (value) => 1 - Math.pow(1 - clamp01(value), 3);
const neonLine = (progress, length) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - progress),
});
const glowStyle = (color, active) => ({
  boxShadow: active
    ? `0 0 18px ${color}55, inset 0 0 14px ${color}22`
    : "none",
});
const itemProgress = (progress, index, count) => {
  const slot = 0.72 / Math.max(1, count);
  return clamp01((progress - index * slot) / 0.28);
};
const phaseProgress = (progress, phaseIndex, phaseCount) => {
  const phaseSize = 1 / Math.max(1, phaseCount);
  return clamp01(
    (progress - phaseIndex * phaseSize) / phaseSize,
  );
};

const renderMetricStack = (module, palette, progress) => {
  const value =
    typeof module.value === "string" ? module.value.trim() : "";
  const wrapperStyle = {
    width: "100%",
    height: "100%",
    padding: 48,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderTop: `3px solid ${palette.cyan}`,
    borderLeft: `1px solid ${palette.violet}`,
    background:
      `linear-gradient(135deg, ${palette.surface}F2 0%, ${palette.background}AA 100%)`,
    ...glowStyle(palette.cyan, progress >= 1),
  };
  const headerStyle = {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 28,
  };
  const labelStyle = {
    color: palette.text,
    fontSize: 48,
    fontWeight: 900,
    lineHeight: 1.1,
  };
  const valueStyle = {
    color: palette.lime,
    fontSize: 88,
    fontWeight: 900,
    lineHeight: 1,
    textShadow: `0 0 22px ${palette.lime}55`,
  };
  const listStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  };
  const rows = module.items.map((item, index) => {
    const rowProgress = itemProgress(progress, index, module.items.length);
    const railStyle = {
      position: "relative",
      height: 58,
      borderBottom: `2px solid ${palette.cyan}55`,
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
    };
    const activeStyle = {
      position: "absolute",
      left: 0,
      bottom: 0,
      width: `${rowProgress * (46 + index * 18)}%`,
      height: 6,
      backgroundColor:
        index % 2 === 0 ? palette.cyan : palette.magenta,
      boxShadow:
        `0 0 18px ${index % 2 === 0 ? palette.cyan : palette.magenta}`,
    };
    const rowLabelStyle = {
      position: "relative",
      color: palette.text,
      fontSize: 34,
      fontWeight: 700,
      opacity: rowProgress,
      transform: `translateX(${(1 - rowProgress) * 20}px)`,
    };
    return (
      <div key={`${item.label}-${index}`} style={railStyle}>
        <div style={activeStyle} />
        <div style={rowLabelStyle}>{item.label}</div>
      </div>
    );
  });

  return (
    <div style={wrapperStyle}>
      <div style={headerStyle}>
        <div style={labelStyle}>{module.label}</div>
        {value ? <div style={valueStyle}>{value}</div> : null}
      </div>
      <div style={listStyle}>{rows}</div>
    </div>
  );
};

const renderNodeNetwork = (module, palette, progress) => {
  const layouts = {
    2: [
      { x: 240, y: 390 },
      { x: 760, y: 390 },
    ],
    3: [
      { x: 180, y: 390 },
      { x: 500, y: 472 },
      { x: 820, y: 390 },
    ],
    4: [
      { x: 170, y: 300 },
      { x: 380, y: 462 },
      { x: 650, y: 462 },
      { x: 830, y: 300 },
    ],
  };
  const positions = layouts[module.nodes.length];
  const center = { x: 500, y: 180 };
  const wrapperStyle = {
    width: "100%",
    height: "100%",
    ...glowStyle(palette.violet, progress >= 1),
  };
  const networkPhaseCount =
    1 + module.nodes.length + module.edges.length + module.nodes.length;
  const centerProgress = phaseProgress(progress, 0, networkPhaseCount);
  const centerRadius = 66 * centerProgress;
  const radialLines = positions.map((position, index) => {
    const lineProgress = phaseProgress(
      progress,
      1 + index,
      networkPhaseCount,
    );
    const line = neonLine(lineProgress, 700);
    return (
      <line
        key={`radial-${index}`}
        x1={center.x}
        y1={center.y}
        x2={position.x}
        y2={position.y}
        stroke={index % 2 === 0 ? palette.cyan : palette.violet}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={line.strokeDasharray}
        strokeDashoffset={line.strokeDashoffset}
      />
    );
  });
  const relationshipLines = module.edges.map((edge, index) => {
    const from = positions[edge[0]];
    const to = positions[edge[1]];
    const lineProgress = phaseProgress(
      progress,
      1 + positions.length + index,
      networkPhaseCount,
    );
    const line = neonLine(lineProgress, 900);
    return (
      <line
        key={`relationship-${index}`}
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={palette.magenta}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={line.strokeDasharray}
        strokeDashoffset={line.strokeDashoffset}
      />
    );
  });
  const nodeGraphics = module.nodes.map((node, index) => {
    const nodeProgress = phaseProgress(
      progress,
      1 + positions.length + module.edges.length + index,
      networkPhaseCount,
    );
    const radius = 48 * nodeProgress;
    const position = positions[index];
    return (
      <React.Fragment key={`${node.label}-${index}`}>
        <circle
          cx={position.x}
          cy={position.y}
          r={radius}
          fill={palette.surface}
          stroke={index % 2 === 0 ? palette.cyan : palette.magenta}
          strokeWidth="7"
        />
        {nodeProgress > 0.45 ? (
          <text
            x={position.x}
            y={position.y + 7}
            fill={palette.text}
            fontSize="30"
            fontWeight="800"
            textAnchor="middle"
          >
            {node.label}
          </text>
        ) : null}
      </React.Fragment>
    );
  });

  return (
    <div style={wrapperStyle}>
      <svg
        viewBox="0 0 1000 560"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {radialLines}
        {relationshipLines}
        <circle
          cx={center.x}
          cy={center.y}
          r={centerRadius}
          fill={palette.background}
          stroke={palette.lime}
          strokeWidth="8"
        />
        {centerProgress > 0.45 ? (
          <text
            x={center.x}
            y={center.y + 10}
            fill={palette.lime}
            fontSize="38"
            fontWeight="900"
            textAnchor="middle"
          >
            {module.centerLabel}
          </text>
        ) : null}
        {nodeGraphics}
      </svg>
    </div>
  );
};

const renderBarTrend = (module, palette, progress) => {
  const wrapperStyle = {
    width: "100%",
    height: "100%",
    padding: "44px 48px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 26,
    borderLeft: `3px solid ${palette.violet}`,
  };
  const rows = module.bars.map((bar, index) => {
    const barProgress = itemProgress(
      progress,
      index,
      module.bars.length,
    );
    const color = index === module.bars.length - 1
      ? palette.lime
      : index % 2 === 0
        ? palette.cyan
        : palette.magenta;
    const rowStyle = {
      display: "grid",
      gridTemplateColumns: "180px 1fr 120px",
      alignItems: "center",
      gap: 20,
      minHeight: 66,
    };
    const labelStyle = {
      color: palette.text,
      fontSize: 34,
      fontWeight: 800,
      opacity: barProgress,
    };
    const railStyle = {
      position: "relative",
      height: 24,
      backgroundColor: `${palette.surface}DD`,
      overflow: "hidden",
    };
    const fillStyle = {
      width: `${bar.relativeValue * barProgress * 100}%`,
      height: "100%",
      backgroundColor: color,
      boxShadow: `0 0 20px ${color}`,
    };
    const displayStyle = {
      color,
      fontSize: 32,
      fontWeight: 900,
      textAlign: "right",
      opacity: barProgress,
    };
    const displayValue =
      typeof bar.displayValue === "string" ? bar.displayValue.trim() : "";
    return (
      <div key={`${bar.label}-${index}`} style={rowStyle}>
        <div style={labelStyle}>{bar.label}</div>
        <div style={railStyle}>
          <div style={fillStyle} />
        </div>
        <div style={displayStyle}>{displayValue}</div>
      </div>
    );
  });

  return <div style={wrapperStyle}>{rows}</div>;
};

const renderSplitComparison = (module, palette, progress) => {
  const leftProgress = itemProgress(progress, 0, 3);
  const rightProgress = itemProgress(progress, 1, 3);
  const bridgeProgress = itemProgress(progress, 2, 3);
  const wrapperStyle = {
    width: "100%",
    height: "100%",
    padding: 44,
    boxSizing: "border-box",
    display: "grid",
    gridTemplateColumns: "0.86fr 1.14fr",
    gridTemplateRows: "1fr auto",
    gap: 18,
  };
  const makePanelStyle = (color, panelProgress) => ({
    padding: 34,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderTop: `6px solid ${color}`,
    borderRight: `1px solid ${color}66`,
    borderBottom: `1px solid ${color}66`,
    borderLeft: `1px solid ${color}66`,
    borderRadius: 10,
    backgroundColor: palette.surface,
    opacity: panelProgress,
    transform: `translateY(${(1 - panelProgress) * 24}px)`,
    ...glowStyle(color, panelProgress >= 1),
  });
  const leftStyle = makePanelStyle(palette.cyan, leftProgress);
  const rightStyle = makePanelStyle(palette.magenta, rightProgress);
  const labelStyle = {
    color: palette.text,
    fontSize: 42,
    fontWeight: 900,
    lineHeight: 1.15,
  };
  const detailStyle = {
    color: palette.surfaceInk,
    fontSize: 30,
    fontWeight: 650,
    lineHeight: 1.35,
  };
  const bridgeStyle = {
    gridColumn: "1 / 3",
    minHeight: 78,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderLeft: `6px solid ${palette.lime}`,
    color: palette.lime,
    backgroundColor: `${palette.background}DD`,
    fontSize: 34,
    fontWeight: 900,
    letterSpacing: 1,
    opacity: bridgeProgress,
    clipPath: `inset(0 ${(1 - bridgeProgress) * 100}% 0 0)`,
  };
  return (
    <div style={wrapperStyle}>
      <div style={leftStyle}>
        <div style={labelStyle}>{module.left.label}</div>
        <div style={detailStyle}>{module.left.detail}</div>
      </div>
      <div style={rightStyle}>
        <div style={labelStyle}>{module.right.label}</div>
        <div style={detailStyle}>{module.right.detail}</div>
      </div>
      <div style={bridgeStyle}>{module.conclusion}</div>
    </div>
  );
};

const renderStepFlow = (module, palette, progress) => {
  const count = module.steps.length;
  const startX = 120;
  const endX = 880;
  const gap = count === 1 ? 0 : (endX - startX) / (count - 1);
  const y = 270;
  const positions = module.steps.map((step, index) => ({
    step,
    x: startX + gap * index,
  }));
  const wrapperStyle = {
    width: "100%",
    height: "100%",
    ...glowStyle(palette.cyan, progress >= 1),
  };
  const flowPhaseCount = count * 2 - 1;
  const connectors = positions.slice(0, -1).map((position, index) => {
    const connectorProgress = phaseProgress(
      progress,
      index * 2 + 1,
      flowPhaseCount,
    );
    const line = neonLine(connectorProgress, 800);
    return (
      <line
        key={`connector-${index}`}
        x1={position.x + 56}
        y1={y}
        x2={positions[index + 1].x - 56}
        y2={y}
        stroke={index % 2 === 0 ? palette.cyan : palette.violet}
        strokeWidth="8"
        strokeLinecap="square"
        strokeDasharray={line.strokeDasharray}
        strokeDashoffset={line.strokeDashoffset}
      />
    );
  });
  const nodes = positions.map((position, index) => {
    const nodeProgress = phaseProgress(
      progress,
      index * 2,
      flowPhaseCount,
    );
    const radius = 52 * nodeProgress;
    const color = index === count - 1
      ? palette.lime
      : index % 2 === 0
        ? palette.cyan
        : palette.magenta;
    return (
      <React.Fragment key={`${position.step.label}-${index}`}>
        <circle
          cx={position.x}
          cy={y}
          r={radius}
          fill={palette.surface}
          stroke={color}
          strokeWidth="8"
        />
        {nodeProgress > 0.45 ? (
          <text
            x={position.x}
            y={y + 10}
            fill={palette.text}
            fontSize="34"
            fontWeight="900"
            textAnchor="middle"
          >
            {index + 1}
          </text>
        ) : null}
        {nodeProgress > 0.45 ? (
          <text
            x={position.x}
            y={y + 112}
            fill={color}
            fontSize="36"
            fontWeight="800"
            textAnchor="middle"
          >
            {position.step.label}
          </text>
        ) : null}
      </React.Fragment>
    );
  });

  return (
    <div style={wrapperStyle}>
      <svg
        viewBox="0 0 1000 560"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {connectors}
        {nodes}
      </svg>
    </div>
  );
};

const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const PLAN = __PLAN_JSON__;
  const progress = (start, frames) =>
    easeOut((frame - start) / Math.max(1, frames));

  const width = PLAN.canvas.width;
  const height = PLAN.canvas.height;
  const safeLeft = width * 0.06;
  const safeWidth = width * 0.88;
  const seriesTop = height * 0.08;
  const textTop = height * 0.15;
  const textHeight = height * 0.27;
  const moduleTop = height * 0.43;
  const moduleHeight = height * 0.33;
  const captionReservedTop = height * 0.78;

  const foundSceneIndex = PLAN.scenes.findIndex(
    (candidate) =>
      frame >= candidate.startFrame && frame < candidate.endFrame,
  );
  const currentSceneIndex =
    foundSceneIndex < 0 ? PLAN.scenes.length - 1 : foundSceneIndex;
  const scene = PLAN.scenes[currentSceneIndex];
  const localFrame = frame - scene.startFrame;
  const sceneProgress =
    currentSceneIndex === 0 ? 1 : easeOut((localFrame + 1) / 6);
  const supportProgress = progress(scene.startFrame + 4, 6);
  const keywordProgresses = scene.keywords.map((keyword) =>
    progress(keyword.startFrame, 6),
  );
  const moduleProgress = progress(scene.startFrame - 1, scene.moduleFrames);

  const seriesText = [props.seriesLabel, props.brandText]
    .filter((value) => typeof value === "string" && value.trim() !== "")
    .join(" · ");
  const keywordColors = [
    props.accentColor,
    props.secondaryColor,
    props.emphasisColor,
  ];
  const NEON_MODULE_RENDERERS = {
    "metric-stack": renderMetricStack,
    "node-network": renderNodeNetwork,
    "bar-trend": renderBarTrend,
    "split-comparison": renderSplitComparison,
    "step-flow": renderStepFlow,
  };
  const renderer =
    NEON_MODULE_RENDERERS[scene.visualModule.type] || renderMetricStack;
  const palette = {
    text: props.textColor,
    cyan: props.accentColor,
    violet: props.secondaryColor,
    magenta: props.emphasisColor,
    lime: props.signalColor,
    surface: props.surfaceColor,
    surfaceInk: props.surfaceInkColor,
    background: props.backgroundColor,
  };
  const moduleGraphic = renderer(
    scene.visualModule,
    palette,
    moduleProgress,
  );

  const rootStyle = {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    backgroundColor: props.transparentBackground
      ? "transparent"
      : props.backgroundColor,
    color: props.textColor,
    fontFamily: props.fontFamily,
  };
  const seriesStyle = {
    position: "absolute",
    left: safeLeft,
    top: seriesTop,
    display: "flex",
    alignItems: "center",
    gap: 14,
    color: props.textColor,
    fontSize: width * 0.024,
    fontWeight: 700,
    letterSpacing: 1.5,
  };
  const seriesMarkStyle = {
    width: 38,
    height: 6,
    backgroundColor: props.accentColor,
    boxShadow: `0 0 16px ${props.accentColor}`,
  };
  const textZoneStyle = {
    position: "absolute",
    left: safeLeft,
    top: textTop,
    width: safeWidth,
    height: textHeight,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 22,
  };
  const kickerStyle = {
    color: props.accentColor,
    fontSize: width * 0.024,
    fontWeight: 800,
    letterSpacing: 2,
    minHeight: width * 0.03,
  };
  const textMaskStyle = {
    maxWidth: safeWidth,
    overflow: "hidden",
    clipPath: `inset(0 ${(1 - sceneProgress) * 100}% 0 0)`,
  };
  const titleStyle = {
    color: props.textColor,
    fontSize: width * 0.064,
    fontWeight: 900,
    lineHeight: 1.1,
    letterSpacing: -1.5,
    whiteSpace: "normal",
    overflowWrap: "break-word",
    textShadow: `0 0 22px ${props.accentColor}33`,
  };
  const supportingStyle = {
    maxWidth: safeWidth * 0.86,
    color: props.surfaceInkColor,
    fontSize: width * 0.029,
    fontWeight: 600,
    lineHeight: 1.4,
    whiteSpace: "normal",
    overflowWrap: "break-word",
    opacity: supportProgress,
    transform: `translateY(${(1 - supportProgress) * 14}px)`,
  };
  const keywordsStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    maxWidth: safeWidth,
  };
  const moduleZoneStyle = {
    position: "absolute",
    left: safeLeft,
    top: moduleTop,
    width: safeWidth,
    height: moduleHeight,
    overflow: "hidden",
  };
  const captionGuardStyle = {
    position: "absolute",
    left: safeLeft,
    top: captionReservedTop,
    width: safeWidth,
    height: height - captionReservedTop,
    pointerEvents: "none",
  };

  const keywordNodes = scene.keywords.map((keyword, index) => {
    const keywordProgress = keywordProgresses[index];
    const keywordStyle = {
      border: `2px solid ${keywordColors[index]}`,
      borderRadius: 4,
      padding: "10px 18px",
      color: index === 0 ? props.backgroundColor : props.textColor,
      backgroundColor:
        index === 0 ? keywordColors[index] : props.surfaceColor,
      fontSize: width * 0.027,
      fontWeight: 800,
      lineHeight: 1,
      boxShadow:
        keywordProgress >= 1
          ? `0 0 18px ${keywordColors[index]}44`
          : "none",
      opacity: keywordProgress,
      transform: `translateY(${(1 - keywordProgress) * 12}px)`,
    };
    return (
      <div key={`${scene.id}-${keyword.text}`} style={keywordStyle}>
        {keyword.text}
      </div>
    );
  });

  return (
    <div style={rootStyle}>
      {seriesText ? (
        <div style={seriesStyle}>
          <div style={seriesMarkStyle} />
          <div>{seriesText}</div>
        </div>
      ) : null}
      <div style={textZoneStyle}>
        <div style={kickerStyle}>{scene.kicker}</div>
        <div style={textMaskStyle}>
          <div style={titleStyle}>{scene.title}</div>
        </div>
        {typeof scene.supportingText === "string" &&
        scene.supportingText.trim() !== "" ? (
          <div style={supportingStyle}>{scene.supportingText}</div>
        ) : null}
        <div style={keywordsStyle}>{keywordNodes}</div>
      </div>
      <div style={moduleZoneStyle}>{moduleGraphic}</div>
      <div style={captionGuardStyle} />
    </div>
  );
};
