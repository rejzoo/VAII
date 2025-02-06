import Image from "next/image";

type TankTableItemProps = {
  tankID: number;
  nation: string;
  typeIcon: string;
  name: string;
  link: string;
};

export default function TankTableItem(props: TankTableItemProps) {
  return (
    <a
      href={`/tanks/${encodeURIComponent(props.tankID)}`}
      className="flex items-center space-x-2 p-2 bg-gradient-to-b from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded m-0 transition-colors duration-200"
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
