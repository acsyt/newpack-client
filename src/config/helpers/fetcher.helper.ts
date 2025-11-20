export class FetcherHelper {
  static transformFiltersToQueryParams = <T extends Record<string, any>>(
    filters: T
  ): Record<string, string> => {
    return Object.entries(filters).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[`filter[${key}]`] = Array.isArray(value)
            ? value.join(',')
            : String(value);
        }

        return acc;
      },
      {}
    );
  };
}
