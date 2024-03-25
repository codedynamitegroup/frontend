import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

interface RubricCardProps {
  name: string;
  criteries: string[];
}

const RubricCard = ({ name, criteries }: RubricCardProps) => {
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
          <Button variant='outlined' color='primary' className={classes.iconBtn}>
            <EditRoundedIcon fontSize='small' />
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default RubricCard;
