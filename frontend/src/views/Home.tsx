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
import { Symbol } from "../components/Symbol";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import { useGoogleLogin } from "@react-oauth/google";

export const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [nameValue, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [emailValue, setEmailValue] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [unmatchPasswords, setUnMatchPasswords] = useState(false);
  const [isGoogleLog, setIsGoogleLog] = useState(true);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setIsGoogleLog(true);
      console.log("Success!", tokenResponse);
    },
    onError: () => {
      setIsGoogleLog(false);
    },
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleValidation = () => {
    const isNameValid = /[A-Za-z]+/.test(nameValue) && !isLogin;
    setNameError(!isNameValid);
    const isPasswordValid =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])(.){8,}$/.test(
        passwordValue
      );
    setPasswordError(!isPasswordValid);
    const isEmailValid =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailValue);
    setEmailError(!isEmailValid);
    const passwordsMatching = !isLogin && passwordValue === confirmedPassword;
    console.log(passwordsMatching);
    setUnMatchPasswords(!passwordsMatching);
    if (isNameValid && isPasswordValid && isEmailValid && passwordsMatching) {
      console.log("valid");
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
                value={nameValue}
                onChange={(event) => setName(event.target.value)}
                error={nameError}
                helperText={nameError ? "Name must have letters" : ""}
              />
            </div>{" "}
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
              value={emailValue}
              onChange={(event) => setEmailValue(event.target.value)}
              error={emailError}
              helperText={emailError ? "Email is invalid" : ""}
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
              disableUnderline
            >
              <TextField
                value={passwordValue}
                onChange={(event) => setPasswordValue(event.target.value)}
                error={passwordError}
                helperText={passwordError ? "Enter stronger password" : ""}
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
                disableUnderline
              >
                <TextField
                  value={confirmedPassword}
                  onChange={(event) => setConfirmedPassword(event.target.value)}
                  error={unmatchPasswords}
                  helperText={
                    unmatchPasswords ? "The passwords are not identical" : ""
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
          control={<Checkbox />}
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
        open={!isGoogleLog}
        onClose={() => setIsGoogleLog(true)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">Sign In With Google Failed</Alert>
      </Snackbar>
      <br />
    </>
  );
};
