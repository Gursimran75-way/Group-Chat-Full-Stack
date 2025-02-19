import { Box, IconButton, TextField } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
import { useSendMsgMutation } from "../../services/api";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { updateMessages } from "../../store/reducers/groupReducer";

const Footer = () => {
  const [content, setContent] = useState("");
  const [sendMsg] = useSendMsgMutation();
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    []
  );

  const handleKeyDown = useCallback(  
    (e: React.KeyboardEvent<HTMLDivElement> | any) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSendMessage();
      }
    },
    []
  );

  const handleSendMessage = useCallback(async () => {
    if (content.trim() === "") {
      toast.error("enter message pls before sending");
      return;
    }
    if (!id) {
      toast.error("select a group to send message");
      return;
    }
    try {
      const res = await sendMsg({ groupId: id, content }).unwrap();
      toast.success("Message sent successfully");
      dispatch(
        updateMessages({
          messages: Array.isArray(res.data) ? res.data : [res.data],
        })
      );
    } catch (error) {
      toast.error("Failed to send message");
    }
    setContent("");
  }, [content, id, sendMsg, dispatch]);


  const textFieldStyles = useMemo(
    () => ({
      flexGrow: 1,
      borderRadius: "20px",
      backgroundColor: "#FFFFFF",
      "& .MuiOutlinedInput-root": {
        borderRadius: "20px",
        padding: "6px 12px",
        "& fieldset": {
          borderColor: "#E0E0E0",
        },
        "&:hover fieldset": {
          borderColor: "#1976D2",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#1976D2",
        },
      },
    }),
    []
  );
  

  return (
    <Box
      display="flex"
      alignItems="center"
      padding="8px 16px"
      bgcolor="whitesmoke"
      borderTop="4px solid #E0E0E1"
      sx={{
        boxShadow: "0px -2px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <TextField
        sx={textFieldStyles}
        size="small"
        placeholder="enter a message"
        variant="outlined"
        type="text"
        name="text"
        value={content}
        onChange={(e) => handleChange(e)}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      <IconButton
        onClick={handleSendMessage}
        sx={{
          ml: 2,
          backgroundColor: "#1976D2",
          color: "#FFFFFF",
          borderRadius: "50%",
          padding: "8px",
          "&:hover": {
            backgroundColor: "#1565C0",
          },
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default Footer;
