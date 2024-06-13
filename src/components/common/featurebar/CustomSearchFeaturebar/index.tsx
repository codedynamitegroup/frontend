import { Box, Chip, Paper, Stack } from "@mui/material";
import classes from "./style.module.scss";
import AutoSearchBar from "components/common/search/AutoSearchBar";
import { useTranslation } from "react-i18next";
import ParagraphBody from "components/text/ParagraphBody";
import Button, { BtnType } from "components/common/buttons/Button";
import BasicSelect from "components/common/select/BasicSelect";

const CustomSearchFeatureBar = ({
  isLoading = false,
  searchValue,
  setSearchValue,
  onHandleChange,
  numOfResults = 0,
  showFilter = true,
  filterKeyList = [],
  filterValueList = [],
  currentFilterKey = "",
  currentFilterValue = "",
  handleFilterKeyChange = (value: string) => {},
  handleFilterValueChange = (value: string) => {},
  onHandleApplyFilter = () => {},
  onHandleCancelFilter = () => {},
  createBtnText = "",
  onClickCreate = () => {}
}: {
  isLoading: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  onHandleChange: (value: string) => void;
  numOfResults?: number;
  showFilter?: boolean;
  filterKeyList?: {
    label: string;
    value: string;
  }[];
  filterValueList?: { label: string; value: string }[];
  currentFilterKey?: string;
  currentFilterValue?: string;
  handleFilterKeyChange?: (value: string) => void;
  handleFilterValueChange?: (value: string) => void;
  onHandleApplyFilter?: () => void;
  onHandleCancelFilter?: () => void;
  createBtnText?: string;
  onClickCreate?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <Stack direction='column' gap={2}>
      {showFilter && filterKeyList.length > 0 && filterValueList.length > 0 && (
        <Paper className={classes.container}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "60px",
              margin: "10px",
              padding: "5px 10px"
            }}
          >
            <Stack direction='row' gap={1} display='flex' alignItems='center'>
              <ParagraphBody width={"80px"}>{t("common_filter_by")}</ParagraphBody>
              <BasicSelect
                labelId='select-assignment-section-label'
                value={currentFilterKey}
                onHandleChange={handleFilterKeyChange}
                width='fit-content'
                items={filterKeyList}
              />
              <BasicSelect
                labelId='select-assignment-section-label'
                value={currentFilterValue}
                onHandleChange={handleFilterValueChange}
                width='fit-content'
                items={filterValueList}
              />
            </Stack>
          </Box>
          <Stack
            direction='row'
            gap={2}
            sx={{ padding: "10px" }}
            display='flex'
            justifyContent='flex-end'
          >
            <Button
              btnType={BtnType.Outlined}
              translate-key='common_cancel_filter'
              onClick={onHandleCancelFilter}
            >
              {t("common_cancel_filter")}
            </Button>
            <Button
              btnType={BtnType.Primary}
              translate-key='common_apply_filter'
              onClick={onHandleApplyFilter}
            >
              {t("common_apply_filter")}
            </Button>
          </Stack>
        </Paper>
      )}

      <Box className={classes.searchWrapper}>
        <Stack direction='row' gap={2}>
          <AutoSearchBar
            value={searchValue}
            setValue={setSearchValue}
            onHandleChange={onHandleChange}
            maxWidth='50%'
          />
          {onClickCreate && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%"
              }}
            >
              {createBtnText !== "" && (
                <Button btnType={BtnType.Primary} onClick={onClickCreate}>
                  {createBtnText}
                </Button>
              )}
            </Box>
          )}
        </Stack>
      </Box>

      {isLoading ? (
        <></>
      ) : (
        searchValue &&
        searchValue.length > 0 && (
          <Chip
            size='small'
            label={`${numOfResults} results found`}
            variant='outlined'
            sx={{
              padding: "15px 10px",
              maxWidth: "fit-content",
              background: "var(--green-500)",
              border: "none",
              color: "white"
            }}
          />
        )
      )}
    </Stack>
  );
};

export default CustomSearchFeatureBar;
