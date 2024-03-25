import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useDispatch } from "react-redux";
import { openEditRubric } from "reduxes/NewEditRubricDialog";
import EditRubricDialog from "../EditRubricDialog";

interface RubricCardProps {
  name: string;
  criteries: string[];
}

const RubricCard = ({ name, criteries }: RubricCardProps) => {
  const dispatch = useDispatch();
  const editRubricHandler = () => {
    dispatch(openEditRubric());
    console.log("Edit rubric");
  };

  return (
    <Paper elevation={3} className={classes.rubricCard}>
      <Stack direction='row' justifyContent='space-between'>
        <Box>
          <Typography variant='h6' className={classes.rubricCardTitle}>
            {name}
          </Typography>
          <Stack direction='row' spacing={1}>
            {criteries.map((criterion, index) => (
              <Chip key={index} label={criterion} size='small' />
            ))}
          </Stack>
        </Box>
        <Stack direction='row' spacing={1}>
          <Button variant='outlined' color='error' className={classes.iconBtn}>
            <DeleteIcon fontSize='small' color='error' />
          </Button>
          <Button
            variant='outlined'
            color='primary'
            className={classes.iconBtn}
            onClick={editRubricHandler}
          >
            <EditRoundedIcon fontSize='small' />
          </Button>
        </Stack>
      </Stack>

      {/* <EditRubricDialog
        name='Tự luận thuật toán'
        description='Đây là rubric cho bài thi tự luận thuật toán'
        criteries={["Đúng", "Sai", "Không trả lời", "Không rõ"]}
      /> */}
    </Paper>
  );
};

export default RubricCard;
