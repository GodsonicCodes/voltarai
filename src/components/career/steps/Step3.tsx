import { Button } from '@/components/ui/FormButton';
import { motion } from 'framer-motion';
import { Upload, X, FileText } from 'lucide-react';
import { useState } from 'react';
import { Step3Props } from '../types';

export default function Step3({ data, updateData, onSubmit, errors: parentErrors }: Step3Props) {
    const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateData({ [e.target.name]: e.target.value });
        if (localErrors[e.target.name]) {
            setLocalErrors((prev) => ({ ...prev, [e.target.name]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const maxSize = 10 * 1024 * 1024; // 10MB

            if (file.size > maxSize) {
                setLocalErrors((prev) => ({ ...prev, [e.target.name]: 'File size must be less than 10MB' }));
                return;
            }

            updateData({ [e.target.name]: file });
            if (localErrors[e.target.name]) {
                setLocalErrors((prev) => ({ ...prev, [e.target.name]: '' }));
            }
        }
    };

    const removeFile = (name: string) => {
        updateData({ [name]: null });
        if (localErrors[name]) {
            setLocalErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async () => {
        // Basic validation logic
        const newErrors: { [key: string]: string } = {};
        if (!data.whyJoin) newErrors.whyJoin = 'Please tell us why you want to join';
        if (!data.cv_resume) newErrors.cv_resume = 'CV/Resume is required';

        setLocalErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            try {
                await onSubmit();
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
        >
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-gray-900">Final Submission</h2>
                <p className="text-sm text-gray-500">Attach relevant files for review</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CV/Resume Upload */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-900">Attach CV/Resume</label>
                    <div className="relative">
                        <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 gap-2 cursor-pointer hover:bg-gray-100 transition-colors h-40 ${localErrors.cv_resume || parentErrors.cv_resume ? 'border-red-500' : 'border-gray-200'}`}>
                            <input
                                type="file"
                                className="hidden"
                                name="cv_resume"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                            />
                            {data.cv_resume ? (
                                <>
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <FileText className="text-green-600 w-5 h-5" />
                                    </div>
                                    <span className="text-sm text-gray-900 font-medium text-center px-2 line-clamp-1">
                                        {data.cv_resume.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {(data.cv_resume.size / (1024 * 1024)).toFixed(2)} MB
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <Upload className="text-gray-500 w-5 h-5" />
                                    </div>
                                    <span className="text-sm text-gray-400 text-center px-2">
                                        Upload file
                                    </span>
                                </>
                            )}
                        </label>
                        {data.cv_resume && (
                            <button
                                type="button"
                                onClick={() => removeFile('cv_resume')}
                                className="absolute top-2 right-2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    {(localErrors.cv_resume || parentErrors.cv_resume) && <span className="text-xs text-red-500">{localErrors.cv_resume || parentErrors.cv_resume}</span>}
                </div>

                {/* Cover Letter Upload */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-900">Attach Cover Letter <span className="text-gray-400 font-normal">(optional)</span></label>
                    <div className="relative">
                        <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 gap-2 cursor-pointer hover:bg-gray-100 transition-colors h-40 ${localErrors.cover_letter || parentErrors.cover_letter ? 'border-red-500' : 'border-gray-200'}`}>
                            <input
                                type="file"
                                className="hidden"
                                name="cover_letter"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                            />
                            {data.cover_letter ? (
                                <>
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <FileText className="text-green-600 w-5 h-5" />
                                    </div>
                                    <span className="text-sm text-gray-900 font-medium text-center px-2 line-clamp-1">
                                        {data.cover_letter.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {(data.cover_letter.size / (1024 * 1024)).toFixed(2)} MB
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <Upload className="text-gray-500 w-5 h-5" />
                                    </div>
                                    <span className="text-sm text-gray-400 text-center px-2">
                                        Upload file
                                    </span>
                                </>
                            )}
                        </label>
                        {data.cover_letter && (
                            <button
                                type="button"
                                onClick={() => removeFile('cover_letter')}
                                className="absolute top-2 right-2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    {(localErrors.cover_letter || parentErrors.cover_letter) && <span className="text-xs text-red-500">{localErrors.cover_letter || parentErrors.cover_letter}</span>}
                </div>
            </div>


            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-900">Why do you want to work at Voltar AI?</label>
                <textarea
                    className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-1 min-h-[120px] resize-none transition-colors ${localErrors.whyJoin || parentErrors.whyJoin
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-black focus:ring-black"
                        }`}
                    placeholder="tell us why you want to work with us"
                    name="whyJoin"
                    value={data.whyJoin || ''}
                    onChange={handleChange}
                />
                {(localErrors.whyJoin || parentErrors.whyJoin) && <span className="text-xs text-red-500">{localErrors.whyJoin || parentErrors.whyJoin}</span>}
            </div>

            {parentErrors.form && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center">
                    {parentErrors.form}
                </div>
            )}

            <div className="pt-4">
                <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
            </div>
        </motion.div>
    );
}
