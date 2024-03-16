import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent
} from "@mui/material";
import classes from "./style.module.scss";
import ExportIcon from "@mui/icons-material/SystemUpdateAlt";
import { useState } from "react";
import SearchBar from "components/common/search/SearchBar";
import Button, { BtnType } from "components/common/buttons/Button";
import { useTranslation } from "react-i18next";

const CourseParticipantFeatureBar = () => {
  const searchBarHandler = (val: string) => {
    console.log(val);
  };
  const [colSearchVal, setColSearchVal] = useState("name");
  const colSearchChangeHandler = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    setColSearchVal(event.target.value);
  };
  const { t } = useTranslation();

  return (
    <Paper className={classes.container}>
      <Box className={classes.searchWrapper}>
        <SearchBar onSearchClick={searchBarHandler} />

        <FormControl className={classes.colSearchContainer}>
          <InputLabel id='colSearch' translation-key='common_find_by_col'>
            {t("common_find_by_col")}
          </InputLabel>
          <Select
            labelId='colSearch'
            id='colSearchSelect'
            value={colSearchVal}
            onChange={colSearchChangeHandler}
            label={t("common_find_by_col")}
            translation-key='common_find_by_col'
          >
            <MenuItem value={"name"} translation-key='common_name'>
              {t("common_name")}
            </MenuItem>
            <MenuItem value={"emai"}>Email</MenuItem>
            <MenuItem value={"role"} translation-key='common_role'>
              {t("common_role")}
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Button
        btnType={BtnType.Primary}
        startIcon={<ExportIcon sx={{ color: "white" }} />}
        sx={{ marginLeft: "15px", marginBottom: "10px" }}
        translation-key='common_data_export'
      >
        {t("common_data_export")}
      </Button>
    </Paper>
  );
};

export default CourseParticipantFeatureBar;
