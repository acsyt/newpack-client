export class ParserHelper {
  /**
   * Parsea un string a un número flotante.
   * @param {string} input - El string a parsear.
   * @returns {number|null} El número flotante parseado o null si no es válido.
   */
  static parseFloatingPoint(input: string): number | null {
    // Eliminar los separadores de miles y otros caracteres no numéricos
    const cleanedInput = input.replace(/[^0-9.-]/g, "");
    const parsed = parseFloat(cleanedInput);
    // Verificar si el resultado es un número válido
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Parsea un string a un número entero.
   * @param {string} input - El string a parsear.
   * @returns {number|null} El número entero parseado o null si no es válido.
   */
  static parseInteger(input: string): number | null {
    // Eliminar los separadores de miles y otros caracteres no numéricos
    const cleanedInput = input.replace(/[^0-9-]/g, "");
    const parsed = parseInt(cleanedInput, 10);
    // Verificar si el resultado es un número válido
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Parsea un string a una fecha.
   * @param {string} input - El string de fecha a parsear.
   * @returns {Date|null} La fecha parseada o null si no es válida.
   */
  static parseDate(input: string): Date | null {
    const date = new Date(input);
    // Verificar si el resultado es una fecha válida
    return isNaN(date.getTime()) ? null : date;
  }

  /**
   * Elimina los espacios en blanco extra y caracteres no deseados de un string.
   * @param {string} input - El string a limpiar.
   * @returns {string} El string limpiado.
   */
  static sanitizeString(input: string): string {
    // Eliminar espacios en blanco extra y otros caracteres no deseados
    return input.trim().replace(/[^a-zA-Z0-9\s]/g, "");
  }

  static generateSlug(name: string): string {
    return name
      .toLowerCase() // Convertir a minúsculas
      .trim() // Eliminar espacios en blanco al inicio y al final
      .replace(/[^a-z0-9\s-]/g, "") // Eliminar caracteres no alfanuméricos
      .replace(/\s+/g, "-") // Reemplazar espacios por guiones
      .replace(/-+/g, "-"); // Reemplazar múltiples guiones por uno solo
  }
}
