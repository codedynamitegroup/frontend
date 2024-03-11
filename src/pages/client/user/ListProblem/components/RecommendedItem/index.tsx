import { Grid, Divider, Stack } from "@mui/material";
import ParagraphBody from "components/text/ParagraphBody";
import classes from "./styles.module.scss";

interface RecommendedItemProps {
  problemName: String;
  difficultLevel: String;
  link?: String;
}
const RecommendedItem = (props: RecommendedItemProps) => {
  return (
    <Stack
      direction='column'
      width='fit-content'
      padding={1}
      borderRadius={2}
      border={1}
      borderColor='rgba(0, 0, 0, 0.1)'
      boxShadow='0px 0px 10px 0px rgba(0, 0, 0, 0.1)'
      onClick={() => null}
      className={classes.stackbtn}
    >
      <ParagraphBody fontWeight={400} fontSize='20px' className={classes.paragraphbody}>
        {props.problemName}
      </ParagraphBody>

      <Divider />

      <ParagraphBody fontWeight={100} className={classes.paragraphbody}>
        {props.difficultLevel}
      </ParagraphBody>
    </Stack>
  );
};

export default RecommendedItem;
