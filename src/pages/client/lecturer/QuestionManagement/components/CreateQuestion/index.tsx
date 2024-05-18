import qtype from "utils/constant/Qtype";
import CreateShortAnswerQuestion from "./components/CreateShortAnswerQuestion";
import CreateMultichoiceQuestion from "./components/CreateMultichoiceQuestion";
import CreateEssayQuestion from "./components/CreateEssayQuestion";
import CreateTrueFalseQuestion from "./components/CreateTrueFalseQuestion";

interface Props {
  courseId?: string;
  courseName?: string;
  qtype: String;
  insideCrumb?: boolean;
}

const QuestionCreated = (props: Props) => {
  return (
    <>
      {props.qtype === qtype.short_answer.code && CreateShortAnswerQuestion(props)}{" "}
      {props.qtype === qtype.multiple_choice.code && CreateMultichoiceQuestion(props)}
      {props.qtype === qtype.essay.code && CreateEssayQuestion(props)}
      {props.qtype === qtype.true_false.code && CreateTrueFalseQuestion(props)}
    </>
  );
};

export default QuestionCreated;
