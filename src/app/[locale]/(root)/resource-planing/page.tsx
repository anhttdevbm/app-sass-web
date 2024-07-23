import Wrapper from "components/Wrapper";
import ResourcePlanning from "components/sn-resource-planing";
import ResourcePlanningv1 from "components/sn-resource-planing-v1";

export const metadata = {
  title: "Resource Planning | Taskcover",
};

export default function ResourcePlanningPage() {
  return (
    <Wrapper
      sx={{
        overflow: {
          sx: "scroll",
          md: "hidden",
        },
      }}
      px={{
        sx: 0,
        md: 3,
      }}
    >
      <ResourcePlanning />
    </Wrapper>
  );
}
