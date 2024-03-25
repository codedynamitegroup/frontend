import { Card, Grid } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog";
import CustomDialog from "components/common/dialogs/CustomDialog";
import Heading4 from "components/text/Heading4";
import ParagraphBody from "components/text/ParagraphBody";
import * as React from "react";

interface MultiSelectCodeQuestionsDialogProps extends DialogProps {
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: () => void;
  isConfirmLoading?: boolean;
}

export default function CreateExistedReportConfirmDialog({
  open,
  title,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHandleCancel,
  onHanldeConfirm,
  isConfirmLoading = false,
  ...props
}: MultiSelectCodeQuestionsDialogProps) {
  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={title}
      cancelText={cancelText}
      confirmText={confirmText}
      isConfirmLoading={isConfirmLoading}
      onHandleCancel={onHandleCancel}
      onHanldeConfirm={onHanldeConfirm}
      minWidth='100px'
      {...props}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Heading4>Báo cáo đã lưu sẽ dược ghi đè với thông tin:</Heading4>
        </Grid>
        <Grid item xs={12}>
          <ParagraphBody>
            <strong>Tên báo cáo mới:</strong> Báo cáo gian lận mới
          </ParagraphBody>
        </Grid>

        <Grid item xs={12}>
          <ParagraphBody>
            <strong>Các câu hỏi lập trình đã so sánh:</strong>
            <Card
              sx={{
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0"
              }}
            >
              {[
                {
                  id: 1,
                  title: "Câu hỏi 1",
                  exam_name: "Bài thi 1",
                  course_name: "Môn học 1"
                },
                {
                  id: 2,
                  title: "Câu hỏi 2",
                  exam_name: "Bài thi 2",
                  course_name: "Môn học 2"
                }
              ].map((question: any) => (
                <div key={question.id}>
                  {question.title} - {question.exam_name} - {question.course_name}
                </div>
              ))}
            </Card>
          </ParagraphBody>
        </Grid>
        <Grid item xs={12}>
          <ParagraphBody>
            <strong>Ngày tạo:</strong> 3/24/2024, 2:19:47 PM
          </ParagraphBody>
        </Grid>
      </Grid>
    </CustomDialog>
  );
}
