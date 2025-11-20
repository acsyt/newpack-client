import { RegularExp } from "../regex/regular-exp";

export class ValidationHelper {
  // Verifica si una dirección de correo electrónico es válida.
  static isValidEmail(email: string): boolean {
    return RegularExp.email.test(email);
  }

  // Verifica si un número de teléfono es válido.
  static isValidPhoneNumber(phoneNumber: string): boolean {
    return RegularExp.phoneNumber.test(phoneNumber);
  }

  // Verifica si una contraseña cumple con los requisitos establecidos.
  static isValidPassword(password: string): boolean {
    return RegularExp.password.test(password);
  }

  static isBoolean(value: string): boolean {
    switch (value?.toLowerCase()?.trim()) {
      case "true":
      case "yes":
      case "1":
        return true;
      case "false":
      case "no":
      case "0":
      case null:
      case undefined:
        return false;
      default:
        return JSON.parse(value);
    }
  }

  /**
   * Verifica si una cadena representa un número entero.
   * @param {string} value - Cadena a verificar.
   * @returns {boolean} Verdadero si la cadena es un número entero.
   */
  static isInteger(value: string): boolean {
    return RegularExp.integer.test(value);
  }

  static isNumeric(value: string): boolean {
    return !isNaN(parseFloat(value)) && isFinite(Number(value));
  }

  static isPostalCode(value: string): boolean {
    return RegularExp.postalCode.test(value);
  }

  static isStringNullOrVoid(value: string): boolean {
    const cleanValue = value.trim();
    return cleanValue == null || cleanValue == "";
  }

  static isValidCurp(curpToValidate: string): boolean {
    const isCurpValid = curpToValidate.match(RegularExp.curp);
    if (!isCurpValid) return false;

    function calculateVerifyingDigit(incompleteCurp: string): number {
      const dictionary = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
      let lnSum = 0.0;
      let lnDigt = 0.0;
      for (let i = 0; i < 17; i++) {
        lnSum += dictionary.indexOf(incompleteCurp.charAt(i)) * (18 - i);
      }

      lnDigt = 10 - (lnSum % 10);
      if (lnDigt === 10) return 0;
      return lnDigt;
    }

    return (
      isCurpValid &&
      parseInt(isCurpValid[2], 10) === calculateVerifyingDigit(isCurpValid[1])
    );
  }
  /**
   * Compara dos objetos para determinar si hay cambios.
   * @param {Object} original - Objeto original.
   * @param {Object} current - Objeto actual.
   * @returns {boolean} Verdadero si hay al menos un cambio.
   */
  static hasChanges(
    original: Record<string, any>,
    current: Record<string, any>,
  ): boolean {
    const keys = new Set([...Object.keys(original), ...Object.keys(current)]);

    for (const key of keys) {
      if (original[key] !== current[key]) {
        return true;
      }
    }

    return false;
  }
}
