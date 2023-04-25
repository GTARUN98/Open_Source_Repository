import React, { useState, useEffect } from 'react';
import BlockCard from './BlockCard';
import { abi } from '../contracts_abi/Blockchain.json';
import { ethers } from 'ethers';
import NavBar from "./NavBar";
import { Container,Box,Typography,TextField,TextareaAutosize,Button,Grid } from "@mui/material";
require("dotenv").config({path: "D:/Tarun/Mern stack/Mini/client/client/.env"});

export default function AllRepositories() {
  const [searchBarValues, setSearchBarValues] = useState({
    functionality: '',
    os: '',
    language: '',
    domain: '',
    component: '',
  });

  const [repositories, setRepositories] = useState([]);
  const [filteredRepositories, setFilteredRepositories] = useState([]);
  const [filteredRepos,setFilterRepos] = useState([])
  async function fetchData() {
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS,
      abi,
      provider
    );

    let blockCount = await contract.getSize();
    blockCount = blockCount.toString();
    console.log("the size is ",blockCount)
    const blockDetailsArray = [];

    for (let i = 0; i < blockCount; i++) {
      const details = await contract.getDetails(i);
      console.log(`details are`,details)
      const res = details;
      const blockDetails = {
        id: i,
        functionality: res[0],
        domain: res[3],
        os: res[1],
        language: res[2],
        date: res[5],
        component: res[4]
      };
      blockDetailsArray.push(blockDetails);
    }

    setRepositories(blockDetailsArray);
    console.log(`setRepsoitories is `,repositories)
    setFilteredRepositories(blockDetailsArray);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchBarChange = (event) => {
    setSearchBarValues({
      ...searchBarValues,
      [event.target.name]: event.target.value,
    });
  };

  const calculatePercentageMatching = (repository) => {
    const functionalityValue = searchBarValues.functionality.toLowerCase();
    const osValue = searchBarValues.os.toLowerCase();
    const languageValue = searchBarValues.language.toLowerCase();
    const domainValue = searchBarValues.domain.toLowerCase();
    const componentValue = searchBarValues.component.toLowerCase();

    const functionalityMatch = repository.functionality.toLowerCase().includes(functionalityValue);
    const osMatch = repository.os.toLowerCase().includes(osValue);
    const languageMatch = repository.language.toLowerCase().includes(languageValue);
    const domainMatch = repository.domain.toLowerCase().includes(domainValue);
    const componentMatch = repository.component.toLowerCase().includes(componentValue);

    const totalMatches = functionalityMatch + osMatch + languageMatch + domainMatch + componentMatch;
    const possibleMatches = 5;
    const percentageMatching = (totalMatches / possibleMatches) * 100;

    return percentageMatching;
  };
  async function filteredRepositoriesPercentage(filteredRepos) {
    const filteredReposi = [];
  
    filteredRepos.forEach((repo) => {
      let matchingFields = 0;
      let totalFields = 0;
  
      if (repo.functionality.toLowerCase().includes(searchBarValues.functionality.toLowerCase())) {
        matchingFields++;
      }
      totalFields++;
  
      if (repo.os.toLowerCase().includes(searchBarValues.os.toLowerCase())) {
        matchingFields++;
      }
      totalFields++;
  
      if (repo.language.toLowerCase().includes(searchBarValues.language.toLowerCase())) {
        matchingFields++;
      }
      totalFields++;
  
      if (repo.domain.toLowerCase().includes(searchBarValues.domain.toLowerCase())) {
        matchingFields++;
      }
      totalFields++;
  
      if (repo.component.toLowerCase().includes(searchBarValues.component.toLowerCase())) {
        matchingFields++;
      }
      totalFields++;
  
      const matchingPercentage = Math.round((matchingFields / totalFields) * 100);
      console.log(`matching percentage is `,matchingPercentage)
        filteredReposi.push({ ...repo, matchingPercentage });
      
    });
  
    console.log(`from function filteredRepositoriesPercentage() filteresReposi is `, filteredReposi);
  
    return filteredReposi;
  }

  const filterRepositoriesi = async () => {
    console.log(`filtered repositories is called`);
    const filteredRepositoriesi = repositories
      .map((repository) => ({
        ...repository,
        percentageMatching: calculatePercentageMatching(repository),
      }))
      .filter((repository) => repository.percentageMatching > 0)
      .sort((a, b) => b.percentageMatching - a.percentageMatching);
    setFilteredRepositories(filteredRepositoriesi);
    console.log(`filteredRepositories  are `, filteredRepositories);
  
    const filteredReposiGet = await filteredRepositoriesPercentage(filteredRepositories);
    console.log("filteredReposiGet is ",filteredReposiGet)
    setFilterRepos(filteredReposiGet);
  
    console.log(`filtered repositories after updating percentage is `, filteredRepos);
  };

  const handleFilterButtonClick = () => {
    filterRepositoriesi();
  };

  return (
    <>
     <NavBar/>
    <Container maxWidth="sm" style={{ marginTop: '4', alignItems: 'center' }}>
      <Grid container spacing={2} style={{ marginBottom: '16px' }}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="functionality"
            label="Functionality"
            value={searchBarValues.functionality}
            onChange={handleSearchBarChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="os"
            label="OS"
            value={searchBarValues.os}
            onChange={handleSearchBarChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="language"
            label="Language"
            value={searchBarValues.language}
            onChange={handleSearchBarChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="domain"
            label="Domain"
            value={searchBarValues.domain}
            onChange={handleSearchBarChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="component"
            label="Component"
            value={searchBarValues.component}
            onChange={handleSearchBarChange}
            fullWidth
          />
        </Grid>
      </Grid>
      <Button variant="contained" onClick={handleFilterButtonClick} color="primary">
        Filter
      </Button>
    </Container>
    
    {filteredRepos.length > 0 ? (
  filteredRepos.map((repo) => (
    <BlockCard key={repo.id} repo={repo} matchingPercentage={repo.matchingPercentage} />
  ))
) : (
  repositories.map((repo) => (
    <BlockCard key={repo.id} repo={repo} matchingPercentage={0} />
  ))
)}
    
    </>
  );
}