import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../../store/store";
import { Message as IMessage } from "../../types";
import { useMemo } from "react";

interface MessageProps {
  el: IMessage;
}

const Message = ({ el }: MessageProps) => {
  const myId = useAppSelector((state) => state.auth?.user?._id);

  const styles = useMemo(() => {
    const isSentByMe = el.senderId._id === myId;
    return {
      messageBackground: isSentByMe ? "wheat" : "#ffffff",
      borderColor: isSentByMe ? "#42A5F5" : "#A5D6A7",
      textColor: "black",
      timestampColor: "#78909C",
      alignSelf: isSentByMe ? "flex-end" : "flex-start",
    };
  }, [el.senderId, myId]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1px",
        padding: "2px 20px",
        borderRadius: "25px", // Stylish rounded corners
        backgroundColor: styles.messageBackground,
        border: `2px solid ${styles.borderColor}`, // Border to give it a nice outline
        width: "fit-content",
        alignSelf: el.senderId._id !== myId ? "flex-start" : "flex-end",
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)", // Bold shadow for depth
        animation: "fadeIn 1s ease-out", // Exciting fade-in effect
        "&:hover": {
          // transform: "scale(1.05)", // Slight scale effect on hover
          boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)", // More intense shadow on hover
          // backgroundColor: el.senderId !== myId ? "#f5f5f5" : "#42A5F5", // Slight background change on hover
        },
      }}
    >
      <Typography
      variant="caption"
      fontWeight={600}
        sx={{
          color: "#3D5A80",
        }}
      >
        By <span style={{textDecoration:"underline"}} >{el.senderId.name}</span>
      </Typography>

      <Typography
        variant="h6"
        sx={{
          color: styles.textColor,
          fontWeight: 500, // Bold text for clarity
          letterSpacing: "0.5px", // Slightly spaced letters for a clean look
          fontSize: "1.1rem", // Slightly larger font for impact
          textOverflow: "ellipsis", // Truncate text if too long
          whiteSpace: "nowrap", // Avoid text wrapping
          overflow: "hidden",
        }}
      >
        {el.content}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: styles.timestampColor,
          fontStyle: "italic", // Subtle charm with italics
          textAlign: "right", // Timestamp aligned to the right
          opacity: 0.7, // Slight transparency for a modern look
        }}
      >
        {new Date(el.createdAt).toLocaleDateString("en-GB")}
      </Typography>
    </Box>
  );
};

export default Message;
