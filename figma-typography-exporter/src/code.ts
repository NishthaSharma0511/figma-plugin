figma.showUI(__html__, { width: 400, height: 500 });

// 1. Extract Typography
function getTypographyTokens() {
  return figma.getLocalTextStyles().map(style => ({
    type: 'typography',
    name: style.name,
    fontFamily: style.fontName.family,
    fontStyle: style.fontName.style,
    fontSize: `${style.fontSize}px`,
    lineHeight: style.lineHeight.unit === 'PIXELS' ? `${style.lineHeight.value}px` : style.lineHeight.unit,
    letterSpacing: `${style.letterSpacing.value}px`
  }));
}

// 2. Extract Colors
function getColorTokens() {
  return figma.getLocalPaintStyles().map(style => {
    const paint = style.paints[0];
    const rgba = `rgba(${Math.round(paint.color.r * 255)}, ${Math.round(paint.color.g * 255)}, ${Math.round(paint.color.b * 255)}, ${paint.opacity ?? 1})`;
    return {
      type: 'color',
      name: style.name,
      color: rgba
    };
  });
}

// 3. Extract Spacing (assume frames named spacing/...)
function getSpacingTokens() {
  const nodes = figma.root.findAll(node =>
    node.type === "FRAME" && node.name.startsWith("spacing/")
  );
  return nodes.map(node => ({
    type: 'spacing',
    name: node.name.replace("spacing/", ""),
    value: node.width // or height, depending on convention
  }));
}

// 4. Extract Icons (components named icon/*)
async function getIconTokens() {
  const icons = figma.root.findAll(node =>
    node.type === "COMPONENT" && node.name.startsWith("icon/")
  );
  const iconExports = await Promise.all(
    icons.map(async (icon) => {
      const svg = await icon.exportAsync({ format: "SVG" });
      return {
        type: 'icon',
        name: icon.name.replace("icon/", ""),
        svg: new TextDecoder().decode(svg)
      };
    })
  );
  return iconExports;
}

// When UI requests tokens
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'get-tokens') {
    const include = msg.include || {};
    const result: any = {};

    if (include.typography) result.typography = getTypographyTokens();
    if (include.colors) result.colors = getColorTokens();
    if (include.spacing) result.spacing = getSpacingTokens();
    if (include.icons) result.icons = await getIconTokens();

    figma.ui.postMessage({ type: 'token-data', payload: result });
  }
};
