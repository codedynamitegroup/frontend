import Grid from "@mui/material/Grid";
import SearchBar from "components/common/SearchBar";
import CourseCard from "./components/CourseCard";
import { User } from "models/courseService/user";

import classes from "./styles.module.scss";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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
      firstName: "Tiến",
      lastName: "Trương Gia",
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
    }
  ];

  const tempCourse = [
    {
      id: 1,
      avatarUrl: "abcd",
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

  const searchHandle = (searchVal: string) => {
    console.log(searchVal);
  };

  return (
    <Box className={classes.container}>
      <Typography className={classes.pageTitle}>Danh sách khóa học</Typography>
      <SearchBar onSearchClick={searchHandle} />
      <Box sx={{ flexGrow: 1 }} className={classes.gridContainer}>
        <Grid container spacing={2}>
          {tempCourse.map((course, index) => (
            <Grid className={classes.gridItem} item key={course.id} xs={12} sm={6} md={4} lg={3}>
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
    </Box>
  );
};

export default LecturerCourseManagement;
