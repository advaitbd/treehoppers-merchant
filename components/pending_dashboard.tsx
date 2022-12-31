import {
  Metaplex,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useState, useEffect } from "react";
import { useMetaplex } from "../pages/useMetaplex";
import { useWallet } from '@solana/wallet-adapter-react';
import NftCard from "./nft";
import { app, database } from "../pages/firebaseConfig"
import { collection, addDoc, getDocs } from 'firebase/firestore';
const connection = new Connection(clusterApiUrl("devnet"));
const metaplex = new Metaplex(connection);

export default function Dash2() {
  // FcCotb1Xnde3M5dGjUqY3EVcr8PwhWaVem7RUS4dFXjo
  // CEKfZFV8HZLn9QUTvhJcJqgC9qqMpvNYs7yTgAXbsDgh
  // pf6f1ZCrLkVrYVLcnKSR5FuvgFHhrqoD7TDEtKGLiRq
  // 3nLcd7A14CevzFhvCzw6xJmKNRKn311DzAzrg16WLD6i
  const dbInstance = collection(database, '/coupons');
  // Function to query collection by pending: True
  function getPendingCoupons() {
    //Build query
    const query = dbInstance.where("pending",'==',true)
    getDocs(dbInstance).then((data) => {
      //Return a list of coupons 
      console.log( data.docs.map((item)=>{
        return {...item.data(), id: item.id}
      }));
    });
  }

  getPendingCoupons()
  // simulating a list of coupon mints, ideally should be obtained from the firebaseDB
  const coupons = [
    "3nLcd7A14CevzFhvCzw6xJmKNRKn311DzAzrg16WLD6i",
    "pf6f1ZCrLkVrYVLcnKSR5FuvgFHhrqoD7TDEtKGLiRq",
    "FcCotb1Xnde3M5dGjUqY3EVcr8PwhWaVem7RUS4dFXjo",
  ];
  let couponKeys: PublicKey[] = [];

  for (let i = 0; i < coupons.length; i++) {
    const mint = new PublicKey(coupons[i]);
    couponKeys.push(mint);
  }

  const { metaplex } = useMetaplex();
  const wallet = useWallet();
  const [couponNFTs, setCoupons] = useState([""]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCoupons(couponKeys).then((coupons) => {
      setCoupons(coupons);
      setLoading(false);
    });
  }, []);

  if (!wallet.connected) {
    return null;
  }

  async function getCoupons(addresses: PublicKey[]) {
    const nfts = await metaplex.nfts().findAllByMintList({ mints: addresses });
    let loadedNFTs = [];

    // looping through returned NFTs and calling .load to get the metadata
    for (let i = 0; i < nfts.length; i++) {
      const loadedNFT = await metaplex.nfts().load({ metadata: nfts[i] });
      loadedNFTs.push(loadedNFT);
    }
    console.log(loadedNFTs);
    return loadedNFTs;
  }

  // unpacking the NFT properties into the NFT card component
  function unpackCoupons(coupons: any) {
    let couponElements = [];
    for (let i = 0; i < coupons.length; i++) {
      couponElements.push(
        <NftCard
          key={i}
          name={coupons[i].name}
          symbol={coupons[i].symbol}
          imageURI={coupons[i].json.image}
          attributes={coupons[i].json.attributes}
        />
      );
    }
    return couponElements;
  }

  const couponSection = (body: any) => {
    return <div className="flex flex-wrap justify-center">{body}</div>;
  };



  return (
    <>
      <div className="flex flex-col justify-center">
        <h1 className="font-bold text-gray-800 text-5xl m-4 text-center dark:text-white">
          Pending Coupons
        </h1>
        {loading ? (
          <p className="text-center font-light">loading...</p>
        ) : (
          couponSection(unpackCoupons(couponNFTs))
        )}
      </div>
    </>
  );
}
