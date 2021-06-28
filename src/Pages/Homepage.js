import React, { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT} from "./util/Interact.js";

export default function Homepage(){

    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [amount, setAmount] = useState(0);

    useEffect(() => {
      async function fetchWalletAPI() {
        const { address, status } = await getCurrentWalletConnected();
  
        setWallet(address);
        setStatus(status);
    
        addWalletListener();
      }
      fetchWalletAPI()
    }, []);

    function addWalletListener() {
        if (window.ethereum) {
          window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
              setWallet(accounts[0]);
              setStatus("👉🏽 Awesome let's buy some stuff.");
            } else {
              setWallet("");
              setStatus("🦊 Connect to Metamask using the top right button.");
            }
          });
        } else {
          setStatus(
            <p>
              {" 🦊 "}
              <a target="_blank" href={`https://metamask.io/download.html`} rel="noopener noreferrer">
                You must install Metamask, a virtual Ethereum wallet, in your browser.
              </a>
            </p>
          );
        }
    }

    const connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWallet(walletResponse.address);
    };
    
    const onMintPressed = async (amount) => {
      // eslint-disable-next-line
      const { success, status } = await mintNFT(amount);
      setStatus(status);
      setAmount(0);
    };

    const IncrementItem = () => {
      if ( 20 > amount) {
        setAmount(amount+1);
      }
    }
    const DecreaseItem = () => {
      if (amount > 0) {
        setAmount(amount-1);
      }
    }

    return (
        <div className="Minter">
            <button id="walletButton" onClick={connectWalletPressed} className="font-link">
                {walletAddress.length > 0 ? (
                    "Connected: " + String(walletAddress).substring(0, 6) +
                    "..." + String(walletAddress).substring(38)
                ) : (
                    <span className="font-link">Connect Wallet</span>
                )}
            </button>
            
            <button id="mintButton" onClick={() => onMintPressed(amount)} className="font-link"> Purchase </button>
            <button onClick={IncrementItem} className="font-link">Click to increment by 1</button>
            <button onClick={DecreaseItem} className="font-link">Click to decrease by 1</button>
            <p id="amount" className="font-link"> {amount}  selected. </p>
            <p id="status" className="font-link"> {status} </p>
        </div>
    ) 
}