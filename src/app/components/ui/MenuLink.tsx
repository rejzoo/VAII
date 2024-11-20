import Link from "next/link";

type MenuLinkProps={
    href: string;
    text: string;
}

export default function MenuLink(props: MenuLinkProps) {

    return (
        <Link href={props.href} className="flex px-4 py-2 text-xl hover:bg-gray-700 rounded items-center justify-center">
            {props.text}
        </Link>
    )
}