import { memo } from "react";
import MainSection from "./MainSection";
import Wrapper from "./Wrapper";
import Banner from "./Banner";
import FixedLayout from "components/FixedLayout";

const Signup = () => {
  return (
    <Wrapper>
      <MainSection />
      <Banner />
    </Wrapper>
  );
};

export default memo(Signup);
