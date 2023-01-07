import { setDoc, doc } from "firebase/firestore";
import { database } from "../firebaseConfig"
import { useWallet } from '@solana/wallet-adapter-react';
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import {Connection, clusterApiUrl, PublicKey} from "@solana/web3.js";
import { useState } from "react";

interface nftCardProps {
    name: string;
    symbol: string;
    imageURI: string;
    attributes: {
      trait_type: string;
      value: string;
    }[];
    pending: boolean;
    metadata: any;
    address: string;
}


export default function NftCard({ name, symbol, imageURI,attributes,pending, metadata,address}: nftCardProps): JSX.Element {
  const [clicked, setClicked] = useState(false);
  let attributeElements = [];
  const wallet = useWallet();
  for (let i = 0; i < attributes.length; i++) {
    attributeElements.push(
      <p className="m-2 " key={i}>
        <a className="bg-gray-400 rounded-md p-1 font-bold">
          {attributes[i].trait_type}:
        </a>{" "}
        {attributes[i].value}{" "}
      </p>
    );
  }

  const attributeSection = (body: any) => {
    return <div className="text-left">{body}</div>;
  };


  // Functions that handles the logic for approval or rejection of claims
  const handleApproveClick = async () => {
    // If Merchant approves the use of NFT, set pending to false and expired to true
    console.log("Approved!");
    metadata.attributes[4].value = "true"
    console.log(metadata)
    console.log(address)    
    setClicked(true);
    
    const data = {
      mintAddress: address,
      pending: false,
    }

    const dbInstance = doc(database, '/CouponCollection',address);
    setDoc(dbInstance, data, {merge:true}).then(() => {        
      console.log("coupon used");
      setClicked(false);
      window.location.reload()
    });

    // Calls the Redeem endpoint
    // fetch('http://localhost:3000/redeem', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     key: 'value'
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    //   .then(response => console.log(response))
    //   .catch(error => console.error(error));

    // const newMetadata = "https://ipfs.io/ipfs/QmVUmswAquyRLkUyxXjqSVQeBiYVdmjwwvzjJTLUpmRZ5c"
    
    // const connection = new Connection(clusterApiUrl('devnet'))
    // const metaplex = new Metaplex(connection)
    // metaplex.use(walletAdapterIdentity(wallet));
    // const mint = new PublicKey(address);

    // const nft = await metaplex.nfts().findByMint({ mintAddress: mint })
    // const { response } = await metaplex.nfts().update({ nftOrSft: nft, uri: newMetadata }, {commitment: 'processed'})
  };
  const handleRejectClick = () => {
    // If Merchant rejects the use of NFT, set pending to false only
    console.log("Rejected!");

    // set pending to false in firebase

  };

  const cardStyle = "w-64 flex flex-col p-2 my-2 mx-2 bg-gray-200 text-center justify-center rounded-md border-4 border-slate-400 dark:bg-gray-900"
  return (
    <div className={clicked ? "animate-pulse " + cardStyle : cardStyle}>
      <div className="h-full">
        <h1 className="font-bold text-2xl text-gray-700 dark:text-white">
          {name}
        </h1>
        <img className="mx-auto h-32 rounded-md" src={imageURI}></img>
        <p className="text-sm text-gray-400 dark:text-gray-200">{symbol}</p>
        <div className="h-48 text-sm text-black dark:text-gray-100">
          {attributeSection(attributeElements)}
        </div>
        {/* Conditional Statement that checks if this NFT is pending */}
        <div className="text-sm">
          {pending ? (
            // If NFT is pending, show merchant the option to approve or reject the NFT claim
            <div>
              <button
                className="m-2 bg-green-500 hover:bg-green-600 hover:scale-105 text-white py-2 px-4 rounded-lg"
                onClick={handleApproveClick}
              >
                Approve
              </button>
              <button
                className="m-2 bg-red-500 hover:bg-red-600 hover:scale-105 text-white py-2 px-4 rounded-lg"
                onClick={handleRejectClick}
              >
                Reject
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}