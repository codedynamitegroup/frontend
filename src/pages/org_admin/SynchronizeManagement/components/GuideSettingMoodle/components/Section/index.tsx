import React from "react";
import { Container, Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import classes from "./styles.module.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules";

interface SectionProps {
  number: number;
  title: string;
  contents: {
    description: React.ReactNode;
    imageSrc: string;
    imageAlt: string;
  }[];
}

const Section: React.FC<SectionProps> = ({ number, title, contents }) => {
  return (
    <div className={classes.section}>
      <Container>
        <Box className={classes.sectionTitle}>
          <Box className={classes.sectionNumber}>{number}</Box>
          <Typography variant='h4'>{title}</Typography>
        </Box>
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className={`${classes.mySwiper} swiper-no-swiping`}
          onSlideChange={() => console.log("slide change")}
          modules={[Navigation, Pagination]}
          noSwiping={true}
          noSwipingClass='swiper-no-swiping'
        >
          {contents.map((content, index) => (
            <SwiperSlide key={index}>
              <Typography>{content.description}</Typography>
              <Box display='flex' justifyContent='center' mt={4}>
                <Box>
                  <img src={content.imageSrc} alt={content.imageAlt} className={classes.image} />
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </div>
  );
};

export default Section;
