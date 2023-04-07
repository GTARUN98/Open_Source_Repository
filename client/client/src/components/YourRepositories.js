import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useHistory } from "react-router-dom";
import NavBar from "./NavBar";

const web3 = new Web3("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");
// ABI of your smart contract
// const abi = [...];
const contractAddress = "<YOUR_BLOCKCHAIN_SMART_CONTRACT_ADDRESS>";

const YourRepositories = () => {
  const [blocks, setBlocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter the blocks based on the search term
  const filteredBlocks = blocks.filter((block) =>
    block.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render the card views for the filtered blocks
  const cardViews = filteredBlocks.map((block) => (
    <div key={block.number} className="card">
      <div className="card-body">
        <h5 className="card-title">{getName(block.transactions[0].input)}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          {new Date(block.timestamp * 1000).toString()}
        </h6>
        <button
          className="btn btn-primary"
          onClick={() => handleWatchClick(block.transactions[0].input)}
        >
          Watch
        </button>
      </div>
    </div>
  ));
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const getBlocks = async () => {
      const latestBlockNumber = await web3.eth.getBlockNumber();
      const blockDetails = [];

      for (let i = latestBlockNumber; i >= 1; i--) {
        const block = await web3.eth.getBlock(i, true);
        blockDetails.push(block);
      }

      setBlocks(blockDetails);
    };

    getBlocks();
  }, []);

  const handleWatchClick = async (transactionInput) => {
    console.log(`transactionInput ${transactionInput}`);
    const history = useHistory();
    history.push({
      pathname: "/BlockDetails",
      state: { input: transactionInput },
    });
  };
  const getName = async (transactionInput) => {
    console.log(`transactionInput ${transactionInput}`);
    // Address of the block-making contract
    const contractInstance = new web3.eth.Contract(abi, contractAddress);
    // Decode the input data
    const decodedData = contractInstance.methods
      .makeBlock()
      .decodeInput(transactionInput);
    console.log(`decoded data ${decodedData}`);
    return decodedData["Name"];
  };

  return (
    <div>
      <NavBar />

      <div>
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={handleSearch}
        />
        searchTerm && {cardViews}
      </div>

      {blocks.map((block) => (
        <div key={block.number} className="card">
          <div className="card-body">
            <h5 className="card-title">
              {getName(block.transactions[0].input)}
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">
              {new Date(block.timestamp * 1000).toString()}
            </h6>
            <button
              className="btn btn-primary"
              onClick={() => handleWatchClick(block.transactions[0].input)}
            >
              Watch
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YourRepositories;