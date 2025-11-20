/**
 * Converts a string to snake_case
 * Examples:
 * "Hello World" -> "hello_world"
 * "firstName" -> "first_name"
 * "API.Response" -> "api_response"
 * "multiple   spaces" -> "multiple_spaces"
 */
export const toSnakeKey = (s: string) =>
  String(s ?? '')
    .trim()
    .replace(/[\s.-]+/g, '_') // espacios, puntos y guiones -> _
    .replace(/([a-z\d])([A-Z])/g, '$1_$2') // camelCase -> snake
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '') // limpia raros
    .replace(/_{2,}/g, '_');

/**
 * Converts a string to Title Case with spaces
 * Examples:
 * "hello_world" -> "Hello World"
 * "first_name" -> "First Name"
 * "multiple__underscores" -> "Multiple Underscores"
 * "camelCase" -> "Camel Case"
 */
export const humanize = (k: string) =>
  k
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, c => c.toUpperCase());

export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return text;

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const toTitleCase = (text: string): string => {
  return text.toLowerCase().replace(/\b(\s\w|^\w)/g, function (txt) {
    return txt.toUpperCase();
  });
};
