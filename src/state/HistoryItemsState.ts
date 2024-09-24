import { atom } from "jotai";
import { HistoryItem } from "../model/HistoryItem";

export const historyItemsState = atom<HistoryItem[]>([]);
