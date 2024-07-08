import { useMemo } from "react";
import * as yup from "yup";
import { CodeQuestionFormData } from "../type/CodeQuestionFormData";
import { useTranslation } from "react-i18next";
import isQuillEmpty from "utils/coreService/isQuillEmpty";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";

const checkEmptyString = (value: string) => value !== undefined && value.trim().length > 0;

const FormSchema = () => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      yup.object<CodeQuestionFormData>().shape({
        name: yup
          .string()
          .required(t("name_required"))
          .test("not-blank", `${t("name_required")}`, checkEmptyString),
        problemStatement: yup
          .string()
          .required(t("code_management_statement_required"))
          .test(
            "not-blank",
            `${t("code_management_statement_required")}`,
            (value) => !isQuillEmpty(value)
          ),
        inputFormat: yup
          .string()
          .required(t("code_management_input_format_required"))
          .test("not-blank", `${t("code_management_input_format_required")}`, checkEmptyString),
        outputFormat: yup
          .string()
          .required(t("code_management_output_format_required"))
          .test("not-blank", `${t("code_management_output_format_required")}`, checkEmptyString),
        constraints: yup
          .string()
          .required(t("code_management_constraint_required"))
          .test("not-blank", `${t("code_management_constraint_required")}`, checkEmptyString),
        maxGrade: yup.number().min(1).required(),
        isPublic: yup.boolean().required(),
        allowImport: yup.boolean().required(),
        difficulty: yup
          .mixed<QuestionDifficultyEnum>()
          .oneOf(Object.values(QuestionDifficultyEnum))
          .required(t("code_management_difficulty_required")),
        testCases: yup
          .array()
          .of(
            yup.object().shape({
              id: yup.string().required(),
              inputData: yup.string().required(),
              outputData: yup.string().required(),
              isSample: yup.boolean().required()
              // score: yup.number().required()
            })
          )
          .required(),
        tags: yup.array().of(yup.string().required()).required(),
        programmingLanguages: yup
          .array()
          .of(
            yup.object().shape({
              id: yup.string().required(),
              name: yup.string().required(),
              timeLimit: yup
                .number()
                .positive(t("code_management_timelimit_required"))
                .required(t("code_management_timelimit_required")),
              memoryLimit: yup
                .number()
                .min(204800, t("code_management_memorylimit_required"))
                .required(t("code_management_memorylimit_required")),
              choosen: yup.bool().required(),
              bodyCode: yup.string()
            })
          )
          .required()
      }),
    [t]
  );
};
export default FormSchema;
