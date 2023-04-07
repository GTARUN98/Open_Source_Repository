import { useState } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import { Box,Grid,Container,Typography,TextField,Button } from "@mui/material";
const {abi} = require("../contracts_abi/Blockchain.json")
require("dotenv").config();
let Web3 = require("web3")
const startPayment = async ({ setError, setTxs, ether, addr }) => {
  /*try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    ethers.utils.getAddress(addr);
    const tx = await signer.sendTransaction({
      to: addr,
      value: ethers.utils.parseEther(ether)
    });
    console.log({ ether, addr });
    console.log("tx", tx);
    setTxs([tx]);
  } catch (err) {
    setError(err.message);
  }*/
};

export default function Transaction() {
  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);
  const component = localStorage.getItem("component")
  const domain = localStorage.getItem("domain")
  const language = localStorage.getItem("language")
  const functionality = localStorage.getItem("functionality")
  const description = localStorage.getItem("description")
  const date = localStorage.getItem("date")
  const operatingSystem = localStorage.getItem("operatingSystem")
  const fileHash = localStorage.getItem("fileHash")

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError();
    await startPayment({
      setError,
      setTxs,
      ether: "0", 
      addr: process.env.META_MASK_ID//reciever
    });
    const transactionHash = txs[0]//this wil be afterwards removed coz i just want to see wheather this api works
    // const transactionHash = localStorage.getItem("transactionHash")
    console.log(`transactionHash obtained is `,transactionHash)
    /*const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS,abi,provider)
    console.log(`contract is `,contract.functions)
    const block = await contract.getSize();
    console.log(`block is `,block) 
    console.log(`block no is `,blockNo)
    const signer = provider.getSigner()
    const newContract = new ethers.Contract(process.env.CONTRACT_ADDRESS,abi,signer)
    const addBlockResponse = await newContract.makeBlock(functionality,operatingSystem,language,domain,component,date,fileHash,
      transactionHash)*/
      let web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"))
      let contract = new web3.eth.Contract(abi,process.env.CONTRACT_ADDRESS)
      // let contract = new web3.eth.Contract(abi,process.env.CONTRACT_ADDRESS)
      console.log(`contract is `,contract)
      const addBlockDetails = await contract.methods.makeBlock(functionality,operatingSystem,language,domain,component,date,fileHash,transactionHash)
      const addBlockResponse =  await contract.methods.getSize()
      
      const blockNo = await addBlockResponse.call();
    console.log(`addBlockDetails is `,addBlockDetails)
   console.log(`addBlockResponse : `,addBlockResponse)
   console.log(`block No is `,blockNo)
    const res = await fetch("/addBlockDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blockNo,
        description
      })
    })
    if(res.status === 200){
      console.log(`the description,blockNo are successfully added to database`)
    }
    else{
      console.log(`not able to add block description,no in the database`)
    }

  };
  

  return (
    <>
    <Box style={{display:'flex',flexDirection:'row'}}>
    <Container maxWidth="xs" style={{marginTop:'4',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh'}}>
    <Typography variant="h4" component="h2" style={{marginBottom:"10px"}}>Block Details</Typography>
    <Typography>Component Of The Block To Be Made : {component}</Typography>
    <Typography>Description Of The Block To Be Made : {description}</Typography>
    <Typography>OperatingSystem Of The Block To Be Made : {operatingSystem}</Typography>
    <Typography>Domain Of The Block To Be Made : {domain}</Typography>
    <Typography>Language Of The Block To Be Made : {language}</Typography>
    <Typography>Date Of The Block To Be Made : {date}</Typography>
    <Typography>functionality Of The Block To Be Made : {functionality}</Typography>
    <Typography>Your uploaded file can be found in  : https://ipfs.io/ipfs/{fileHash}</Typography>
    </Container>
    <Container maxWidth="xs" style={{marginTop:'4',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh'}}>
    <Typography variant="h4" component="h2" style={{marginBottom:"10px"}}>Make Payment</Typography>
    <Typography>To make a block and contribute to the opensource you need to make a transaction in ethers to make yourself a block </Typography>
    <Typography>1. You need to have an metamask wallet in your browser with sufficint amount of ethers</Typography>
    <Typography>2. Use Test Ethers as it is just a testing website(dont't use mainnet wallet)</Typography>
    <Typography>3. A Payment of {process.env.BLOCK_COST} + gas price is required to make a block</Typography>
    <Typography>4. !!Gas prices may change time to time so we are'nt responsible</Typography>
    <Button variant="contained"
          fullWidth
          onClick={handleSubmit}
          style={{marginTop:"15px",marginBottom:"3px"}}>Make Payment</Button>
    </Container>
    </Box>
    
    </>
  )
}

