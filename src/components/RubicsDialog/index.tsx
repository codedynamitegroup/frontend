import { Avatar, Checkbox, Grid, Link, Stack } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog";
import CustomDialog from "components/common/dialogs/CustomDialog";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
import Heading3 from "components/text/Heading3";
import ParagraphBody from "components/text/ParagraphBody";
interface AssignUserToOrganizationDialogProps extends DialogProps {
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  isConfirmLoading?: boolean;
  rubicData: any;
}

export default function RubicsDialog({
  open,
  title,
  handleClose,
  children,
  isConfirmLoading = false,
  rubicData,
  ...props
}: AssignUserToOrganizationDialogProps) {
  const { t } = useTranslation();

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={title}
      actionsDisabled
      minWidth={"1000px"}
      {...props}
    >
      <Grid container spacing={2}>
        <div className={classes["table-container"]}>
          <Heading3>{rubicData.name}</Heading3>
          <table>
            <thead>
              <tr>
                <th>
                  <ParagraphBody fontWeight={500}>CRITERIA</ParagraphBody>
                </th>
                <th>
                  <ParagraphBody fontWeight={500}>TOTAL SCORE</ParagraphBody>
                </th>

                <th>
                  <ParagraphBody fontWeight={500}>Scale Descriptions</ParagraphBody>
                </th>
              </tr>
            </thead>
            <tbody>
              {rubicData.criteria.map((criteria: any, index: any) => (
                <tr key={index}>
                  <td>
                    <ParagraphBody>{criteria.criteriaName}</ParagraphBody>
                  </td>
                  <td>
                    <ParagraphBody>{criteria.criteriaGrade}%</ParagraphBody>
                  </td>
                  <td>
                    <ul>
                      {criteria.scaleDescription.map((scale: any, idx: any) => (
                        <li key={idx}>
                          <ParagraphBody>
                            <span>
                              Score {idx + 1}/{criteria.scaleDescription.length}:
                            </span>{" "}
                            &nbsp;
                            {scale[`scale${idx}`]}
                          </ParagraphBody>{" "}
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
