import { parseAsString, useQueryState } from "nuqs";

export function useSearchParams(key: string) {
  return useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  );
}
