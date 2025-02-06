import Link from "next/link";

type MenuLinkProps = {
  href: string;
  text: string;
  color?: string;
};

export default function MenuLink({
  href,
  text,
  color = "text-purple-100 hover:text-purple-200",
}: MenuLinkProps) {
  return (
    <Link 
      href={href}
      className={`flex cursor-pointer px-4 py-2 text-xl font-medium rounded-md transition duration-200 ease-in-out ${color} hover:bg-white/10`}
    >
      {text}
    </Link>
  );
}
