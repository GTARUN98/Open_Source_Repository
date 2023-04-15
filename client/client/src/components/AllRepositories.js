import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import NavBar from "./NavBar";
import { Container,Box,Typography,TextField,TextareaAutosize,Button,Grid } from "@mui/material";
import BlockCard from "./BlockCard";



const AllRepositories = () => {
  return(<>
    <NavBar/>
    {/* <Typography style={{ textAlign: "center",alignItems:'center',justifyContent:"center",marginTop:"15px"}} >All Repositories</Typography> */}
    <Container maxWidth="s" style={{marginTop:'4',alignItems:'center'}}>
        <Box style={{marginTop:'15px'}}>
        <Grid container spacing={2} style={{display:'flex',flexDirection:'row'}}>
            <Grid item xs={2}>
                <TextField
                name='email'
                id='email'
                 
                fullWidth
                label='Functionality'
                // value=;
                onChange={(e)=>{}}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                name='password'
                id='password'
                 
                fullWidth
                label='Os'
                // value=
                onChange={(e)=>{}}
                /></Grid>
            <Grid item xs={2}>
                <TextField
                name='password'
                // id='password'
                 
                fullWidth
                label='Language'
                // value=
                onChange={(e)=>{}}
                /></Grid>
            <Grid item xs={2}>
                <TextField
                name='password'
                id=''
                 
                fullWidth
                label='Domain'
                // value=
                onChange={(e)=>{}}
                />
                </Grid>
            <Grid item xs={3}>
                <TextField
                name='password'
                // id=''
                 
                fullWidth
                label='Component'
                // value=
                onChange={(e)=>{}}
                />
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{marginTop:"2px"}}>
            <Grid item xs={3} >
                <TextField
                name='email'
                id='email'
                 
                fullWidth
                label='Functionality'
                // value=;
                onChange={(e)=>{}}
                />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" fullWidth>Filter</Button>
                
                </Grid>
                </Grid>
        </Box>
        
        <BlockCard/>
    </Container>
    </>);
};

export default AllRepositories;
