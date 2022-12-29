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
        <div className="w-64 flex flex-col p-2 my-2 mx-2 bg-gray-200 text-center justify-center rounded-md border-4 border-slate-400 dark:bg-gray-900">
        <h1 className="font-bold text-2xl text-gray-700 dark:text-white">
            {name}
        </h1>
        <img className="mx-auto h-32 rounded-md" src={imageURI}></img>
        <p className="text-sm text-gray-400 dark:text-gray-200">{symbol}</p>
        <div className="text-sm text-black dark:text-gray-100">{attributeSection(attributeElements)}</div>
        </div>
    );
}