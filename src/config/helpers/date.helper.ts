import { MONTHS, WEEK_DAYS } from '@/config/constants/time.constants';
import { RandomHelper } from '@/config/helpers/random.helper';
import { CustomOption } from '@/domain/interfaces/custom-option.interface';

export class DateHelper {
  /**
   * Genera un arreglo con los próximos 7 días, incluyendo el día actual.
   * @returns {Date[]} Arreglo de objetos Date para los próximos 7 días.
   */
  static getNext7Days(): Date[] {
    const today = this.getStartOfDay(new Date());
    const days = [today]; // Iniciar con el día de hoy

    for (let i = 1; i <= 6; i++) {
      const nextDay = new Date(today);

      nextDay.setDate(today.getDate() + i);
      days.push(nextDay);
    }

    return days;
  }

  /**
   * Ajusta la hora de una fecha dada a las 00:00:00.
   * @param {Date} date - Fecha a ajustar.
   * @returns {Date} Fecha ajustada al inicio del día.
   */
  static getStartOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  /**
   * Verifica si dos fechas corresponden al mismo día.
   * @param {Date} date1 - Primera fecha para comparar.
   * @param {Date} date2 - Segunda fecha para comparar.
   * @returns {boolean} Verdadero si las fechas son el mismo día.
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Genera un intervalo de tiempo aleatorio dentro de los próximos 7 días.
   * @returns {object} Objeto con la fecha seleccionada y los intervalos de tiempo de inicio y fin.
   */
  static getRandomDateTimeInterval() {
    const hours: number[] = [10, 11, 12, 13, 16, 17, 18, 19];
    const days = this.getNext7Days();
    const selectedDay = RandomHelper.getRandomItem(days);
    const selectedHour = RandomHelper.getRandomItem(hours);

    const year = selectedDay.getFullYear();
    const month = selectedDay.getMonth() + 1;
    const day = selectedDay.getDate();

    const startHour = new Date(
      `${year}-${this.formatTime(month)}-${this.formatTime(
        day
      )}T${this.formatTime(selectedHour)}:00`
    );
    const endHour = new Date(
      `${year}-${this.formatTime(month)}-${this.formatTime(
        day
      )}T${this.formatTime(selectedHour)}:55`
    );

    return {
      day: selectedDay,
      startTime: startHour,
      endTime: endHour
    };
  }

  /**
   * Formatea un número a un formato de dos dígitos como string.
   * @param {number} time - Número a formatear.
   * @returns {string} String de dos dígitos del tiempo.
   */
  static formatTime(time: number): string {
    return time < 10 ? `0${time}` : time.toString();
  }

  /**
   * Añade una cantidad específica de días a una fecha.
   * @param {Date} date - Fecha a la que se añadirán días.
   * @param {number} days - Cantidad de días a añadir.
   * @returns {Date} Fecha con los días añadidos.
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);

    result.setDate(result.getDate() + days);

    return result;
  }

  /**
   * Resta una cantidad específica de días a una fecha.
   * @param {Date} date - Fecha a la que se restarán días.
   * @param {number} days - Cantidad de días a restar.
   * @returns {Date} Fecha con los días restados.
   */
  static subtractDays(date: Date, days: number): Date {
    return this.addDays(date, -days);
  }

  /**
   * Obtiene el primer día de la semana para una fecha dada.
   * @param {Date} date - Fecha para calcular el primer día de la semana.
   * @param {number} firstDayOfWeek - Día que se considerará como el primer día de la semana (0 = Domingo, 1 = Lunes, etc.).
   * @returns {Date} Fecha correspondiente al primer día de la semana.
   */
  static getStartOfWeek(date: Date, firstDayOfWeek = 0): Date {
    const result = new Date(date);

    result.setDate(
      result.getDate() - ((result.getDay() - firstDayOfWeek + 7) % 7)
    );

    return this.getStartOfDay(result);
  }

  /**
   * Obtiene el último día de la semana para una fecha dada.
   * @param {Date} date - Fecha para calcular el último día de la semana.
   * @param {number} lastDayOfWeek - Día que se considerará como el último día de la semana (6 = Sábado, 5 = Viernes, etc.).
   * @returns {Date} Fecha correspondiente al último día de la semana.
   */
  static getEndOfWeek(date: Date, lastDayOfWeek = 6): Date {
    const startOfWeek = this.getStartOfWeek(date, lastDayOfWeek - 6);

    return this.addDays(startOfWeek, 6);
  }

  /**
   * Obtiene el primer día del mes para una fecha dada.
   * @param {Date} date - Fecha para calcular el primer día del mes.
   * @returns {Date} Fecha correspondiente al primer día del mes.
   */
  static getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  /**
   * Obtiene el último día del mes para una fecha dada.
   * @param {Date} date - Fecha para calcular el último día del mes.
   * @returns {Date} Fecha correspondiente al último día del mes.
   */
  static getEndOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  /**
   * Calcula la cantidad de días entre dos fechas.
   * @param {Date} date1 - Primera fecha para la comparación.
   * @param {Date} date2 - Segunda fecha para la comparación.
   * @returns {number} Número de días entre las dos fechas.
   */
  static daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    const timeDiff = date2.getTime() - date1.getTime();

    return Math.round(Math.abs(timeDiff / oneDay));
  }

  /**
   * Formatea una fecha a una cadena de texto según el formato especificado.
   * @param {Date} date - Fecha a formatear.
   * @param {string} [format='yyyy-MM-dd'] - Formato deseado para la fecha.
   * @returns {string} Fecha formateada como texto.
   */
  static formatDate(date: Date, format = 'MM/dd/yyyy'): string {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    return format
      .replace('dd', day < 10 ? `0${day}` : day.toString())
      .replace('MM', month < 10 ? `0${month}` : month.toString())
      .replace('yyyy', year.toString());
  }

  /**
   * Formatea una fecha a una cadena de texto en hora local, incluyendo horas, minutos y segundos.
   * @param {Date} date - Fecha a formatear.
   * @param {string} [format='dd/MM/yyyy HH:mm:ss'] - Formato deseado para la fecha.
   * @returns {string} Fecha y hora formateadas como texto.
   */
  static formatDateTimeLocal(date: Date, format = 'MM/dd/yyyy'): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return format
      .replace('dd', day < 10 ? `0${day}` : day.toString())
      .replace('MM', month < 10 ? `0${month}` : month.toString())
      .replace('yyyy', year.toString())
      .replace('HH', hours < 10 ? `0${hours}` : hours.toString())
      .replace('mm', minutes < 10 ? `0${minutes}` : minutes.toString())
      .replace('ss', seconds < 10 ? `0${seconds}` : seconds.toString());
  }

  /**
   * Verifica si una cadena de texto representa una fecha válida.
   * @param {string} dateString - Cadena de texto para verificar.
   * @returns {boolean} Verdadero si la cadena representa una fecha válida.
   */
  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);

    return !isNaN(date.getTime());
  }

  /**
   * Determina si una fecha es anterior a otra.
   * @param {Date} date1 - Fecha a comparar.
   * @param {Date} date2 - Fecha contra la que se compara.
   * @returns {boolean} Verdadero si date1 es anterior a date2.
   */
  static isBefore(date1: Date, date2: Date): boolean {
    return date1 < date2;
  }

  /**
   * Determina si una fecha es posterior a otra.
   * @param {Date} date1 - Fecha a comparar.
   * @param {Date} date2 - Fecha contra la que se compara.
   * @returns {boolean} Verdadero si date1 es posterior a date2.
   */
  static isAfter(date1: Date, date2: Date): boolean {
    return date1 > date2;
  }

  /**
   * Obtiene el nombre del día de la semana para una fecha dada.
   * @param {string} date - Fecha en formato de cadena.
   * @returns {string} Nombre del día de la semana.
   */
  public static getWeekday(date: string): string {
    const day = new Date(date).getDay();

    return WEEK_DAYS[day];
  }

  public static getWeekdayByDay(day: 0 | 1 | 2 | 3 | 4 | 5 | 6): string {
    return WEEK_DAYS[day];
  }

  /**
   * Formatea y retorna un rango de tiempo entre dos horas dadas.
   * @param {Date} startTime - Hora de inicio.
   * @param {Date} endTime - Hora de fin.
   * @returns {string} Rango de tiempo en formato legible.
   */
  public static formatTimeRange(startTime: Date, endTime: Date): string {
    const formattedStartTime = this.formatHourMinute(startTime);
    const formattedEndTime = this.formatHourMinute(endTime);

    return `${formattedStartTime} - ${formattedEndTime}`;
  }

  /**
   * Formatea y retorna la hora y minutos de una fecha dada.
   * @param {Date} date - Fecha y hora a formatear.
   * @returns {string} Hora y minutos en formato legible.
   */
  private static formatHourMinute(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'UTC'
    };

    return date.toLocaleTimeString(undefined, options);
  }

  static getMonthName(date: Date): string {
    const monthIndex = date.getUTCMonth();

    return MONTHS[monthIndex];
  }

  static getYear(date: Date): number {
    return date.getFullYear();
  }

  static getMonth(date: Date): number {
    return date.getMonth() + 1;
  }

  static getDay(date: Date): number {
    return date.getDate();
  }

  static getMonthsOptions(): CustomOption[] {
    return MONTHS.map((month, index) => ({
      value: String(index + 1),
      label: month
    }));
  }
}
