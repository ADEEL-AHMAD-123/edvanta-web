import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/lib/themes';

/**
 * Blocking inline script: runs before first paint and sets `data-theme`
 * on <html> from localStorage, so there is NO flash of the wrong theme
 * on reload. Must be rendered inside <head>.
 */
export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');var valid=['blue','green','purple','orange','dark'];if(!t||valid.indexOf(t)===-1){t='${DEFAULT_THEME}';}document.documentElement.setAttribute('data-theme',t);if(t==='dark'){document.documentElement.style.colorScheme='dark';}}catch(e){document.documentElement.setAttribute('data-theme','${DEFAULT_THEME}');}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
