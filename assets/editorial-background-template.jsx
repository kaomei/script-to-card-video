const Component = ({ item }) => {
  const props = item.props || {};

  const paperGrid =
    "linear-gradient(90deg, rgba(87,50,37,0.045) 1px, transparent 1px), linear-gradient(rgba(87,50,37,0.045) 1px, transparent 1px)";
  const baseBackground =
    "radial-gradient(circle at 18% 18%, rgba(244,153,79,0.22), transparent 26%), linear-gradient(180deg, #F8F1E6 0%, #F5ECDE 100%)";

  const rootStyle = {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    background: props.transparentBackground ? "transparent" : baseBackground,
  };
  const gridStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: paperGrid,
    backgroundSize: "32px 32px",
  };
  const grainStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: "radial-gradient(circle, rgba(87,50,37,0.09) 0 1px, transparent 1.4px)",
    backgroundSize: "13px 14px",
    opacity: 0.12,
  };

  return (
    <div style={rootStyle}>
      <div style={gridStyle} />
      <div style={grainStyle} />
    </div>
  );
};
