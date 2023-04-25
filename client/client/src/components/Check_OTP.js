import React, { useState } from "react";
import { Box, Container, Typography, TextField, Button } from "@mui/material";
import {useNavigate} from 'react-router-dom'
const Check_OTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  async function sendOtp() {
    if(otp !== ""){
    let res = await fetch("/checkOtp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: otp,
        email:  localStorage.getItem("email"),
      }),
    });
    if (res.status === 200) {
      console.log("otp is same");
      navigate('/changePassword')
    } else {
      console.log(`error in checking otp ${res.json}`);
    }
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
      <Typography>Check OTP</Typography>
      <Box style={{ marginTop: "15px" }}>
        <TextField
          name="OTP"
          id="OTP"
          required
          fullWidth
          label="Your OTP"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value);
          }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={sendOtp}
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
export default Check_OTP;
