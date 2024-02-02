import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import classes from "./styles.module.scss";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
};

interface ChipFilterPropData {
  label: string;
  defaultChipList: Array<string>;
  filterList: Array<string>;
  onFilterListChangeHandler: any;
  readOnly?: boolean;
  backgroundColor?: string;
}

const ChipMultipleFilter = (props: ChipFilterPropData) => {
  const [selectedChipList, setSelectedChipList] = useState<string[]>(props.filterList);

  const handleChange = (event: SelectChangeEvent<typeof selectedChipList>) => {
    const {
      target: { value }
    } = event;
    setSelectedChipList(typeof value === "string" ? value.split(",") : value);
    props.onFilterListChangeHandler(selectedChipList);
  };

  return (
    <div className={classes.container}>
      <FormControl className={classes.formWrapperContainer}>
        <InputLabel id='multipleChipLabel'>{props.label}</InputLabel>
        <Select
          style={{
            backgroundColor: props.backgroundColor || "white"
          }}
          id='multipleChip'
          labelId='demo-multipleChipLabel-chip-label'
          multiple
          value={selectedChipList}
          onChange={handleChange}
          input={<OutlinedInput id='selectMultipleChip' label={props.label} />}
          renderValue={(selected) => (
            <Box className={classes.selectedChip}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
          fullWidth
          readOnly={props.readOnly}
        >
          {props.defaultChipList.map((selectedChip) => (
            <MenuItem key={selectedChip} value={selectedChip}>
              {selectedChip}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ChipMultipleFilter;
