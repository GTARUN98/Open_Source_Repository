import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@material-ui/core";
import NavBar from "./NavBar";
const {abi} = require("../contracts_abi/Blockchain.json")
const { ethers } = require( "ethers");
require("dotenv").config({path: "D:/Tarun/Mern stack/Mini/client/client/.env"});
// const util = require('util');
// const { TextEncoder } = require('util').TextEncoder || require('util@0.10.0');
// const encoder = new TextEncoder();

function TransactionsMade() {
  // State variable to hold the block details
  const [blocks, setBlocks] = useState([]);
  const navigate = useNavigate();

  

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
    console.log(`contract is `,contract)
    // console.log(`process.env is working`,process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS)
    const example =1;
    const resNodeJSBlockArray = await fetch("/getUserBlockArray", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },body: JSON.stringify({
          example
      })
        
      });
    const blockDetails = await resNodeJSBlockArray.json();
    console.log(`blockDetails is `,blockDetails)
    
    const blockDetailsInfo = [];
    for (let i = 0; i < blockDetails.length; i++) {
      let block = await contract.getDetails(i);
      console.log(`block is`,block)
      // Add the block details to the array
      const date = block[5]
      const blockHash = block[7];
      const data = {
        blockHash,
        date
      }
      console.log(`block hash in string is `,blockHash)
      blockDetailsInfo.push(data);
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
      <NavBar/>
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
        <CardContent style={{ display: "flex" }}>
          <Typography>Transaction Hash : {block.blockHash}</Typography>
          <Typography style={{ marginLeft: "auto" }}>
            Created on: {block.date}
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
              window.open(`https://sepolia.etherscan.io/tx/${block.blockHash}`, '_blank');
            }}
          >
            See Transaction Details
          </Button>
        </CardContent>
      </Card>
      ))}
    </div>
  );
}

export default TransactionsMade;