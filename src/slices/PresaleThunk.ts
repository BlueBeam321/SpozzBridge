import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20ABI } from "../abi/IERC20.json";
import { abi as PresaleAbi } from "../abi/Presale.json";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBalances, getBridgeBalances } from "./AccountSlice";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { error, info } from "../slices/MessagesSlice";
import { IPresaleAsyncThunk, IJsonRPCError, IBridgeApproveAsyncThunk, IBridgeSwapAsyncThunk } from "./interfaces";
import axios from "axios";

export const approveToken = createAsyncThunk(
  "presale/approveToken",
  async ({ amount, provider, address, networkID }: IBridgeApproveAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const spotContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20ABI, signer);
    let approveTx;
    try {
      approveTx = await spotContract.approve(
        addresses[networkID].BRIDGE_ADDRESS,
        ethers.utils.parseUnits("10000000000", "ether"),
      );
      const pendingTxnType = "approving";
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: pendingTxnType, type: pendingTxnType }));
      await approveTx.wait();
    } catch (e: unknown) {
      const errMsg = (e as IJsonRPCError).message;
      dispatch(error("Approved failed"));
      console.log(errMsg);
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }
    dispatch(getBridgeBalances({ address, networkID, provider, secondNetworkID: 0 }));
  },
);

function sleep(millis: number) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

export const swapToken = createAsyncThunk(
  "presale/approveToken",
  async ({ amount, provider, address, networkID, dstNetworkID }: IBridgeSwapAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const spotContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20ABI, signer);
    const bridgeContract = new ethers.Contract(addresses[networkID].BRIDGE_ADDRESS as string, PresaleAbi, signer);
    let swapAllowance = await spotContract.allowance(address, addresses[networkID].BRIDGE_ADDRESS);
    let value = Number(ethers.utils.formatUnits(swapAllowance, "gwei"));

    if (value < amount) {
      dispatch(error("Allowed token amount is less than swap amount."));
    }

    let approveTx;
    try {
      approveTx = await bridgeContract.swapStart(
        dstNetworkID,
        address,
        ethers.utils.parseUnits(amount.toString(), "gwei"),
      );
      const pendingTxnType = "swapping";
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: pendingTxnType, type: pendingTxnType }));
      const tx = await approveTx.wait();
      console.log("Transaction Hash", approveTx, tx);
      let eventHash = await bridgeContract.userEventMap(address);
      let depositInfo = await bridgeContract.registeredChains(dstNetworkID);
      let depositCnt = Number(depositInfo.depositCount.toString());
      // wait until bot have action.
      let networkName: string = "ether";
      if (dstNetworkID == 1 || dstNetworkID == 4) {
        networkName = "ether";
      } else if (dstNetworkID == 56 || dstNetworkID == 97) {
        networkName = "bsc";
      } else if (dstNetworkID == 137 || dstNetworkID == 80001) {
        networkName = "polygon";
      }

      let receiveAmount = amount * 0.95;
      let swapRequest = {
        network: networkName,
        eventHash: eventHash,
        depositCount: depositCnt,
        fromChainID: networkID,
        fromAddress: address,
        toAddress: address,
        amount: ethers.utils.parseUnits(amount.toString(), "gwei").toString(),
      };
      // const res = await axios.post("https://spotbridge.orbitinu.store/swap", swapRequest);
      // const res = await axios.post("http://192.168.103.61:8080/swap", swapRequest);

      for (let i = 0; i < 5; i++) {
        const res = await axios.post("https://spotbridge.orbitinu.store/swap", swapRequest);
        // const res = await axios.post("http://192.168.103.61:8080/swap", swapRequest);
        // const res = await axios.post("http://apibridge.acdevdash.com/swap", swapRequest);
        console.log("from server", res);
        if (res.status == 200) {
          await dispatch(getBridgeBalances({ address, networkID, provider, secondNetworkID: 0 }));
          dispatch(info("swap success"));
          // const res = await axios.post("http://192.168.103.61:8080/swap", swapRequest);
          break;
        } else {
          await sleep(1000);
          if (i == 4) {
            dispatch(error("swap failed"));
            break;
          }
        }
      }
    } catch (e: unknown) {
      const errMsg = (e as IJsonRPCError).message;
      if (errMsg.includes("only whitelisted"))
        dispatch(error("You are not added to whitelist. Please contact Manager."));
      else if (errMsg.includes("exceed limit")) dispatch(error("Sorry. You exceed limit"));
      else dispatch(error("Swap failed"));
      console.log(errMsg);
      // await dispatch(getBridgeBalances({ address, networkID, provider, secondNetworkID: 0 }));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }
    // dispatch(getBridgeBalances({ address, networkID, provider, secondNetworkID: dstNetworkID }));
  },
);

// export const swapToken = createAsyncThunk(
//   "presale/approveToken",
//   async ({ amount, provider, address, networkID, dstNetworkID }: IBridgeSwapAsyncThunk, { dispatch }) => {
//     if (!provider) {
//       dispatch(error("Please connect your wallet!"));
//       return;
//     }

//     const signer = provider.getSigner();
//     const spotContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20ABI, signer);
//     const bridgeContract = new ethers.Contract(addresses[networkID].BRIDGE_ADDRESS as string, PresaleAbi, signer);
//     let swapAllowance = await spotContract.allowance(address, addresses[networkID].BRIDGE_ADDRESS);
//     let value = Number(ethers.utils.formatUnits(swapAllowance, "gwei"));

//     if (value < amount) {
//       dispatch(error("Allowed token amount is less than swap amount."));
//     }

//     let approveTx;
//     try {
//       const pendingTxnType = "swapping";
//       dispatch(fetchPendingTxns({ txnHash: "bridgeswaptransaction", text: pendingTxnType, type: pendingTxnType }));

//       // wait until bot have action.
//       let dstNetwork: string = "ether";
//       let srcNetwork: string = "ether";
//       if (dstNetworkID == 1 || dstNetworkID == 3) {
//         dstNetwork = "ether";
//       } else if (dstNetworkID == 56 || dstNetworkID == 97) {
//         dstNetwork = "bsc";
//       } else if (dstNetworkID == 137 || dstNetworkID == 80001) {
//         dstNetwork = "polygon";
//       }

//       if (networkID == 1 || networkID == 3) {
//         srcNetwork = "ether";
//       } else if (networkID == 56 || networkID == 97) {
//         srcNetwork = "bsc";
//       } else if (networkID == 137 || networkID == 80001) {
//         srcNetwork = "polygon";
//       }

//       let swapRequest = {
//         srcNetwork,
//         dstNetwork,
//         fromChainID: networkID,
//         dstNetworkID,
//         fromAddress: address,
//         toAddress: address,
//         amount,
//       };

//       for (let i = 0; i < 5; i++) {
//         const res = await axios.post("https://spotbridge.orbitinu.store/swap", swapRequest);
//         // const res = await axios.post("http://192.168.103.61:8080/swap", swapRequest);
//         // const res = await axios.post("http://apibridge.acdevdash.com/swap", swapRequest);
//         console.log("from server", res);
//         if (res.status == 200) {
//           await dispatch(getBridgeBalances({ address, networkID, provider, secondNetworkID: 0 }));
//           dispatch(info("swap success"));
//           break;
//         } else {
//           await sleep(1000);
//           if (i == 2) {
//             dispatch(error("swap failed"));
//             break;
//           }
//         }
//       }
//     } catch (e: unknown) {
//       const errMsg = (e as IJsonRPCError).message;
//       if (errMsg.includes("only whitelisted"))
//         dispatch(error("You are not added to whitelist. Please contact Manager."));
//       else if (errMsg.includes("exceed limit")) dispatch(error("Sorry. You exceed limit"));
//       else dispatch(error("Network status is unstable. Swap failed. Try again"));
//       console.log(errMsg);
//       return;
//     } finally {
//       dispatch(clearPendingTxn("bridgeswaptransaction"));
//     }
//   },
// );

// export const changeDstNetwork = createAsyncThunk
export const purchaseToken = createAsyncThunk(
  "presale/purchaseToken",
  async ({ amount, ethBalance, token, provider, address, networkID }: IPresaleAsyncThunk, { dispatch }) => {
    dispatch(getBalances({ address, networkID, provider }));
  },
);
