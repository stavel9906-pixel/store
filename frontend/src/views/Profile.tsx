import {
  Box,
  Card,
  Avatar,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useGetUserFromToken } from "../api/hooks/useGetUserFromToken";
import { authFormFields } from "./Login/authFields";
import { AuthField } from "../utils/enums";
import LockPersonOutlinedIcon from "@mui/icons-material/LockPersonOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import usersApi from "../api/usersApi";
import Swal from "sweetalert2";

export const Profile = () => {
  const { user } = useGetUserFromToken();
  const [form, setForm] = useState(authFormFields);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (user) {
      setForm((prev) => {
        const newFormData = [...prev];
        newFormData[AuthField.USERNAME] = {
          ...newFormData[AuthField.USERNAME],
          value: user.name || "",
        };
        newFormData[AuthField.EMAIL] = {
          ...newFormData[AuthField.EMAIL],
          value: user.email || "",
        };
        newFormData[AuthField.PROFILE] = {
          ...newFormData[AuthField.PROFILE],
          value: user.profile || "",
        };
        return newFormData;
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    let allValid = true;

    const newFormData = form.map((field) => {
      const valid =
        field.name === "confirmedPassword"
          ? field.validate(field.value, form)
          : field.validate(field.value);
      if (!valid) allValid = false;

      return {
        ...field,
        showError: !valid,
      };
    });
    setForm(newFormData);

    if (allValid) {
      const formData = new FormData();
      if (fileInputRef.current?.files && fileInputRef.current.files[0]) {
        formData.append("profile", fileInputRef.current.files[0]); // 'profile' — שם השדה multer מצפה לו
      }

      // 2) שדות אחרים
      formData.append("id", user!.id.toString());
      formData.append("name", form[AuthField.USERNAME].value);
      formData.append("oldPassword", form[AuthField.CURRENT_PASSWORD].value);
      formData.append("newPassword", form[AuthField.PASSWORD].value);

      try {
        const token = (await usersApi.users().updateUser(formData)).data.token;
        localStorage.getItem(token)
          ? localStorage.setItem("token", token)
          : sessionStorage.setItem("token", token);
      } catch (err) {
        console.log(err);
        Swal.fire(
          "Oops!",
          "The Current Password You Entered Doesn't Match The Old One.",
          "error"
        );
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) =>
      prev.map((field) => (field.name === name ? { ...field, value } : field))
    );
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #ddd",
        justifyContent: "center",
        ml: "10rem",
      }}
    >
      <Card
        sx={{
          display: "flex",
          width: "90%",
          borderRadius: 3,
        }}
      >
        {/* LEFT COLUMN: PROFILE IMAGE */}
        <Box
          sx={{
            flex: "0 0 25%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            py: 5,
            px: 2,
          }}
        >
          {/* input לקובץ – מוסתר */}
          <input
            type="file"
            accept="image/*"
            id="upload-profile"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const imageUrl = URL.createObjectURL(file);

              setForm((prev) =>
                prev.map((field) =>
                  field.name === form[AuthField.PROFILE].name
                    ? { ...field, value: imageUrl }
                    : field
                )
              );
            }}
          />

          <label
            htmlFor="upload-profile"
            style={{ cursor: "pointer" }}
          >
            <Avatar
              src={
                form[AuthField.PROFILE].value ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              sx={{
                width: "10vw",
                height: "20vh",
                mb: 2,
                transition: "0.2s",
                "&:hover": { opacity: 0.8 },
              }}
            />
          </label>

          <Typography fontWeight="bold">
            {form[AuthField.USERNAME].value || "User Name"}
          </Typography>
          <Typography color="text.secondary">
            {form[AuthField.EMAIL].value || "email@example.com"}
          </Typography>
        </Box>

        {/* MIDDLE COLUMN: PROFILE SETTINGS */}
        <Box
          sx={{
            flex: "0 0 45%",
            p: 3,
            borderRight: "1px solid #ddd",
          }}
        >
          <Typography
            variant="h6"
            mb={2}
          >
            Profile Settings
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Username"
              name="username"
              value={form[AuthField.USERNAME].value}
              onChange={handleChange}
              fullWidth
              size="small"
              error={form[AuthField.USERNAME].showError}
              helperText={
                form[AuthField.USERNAME].showError
                  ? form[AuthField.USERNAME].errorMessage
                  : ""
              }
            />
            <TextField
              label="Email"
              name="email"
              disabled
              value={form[AuthField.EMAIL].value}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Current Password"
              name={form[AuthField.CURRENT_PASSWORD].name}
              value={form[AuthField.CURRENT_PASSWORD].value}
              onChange={handleChange}
              fullWidth
              size="small"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="New Password"
              name={form[AuthField.PASSWORD].name}
              value={form[AuthField.PASSWORD].value}
              onChange={handleChange}
              fullWidth
              size="small"
              type={showPassword ? "text" : "password"}
              error={form[AuthField.PASSWORD].showError}
              helperText={
                form[AuthField.PASSWORD].showError
                  ? form[AuthField.PASSWORD].errorMessage
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              name={form[AuthField.CONFIRMED_PASSWORD].name}
              value={form[AuthField.CONFIRMED_PASSWORD].value}
              onChange={handleChange}
              fullWidth
              size="small"
              type={showPassword ? "text" : "password"}
              error={form[AuthField.CONFIRMED_PASSWORD].showError}
              helperText={
                form[AuthField.CONFIRMED_PASSWORD].showError
                  ? form[AuthField.CONFIRMED_PASSWORD].errorMessage
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              sx={{
                mt: 2,
                background: "rgb(99, 39, 120)",
                "&:hover": { background: "#682773" },
              }}
              onClick={handleSubmit}
            >
              Save Profile
            </Button>
          </Stack>
        </Box>
        <Box
          sx={{
            flex: "0 0 30%",
            pb: 2,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <LockPersonOutlinedIcon
              sx={{ fontSize: "25rem", color: "gray" }}
            ></LockPersonOutlinedIcon>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
