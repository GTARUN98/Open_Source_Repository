import { useState } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import { Box,Grid,Container,Typography,TextField,Button ,Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import { useNavigate } from "react-router-dom";
const {abi} = require("../contracts_abi/Blockchain.json")
require("dotenv").config({path: "D:/Tarun/Mern stack/Mini/client/client/.env"});

const startPayment = async ({ setError, setTxs, ether, addr }) => {
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");
    console.log("start payment is called")
    console.log(`ether is `,ether);
    console.log(`addr is `,addr);
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


// async function stringToBytes32(str) {
//   const hash = await ethers.utils.keccak256(str);
//   const bytes32 = await ethers.utils.arrayify(hash);
//   return bytes32;
// }
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
  const fileHash = localStorage.getItem("fileHash")
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError();
    console.log(`fileHash`,fileHash)
    console.log(`reciever address is `,process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS_INTERACT)
    console.log(`blockCost is `,process.env.REACT_APP_BLOCK_COST)
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum)
      console.log(provider)
      // const provider = new ethers.providers.AlchemyProvider("ZDD-ekxQior2CBbHU9Oyym1yKDE85aSc")
      console.log(`abi is ${abi}`)
      const contract = new ethers.Contract(process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS_INTERACT,abi,provider)
      console.log(`contract is `,contract)
      let blockNo = await contract.getSize();
      blockNo = blockNo.toString()
      
      
      console.log(`file hash  is`,fileHash);
      console.log("block no is",blockNo)
    const trans = await startPayment({
      setError,
      setTxs,
      ether: process.env.REACT_APP_BLOCK_COST, 
      addr: process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS_PAYMENT//reciever i.e the contract adderess
    });
    console.log(`tx.hash is `,trans)
    // const transactionHash = txs[0]//this wil be afterwards removed coz i just want to see wheather this api works
    // let transactionHash = await stringToBytes32(trans)//this wil be afterwards removed coz i just want to see wheather this api works
    // const transactionHash = "0xf360c5dfcbe7f2b6b424755c0a8703696c41c5baa59fed3e5fe7bb303942a0a6"//this wil be afterwards removed coz i just want to see wheather this api works
    const transactionHash = trans//this wil be afterwards removed coz i just want to see wheather this api works
    console.log('transaction hash  is ',transactionHash)
    // const transactionHash = localStorage.getItem("transactionHash")
    /*await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum)
      console.log(provider)
      // const provider = new ethers.providers.AlchemyProvider("ZDD-ekxQior2CBbHU9Oyym1yKDE85aSc")
      console.log(`abi is ${abi}`)
      const contract = new ethers.Contract(process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS,abi,provider)
      console.log(`contract is `,contract)
      let blockNo = await contract.getSize();
      blockNo = blockNo.toString()
      
      
      console.log(`file hash  is`,fileHash);
      console.log("block no is",blockNo)*/
     
      const signer = provider.getSigner()
      console.log(`signer is `,signer)
      // console.log(functionality,operatingSystem,language,domain,component,date,fileHash,transactionHash)

      const myContract = new ethers.Contract(process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS_INTERACT,abi,signer);
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
      navigate("/allRepositories")
    }
    else{
      console.log(`not able to add block description,no in the database`)
    }

  };
  

  return (
    <>
    <Grid container spacing={3}>
    <Grid item xs={12} sm={6} container justify="center" alignItems="center">
  <Container maxWidth="m" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', height: "170vh", width: "100vw" }}>
    <Typography variant="h4" component="h2" style={{ marginBottom: "5px" }}>Code Details</Typography>
    <TableContainer style={{ width: "100%", height: "auto" }}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell style={{ width: "50%" }}><Typography variant="subtitle1">Component Of The code going to be added</Typography></TableCell>
            <TableCell style={{ width: "50%" }}><Typography variant="subtitle1">{component}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ width: "50%" }}><Typography variant="subtitle1">Description Of The code going to be added</Typography></TableCell>
            <TableCell style={{ width: "50%" }}><Typography variant="subtitle1">{description}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ width: "50%" }}><Typography variant="subtitle1">Operating System Of The code going to be added</Typography></TableCell>
            <TableCell style={{ width: "50%" }}><Typography variant="subtitle1">{operatingSystem}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ width: "50%" }}><Typography variant="subtitle1">Domain Of The code going to be added</Typography></TableCell>
            <TableCell style={{ width: "50%" }}><Typography variant="subtitle1">{domain}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ width: "50%" }}><Typography variant="subtitle1">Language Of The code going to be added</Typography></TableCell>
            <TableCell style={{ width: "50%" }}><Typography variant="subtitle1">{language}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ width: "50%" }}><Typography variant="subtitle1">Date Of The code going to be added</Typography></TableCell>
            <TableCell style={{ width: "50%" }}><Typography variant="subtitle1">{date}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ width: "50%" }}><Typography variant="subtitle1">Functionality Of The code going to be added</Typography></TableCell>
            <TableCell style={{ width: "50%" }}><Typography variant="subtitle1">{functionality}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ width: "50%" }}><Typography variant="subtitle1">File Hash</Typography></TableCell>
            <TableCell style={{ width: "50%" }}>
              <Typography variant="subtitle1">
                Your uploaded file can be found in :
                <a href={`https://ipfs.io/ipfs/${fileHash}`} style={{ textDecoration: 'none', color: 'blue', paddingLeft: '5px' }}>
                  https://ipfs.io/ipfs/{fileHash}
                </a>
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Container>
</Grid>
      <Grid item xs={12} sm={6}>
        <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px' }}>
          <Typography variant="h4" component="h2" style={{ marginBottom: "10px" }}>Make Payment</Typography>
          <Typography>
          To contribute to the open-source project, you need to make a transaction in Ether to make yourself a contributor. </Typography>
          <TableContainer style={{ marginTop: '20px' }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography>1. You need to have an metamask wallet in your browser with sufficient amount of ethers</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>2. Use Sepolia Test Ethers as it is just a testing website (don't use mainnet wallet)</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>3. A Payment of {process.env.REACT_APP_BLOCK_COST} + gas price is required to add this code in the memory of the smart contract</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>4. Gas prices may change time to time so we aren't responsible</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" fullWidth onClick={handleSubmit} style={{ marginTop: "15px", marginBottom: "3px" }}>Make Payment</Button>
        </Container>
      </Grid>
    </Grid>
  </>
  )
}

