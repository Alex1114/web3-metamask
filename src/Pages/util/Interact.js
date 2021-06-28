import React from 'react';
import Web3 from 'web3';
import { ethers } from "ethers";
import dotenv from 'dotenv'
dotenv.config()
const web3 = new Web3(Web3.givenProvider);
const contractABI = require("../../contract-abi.json");
const contractAddress = "0xF321A9D31bcA03D60E339E3f9ED943BBD94B8d2a";

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👉🏽 Awesome let's buy some stuff.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else { 
    return {
      address: "",
      status: (
        <span>
          <p>
            {" 🦊 "}
            <a target="_blank" href={`https://metamask.io/download.html`} rel="noopener noreferrer">
              You must install Metamask, a virtual Ethereum wallet, in your browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👉🏽 Awesome let's buy some stuff.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" 🦊 "} 
            <a target="_blank" href={`https://metamask.io/download.html`} rel="noopener noreferrer">
              You must install Metamask, a virtual Ethereum wallet, in your browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const mintNFT = async (amount) => {

  const SamuraiContract = new web3.eth.Contract(contractABI, contractAddress);

  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    value: ethers.utils.hexlify(ethers.utils.parseEther((amount*0.03).toString())), // Only required to send ether to the recipient from the initiating external account.
    data: SamuraiContract.methods
      .mintSamurai(amount)
      .encodeABI(), 
  };
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status: "✅ Check out your transaction on Etherscan: https://etherscan.io/tx/" + txHash + "\nYou can check it out on https://opensea.io/ after a while!" ,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};