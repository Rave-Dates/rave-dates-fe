import { notifyError } from "@/components/ui/toast-notifications";
import { FieldErrors } from "react-hook-form";

export const onInvalid = (errors: FieldErrors<IEventFormData>) => {
  const findFirstError = (obj: FieldErrors): string | null => {
    for (const key in obj) {
      const value = obj[key];

      if (!value) continue;

      if ("message" in value && typeof value.message === "string") {
        return value.message;
      }

      if (typeof value === "object") {
        const nestedError = findFirstError(value as FieldErrors);
        if (nestedError) return nestedError;
      }
    }
    return null;
  };

  const firstErrorMessage = findFirstError(errors);

  if (firstErrorMessage) {
    notifyError(firstErrorMessage);
  } else {
    notifyError("Por favor completá todos los campos requeridos.");
  }
};
