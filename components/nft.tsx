import {
  collection,
  query,
  where,
  setDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { database } from "../firebaseConfig";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Metaplex,
  walletAdapterIdentity,
  keypairIdentity,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey, Keypair } from "@solana/web3.js";
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

export default function NftCard({
  name,
  symbol,
  imageURI,
  attributes,
  pending,
  metadata,
  address,
}: nftCardProps): JSX.Element {
  const [clicked, setClicked] = useState(false);
  let attributeElements = [];
  const wallet = useWallet();

  for (let i = 0; i < attributes.length; i++) {
    attributeElements.push(
      <p className="m-2 " key={i}>
        <a className="font-light">{attributes[i].trait_type}:</a>{" "}
        <a className="bg-[#bed3d8] rounded-md p-1 font-bold border-2 border-dotted border-slate-400">
          {attributes[i].value}{" "}
        </a>
      </p>
    );
  }

  const attributeSection = (body: any) => {
    return <div className="text-left">{body}</div>;
  };

  // Functions that handles the logic for approval or rejection of claims
  const handleApproveClick = async () => {
    try {
      // If Merchant approves the use of NFT, set pending to false and expired to true
      console.log("Approved!");
      metadata.attributes[3].value = "true";
      console.log(metadata);
      console.log(address);
      setClicked(true);

      const data = {
        mintAddress: address,
        pending: false,
      };

      const dbInstance = doc(database, "/CouponCollection", address);
      
      // Get user id from NFT metadata
      const userID = metadata.attributes
        ? metadata.attributes[4].value
        : metadata[4].value;
      console.log("userid",userID);

      // Query the collection using userID
      const q = query(
        collection(database, "UserCollection"),
        where("username", "==", userID)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        console.log(doc.id, " => ", doc.data()["privateKey"]);

        // some error here
        const privateKeyArray = new Uint8Array(doc.data()["privateKey"]);

        // Get key pair from query results
        const userKeyPair = Keypair.fromSecretKey(privateKeyArray);

        // New metadata
        const newMetadata =
          "https://ipfs.io/ipfs/QmcA9yuiU9x4bQWVvSwpzwh4RjnmbXqFmvJdgfbSpy4QZt";

        // Connect to Devnet
        const connection = new Connection(clusterApiUrl("devnet"));
        const metaplex = new Metaplex(connection);
        metaplex.use(keypairIdentity(userKeyPair));
        const mint = new PublicKey(address);
        const nft = await metaplex.nfts().findByMint({ mintAddress: mint });
        const { response } = await metaplex
          .nfts()
          .update(
            { nftOrSft: nft, uri: newMetadata },
            { commitment: "processed" }
          );
        console.log(response);
      });      
      
      setDoc(dbInstance, data, { merge: true }).then(() => {
        console.log("coupon used");
        setClicked(false);
        window.location.reload()
      });


    } catch (error) {
      console.error(error);
      // expected output: ReferenceError: nonExistentFunction is not defined
      // (Note: the exact output may be browser-dependent)
    }
  };
  const handleRejectClick = () => {
    // If Merchant rejects the use of NFT, set pending to false only
    setClicked(true);
    console.log("Rejected!");
    const data = {
      mintAddress: address,
      pending: false,
    };
    const dbInstance = doc(database, "/CouponCollection", address);    
    setDoc(dbInstance, data, { merge: true }).then(() => {
      console.log("coupon used");
      setClicked(false);
      window.location.reload()
    });    

    // delete from couponcollection in firebase
  };

  const cardStyle =
    "w-64 flex flex-col p-2 my-2 mx-2 bg-gray-200 text-center justify-center rounded-md border-2 border-slate-400 dark:bg-gray-900";
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
