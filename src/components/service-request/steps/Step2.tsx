import { Select } from '@/components/ui/FormSelect';
import { Button } from '@/components/ui/FormButton';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Step2Props } from '../types';

export default function Step2({ data, updateData, onNext, onBack, errors: parentErrors }: Step2Props) {
    const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
        updateData({ [e.target.name]: e.target.value });
        if (localErrors[e.target.name]) {
            setLocalErrors((prev) => ({ ...prev, [e.target.name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!data.serviceType) newErrors.serviceType = 'Service type is required';
        if (!data.preferredTimeline) newErrors.preferredTimeline = 'Preferred timeline is required';
        if (!data.budgetRange) newErrors.budgetRange = 'Budget range is required';
        if (!data.projectGoal || data.projectGoal.length < 10)
            newErrors.projectGoal = 'Project goal must be at least 10 characters';
        if (!data.currentChallenges || data.currentChallenges.length < 10)
            newErrors.currentChallenges = 'Current challenges must be at least 10 characters';

        setLocalErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            onNext();
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
                <h2 className="text-xl font-bold text-gray-900">Service Details</h2>
                <p className="text-sm text-gray-500">Let&apos;s talk solutions which shape your service</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                    label="Service Type Needed"
                    placeholder="Select service type"
                    name="serviceType"
                    value={data.serviceType || ''}
                    onChange={handleChange}
                    error={getError('serviceType')}
                    options={[
                        { label: 'Process Automation', value: 'process_automation' },
                        { label: 'Customer Service Automation', value: 'customer_service_automation' },
                        { label: 'Sales and Lead Generation', value: 'sales_and_lead_generation' },
                        { label: 'Custom AI Automation Solution', value: 'custom_ai_automation_solution' },
                    ]}
                />

                <Select
                    label="Preferred Timeline"
                    placeholder="Select timeline"
                    name="preferredTimeline"
                    value={data.preferredTimeline || ''}
                    onChange={handleChange}
                    error={getError('preferredTimeline')}
                    options={[
                        { label: 'Within 1 month', value: 'within_1_month' },
                        { label: '1-3 months', value: '1_3_months' },
                        { label: '3-6 months', value: '3_6_months' },
                        { label: '6-12 months', value: '6_12_months' },
                        { label: 'Over 1 year', value: 'over_1_year' },
                        { label: 'Flexible timeline', value: 'flexible' },
                    ]}
                />
            </div>

            <Select
                label="Budget Range"
                placeholder="Select your preferred budget range"
                name="budgetRange"
                value={data.budgetRange || ''}
                onChange={handleChange}
                error={getError('budgetRange')}
                options={[
                    { label: 'Under $5K', value: 'under_5k' },
                    { label: '$5K - $15K', value: '5k_15k' },
                    { label: '$15K - $30K', value: '15k_30k' },
                    { label: '$30K - $50K', value: '30k_50k' },
                    { label: '$50K - $100K', value: '50k_100k' },
                    { label: '$100K+', value: '100k_plus' },
                    { label: 'Prefer to discuss', value: 'discuss' },
                ]}
            />

            {/* Project Goal */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-900">Project Goal/Objective</label>
                <textarea
                    className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-1 min-h-[100px] resize-none transition-colors ${getError('projectGoal')
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-black focus:ring-black'
                        }`}
                    placeholder="e.g., automate our lead follow-up emails"
                    name="projectGoal"
                    value={data.projectGoal || ''}
                    onChange={handleChange}
                />
                {getError('projectGoal') && <span className="text-xs text-red-500">{getError('projectGoal')}</span>}
            </div>

            {/* Current Challenges */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-900">Current Challenges</label>
                <textarea
                    className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-1 min-h-[100px] resize-none transition-colors ${getError('currentChallenges')
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-black focus:ring-black'
                        }`}
                    placeholder="Tell us the challenges you are facing"
                    name="currentChallenges"
                    value={data.currentChallenges || ''}
                    onChange={handleChange}
                />
                {getError('currentChallenges') && <span className="text-xs text-red-500">{getError('currentChallenges')}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
                <Button variant="secondary" onClick={onBack}>
                    Back
                </Button>
                <Button onClick={handleNext}>Next</Button>
            </div>
        </motion.div>
    );
}
