import type {
  FieldErrors,
  FieldValues,
  UseFormSetError,
  Path
} from 'react-hook-form';

import { toast } from 'sonner';

export class FormHelper {
  private static findFirstErrorMessage(errorNode: any): string | null {
    if (!errorNode || typeof errorNode !== 'object') return null;

    if (typeof errorNode.message === 'string') {
      return errorNode.message;
    }

    for (const value of Object.values(errorNode)) {
      const message = this.findFirstErrorMessage(value);

      if (message) {
        return message;
      }
    }

    return null;
  }

  static showFirstFormError<T extends FieldValues>(
    errors: FieldErrors<T>,
    title: string = 'Validation Error'
  ) {
    const errorMessage = FormHelper.findFirstErrorMessage(errors);

    if (errorMessage) {
      toast.error(errorMessage);
    }
  }

  static setFormErrors<T extends FieldValues>(
    errors: Record<string, string[]>,
    setError: UseFormSetError<T>
  ) {
    for (const key in errors) {
      const message = errors[key]?.[0];

      if (message) {
        setError(key as Path<T>, { type: 'manual', message });
      }
    }
  }
}
