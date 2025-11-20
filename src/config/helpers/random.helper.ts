export class RandomHelper {
  static names = [
    "Alex",
    "Jamie",
    "Jordan",
    "Morgan",
    "Taylor",
    "Casey",
    "Devon",
    "Kelly",
  ];

  static secondNames = [
    "John",
    "Jane",
    "Michael",
    "Sarah",
    "William",
    "Emily",
    "David",
    "Jessica",
  ];

  static domains = [
    "example.com",
    "test.org",
    "mail.com",
    "email.net",
    "website.com",
  ];

  static lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
  ];

  static addNames(newNames: string[]) {
    const setNames = new Set([...this.names, ...newNames]);
    this.names = Array.from(setNames);
  }

  static addLastNames(newLastNames: string[]) {
    const setLastNames = new Set([...this.lastNames, ...newLastNames]);
    this.lastNames = Array.from(setLastNames);
  }

  static addDomains(newDomains: string[]) {
    const setDomains = new Set([...this.domains, ...newDomains]);
    this.domains = Array.from(setDomains);
  }

  /**
   * Genera un número entero aleatorio entre un mínimo y un máximo (inclusive).
   * @param {number} min - El valor mínimo que puede ser generado.
   * @param {number} max - El valor máximo que puede ser generado.
   * @returns {number} Un número entero aleatorio entre min y max.
   */
  static getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Selecciona un elemento aleatorio de un arreglo.
   * @param {T[]} array - El arreglo de donde se seleccionará un elemento aleatorio.
   * @returns {T} Un elemento aleatorio del arreglo proporcionado.
   */
  static getRandomItem<T>(array: T[]): T {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  }

  /**
   * Selecciona un número aleatorio de elementos de un arreglo.
   * @param {T[]} array - El arreglo de donde se seleccionarán los elementos aleatorios.
   * @param {number} count - El número de elementos a seleccionar.
   * @returns {T[]} Un arreglo con los elementos aleatorios seleccionados.
   */
  static getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Mezcla los elementos de un arreglo de forma aleatoria.
   * @param {T[]} array - El arreglo a mezclar.
   * @returns {T[]} El arreglo con los elementos mezclados.
   */
  static shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Genera una cadena aleatoria de caracteres alfanuméricos.
   * @param {number} length - La longitud de la cadena a generar.
   * @returns {string} Una cadena aleatoria de caracteres alfanuméricos.
   */
  static getRandomString(length: number): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  /**
   * Genera un color aleatorio en formato hexadecimal.
   * @returns {string} Un color aleatorio en formato hexadecimal.
   */
  static getRandomColor(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /**
   * Genera un número de teléfono aleatorio de 10 dígitos.
   * @returns {string} Un número de teléfono aleatorio de 10 dígitos.
   */
  static getRandomPhoneNumber(): string {
    let phoneNumber = "";
    for (let i = 0; i < 10; i++) {
      phoneNumber += this.getRandomInteger(0, 9).toString();
    }
    return phoneNumber;
  }

  /**
   * Genera un correo electrónico aleatorio personalizable.
   * @param {number} nameLength - La longitud del nombre en el correo electrónico.
   * @param {number} minDigits - El valor mínimo de dígitos aleatorios.
   * @param {number} maxDigits - El valor máximo de dígitos aleatorios.
   * @returns {string} Un correo electrónico aleatorio.
   */
  static getRandomEmail(
    minDigits: number = 100,
    maxDigits: number = 999,
  ): string {
    if (minDigits < 0 || maxDigits < 0 || minDigits > maxDigits) {
      throw new Error(
        "Parámetros inválidos para generar el correo electrónico.",
      );
    }

    const name = this.getRandomHumanName();
    const lastName = this.getRandomHumanLastName();
    const digits = this.getRandomInteger(minDigits, maxDigits);
    const domain = this.getRandomDomainName();

    return `${name.toLowerCase()}.${lastName.toLowerCase()}${digits}@${domain}`;
  }

  static getRandomHumanName(): string {
    return this.getRandomItem(this.names);
  }

  static getRandomHumanSecondName(): string {
    return this.getRandomItem(this.secondNames);
  }

  static getRandomHumanLastName(): string {
    return this.getRandomItem(this.lastNames);
  }

  static getRandomDomainName(): string {
    return this.getRandomItem(this.domains);
  }

  static getRandomEnrollmentNumber(): string {
    const prefix = "CSM";
    const currentYear = new Date().getFullYear().toString().substring(-2);
    let words = "";

    for (let i = 0; i < 3; i++) {
      words += this.getRandomInteger(0, 9);
    }

    return `${prefix}${currentYear}${words}`;
  }

  static getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static generatePropertyCode = (): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const segments = [
      Array(2)
        .fill(null)
        .map(() => characters[Math.floor(Math.random() * characters.length)])
        .join(""),
      Array(2)
        .fill(null)
        .map(() => characters[Math.floor(Math.random() * characters.length)])
        .join(""),
      Array(2)
        .fill(null)
        .map(() => characters[Math.floor(Math.random() * characters.length)])
        .join(""),
    ];
    return segments.join("");
  };

  static generateCode = (prefix: string, totalLength: number): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    if (prefix.length >= totalLength) {
      return prefix.toUpperCase().slice(0, totalLength);
    }
    const remainingLength = totalLength - prefix.length;
    const randomSegment = () =>
      Array(remainingLength)
        .fill(null)
        .map(() => characters[Math.floor(Math.random() * characters.length)])
        .join("");

    return prefix.toUpperCase() + randomSegment().slice(0, remainingLength);
  };
}
