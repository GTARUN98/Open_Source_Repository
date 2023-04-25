// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/SHA256.sol";

contract Blockchain {
    // using SHA256 for bytes;

    struct Block {
        string functionality;
        string os;
        string language;
        string domain;
        string component;
        string date;
        string fileHash;
        string transactionHash;
        bytes32 prevHash;
        bytes32 blockHash;
    }

    Block[] private blockchain;
    uint256 private blockNo = 0;

    function makeBlock(string memory _functionality, string memory _os, string memory _language, string memory _domain, string memory _component,string memory date, string memory _fileHash,string memory _transactionHash) public {
        bytes32 _prevHash = blockNo > 0 ? blockchain[blockNo - 1].blockHash : bytes32(0);
        bytes32 blockHash = makeHash(_functionality,_os,_language,_domain,_component,date,_fileHash,_transactionHash,_prevHash);
        makeChain(_functionality,_os,_language,_domain,_component,_fileHash,_transactionHash,_prevHash, blockHash,date);
        
        
    }

    function makeChain(string memory _functionality, string memory _os, string memory _language, string memory _domain, string memory _component, string memory _fileHash,string memory _transactionHash, bytes32 prevHash, bytes32 blockHash,string memory date) private {
        Block memory newBlock = Block(_functionality,_os,_language,_domain,_component,date,_fileHash,_transactionHash, prevHash,blockHash);
        blockchain.push(newBlock);
        blockNo++;
    }

    function makeHash(string memory _functionality, string memory _os, string memory _language, string memory _domain, string memory _component,string memory date, string memory  _fileHash,string memory _transactionHash, bytes32 prevHash) private pure returns (bytes32) {
        return sha256(abi.encodePacked(_functionality,_os,_language,_domain,_component,date,_fileHash,_transactionHash, prevHash));
    }

    function getSize() public view returns (uint256) {
        return blockchain.length;
    }

    function getDetails(uint256 blockNumber) public view returns (string memory,string memory,string memory,string memory,string memory ,string memory, string memory,string memory) {
        require(blockNumber < blockchain.length, "Block number is out of range");
        Block memory blockData = blockchain[blockNumber];
        return (blockData.functionality,blockData.os,blockData.language,blockData.domain,blockData.component,blockData.date,blockData.fileHash,blockData.transactionHash);
    }
}