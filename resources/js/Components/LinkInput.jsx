import { useState } from "react";
import LinksList from "./LinksList";

export default function LinkInput({ handleSubmit }) {
    const [link, setLink] = useState(null);
    const [errorMessage, setErrorMessages] = useState(null);
    // link lấy lên từ database

    return (
        <div className="flex py-2 w-full flex-col ">
            <label className="block font-bold" htmlFor="linkInput">
                {`Thêm link :`}
            </label>
            <div className="flex justify-between gap-2">
                <input
                    id="linkInput"
                    type="url"
                    className="rounded-md w-10/12"
                    placeholder="https://example.com"
                    value={link ? link : ""}
                    onChange={(e) => {
                        setLink(e.target.value);
                    }}
                />
                <button
                    type="button"
                    className="border-2 rounded-lg w-2/12 px-3 py-2 bg-blue-500 border-blue-500 hover:border-blue-700 duration-300 hover:bg-blue-700 text-white"
                    onClick={() => {
                        try {
                            new URL(link);
                            handleSubmit((prev) => [...prev, link]);
                            setLink("");
                            setErrorMessages("");
                        } catch (error) {
                            console.log(error);
                            setErrorMessages("Đường dẫn không hợp lệ!");
                        }
                    }}
                >
                    Thêm link
                </button>
            </div>
            {errorMessage && (
                <div className="text-red-600 py-1 text-sm ">{errorMessage}</div>
            )}
            {/* {links && (
                <div>
                    {title && <div className="font-bold py-2">{title}</div>}
                    <LinksList links={links} handleSubmit={handleSubmit} />
                </div>
            )} */}
        </div>
    );
}
