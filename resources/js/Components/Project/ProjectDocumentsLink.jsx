import { useState } from "react";

export default function ProjectDocumentsLink({
    name,
    handleChange,
    linkValue,
    index,
    edit,
}) {
    const [errorMessage, setErrorMessages] = useState(null);
    // console.log(linkValue);
    // link lấy lên từ database
    return (
        <div className="flex py-2 w-full flex-col ">
            <div>
                <label className="block font-bold">{name || ""}</label>
                <div className="flex justify-between gap-2">
                    {edit ? (
                        <input
                            // id="linkInput"
                            type="url"
                            className="rounded-md w-10/12"
                            placeholder="https://example.com"
                            value={linkValue ? linkValue : ""}
                            onChange={(e) => {
                                if (typeof index !== undefined) {
                                    handleChange(e.target.value, index);
                                } else {
                                    handleChange(e.target.value);
                                }
                            }}
                            onBlur={(e) => {
                                const value = e.target.value.trim();
                                if (!value) return;
                                try {
                                    new URL(value);
                                    setErrorMessages("");
                                } catch (error) {
                                    setErrorMessages("Đường dẫn không hợp lệ!");
                                }
                            }}
                        />
                    ) : (
                        <div className="line-clamp-2 text-blue-600 hover:underline">
                            {linkValue ? (
                                <a
                                    href={linkValue}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {linkValue}
                                </a>
                            ) : (
                                <div className="text-black">Không có</div>
                            )}
                        </div>
                    )}
                </div>
                {errorMessage && (
                    <div className="text-red-600 py-1 text-sm ">
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
}
