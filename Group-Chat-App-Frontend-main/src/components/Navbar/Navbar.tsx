import React, { useState, useMemo } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Menu,
  Avatar,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useLogoutMutation } from "../../services/api";
import PersonIcon from "@mui/icons-material/Person";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import {
  setMessages,
  setMyGroups,
  setPublicGroups,
  setSelectedGroup,
  toggleOpenDrawer,
} from "../../store/reducers/groupReducer";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false); // Drawer open state
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog open state
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [logoutUser] = useLogoutMutation();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  //   const location = useLocation();

  //   const matchRoute = (route)=>{
  //     return matchPath( {path:route} , location.pathname)
  // }

  const handleClose = (
    route?: "profile" | "createGroup" | "logout" | "analytics"
  ) => {
    return () => {
      if (route) {
        if (route == "logout") {
          setDialogOpen(true);
        } else if (route === "profile") {
          navigate("/app/profile");
        } else if (route === "createGroup") {
          navigate("/app/createGroup");
        } else if (route === "analytics") {
          navigate("/app/analytics");
        }
      }
      setAnchorEl(null);
    };
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogoutClick = () => {
    setDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      setAnchorEl(null);
      setDialogOpen(false);
      await logoutUser().unwrap();
      dispatch(setMyGroups({ myGroups: [] }));
      dispatch(setPublicGroups({ publicGroups: [] }));
      dispatch(setSelectedGroup({ selectedGroup: null }));
      dispatch(setMessages({ messages: [] }));
    } catch (error) {}
  };

  const handleLogoutCancel = () => {
    setDialogOpen(false);
  };

  // Memoize Desktop Navbar Links
  const desktopLinks = useMemo(
    () => (
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* {!isMobile && isLoggedIn && (
          <Button
            startIcon={<GroupAddIcon />}
            color="inherit"
            component={Link}
            to="/app/createGroup"
          >
            Create Group
          </Button>
        )} */}
        {!isLoggedIn && (
          <>
            <Button
              startIcon={<LoginIcon />}
              color="inherit"
              component={Link}
              to="/auth/login"
            >
              Login
            </Button>
            <Button color="inherit" component={Link} to="/auth/register">
              SignUp
            </Button>
          </>
        )}
      </Box>
    ),
    [isLoggedIn, isMobile]
  );
  // Memoize Mobile Drawer Items
  const drawerLinks = useMemo(
    () => (
      <List sx={{ width: 250 }}>
        <ListItem component={Link} to="/app/profile">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem component={Link} to="/app/createGroup">
          <ListItemIcon>
            <GroupAddIcon />
          </ListItemIcon>
          <ListItemText primary="Create Group" />
        </ListItem>

        {isLoggedIn && (
          <>
            <Divider />
            <ListItem onClick={handleLogoutClick}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    ),
    []
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar */}
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(to right, #1e3c72, #2a5298)",
          color: "white",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600 }}>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              Twak
            </Link>
          </Typography>

          {/* Desktop Navbar Links */}
          {!isMobile && desktopLinks}

          {/* Hamburger Menu Icon (Mobile View) */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={() => dispatch(toggleOpenDrawer())}
            >
              <MenuIcon />
            </IconButton>
          )}
          {isLoggedIn && (
            <Box marginLeft="auto">
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar
                  alt={user?.name || "User"}
                  src={
                    user?.imageUrl ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${user?.name}}`
                  }
                  sx={{ width: 40, height: 40, border: "2px solid white" }}
                />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose()}
              >
                <MenuItem onClick={handleClose("profile")}>
                  <ListItemIcon>
                    <PersonIcon sx={{ color: "black" }} />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleClose("createGroup")}>
                  <ListItemIcon>
                    <GroupAddIcon sx={{ color: "black" }} />
                  </ListItemIcon>
                  Create Group
                </MenuItem>
                <MenuItem onClick={handleClose("analytics")}>
                  <ListItemIcon>
                    <AnalyticsIcon sx={{ color: "black" }} />
                  </ListItemIcon>
                  Analytics
                </MenuItem>
                <MenuItem onClick={handleClose("logout")}>
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: "black" }} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer for Navbar Links */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
          {drawerLinks}
        </Box>
      </Drawer>

      {/* Logout Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleLogoutCancel}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to logout?</DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            No
          </Button>
          <Button onClick={handleLogoutConfirm} color="secondary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Navbar;
