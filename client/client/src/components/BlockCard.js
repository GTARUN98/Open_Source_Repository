import React,{useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import { Card, CardContent, Typography,Button } from '@material-ui/core';
import abiFile from '../contracts_abi/Blockchain.json'//this Blockchain.json should be updated if you have deployed the smart contract and made changes in it
import web3 from "web3"
const abi = abiFile.abi
function BlockCard() {
  // State variable to hold the block details
  const [blocks, setBlocks] = useState([]);
  const navigate = useNavigate()
  const contractAddress = process.env.CONTRACT_ADDRESS

  async function fetchBlockDetails() {
    // Instantiate the contract using web3 provider and ABI definition
  const contract = new web3.eth.Contract(abi, contractAddress);
  // Get the block count first to determine the loop range
  const blockCount = await contract.methods.getSize().call();
  const blockDetails = [];
  // Loop through each block and get its details
  for (let i = 0; i < blockCount; i++) {
    const block = await contract.methods.getDetails(i).call();
    // Add the block details to the array
    blockDetails.push(block);
  }
  // Update the state variable with the processed block details
  setBlocks(blockDetails);
  }

  useEffect(() => {
    fetchBlockDetails();
  }, []);

  return (
    <div>
      {blocks.map((block, index) => (
        <Card key={index}>
          <CardContent>
            <Typography>Component : {block.component}</Typography>
            <Typography>Created in : {block.date}</Typography>
            <Button onClick={(e)=>{
                e.preventDefault()
                console.log(`index is ${index}`)
                localStorage.setItem("index",index)
                navigate('/blockDetails')
            }}>See Details</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
export default BlockCard

