import {
  JsonMetadata,
  Metadata,
  Metaplex,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import NftCard from "./nft";
import { LoadMetadataInput } from "@metaplex-foundation/js";
import { Loading, Skeleton } from "@web3uikit/core";
import { doc, getDocs, setDoc } from "firebase/firestore";
import { database } from "../firebaseConfig";

const connection = new Connection(clusterApiUrl("devnet"));
const metaplex = new Metaplex(connection);

interface DashBoardProps {
  addresses: string[];
  pending: boolean;
}

export default function Dashboard({ addresses, pending }: DashBoardProps) {
  const coupons = addresses
  let couponKeys: PublicKey[] = [];
  
  for (let i = 0; i < coupons.length; i++) {
    const mint = new PublicKey(coupons[i]);
    couponKeys.push(mint);
  }


  let loadingCouponElements: any[] = [];
  
  const loadingCouponSection = (body: any) => {
    return <div className="flex flex-wrap justify-center">{body}</div>;
  };

  for (let i = 0; i < couponKeys.length; i++) {
    loadingCouponElements.push(
      <div key={i} className="m-2">
        <Skeleton
          animationColor="#c2c2c2"
          backgroundColor="rgba(210, 215, 220, 1)"
          height="450px"
          theme="image"
          width="256px"
        />
      </div>
    );
  }  

  const wallet = useWallet();
  const [couponNFTs, setCoupons] = useState<(Nft | Sft)[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getCoupons(couponKeys).then((coupons) => {
      console.log("fetching coupons")
      setCoupons(coupons);      
      setLoading(false);
    });

    let loadedNFTs: any = [];
    getNFTs()
      .then(async (nfts) => {
        console.log("metadata objects returned");
        setRefreshing(false);
        console.log(nfts);
        // looping through returned NFTs and calling .load to get the metadata
        for (let i = 0; i < nfts.length; i++) {
          const loadedNFT = await metaplex
            .nfts()
            .load({ metadata: nfts[i] as Metadata<JsonMetadata<string>> });
          loadedNFTs.push(loadedNFT);
          console.log("loading full NFTs");
          setLoading(false);
        }
        return loadedNFTs;
      })
      .then((loadedNFTs) => {
        console.log("nfts loaded: ", loadedNFTs);
        const preLoadedAddresses = {
          preLoadedAddresses: loadedNFTs.map((nft: { address: { toString: () => any; }; }) => nft.address.toString())
        }
        console.log("preloaded addresses: ", preLoadedAddresses)
        uploadData(preLoadedAddresses);
        setCoupons(loadedNFTs);
      });

  }, []);

  if (!wallet.connected) {
    return null;
  }

  // const loadNftByCreator = async () => {
  //   const nftsByCreator = await metaplex.nfts().findAllByCreator({ creator: wallet.publicKey as PublicKey});
  //   console.log(nftsByCreator);
  // }
  // const owner = new PublicKey("6GQnPpKQiM6e9psh9oab28kQ1FCfNd67iGxBzh7frK5D")

  async function getNFTs() {
    console.log("finding by creator");
    setRefreshing(true);
    const nfts = await metaplex
      .nfts()
      .findAllByCreator({ creator: wallet.publicKey as PublicKey });
    return nfts;
  }

  async function getCoupons(addresses: PublicKey[]) {
    const nfts = await metaplex.nfts().findAllByMintList({ mints: addresses });
    let loadedNFTs = [];
    // looping through returned NFTs and calling .load to get the metadata
    console.log("loading coupons",loading);

    for (let i = 0; i < nfts.length; i++) {
      const loadedNFT = await metaplex.nfts().load({ metadata: nfts[i] as Metadata<JsonMetadata<string>>});
      loadedNFTs.push(loadedNFT);
    }
    return loadedNFTs;
  }

  const doNotRender = ["BqS14k3UK4vMPor2FTwL1kJEkqS4nmUwZxE66dt4DneD",
    "6nBrcdUaUAqTPiYxRg2J29oDStYr262tPDUUMaXT2ZgY",
    "3ptMLUkFgYwfRu3hHXeVHrsKDS38mKv4LJ4nhYdMhx7n",
    "6HUiBycq9MtPxpa9TAKBRRuyD4yhHEmZKuA5QGpDXC2r",
    "6JoAfvFsw8SqLbEoJbvoMdVbmcQQDJyep89ZqJegSCMm",
    "F6VEzX7k9Z8DzUCi5BDErUJZaoeUAgPp51jUcpU2Rz7a"]
  // unpacking the NFT properties into the NFT card component
  function unpackCoupons(coupons: any, pending: boolean) {
    let couponElements = [];
    for (let i = 0; i < coupons.length; i++) {
      if (!doNotRender.includes(coupons[i].address.toString())) {
        if (pending == true) {
          if (addresses.includes(coupons[i].address.toString())) {
            couponElements.push(
              <NftCard
                key={i}
                address={coupons[i].address.toString()}
                name={coupons[i].name}
                symbol={coupons[i].symbol}
                imageURI={coupons[i].json && coupons[i].json.image ? coupons[i].json.image : coupons[i].uri}
                attributes={coupons[i].json.attributes ? coupons[i].json.attributes : coupons[i].json}
                pending={pending}
                metadata={coupons[i].json}
              />
            );
          }
        } else {
          couponElements.push(
            <NftCard
              key={i}
              address={coupons[i].address.toString()}
              name={coupons[i].name}
              symbol={coupons[i].symbol}
              imageURI={coupons[i].json && coupons[i].json.image ? coupons[i].json.image : coupons[i].uri}
              attributes={coupons[i].json.attributes ? coupons[i].json.attributes : coupons[i].json}
              pending={pending}
              metadata={coupons[i].json}
            />
          );
        }
      }
        

    }
    return couponElements;
  }

  const couponSection = (body: any) => {
    return <div className="flex flex-wrap justify-center">{body}</div>;
  };


  // upload document to firebase
  const uploadData = (data: any) => {
    // const dbInstance = collection(database, '/MerchantCollection');
    const dbInstance = doc(
      database,
      "/MerchantCouponsCollection",
      wallet.publicKey?.toString() as string
    );
    setDoc(dbInstance, data).then(() => {
      // window.location.reload();
      console.log("updated preloaded coupons");
    });
  };

  return (
    <>
      <div className="flex w-1/2 flex-col justify-center text-center my-2">
        {/* <h1 className="font-bold text-gray-800 text-5xl m-4 text-center dark:text-white">
          Currently Minted Coupons
        </h1> */}
                {refreshing ? (
          <div
            className="flex justify-center mx-20 my-2"
            style={{
              backgroundColor: "#c1f4de",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <Loading
              fontSize={12}
              spinnerColor="#000000"
              text="Fetching Latest Data"
            />
          </div>
        ) : null}
        {loading
          ? loadingCouponSection(loadingCouponElements)
          : couponSection(unpackCoupons(couponNFTs, pending))}

      </div>
    </>
  );
}
