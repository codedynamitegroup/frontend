import { DateSelectArg } from "@fullcalendar/core";
import AddIcon from "@mui/icons-material/Add";
import { Box, Divider, Grid } from "@mui/material";
import CustomFullCalendar from "components/calendar/CustomFullCalendar";
import { createEventId } from "components/calendar/CustomFullCalendar/event-utils";
import Button, { BtnType } from "components/common/buttons/Button";
import BasicSelect from "components/common/select/BasicSelect";
import SideBarStudent from "components/common/sidebars/SidebarStudent";
import Heading1 from "components/text/Heading1";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import AddEventDialog from "./components/AddEventDialog";
import classes from "./styles.module.scss";

const StudentEventCalendar = () => {
  const [data, setData] = useState<{
    isExpanded: boolean;
    durationRadioIndex: string;
    durationInMinute: number;
    eventTitle: string;
    eventDescription: string;
    start: string;
    end: string;
    allDay: boolean;
    isAddEventDialogOpen: boolean;
    selectDateInfo: DateSelectArg | null;
    filterCourse: string;
    currentEvents: any[];
  }>({
    isExpanded: false,
    durationRadioIndex: "0",
    durationInMinute: 0,
    eventTitle: "",
    eventDescription: "",
    start: "",
    end: "",
    allDay: false,
    isAddEventDialogOpen: false,
    selectDateInfo: null,
    filterCourse: "0",
    currentEvents: [
      {
        id: createEventId(),
        title: "Sự kiện nộp bài nhập môn lập trình",
        start: "2024-02-28",
        end: "2024-03-02",
        allDay: true,
        description: "Nộp bài tập lớn"
      },
      {
        id: createEventId(),
        title: "Sự kiện thi cuối kì nhập môn lập trình",
        start: "2024-02-20",
        end: "2024-02-22",
        allDay: true,
        description: "Thi cuối kì"
      }
    ]
  });

  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    setData((pre) => {
      return {
        ...pre,
        start: selectInfo.startStr,
        selectDateInfo: selectInfo,
        isAddEventDialogOpen: true
      };
    });
  }, []);

  const openAddEventDialog = useCallback(() => {
    setData((pre) => {
      return {
        ...pre,
        isAddEventDialogOpen: true,
        selectDateInfo: null,
        eventTitle: "",
        start: dayjs().toString(),
        end: dayjs().toString()
      };
    });
  }, []);

  const closeAddEventDialog = useCallback(() => {
    setData((pre) => {
      return {
        ...pre,
        isAddEventDialogOpen: false
      };
    });
  }, []);

  const onHanldeConfirmAddEvent = useCallback(() => {
    setData((pre) => {
      return {
        ...pre,
        currentEvents: [
          ...pre.currentEvents,
          {
            id: createEventId(),
            title: pre.eventTitle,
            start: data.selectDateInfo?.startStr || "",
            end: data.selectDateInfo?.endStr || "",
            allDay: data.selectDateInfo?.allDay || false,
            description: pre.eventDescription
          }
        ]
      };
    });
    closeAddEventDialog();
  }, [closeAddEventDialog, data.selectDateInfo]);

  return (
    <>
      <AddEventDialog
        open={data.isAddEventDialogOpen}
        handleClose={() => {
          closeAddEventDialog();
          setData((pre) => {
            return {
              ...pre,
              isExpanded: false
            };
          });
        }}
        data={data}
        handleChangData={(newData) => {
          setData((pre) => {
            return {
              ...pre,
              isExpanded: newData.isExpanded,
              durationRadioIndex: newData.durationRadioIndex,
              durationInMinute: newData.durationInMinute,
              eventTitle: newData.eventTitle,
              start: newData.start,
              end: newData.end,
              allDay: newData.allDay
            };
          });
        }}
        title='Tạo sự kiện'
        cancelText='Hủy'
        confirmText='Tạo'
        onHandleCancel={() => {
          closeAddEventDialog();
          setData((pre) => {
            return {
              ...pre,
              isExpanded: false
            };
          });
        }}
        onHanldeConfirm={() => {
          onHanldeConfirmAddEvent();
        }}
      />
      <Grid className={classes.root}>
        <SideBarStudent>
          <Grid container direction='row' justifyContent={"center"} gap={3}>
            <Box className={classes.container}>
              <Box className={classes.body}>
                <Heading1>Lịch sự kiện</Heading1>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    direction: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px"
                  }}
                >
                  <BasicSelect
                    labelId='select-assignment-section-label'
                    value={data.filterCourse}
                    onHandleChange={(value) => {
                      setData((pre) => {
                        return {
                          ...pre,
                          filterCourse: value
                        };
                      });
                    }}
                    sx={{ maxWidth: "200px" }}
                    items={[
                      {
                        value: "0",
                        label: "Tất cả các môn học"
                      },
                      {
                        value: "1",
                        label: "Nhập môn lập trình"
                      },
                      {
                        value: "2",
                        label: "Lập trình hướng đối tượng"
                      }
                    ]}
                  />
                  <Button
                    btnType={BtnType.Outlined}
                    onClick={() => {
                      openAddEventDialog();
                    }}
                    startIcon={<AddIcon />}
                  >
                    Tạo sự kiện
                  </Button>
                </Box>
                <Box>
                  <CustomFullCalendar
                    events={data.currentEvents}
                    handleDateSelect={handleDateSelect}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        </SideBarStudent>
      </Grid>
    </>
  );
};

export default StudentEventCalendar;
