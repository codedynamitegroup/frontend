import { Box, Stack } from "@mui/material";
interface EssayQuestionProps {
    maxPoint?:number,
    essayQuestionContent: String,
    editable?: boolean,
    questionNumber: number
}
const EssayQuestion = ({maxPoint, essayQuestionContent, editable, questionNumber}: EssayQuestionProps) => {
    return ( <Box border={1} borderRadius={"5px"}>
        <Stack spacing={"10px"} direction={"column"} marginX={"35px"} marginY={"9px"}>
<Box>Số điểm tối đa</Box>
<Box>Câu {questionNumber}:</Box>

        </Stack>
    </Box> );
}
 
export default EssayQuestion;