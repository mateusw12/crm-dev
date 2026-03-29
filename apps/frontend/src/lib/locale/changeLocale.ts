export async function changeLocale(locale: string) {
  await fetch('/api/locale', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locale }),
  });
  // Full reload to let next-intl pick up new locale
  if (typeof window !== 'undefined') window.location.reload();
}
