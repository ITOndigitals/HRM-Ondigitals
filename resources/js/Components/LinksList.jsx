export default function LinksList({
    links,
    setLinks,
    deleteLinks,
    deleteAddedLinks,
    title,
    addedLinks,
    canDelete,
}) {
    const removeSelectedLink = (index) => {
        deleteAddedLinks((prev) => prev.filter((_, i) => i !== index));
    };
    const removeDataBaseLinks = (index) => {
        // deleteLinks((prev) => [...prev, [title][index]]);
        deleteLinks((prev) => [...prev, index]);
        setLinks((prev) => ({
            ...prev,
            // title đồng thời là key của mảng
            [title]: prev[title].map((link, i) => (i === index ? null : link)),
        }));
    };
    return (
        <div>
            {title && (
                <div className="font-bold">{`Links files ${title.toLowerCase()}:`}</div>
            )}
            <div className="flex flex-col gap-1 h-[100px] overflow-y-scroll invisible-scrollbar">
                {/* link from database */}
                {/* selected link from input */}
                {links?.map((link, index) => (
                    <div>
                        {link && (
                            <div
                                key={index}
                                className="flex gap-2s items-center scroll"
                            >
                                <a
                                    className="w-11/12 text-blue-600 hover:underline line-clamp-1 text-xs whitespace-nowrap"
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {link}
                                </a>
                                {canDelete && (
                                    <button
                                        type="button"
                                        className="w-1/12 text-red-600 text-sm"
                                        onClick={() => {
                                            removeDataBaseLinks(index);
                                        }}
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {addedLinks?.map((link, index) => (
                    <div
                        key={index}
                        className="flex gap-2s items-center scroll"
                    >
                        <a
                            className="w-11/12 text-blue-600 hover:underline line-clamp-1 text-xs whitespace-nowrap"
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {link}
                        </a>
                        <button
                            type="button"
                            className="w-1/12 text-red-600 text-sm"
                            onClick={() => {
                                removeSelectedLink(index);
                            }}
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
