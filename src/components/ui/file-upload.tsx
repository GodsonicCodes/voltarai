import * as React from "react";
import {Upload, X} from "lucide-react";
import {cn} from "@/lib/utils";

export interface FileUploadProps {
    value: File | null;
    setValue: (file: File | null) => void;
    error?: string;
    className?: string;
    accept?: string;
    maxSize?: number; // in MB
}

const FileUpload: React.FC<FileUploadProps> = ({
    value,
    setValue,
    error,
    className,
    accept = "*/*",
    maxSize = 10, // 10MB default
}) => {
    const [dragActive, setDragActive] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.size <= maxSize * 1024 * 1024) {
                setValue(file);
            }
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size <= maxSize * 1024 * 1024) {
                setValue(file);
            }
        }
    };

    const removeFile = () => {
        setValue(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className={cn("w-full", className)}>
            <div
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                    dragActive ? "border-gray-400 bg-gray-50" : "border-gray-300 hover:border-gray-400",
                    error && "border-red-500",
                    value && "border-green-500 bg-green-50"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileInput} className="hidden" />

                {value ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">{value.name}</span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile();
                                }}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">{formatFileSize(value.size)}</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Upload file</span>
                            <p className="text-xs text-gray-500">or drag and drop</p>
                            <p className="text-xs text-gray-400">Max {maxSize}MB</p>
                        </div>
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        </div>
    );
};

export default FileUpload;
