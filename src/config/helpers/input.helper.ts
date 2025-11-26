import { RegularExp } from '../regex/regular-exp';

export class InputHelper {
  static inputUppercase(e: any) {
    const inputElement = e.target as HTMLInputElement;

    inputElement.value = inputElement.value.toUpperCase();
  }

  static sanitizeInputLetters(e: any) {
    const inputElement = e.target as HTMLInputElement;
    const { value } = inputElement;

    if (!RegularExp.fullName.test(value)) {
      inputElement.value = value.replace(/[^ a-zA-ZÀ-ÿ\u00f1\u00d1]/g, '');
    }
  }

  static sanitizeInputNumbers(e: any) {
    const inputElement = e.target as HTMLInputElement;
    const { value } = inputElement;

    if (!RegularExp.number.test(value)) {
      inputElement.value = value.replace(/[^0-9]/g, '');
    }
  }

  static sanitizeInputNumbersRange(e: any, min: number, max: number) {
    const inputElement = e.target as HTMLInputElement;
    const { value } = inputElement;

    if (!RegularExp.number.test(value)) {
      inputElement.value = value.replace(/[^0-9]/g, '');
    }

    if (parseInt(inputElement.value, 10) < min) {
      inputElement.value = min.toString();
    }

    if (parseInt(inputElement.value, 10) > max) {
      inputElement.value = max.toString();
    }
  }
}
