import {
  Metaplex,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useState, useEffect } from "react";
import { useWallet } from '@solana/wallet-adapter-react';
import NftCard from "./nft";

const connection = new Connection(clusterApiUrl("devnet"));
const metaplex = new Metaplex(connection);


interface DashBoardProps {
  addresses: string[];
  pending: boolean;
}

export default function Dashboard({addresses,pending}:DashBoardProps) {
  const coupons = addresses
  let couponKeys: PublicKey[] = [];

  for (let i = 0; i < coupons.length; i++) {
    const mint = new PublicKey(coupons[i]);
    couponKeys.push(mint);
  }

  const wallet = useWallet();
  const [couponNFTs, setCoupons] = useState<(Nft | Sft)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCoupons(couponKeys).then((coupons) => {
      console.log("fetching coupons")
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
    return loadedNFTs;
  }
  
  // unpacking the NFT properties into the NFT card component
  function unpackCoupons(coupons: any,pending: boolean) {
    let couponElements = [];
    for (let i = 0; i < coupons.length; i++) {
      couponElements.push(
        <NftCard
          key={i}
          address={addresses[i]}
          name={coupons[i].name}
          symbol={coupons[i].symbol}
          imageURI={coupons[i].json.image}
          attributes={coupons[i].json.attributes}
          pending = {pending}
          metadata = {coupons[i].json}
        />
      );
    }
    console.log(coupons)
    return couponElements;
  }

  const couponSection = (body: any) => {
    return <div className="flex flex-wrap justify-center">{body}</div>;
  };



  return (
    <>
      <div className="flex flex-col justify-center dark:bg-black">
        {/* <h1 className="font-bold text-gray-800 text-5xl m-4 text-center dark:text-white">
          Currently Minted Coupons
        </h1> */}
        {loading ? (
          <p className="text-center font-light">loading...</p>
        ) : (
          couponSection(unpackCoupons(couponNFTs,pending))
          
        )}
      </div>
    </>
  );
}
