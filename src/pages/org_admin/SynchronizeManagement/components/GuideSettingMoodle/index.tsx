import React from "react";
import { Container, Box, Typography, Grid, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import classes from "./styles.module.scss";
import images from "config/images";
import Section from "./components/Section";

interface Content {
  description: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
}

interface Step {
  title: string;
  contents: Content[];
}

const stepsData: Step[] = [
  {
    title: "Log in to moodle",
    contents: [
      {
        description:
          "First, you need to log in to your Moodle system. Use an administrator account to have full access to system settings.",
        imageSrc: images.org_admin.guide.step1,
        imageAlt: "Log in to moodle"
      }
    ]
  },
  {
    title: "Enable Web Services",
    contents: [
      {
        description: "Go to Site administration, then select Advanced features.",
        imageSrc: images.org_admin.guide.step2.step2_1,
        imageAlt: "Advanced features"
      },
      {
        description: "Enable web services by checking the corresponding checkbox.",
        imageSrc: images.org_admin.guide.step2.step2_2,
        imageAlt: "Enable web services"
      },
      {
        description: "Click Save changes.",
        imageSrc: images.org_admin.guide.step2.step2_3,
        imageAlt: "Save changes"
      }
    ]
  },
  {
    title: "Enable Protocols",
    contents: [
      {
        description:
          "In the Site administration section, select Server or Plugins (depending on the version of moodle)",
        imageSrc: images.org_admin.guide.step3.step3_1,
        imageAlt: "Plugins"
      },
      {
        description: "In the Web services section, select Manage protocols.",
        imageSrc: images.org_admin.guide.step3.step3_2,
        imageAlt: "Web services"
      },
      {
        description:
          "Enable the required protocols (e.g. REST, SOAP, XML-RPC) by checking the corresponding checkboxes.",
        imageSrc: images.org_admin.guide.step3.step3_3,
        imageAlt: "Enable protocols"
      }
    ]
  },
  {
    title: "Create Web Service",
    contents: [
      {
        description:
          "In the Site administration section, select Server or Plugins (depending on the version of moodle)",
        imageSrc: images.org_admin.guide.step3.step3_1,
        imageAlt: "Plugins"
      },
      {
        description: "Under Web services, select External services.",
        imageSrc: images.org_admin.guide.step4.step4_1,
        imageAlt: "Web services"
      },
      {
        description: "Click Add.",
        imageSrc: images.org_admin.guide.step4.step4_2,
        imageAlt: "Add"
      },
      {
        description:
          "Fill in the required information for the new web service: Name, Description, Check the Enabled box.",
        imageSrc: images.org_admin.guide.step4.step4_3,
        imageAlt: "Web service details"
      },
      {
        description: "Click the Add functions button",
        imageSrc: images.org_admin.guide.step4.step4_4,
        imageAlt: "Select protocols"
      },
      {
        description: (
          <>
            <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
              <Typography variant='h6'>
                Select the functions required for the new web service:
              </Typography>
            </Box>
            <pre className={classes.functionList}>
              core_course_get_courses
              <br />
              mod_quiz_get_quizzes_by_courses
              <br />
              mod_assign_get_assignments
              <br />
              mod_assign_get_user_mappings
              <br />
              mod_assign_get_submission_status
              <br />
              core_enrol_get_enrolled_users
              <br />
              core_course_get_contents
              <br />
              core_course_get_categories
              <br />
              mod_assign_get_submissions
              <br />
              mod_assign_get_grades
              <br />
              core_user_get_course_user_profiles
              <br />
              core_enrol_get_users_courses
              <br />
              core_course_get_course_module
              <br />
              core_user_get_users
            </pre>
            <br />
            Then click Save changes.
          </>
        ),
        imageSrc: images.org_admin.guide.step4.step4_5,
        imageAlt: "Select functions"
      }
    ]
  },
  {
    title: "Create a Token",
    contents: [
      {
        description:
          "In the Site administration section, select Server or Plugins (depending on the version of moodle)",
        imageSrc: images.org_admin.guide.step3.step3_1,
        imageAlt: "Plugins"
      },
      {
        description: "Under Web services, select Manage tokens.",
        imageSrc: images.org_admin.guide.step5.step5_1,
        imageAlt: "Web services"
      },
      {
        description: "Click Add.",
        imageSrc: images.org_admin.guide.step5.step5_2,
        imageAlt: "Add"
      },
      {
        description:
          "Fill in the information required to create a token: User, Service. Finally click Save changes.",
        imageSrc: images.org_admin.guide.step5.step5_3,
        imageAlt: "Token details"
      }
    ]
  }
];

const GuideSettingMoodle: React.FC = () => {
  return (
    <Grid className={classes.root}>
      <Container>
        <Box className={classes.logo}>
          <img
            src={images.org_admin.synchronizeMoodle}
            alt='Synchronize logo'
            className={classes.logoImg}
          />
        </Box>
        <Typography className={classes.title}>Data synchronization</Typography>
        <Typography className={classes.subtitle}>Moodle setup guide</Typography>
      </Container>

      {stepsData.map((step, index) => (
        <Section key={index} number={index + 1} title={step.title} contents={step.contents} />
      ))}
    </Grid>
  );
};

export default GuideSettingMoodle;
