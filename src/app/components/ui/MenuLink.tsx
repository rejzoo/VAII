import Link from "next/link";

type MenuLinkProps={
    href: string;
    text: string;
    color?: string;
}

export default function MenuLink({ href, text, color = "text-white" }: MenuLinkProps) {

    return (
        <Link href={href} className={`flex px-4 py-2 text-xl hover:bg-gray-700 rounded items-center justify-center ${color}`}>
            {text}
        </Link>
    )
}