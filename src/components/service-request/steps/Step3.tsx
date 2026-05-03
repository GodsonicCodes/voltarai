import { Select } from '@/components/ui/FormSelect';
import { Button } from '@/components/ui/FormButton';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Step3Props } from '../types';

export default function Step3({ data, updateData, onSubmit, onBack, errors: parentErrors }: Step3Props) {
    const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
                setLocalErrors((prev) => ({ ...prev, supportingDocuments: 'File size must be less than 10MB' }));
                return;
            }

            updateData({ supportingDocuments: file });
            if (localErrors.supportingDocuments) {
                setLocalErrors((prev) => ({ ...prev, supportingDocuments: '' }));
            }
        }
    };

    const removeFile = () => {
        updateData({ supportingDocuments: null });
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!data.preferredCommunication) newErrors.preferredCommunication = 'Preferred communication method is required';
        if (!data.howDidYouHearAboutUs) newErrors.howDidYouHearAboutUs = 'This field is required';

        setLocalErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            await onSubmit();
        } finally {
            setIsSubmitting(false);
        }
    };

    const getError = (field: string) => localErrors[field] || parentErrors[field] || '';

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
        >
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-gray-900">Additional Options</h2>
                <p className="text-sm text-gray-500">Final Touches</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                    label="Preferred Communication Method"
                    placeholder="Select communication method"
                    name="preferredCommunication"
                    value={data.preferredCommunication || ''}
                    onChange={handleChange}
                    error={getError('preferredCommunication')}
                    options={[
                        { label: 'Email', value: 'email' },
                        { label: 'Phone', value: 'phone' },
                        { label: 'Video Call', value: 'video_call' },
                        { label: 'In Person', value: 'in_person' },
                        { label: 'WhatsApp', value: 'whatsapp' },
                        { label: 'LinkedIn', value: 'linkedin' },
                    ]}
                />

                <Select
                    label="How did you hear about us?"
                    placeholder="Select how you found us"
                    name="howDidYouHearAboutUs"
                    value={data.howDidYouHearAboutUs || ''}
                    onChange={handleChange}
                    error={getError('howDidYouHearAboutUs')}
                    options={[
                        { label: 'WhatsApp', value: 'whatsApp' },
                        { label: 'Google', value: 'google_search' },
                        { label: 'LinkedIn', value: 'linkedin' },
                        { label: 'Website', value: 'website' },
                        { label: 'Referral', value: 'referral' },
                        { label: 'Social Media', value: 'social_media' },
                        { label: 'Other', value: 'other' },
                    ]}
                />
            </div>

            {/* Supporting Documents Upload */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-900">
                    Attach Supporting Documents <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                    <label
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 gap-2 cursor-pointer hover:bg-gray-100 transition-colors h-40 ${getError('supportingDocuments') ? 'border-red-500' : 'border-gray-200'
                            }`}
                    >
                        <input
                            type="file"
                            className="hidden"
                            name="supportingDocuments"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                        />
                        {data.supportingDocuments ? (
                            <>
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <FileText className="text-green-600 w-5 h-5" />
                                </div>
                                <span className="text-sm text-gray-900 font-medium text-center px-2 line-clamp-1">
                                    {data.supportingDocuments.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {(data.supportingDocuments.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                            </>
                        ) : (
                            <>
                                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <Upload className="text-gray-500 w-5 h-5" />
                                </div>
                                <span className="text-sm text-gray-400 text-center px-2">Upload file</span>
                                <span className="text-xs text-gray-400">PDF, DOC, DOCX, TXT, JPG, PNG up to 10MB</span>
                            </>
                        )}
                    </label>
                    {data.supportingDocuments && (
                        <button
                            type="button"
                            onClick={removeFile}
                            className="absolute top-2 right-2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
                {getError('supportingDocuments') && (
                    <span className="text-xs text-red-500">{getError('supportingDocuments')}</span>
                )}
            </div>

            {parentErrors.form && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center">
                    {parentErrors.form}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4">
                <Button variant="secondary" onClick={onBack}>
                    Back
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
            </div>
        </motion.div>
    );
}
