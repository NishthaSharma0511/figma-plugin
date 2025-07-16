figma.showUI(__html__, { width: 400, height: 300 });

console.log('[Plugin] ✅ code.ts loaded');

figma.ui.onmessage = async (msg) => {
  console.log('[Plugin] 📩 Received message ▶', msg);

  if (msg.type === 'get-typography-tokens') {
    const framework = msg.framework;

    const typographyTokens = extractTypographyTokens();
    const colorTokens = extractColorTokens();
    const spacingTokens = extractSpacingTokens();
    const iconTokens = extractIconTokens();

    const payload = {
      typography: formatTokens(typographyTokens, framework, 'typography'),
      colors: formatTokens(colorTokens, framework, 'colors'),
      spacing: formatTokens(spacingTokens, framework, 'spacing'),
      icons: formatTokens(iconTokens, framework, 'icons'),
    };

    figma.ui.postMessage({ type: 'tokens-ready', payload });
  }
};

function extractTypographyTokens() {
  return figma.getLocalTextStyles().map(style => ({
    name: style.name,
    fontSize: style.fontSize,
    fontName: style.fontName,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
  }));
}

function extractColorTokens() {
  return figma.getLocalPaintStyles().map(style => ({
    name: style.name,
    color: (style.paints[0].type === 'SOLID') ? style.paints[0].color : null,
  }));
}

function extractSpacingTokens() {
  return [
    { name: 'spacing-xs', value: '4px' },
    { name: 'spacing-sm', value: '8px' },
    { name: 'spacing-md', value: '16px' },
    { name: 'spacing-lg', value: '32px' }
  ];
}

function extractIconTokens() {
  return figma.currentPage.findAll(node =>
    node.type === "COMPONENT" && node.name.toLowerCase().includes("icon")
  ).map(icon => ({
    name: icon.name,
    id: icon.id,
  }));
}

function formatTokens(tokens: any[], framework: string, type: string) {
  switch (framework) {
    case 'Tailwind':
      return tokens.map(t => `${type}-${t.name.replace(/\s+/g, '-').toLowerCase()}: ${t.value || t.fontSize || '...'};`).join('\n');
    case 'CSS Variables':
      return tokens.map(t => `--${type}-${t.name.replace(/\s+/g, '-').toLowerCase()}: ${t.value || t.fontSize || '...'};`).join('\n');
    case 'SCSS':
      return tokens.map(t => `$${type}-${t.name.replace(/\s+/g, '-').toLowerCase()}: ${t.value || t.fontSize || '...'};`).join('\n');
    case 'TypeScript Tokens':
      return `export const ${type}Tokens = {\n` +
        tokens.map(t => `  "${t.name.replace(/\s+/g, '_')}": "${t.value || t.fontSize || '...'}"`).join(',\n') +
        `\n};`;
    default:
      return '';
  }
}
