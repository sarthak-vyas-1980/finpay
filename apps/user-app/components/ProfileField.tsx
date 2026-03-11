
type profileFieldType = {
    label: string,
    value: string | null,
    edit: boolean,
    onChange: (e: any)=> void,
}
export function ProfileField({ label, value, edit, onChange }: profileFieldType) {
    return (
        <div className="mb-4">
            <p className="text-sm text-gray-500">{!edit && label === "Name" ? "" : label} </p>
            {edit ? (
                <input
                defaultValue={value || ""}
                onChange={(e)=>onChange(e.target.value)}
                className="w-full border dark:border-slate-700 px-3 py-2 rounded-lg dark:bg-slate-900 dark:text-gray-200"
                />
            ) : (
                <p className="text-lg font-medium">
                {value || "Not provided"}
                </p>
            )}
        </div>
    );
}