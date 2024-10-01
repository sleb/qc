import { Grid2 } from "@mui/material";
import { webviewWindow } from "@tauri-apps/api";
import { invoke } from "@tauri-apps/api/core";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import HistoryItemSelector from "./components/HistoryItemSelector";
import { historyItemsState } from "./state/HistoryItemsState";
import { selectedItemState } from "./state/SelectedItemState";
import { listen } from "@tauri-apps/api/event";
import HistoryItemPreview from "./components/HistoryItemPreview";

const hideWindow = () => {
  const window = webviewWindow.getCurrentWebviewWindow();
  window.hide().catch(console.error);
};

const App = () => {
  const setHistoryItems = useSetAtom(historyItemsState);
  const [selectedItem, setSelectedItem] = useAtom(selectedItemState);

  const grid = useRef<HTMLDivElement>(null);

  const refreshHistory = () => {
    invoke<string[]>("history", {})
      .then((items) => setHistoryItems(items))
      .catch(console.error);
  };

  useEffect(() => {
    refreshHistory();
    const unsubPromise = listen("history-updated", refreshHistory);
    grid.current?.focus();
    return () => {
      unsubPromise.then((unsub) => unsub()).catch(console.error);
    };
  }, []);

  const handleKey = (e: React.KeyboardEvent) => {
    switch (e.code) {
      case "Escape":
        hideWindow();
        break;
      case "KeyJ":
      case "Keyj":
      case "ArrowDown":
        setSelectedItem(selectedItem + 1);
        break;
      case "KeyK":
      case "Keyk":
      case "ArrowUp":
        setSelectedItem(selectedItem - 1);
        break;
      case "Enter":
        invoke("paste", { item: selectedItem }).catch(console.error);
        hideWindow();
        break;
      case "Keyd":
      case "KeyD":
      case "Backspace":
      case "Delete":
        invoke("delete", { item: selectedItem }).catch(console.error);
        break;
      default:
        console.log(e);
    }
  };

  return (
    <Grid2
      padding={2}
      spacing={2}
      tabIndex={0}
      onKeyDown={handleKey}
      ref={grid}
      height="100%"
      container
    >
      <Grid2 size={6} height="100%" overflow="auto">
        <HistoryItemSelector />
      </Grid2>
      <Grid2 size={6} height="100%" overflow="auto">
        <HistoryItemPreview />
      </Grid2>
    </Grid2>
  );
};

export default App;
