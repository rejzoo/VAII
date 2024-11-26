import Image from "next/image";

type TankTableItemProps = {
  nation: string;
  typeIcon: string;
  name: string;
  link: string;
};

export default function TankTableItem(props: TankTableItemProps) {
  return (
    <a
        href={`/tanks/${encodeURIComponent(props.link)}`}
        className="flex flex-row flex-shrink-0 items-center space-x-2 p-2 bg-gray-700 hover:bg-gray-800 rounded m-0"
        style={{ width: '200px', height: '40px' }}
    >
        <Image
            src={`/nation/icon-${props.nation}.png`}
            alt={props.nation}
            width={32}
            height={20}
            className="w-8 h-5 object-contain"
        />
        <Image
            src={`/type/${props.typeIcon}.png`}
            alt={props.typeIcon}
            width={18}
            height={20}
            className="w-5 h-5 object-contain"
        />
         <span className="text-sm font-medium text-white">{props.name}</span>
    </a>
  );
}
