import { AppbarClient } from "../../components/AppbarClient";
import { SidebarItem } from "../../components/SidebarItem";
import { HomeIcon, TransferIcon, TransactionsIcon, P2PIcon, Profile } from "@repo/ui/icons"

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div>
      <AppbarClient />
      <div className="flex">
          <div className="flex flex-col justify-between w-72 bg-[#111827] border-r text-white border-slate-300 min-h-screen mr-4 pt-28">
              <div>
                  <SidebarItem href={"/dashboard"} icon={<HomeIcon />} title="Home" />
                  <SidebarItem href={"/transfer"} icon={<TransferIcon />} title="Transfer" />
                  <SidebarItem href={"/transactions"} icon={<TransactionsIcon />} title="Transactions" />
                  <SidebarItem href={"/p2P"} icon={<P2PIcon />} title="P2P Transfer" />
              </div>
              <div className="mb-14">
                <SidebarItem href={"/profile"} icon={<Profile />} title="Profile" />
              </div>
          </div>
          {children}
      </div>
    </div>
  );
}


