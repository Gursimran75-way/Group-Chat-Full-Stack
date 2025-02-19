import { Box, Typography, Button } from "@mui/material";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const HomePageComponent = () => {
  const styles = useMemo(
    () => ({
      container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        bgcolor: "#f0f4f8",
        border: "1px solid #ddd",
        borderBottom: "10px solid #3D5A80",
        padding: "20px",
      },
      title: {
        color: "#2D3E50",
        marginBottom: 3,
      },
      button: {
        padding: "12px 24px",
        fontSize: "16px",
        textTransform: "none",
        boxShadow: 3,
        "&:hover": {
          backgroundColor: "#3D5A80",
        },
      },
    }),
    []
  );

  return (
    <Box sx={styles.container}>
      {/* Lottie Animation */}
      <Box width={"full"} height={"70%"} mb={2}>
        <DotLottieReact
          src="https://lottie.host/7de297e4-b5c1-4260-9480-9450718461e4/pBlIoa54vx.lottie"
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </Box>

      {/* Title */}
      <Typography variant="h2" textAlign="center" fontWeight={700} sx={styles.title}>
        Welcome to Twak
      </Typography>

      {/* Buttons */}
      <Box display="flex" justifyContent="center" gap={2}>
        <Button variant="contained" color="primary" component={Link} to="/app/createGroup" sx={styles.button}>
          Create a Group
        </Button>
      </Box>
    </Box>
  );
};

export default HomePageComponent;
