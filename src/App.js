import React, { useEffect, useState } from "react";
import {
	Box,
	Container,
	Typography,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import Web3 from "web3";

const App = () => {
	const [address, setAddress] = useState("");
	const [balance, setBalance] = useState(null);
	const [open, setOpen] = useState(false);

	// ? get account address in web3
	// async function requestData() {
	// 	if (window.ethereum) {
	// 		const web3 = new Web3(window.ethereum);
	// 		try {
	// 			window.ethereum.enable().then(function () {});
	// 		} catch (e) {
	// 			console.log(e);
	// 		}
	// 	}
	// }

	// ? get account address in web3
	const getWeb3 = async () => {
		return new Promise(async (resolve, reject) => {
			const web3 = new Web3(window.ethereum);
			try {
				await window.ethereum.request({ method: "eth_requestAccounts" });
				resolve(web3);
			} catch (error) {
				reject(error);
			}
		});
	};

	useEffect(() => {
		async function checkNetwork() {
			const web3 = await getWeb3();
			const chainid = await web3.eth.getChainId();
			if (chainid !== 97) {
				setOpen(true);
			}
		}
		checkNetwork();
	}, []);

	async function requestData() {
		const web3 = await getWeb3();
		const walletAddress = await web3.eth.requestAccounts();
		console.log(walletAddress[0]);
		setAddress(walletAddress[0]);
		const walletBalanceInWei = await web3.eth.getBalance(walletAddress[0]);
		const walletBalanceInEth =
			Math.round(Web3.utils.fromWei(walletBalanceInWei) * 1000) / 1000;
		console.log(walletBalanceInWei);
		console.log(walletBalanceInEth);
		setBalance(walletBalanceInEth);
	}
	const handleClose = (event, reason) =>
		reason !== "backdropClick" ? setOpen(false) : null;

	const handleSwitch = async () => {
		const web3 = await getWeb3();
		try {
			await window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: web3.utils.toHex(97) }],
			});
		} catch (err) {
			// This error code indicates that the chain has not been added to MetaMask
			if (err.code === 4902) {
				await window.ethereum.request({
					method: "wallet_addEthereumChain",
					params: [
						{
							chainName: "BSC Testnet",
							chainId: web3.utils.toHex(97),
							nativeCurrency: { name: "BNB", decimals: 18, symbol: "BNB" },
							rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
						},
					],
				});
			}
		}
		setOpen(false);
	};
	// ? get account address in js
	//  async function requestAccounts() {
	// 	if (typeof window.ethereum !== "undefined") {
	// 		console.log("Metamask is installed");
	// 		try {
	// 			const accounts = await window.ethereum.request({
	// 				method: "eth_requestAccounts",
	// 			});
	// 			setAddress(accounts[0]);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	} else {
	// 		console.log("Metamask is not installed");
	// 	}
	// }
	return (
		<>
			<Container>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
					py={10}
				>
					<Typography variant="h4">Address: {address}</Typography>
					<Typography variant="h4" py={5}>
						Balance: {balance}
					</Typography>
					<Button
						onClick={() => requestData()}
						variant="contained"
						color="warning"
						size="large"
					>
						Connect
					</Button>
				</Box>
				<Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
					<DialogTitle>Network Error.</DialogTitle>
					<DialogContent>Error! Incorrect network.</DialogContent>
					<DialogActions>
						<Button onClick={handleSwitch}>Switch Network</Button>
					</DialogActions>
				</Dialog>
			</Container>
		</>
	);
};

export default App;
