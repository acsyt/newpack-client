import {
  DAY_MS,
  HOUR_MS,
  MINUTE_MS,
  MONTH_MS,
  SECOND_MS,
  WEEK_MS,
  YEAR_MS,
} from "@/config/constants/time.constants";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export class HumanFormats {
  private static humanSuffixes: Record<number, string> = {
    1: "1er",
    2: "2do",
    3: "3er",
    4: "4to",
    5: "5to",
    6: "6to",
    7: "7mo",
    8: "8vo",
    9: "9no",
    10: "10mo",
  };

  /**
   * Formatea una cantidad de dinero a un formato de moneda legible con localización y símbolo de moneda.
   * @param {number} amount - La cantidad de dinero a formatear.
   * @param {number} [decimals=2] - Número de decimales a mostrar.
   * @param {string} [currency='USD'] - El código de la moneda a utilizar.
   * @param {string} [locale='en-US'] - La localización para el formato.
   * @returns {string} La cantidad de dinero formateada en el formato de moneda local. Ejemplo: $1,000.00
   */

  static humanReadableMoney(
    amount: number,
    decimals = 2,
    currency = "USD",
    locale = "en-US",
  ): string {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  }

  /**
   * Convierte una fecha a un formato de fecha corto y legible según la localización especificada.
   * @param {Date} date - La fecha a formatear.
   * @param {string} [locale='es-ES'] - La localización para el formato de la fecha.
   * @returns {string} La fecha formateada en un formato corto y legible. Ejemplo: 1 ene 2020
   */
  static humanReadableShortDate(date: Date, locale = "es-ES"): string {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }
  /**
   * Convierte una fecha a un formato de fecha corto y legible según la localización especificada.
   * @param {Date} date - La fecha a formatear.
   * @param {string} [locale='es-ES'] - La localización para el formato de la fecha.
   * @returns {string} La fecha formateada en un formato corto y legible. Ejemplo: 1 de enero de 2020
   */
  static humanReadableLongDate(date: Date, locale = "es-ES"): string {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }

  static getCurrentTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  /**
   * Convierte una fecha y hora a un formato detallado y legible según la localización especificada, incluyendo el meridiano.
   * @param {Date} date - La fecha y hora a formatear.
   * @param {string} [locale='es-ES'] - La localización para el formato de la fecha y hora.
   * @returns {string} La fecha y hora formateada de manera detallada y legible. Ejemplo: 23/02/24 - 10:24 a.m.
   */
  static humanReadableDateTimeWithMeridiem(
    date: Date,
    locale = "en-US", // Cambiado a "en-US" para formato de Estados Unidos
    _timeZone = "America/Monterrey",
  ): string {
    const currentTimeZone = HumanFormats.getCurrentTimezone();
    const options: Intl.DateTimeFormatOptions = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: currentTimeZone,
    };

    const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);
    const parts = formattedDate.match(/(\d+\/\d+\/\d+),\s(\d+:\d+)\s(.M)/);

    if (parts) {
      return `${parts[1]} - ${parts[2]} ${parts[3].toLowerCase()}`; // '02/23/24 - 10:24 a.m.'
    }

    return formattedDate;
  }

  static humanReadableTime(date: Date, locale = "es-ES"): string {
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      hour12: false,
    }).format(date);
  }

  /**
   * Format YYYY-MM-DD HH:ii:ss to DD/MM/YYYY, HH:ii
   * @param date string
   * @returns string
   */
  static formatMySqlDate = (date: any) => {
    const parts = date.split(" ");
    const hasTime = parts.length === 2;
    let toreturn = "";
    if (hasTime) {
      const timeParts = parts[1].split(":");
      const hour = timeParts[0];
      const minute = timeParts[1];
      // const seconds = timeParts[2];
      toreturn = `, ${hour}:${minute}`;
    }
    const dateParts = parts[0].split("-");
    const month = dateParts[1];
    const year = dateParts[0];
    const day = dateParts[2];
    const lastYearDigits = year.slice(-2);
    toreturn = `${day}/${month}/${lastYearDigits}${toreturn}`;
    return toreturn;
  };

  /**
   * Convierte un número a un formato de porcentaje legible.
   * @param {number} percentage - El número a convertir en porcentaje.
   * @returns {string} El número formateado como un porcentaje. Ejemplo: 10.00%
   */
  static humanReadablePercentage(percentage: number, decimals = 2): string {
    if (percentage === 0) {
      return "0%";
    } else if (percentage > 0 && percentage < 1) {
      return (percentage * 100).toFixed(decimals) + "%";
    } else {
      if (percentage === 1) return "100%";
      return percentage.toFixed(decimals) + "%";
    }
  }

  /**
   * Calcula y formatea el tiempo restante de mili segundos a una forma legible de duración.
   * @param {number} totalMilliseconds - El total de mili segundos a convertir.
   * @returns {string} Una cadena de texto representando el tiempo restante en años, meses, días, etc. Ejemplo: 1 año 2 meses 3 días
   */
  static humanReadableTimeLeft(totalMilliseconds: number): string {
    let timeString = "";
    const units = [
      { label: "año", ms: YEAR_MS },
      { label: "mes", ms: MONTH_MS },
      { label: "semana", ms: WEEK_MS },
      { label: "día", ms: DAY_MS },
      { label: "hora", ms: HOUR_MS },
      { label: "minuto", ms: MINUTE_MS },
      { label: "segundo", ms: SECOND_MS },
    ];

    for (const { label, ms } of units) {
      const count = Math.floor(totalMilliseconds / ms);
      if (count > 0) {
        timeString += `${this.pluralize(count, label, label + "s")} `;
        totalMilliseconds -= count * ms;
      }
    }
    return timeString.trim();
  }

  /**
   * Formatea la diferencia entre la fecha actual y una fecha pasada a una cadena legible de tiempo relativo.
   * @param {Date} pastDate - La fecha pasada para comparar con el tiempo actual.
   * @returns {string} Una cadena de texto representando el tiempo transcurrido desde la fecha dada. Ejemplo: hace 1 día
   */
  static humanReadableRelativeTime(pastDate: Date): string {
    const currentDate = new Date();
    const timeElapsed = currentDate.getTime() - pastDate.getTime();
    const elapsedSeconds = Math.floor(timeElapsed / 1000);

    if (elapsedSeconds < 60) {
      return "hace menos de un minuto";
    } else if (elapsedSeconds < 3600) {
      const minutes = Math.floor(elapsedSeconds / 60);
      return `hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
    } else if (elapsedSeconds < 86400) {
      const hours = Math.floor(elapsedSeconds / 3600);
      return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
    } else {
      const days = Math.floor(elapsedSeconds / 86400);
      return `hace ${days} ${days === 1 ? "día" : "días"}`;
    }
  }

  /**
   * Convierte un número en singular o plural basado en su cantidad.
   * @param {number} count - La cantidad para determinar si usar singular o plural.
   * @param {string} singular - La forma singular de la palabra.
   * @param {string} [plural=singular + 's'] - La forma plural de la palabra.
   * @param {boolean} [formatNumber=false] - Si se debe formatear el número con comas.
   * @returns {string} La palabra en singular o plural basado en la cantidad proporcionada. Ejemplo: 1 día, 2 días
   */
  static pluralize(
    count: number,
    singular: string,
    plural: string = singular + "s",
    formatNumber: boolean = false,
  ): string {
    const formattedCount = formatNumber
      ? this.humanReadableMoney(count, 0).replace("$", "")
      : count.toString();
    return `${formattedCount} ${count === 1 ? singular : plural}`;
  }

  /**
   * Formatea números grandes a un formato corto y legible con sufijos como K, M, B, etc.
   * @param {number} number - El número a formatear.
   * @param {number} [decimals=2] - El número de decimales a mostrar.
   * @returns {string} El número formateado con el sufijo apropiado. Ejemplo: 1,000,000 -> 1M
   */
  static humanReadableLargeNumber(number: number, decimals = 2): string {
    if (number < 1000) return number.toFixed(decimals); // Menos de 1000
    const suffixes = ["", "K", "M", "B", "T"];
    const i = Math.floor(Math.log(number) / Math.log(1000));
    return (number / Math.pow(1000, i)).toFixed(decimals) + suffixes[i];
  }

  /**
   * Convierte una cantidad de mili segundos a una cadena legible de tiempo exacto en horas, minutos y segundos.
   * @param {number} milliseconds - La cantidad de mili segundos a convertir.
   * @returns {string} Una cadena de texto representando el tiempo exacto en horas, minutos y segundos. Ejemplo: 1 hora 2 minutos 3 segundos
   */
  static humanReadableExactTime(milliseconds: number): string {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    return `${hours > 0 ? this.pluralize(hours, "hora", "horas") + " " : ""}${
      minutes > 0 ? this.pluralize(minutes, "minuto", "minutos") + " " : ""
    }${
      seconds > 0 ? this.pluralize(seconds, "segundo", "segundos") : ""
    }`.trim();
  }

  /**
   * Formatea un tamaño de archivo en bytes a un formato legible (KB, MB, GB, etc.).
   * @param {number} bytes - El tamaño del archivo en bytes.
   * @param {number} [decimals=2] - Número de decimales a mostrar.
   * @returns {string} El tamaño del archivo formateado en la unidad apropiada. Ejemplo: '1.95 MB'
   */
  static humanReadableFileSize(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  /**
   * Convierte la temperatura entre Celsius, Fahrenheit y Kelvin.
   * @param {number} temperature - La temperatura a convertir.
   * @param {string} fromUnit - La unidad de origen ('C', 'F', 'K').
   * @param {string} toUnit - La unidad de destino ('C', 'F', 'K').
   * @returns {number} La temperatura convertida.
   */
  static convertTemperature(
    temperature: number,
    fromUnit: string,
    toUnit: string,
  ): number {
    if (fromUnit === toUnit) return temperature;

    let celsius;
    if (fromUnit === "C") {
      celsius = temperature;
    } else if (fromUnit === "F") {
      celsius = (temperature - 32) * (5 / 9);
    } else {
      // 'K'
      celsius = temperature - 273.15;
    }

    if (toUnit === "C") {
      return celsius;
    } else if (toUnit === "F") {
      return celsius * (9 / 5) + 32;
    } else {
      // 'K'
      return celsius + 273.15;
    }
  }

  /**
    Convierte fechas a un estilo común en redes sociales.
    @param {Date} date - La fecha a formatear.
    @returns {string} La fecha en formato de redes sociales.
  */
  static formatSocialMediaDate(date: Date): string {
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) {
      return "hace un momento";
    } else if (seconds < 3600) {
      return `hace ${Math.floor(seconds / 60)} minutos`;
    } else if (seconds < 86400) {
      return `hace ${Math.floor(seconds / 3600)} horas`;
    } else {
      return `hace ${Math.floor(seconds / 86400)} días`;
    }
  }

  static convertIndexToLetter(index: number): string {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[index];
  }

  static convertNumberToOrdinal(number: number): string {
    const ordinals = [
      "primero",
      "segundo",
      "tercero",
      "cuarto",
      "quinto",
      "sexto",
      "séptimo",
      "octavo",
      "noveno",
      "décimo",
    ];

    return number > 0 && number <= ordinals.length
      ? ordinals[number - 1]
      : "Número fuera de rango";
  }

  static convertNumberToPaddedString(number: number): string {
    return number.toString().padStart(2, "0");
  }

  static convertNumberToRoman(number: number): string {
    const romanNumerals = [
      ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
      ["X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"],
      ["C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"],
      ["M", "MM", "MMM"],
    ];

    const digits = number
      .toString()
      .split("")
      .reverse()
      .map((d) => parseInt(d));

    return digits
      .map((d, i) => romanNumerals[i][d - 1])
      .reverse()
      .join("");
  }

  static humanReadableSuffix(count: number): string {
    return this.humanSuffixes[count] ?? `${count}°`;
  }

  static maskPhone = (phone: string) => {
    return phone.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2");
  };

  static maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    return `${name.substring(0, 2)}****@${domain}`;
  };

  /**
   * Formats a date string or Date object to MM/DD/YYYY format using the current timezone.
   * @param {string | Date} date - The date to format.
   * @returns {string} The date formatted as MM/DD/YYYY. Example: 03/15/2024
   */
  static formatUSDate(
    date: string | Date,
    format: string = "MM/DD/YYYY",
  ): string {
    return dayjs(date).tz(dayjs.tz.guess()).format(format);
  }

  /**
   * Mostrar fecha sin formato, solo mostrar la fecha sin el tiempo.
   * @param {string | Date} date - The date to format.
   * @returns {string} The date formatted as MM/DD/YYYY. Example: 03/15/2024
   */
  static onlyDate(date: string | Date): string {
    return dayjs.utc(date).format("MM/DD/YYYY");
  }
}
