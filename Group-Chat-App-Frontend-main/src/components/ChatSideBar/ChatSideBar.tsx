import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  Typography,
  useMediaQuery,
  Drawer,
  IconButton,
} from "@mui/material";
import ChatElement from "../chatElement/ChatElement";
import {
  useGetPublicGroupsQuery,
  useGetUserGroupsQuery,
} from "../../services/api";
import ChatElementPublic from "../ChatElementPublic/ChatElementPublic";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  setMyGroups,
  setPublicGroups,
  toggleOpenDrawer,
} from "../../store/reducers/groupReducer";
import { Group } from "../../types";
// import MenuIcon from "@mui/icons-material/Menu";

const UserCards = () => {
  const dispatch = useAppDispatch();
  const { myGroups, publicGroups } = useAppSelector((state) => state.group);
  const isMobile = useMediaQuery("(max-width:600px)");
  const { openDrawer: open } = useAppSelector((state) => state?.group);

  const {
    data: userData,
    isLoading,
    refetch: fetch1,
  } = useGetUserGroupsQuery();
  const {
    data: publicGroup,
    isLoading: publicGroupLoading,
    refetch: fetch2,
  } = useGetPublicGroupsQuery();

  if (isLoading || publicGroupLoading) {
    return (
      <Box
        width="100vw"
        padding={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (userData && !isLoading) {
    dispatch(setMyGroups({ myGroups: userData.data.groups }));
  }
  if (publicGroup && !publicGroupLoading) {
    dispatch(setPublicGroups({ publicGroups: publicGroup.data }));
  }

  const sidebarContent = (
    <Paper
      elevation={3}
      sx={{
        // width: "50%",
        minWidth: "250px",
        maxWidth: "300px",
        height: "100vh",
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        borderRight: "2px solid #e0e0e0",
      }}
    >
      {/* Header */}
      <Typography
        variant="h6"
        fontWeight={600}
        textAlign="center"
        color="primary"
      >
        Chats
      </Typography>

      <Divider sx={{ marginY: "12px" }} />

      {/* Scrollable Chat List */}
      <Box
        display="flex"
        flexDirection="column"
        gap="10px"
        padding="10px"
        sx={{
          overflowY: "auto",
          maxHeight: "calc(50vh - 50px)",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bbb",
            borderRadius: "10px",
          },
        }}
      >
        {myGroups && myGroups.length > 0 ? (
          myGroups.map((el: Group) => <ChatElement el={el} key={el?._id} />)
        ) : (
          <Typography variant="body1" textAlign="center" color="red">
            No Group chat found
          </Typography>
        )}
      </Box>

      <Divider sx={{ marginY: "12px" }} />

      <Typography
        variant="h6"
        fontWeight={600}
        textAlign="center"
        color="secondary"
      >
        Public Group
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        gap="10px"
        padding="10px"
        sx={{
          overflowY: "auto",
          maxHeight: "calc(50vh - 50px)",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bbb",
            borderRadius: "10px",
          },
        }}
      >
        {publicGroup &&
        Array.isArray(publicGroups) &&
        publicGroups.length > 0 ? (
          publicGroups.map((el: Group) => (
            <ChatElementPublic
              el={el}
              fetch1={fetch1}
              fetch2={fetch2}
              key={el?._id}
            />
          ))
        ) : (
          <Typography variant="body1" textAlign="center" color="red">
            No Public groups found
          </Typography>
        )}
      </Box>
    </Paper>
  );

  return (
    <>
      {/* Menu Button for Mobile */}
      {/* {isMobile && (
        <IconButton
          sx={{ position: "absolute", top: 65, left: 0, zIndex: 1000, backgroundColor: "gray" }}
          onClick={()=>dispatch(toggleOpenDrawer())}
        >
          <MenuIcon sx={{ color:"black", fontSize: "30px"}}/>
        </IconButton>
      )} */}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => dispatch(toggleOpenDrawer())}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Sidebar */}
      {!isMobile && <Box sx={{ display: "flex" }}>{sidebarContent}</Box>}
    </>
  );
};

export default UserCards;
