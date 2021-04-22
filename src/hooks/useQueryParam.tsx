import { useLocation } from "react-router";

export const useQueryParam = (query: string) => {
  return new URLSearchParams(useLocation().search).get(query);
};
