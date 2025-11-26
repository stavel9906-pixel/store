import { Card, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { Symbol } from "../components/Symbol";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <>
      <Card sx={{ display: "flex", justifyContent: "center" }}>
        <Symbol />
      </Card>

      <div className="container text-center">
        <div className="row justify-content-md-center">
          <div className="col mt-5">
            <MarkunreadIcon
              className="mr-1"
              sx={{ fontSize: 50 }}
              color="primary"
            />
            <TextField
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
              <InputLabel htmlFor="password">
                Password
              </InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                endAdornment={
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
                }
              />
            </FormControl>
          </div>
        </div>
      </div>

      {/* <Box sx={{margin: "auto", gap: 5, }}>
        <TextField id="outlined-basic" label="email" variant="outlined" />
                <MarkunreadIcon />
            
        
        <TextField id="outlined-basic" label="password" variant="outlined"  />
    </Box> */}
    </>
  );
};
