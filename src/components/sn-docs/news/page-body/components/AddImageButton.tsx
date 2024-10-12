import { PictureInPictureAltOutlined } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { client, Endpoint } from "api";
import React, { useRef } from "react";
import { useUpdateDocMutation } from "store/docs/api";

interface IProps {
  setImageUrl: (url: string) => void;
  docId: string;
}

export default function AddImageButton({ setImageUrl, docId }: IProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updateDoc] = useUpdateDocMutation();
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        handleAddImage(url);
      };
      reader.readAsDataURL(file);
      const res = await client.upload(Endpoint.UPLOAD, file);
      updateDoc({
        id: docId,
        payload: { avatar: res },
      });
    }
  };

  const handleAddImage = (url: string) => {
    setImageUrl(url);
  };

  return (
    <Box display="flex" alignItems="center">
      <Button
        startIcon={<PictureInPictureAltOutlined />}
        onClick={handleButtonClick}
        sx={{
          backgroundColor: "#d6d6d6",
          border: "1px solid #d6d6d6",
          borderRadius: "50px",
          color: "#172b4d",
          boxShadow: "none",
          ":hover": {
            backgroundColor: "#ededed",
          },
          fontWeight: "800",
          fontSize: "16px",
          textTransform: "capitalize",
          height: "34px",
          px: "10px",
        }}
      >
        Add header image
      </Button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
    </Box>
  );
}
