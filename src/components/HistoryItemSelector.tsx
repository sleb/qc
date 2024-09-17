import {
  Grid2,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { webviewWindow } from "@tauri-apps/api";
import { useState } from "react";
import { HistoryItem } from "../model/HistoryItem";

type Props = {
  historyItems: HistoryItem[];
};

const HistoryItemSelector = ({ historyItems }: Props) => {
  const [selected, setSelected] = useState<number>(0);

  const handleKey = (e: React.KeyboardEvent) => {
    switch (e.code) {
      case "Escape":
        webviewWindow.getCurrentWebviewWindow().hide().catch(console.error);
        break;
      case "KeyJ":
      case "Keyj":
      case "ArrowDown":
        setSelected(Math.min(historyItems.length - 1, selected + 1));
        break;
      case "KeyK":
      case "Keyk":
      case "ArrowUp":
        setSelected(Math.max(0, selected - 1));
        break;
      default:
        console.log(e);
    }
  };

  return (
    <Grid2 size={6} padding={1} onKeyDown={handleKey} tabIndex={0} autoFocus>
      <List dense>
        {historyItems.map((item, i) => (
          <ListItem key={i} divider>
            <ListItemButton selected={i === selected}>
              <ListItemText
                primary={item.content}
                primaryTypographyProps={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  noWrap: true,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Grid2>
  );
};

export default HistoryItemSelector;
