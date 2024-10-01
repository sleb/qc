import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import { historyItemsState } from "../state/HistoryItemsState";
import { selectedItemState } from "../state/SelectedItemState";

const HistoryItemSelector = () => {
  const historyItems = useAtomValue(historyItemsState);
  const [selectedItem, setSelectedItem] = useAtom(selectedItemState);

  return (
    <List dense>
      {historyItems.map((item, i) => {
        const selected = selectedItem == i;
        return (
          <ListItem key={i} divider>
            <ListItemButton
              selected={selected}
              autoFocus={selected}
              onClick={() => setSelectedItem(i)}
            >
              <ListItemText
                primary={item}
                primaryTypographyProps={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  noWrap: true,
                }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default HistoryItemSelector;
