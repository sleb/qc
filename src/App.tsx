import { Grid2, Typography } from "@mui/material";
import { webviewWindow } from "@tauri-apps/api";
import { invoke } from "@tauri-apps/api/core";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import HistoryItemSelector from "./components/HistoryItemSelector";
import { HistoryItem } from "./model/HistoryItem";
import { historyItemsState } from "./state/HistoryItemsState";
import { selectedItemState } from "./state/SelectedItemState";

const items: HistoryItem[] = [
  {
    id: "abc",
    content:
      "this is the song that never ends, yes it goes on and on my friends",
  },
  {
    id: "bcd",
    content: `const App = () => {
  return (
    <Box height="100%" onKeyDown={handleKey} tabIndex={0} autoFocus>
      <List>
        <ListItem>
          <ListItemButton>
            <ListItemText primary="this is the song...">
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}`,
  },
];

const hideWindow = () =>
  webviewWindow.getCurrentWebviewWindow().hide().catch(console.error);

const App = () => {
  const setHistoryItems = useSetAtom(historyItemsState);
  const [selectedItem, setSelectedItem] = useAtom(selectedItemState);

  useEffect(() => {
    setHistoryItems(items);
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
      default:
        console.log(e);
    }
  };

  return (
    <Grid2
      padding={2}
      spacing={2}
      height="100%"
      container
      tabIndex={0}
      autoFocus
      onKeyDown={handleKey}
    >
      <HistoryItemSelector />
      <Grid2 size={6}>
        <Typography variant="h1">Some content</Typography>
      </Grid2>
    </Grid2>
  );
};

export default App;
