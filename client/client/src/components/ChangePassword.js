import React, { useState } from "react";
import { Box, Container, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [pass, setPass] = useState("");
  const [cPass, setCPass] = useState("");
  const navigate = useNavigate()
  async function handleChangePassword() {
    let res = await fetch("/changePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: pass,
        confirmPassword: cPass,
        email: localStorage.getItem("email"),
      }),
    });
    if (res.status === 200) {
      console.log("password changed successfully");
      navigate('/login')
    } else {
      console.log(`error in changing password ${res.json}`);
    }
  }

  return (
    <Container
      maxWidth="xs"
      style={{
        marginTop: "4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography>Forgot Password</Typography>
      <Box style={{ marginTop: "15px" }}>
        <TextField
          name="password"
          id="password"
          type="password"
          required
          fullWidth
          label="New Password"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
          }}
          style={{marginBottom:"10px"}}
        />
        <TextField
          name="newPassword"
          id="newPassword"
          required
          fullWidth
          label="Confirm New Password"
          value={cPass}
          onChange={(e) => {
            setCPass(e.target.value);
          }}
          style={{marginBottom:"10px"}}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleChangePassword}
          style={{
            marginTop: "15px",
            marginBottom: "3px",
          }}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default ChangePassword;

