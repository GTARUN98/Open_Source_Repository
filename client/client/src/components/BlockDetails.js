import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { useParams } from "react-router-dom";
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
    <div>
      <NavBar />
      {blockDetails.component ? (
        <div>
          <h1>{blockDetails.component}</h1>
          <div>
            <p>Domain : {blockDetails.domain}</p>
            <p>Description : {blockDetails.description}</p>
            <p>Created On : {blockDetails.date}</p>
            <p>Functionality : {blockDetails.functionality}</p>
            <p>Operating System : {blockDetails.os}</p>
            <p>Language : {blockDetails.language}</p>
            <p>fileHash: {blockDetails.fileHash}</p>
            <p>transactionHash: {blockDetails.transactionHash}</p>
            <p>You can View the code of this component at : <a>https://ipfs.io/ipfs/{blockDetails.fileHash}</a></p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default BlockDetails
