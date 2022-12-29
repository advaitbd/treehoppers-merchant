import { Metaplex } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useState,useEffect } from 'react'
import NftCard from '../components/nft';

const connection = new Connection(clusterApiUrl("devnet"));
const metaplex = new Metaplex(connection);

export default function Dash() {
  const mintAddress = new PublicKey("CEKfZFV8HZLn9QUTvhJcJqgC9qqMpvNYs7yTgAXbsDgh");

  const [nftProps, setNftProps] = useState({ name: "", symbol: "", imageURI: ""});
  const [nftAttributes, setNftAttributes] = useState<any | null>([""])
  
  async function getNft() {
    const nft = await metaplex.nfts().findByMint({ mintAddress });
    if (nft.json != null) {
      setNftProps({ name: nft.name || "", symbol: nft.symbol || "", imageURI: nft.json.image || ""})
      setNftAttributes(nft.json.attributes)
    }
    console.log(nft)
    console.log(nftAttributes)
    return nft
  }

  useEffect(() => {
    getNft()
  }, [])

  return (
    <>
        <div className="flex flex-col justify-center">
          <h1 className="font-bold text-5xl m-4 text-gray-700 text-center">
            Currently Minted Coupons
          </h1>
          <div className='flex flex-wrap justify-center'>
          {nftProps ? <NftCard name={nftProps.name} symbol={nftProps.symbol} imageURI={nftProps.imageURI} attributes={nftAttributes}/> : <p>loading...</p> }
          <NftCard name={nftProps.name} symbol={nftProps.symbol} imageURI={nftProps.imageURI} attributes={nftAttributes}/>
          <NftCard name={nftProps.name} symbol={nftProps.symbol} imageURI={nftProps.imageURI} attributes={nftAttributes}/>
          </div>

        </div>
    </>
  );
}
