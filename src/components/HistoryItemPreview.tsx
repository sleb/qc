import { useAtomValue } from "jotai";
import { historyItemsState } from "../state/HistoryItemsState";
import { selectedItemState } from "../state/SelectedItemState";
import { Typography } from "@mui/material";

const HistoryItemPreview = () => {
  const historyItems = useAtomValue(historyItemsState);
  const selectedItem = useAtomValue(selectedItemState);
  const previewContent = historyItems[selectedItem] ?? "";

  return (
    <Typography
      whiteSpace="pre"
      fontSize={10}
      fontFamily="monospace"
      alignSelf="center"
    >
      {previewContent}
    </Typography>
  );
};

export default HistoryItemPreview;
