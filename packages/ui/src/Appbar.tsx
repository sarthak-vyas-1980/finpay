import { Button } from "./button";

interface AppbarProps {
    user?: {
        name?: string | null;
    },
    // TODO: can u figure out what the type should be here?
    onSignin: any,
    onSignout: any
}

export const Appbar = ({
    user,
    onSignin,
    onSignout
}: AppbarProps) => {
    return <div className="fixed top-0 left-0 right-0 z-50 flex justify-between border-b px-4 border-slate-300 bg-white">
        <div className="font-bold py-2 text-[#111827] flex items-center">
            <div className="flex gap-2 items-center"> 
                <div className="text-3xl">💳</div> 
                <div>
                    <div className="leading-4">FinPay</div>
                    <div className="text-xs font-light">Wallet App</div>
                </div>
            </div>
        </div>
        <div className="flex flex-col justify-center pt-2">
            <Button onClick={user ? onSignout : onSignin}>{user ? "Logout" : "Login"}</Button>
        </div>
    </div>
}