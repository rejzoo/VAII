import Image from "next/image";

type TableRowProps = {
    index: number;
    nation: string;
    type: string;
    tier: number;
    name: string;
    value1: number;
    value2: number;
    value3: number;
};

export default function TankTableItemMasteryMoe(props: TableRowProps) {
    return (
        <tr className={`${
            props.index % 2 === 0 ? "bg-gray-600" : "bg-gray-700"
        } text-white`}>
            <td className="px-4">
                <Image
                    src={`/nation/icon-${props.nation}.png`}
                    alt={props.nation}
                    width={32}
                    height={20}
                    className="w-8 h-5 object-contain"
                />
            </td>
            <td className="px-4 py-2">
                <Image
                    src={`/type/${props.type}.png`}
                    alt={props.type}
                    width={18}
                    height={20}
                    className="w-5 h-5 object-contain"
                />
            </td>
            <td className="px-4 py-2">{props.tier}</td>
            <td className="px-4 py-2">{props.name}</td>
            <td className="px-4 py-2">{props.value1.toLocaleString()}</td>
            <td className="px-4 py-2">{props.value2.toLocaleString()}</td>
            <td className="px-4 py-2">{props.value3.toLocaleString()}</td>
        </tr>
    );
}