import { Checkbox, FormControlLabel, FormGroup, Grid, Paper } from "@mui/material";
import Heading5 from "components/text/Heading5";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <Paper sx={{ padding: "10px", marginTop: "-14px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <Heading5 translation-key='contest_difficulty_title'>
                {t("contest_difficulty_title")}
              </Heading5>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label={t("contest_beginner_difficulty")}
                  translation-key='contest_beginner_title'
                />
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label={t("contest_medium_difficulty")}
                  translation-key='contest_medium_title'
                />
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label={t("contest_advance_difficulty")}
                  translation-key='contest_advance_title'
                />
              </FormGroup>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <Heading5 translation-key='contest_programming_language_title'>
                {t("contest_programming_language_title")}
              </Heading5>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                {filterObject.map((difficultyType: any) => (
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
