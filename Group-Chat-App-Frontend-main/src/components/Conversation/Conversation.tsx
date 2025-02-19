import { Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetGroupMsgsMutation } from "../../services/api";
import Message from "../Message/Message";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setMessages } from "../../store/reducers/groupReducer";

const Conversation = () => {
  const { id: groupId } = useParams();
  const [getMsgs, { isLoading }] = useGetGroupMsgsMutation();
  const { messages } = useAppSelector((state) => state.group);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchMsg = async () => {
      if (!groupId) return; // Prevent API call if groupId is undefined

      try {
        const res = await getMsgs({ groupId }).unwrap(); // `unwrap()` extracts the response
        dispatch(setMessages({ messages: res.data }));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMsg();
  }, [groupId, getMsgs]); // Dependency array ensures it runs only when `groupId` changes

  if (isLoading) {
    return (
      <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f0f8ff"
      borderRadius="8px"
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
      padding={3}
      >
        <CircularProgress size={50} color="primary" />
      </Box>
    );
  }

  return (
    <Box
    display="flex"
    flexDirection="column"
    gap="16px"
    bgcolor="white"
    padding="16px"
    height="100%"
    overflow="auto"
    borderRadius="10px"
    boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
    sx={{
      backgroundColor: "whitesmoke",
      maxHeight: 'calc(100vh - 100px)', // Adjusts to ensure it's scrollable but stays within view
      transition: "background-color 300ms ease-in-out",
      "&:hover": {
        backgroundColor: "whitesmoke", // Subtle background change on hover
      },
    }}
    >
      {!isLoading &&
        Array.isArray(messages) &&
        messages.length > 0 &&
        messages.map((el, ind) => {
          return <Message el={el} key={ind} />;
        })}
    </Box>
  );
};

export default Conversation;
