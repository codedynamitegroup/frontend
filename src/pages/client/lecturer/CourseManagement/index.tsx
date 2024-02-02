import Grid from "@mui/material/Grid";
import SearchBar from "components/common/search/SearchBar";
import CourseCard from "./components/CourseCard";
import { User } from "models/courseService/user";

import classes from "./styles.module.scss";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewCardIcon from "@mui/icons-material/ViewModule";
import CourseList from "./components/CouseList";
import ChipMultipleFilter from "components/common/filter/ChipMultipleFilter";
import SideBarLecturer from "components/common/sidebars/SidebarLecturer";
import { Container } from "@mui/material";
import Heading1 from "components/text/Heading1";

enum EView {
  cardView = 1,
  listView = 2
}

const LecturerCourseManagement = () => {
  const tempTeacher: Array<User> = [
    {
      id: 1,
      email: "abc",
      dob: new Date(2000, 0, 1),
      firstName: "Văn A",
      lastName: "Nguyễn",
      phone: "123456789",
      address: "217 nguyen van cu",
      avatarUrl: "avc",
      lastLogin: new Date(2000, 0, 1),
      isDeleted: false,
      createdAt: new Date(2000, 0, 1),
      updatedAt: new Date(2000, 0, 1)
    },
    {
      id: 2,
      email: "abc",
      dob: new Date(2000, 0, 1),
      firstName: "Văn B",
      lastName: "Nguyễn",
      phone: "123456789",
      address: "217 nguyen van cu",
      avatarUrl: "avc",
      lastLogin: new Date(2000, 0, 1),
      isDeleted: false,
      createdAt: new Date(2000, 0, 1),
      updatedAt: new Date(2000, 0, 1)
    },
    {
      id: 3,
      email: "abc",
      dob: new Date(2000, 0, 1),
      firstName: "Yên",
      lastName: "Nguyễn Bình",
      phone: "123456789",
      address: "217 nguyen van cu",
      avatarUrl: "avc",
      lastLogin: new Date(2000, 0, 1),
      isDeleted: false,
      createdAt: new Date(2000, 0, 1),
      updatedAt: new Date(2000, 0, 1)
    }
  ];
  const tempTeacher2: Array<User> = [
    {
      id: 1,
      email: "abc",
      dob: new Date(2000, 0, 1),
      firstName: "Văn A",
      lastName: "Nguyễn",
      phone: "123456789",
      address: "217 nguyen van cu",
      avatarUrl: "https://picsum.photos/200",
      lastLogin: new Date(2000, 0, 1),
      isDeleted: false,
      createdAt: new Date(2000, 0, 1),
      updatedAt: new Date(2000, 0, 1)
    },
    {
      id: 2,
      email: "abc",
      dob: new Date(2000, 0, 1),
      firstName: "Văn B",
      lastName: "Nguyễn",
      phone: "123456789",
      address: "217 nguyen van cu",
      avatarUrl: "avc",
      lastLogin: new Date(2000, 0, 1),
      isDeleted: false,
      createdAt: new Date(2000, 0, 1),
      updatedAt: new Date(2000, 0, 1)
    }
  ];
  const tempCourse = [
    {
      id: 1,
      avatarUrl: "https://picsum.photos/200",
      category: "Chất lượng cao",
      name: "Kỹ thuật lập trình",
      teacherList: tempTeacher
    },
    {
      id: 2,
      avatarUrl: "abcd",
      category: "Chất lượng cao",
      name: "Cấu trúc dữ liệu và giải thuật",
      teacherList: tempTeacher2
    },
    {
      id: 3,
      avatarUrl: "abcd",
      category: "Chất lượng cao",
      name: "Lập trình hướng đối tượng",
      teacherList: tempTeacher
    },
    {
      id: 4,
      avatarUrl: "abcd",
      category: "Chất lượng cao",
      name: "Lập trình hướng đối tượng",
      teacherList: tempTeacher2
    },
    {
      id: 5,
      avatarUrl: "abcd",
      category: "Chất lượng cao",
      name: "Lập trình hướng đối tượng",
      teacherList: tempTeacher2
    },
    {
      id: 6,
      avatarUrl: "abcd",
      category: "Chất lượng cao",
      name: "Lập trình hướng đối tượng",
      teacherList: tempTeacher2
    },
    {
      id: 7,
      avatarUrl: "abcd",
      category: "Chất lượng cao",
      name: "Lập trình hướng đối tượng",
      teacherList: tempTeacher
    },
    {
      id: 8,
      avatarUrl: "abcd",
      category: "Chất lượng cao",
      name: "Lập trình hướng đối tượng",
      teacherList: tempTeacher
    },
    {
      id: 9,
      avatarUrl: "abcd",
      category: "Chất lượng cao",
      name: "Lập trình hướng đối tượng",
      teacherList: tempTeacher
    },
    {
      id: 10,
      avatarUrl: "abcd",
      category: "Chất lượng cao",
      name: "Lập trình hướng đối tượng",
      teacherList: tempTeacher2
    },
    {
      id: 11,
      avatarUrl: "abcd",
      category: "Chất lượng cao",
      name: "Lập trình hướng đối tượng",
      teacherList: tempTeacher
    },
    {
      id: 12,
      avatarUrl: "abcd",
      category: "Chất lượng cao",
      name: "Lập trình hướng đối tượng",
      teacherList: tempTeacher2
    }
  ];
  const tempCategories = ["Chất lượng cao", "Việt - Pháp", "Tiên tiến", "Sau đại học"];

  const [viewType, setViewType] = useState(EView.listView);
  const searchHandle = (searchVal: string) => {
    console.log(searchVal);
  };
  const handleViewChange = (event: React.MouseEvent<HTMLElement>, nextView: number) => {
    setViewType(nextView);
  };
  const handleCategoryFilterChange = (selectedCategoryList: Array<string>) => {
    console.log(selectedCategoryList);
  };

  return (
    <Grid className={classes.root}>
      <SideBarLecturer>
        <Container className={classes.container}>
          <Box className={classes.body}>
            <Heading1 className={classes.pageTitle}>Danh sách khóa học</Heading1>
            <SearchBar onSearchClick={searchHandle} />

            <Box className={classes.featureGroup}>
              <Box className={classes.filterContainer}>
                <ChipMultipleFilter
                  label='Lọc theo loại'
                  defaultChipList={[]}
                  filterList={tempCategories}
                  onFilterListChangeHandler={handleCategoryFilterChange}
                />
              </Box>

              <ToggleButtonGroup
                className={classes.changeViewButtonGroup}
                value={viewType}
                exclusive
                onChange={handleViewChange}
              >
                <ToggleButton value={EView.listView} aria-label='list'>
                  <ViewListIcon />
                </ToggleButton>
                <ToggleButton value={EView.cardView} aria-label='module'>
                  <ViewCardIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {viewType === EView.cardView ? (
              <Box sx={{ flexGrow: 1 }} className={classes.gridContainer}>
                <Grid container spacing={2}>
                  {tempCourse.map((course, index) => (
                    <Grid
                      className={classes.gridItem}
                      item
                      key={course.id}
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                    >
                      <CourseCard
                        courseAvatarUrl={course.avatarUrl}
                        courseCategory={course.category}
                        courseName={course.name}
                        teacherList={course.teacherList}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 1 }} className={classes.gridContainer}>
                <Grid container spacing={2}>
                  {tempCourse.map((course) => (
                    <Grid item xs={12} sm={12} md={12} lg={12} key={course.id}>
                      <CourseList
                        courseAvatarUrl={course.avatarUrl}
                        courseCategory={course.category}
                        courseName={course.name}
                        teacherList={course.teacherList}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        </Container>
      </SideBarLecturer>
    </Grid>
  );
};

export default LecturerCourseManagement;
