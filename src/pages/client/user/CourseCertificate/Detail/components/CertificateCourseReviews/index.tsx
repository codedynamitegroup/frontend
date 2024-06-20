import { LinearProgress } from "@mui/joy";
import JoyButton from "@mui/joy/Button";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  Rating,
  Skeleton,
  Stack,
  TextareaAutosize
} from "@mui/material";
import Heading2 from "components/text/Heading2";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import TextTitle from "components/text/TextTitle";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
import { ReviewEntity } from "models/coreService/entity/ReviewEntity";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ReviewService } from "services/coreService/ReviewService";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import { showEmailWithAsterisks } from "utils/email";
import i18next from "i18next";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import { CertificateCourseEntity } from "models/coreService/entity/CertificateCourseEntity";
import CustomPagination from "components/common/pagination/CustomPagination";
import useAuth from "hooks/useAuth";
import { calcPercentageInHundred } from "utils/number";

const CertificateCourseReviews = ({
  certificateCourseDetails,
  certificateCourseId,
  dispatch
}: {
  certificateCourseDetails: CertificateCourseEntity;
  certificateCourseId: string;
  dispatch: any;
}) => {
  const { t } = useTranslation();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  const [reviewData, setReviews] = useState<{
    isLoading: boolean;
    reviews: {
      reviews: ReviewEntity[];
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  }>({
    isLoading: false,
    reviews: {
      reviews: [],
      currentPage: 0,
      totalPages: 0,
      totalItems: 0
    }
  });

  const handleGetReviewsByCertificateCourseId = useCallback(
    async ({
      certificateCourseId,
      pageNo = 0,
      pageSize = 5
    }: {
      certificateCourseId: string;
      pageNo?: number;
      pageSize?: number;
    }) => {
      setReviews((prev) => ({
        ...prev,
        isLoading: true
      }));
      try {
        const getReviewsByCertificateCourseIdResponse =
          await ReviewService.getReviewsByCertificateCourseId({
            certificateCourseId,
            pageNo,
            pageSize
          });
        setReviews((prev) => ({
          ...prev,
          isLoading: false,
          reviews: getReviewsByCertificateCourseIdResponse
        }));
      } catch (error: any) {
        setReviews((prev) => ({
          ...prev,
          isLoading: false
        }));
      }
    },
    []
  );

  const handleCreateReview = useCallback(
    async ({
      certificateCourseId,
      rating,
      content
    }: {
      certificateCourseId: string;
      rating: number;
      content: string;
    }) => {
      setSubmitLoading(true);
      try {
        const createReviewResponse = await ReviewService.createReview({
          certificateCourseId,
          rating,
          content
        });
        if (createReviewResponse && createReviewResponse.reviewId) {
          dispatch(setSuccessMess("Đánh giá thành công"));
          handleGetReviewsByCertificateCourseId({ certificateCourseId });
        } else {
          dispatch(setErrorMess("Đánh giá thất bại"));
        }
        setSubmitLoading(false);
      } catch (error: any) {
        setErrorMess("Đánh giá thất bại");
        setSubmitLoading(false);
      }
    },
    [dispatch, handleGetReviewsByCertificateCourseId]
  );

  const starPercentList = useMemo(() => {
    return [
      {
        key: 1,
        value: calcPercentageInHundred(
          certificateCourseDetails.numOfOneStarReviews || 0,
          certificateCourseDetails.numOfReviews
        )
      },
      {
        key: 2,
        value: calcPercentageInHundred(
          certificateCourseDetails.numOfTwoStarReviews || 0,
          certificateCourseDetails.numOfReviews
        )
      },
      {
        key: 3,
        value: calcPercentageInHundred(
          certificateCourseDetails.numOfThreeStarReviews || 0,
          certificateCourseDetails.numOfReviews
        )
      },
      {
        key: 4,
        value: calcPercentageInHundred(
          certificateCourseDetails.numOfFourStarReviews || 0,
          certificateCourseDetails.numOfReviews
        )
      },
      {
        key: 5,
        value: calcPercentageInHundred(
          certificateCourseDetails.numOfFiveStarReviews || 0,
          certificateCourseDetails.numOfReviews
        )
      }
    ];
  }, [certificateCourseDetails]);

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

  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });

  useEffect(() => {
    setCurrentLang(i18next.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18next.language]);

  const handleSubmitReview = async (data: { comment: string; rating: number }) => {
    await handleCreateReview({
      certificateCourseId,
      rating: data.rating,
      content: data.comment
    });
    reset();
  };

  useEffect(() => {
    handleGetReviewsByCertificateCourseId({ certificateCourseId });
  }, [certificateCourseId, handleGetReviewsByCertificateCourseId]);

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
            <Stack direction={"column"} spacing={2} sx={{ padding: "10px", borderRadius: "10px" }}>
              <TextTitle fontSize={"35px"}>
                {certificateCourseDetails.avgRating.toFixed(1)}
              </TextTitle>
              <Rating
                value={certificateCourseDetails.avgRating}
                readOnly
                precision={0.5}
                size='large'
              />
              <ParagraphSmall colorname='--gray-50'>
                ({certificateCourseDetails.numOfReviews} {t("common_review").toLowerCase()})
              </ParagraphSmall>
            </Stack>
          </Grid>
          <Grid item xs={8}>
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
                      key={index}
                      direction={"row"}
                      gap={2}
                      sx={{
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <ParagraphBody>
                        {item.key} {t("common_star").toLowerCase()}
                      </ParagraphBody>
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
        {isLoggedIn && certificateCourseDetails.isRegistered && (
          <Box
            className={classes.commentBox}
            sx={{
              marginTop: "20px",
              width: "700px"
            }}
          >
            <form onSubmit={handleSubmit(handleSubmitReview)}>
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
                <JoyButton
                  type='submit'
                  disabled={!isDirty}
                  translate-key='certificate_send_review'
                  loading={submitLoading}
                >
                  {t("certificate_send_review")}
                </JoyButton>
              </Stack>
            </form>
          </Box>
        )}

        {reviewData.isLoading ? (
          [1, 2, 3, 4, 5].map((item, index) => {
            return (
              <Box
                key={index}
                sx={{
                  marginTop: "20px"
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "25px"
                  }}
                >
                  <Stack direction='column' gap={1}>
                    <Stack
                      direction='row'
                      gap={2}
                      alignItems='center'
                      justifyContent='flex-start'
                      margin={"5px"}
                    >
                      <Skeleton variant='circular' width={40} height={40} />
                      <Stack direction='column' gap={0}>
                        <Skeleton variant='text' width={100} />
                        <Skeleton variant='text' width={100} />
                      </Stack>
                    </Stack>
                    <Skeleton variant='text' width={300} />
                  </Stack>
                  <Divider
                    sx={{
                      marginBottom: "20px",
                      width: "700px"
                    }}
                  />
                </Box>
              </Box>
            );
          })
        ) : (
          <Box
            sx={{
              marginTop: "20px"
            }}
          >
            {reviewData.reviews.reviews.map((review, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "25px"
                  }}
                >
                  <Stack direction='column' gap={1}>
                    <Stack
                      direction='row'
                      gap={2}
                      alignItems='center'
                      justifyContent='flex-start'
                      margin={"5px"}
                    >
                      <Avatar
                        sx={{
                          bgcolor: `${generateHSLColorByRandomText(`${review.createdBy?.email || ""}${review.createdBy.firstName + review.createdBy.lastName}`)}`
                        }}
                        alt={review.createdBy?.email || ""}
                        src={review.createdBy?.avatarUrl}
                      >
                        {review.createdBy.firstName.charAt(0)}
                      </Avatar>
                      <Stack direction='column' gap={0}>
                        <ParagraphBody width={"auto"} fontWeight={600}>
                          {showEmailWithAsterisks(review.createdBy?.email || "")}
                        </ParagraphBody>
                        <Stack direction='row' gap={1}>
                          <ParagraphSmall colorname='--gray-50'>
                            {standardlizeUTCStringToLocaleString(
                              review.createdAt as string,
                              currentLang
                            )}
                          </ParagraphSmall>
                          <Rating value={review.rating} readOnly size='small' />
                        </Stack>
                      </Stack>
                    </Stack>
                    <ParagraphBody>{review.content}</ParagraphBody>
                  </Stack>
                  <Divider
                    sx={{
                      marginBottom: "20px",
                      width: "700px"
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        )}
        <CustomPagination
          count={reviewData.reviews.totalPages || 0}
          page={reviewData.reviews.currentPage + 1 || 1}
          handlePageChange={(event, value) => {
            if (value === reviewData.reviews.currentPage + 1) return;
            handleGetReviewsByCertificateCourseId({
              certificateCourseId,
              pageNo: value - 1
            });
          }}
          showFirstButton
          showLastButton
          size={"medium"}
        />
      </Box>
    </Box>
  );
};

export default CertificateCourseReviews;
