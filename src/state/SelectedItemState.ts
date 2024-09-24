import { atom } from "jotai";
import { historyItemsState } from "./HistoryItemsState";

const base = atom(0);
export const selectedItemState = atom(
  (get) => get(base),
  (get, set, val: number) => {
    set(base, Math.min(get(historyItemsState).length - 1, Math.max(0, val)));
  }
);
