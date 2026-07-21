/**
 * Back navigation that survives a deep link.
 *
 * `router.back()` is a no-op when there is no history to pop — which is exactly
 * what happens when a screen is opened directly by URL (a shared link, or the
 * CodeYam preview navigating straight to a route). The back control then looks
 * broken. Falling back to an explicit destination keeps it working either way.
 */
import { router } from 'expo-router';

export function goBackTo(fallback: string) {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace(fallback as Parameters<typeof router.replace>[0]);
}
