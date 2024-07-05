import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useDispatch } from "react-redux";
import { openEditRubric } from "reduxes/NewEditRubricDialog";
import { RubricUserEntity } from "models/courseService/entity/RubricUserEntity";

interface RubricCardProps {
  selectedRubric?: RubricUserEntity;
  onDeleteSelectedRubric?: () => void;
}

const RubricCard = ({ selectedRubric, onDeleteSelectedRubric }: RubricCardProps) => {
  const dispatch = useDispatch();
  const criteria = selectedRubric?.content ? JSON.parse(selectedRubric?.content) : [];

  return (
    <>
      {selectedRubric && (
        <Paper elevation={3} className={classes.rubricCard}>
          <Stack direction='row' justifyContent='space-between'>
            <Box>
              <Typography variant='h6' className={classes.rubricCardTitle}>
                {selectedRubric?.name}
              </Typography>
              <Stack direction='row' spacing={1}>
                {criteria.map((criterion: any, index: any) => (
                  <Chip key={index} label={criterion.criteriaName} size='small' />
                ))}
              </Stack>
            </Box>
            <Stack direction='row' spacing={1}>
              <Button
                variant='outlined'
                color='error'
                className={classes.iconBtn}
                onClick={onDeleteSelectedRubric}
              >
                <DeleteIcon fontSize='small' color='error' />
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}
    </>
  );
};

export default RubricCard;
