import {
  Grid2,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import { historyItemsState } from "../state/HistoryItemsState";
import { selectedItemState } from "../state/SelectedItemState";

const HistoryItemSelector = () => {
  const historyItems = useAtomValue(historyItemsState);
  const [selectedItem, setSelectedItem] = useAtom(selectedItemState);

  return (
    <Grid2 size={6} padding={1}>
      <List dense>
        {historyItems.map((item, i) => (
          <ListItem key={i} divider>
            <ListItemButton
              selected={i === selectedItem}
              onClick={() => setSelectedItem(i)}
            >
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
