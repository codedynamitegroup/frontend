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
    event_title: string;
    start: string;
    isAddEventDialogOpen: boolean;
    selectDateInfo: DateSelectArg | null;
    filterCourse: string;
    currentEvents: any[];
  }>({
    event_title: "",
    start: "",
    isAddEventDialogOpen: false,
    selectDateInfo: null,
    filterCourse: "0",
    currentEvents: [
      {
        id: createEventId(),
        title: "event 1",
        start: "2024-02-28",
        end: "2024-03-02",
        allDay: true
      },
      {
        id: createEventId(),
        title: "event 2",
        start: "2024-02-20",
        end: "2024-02-22",
        allDay: true
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
        event_title: "",
        start: dayjs().toString()
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
            title: pre.event_title,
            start: data.selectDateInfo?.startStr || "",
            end: data.selectDateInfo?.endStr || "",
            allDay: data.selectDateInfo?.allDay || false
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
        }}
        data={data}
        handleChangData={(newData) => {
          setData((pre) => {
            return {
              ...pre,
              event_title: newData.event_title,
              start: newData.start
            };
          });
        }}
        title='Tạo sự kiện'
        cancelText='Hủy'
        confirmText='Tạo'
        onHandleCancel={() => {
          closeAddEventDialog();
        }}
        onHanldeConfirm={() => {
          onHanldeConfirmAddEvent();
        }}
      />
      <Grid className={classes.root}>
        <SideBarStudent>
          <Grid
            container
            direction='row'
            justifyContent={"center"}
            gap={3}
            sx={{
              height: "100%"
            }}
          >
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
                <CustomFullCalendar
                  events={data.currentEvents}
                  handleDateSelect={handleDateSelect}
                />
              </Box>
            </Box>
          </Grid>
        </SideBarStudent>
      </Grid>
    </>
  );
};

export default StudentEventCalendar;
