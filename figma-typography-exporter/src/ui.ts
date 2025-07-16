console.log('[UI-inline] ✅ script loaded');

const fetchButton = document.getElementById('fetch') as HTMLButtonElement;
const frameworkDropdown = document.getElementById('framework') as HTMLSelectElement;

fetchButton?.addEventListener('click', () => {
  const framework = frameworkDropdown?.value || 'Tailwind';
  console.log('[UI-inline] ▶️ Clicked');
  parent.postMessage({
    pluginMessage: {
      type: 'get-typography-tokens',
      framework,
    },
  }, '*');
});