export class FormDataHelper {
  static toFormData<T>(data: T): FormData {
    const formData = new FormData();

    const appendData = (key: string, value: any): void => {
      if (value === undefined || value === null) return;
      if (value instanceof Array) {
        value.forEach((item, index) => appendData(`${key}[${index}]`, item));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "boolean") {
        formData.append(key, String(Number(value)));
      } else if (typeof value === "object") {
        Object.entries(value).forEach(([keyObj, val]) => {
          appendData(`${key}[${keyObj}]`, val);
        });
      } else {
        formData.append(key, value);
      }
    };

    Object.entries(data as any).forEach(([key, value]) => {
      appendData(key, value);
    });

    return formData;
  }

  static logFormData(formData: FormData): void {
    console.log(Object.fromEntries(formData.entries()));
  }
}
