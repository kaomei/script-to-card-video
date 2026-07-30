const Component = ({ item }) => {
  const props = item.props || {};
  const rootStyle = {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    background: props.transparentBackground
      ? "transparent"
      : "radial-gradient(circle at 82% 18%, rgba(67,231,255,0.13), transparent 26%), radial-gradient(circle at 18% 74%, rgba(255,79,216,0.09), transparent 24%), linear-gradient(165deg, #0B1728 0%, #06101D 100%)",
  };
  const gridStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(67,231,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(67,231,255,0.035) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
  };
  const horizonStyle = {
    position: "absolute",
    left: "6%",
    right: "6%",
    top: "42%",
    height: 1,
    backgroundColor: "rgba(67,231,255,0.18)",
  };

  return (
    <div style={rootStyle}>
      <div style={gridStyle} />
      <div style={horizonStyle} />
    </div>
  );
};
