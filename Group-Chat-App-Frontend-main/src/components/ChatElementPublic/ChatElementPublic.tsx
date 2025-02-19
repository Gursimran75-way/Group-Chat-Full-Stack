import { Avatar, Box, Button, Typography } from "@mui/material";
import { useJoinPublicGroupMutation } from "../../services/api";
import { toast } from "react-toastify";
import { Group } from "../../types";

interface ChatElementProps {
  el: Group;
  fetch1: () => void;
  fetch2: () => void;
}

const ChatElementPublic: React.FC<ChatElementProps> = ({
  el,
  fetch1,
  fetch2,
}) => {
  const [joinGroup, { isLoading }] = useJoinPublicGroupMutation();

  const handleJoin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const toastId = toast.loading("Joining Group...", {
      position: "top-center"
    });
    
    try {
      await joinGroup({ id: el._id }).unwrap();
      await fetch1();//fetch the joined groups again
      await fetch2();//fetch the public groups again
      toast.dismiss(toastId);
      toast.success("Group joined successfully!");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error joining group!");
      console.error("Error joining group:", error);
    }
  };

  return (
    <Box
      padding={2}
      borderRadius={2}
      border="1px solid #ddd"
      display="flex"
      gap={1}
      // flexWrap="wrap"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        border : "1px solid black",
        backgroundColor: "wheat",
        transition: "background-color 300ms, transform 300ms",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "gray",
          transform: "translateY(-3px)", // Subtle lift effect on hover
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow on hover
        },
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          alt={el.name}
          src={`https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
            el.name
          )}`}
          sx={{
            width: 40,
            height: 40,
            border: "2px solid #fff", // White border for Avatar
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Soft shadow
          }}
        />
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            flexGrow: 1,
            fontSize: "16px",
            overflow: "hidden", // Prevents overflow of text
            textOverflow: "ellipsis", // Handles long text with an ellipsis
            whiteSpace: "nowrap", // Prevents text from wrapping
          }}
        >
          {el.name.length > 7 ? `${el.name.slice(0, 6)}...` : el.name}
        </Typography>
      </Box>

      <Button
        variant="contained"
        size="small"
        onClick={handleJoin}
        sx={{
          textTransform: "none",
          backgroundColor: "#1976d2", // Consistent theme color
          "&:hover": {
            backgroundColor: "#1565c0", // Darker shade on hover
          },
          "&:focus": {
            outline: "none",
            boxShadow: "0 0 5px rgba(25, 118, 210, 0.5)", // Focus ring with theme color
          },
        }}
        disabled={isLoading}
      >
        {isLoading ? "Joining..." : "Join"}
      </Button>
    </Box>
  );
};

export default ChatElementPublic;
