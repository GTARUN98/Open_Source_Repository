import { useState } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import { Box,Grid,Container,Typography,TextField,Button } from "@mui/material";
const {abi} = require("../contracts_abi/Blockchain.json")
require("dotenv").config({path: "D:/Tarun/Mern stack/Mini/client/client/.env"});
let Web3 = require("web3")
const startPayment = async ({ setError, setTxs, ether, addr }) => {
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");
    console.log("start payment is called")
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    ethers.utils.getAddress(addr);
    const tx = await signer.sendTransaction({
      to: addr,
      value: ethers.utils.parseEther(ether)
    });
    // const tx = {hash: '0x31c6924d7ee0c6b813a25a6e45cd9b336326853233b097bbeab4241b6224b785', type: 2, accessList: null, blockHash: null, blockNumber: null}
    console.log({ ether, addr });
    console.log("tx", tx.hash);
    await setTxs(tx.hash);
    return tx.hash
  } catch (err) {
    setError(err.message);
  }
};


async function stringToBytes32(str) {
  const hash = await ethers.utils.keccak256(str);
  const bytes32 = await ethers.utils.arrayify(hash);
  return bytes32;
}
export default function Transaction() {
  const [error, setError] = useState();
  const [txs, setTxs] = useState();
  const component = localStorage.getItem("component")
  const domain = localStorage.getItem("domain")
  const language = localStorage.getItem("language")
  const functionality = localStorage.getItem("functionality")
  const description = localStorage.getItem("description")
  const date = localStorage.getItem("date")
  const operatingSystem = localStorage.getItem("operatingSystem")
  let fileHash = localStorage.getItem("fileHash")
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError();
    fileHash =  await stringToBytes32( Buffer.from(fileHash, 'utf8'))
    console.log(`fileHash`,fileHash)
    
    const trans = await startPayment({
      setError,
      setTxs,
      ether: "0.00000005", 
      addr: process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS//reciever i.e the contract adderess
    });
    console.log(`tx.hash is `,trans)
    // const transactionHash = txs[0]//this wil be afterwards removed coz i just want to see wheather this api works
    let transactionHash = await stringToBytes32(trans)//this wil be afterwards removed coz i just want to see wheather this api works
    console.log('transaction hash in bytes32 is ',transactionHash)
    // const transactionHash = localStorage.getItem("transactionHash")
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum)
      console.log(provider)
      // const provider = new ethers.providers.AlchemyProvider("ZDD-ekxQior2CBbHU9Oyym1yKDE85aSc")
      console.log(`abi is ${abi}`)
      const contract = new ethers.Contract(process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS,abi,provider)
      console.log(`contract is `,contract)
      let blockNo = await contract.getSize();
      blockNo = blockNo.toString()
      
      
      console.log(`file hash is bytes is`,fileHash);
      console.log("block no is",blockNo)
     
      const signer = provider.getSigner()
      console.log(`signer is `,signer)
      // console.log(functionality,operatingSystem,language,domain,component,date,fileHash,transactionHash)

      const myContract = new ethers.Contract(process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS,abi,signer);
      console.log(`myContract is`,myContract)
      const tx = await myContract.makeBlock(functionality,operatingSystem,language,domain,component,date,fileHash,transactionHash);
  
      console.log(`tx is ${tx}`)
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
    <Typography>3. A Payment of {process.env.REACT_APP_BLOCK_COST} + gas price is required to make a block</Typography>
    <Typography>4. !!Gas prices may change time to time so we are'nt responsible</Typography>
    <Button variant="contained"
          fullWidth
          onClick={handleSubmit}
          style={{marginTop:"15px",marginBottom:"3px"}}>Make Payment</Button>
     {/*<ErrorMessage message={error} />
      <TxList txs={txs} />*/}
    </Container>
    </Box>
    
    </>
  )
}

