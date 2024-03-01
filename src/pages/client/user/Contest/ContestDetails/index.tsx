import {
  Box,
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography
} from "@mui/material";
import classes from "./stytles.module.scss";
import Header from "components/Header";
import Heading1 from "components/text/Heading1";
import ContestTimeInformation from "./components/ContestTimeInformation";
import { useState } from "react";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import ContestProblemItem, { EContestProblemDifficulty } from "./components/ContestProblemItem";
import ContestLeaderboard from "./components/ContestLeaderboard";
import Heading4 from "components/text/Heading4";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export enum EContestStatus {
  featured,
  happening,
  ended
}

const ContestData = {
  name: "Batch coding",
  status: EContestStatus.happening,
  joinedContest: true,
  description: `<h3 style="text-align:start"><span style="font-size:24px"><span style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;PingFang SC&quot;,&quot;Hiragino Sans GB&quot;,&quot;Microsoft YaHei&quot;,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;,&quot;Segoe UI Symbol&quot;"><span style="color:rgba(0, 0, 0, 0.85)"><span style="background-color:#fafafa">Ch&agrave;o mừng đến với Cuộc thi h&agrave;ng tuần Batch the code lần thứ 387</span></span></span></span></h3>

<p>&nbsp;</p>

<p style="text-align:start"><span style="font-size:14px"><span style="color:rgba(0, 0, 0, 0.65)"><span style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;PingFang SC&quot;,&quot;Hiragino Sans GB&quot;,&quot;Microsoft YaHei&quot;,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;,&quot;Segoe UI Symbol&quot;"><span style="background-color:#fafafa">Cuộc thi n&agrave;y được t&agrave;i trợ bởi 6BrosT.</span></span></span></span></p>

<p style="text-align:start"><span style="font-size:14px"><span style="color:rgba(0, 0, 0, 0.65)"><span style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;PingFang SC&quot;,&quot;Hiragino Sans GB&quot;,&quot;Microsoft YaHei&quot;,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;,&quot;Segoe UI Symbol&quot;"><span style="background-color:#fafafa"><strong>H&atilde;y đăng k&yacute; trước cuộc thi v&agrave; điền v&agrave;o bản khảo s&aacute;t để được chọn phỏng vấn với 6BrosT!!</strong></span></span></span></span></p>

<p style="text-align:start"><span style="font-size:14px"><span style="color:rgba(0, 0, 0, 0.65)"><span style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;PingFang SC&quot;,&quot;Hiragino Sans GB&quot;,&quot;Microsoft YaHei&quot;,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;,&quot;Segoe UI Symbol&quot;"><span style="background-color:#fafafa">Bạn c&oacute; thể điền th&ocirc;ng tin li&ecirc;n hệ ở bước đăng k&yacute;.&nbsp;6BrosT c&oacute; thể li&ecirc;n hệ với những người chiến thắng cuộc thi đủ điều kiện để c&oacute; cơ hội phỏng vấn với 6BrosT.</span></span></span></span></p>

<p style="text-align:start"><span style="font-size:14px"><span style="color:rgba(0, 0, 0, 0.65)"><span style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;PingFang SC&quot;,&quot;Hiragino Sans GB&quot;,&quot;Microsoft YaHei&quot;,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;,&quot;Segoe UI Symbol&quot;"><span style="background-color:#fafafa"><strong><strong>⭐ Giải thưởng⭐</strong></strong></span></span></span></span></p>

<ul>
	<li>Th&iacute; sinh xếp&nbsp;<strong>thứ 1 ~ thứ 3</strong>&nbsp;sẽ gi&agrave;nh được Ba l&ocirc; 6BrosT</li>
	<li>Th&iacute; sinh xếp&nbsp;<strong>thứ 4 ~ 10</strong>&nbsp;sẽ gi&agrave;nh được B&igrave;nh nước 6BrosT</li>
	<li>Th&iacute; sinh xếp hạng&nbsp;<strong>11 ~ 16</strong>&nbsp;sẽ gi&agrave;nh được 6BrosT Big O Notebook</li>
</ul>

<p style="text-align:start"><span style="font-size:14px"><span style="color:rgba(0, 0, 0, 0.65)"><span style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;PingFang SC&quot;,&quot;Hiragino Sans GB&quot;,&quot;Microsoft YaHei&quot;,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;,&quot;Segoe UI Symbol&quot;"><span style="background-color:#fafafa">Chỉ t&agrave;i khoản LCUS(6bt.com) mới đủ điều kiện nhận phần thưởng.&nbsp;Sau khi bảng xếp hạng được ho&agrave;n tất, th&agrave;nh vi&ecirc;n nh&oacute;m 6BrosTsẽ li&ecirc;n hệ với bạn qua email về m&oacute;n qu&agrave;!</span></span></span></span></p>

<p><img src="https://assets.leetcode.com/static_assets/others/Contest_Prize_Banner.png" style="--tw-border-spacing-x:0; --tw-border-spacing-y:0; --tw-ring-color:rgba(59,130,246,.5); --tw-ring-offset-color:#ffffff; --tw-ring-offset-shadow:0 0 #0000; --tw-ring-offset-width:0px; --tw-ring-shadow:0 0 #0000; --tw-rotate:0; --tw-scale-x:1; --tw-scale-y:1; --tw-scroll-snap-strictness:proximity; --tw-shadow-colored:0 0 #0000; --tw-shadow:0 0 #0000; --tw-skew-x:0; --tw-skew-y:0; --tw-translate-x:0; --tw-translate-y:0; background-color:#fafafa; border:0px none; box-sizing:border-box; color:rgba(0, 0, 0, 0.65); font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;PingFang SC&quot;,&quot;Hiragino Sans GB&quot;,&quot;Microsoft YaHei&quot;,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;,&quot;Segoe UI Symbol&quot;; font-size:14px; font-style:normal; font-variant-ligatures:normal; font-weight:400; margin-bottom:20px; max-width:100%; text-align:start; text-decoration-color:initial; text-decoration-style:initial; text-decoration-thickness:initial; vertical-align:middle; white-space:normal" /></p>

<h4 style="text-align:start"><span style="font-size:18px"><span style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;PingFang SC&quot;,&quot;Hiragino Sans GB&quot;,&quot;Microsoft YaHei&quot;,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;,&quot;Segoe UI Symbol&quot;"><span style="color:rgba(0, 0, 0, 0.85)"><span style="background-color:#fafafa">&nbsp;&nbsp;Lưu &yacute; quan trọng</span></span></span></span></h4>

<ol>
	<li>Để mang đến một cuộc thi tốt hơn v&agrave; đảm bảo t&iacute;nh c&ocirc;ng bằng, ch&uacute;ng t&ocirc;i đ&atilde; lắng nghe phản hồi của 6BroCoder v&agrave; suy nghĩ rất nhiều về thể lệ cuộc thi được cập nhật.&nbsp;Vui l&ograve;ng xem&nbsp;<a href="https://leetcode.com/discuss/general-discussion/951105/new-contest-rule-effective-from-december-2020" style="box-sizing:border-box; border:0px solid; --tw-border-spacing-x:0; --tw-border-spacing-y:0; --tw-translate-x:0; --tw-translate-y:0; --tw-rotate:0; --tw-skew-x:0; --tw-skew-y:0; --tw-scale-x:1; --tw-scale-y:1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness:proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width:0px; --tw-ring-offset-color:#ffffff; --tw-ring-color:rgba(59,130,246,.5); --tw-ring-offset-shadow:0 0 #0000; --tw-ring-shadow:0 0 #0000; --tw-shadow:0 0 #0000; --tw-shadow-colored:0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; color:#1890ff; text-decoration:none; outline:none; cursor:pointer; transition:color 0.3s ease 0s; touch-action:manipulation">quy tắc</a>&nbsp;cuộc thi mới của ch&uacute;ng t&ocirc;i bao gồm nhiều t&igrave;nh huống hơn với giải th&iacute;ch chi tiết.</li>
	<li>Mỗi lần gửi sai sẽ bị&nbsp;phạt&nbsp;<strong>5 ph&uacute;t.</strong></li>
	<li>Để đảm bảo t&iacute;nh c&ocirc;ng bằng của cuộc thi, 6BrosT sẽ ẩn một số test case trong suốt cuộc thi.&nbsp;Khi người d&ugrave;ng gửi b&agrave;i gửi kh&ocirc;ng ch&iacute;nh x&aacute;c, 6BrosT sẽ kh&ocirc;ng hiển thị c&aacute;c trường hợp thử nghiệm ẩn cho người d&ugrave;ng.</li>
	<li>Đ&aacute;nh gi&aacute; cuối c&ugrave;ng của cuộc thi n&agrave;y sẽ được cập nhật trong v&ograve;ng 5 ng&agrave;y l&agrave;m việc sau cuộc thi.</li>
	<br />
	<li><strong>C&aacute;c h&agrave;nh động dưới đ&acirc;y được coi l&agrave; vi phạm cuộc thi</strong>&nbsp;:
	<ul>
		<li>Một người d&ugrave;ng gửi bằng nhiều t&agrave;i khoản trong một cuộc thi.&nbsp;T&agrave;i khoản LCUS (6BrosT.com) v&agrave; t&agrave;i khoản LCCN (6BrosT-cn.com) được coi l&agrave; t&agrave;i khoản ri&ecirc;ng biệt, ngay cả khi cả hai t&agrave;i khoản đều thuộc về c&ugrave;ng một người d&ugrave;ng.</li>
		<li>Nhiều t&agrave;i khoản gửi m&atilde; giống nhau cho c&ugrave;ng một vấn đề.</li>
		<li>Tạo ra những x&aacute;o trộn kh&ocirc;ng mong muốn l&agrave;m gi&aacute;n đoạn sự tham gia của người d&ugrave;ng kh&aacute;c v&agrave;o cuộc thi.</li>
		<li>C&ocirc;ng bố giải ph&aacute;p cuộc thi ở c&aacute;c b&agrave;i thảo luận c&ocirc;ng khai trước khi cuộc thi kết th&uacute;c.</li>
	</ul>
	<br />
	6BrosT nhấn mạnh v&agrave;o t&iacute;nh c&ocirc;ng bằng v&agrave; c&ocirc;ng bằng trong c&aacute;c cuộc thi của ch&uacute;ng t&ocirc;i.&nbsp;Ch&uacute;ng t&ocirc;i ho&agrave;n to&agrave;n&nbsp;<strong>KH&Ocirc;NG CHẤP NHẬN</strong>&nbsp;đối với c&aacute;c h&agrave;nh vi vi phạm (chẳng hạn như đạo văn, gian lận, v.v.).&nbsp;Khi người d&ugrave;ng bị coi l&agrave; vi phạm quy tắc cuộc thi, ch&uacute;ng t&ocirc;i sẽ &aacute;p dụng c&aacute;c h&igrave;nh phạt sau đối với người d&ugrave;ng n&agrave;y:

	<ul>
		<li><strong>Vi phạm lần đầu</strong>&nbsp;: Số tiền 6Coin đặt lại về 0 v&agrave; một cuộc thi v&agrave; thảo luận về lệnh cấm trong 1 th&aacute;ng.</li>
		<li><strong>Vi phạm lần 2</strong>&nbsp;: Kh&oacute;a t&agrave;i khoản vĩnh viễn m&agrave; kh&ocirc;ng kh&aacute;ng c&aacute;o.</li>
	</ul>
	<br />
	Hơn nữa, ch&uacute;ng t&ocirc;i khuyến kh&iacute;ch tất cả những người tham gia đ&oacute;ng g&oacute;p v&agrave;o việc duy tr&igrave; sự c&ocirc;ng bằng v&agrave; c&ocirc;ng bằng trong cuộc thi của ch&uacute;ng t&ocirc;i.&nbsp;Người d&ugrave;ng gửi (c&aacute;c) b&aacute;o c&aacute;o vi phạm hợp lệ sẽ kiếm th&ecirc;m 6Coin:
	<ul>
		<li>Đối với mỗi người tham gia vi phạm, 10 người d&ugrave;ng đầu ti&ecirc;n gửi b&aacute;o c&aacute;o vi phạm đối với người tham gia n&agrave;y sẽ kiếm được 20 6Coin.</li>
		<li>Mỗi người d&ugrave;ng c&oacute; thể kiếm tới 100 6Coin khi b&aacute;o c&aacute;o vi phạm trong một cuộc thi.</li>
		<li>Người d&ugrave;ng sẽ kh&ocirc;ng được thưởng 6Coins cho c&aacute;c b&aacute;o c&aacute;o về người d&ugrave;ng LCCN.</li>
	</ul>
	</li>
</ol>

<p><br />
&nbsp;</p>

<h4 style="text-align:start"><span style="font-size:18px"><span style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;PingFang SC&quot;,&quot;Hiragino Sans GB&quot;,&quot;Microsoft YaHei&quot;,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;,&quot;Segoe UI Symbol&quot;"><span style="color:rgba(0, 0, 0, 0.85)"><span style="background-color:#fafafa">&nbsp;&nbsp;Th&ocirc;ng b&aacute;o</span></span></span></span></h4>

<p style="text-align:start"><span style="font-size:14px"><span style="color:rgba(0, 0, 0, 0.65)"><span style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;PingFang SC&quot;,&quot;Hiragino Sans GB&quot;,&quot;Microsoft YaHei&quot;,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;,&quot;Segoe UI Symbol&quot;"><span style="background-color:#fafafa">Người d&ugrave;ng&nbsp;<strong>phải đăng k&yacute;</strong>&nbsp;để tham gia.&nbsp;Ch&uacute;ng t&ocirc;i hy vọng bạn th&iacute;ch cuộc thi n&agrave;y!</span></span></span></span></p>
`
};

const problemData = [
  {
    name: "Số nguyên tố",
    maxScore: 5,
    point: 2,
    difficulty: EContestProblemDifficulty.easy,
    maxSubmission: 10,
    submission: 2
  },
  {
    name: "Mảng đối xứng",
    maxScore: 3,
    difficulty: EContestProblemDifficulty.medium,
    maxSubmission: 5,
    submission: 0,
    point: 0
  },
  {
    name: "Ma trận xoay",
    maxScore: 10,
    difficulty: EContestProblemDifficulty.advance,
    maxSubmission: 10,
    submission: 0
  },
  {
    name: "Ma trận vuông",
    maxScore: 2,
    difficulty: EContestProblemDifficulty.easy,
    maxSubmission: 5,
    point: 2,
    submission: 1
  }
];
const problemList = [
  {
    name: "Số nguyên tố",
    maxScore: 5,
    difficulty: EContestProblemDifficulty.easy,
    maxSubmission: 10,
    submission: 2
  },
  {
    name: "Mảng đối xứng",
    maxScore: 3,
    difficulty: EContestProblemDifficulty.medium,
    maxSubmission: 5
  },
  {
    name: "Ma trận xoay",
    maxScore: 10,
    difficulty: EContestProblemDifficulty.advance,
    maxSubmission: 10
  },
  {
    name: "Ma trận vuông",
    maxScore: 2,
    difficulty: EContestProblemDifficulty.easy,
    maxSubmission: 5
  }
];
const rankingList = [
  {
    rank: 1,
    name: "Trương Gia Tiến",
    problemData: [
      { point: 5, tries: 1, duration: "2024-3-4 23:59:59" },
      { point: 2, tries: 5, duration: "2024-3-4 23:59:59" },
      { point: 6, tries: 5, duration: "2024-3-4 23:59:59" },
      { point: 1, tries: 10, duration: "2024-3-4 23:59:59" }
    ],
    totalScore: 14
  },
  {
    rank: 2,
    name: "Trương Gia Tiến",
    problemData: [
      { point: 5, tries: 1, duration: "2024-3-4 23:59:59" },
      { point: 2, tries: 5, duration: "2024-3-4 23:59:59" },
      { point: 6, tries: 5, duration: "2024-3-4 23:59:59" },
      { point: 1, tries: 10, duration: "2024-3-4 23:59:59" }
    ],
    totalScore: 14
  },
  {
    rank: 3,
    name: "Trương Gia Tiến",
    problemData: [
      { point: 5, tries: 1, duration: "2024-3-4 23:59:59" },
      { point: 2, tries: 5, duration: "2024-3-4 23:59:59" },
      { point: 6, tries: 5, duration: "2024-3-4 23:59:59" },
      { point: 1, tries: 10, duration: "2024-3-4 23:59:59" }
    ],
    totalScore: 14
  },
  {
    rank: 4,
    name: "Trương Gia Tiến",
    problemData: [
      { point: 5, tries: 1, duration: "2024-3-4 23:59:59" },
      { point: 2, tries: 5, duration: "2024-3-4 23:59:59" },
      { point: 6, tries: 5, duration: "2024-3-4 23:59:59" },
      { point: 1, tries: 10, duration: "2024-3-4 23:59:59" }
    ],
    totalScore: 14
  }
];
const currentUserRank = {
  rank: 1234,
  name: "Dương Chí Thông",
  problemData: [
    { point: 2, tries: 1, duration: "2024-3-4 23:59:59" },
    { point: 1, tries: 5, duration: "2024-3-4 23:59:59" },
    { point: 3, tries: 6, duration: "2024-3-4 23:59:59" },
    { point: 1, tries: 10, duration: "2024-3-4 23:59:59" }
  ],
  totalScore: 14
};
const topUserRank: Array<any> = [
  {
    rank: 1,
    name: "Nguyễn Văn A",
    problemData: [
      { point: 2, tries: 1, duration: "2024-3-4 23:59:59" },
      { point: 1, tries: 5, duration: "2024-3-4 23:59:59" },
      { point: 3, tries: 6, duration: "2024-3-4 23:59:59" },
      { point: 1, tries: 10, duration: "2024-3-4 23:59:59" }
    ],
    totalScore: 14
  },
  {
    rank: 2,
    name: "Nguyễn Văn BCDEF",
    problemData: [
      { point: 2, tries: 1, duration: "2024-3-4 23:59:59" },
      { point: 1, tries: 5, duration: "2024-3-4 23:59:59" },
      { point: 3, tries: 6, duration: "2024-3-4 23:59:59" },
      { point: 1, tries: 10, duration: "2024-3-4 23:59:59" }
    ],
    totalScore: 14
  },
  {
    rank: 3,
    name: "Nguyễn Văn CEFGHIJ ds",
    problemData: [
      { point: 2, tries: 1, duration: "2024-3-4 23:59:59" },
      { point: 1, tries: 5, duration: "2024-3-4 23:59:59" },
      { point: 3, tries: 6, duration: "2024-3-4 23:59:59" },
      { point: 1, tries: 10, duration: "2024-3-4 23:59:59" }
    ],
    totalScore: 14
  }
];
const ContestDetails = () => {
  const [value, setValue] = useState(() => {
    return ContestData["status"] === EContestStatus.ended ? "3" : "1";
  });

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box className={classes.container}>
      <Header />
      <ContestTimeInformation
        status={ContestData["status"]}
        startDate={"March, 2, 2024"}
        endDate={"2024-3-4 23:59:59"}
        joinContest={ContestData["joinedContest"]}
        contestName={ContestData["name"]}
      />
      <Container maxWidth='lg' className={classes.bodyContainer} sx={{ paddingBottom: "40px" }}>
        <Grid container spacing={1}>
          <Grid
            item
            xs={value !== "3" && ContestData["status"] !== EContestStatus.featured ? 9 : 12}
          >
            <Paper>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList onChange={handleChange} aria-label='lab API tabs example'>
                    <Tab label='Mô tả chung' value='1' />
                    {ContestData["status"] !== EContestStatus.featured &&
                    ContestData["joinedContest"] ? (
                      <Tab label='Đề thi' value='2' />
                    ) : null}
                    {ContestData["status"] === EContestStatus.ended ||
                    ContestData["status"] === EContestStatus.happening ? (
                      <Tab label='Bảng xếp hạng' value='3' />
                    ) : null}
                  </TabList>
                </Box>
                <TabPanel value='1'>
                  <div
                    className={classes.divContainer}
                    dangerouslySetInnerHTML={{ __html: ContestData["description"] }}
                  ></div>
                </TabPanel>
                {ContestData["status"] !== EContestStatus.featured &&
                ContestData["joinedContest"] ? (
                  <TabPanel value='2'>
                    <Grid container spacing={3}>
                      {problemData.map((problem) => (
                        <Grid item xs={12} key={problem.name}>
                          <ContestProblemItem
                            name={problem.name}
                            point={problem.point}
                            maxScore={problem.maxScore}
                            difficulty={problem.difficulty}
                            maxSubmission={problem.maxSubmission}
                            submission={problem.submission}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </TabPanel>
                ) : null}

                {ContestData["status"] === EContestStatus.ended ||
                ContestData["status"] === EContestStatus.happening ? (
                  <TabPanel value='3'>
                    <Heading1>Bảng xếp hạng</Heading1>
                    <ContestLeaderboard
                      currentUserRank={currentUserRank}
                      rankingList={rankingList}
                      problemList={problemList}
                    />
                  </TabPanel>
                ) : null}
              </TabContext>
            </Paper>
          </Grid>
          {value !== "3" ? (
            <Grid item xs={3}>
              {ContestData["status"] !== EContestStatus.featured ? (
                <Paper>
                  <Grid container direction='column' alignItems='center' justifyContent='center'>
                    <Grid item xs={12}>
                      <Heading4 margin={"10px"}>Top 3 xếp hạng</Heading4>
                      <Divider orientation='horizontal' />
                    </Grid>
                    {topUserRank && topUserRank.length !== 0 ? (
                      <Stack spacing={1} margin={"10px 0 10px 0"}>
                        {topUserRank.map((user, index) => (
                          <Grid item xs={12} key={user.rank}>
                            <Stack alignItems={"center"} direction={"row"}>
                              <EmojiEventsIcon
                                fontSize='small'
                                sx={{
                                  color: index === 0 ? "gold" : index === 1 ? "gray" : "brown",
                                  marginRight: "5px"
                                }}
                              />
                              <Link href='#' underline='none'>
                                <Typography className={classes.topUserText}>{user.name}</Typography>
                              </Link>
                            </Stack>
                          </Grid>
                        ))}
                      </Stack>
                    ) : (
                      <Typography color='var(--gray-30)'>Không có dữ liệu</Typography>
                    )}
                  </Grid>
                </Paper>
              ) : null}
            </Grid>
          ) : null}
        </Grid>
      </Container>
    </Box>
  );
};

export default ContestDetails;
