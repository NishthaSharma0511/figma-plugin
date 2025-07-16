let latestExport: string = '';
let latestFilename: string = 'tokens.json';

const tokenOptions = ['typography', 'colors', 'spacing', 'icons'];
let selectedTokens: Record<string, boolean> = {
  typography: true,
  colors: false,
  spacing: false,
  icons: false,
};

function renderUI() {
  const app = document.getElementById('app');
  app!.innerHTML = `
    <h3>Select what to export:</h3>
    ${tokenOptions.map(
      token =>
        `<label><input type="checkbox" id="chk-${token}" ${
          selectedTokens[token] ? 'checked' : ''
        } /> ${token}</label><br>`
    ).join('')}
    <br>
    <button id="fetchBtn">Generate Tokens</button>
    <button id="downloadBtn" disabled>Download as File</button>
    <pre id="output" style="white-space: pre-wrap; margin-top: 1rem;"></pre>
  `;

  tokenOptions.forEach(token => {
    document.getElementById(`chk-${token}`)?.addEventListener('change', (e: any) => {
      selectedTokens[token] = e.target.checked;
    });
  });

  document.getElementById('fetchBtn')?.addEventListener('click', () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'get-tokens',
          include: selectedTokens
        }
      },
      '*'
    );
  });

  document.getElementById('downloadBtn')?.addEventListener('click', () => {
    downloadFile(latestExport, latestFilename);
  });
}

window.onmessage = (event) => {
  const { type, payload } = event.data.pluginMessage;
  if (type === 'token-data') {
    const pretty = JSON.stringify(payload, null, 2);
    latestExport = pretty;
    latestFilename = 'tokens.json';

    document.getElementById('output')!.textContent = pretty;
    const downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;
    downloadBtn.disabled = false;
  }
};

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

renderUI();
