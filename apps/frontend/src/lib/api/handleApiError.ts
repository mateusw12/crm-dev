import { showError, showGeneric } from '@/components/shared/notification/notificationService';

/**
 * Extracts the error key thrown by the backend (e.g. "error.companyNotFound")
 * and shows a translated notification via NotificationProvider.
 *
 * Usage inside catch blocks:
 *   } catch (error) {
 *     if (error?.errorFields) return; // skip Antd form validation errors
 *     handleApiError(error);
 *   }
 */
export function handleApiError(error: unknown): void {
  if (error instanceof Error && error.message) {
    const msg = error.message;
    // Only pass as messageKey if it looks like a backend i18n key
    if (msg.startsWith('error.')) {
      showError({ messageKey: msg });
    } else {
      // Generic server message — show raw without translation lookup
      showGeneric({ message: 'Error', description: msg });
    }
  } else {
    showError();
  }
}
