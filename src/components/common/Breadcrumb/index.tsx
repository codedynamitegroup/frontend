import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Button } from "@mui/joy";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import ParagraphBody from "components/text/ParagraphBody";
import { Link } from "react-router-dom";

export interface BreadCrumbData {
  navLink: string;
  label: string;
}

interface PropsData {
  breadCrumbData: BreadCrumbData[];
  lastBreadCrumbLabel: string;
}

const CustomBreadCrumb = (props: PropsData) => {
  const { breadCrumbData, lastBreadCrumbLabel } = props;

  return (
    <Breadcrumbs
      separator={
        <ArrowRightIcon
          sx={{
            color: "var(--gray-60)",
            fontSize: "20px"
          }}
        />
      }
      aria-label='breadcrumbs'
      sx={{
        padding: "10px 0"
      }}
    >
      {breadCrumbData.map((item: BreadCrumbData) => (
        <Link key={item.label} to={item.navLink}>
          <Button variant='plain' color='neutral' sx={{ padding: "0 7px" }}>
            <ParagraphBody fontWeight={"600"} colorname='--gray-60' fontSize={"13px"}>
              {item.label}
            </ParagraphBody>
          </Button>
        </Link>
      ))}
      <Button variant='plain' color='neutral' sx={{ padding: "0 7px" }} disabled>
        <ParagraphBody fontWeight={"600"} colorname='--blue-link' fontSize={"13px"}>
          {lastBreadCrumbLabel}
        </ParagraphBody>
      </Button>
    </Breadcrumbs>
  );
};

export default CustomBreadCrumb;
