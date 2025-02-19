import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  useCreateGroupMutation,
  useGetUserGroupsQuery,
} from "../../services/api";
import { toast } from "react-toastify";
import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";

// Define form schema using Yup
const groupSchema = yup.object().shape({
  name: yup
    .string()
    .required("Group name is required")
    .min(3, "Minimum 3 characters"),
  type: yup
    .string()
    .oneOf(["public", "private"], "Invalid type")
    .required("Please select a group type"),
});

// Define TypeScript types for form fields
interface GroupFormData {
  name: string;
  type: "public" | "private";
}

const CreateGroup = () => {
  const { refetch: fetch1 } = useGetUserGroupsQuery();

  // Initialize React Hook Form with validation schema
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupFormData>({
    resolver: yupResolver(groupSchema),
  });

  const [createGroup, { isLoading }] = useCreateGroupMutation();

  // Handle form submission
  const onSubmit = useCallback(
    async (data: GroupFormData) => {
      const id = toast.loading("Creating group...", { position: "top-center" });
      try {
        await createGroup(data).unwrap();
        await fetch1();
        toast.dismiss(id);
        toast.success("Group created successfully");
      } catch (error) {
        toast.dismiss(id);
        toast.error("Error creating group");
        console.error("Error creating group:", error);
      }
    },
    [createGroup, fetch1]
  );

  const styles = useMemo(
    () => ({
      maxWidth: 450,
      margin: "auto",
      padding: 4,
      boxShadow: 3,
      borderRadius: 5,
      backgroundColor: "#fff",
      textAlign: "center",
      color: "#333",
    }),
    []
  );

  return (
    <motion.div initial={{ opacity: 0, y: -100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }} style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
    <Box sx={styles}>
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
        sx={{ fontSize: "2rem", color: "#2D3E50" }}
      >
        Create Group
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Group Name Input */}
        <FormControl fullWidth margin="normal">
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Group Name"
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </FormControl>

        {/* Group Type Selection (Public/Private) */}
        <FormControl component="fieldset" error={!!errors.type} margin="normal">
          <Typography variant="subtitle1">Group Type</Typography>
          <Controller
            name="type"
            control={control}
            defaultValue="public"
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel
                  value="public"
                  control={<Radio />}
                  label="Public"
                />
                <FormControlLabel
                  value="private"
                  control={<Radio />}
                  label="Private"
                />
              </RadioGroup>
            )}
          />
          <FormHelperText>{errors.type?.message}</FormHelperText>
        </FormControl>

        {/* Submit Button */}
        <Button
          loading={isLoading}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Create Group
        </Button>
      </form>
    </Box>
    </motion.div>
  );
};

export default CreateGroup;
