interface nftCardProps {
    name: string;
    symbol: string;
    imageURI: string;
    attributes: string[];
    pending: boolean;
}

export default function nftCard({ name, symbol, imageURI,attributes,pending}: nftCardProps): JSX.Element {
    let attributeElements = []
    for (let i = 0; i < attributes.length; i++) {
        attributeElements.push(<p className="m-2 " key={i}><a className="bg-gray-400 rounded-md p-1 font-bold">{attributes[i].trait_type}:</a> {attributes[i].value} </p>)
    }
    const attributeSection = (body:any) => {
        return (<div className="text-left">{body}</div>)
    }
    // Functions that handles the logic for approval or rejection of claims
    const handleApproveClick = () => {
        // If Merchant approves the use of NFT, set pending to false and expired to true
        console.log("Approved!")
    }
    const handleRejectClick = () => {
        // If Merchant rejects the use of NFT, set pending to false only
        console.log("Rejected!")
    }
    return (
        <div className="w-64 flex flex-col p-2 my-2 mx-2 bg-gray-200 text-center justify-center rounded-md border-4 border-slate-400 dark:bg-gray-900">
        <h1 className="font-bold text-2xl text-gray-700 dark:text-white">
            {name}
        </h1>
        <img className="mx-auto h-32 rounded-md" src={imageURI}></img>
        <p className="text-sm text-gray-400 dark:text-gray-200">{symbol}</p>
        <div className="text-sm text-black dark:text-gray-100">{attributeSection(attributeElements)}</div>
        {/* Conditional Statement that checks if this NFT is pending */}
        <div className="text-sm text-black dark:text-gray-100">                                   
            {pending ? 
                // If NFT is pending, show merchant the option to approve or reject the NFT claim
                <div>
                <button onClick={handleApproveClick}>Approve</button>
                <button onClick={handleRejectClick}>Reject</button>
              </div> : null}
        </div>
        </div>
        
    );
}