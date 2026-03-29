import { showError } from '@/components/shared/notification/notificationService';

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
    showError({ messageKey: error.message });
  } else {
    showError();
  }
}
