import { useState } from "react";
import api from "../lib/api";

const UploadPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setError("Please choose a file before uploading.");
            setSuccess("");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            setIsUploading(true);
            setError("");
            setSuccess("");

            await api.post("/file", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccess("File uploaded successfully.");
            setSelectedFile(null);
        } catch (uploadError) {
            console.error("Upload failed:", uploadError);
            setError("Unable to upload file.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <main className="px-6 py-10 md:px-10">
            <section className="mx-auto max-w-3xl">
                <header className="mb-8">
                    <h1 className="text-4xl font-semibold tracking-tight">Upload</h1>
                    <p className="mt-3 text-sm text-(--foreground-secondary)">
                        Add a file to your storage and access it from the Files tab.
                    </p>
                </header>

                <form
                    onSubmit={handleUpload}
                    className="rounded-lg border border-(--border) bg-(--surface) p-6"
                >
                    <label
                        htmlFor="file"
                        className="mb-2 block text-sm font-medium text-(--foreground-secondary)"
                    >
                        Select File
                    </label>

                    <input
                        id="file"
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                        className="
                        w-full
                        rounded-sm
                        border
                        border-(--border)
                        bg-(--background-secondary)
                        p-2.5
                        text-sm
                        file:mr-3
                        file:rounded-sm
                        file:border-0
                        file:bg-(--primary)
                        file:px-3
                        file:py-1.5
                        file:text-(--primary-foreground)
                    "
                    />

                    {error && (
                        <p className="mt-3 text-sm text-(--destructive)">{error}</p>
                    )}

                    {success && (
                        <p className="mt-3 text-sm text-(--success)">{success}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isUploading}
                        className="
                        mt-5
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
                        disabled:opacity-60
                    "
                    >
                        {isUploading ? "Uploading..." : "Upload File"}
                    </button>
                </form>
            </section>
        </main>
    );
};

export default UploadPage;