import { Stack } from "@mui/material";
import { Text } from "components/shared";

interface HeaderModalProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const HeaderModal = (props: HeaderModalProps) => {
  const { title, description, icon } = props;

  return (
    <Stack direction={"column"} spacing={"2px"}>
      <Stack direction={"row"} spacing={1}>
        {icon}
        <Text fontSize={"16px"} fontWeight={600} color={"grey.900"}>
          {title}
        </Text>
      </Stack>
      <Text color={"grey.300"} fontSize={"12px"} fontWeight={400}>
        {description}
      </Text>
    </Stack>
  );
};
