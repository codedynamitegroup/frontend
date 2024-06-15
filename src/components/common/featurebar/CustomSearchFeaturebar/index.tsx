import { Box, Card, Chip, IconButton, Paper, Stack } from "@mui/material";
import classes from "./style.module.scss";
import AutoSearchBar from "components/common/search/AutoSearchBar";
import { useTranslation } from "react-i18next";
import ParagraphBody from "components/text/ParagraphBody";
import Button, { BtnType } from "components/common/buttons/Button";
import BasicSelect from "components/common/select/BasicSelect";
import { useFieldArray, useForm } from "react-hook-form";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { setErrorMess } from "reduxes/AppStatus";

const CustomSearchFeatureBar = ({
  isLoading = false,
  searchValue,
  setSearchValue,
  onHandleChange,
  numOfResults = 0,
  showFilter = true,
  filterKeyList = [],
  filterValueList = {},
  filters = [],
  handleChangeFilters = () => {},
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
  filterValueList?: {
    [key: string]: { label: string; value: string }[];
  };
  filters?: {
    key: string;
    value: string;
  }[];
  handleChangeFilters?: (filters: { key: string; value: string }[]) => void;
  onHandleApplyFilter?: () => void;
  onHandleCancelFilter?: () => void;
  createBtnText?: string;
  onClickCreate?: () => void;
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const { control } = useForm({
    values: {
      filters
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "filters"
  });

  return (
    <Stack direction='column' gap={2}>
      <Paper className={classes.container}>
        <form>
          {fields.map((field, index) => (
            <Card
              key={field.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                height: "60px",
                margin: "10px",
                padding: "5px 10px"
              }}
            >
              <Stack direction='row' gap={1} display='flex' alignItems='center' width={"100%"}>
                <ParagraphBody width={"100px"}>
                  {index === 0 ? t("common_filter_by") : t("common_and")}
                </ParagraphBody>
                <BasicSelect
                  labelId={`select-filter-key-${index}`}
                  value={field.key}
                  onHandleChange={(value: string) => {
                    const newFields = fields.map((f, i) => {
                      if (i === index) {
                        const newField = {
                          key: value,
                          value: filterValueList[value]?.[0]?.value || ""
                        };
                        return newField;
                      }
                      return f;
                    });
                    handleChangeFilters(newFields);
                  }}
                  width='fit-content'
                  sx={{
                    minWidth: "150px",
                    maxWidth: "200px"
                  }}
                  items={[...filterKeyList].filter(
                    (key) =>
                      !fields.map((f) => f.key).includes(key.value) || key.value === field.key
                  )}
                />
                <BasicSelect
                  labelId={`select-filter-value-${index}`}
                  value={field.value}
                  onHandleChange={(value: string) => {
                    const newFields = fields.map((f, i) => {
                      if (i === index) {
                        return { key: f.key, value };
                      }
                      return f;
                    });
                    handleChangeFilters(newFields);
                  }}
                  width='fit-content'
                  items={filterValueList[field.key] || []}
                />
              </Stack>
              {index > 0 && (
                <IconButton onClick={() => remove(index)}>
                  <CancelIcon />
                </IconButton>
              )}
            </Card>
          ))}
          <Button
            onClick={() => {
              if (fields.length >= filterKeyList.length) {
                dispatch(setErrorMess(t("common_max_filter_reach")));
                return;
              }
              append({
                key: "",
                value: ""
              });
            }}
            margin='10px'
          >
            + {t("common_add_condition")}
          </Button>
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
        </form>
      </Paper>

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
