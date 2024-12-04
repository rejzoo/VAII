import MenuLink from "./ui/MenuLink";

export default function Menu() {
  return (
    <div className="min-h-screen w-55 bg-gray-800 text-white flex-shrink-0 top-0 left-0 flex flex-col shadow-lg">
      <h1 className="text-2xl font-bold p-4 border-b border-gray-700">Seal Clubber</h1>

      <nav className="flex-1 mt-5">
            <MenuLink href="/admin" text="ADMIN" color="text-red-600"/>
            <MenuLink href="/" text="Home"/>
            <MenuLink href="/profile/details" text="Profile"/>
            <MenuLink href="/tanks" text="Tanks"/>
            <MenuLink href="/servers/EU" text="Servers"/>
            <MenuLink href="/mastery/EU" text="Mastery"/>
            <MenuLink href="/moe/EU" text="MOE"/>
      </nav>
    </div>
  );
}
