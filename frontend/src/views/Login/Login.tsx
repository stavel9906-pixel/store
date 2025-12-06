import {
  Alert,
  Button,
  Card,
  CardMedia,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Snackbar,
  TextField,
} from "@mui/material";
import { Symbol } from "./Symbol";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import LockIcon from "@mui/icons-material/Lock";
import { useEffect, useRef, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import { useGoogleLogin } from "@react-oauth/google";
import usersApi from "../../api/usersApi";
import { AuthResponse } from "../../utils/types";
import { AxiosError, AxiosResponse } from "axios";
import { getGoogleUser } from "./getGoogleSignin";
import { useNavigate } from "react-router";
import { authFormFields } from "./authFields";
import { AuthField } from "../../utils/enums";

export const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorDetails, setErrorDetails] = useState("");
  const toRemember = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState(authFormFields);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") || sessionStorage.getItem("token")) {
      navigate("/home");
    }
  }, [navigate]);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const googleUser = await getGoogleUser(tokenResponse.access_token);
      handleLoginRegister(
        googleUser.name,
        googleUser.email,
        undefined,
        googleUser.picture
      );
    },
    onError: () => {
      setErrorAlert(true);
      setErrorDetails("Signing In With Google Failed");
    },
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) =>
      prev.map((field) => (field.name === name ? { ...field, value } : field))
    );
  };

  const handleLoginRegister = async (
    name: string | undefined,
    email: string,
    password?: string | undefined,
    profile?: string
  ) => {
    let response: AxiosResponse<AuthResponse>;

    try {
      if (!password) {
        response = await usersApi.users().signIn(email, name!, profile);
      } else if (!name) {
        response = await usersApi.users().login(email, password);
      } else {
        response = await usersApi.users().register(name, email, password);
      }

      const token = response?.data.token;

      toRemember.current?.checked
        ? localStorage.setItem("token", token)
        : sessionStorage.setItem("token", token);

      navigate("/home");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      setErrorAlert(true);
      setErrorDetails(
        error.response?.data.message || "An Error Occured Try Again"
      );
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleValidation = () => {
    let allValid = true;

    const newFormData = formData.map((field) => {
      const valid =
        field.name === "confirmedPassword"
          ? field.validate(field.value, formData)
          : field.validate(field.value);
      if (!valid) allValid = false;

      return {
        ...field,
        showError: !valid,
      };
    });
    setFormData(newFormData);

    if (allValid) {
      handleLoginRegister(
        newFormData[AuthField.USERNAME].value,
        newFormData[AuthField.EMAIL].value,
        newFormData[AuthField.PASSWORD].value
      );
    } else if (
      isLogin &&
      !newFormData[AuthField.EMAIL].showError &&
      !newFormData[AuthField.PASSWORD].showError
    ) {
      handleLoginRegister(
        undefined,
        newFormData[AuthField.EMAIL].value,
        newFormData[AuthField.PASSWORD].value
      );
    }
  };

  return (
    <>
      <Card sx={{ display: "flex", justifyContent: "center" }}>
        <Symbol />
      </Card>
      <div className="container text-center">
        {!isLogin && (
          <div className="row justify-content-md-center">
            <div className="col mt-5">
              <PersonIcon
                className="mr-1"
                sx={{ fontSize: 50 }}
                color="primary"
              />
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                className="col-md-6"
                value={formData[AuthField.USERNAME].value}
                onChange={(e) =>
                  handleChange(
                    formData[AuthField.USERNAME].name,
                    e.target.value
                  )
                }
                error={formData[AuthField.USERNAME].showError}
                helperText={
                  formData[AuthField.USERNAME].showError
                    ? formData[AuthField.USERNAME].errorMessage
                    : ""
                }
              />
            </div>
          </div>
        )}
        <div className="row justify-content-md-center">
          <div className="col mt-5">
            <MarkunreadIcon
              className="mr-1"
              sx={{ fontSize: 50 }}
              color="primary"
            />
            <TextField
              value={formData[AuthField.EMAIL].value}
              onChange={(e) =>
                handleChange(formData[AuthField.EMAIL].name, e.target.value)
              }
              error={formData[AuthField.EMAIL].showError}
              helperText={
                formData[AuthField.EMAIL].showError
                  ? formData[AuthField.EMAIL].errorMessage
                  : ""
              }
              id="outlined-basic"
              label="Email"
              variant="outlined"
              className="col-md-6"
            />
          </div>
        </div>
        <div className="row">
          <div className="col mt-5">
            <LockIcon
              className="mr-1"
              sx={{ fontSize: 50 }}
              color="primary"
            />
            <FormControl
              variant="outlined"
              className="col-md-6"
            >
              <TextField
                value={formData[AuthField.PASSWORD].value}
                onChange={(e) =>
                  handleChange(
                    formData[AuthField.PASSWORD].name,
                    e.target.value
                  )
                }
                error={formData[AuthField.PASSWORD].showError}
                helperText={
                  formData[AuthField.PASSWORD].showError
                    ? formData[AuthField.PASSWORD].errorMessage
                    : ""
                }
                id="password"
                type={showPassword ? "text" : "password"}
                label="Password"
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
            </FormControl>
          </div>
        </div>
        {!isLogin && (
          <div className="row">
            <div className="col mt-5">
              <LockIcon
                className="mr-1"
                sx={{ fontSize: 50 }}
                color="primary"
              />
              <FormControl
                variant="outlined"
                className="col-md-6"
              >
                <TextField
                  value={formData[AuthField.CONFIRMED_PASSWORD].value}
                  onChange={(e) =>
                    handleChange(
                      formData[AuthField.CONFIRMED_PASSWORD].name,
                      e.target.value
                    )
                  }
                  error={formData[AuthField.CONFIRMED_PASSWORD].showError}
                  helperText={
                    formData[AuthField.CONFIRMED_PASSWORD].showError
                      ? formData[AuthField.CONFIRMED_PASSWORD].errorMessage
                      : ""
                  }
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Confirm password"
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
              </FormControl>
            </div>
          </div>
        )}
        <div className="mt-3">
          <Link
            href="#"
            color="inherit"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? register"
              : "Already have an account? Login"}
          </Link>
        </div>
        <FormControlLabel
          control={<Checkbox inputRef={toRemember} />}
          label="Remember me"
        />
        <br />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#000cb1ff", fontSize: 20 }}
          className="col-md-2 mt-3"
          onClick={handleValidation}
        >
          {isLogin ? "Login" : "register"}
        </Button>
      </div>

      <div className="mt-4">OR</div>
      <Divider
        variant="middle"
        sx={{ width: 700 }}
        className="mx-auto mb-4"
      />

      <button
        className="btn btn-lg d-flex mx-auto b-2 btn-outline-dark"
        onClick={() => login()}
      >
        <CardMedia
          component="img"
          sx={{ width: 30 }}
          image="/src/images/icon-google.png"
          className="mr-2"
        />
        <span>Sign in with Google</span>
      </button>
      <Snackbar
        open={errorAlert}
        onClose={() => setErrorAlert(false)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">{errorDetails}</Alert>
      </Snackbar>
      <br />
    </>
  );
};
