import { Avatar, DialogProps, Divider, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button, { BtnType } from "components/common/buttons/Button";
import InputTextField from "components/common/inputs/InputTextField";
import BasicSelect from "components/common/select/BasicSelect";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import images from "config/images";
import dayjs from "dayjs";
import classes from "./styles.module.scss";
import { useState } from "react";
import CustomDatePicker from "components/common/datetime/CustomDatePicker";
import CustomDialog from "components/common/dialogs/CustomDialog";
import { useNavigate, useParams } from "react-router-dom";

interface UserInformationDetailsModalProps extends DialogProps {
  initialData: {
    id: string;
    name: string;
    gender: string;
    email: string;
    dob: string;
  };
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: () => void;
}

const UserInformationDetailsModal = ({
  initialData,
  open,
  title,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHandleCancel,
  onHanldeConfirm,
  ...props
}: UserInformationDetailsModalProps) => {
  const navigate = useNavigate();
  const userId = useParams().userId;
  const [data, setData] = useState(initialData);

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={title}
      cancelText={cancelText}
      confirmText={confirmText}
      onHandleCancel={onHandleCancel}
      onHanldeConfirm={onHanldeConfirm}
      minWidth='1000px'
      actionsDisabled
      {...props}
    >
      <Box component='form' className={classes.formBody} autoComplete='off'>
        <InputTextField
          type='text'
          title='Họ và tên'
          value={data.name}
          onChange={(e) => {
            setData((pre) => ({ ...pre, name: e.target.value }));
          }}
        />
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle>Ngày sinh</TextTitle>
          </Grid>
          <Grid item xs={9}>
            <CustomDatePicker
              value={dayjs(data.dob, "DD/MM/YYYY")}
              onHandleValueChange={(newValue) => {
                setData((pre) => ({
                  ...pre,
                  dob: newValue?.format("DD/MM/YYYY") || ""
                }));
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle>Giới tính</TextTitle>
          </Grid>
          <Grid item xs={9}>
            <BasicSelect
              labelId='select-assignment-section-label'
              value={data.gender}
              onHandleChange={(e) => {
                setData((pre) => ({
                  ...pre,
                  gender: e
                }));
              }}
              sx={{
                marginTop: "0px"
              }}
              items={[
                {
                  value: "0",
                  label: "Nam"
                },
                {
                  value: "1",
                  label: "Nữ"
                }
              ]}
            />
          </Grid>
        </Grid>
        <InputTextField type='email' title='Email' value={data.email} onChange={(e) => {}} />
        <Grid container spacing={1} columns={12}>
          <Grid item xs={3}>
            <TextTitle>Mật khẩu</TextTitle>
          </Grid>
          <Grid item xs={9}>
            <Button
              btnType={BtnType.Text}
              onClick={() => {
                navigate(`/users/${userId}/password/change`);
              }}
            >
              Đổi mật khẩu
            </Button>
          </Grid>
        </Grid>

        <Heading1 fontWeight={"500"}>Tài khoản liên kết</Heading1>
        <Divider />

        <Grid container spacing={1} columns={12}>
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            {images.logo.moodleLogo && (
              <Avatar
                alt='Moodle'
                src={images.logo.moodleLogo}
                sx={{
                  width: "40px",
                  height: "40px"
                }}
              />
            )}
            <ParagraphBody
              sx={{
                marginLeft: "5px"
              }}
            >
              Moodle
            </ParagraphBody>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <ParagraphBody>Đã liên kết</ParagraphBody>
          </Grid>
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <Button btnType={BtnType.Text} onClick={() => {}}>
              Huỷ liên kết
            </Button>
          </Grid>
        </Grid>
        <Divider />

        <Grid container spacing={1} columns={12}>
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            {images.logo.moodleLogo && (
              <Avatar
                alt='Microsoft'
                src={images.logo.microsoftLogo}
                sx={{
                  width: "40px",
                  height: "40px"
                }}
              />
            )}
            <ParagraphBody
              sx={{
                marginLeft: "5px"
              }}
            >
              Microsoft
            </ParagraphBody>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <ParagraphBody>Chưa liên kết</ParagraphBody>
          </Grid>
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <Button btnType={BtnType.Text} onClick={() => {}}>
              Liên kết
            </Button>
          </Grid>
        </Grid>
        <Divider />

        <Box
          sx={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Button btnType={BtnType.Outlined} onClick={() => {}}>
            Xoá tài khoản
          </Button>
          <Button btnType={BtnType.Primary} onClick={() => {}}>
            Lưu thay đổi
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default UserInformationDetailsModal;
