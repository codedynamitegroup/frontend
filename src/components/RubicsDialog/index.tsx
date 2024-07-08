import { Avatar, Checkbox, Grid, Link, Stack } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog";
import CustomDialog from "components/common/dialogs/CustomDialog";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
import Heading3 from "components/text/Heading3";
import ParagraphBody from "components/text/ParagraphBody";
import { RubricUserEntity } from "models/courseService/entity/RubricUserEntity";
interface AssignUserToOrganizationDialogProps extends DialogProps {
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  isConfirmLoading?: boolean;
  previewRubric?: RubricUserEntity;
}

export default function RubicsDialog({
  open,
  title,
  handleClose,
  children,
  isConfirmLoading = false,
  previewRubric,
  ...props
}: AssignUserToOrganizationDialogProps) {
  const { t } = useTranslation();
  const criteria = previewRubric?.content ? JSON.parse(previewRubric?.content) : [];
  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={previewRubric?.name ? previewRubric?.name : "Rubric"}
      actionsDisabled
      minWidth={"1000px"}
      {...props}
    >
      <Grid container spacing={2}>
        <div className={classes["table-container"]}>
          <table>
            <thead>
              <tr>
                <th>
                  <ParagraphBody fontWeight={500}>Criteria</ParagraphBody>
                </th>
                <th>
                  <ParagraphBody fontWeight={500}>Scale Descriptions</ParagraphBody>
                </th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((criteria: any, index: any) => (
                <tr key={index}>
                  <td>
                    <ParagraphBody>{criteria.criteriaName}</ParagraphBody>
                  </td>
                  <td>
                    <ul>
                      {criteria.scale.map((scale: any, idx: any) => (
                        <li key={idx}>
                          <ParagraphBody>
                            <span>
                              Score {scale.score}/{criteria.scale.length}:
                            </span>{" "}
                            &nbsp;
                            {scale.description}
                          </ParagraphBody>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Grid>
    </CustomDialog>
  );
}
