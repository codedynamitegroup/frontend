import classes from "./styles.module.scss";
import { Button, Paper, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface CriteriaCardProps {
  name: string;
}

const CriteriaCard = ({ name }: CriteriaCardProps) => {
  return (
    <Paper elevation={3} className={classes.container}>
      <Stack
        direction='row'
        spacing={3}
        justifyContent={"space-between"}
        alignContent={"center"}
        display={"flex"}
      >
        <Typography className={classes.titleText}>{name}</Typography>
        <Button variant='outlined' color='error' className={classes.actionBtn}>
          <DeleteIcon fontSize='small' />
        </Button>
      </Stack>
    </Paper>
  );
};

export default CriteriaCard;
