import { Box, Divider, Stack } from "@mui/material";
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
import { Card } from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import Chip from "@mui/joy/Chip";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

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
  onClickCreate = () => {},
  isFilter = true
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
  isFilter?: boolean;
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
      {isFilter ? (
        <form>
          <Stack gap={2}>
            {fields.map((field, index) => (
              <Card
                key={field.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  padding: "10px 10px"
                }}
                variant='outlined'
                color='neutral'
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
                    borderRadius='12px'
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
                    borderRadius='12px'
                    width='fit-content'
                    items={filterValueList[field.key] || []}
                  />
                </Stack>
                {index > 0 && (
                  <IconButton onClick={() => remove(index)} color='danger' variant='soft'>
                    <CancelIcon />
                  </IconButton>
                )}
              </Card>
            ))}
          </Stack>
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
            margin='10px 0'
            variant='outlined'
            colorName={"var(--blue-light)"}
            borderRadius='12px'
            startIcon={<AddCircleRoundedIcon />}
          >
            <ParagraphBody fontSize={"12px"} fontWeight={"500"} colorname='--blue-light-1'>
              {t("common_add_condition")}
            </ParagraphBody>
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
              color='inherit'
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
      ) : (
        <></>
      )}
      <Divider />
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
                <Button
                  variant='contained'
                  onClick={onClickCreate}
                  borderRadius='12px'
                  startIcon={<AddCircleRoundedIcon />}
                  sx={{
                    backgroundColor: "var(--blue-2) !important"
                  }}
                >
                  <ParagraphBody fontSize={"14px"} fontWeight={"500"} colorname='--ghost-white'>
                    {createBtnText}
                  </ParagraphBody>
                </Button>
              )}
            </Box>
          )}
        </Stack>
      </Box>

      {isLoading ? (
        <></>
      ) : (
        (searchValue && searchValue.length > 0) ||
        (fields && (
          <Chip
            variant='soft'
            sx={{
              padding: "5px 10px",
              maxWidth: "fit-content"
            }}
            color='success'
            size='sm'
          >
            <ParagraphBody
              fontSize={"12px"}
              fontWeight={"600"}
            >{`${numOfResults} results found`}</ParagraphBody>
          </Chip>
        ))
      )}
    </Stack>
  );
};

export default CustomSearchFeatureBar;
