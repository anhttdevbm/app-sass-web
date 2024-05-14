import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { Box } from "@mui/material";
import { Button } from "components/sn-ai-agent/components";
import { NS_AI_AGENT } from "constant/index";
import useTheme from "hooks/useTheme";
import MagicPenIcon from "icons/MagicPenIcon";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import styled from "styled-components";

type TextareaElementProps = JSX.IntrinsicElements["textarea"];

interface TextareaProps extends TextareaElementProps {
  label: string;
  placeholder: string;
}

const StyledTextarea = styled(TextareaAutosize)({
  resize: "none",
  border: "none",
  width: "100%",
  outline: 0,
  padding: "0 20px",
  paddingBlockStart: "1em",
  paddingInlineEnd: `var(--Textarea-paddingInline)`,
  flex: "auto",
  alignSelf: "stretch",
  color: "inherit",
  backgroundColor: "transparent",
  fontFamily: "inherit",
  fontSize: "inherit",
  fontStyle: "inherit",
  fontWeight: "inherit",
  lineHeight: "inherit",
  "&::placeholder": {
    opacity: 0,
    transition: "0.1s ease-out",
  },
  "&:focus::placeholder": {
    opacity: 1,
  },
  "&:focus + textarea + label, &:not(:placeholder-shown) + textarea + label": {
    top: "0.5rem",
    fontSize: "0.75rem",
    color: "grey.300",
  },
  "&:focus + textarea + label": {
    color: "grey.300",
  },
});

const StyledLabel = styled("label")(({ theme }) => ({
  position: "absolute",
  lineHeight: 1,
  top: "calc((var(--Textarea-minHeight) - 1em) / 2)",
  left: "20px",
  color: theme.palette.grey[300],
  fontWeight: 400,
  transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
}));

const StyledFooter = styled("div")({
  borderTop: "2px solid #ECECF3",
  padding: "8px 20px",
  display: "flex",
  justifyContent: "flex-start",
});

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function InnerTextarea({ label, placeholder, ...props }, ref) {
    const t = useTranslations(NS_AI_AGENT);
    const id = React.useId();
    const theme = useTheme();
    const [charCount, setCharCount] = React.useState(0);

    const handleInputChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      const charCount = event.target.value.length;
      if (charCount <= 1000) {
        setCharCount(charCount);
        if (props.onChange) {
          props.onChange(event);
        }
      }
    };

    return (
      <Box
        sx={{
          position: "relative",
          backgroundColor: "background.default",
          borderRadius: "4px",
          paddingTop: "8px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          height: "100%",
        }}
      >
        <StyledTextarea
          minRows={5}
          {...props}
          ref={ref}
          id={id}
          placeholder={placeholder}
          theme={theme}
          onChange={handleInputChange}
        />
        <StyledLabel htmlFor={id} theme={theme}>
          {label}
        </StyledLabel>
        <StyledFooter>
          <Button
            type="gradient"
            text={t("general.viewPrompts")}
            icon={MagicPenIcon}
            style={{ padding: "8px 16px" }}
          />
        </StyledFooter>
        <div
          style={{
            color: charCount > 1000 ? "error.main" : "#999999",
            marginLeft: "auto",
            fontSize: "0.75rem",
            position: "absolute",
            bottom: "-18px",
            right: "0px",
          }}
        >
          {charCount}/1000
        </div>
      </Box>
    );
  },
);
