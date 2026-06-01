import { useState } from "react";

const formatDate = (value) => {
    if (!value) return "Unknown";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
    }).format(date);
};

const getFileType = (fileName = "") => {
    const extension = fileName.split(".").pop()?.toUpperCase();

    if (!extension) return "FILE";

    return extension.length > 4 ? "FILE" : extension;
};

const Card = ({ fileMeta, onDownload, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const sizeInBytes = Number(fileMeta?.size ?? 0);
    const sizeDisplay =
        sizeInBytes < 1024 * 1024
            ? `${(sizeInBytes / 1024).toFixed(0)} KB`
            : `${(sizeInBytes / (1024 * 1024)).toFixed(0)} MB`;

    const handleDownload = () => {
        onDownload(fileMeta?.id, fileMeta?.fileName);
    };

    const handleDelete = async () => {
        const shouldDelete = window.confirm(
            `Delete ${fileMeta?.fileName ?? "this file"}?`,
        );

        if (!shouldDelete) return;

        try {
            setIsDeleting(true);

            await onDelete(fileMeta?.id);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <article
            className="
            group
            relative
            overflow-hidden
            rounded-sm
            border
            border-(--border)
            bg-(--surface)
            transition-all
            hover:scale-[1.01]
            duration-300
            hover:border-(--border-hover)
            hover:bg-(--surface-hover)
            hover:shadow-(--shadow-md)
        "
        >
            <div className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                    <h2
                        className="
                        min-h-14
                        line-clamp-2
                        text-lg
                        font-semibold
                        leading-7
                        text-(--foreground)
                    "
                    >
                        {fileMeta?.fileName ?? "Untitled File"}
                    </h2>

                    <div
                        className="
                        shrink-0
                        rounded-sm
                        border
                        border-(--border)
                        bg-(--background-secondary)
                        px-3
                        py-1
                    "
                    >
                        <span
                            className="
                            font-mono
                            text-xs
                            tracking-wider
                            text-(--primary)
                        "
                        >
                            {getFileType(fileMeta?.fileName)}
                        </span>
                    </div>
                </div>

                <div className="mt-4 flex flex-1 flex-wrap items-end justify-between">
                    <span
                        className="
                        py-1
                        text-xs
                        font-medium
                        text-(--foreground-secondary)
                    "
                    >
                        Size : {sizeDisplay}
                    </span>

                    <span
                        className="
                        py-1
                        text-xs
                        font-medium
                        text-(--foreground-secondary)
                    "
                    >
                        ↓ {fileMeta?.downloadCount ?? 0}
                    </span>
                </div>

                <div
                    className="
                    mt-3
                    border-b
                    border-(--border)
                    pt-4
                    pb-3
                "
                >
                    <p
                        className="
                        text-sm
                        text-(--foreground-secondary)
                    "
                    >
                        {formatDate(fileMeta?.uploadedAt)}
                    </p>
                </div>

                <div className="mt-6 flex gap-2">
                    <button
                        onClick={handleDownload}
                        className="
                        flex-1
                        rounded-sm
                        bg-(--primary)
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-(--primary-foreground)
                        transition-all
                        duration-200
                        hover:bg-(--primary-hover)
                        hover: cursor-pointer
                        active:scale-[0.98]
                    "
                    >
                        Download
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        aria-label="Delete file"
                        className="
                        flex
                        h-10.5
                        w-10.5
                        items-center
                        justify-center
                        rounded-sm
                        border
                        border-(--border)
                        bg-(--background-secondary)
                        text-(--foreground-secondary)
                        transition-all
                        duration-200
                        hover:border-(--destructive)
                        hover:bg-(--background-secondary)
                        active:scale-[0.95]
                        disabled:opacity-50
                    "
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-red-400 stroke-current"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                        </svg>
                    </button>
                </div>
            </div>
        </article>
    );
};

export default Card;
