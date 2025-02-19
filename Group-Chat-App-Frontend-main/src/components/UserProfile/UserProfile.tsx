import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PasswordInput from "../PasswordInput/PasswordInput";
import {
  useLazyMeQuery,
  useUpdateUserMutation,
} from "../../services/api";
import { toast } from "react-toastify";
import { User } from "../../types";

interface UserProfileProps {
  data: User;
}

const validation = yup.object({
  email: yup.string().email("Email is invalid").required("Email is required"),
  name: yup.string().required("Name is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Minimumn 5 chars are required")
    .max(16, "Miximumn 16 chars allowed"),
});

type FormData = typeof validation.__outputType;

const UserProfile: React.FC<UserProfileProps> = ({data}) => {
  const [fetchUser] = useLazyMeQuery();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [avatarClicked, setAvatarClicked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      email: data.email,
      password: "",
      name: data.name,
    },
    resolver: yupResolver(validation),
  });

  // Handle profile update
  const handleUpdateProfile = useCallback(
    async (updationData: FormData) => {
      const id = toast.loading("Updating profile...",{position: "top-center"});
      const payload = { _id: data._id, ...updationData };
      try {
        await updateUser(payload).unwrap();
        await fetchUser().unwrap();
        toast.dismiss(id);
        toast.success("Profile updated successfully!");
      } catch (error: any) {
        const validationError = error?.data?.data?.errors?.[0].msg;
        toast.dismiss(id);
        toast.error(
          validationError ?? error?.data?.message ?? "Something went wrong!"
        );
      }
    },
    [data._id, updateUser, fetchUser]
  );

  return (
    <motion.div
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    >
      <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="40vh"
      color="black"
      sx={{
        // background: "linear-gradient(135deg, #5f6e8e, #2c3e50)",
        p: 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          borderRadius: 4,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          // background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(15px)",
          padding: 3,
        }}
      >
        <CardContent>
          <Grid container spacing={3} justifyContent="center">
            {/* Left Side - Profile Image & Details */}
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <motion.div
                whileTap={{ scale: 1.2 }}
                animate={{ y: avatarClicked ? [0, -10, 0] : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                onClick={() => setAvatarClicked((prev) => !prev)}
                style={{ display: "inline-block" }}
              >
                <Avatar
                  src={
                    data.imageUrl ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${data?.name}`
                  }
                  alt="Profile"
                  sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
                />
              </motion.div>
              <Typography
                variant="h5"
                fontWeight={600}
                mt={2}
                sx={{
                  // background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                  // WebkitBackgroundClip: "text",
                  // WebkitTextFillColor: "transparent",
                }}
              >
                {data.name}
              </Typography>
              <Typography variant="body2" >
                {data.email}
              </Typography>
              <Typography variant="body2" >
                Role: {data.role}
              </Typography>
            </Grid>

            {/* Right Side - Form for Updating Profile */}
            <Grid item xs={12}>
              <Box
                component="form"
                onSubmit={handleSubmit(handleUpdateProfile)}
                display="flex"
                flexDirection="column"
                gap={2}
              >
                <TextField
                  fullWidth
                  type="text"
                  placeholder="Name"
                  label="Name"
                  {...register("name")}
                  error={Boolean(errors.name?.message)}
                  helperText={errors.name?.message}
                  // sx={{
                  //   "& .MuiOutlinedInput-root": {
                  //     "& fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
                  //     "&:hover fieldset": { borderColor: "#64B5F6" },
                  //   },
                  //   "& .MuiInputBase-input": { color: "white" },
                  //   "& .MuiFormLabel-root": {
                  //     color: "rgba(255, 255, 255, 0.8)",
                  //   },
                  // }}
                />
                <TextField
                  fullWidth
                  type="text"
                  placeholder="Email"
                  label="Email"
                  {...register("email")}
                  error={Boolean(errors.email?.message)}
                  helperText={errors.email?.message}
                  // sx={{
                  //   "& .MuiOutlinedInput-root": {
                  //     "& fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
                  //     "&:hover fieldset": { borderColor: "#64B5F6" },
                  //   },
                  //   "& .MuiInputBase-input": { color: "white" },
                  //   "& .MuiFormLabel-root": {
                  //     color: "rgba(255, 255, 255, 0.8)",
                  //   },
                  // }}
                />
                <PasswordInput
                  fullWidth
                  type="password"
                  placeholder="Confirm Password"
                  label="Confirm password"
                  error={Boolean(errors.password?.message)}
                  helperText={errors.password?.message}
                  {...register("password")}
                  // sx={{
                  //   "& .MuiOutlinedInput-root": {
                  //     "& fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
                  //     "&:hover fieldset": { borderColor: "#64B5F6" },
                  //   },
                  //   "& .MuiInputBase-input": { color: "white" },
                  //   "& .MuiFormLabel-root": {
                  //     color: "rgba(255, 255, 255, 0.8)",
                  //   },
                  // }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!isDirty || !isValid}
                  loading={isLoading}
                  sx={{
                    // fontSize: "16px",
                    // fontWeight: 600,
                    // background: "linear-gradient(to right, #A6FFCB)",
                    // color: "black",
                    // boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                    // textTransform: "none",
                    transition: "0.3s",
                    "&:hover": {
                      // background: "linear-gradient(to right, rgb(1, 37, 17))",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  Update Profile
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
    </motion.div>
  );
};

export default UserProfile;
