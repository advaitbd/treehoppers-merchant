interface nftCardProps {
    name: string;
    symbol: string;
    imageURI: string;
}

export default function nftCard({ name, symbol, imageURI }: nftCardProps) {
    return (
        <div className="flex flex-col p-1 my-2 mx-2 bg-gray-200 text-center justify-center rounded-md">
        <h1 className="font-bold text-2xl text-gray-700">
            {name}
        </h1>
        <img className="mx-auto w-24 h-24 rounded-md" src={imageURI}></img>
        <p className="text-sm text-gray-400">{symbol}</p>
        </div>
    );
}