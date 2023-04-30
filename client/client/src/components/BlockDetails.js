import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { useParams } from "react-router-dom";

import { Card, CardContent, Typography, Button } from "@material-ui/core";
const { abi } = require("../contracts_abi/Blockchain.json");
const { ethers } = require("ethers");
const Web3 = require("web3");
const web3 = new Web3();

require("dotenv").config({path: "D:/Tarun/Mern stack/Mini/client/client/.env"});
function BlockDetails() {
  const { index } = useParams();
  const [blockDetails, setBlockDetails] = useState({
    functionality: "",
    os: "",
    language: "",
    domain: "",
    date: "",
    component: "",
    description: "",
    fileHash: "",
    transactionHash: "",
  });
  // async function bytes32ToString(bytes32) {
  //   console.log("input bytes32 value:", bytes32);
  //   const hash = await ethers.utils.hexlify(bytes32);
  //   const str = await ethers.utils.hexDataSlice(hash, 0, 32);
  //   console.log("hex string:", str);
  //   if (str.length !== 64) {
  //     throw new Error("Invalid bytes32 value");
  //   }
  //   const nullIndex = str.indexOf("\u0000");
  //   const paddedStr = "0x" + str;
  //   console.log("padded string:", paddedStr);
  //   return nullIndex !== -1 ? ethers.utils.parseBytes32String(paddedStr.substring(0, nullIndex)) : ethers.utils.parseBytes32String(paddedStr);
  // }

  async function GetBlockDetails() {
    console.log(`GetBlockDetails is called`);
    console.log(`index is  ${index}`);
    const resNodeJS = await fetch("/getBlockDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        index,
      }),
    });
    console.log(`res is`, resNodeJS);
    let description = "";
    if (resNodeJS.status === 200) {
      resNodeJS.json().then((data) => {
        description = data;
      });
    } else {
      console.log(`error occured in retriving the description from the database`);
    }
    console.log(`description is `, description);
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider);
    console.log(`abi is ${abi}`);
    const contract = new ethers.Contract(process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS, abi, provider);
    console.log(`contract is `, contract);
    const res = await contract.getDetails(index);
    console.log(`res : `, res);
    const originalFileHash = res[6];
const originalTransactionHash = res[7];
console.log(`originalfileHash`,originalFileHash);
console.log(`originalTransactionHash`,originalTransactionHash);
    await setBlockDetails({
      functionality: res[0],
      domain: res[3],
      os: res[1],
      language: res[2],
      date: res[5],
      component: res[4],
      description: description,
      fileHash: originalFileHash ,
      transactionHash: originalTransactionHash,
    });
    console.log(`blockDetails is `, blockDetails);
  }

  useEffect(() => {
    GetBlockDetails();
  }, [index]);

  return (
    <>
    <NavBar />
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
        padding: "16px",
      }}
    >
      {blockDetails.component ? (
        <div
          style={{
            maxWidth: "800px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h4" style={{ marginBottom: "16px" }}>
            {blockDetails.component}
          </Typography>
          <div style={{ marginBottom: "16px" }}>
            <Typography style={{padding:"5px"}}>
              Domain : {blockDetails.domain}
            </Typography>
            <Typography  style={{padding:"5px"}}>
              Description : {blockDetails.description}
            </Typography>
            <Typography style={{padding:"5px"}}>
              Created On : {blockDetails.date}
            </Typography>
            <Typography style={{padding:"5px"}}>
              Functionality : {blockDetails.functionality}
            </Typography>
            <Typography style={{padding:"5px"}}>
              Operating System : {blockDetails.os}
            </Typography>
            <Typography style={{padding:"5px"}}>
              Language : {blockDetails.language}
            </Typography>
            <Typography style={{padding:"5px"}}>
              fileHash: {blockDetails.fileHash}
            </Typography>
            <Typography style={{padding:"5px"}}>
              transactionHash: {blockDetails.transactionHash}
            </Typography>
            <Typography style={{padding:"5px"}}>
              You can View the code of this component at :{" "}
              <a
                href={`https://ipfs.io/ipfs/${blockDetails.fileHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  color: "#3f51b5",
                  marginLeft: "4px",
                  cursor: "pointer",
                }}
              >
                https://ipfs.io/ipfs/{blockDetails.fileHash}
              </a>
            </Typography>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  </>
  );
}

export default BlockDetails
