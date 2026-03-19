import React from "react";
import { Carousel } from "antd";
import bannerimage1 from "../Image/book.jpg";
import bannerimage2 from "../Image/bookshelf1.jpg";
import bannerimage3 from "../Image/bookshelf2.jpg";

import Image from "antd";
const contentStyle = {
  margin: 0,
  height: "300px",
  width: "100%",
  objectFit: "cover",
  borderRadius: "20px",
};
const Banner = () => {
  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };
  return (
    <Carousel afterChange={onChange} autoplay adaptiveHeight>
      <div>
        <img src={bannerimage1} alt="Banner 1" style={contentStyle} />
      </div>
      <div>
        <img src={bannerimage2} alt="Banner 2" style={contentStyle} />
      </div>
      <div>
        <img src={bannerimage3} alt="Banner 3" style={contentStyle} />
      </div>
    </Carousel>
  );
};
export default Banner;
