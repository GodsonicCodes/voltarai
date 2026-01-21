import { Select } from '@/components/ui/FormSelect';
import { Button } from '@/components/ui/FormButton';
import { Input } from '@/components/ui/FormInput';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Step2Props } from '../types';

export default function Step2({ data, updateData, onNext, onBack, errors: parentErrors }: Step2Props) {
    const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        updateData({ [e.target.name]: e.target.value });
        if (localErrors[e.target.name]) {
            setLocalErrors((prev) => ({ ...prev, [e.target.name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!data.position) newErrors.position = 'Position is required';
        if (!data.employmentType) newErrors.employmentType = 'Employment type is required';
        if (!data.workPreference) newErrors.workPreference = 'Work preference is required';

        setLocalErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            onNext();
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
                <h2 className="text-lg font-bold text-gray-900">Role Information</h2>
                <p className="text-sm text-gray-500">Help us understand where you fit best</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                    label="Position Applying For"
                    placeholder="Backend Engineer"
                    name="position"
                    value={data.position || ''}
                    onChange={handleChange}
                    error={localErrors.position || parentErrors.position}
                    options={[
                        { label: 'Backend Engineer', value: 'Backend Engineer' },
                        { label: 'Frontend Engineer', value: 'Frontend Engineer' },
                        { label: 'Full Stack Engineer', value: 'Full Stack Engineer' },
                        { label: 'Product Designer', value: 'Product Designer' },
                    ]}
                />

                <Select
                    label="Employment Type"
                    placeholder="Internship"
                    name="employmentType"
                    value={data.employmentType || ''}
                    onChange={handleChange}
                    error={localErrors.employmentType || parentErrors.employmentType}
                    options={[
                        { label: 'Internship', value: 'Internship' },
                        { label: 'Full-time', value: 'Full-time' },
                        { label: 'Part-time', value: 'Part-time' },
                        { label: 'Contract', value: 'Contract' },
                    ]}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Portfolio Website"
                    placeholder="e.g., https://johndoedribbble.com"
                    name="portfolio"
                    value={data.portfolio || ''}
                    onChange={handleChange}
                    error={localErrors.portfolio || parentErrors.portfolio}
                />

                <Select
                    label="Work Preferences"
                    placeholder="On-Site"
                    name="workPreference"
                    value={data.workPreference || ''}
                    onChange={handleChange}
                    error={localErrors.workPreference || parentErrors.workPreference}
                    options={[
                        { label: 'On-Site', value: 'On-Site' },
                        { label: 'Remote', value: 'Remote' },
                        { label: 'Hybrid', value: 'Hybrid' },
                    ]}
                />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
                <Button variant="secondary" onClick={onBack}>
                    Back
                </Button>
                <Button onClick={handleNext}>
                    Next
                </Button>
            </div>
        </motion.div>
    );
}
