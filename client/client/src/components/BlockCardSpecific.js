import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@material-ui/core";
const {abi} = require("../contracts_abi/Blockchain.json")
const { ethers } = require( "ethers");

require("dotenv").config({path: "D:/Tarun/Mern stack/Mini/client/client/.env"});
function BlockCardSpecific() {
  // State variable to hold the block details
  const [blocks, setBlocks] = useState([]);
  const navigate = useNavigate();

  // const contractAddress = process.env.CONTRACT_ADDRESS;

  async function fetchBlockDetails() {
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider);
    console.log(`abi is ${abi}`);
    const contract = new ethers.Contract(
      process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS,
      abi,
      provider
    );
    const example=1;
    console.log(`contract is `,contract)
    const resNodeJSBlockArray = await fetch("/getUserBlockArray", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          example,
        }),
      });
    const blockDetails = await resNodeJSBlockArray.json();
    console.log(`blockDetails is `,blockDetails)
    // Loop through each block and get its details
    // for (let i = 0; i < blockCount; i++) {
    //   const block = await contract.getDetails(i);
    //   console.log(`block is`,block)
    //   // Add the block details to the array
    //   blockDetails.push(block);
    //   console.log(`blockDetails is `,blockDetails)
    // }
    // Update the state variable with the processed block details
    console.log(`blockDetails.length `,blockDetails.length)
    const blockDetailsInfo = [];
    for (let i = 0; i < blockDetails.length; i++) {
      const block = await contract.getDetails(i);
      console.log(`block is`,block)
      // Add the block details to the array
      blockDetailsInfo.push(block);
      console.log(`blockDetails is `,blockDetails)
    }
    console.log(`blockDetailsInfo`,blockDetailsInfo)



    setBlocks(blockDetailsInfo);
    console.log(`setBlocks is `,setBlocks)
  }

  useEffect(() => {
    fetchBlockDetails();
  }, []);

  return (
    <div>
      {blocks.map((block, index) => (
        <Card
          key={index}
          style={{
            display: "flex",
            flexDirection: "row",
            margin: "5px",
            padding: "5px"
          }}
        >
          <CardContent style={{display:"flex"}}>
            <Typography>Component: {block[4]}</Typography>
            <Typography style={{  marginLeft:"900px"}}>
              Created in: {block[5]}
            </Typography>
          </CardContent>
          <CardContent>
            <Button
              style={{
                backgroundColor: "#3f51b5",
                color: "white"
              }}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/blockDetails/${index}`);
              }}
            >
              See Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default BlockCardSpecific;