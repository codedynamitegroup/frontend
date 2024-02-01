import { Box, Container, Grid } from "@mui/material";
import Header from "components/Header";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import Heading1 from "components/text/Heading1";
import InputTextField from "components/common/inputs/InputTextField";
import TextTitle from "components/text/TextTitle";
import { Textarea } from "@mui/joy";
import TextEditor from "components/editor/TextEditor";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select } from '@mui/base/Select';
import { Option } from '@mui/base/Option';


interface Props {
    qtype: String,
}

const CodeQuestionCreated = (props: Props) => {

    return (
        <Grid className={classes.root}>
            <Header />
            <Container className={classes.container}>
                <Box className={classes.tabWrapper}>
                    ...&gt;...
                </Box>
                <Box component='form' className={classes.formBody} autoComplete='off'>
                    <Heading1 fontWeight={"500"}>Thêm câu hỏi tự luận</Heading1>
                    <Grid container spacing={1} columns={12}>
                        <Grid item xs={3}>
                            <TextTitle>Category</TextTitle>
                        </Grid>
                        <Grid item xs={9}>
                            <Select defaultValue={10}>
                                <Option value={10}>Ten</Option>
                                <Option value={20}>Twenty</Option>
                                <Option value={30}>Thirty</Option>
                            </Select>
                        </Grid>
                    </Grid>

                    <InputTextField title='Tên câu hỏi' type='text' placeholder="Tên câu hỏi" />

                    <Grid container spacing={1} columns={12}>
                        <Grid item xs={3}>
                            <TextTitle>Mô tả câu hỏi</TextTitle>
                        </Grid>
                        <Grid item xs={9}>
                            <Textarea
                                placeholder='Nhập mô tả câu hỏi ...'
                                sx={{ backgroundColor: "white" }}
                                minRows={3}
                            />
                        </Grid>
                    </Grid>
                    <InputTextField title='Điểm mặc định' type='text' placeholder="Điểm mặc định" />
                    <Grid container spacing={1} columns={12}>
                        <Grid item xs={3}>
                            <TextTitle>Tiêu chí đánh giá</TextTitle>
                        </Grid>
                        <Grid item xs={9}>
                            <Textarea
                                placeholder='Nhập tiêu chí đánh giá ...'
                                sx={{ backgroundColor: "white" }}
                                minRows={3}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Grid>
    );
};

export default CodeQuestionCreated;
