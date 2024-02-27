import { Box } from "@mui/material";
import ParagraphBody from "components/text/ParagraphBody";
import images from "config/images";

const EmptyListView = ({ message = "No data available" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        padding: "20px",
        textAlign: "center"
      }}
    >
      {images.null.mailboxEmpty && (
        <img src={images.null.mailboxEmpty} alt='Null' width={"150px"} />
      )}
      <ParagraphBody>{message}</ParagraphBody>
    </Box>
  );
};

export default EmptyListView;
