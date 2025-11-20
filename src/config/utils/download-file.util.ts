export const downloadFile = async (
  url: string,
  fileName: string
): Promise<void> => {
  const response = await fetch(url);
  const blob = await response.blob();

  const link = document.createElement('a');

  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(link.href);
};
