import { LinearProgress } from "@mui/joy";
import JoyButton from "@mui/joy/Button";
import { Box, Grid, Rating, Stack, TextareaAutosize } from "@mui/material";
import Heading2 from "components/text/Heading2";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import TextTitle from "components/text/TextTitle";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";

const CertificateCourseReviews = () => {
  const { t } = useTranslation();

  const starPercentList = [
    {
      key: 1,
      value: 20
    },
    {
      key: 2,
      value: 40
    },
    {
      key: 3,
      value: 60
    },
    {
      key: 4,
      value: 80
    },
    {
      key: 5,
      value: 100
    }
  ];

  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
    reset
  } = useForm<{
    comment: string;
    rating: number;
  }>({
    defaultValues: {
      comment: "",
      rating: 5
    }
  });

  return (
    <Box id={classes.introduction}>
      <Box id={classes.courseDescription} translation-key='certificate_detail_review'>
        <Heading2 colorname='--blue-500'>{t("certificate_detail_review")}</Heading2>
        <Grid
          container
          sx={{
            display: "flex",
            marginTop: "20px",
            background: "#EDF0FD",
            borderRadius: "10px",
            width: "700px",
            padding: "20px"
          }}
        >
          <Grid item xs={3.5}>
            {/* <Skeleton
              variant='text'
              width={"100%"}
              height={"200px"}
              sx={{ borderRadius: "10px" }}
            /> */}
            <Stack direction={"column"} spacing={2} sx={{ padding: "10px", borderRadius: "10px" }}>
              <TextTitle fontSize={"35px"}>4.5</TextTitle>
              <Rating value={4.5} readOnly precision={0.5} size='large' />
              <ParagraphSmall colorname='--gray-50'>(329 đánh giá)</ParagraphSmall>
            </Stack>
          </Grid>
          <Grid item xs={8}>
            {/* <Skeleton
              variant='text'
              width={"100%"}
              height={"200px"}
              sx={{ borderRadius: "10px" }}
            /> */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "10px",
                borderRadius: "10px",
                gap: "10px"
              }}
            >
              {starPercentList
                .sort((a, b) => b.key - a.key)
                .map((item, index) => {
                  return (
                    <Stack
                      direction={"row"}
                      gap={2}
                      sx={{
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <ParagraphBody>{item.key} sao</ParagraphBody>
                      <LinearProgress
                        determinate
                        value={item.value}
                        sx={{
                          color: "#F9BE08",
                          height: "10px"
                        }}
                      />
                      <ParagraphBody>{item.value}%</ParagraphBody>
                    </Stack>
                  );
                })}
            </Box>
          </Grid>
        </Grid>
        <Box
          className={classes.commentBox}
          sx={{
            marginTop: "20px",
            width: "700px"
          }}
        >
          <form onSubmit={handleSubmit((data) => console.log(data))}>
            <Controller
              control={control}
              name='comment'
              rules={{ required: true }}
              render={({ field: { ref, ...field } }) => (
                <TextareaAutosize
                  aria-label='empty textarea'
                  translate-key='certificate_review_placeholder'
                  placeholder={t("certificate_review_placeholder")}
                  className={classes.textArea}
                  minRows={5}
                  maxRows={5}
                  {...field}
                  aria-invalid={errors.comment ? true : false}
                />
              )}
            />

            <Stack
              direction='row'
              spacing={2}
              sx={{
                marginTop: "15px",
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <Controller
                control={control}
                name='rating'
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => <Rating {...field} />}
              />
              <JoyButton type='submit' disabled={!isDirty} translate-key='certificate_send_review'>
                {t("certificate_send_review")}
              </JoyButton>
            </Stack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default CertificateCourseReviews;
