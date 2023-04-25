const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Register = require("./model/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
const extractZip = require('extract-zip');
const nodemailer = require("nodemailer"); //for sending emails
const { existsSync } = require("fs"); //importing filesystems
const fs = require("fs");
// const  { ethers } =   require("ethers");
// const ipfsClient = require('ipfs-http-client');
// import * as IPFS from "ipfs-core";
const { create } = require("ipfs-http-client");

const { abi } = require("../SmartContract/build/contracts/Block.json");

const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
let contract = new web3.eth.Contract(abi, process.env.SEPOLIA_CONTRACT_ADDRESS);

// create an IPFS client instance

require("dotenv").config(); //required for importing and using the keys in .env

// Load the compiled bytecode and ABI for your smart contract
// const bytecode = fs
//   .readFileSync(path.join(__dirname, "MyContract.bytecode"))
//   .toString();
// const abi = JSON.parse(
//   fs.readFileSync(path.join(__dirname, "MyContract.abi")).toString()
// );

// Create a new instance of your smart contract
// const myContract = new web3.eth.Contract(
//   abi,
//   "<YOUR_BLOCKCHAIN_SMART_CONTRACT_ADDRESS>"
// );

// const fs = require('fs');
const path = require("path");
const { diskStorage } = require("multer");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const mongoUrl = process.env.MONGO_DB_URL;
//console.log(`rthe mongo db url is ${mongoUrl}`)
mongoose.connect(mongoUrl);
const db = mongoose.connection;

db.on("error", () => {
  console.log("error in connection with database");
});
db.once("open", () => {
  console.log("Connected to database");
});

app
  .get("/", (req, res) => {
    // res.send("Hello from server")
    res.set({
      "Allow-access-Allow-Origin": "*",
      // "Access-control-allow-origin" : "*"
    });
  })
  .listen(3000);

// app.post("/register",(req,res)=>{
app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, cpassword } =
    req.body;
  console.log(`${firstName}`);
  if (!firstName || !lastName || !email || !password || !cpassword) {
    res.status(422).send("Please fill all the fields");
    console.log("Please fill all the fields");
  }
  if (password !== cpassword) {
    res.status(422).send("Please make sure both passwords are same");
    console.log("Please make sure both passwords are same");
  } else {
    const userExist = await Register.findOne({ email: email });
    if (userExist) {
      console.log("User already exists");
      return res.status(422).json("email already exists");
    }
    const registerUser = new Register({
      firstName,
      lastName,
      email,
      password,
      cpassword,
    });

    //here before saving hashing of the password is going to take place see in userShema using bcrypt

    const registered = await registerUser.save();
    console.log(registered);
    if (registered) {
      console.log(
        "added the data into mongo db successfully and given status 200"
      );
      return res.status(200).json("sent requets 200");
    } else {
      console.log("unable to add data to mongodb");
    }
  }
});
app.get("/logout", async (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  console.log("cookie is cleared successfully");
  res.status(200).json("logged out");
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("please fill all the details");
      return res.status(422).json("please fill all the details");
    }
    const isUserExist = await Register.findOne({ email: email }); //Register is the name of the collections findOne is a mongoose method
    if (isUserExist) {
      const isMatching = await bcrypt.compare(password, isUserExist.password);
      if (isMatching) {
        //console.log("user sign in successfully")

        const token = await isUserExist.generateAuthToken(); //we are now generating auth token that is in userSchema
        //console.log("token",token)
        res
          .cookie("jwtoken", token, {
            maxAge: 2592000000, //token is active for 2592000000 millisec ie 30 days after that he will be logged out expires is not working please take a note
            httpOnly: true,
          })
          .status(200)
          .end();
        // res.status(200).json("user sign in successfully")
      } else {
        console.log(
          "user email is present but password is not matching ",
          isMatching
        );
        res.status(422).json("user cannot sign in");
      }
    } else {
      console.log("user cannot sign in email not there");
      res.status(422).json("user cannot sign in");
    }
    //console.log("user exist",isUserExist)//gives data in json format of the collectin with given email id
  } catch (error) {
    console.log(error);
  }
});

function generateOTP() {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
app.post("/changePassword", async (req, res) => {
  try {
    let password = req.body.password;
    const cPassword = req.body.confirmPassword;
    const email = req.body.email;
    console.log(`email is `,email)
    if (password != cPassword) {
      console.log(`Both passwords aren't same please try again`);
    } else {
      // Remove the pre-save middleware for password field before updating
      password = await bcrypt.hash(password, 12);
      const changedSuccessfully =   await Register.findOneAndUpdate(
        { email },
        { password: password, cpassword: cPassword },
        { runValidators: true, context: 'query', new: true }
      );
      console.log(`password is ${password}, cPasswrod is ${cPassword}`);
      console.log(`changedSuccessfully is `,changedSuccessfully)
      if (changedSuccessfully) {
        console.log(`password changed successfully`);
        res.status(200).json(`password changed successfully`);
      } else {
        res
          .status(422)
          .json(`unable to change password ${changedSuccessfully}`);
      }
    }
  } catch (error) {
    console.log(`error while changing password ${error}`);
    res.status(422).json(error);
  }
});

app.post("/checkOtp", async (req, res) => {
  try {
    const email = req.body.email;
    const isUserThere = await Register.findOne({ email: email });
    if (isUserThere.OTP != "" && req.otp != "" && isUserThere.OTP === req.otp){
      res.status(200).json(`otp is checked and success`);
      
  }
    else {
      isUserThere.OTP = "";
      res.status(422).json(`otp is wrong`);
    }
  } catch (error) {
    console.log(`error in checking otp ${error}`);
    res.status(422).json(`error in checking otp ${error}`);
  }
});
app.post("/forgotPassword", async (req, res) => {
  try {
    const OTP = generateOTP();
    const body_email = req.body.email;
    const isUserThere = await Register.findOne({ email: body_email });
    if (isUserThere) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.REACT_APP_USEREMAIL,
          pass: process.env.REACT_APP_NODEMAILER_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      const mailOptions = {
        from: process.env.REACT_APP_USEREMAIL,
        to: body_email,
        subject: "Forgot Password",
        text: `Your OTP is ${OTP}.Please don't share this to anyone.Its valid only for 5 minutes`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.status(422).json(`error in sending the mail`);
          console.log(error);
        } else {
          console.log("Email is sent", info.response);
          const user = Register.findOne({ email: body_email });
          user.OTP = OTP;
        }
      });
      // Clear OTP field after 5 minutes
      setTimeout(async () => {
        await Register.updateOne({ email: email }, { OTP: "" });
      }, 300000);
      res.status(200).json("password sent to email succcessfully");
    }
  } catch (error) {
    console.log(`user  not found ${error}`);
    res.status(422).json(`user  not found ${error}`);
  }
});

// const gitGuardianUrl = "https://api.gitguardian.com/v1/integrations/github";
// const gitGuardianApiKey = process.env.GIT_GUARDIAN_API_KEY;

// const owaspUrl = "https://your-owasp-dependency-check-api-url.com";
// const owaspApiKey = "YOUR_OWASP_API_KEY";

// const sonarCloudUrl = "https://your-sonarcloud-api-url.com";
// const sonarCloudToken = process.env.SONAR_CLOUD_TOKEN;
function getDate() {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  return today;
}
app.post("/authenticate", async (req, res) => {
  try {
    const {
      functionality,
      operatingSystem,
      component,
      domain,
      language,
      description,
      fileName,
    } = req.body;
    console.log(`authenticate is called`);
    // console.log(`functionality ${functionality}`)
    console.log(fileName, functionality, domain, language);
    console.log(`fileName is ${fileName}`);
    const pathName = `./uploads/${req.cookies.jwtoken}/${fileName}`;
    const fileHash = await saveAndReturnFile(pathName);
    console.log(`file hash is `, fileHash);
    const date = getDate();
    if (!existsSync(`./uploads/${req.cookies.jwtoken}/${fileName}`)) {
      res.status(500).json(`sorry,looks like you haven't uploaded the file`);
    }
    const data = {
      functionality: functionality,
      operatingSystem: operatingSystem,
      language: language,
      domain: domain,
      component: component,
      date: date,
      fileHash: fileHash,
      description: description,
    };
    console.log(`data is `, data);
    res.status(200).json(data);
  } catch (error) {
    res.status(422).json(`error in making the block ${error}`);
  }
});
let fileDetail;
app.use(express.urlencoded({ entended: "false" }));
// const upload = multer({dest:"uploads/"})//here the uploaded file stored in corrupted format so we use diskstorage
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    if (!existsSync(`./uploads/${req.cookies.jwtoken}`)) {
      const res = await fs.promises.mkdir(`./uploads/${req.cookies.jwtoken}`, {
        recursive: true,
      });
      console.log(`response while creating folder ${res}`);
    }
    return cb(null, `./uploads/${req.cookies.jwtoken}`);
  },
  filename: function (req, file, cb) {
    console.log(file);
    fileDetail = file;
    return cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage });
app.post("/upload", upload.single("profileImage"), async (req, res) => {
  //profileImage is name of input
  console.log(`filedetails id ${fileDetail}`);

  const pathName = `./uploads/${req.cookies.jwtoken}/${fileDetail.originalname}`;
  console.log(`pathname is ${pathName}`);
  res.status(200).json("successfuffly uploaded the file");
});
async function ipfsClient() {
  const auth =
    "Basic " +
    Buffer.from(
      process.env.INFURA_PROJECT_ID_IPFS +
        ":" +
        process.env.INFURA_PROJECT_SECRET_KEY_IPFS
    ).toString("base64");
  console.log(auth);
  try {
    const ipfs = await create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth, // infura auth credentails
      },
    });
    return ipfs;
  } catch (error) {
    console.log(`eror while ipfs clent ${error}`);
  }
}

async function saveAndReturnFile(path) {
  let ipfs = await ipfsClient();
  console.log(`saveandreturn is called`);
  console.log(`path is ${path}`);
  let data = fs.readFileSync(path);
  let options = {
    warpWithDirectory: false,
    progress: (prog) => console.log(`Saved :${prog}`),
  };
  let result = await ipfs.add(data, options);
  console.log(`result is ${result}`);
  return result.path;
}

app.post("/authenticateAndSave", async (req, res) => {
  try {
    // Extract the fields from the request bodys
    const { component, domain, operatingSystem, language, functionality, description } = req.body;
    // Extract the folder data from the request
    console.log(req.body)
    const folder = req.body.folder;
    console.log(`folder is `,folder)
    // Save the folder in the uploads directory
    const dir = `./uploads/${req.cookies.jwtoken}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const folderPath = `${dir}/${folder[0].originalname}`;
    await extractZip(folder[0].buffer, { dir: folderPath });

    // Get the IPFS hash of the folder
    const folderHash = await saveFolderAndReturnHash(folderPath);

    // Return the IPFS hash and other data in the response
    const response = {
      folderHash,
      component,
      domain,
      operatingSystem,
      language,
      functionality,
      description,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});
app.post("/getBlockDetails", async (req, res) => {
  try {
    const token = req.cookies.jwtoken;
    console.log(`token`, token);
    const verifyUser = jwt.verify(token, process.env.REACT_APP_SECRET_KEY);
    const user = await Register.findOne({ _id: verifyUser._id });
    console.log("user", user);

    const { index } = req.body;
    console.log(`index`, index);

    // Search for the index in the blockNo array
    const blockIndex = user.blockNo.findIndex((block) => block.blockNo === parseInt(index));
    console.log(`blockIndex`, blockIndex);

    if (blockIndex === -1) {
      // If index is not found, return an error
      return res.status(404).json({ error: "Block not found" });
    }

    // Get the corresponding block description
    const blockDescription = user.blockDescription[blockIndex].blockDescription;
    console.log(`blockDescription`, blockDescription);

    // Return the block description
    return res.status(200).json(blockDescription);
  } catch (error) {
    console.log(`error in getting getBlockDetails from server`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/getUserBlockArray",async(req,res)=>{
  try{
    const token = req.cookies.jwtoken;
    console.log(`token`,token)
    const verifyUser = jwt.verify(token, process.env.REACT_APP_SECRET_KEY);
    const user = await Register.findOne({ _id: verifyUser._id });
    console.log("user",user)
    const blockNoArray = user.blockNo;
    console.log(`blockNoArray is `,blockNoArray)
    res.status(200).json(blockNoArray);

  }catch(error){
    console.log(`error is getting the blockarray of the user`)
    res.status(422).json(`error is getting the blockarry of the user`)
  }
})










app.post("/addBlockDetails", async (req, res) => {
  try {
    const {
      blockNo,
      description
    } = req.body;
    console.log("The obtained block details are block no, description",blockNo,description)
    console.log(`the contract address is`,process.env.SEPOLIA_CONTRACT_ADDRESS )
    // console.log(`block count is obtained as `, blockNo);
    const blockDescription = description;
    const token = req.cookies.jwtoken;
    console.log(`token`,token)
    const verifyUser = jwt.verify(token, process.env.REACT_APP_SECRET_KEY);
    const user = await Register.findOne({ _id: verifyUser._id });
    console.log("user",user)
    const blockNoObj = { blockNo: blockNo }
    user.blockNo.push( blockNoObj );
    await user.save();
    const blockDescObj = {blockDescription:blockDescription}
    const descRes = user.blockDescription.push(blockDescObj);
    console.log(`descRes : `,descRes)
    await user.save();

    
    // console.log(`details called to be uploaded on the smart contract `,blockDetailsUpload)

    res.status(200).json("Block details are uploaded on smart contract and block no,description are added on mondodb successfully");
  } catch (error) {
    console.log(`error while making a addition to the db and the smart contract ${error}`);
    res.status(500).json(`error while making a addition to the db  and the smart contract ${error}`);
  }
});



app.post("/profile",async (req,res)=>{
  try{
    const token = req.cookies.jwtoken;
    console.log(`token`,token)
    const verifyUser = jwt.verify(token, process.env.REACT_APP_SECRET_KEY);
    const user = await Register.findOne({ _id: verifyUser._id });
    console.log("user",user)
    res.status(200).json(user)

  }catch(error){
    console.log(`error in post api of profile api`,error)
    res.status(500).json(`error in post api of profile api`)
  }
})