import { Checkbox, FormControlLabel, FormGroup, Grid, Paper } from "@mui/material";
import Heading5 from "components/text/Heading5";

export enum EContestDifficultyType {
  beginner,
  medium,
  advance
}
interface PropsData {
  filterObject: any;
}

const ContestFilter = (props: PropsData) => {
  const { filterObject } = props;

  return (
    <Paper sx={{ padding: "10px", marginTop: "-14px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <Heading5>{filterObject["difficulty"]["root"]}</Heading5>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                {filterObject["difficulty"]["object"].map((difficultyType: any) => (
                  <FormControlLabel control={<Checkbox defaultChecked />} label={difficultyType} />
                ))}
              </FormGroup>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <Heading5>{filterObject["language"]["root"]}</Heading5>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                {filterObject["language"]["object"].map((difficultyType: any) => (
                  <FormControlLabel control={<Checkbox defaultChecked />} label={difficultyType} />
                ))}
              </FormGroup>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ContestFilter;
