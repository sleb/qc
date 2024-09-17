import { Grid2, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import HistoryItemSelector from "./components/HistoryItemSelector";
import { HistoryItem } from "./model/HistoryItem";

const items: HistoryItem[] = [
  {
    id: "abc",
    content:
      "this is the song that never ends, yes it goes on and on my friends",
  },
  {
    id: "bcd",
    content: `const App = () => { \
  return ( \
    <Box height="100%" onKeyDown={handleKey} tabIndex={0} autoFocus> \
      <List> \
        <ListItem> \
          <ListItemButton> \
            <ListItemText primary="this is the song..." /> \
          </ListItemButton> \
        </ListItem> \
      </List> \
    </Box> \
  ); \
  }`,
  },
];

const App = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistoryItems(items);
  }, []);

  return (
    <Grid2 padding={2} spacing={2} height="100%" container>
      <HistoryItemSelector historyItems={historyItems} />
      <Grid2 size={6}>
        <Typography variant="h1">Some content</Typography>
      </Grid2>
    </Grid2>
  );
};

export default App;
