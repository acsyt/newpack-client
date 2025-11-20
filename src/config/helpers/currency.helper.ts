const convertNumberToWords = (amount: number): string => {
  const currencyData = {
    amount: amount,
    integers: Math.floor(amount),
    cents: Math.round(amount * 100) - Math.floor(amount) * 100,
    decimalLetters: "",
  };

  if (currencyData.cents > 0)
    currencyData.decimalLetters = convertToMillions(currencyData.cents);

  let numberInWords = "";

  if (currencyData.integers == 0) numberInWords = "CERO";
  else if (currencyData.integers == 1)
    numberInWords = convertToMillions(currencyData.integers);
  else numberInWords = convertToMillions(currencyData.integers);

  const mexicanCurrencyFormatter = new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedAmount = mexicanCurrencyFormatter
    .format(parseFloat(amount.toString()))
    .split(".");

  formattedAmount[1] = isNaN(parseInt(formattedAmount[1]))
    ? "00"
    : formattedAmount[1];

  if (numberInWords === "UN")
    return `UN PESO CON ${formattedAmount[1]}/100 M.N.`;

  return `${numberInWords.trim()} PESOS CON ${formattedAmount[1]}/100 M.N.`;
};

const Unidades = (num: number): string => {
  const numberToWords: Record<number, string> = {
    1: "UN",
    2: "DOS",
    3: "TRES",
    4: "CUATRO",
    5: "CINCO",
    6: "SEIS",
    7: "SIETE",
    8: "OCHO",
    9: "NUEVE",
  };
  return numberToWords[num] || "";
}; // Unidades()

const Decenas = (amount: number): string => {
  const decena = Math.floor(amount / 10);
  const unit = amount - decena * 10;
  const numberToWords: Record<number, string> = {
    1: (() => {
      const numberToWord: Record<number, string> = {
        0: "DIEZ",
        1: "ONCE",
        2: "DOCE",
        3: "TRECE",
        4: "CATORCE",
        5: "QUINCE",
      };
      return numberToWord[unit] || "DIECI" + Unidades(unit);
    })(),
    2: unit == 0 ? "VEINTE" : "VEINTI" + Unidades(unit),
    3: DecenasY("TREINTA", unit),
    4: DecenasY("CUARENTA", unit),
    5: DecenasY("CINCUENTA", unit),
    6: DecenasY("SESENTA", unit),
    7: DecenasY("SETENTA", unit),
    8: DecenasY("OCHENTA", unit),
    9: DecenasY("NOVENTA", unit),
    0: Unidades(unit),
  };
  return numberToWords[decena] || "";
}; //Decenas()

const DecenasY = (inputString: string, unitsCount: number): string => {
  if (unitsCount > 0) return inputString + " Y " + Unidades(unitsCount);
  return inputString;
}; //DecenasY()

const Centenas = (amount: number): string => {
  const centenas = Math.floor(amount / 100);
  const decenas = amount - centenas * 100;

  const numberWords: Record<number, string> = {
    1: decenas > 0 ? "CIENTO " + Decenas(decenas) : "CIEN",
    2: "DOSCIENTOS " + Decenas(decenas),
    3: "TRESCIENTOS " + Decenas(decenas),
    4: "CUATROCIENTOS " + Decenas(decenas),
    5: "QUINIENTOS " + Decenas(decenas),
    6: "SEISCIENTOS " + Decenas(decenas),
    7: "SETECIENTOS " + Decenas(decenas),
    8: "OCHOCIENTOS " + Decenas(decenas),
    9: "NOVECIENTOS " + Decenas(decenas),
  };

  return numberWords[centenas] || Decenas(decenas);
}; //Centenas()

const Seccion = (
  amount: number,
  divider: number,
  singularString: string,
  pluralString: string,
): string => {
  const cientos = Math.floor(amount / divider);
  const remaining = amount - cientos * divider;

  let currencyLetters = "";

  if (cientos > 0)
    if (cientos > 1) currencyLetters = Centenas(cientos) + " " + pluralString;
    else currencyLetters = singularString;

  if (remaining > 0) currencyLetters += "";

  return currencyLetters;
}; //Seccion()

const Miles = (num: number): string => {
  const divisor = 1000;
  const cientos = Math.floor(num / divisor);
  const resto = num - cientos * divisor;

  const strMiles = Seccion(num, divisor, "UN MIL", "MIL");
  const strCentenas = Centenas(resto);

  if (strMiles == "") return strCentenas;
  return strMiles + " " + strCentenas;
}; //Miles()

const convertToMillions = (num: number): string => {
  const currencyDivisor = 1000000;
  const cientos = Math.floor(num / currencyDivisor);
  const remainingAmount = num - cientos * currencyDivisor;

  const millionSection = Seccion(
    num,
    currencyDivisor,
    "UN MILLON DE",
    "MILLONES DE",
  );
  const formattedMiles = Miles(remainingAmount);

  if (millionSection == "") return formattedMiles;
  return millionSection + " " + formattedMiles;
};

export class CurrencyHelper {
  static numberToWords(cantidad: number): string {
    return convertNumberToWords(cantidad);
  }
}
