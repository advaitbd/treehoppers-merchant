interface nftCardProps {
    name: string;
    symbol: string;
    imageURI: string;
    attributes: string[];
}

export default function nftCard({ name, symbol, imageURI,attributes}: nftCardProps): JSX.Element {
    
    let attributeElements = []
    for (let i = 0; i < attributes.length; i++) {
        attributeElements.push(<p className="m-2 " key={i}><a className="bg-gray-400 rounded-md p-1 font-bold">{attributes[i].trait_type}:</a> {attributes[i].value} </p>)
    }
    const attributeSection = (body:any) => {
        return (<div className="text-left">{body}</div>)
    }
    return (
        <div className="flex flex-col p-2 my-2 mx-2 bg-gray-200 text-center justify-center rounded-md border-4 border-slate-400">
        <h1 className="font-bold text-2xl text-gray-700">
            {name}
        </h1>
        <img className="mx-auto h-32 rounded-md" src={imageURI}></img>
        <p className="text-sm text-gray-400">{symbol}</p>
        <div className="text-sm">{attributeSection(attributeElements)}</div>
        </div>
    );
}