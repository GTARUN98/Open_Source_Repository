import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { IconButton, Grid, Typography, Button } from "@material-ui/core";

const Profile = () => {
  const navigate = new useNavigate();
  const [userData, setUserData] = useState();
  async function fetchData() {
    // console.log("fetch data is called")
    try {
      const example=1;
      const res = await fetch("/profile", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },body: JSON.stringify({
          example
        }),
        credentials: "include",
      });
      //console.log(res.status)
      const data = await res.json();
      console.log(`data is`, data)
      setUserData(data);
      // console.log(userData.WPM)
      if (res.status === 422) {
        navigate("/errorProfile");
        return res.json();
      }
    } catch (error) {
      console.log("Error is ", error);
    }

    //setStatus(res.status)
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <NavBar />
      {userData && (
        <div
        className="container emp-profile"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "75px",
        }}
      >
          <form method="" style={{ jusifyContent: "center",width:"50vw",alignItems:"center" }}>
            <div className="row">
              <div className="col-md-4">
                <div></div>
              </div>
              {userData && (
                <div className="col-md-6">
                  <div className="profile-head">
                    {userData !== "" && (
                      <h5>
                      Hello {userData.firstName}, welcome to our platform!
                    </h5>
                    )}
                    {/* <h6>Useless</h6> */}
                    {/* <ul
                      className="nav nav-tabs"
                      style={{ marginBottom: "30px" }}
                    >
                      <li className="active" style={{ marginLeft: "100px" }}>
                        <a
                          href="#home"
                          style={{
                            color: "black",
                            textDecoration: "none",
                            "&:hover": { color: "white" },
                          }}
                          data-toggle="tab"
                        >
                          Details
                        </a>
                      </li>
                    </ul> */}
                    <hr />
                  </div>
                </div>
              )}
              {/* <div className="col-md-2">
                <input
                  type="submit"
                  className="profile-edit-btn"
                  value="Edit Profile"
                />
              </div> */}
            </div>

            <div className="row">
              <div className="col-md-4">
                {/* <div className='profile-work'>
                            <p>My Works</p>
                            <a href="https://www.linkedin.com/in/tarun-garlapati"  target="_blank" rel="noreferrer" style={{textDecoration:'none',color:'black'}} >LinkedIn</a><br/>
                            <a href="https://github.com/GTARUN98/"  target="_blank"  rel="noreferrer" style={{textDecoration:'none',color:'black'}}>GitHub</a><br/>
                            <a href="https://www.google.com"  target="_blank" rel="noreferrer" style={{textDecoration:'none',color:'black'}}>Instagram</a><br/>
                            <a href="https://drive.google.com/file/d/1t3V3-5ZINjYn3Cyi5PL0dksYqLyDhcOP/view?usp=share_link" target="blank" rel="noreferrer" style={{textDecoration:'none',color:'black'}}>Resume</a><br/>
                            <br/>
                            <a href="#" style={{textDecoration:'none',color:'black'}}>HIRE ME!</a><br/>
                        </div> */}
              </div>
              <div className="col-md-8 pl-5 about-info">
                <div className="tab-content profile-tab" id="myTabContent">
                  {userData && (
                    <div
                      className="tab-pane fade show active"
                      id="home"
                      role="tabpanel"
                      aria-labelledby="home-tab"
                    >
                      <div className="row">
                        <div className="col-md-6">
                          <label>USER ID</label>
                        </div>
                        <div className="col-md-6">
                          {userData !== "" && <label>{userData._id}</label>}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <label>Name</label>
                        </div>
                        <div className="col-md-6">
                          <label>{userData.firstName}</label>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <label>Email Id</label>
                        </div>
                        <div className="col-md-6">
                          <label>{userData.email}</label>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <label>No Of Blocks Made</label>
                        </div>
                        <div className="col-md-6">
                          <label>{userData.blockNo.length}</label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
       {/* <Grid container spacing={3} style={{ marginTop: "30px" }}>
        <Typography>Technologies Used :</Typography>
      <Grid item>
        <IconButton
          onClick={() => window.open("https://metamask.io/", "_blank")}
        >
          <img
            src="https://th.bing.com/th/id/OIP.Ffs2vKUKu1riXoQ4DClm-AHaFj?w=216&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"  // Replace with the actual image URL
            alt="Metamask Icon"
            style={{ width: "100px", height: "100px" }}  // Adjust size as needed
          />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton
          onClick={() => window.open("https://www.trufflesuite.com/", "_blank")}
        >
          <img
            src="https://www.bing.com/th?id=OIP.UBeiFOv8WAVANvaleb-flwHaD0&w=204&h=105&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2"  // Replace with the actual image URL
            alt="Truffle Icon"
            style={{ width: "100px", height: "100px" }}  // Adjust size as needed
          />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton
          onClick={() => window.open("https://alchemyapi.io/", "_blank")}
        >
          <img
            src="https://th.bing.com/th/id/OIP.HiczukXmnymeQW3SSDQpSQHaHa?w=177&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"  // Replace with the actual image URL
            alt="Alchemy Icon"
            style={{ width: "100px", height: "100px" }}  // Adjust size as needed
          />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton
          onClick={() => window.open("https://solidity.readthedocs.io/", "_blank")}
        >
          <img
            src="https://th.bing.com/th/id/OIP.2nk7RxvCv0SwNA2T7HTsswHaHa?w=170&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"  // Replace with the actual image URL
            alt="Solidity Icon"
            style={{ width: "100px", height: "100px" }}  // Adjust size as needed
          />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton
          onClick={() => window.open("https://ethereum.org/", "_blank")}
        >
          <img
            src="https://th.bing.com/th/id/OIP.ZZSxbwfHx0kf4TNqEDTJ3QHaHa?w=198&h=198&c=7&r=0&o=5&dpr=1.3&pid=1.7"  // Replace with the actual image URL
            alt="Ethereum Icon"
            style={{ width: "100px", height: "100px" }}  // Adjust size as needed
          />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton
          onClick={() => window.open("https://sepolia.io/", "_blank")}
        >
          <img
            src="https://th.bing.com/th/id/OIP.nD1tsNdmeFzxLd0ia39FbQAAAA?w=151&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"  // Replace with the actual image URL
            alt="Sepolia Icon"
            style={{ width: "100px", height: "100px" }}  // Adjust size as needed
          />
        </IconButton>
      </Grid>
    </Grid> */}
    </>
  );
};

export default Profile;
