import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [transactionHistory, setTransactionHistory] = useState([]);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  }

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  }

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  }

  const getBalance = async () => {
    if (atm) {
      const newBalance = await atm.getBalance();
      setBalance(newBalance.toString());
    }
  }

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
      getTransactionHistory();
    }
  }

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
      getTransactionHistory();
    }
  }

  const burnTokens = async () => {
    if (atm) {
        let tx = await atm.burn(1); 
        await tx.wait();
        getBalance();
    }
};


  const getTransactionHistory = async () => {
    if (atm) {
      const history = await atm.getTransactionHistory();
      const formattedHistory = history.map(tx => ({
        from: tx.from.toString(),
        amount: tx.amount.toNumber(),
        timestamp: tx.timestamp.toNumber(),
      }));
      setTransactionHistory(formattedHistory);
    }
  }

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    if (!account) {
      return <div><button onClick={connectAccount}>Please connect your Metamask wallet</button>
                  <hr></hr>
                  <h3>hey harshuuu wish you very good day ahead.</h3>
      
      </div>

      
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="main">
        <p>Your Account: {account}</p>
        
        <p>Your Balance: {balance}</p>
        <h2 >Token deposition section </h2>

        <p><button className="hoverable-button" onClick={deposit}>Deposit 1 ETH</button></p>
        <hr>
        </hr>
        <h2 >Token withdraw section </h2>
        
        <button className="hoverable-button" onClick={withdraw}>Withdraw 1 ETH</button>
        <br></br>

        <hr></hr>
        <button className="hoverable-button" onClick={() => burnTokens(1)}>Burn 1</button> {}
        
        <br></br>
        <h2>Transaction History</h2>
        <ul>
          {transactionHistory.map((tx, index) => (
            <li key={index}>
            From: {tx.from}, Amount: {tx.amount}, Timestamp: {tx.timestamp}
            </li>
          ))}
        </ul>
        
      </div>
    )
  }

  useEffect(() => { getWallet(); }, []);

  return (
    <div className="backscreen">
      <div className="divi">
        <main className="container">
          <header>
            <h1 style={{ color: '#00FF00' }}>
              Hey welocme to tx site!
            </h1>
          </header>
          {initUser()}
          <style jsx>{`
            .container {
              background-color: #1B1B1B;
              text-align: center;
              color: #FFFFFF; /* Set text color to white */
              display: inline-block; /* Make the div adjust to the content */
              border-radius: 10px; /* Add rounded borders */
              padding: 20px; /* Add padding for better appearance */
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            .main {
              background-color: #1B1B1B;
              text-align: center;
              display: inline-block; /* Make the div adjust to the content */
              border-radius: 10px; /* Add rounded borders */
              padding: 20px; /* Add padding for better appearance */
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            .backscreen {
              background-color: #1B1B1B; /* Light greyish background color */
              position: fixed;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
            }
            .hoverable-button {
              background-color: #3498db; /* Set the default background color */
              color: #ffffff; /* Set the default text color */
              padding: 10px 15px; /* Add padding for better appearance */
              border: none; /* Remove border */
              border-radius: 5px; /* Add rounded corners */
              cursor: pointer; /* Add pointer cursor on hover */
              transition: background-color 0.3s; /* Smooth transition for background color */
            }
          
            .hoverable-button:hover {
              background-color: #2980b9; /* Change background color on hover */
            }
          
          `}</style>
        </main>
      </div>
    </div>
  );
          }  