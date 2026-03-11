import { AppbarClient } from "../../components/AppbarClient";
import { SidebarItem } from "../../components/SidebarItem";
import { HomeIcon, TransferIcon, TransactionsIcon, P2PIcon, Profile } from "@repo/ui/icons";

export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div>
      <AppbarClient />
      <div className="flex pt-8">
        <div className="fixed left-0 top-0 h-screen w-60 bg-[#111827] border-r dark:border-slate-800 flex pt-14 flex-col justify-between">
          <div className="mt-24 flex flex-col gap-1 px-3">
            <SidebarItem href={"/dashboard"} icon={<HomeIcon />} title="Home" />
            <SidebarItem href={"/transfer"} icon={<TransferIcon />} title="Transfer" />
            <SidebarItem href={"/transactions"} icon={<TransactionsIcon />} title="Transactions" />
            <SidebarItem href={"/p2P"} icon={<P2PIcon />} title="P2P Transfer" />
          </div>
          <div className="pb-4 px-3">
            <SidebarItem href={"/profile"} icon={<Profile />} title="Profile" />
          </div>
        </div>
        <div className="ml-60 w-full p-8 overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}