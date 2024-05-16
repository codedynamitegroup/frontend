export const calcCertificateCourseProgress = (
  numOfCompletedQuestions: number,
  numOfQuestions: number
): number => {
  if (numOfQuestions === 0) return 0;
  return Math.round((numOfCompletedQuestions / numOfQuestions) * 100);
};
