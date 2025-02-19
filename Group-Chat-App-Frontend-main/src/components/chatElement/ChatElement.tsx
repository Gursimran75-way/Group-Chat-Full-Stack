import { Avatar, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setSelectedGroup } from "../../store/reducers/groupReducer";

interface ChatElementProps {
  el: { name: string; _id: string; type: string; admin: string };
}

const ChatElement: React.FC<ChatElementProps> = ({ el }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedGroup } = useAppSelector((state)=>state?.group);
  return (
    <Box
    gap={2}
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "30px 16px",
        border: `${selectedGroup?._id === el._id ? "2px solid green" : "1px solid black"}`,
        borderRadius: "8px",
        backgroundColor: `${selectedGroup?._id === el._id ? "gray" : "wheat"}`,
        cursor: "pointer",
        transition: "all 250ms ease-in-out",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.08)",
        "&:hover": {
          backgroundColor: "gray",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.12)",
          transform: "scale(1.04)",
        },
        overflow: "hidden", // Preventing overflow in this container
      }}
      onClick={() => {
        dispatch(setSelectedGroup({ selectedGroup: el }));
        navigate(`/app/${el.name}/${el._id}`);
      }}
    >
      <Avatar
        alt={el.name}
        src={`https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
          el.name
        )}`}
        sx={{
          width: 42,
          height: 42,
          border: "2px solid #e0e0e0",
          transition: "transform 250ms",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      />
      <Typography
        variant="subtitle1"
        fontWeight={600}
        color="text.primary"
        sx={{
          flexGrow: 1,
          fontSize: "16px",
          overflow: "hidden", // Prevents overflow of text
          textOverflow: "ellipsis", // Handles long text with an ellipsis
          whiteSpace: "nowrap", // Prevents text from wrapping
        }}
      >
       {el.name.length > 10 ? `${el.name.slice(0, 10)}...` : el.name}
      </Typography>
      <Typography
        variant="caption"
        color={`${el?.type == "public" ? "green" : "red"}`}
        sx={{
          textDecoration:"underline",
          fontSize: "14px",
          flexGrow: 1,
          overflow: "hidden", // Prevents overflow of text
          textOverflow: "ellipsis", // Handles long text with an ellipsis
          whiteSpace: "nowrap", // Prevents text from wrapping
        }}
      >
       {el?.type}
      </Typography>
    </Box>
  );
};

export default ChatElement;
