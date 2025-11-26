export interface FileWithPreview extends File {
  preview: string;
}

export class FileHelper {
  static createFileWithPreview(file: File): FileWithPreview {
    return Object.assign(file, {
      preview: URL.createObjectURL(file)
    });
  }
}
