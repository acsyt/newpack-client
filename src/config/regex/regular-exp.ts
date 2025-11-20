export class RegularExp {
  static email: RegExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  static phoneNumber: RegExp = /^[0-9]{10}$/;

  static password: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+.*$/;

  static integer: RegExp = /^-?\d+$/;

  static curp: RegExp =
    /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;

  static cardNumber: RegExp = /^[0-9]{13,19}$/;
  static month: RegExp = /^(0[1-9]|1[0-2])$/;

  static year: RegExp = /^[0-9]{4}$/;

  static postalCode: RegExp = /^[0-9]{5}$/;

  static fullName: RegExp = /^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g;

  static number: RegExp = /^[0-9]*$/g;
}
