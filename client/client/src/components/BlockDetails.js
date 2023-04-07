import React,{useState,useEffect} from 'react';
import NavBar from "./NavBar";
function BlockDetails(index) {
  const [functionality,setFunctionality] = useState("")
  const [os,setOs] = useState("")
  const [language,setLanguage] = useState("")
  const [domain,setDomain] = useState("")
  const [date,setDate] = useState("")
  const [component,setComponent] = useState("")
  const [description,setDescription] = useState("")
  const [fileHash,setFileHash] = useState("")
  const [transactionHash,setTransactionHash] = useState("")
  async function getDetails(){
    const index = parseInt(localStorage.getItem("index"))
    console.log(`index is  ${index}`)
    
    const res = await fetch("/getBlockDetails", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        index
      })
  })
  console.log(`res : `,res)
  setFunctionality(res.functionality)
  setDomain(res.domain)
  setOs(res.operatingSystem)
  setLanguage(res.language)
  setDate(res.date)
  setComponent(res.component)
  setDescription(res.description)
  setFileHash(res.fileHash)
  setTransactionHash(res.transactionHash)

}
  useEffect(() => {
    getDetails();
  }, []);
  return (
    <div>
      <NavBar/>
    {fileHash ?
    <div>
    <h1>{component}</h1>
    <div>
          <p>Domain : {domain}</p>
          <p>Description : {description}</p>
          <p>Created On : {date}</p>
          <p>Functionality : {functionality}</p>
          <p>Operating System : {os}</p>
          <p>Language : {language}</p>
          <p>fileHash: {fileHash}</p>
          <p>transactionHash: {transactionHash}</p>
          
        </div></div>
    :
      <p>Loading...</p>
    
    }
    </div>
  );
}

export default BlockDetails
