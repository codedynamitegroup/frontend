import Card from "@mui/joy/Card";
import { Box, Stack } from "@mui/material";
import ParagraphBody from "components/text/ParagraphBody";

interface PropsData {
  title: string;
  value: number;
  mainColor: string;
  icon: React.ReactNode;
}

const DasbboradBoxComponent = (props: PropsData) => {
  const { title, value, mainColor, icon } = props;
  return (
    <>
      <Card
        variant='outlined'
        color='neutral'
        sx={{
          height: "120px",
          backgroundColor: "#fff",
          paddingBottom: "0",
          paddingLeft: "0",
          paddingRight: "0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <Stack
          direction='row'
          spacing={2}
          margin={"0 1rem"}
          display={"flex"}
          justifyContent={"space-between"}
        >
          <Box>
            <ParagraphBody
              letterSpacing={"0.5px"}
              textTransform={"uppercase"}
              colorname={"--gray-40"}
              fontSize={"0.75rem"}
              fontWeight={"500"}
              lineHeight={"2.5"}
            >
              {title}
            </ParagraphBody>
            <ParagraphBody fontSize={"2rem"} fontWeight={"500"} color={"#212121"}>
              {value}
            </ParagraphBody>
          </Box>
          <Box
            sx={{
              borderRadius: "1000px",
              backgroundColor: mainColor,
              width: "50px",
              height: "50px"
            }}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {icon}
          </Box>
        </Stack>
        <Box
          sx={{
            height: "7px",
            width: "100%",
            backgroundColor: mainColor,
            borderRadius: "0 0 100px 100px"
          }}
        />
      </Card>
    </>
  );
};

export default DasbboradBoxComponent;
