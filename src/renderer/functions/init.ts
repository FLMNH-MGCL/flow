export function initTheme(theme: string) {
  if (theme === 'dark') {
    document.querySelector('html')?.classList.add('dark');
  } else {
    document.querySelector('html')?.classList.remove('dark');
  }
}
