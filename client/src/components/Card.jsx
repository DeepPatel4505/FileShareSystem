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

    const sizeInMb = Number(fileMeta?.size ?? 0) / (1024 * 1024);

    const handleDownload = () => {
        onDownload(
            fileMeta?.id,
            fileMeta?.originalFileName,
            fileMeta?.mimeType,
        );
    };

    const handleDelete = async () => {
        const shouldDelete = window.confirm(
            `Delete ${fileMeta?.originalFileName ?? "this file"}?`,
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
            duration-300
            hover:-translate-y-1
            hover:border-(--border-hover)
            hover:bg-(--surface-hover)
            hover:shadow-(--shadow-md)
        "
        >
            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <h2
                        className="
                        line-clamp-2
                        text-lg
                        font-semibold
                        leading-7
                        text-(--foreground)
                    "
                    >
                        {fileMeta?.originalFileName ?? "Untitled File"}
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
                            {getFileType(fileMeta?.originalFileName)}
                        </span>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <span
                        className="
                        rounded-full
                        bg-(--background-secondary)
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-(--foreground-secondary)
                    "
                    >
                        {sizeInMb.toFixed(2)} MB
                    </span>

                    <span
                        className="
                        rounded-full
                        bg-(--background-secondary)
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-(--primary)
                    "
                    >
                        ↓ {fileMeta?.downloadCount ?? 0}
                    </span>
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
                        h-[42px]
                        w-[42px]
                        items-center
                        justify-center
                        rounded-sm
                        border
                        border-(--border)
                        bg-(--background-secondary)
                        text-(--foreground-muted)
                        transition-all
                        duration-200
                        hover:border-(--destructive)
                        hover:bg-(--destructive)
                        hover:text-white
                        active:scale-[0.95]
                        disabled:opacity-50
                    "
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
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

                <div
                    className="
                    mt-6
                    border-t
                    border-(--border)
                    pt-4
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
            </div>
        </article>
    );
};

export default Card;
