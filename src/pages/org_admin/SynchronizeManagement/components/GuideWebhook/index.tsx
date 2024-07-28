import React from "react";
import { Container, Box, Typography, Grid, IconButton } from "@mui/material";
import classes from "./styles.module.scss";
import images from "config/images";
import Section from "../GuideSettingMoodle/components/Section";

interface Content {
  description: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
}

interface Step {
  title: string;
  contents: Content[];
}

export default function GuideWebhook() {
  const stepsData: Step[] = [
    {
      title: "Install WebHooks plugin",
      contents: [
        {
          description:
            "First, you need to go to Site administration and select Plugins then select Install plugins.",
          imageSrc: images.org_admin.guide.webhook.step1.step1_1,
          imageAlt: "Vào site administraction"
        },
        {
          description:
            "Go to Moodle's plugin directory and download the WebHooks plugin by clicking the Download button.",
          imageSrc: images.org_admin.guide.webhook.step1.step1_2,
          imageAlt: "Download WebHooks plugin"
        },
        {
          description:
            "Return to the Install plugin page in Moodle. Select Choose a file..., select the downloaded WebHooks plugin ZIP file, and click Install plugin from the ZIP file.",
          imageSrc: images.org_admin.guide.webhook.step1.step1_3,
          imageAlt: "Upload WebHooks plugin"
        }
      ]
    },
    {
      title: "Create WebHook service",
      contents: [
        {
          description:
            "You need to go to Site administration and select Server then select Webhook",
          imageSrc: images.org_admin.guide.webhook.step1.step1_4,
          imageAlt: "Go to Server Settings"
        },
        {
          description: "Click the Add service button to create a new WebHook service.",
          imageSrc: images.org_admin.guide.webhook.step1.step1_5,
          imageAlt: "Add new WebHook service"
        },
        {
          description:
            "Enter the Name and URL of your WebHook service. Name: CodeDynamiteWebhook, URL: https://api.codedynamite.click/course/webhook/receive",
          imageSrc: images.org_admin.guide.webhook.step1.step1_6,
          imageAlt: "External service configuration"
        },
        {
          description:
            "Select the events you want the WebHook to listen for by checking the corresponding boxes.",
          imageSrc: images.org_admin.guide.webhook.step1.step1_7,
          imageAlt: "Chọn sự kiện cho WebHook"
        },
        {
          description: "Scroll down and press the Save changes button to apply your settings.",
          imageSrc: images.org_admin.guide.webhook.step1.step1_8,
          imageAlt: "Save changes"
        }
      ]
    }
  ];

  return (
    <Grid className={classes.root}>
      <Container>
        <Typography className={classes.title}>Webhooks setup guide</Typography>
      </Container>

      {stepsData.map((step, index) => (
        <Section key={index} number={index + 1} title={step.title} contents={step.contents} />
      ))}
    </Grid>
  );
}
