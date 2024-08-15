"use client";
import Wrapper from "components/Wrapper";
import Actions from "../Actions";

const TicketTemplate = () => {
  return (
    <Wrapper overflow="auto" inFrame>
      <Actions isProjectTabMode={false} />
    </Wrapper>
  );
};

export default TicketTemplate;
