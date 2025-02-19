import React from "react";
import { Box, Card, CardContent, Typography, Grid, CircularProgress } from "@mui/material";
import { useGetAnalyticsQuery } from "../../services/api";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const UserAnalytics: React.FC = () => {
  const { data: analyticsData, isLoading: analyticsLoading } = useGetAnalyticsQuery();

  if (analyticsLoading) {
    return (
      <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
        >
          <CircularProgress size={50} />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      width="100%"
      padding={4}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {/* Total Groups Created */}
      <motion.div variants={fadeInUp}>
        <Card
          sx={{
            mb: 3,
            px: 3,
            py: 2,
            background: "linear-gradient(135deg, #6EE7B7 0%, #3D5A80 100%)",
            textAlign: "center",
            boxShadow: 5,
            color: "#FFF",
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Typography variant="h5" fontWeight={700}>
              Total Groups Created
            </Typography>
            <Typography variant="h3" fontWeight={800} mt={1}>
              {analyticsData?.data?.totalGroupsCreated}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>

      {/* Group User Counts */}
      <Grid container spacing={3} justifyContent="center">
        {analyticsData?.data.groupUserCounts.map((group: any, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={group.groupId}>
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                sx={{
                  boxShadow: 4,
                  borderLeft: "6px solid #3D5A80",
                  borderRadius: 2,
                  backgroundColor: "#F9FAFB",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600} color="#3D5A80">
                    {group.name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Members: <strong>{group.totalMembers}</strong>
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserAnalytics;
