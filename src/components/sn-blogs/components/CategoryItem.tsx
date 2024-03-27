import { memo } from "react";
import { Stack } from "@mui/material";
import { Text, Checkbox } from "components/shared";

type CategoryItemProps = {
    id?: string | undefined;
    name?: string | undefined;
    onChange: (id: string | undefined, name: string | undefined) => void;
    checked: boolean;
};

const CategoryItem = (props: CategoryItemProps) => {
    const { id, name, onChange, checked } = props;

    const onSelect = () => {
        onChange(id, name);
    };
    return (
        <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            onClick={onSelect}
            sx={{
                cursor: "pointer",
            }}
        >
            <Checkbox checked={checked} />
            <Stack direction={{ sm: "row" }} spacing={1.5} flex={1}>
                <Stack>
                    <Text variant="body2">{name}</Text>
                </Stack>
            </Stack>
        </Stack>
    );
};


export default memo(CategoryItem);
