import { Input } from '@/components/ui/FormInput';
import { Button } from '@/components/ui/FormButton';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Step1Props } from '../types';

export default function Step1({ data, updateData, onNext, errors: parentErrors }: Step1Props) {
    const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateData({ [e.target.name]: e.target.value });
        if (localErrors[e.target.name]) {
            setLocalErrors((prev) => ({ ...prev, [e.target.name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!data.fullName) newErrors.fullName = 'Full Name is required';
        if (!data.email) newErrors.email = 'Email Address is required';
        else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = 'Email is invalid';
        if (!data.phone) newErrors.phone = 'Phone number is required';
        if (!data.location) newErrors.location = 'Location is required';

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
            <div className="flex flex-col gap-1 mb-2">
                <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                <p className="text-sm text-gray-500">We’d love to know you</p>
            </div>

            <Input
                label="Full Name"
                placeholder="John Doe"
                name="fullName"
                value={data.fullName || ''}
                onChange={handleChange}
                error={localErrors.fullName || parentErrors.fullName}
            />

            <Input
                label="Email Address"
                type="email"
                placeholder="johndoe@gmail.com"
                name="email"
                value={data.email || ''}
                onChange={handleChange}
                error={localErrors.email || parentErrors.email}
            />

            <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-gray-900">Phone</label>
                <div className="flex gap-3">
                    <div className="relative w-[140px] shrink-0">
                        <select
                            name="countryCode"
                            value={data.countryCode}
                            onChange={(e) => updateData({ countryCode: e.target.value })}
                            className="w-full h-12 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                        >
                            <option value="+233">GH +233</option>
                            <option value="+234">NG +234</option>
                            <option value="+1">US +1</option>
                            <option value="+44">UK +44</option>
                            <option value="+1">CA +1</option>
                            <option value="+49">DE +49</option>
                            <option value="+33">FR +33</option>
                            <option value="+91">IN +91</option>
                            <option value="+27">ZA +27</option>
                            <option value="+254">KE +254</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down text-gray-400"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>
                    <div className="flex-1">
                        <input
                            type="tel"
                            placeholder="551842512"
                            name="phone"
                            value={data.phone || ''}
                            onChange={handleChange}
                            className={`flex h-12 w-full rounded-lg border bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-1 transition-colors ${localErrors.phone || parentErrors.phone
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:border-black focus:ring-black"
                                }`}
                        />
                    </div>
                </div>
                {(localErrors.phone || parentErrors.phone) && <span className="text-xs text-red-500">{localErrors.phone || parentErrors.phone}</span>}
            </div>

            <Input
                label="Location"
                placeholder="Accra, Ghana"
                name="location"
                value={data.location || ''}
                onChange={handleChange}
                error={localErrors.location || parentErrors.location}
            />

            <div className="pt-4">
                <Button onClick={handleNext} className="w-full bg-[#1C1C1C] hover:bg-[#2C2C2C] text-white h-12 rounded-xl text-base font-medium">
                    Next
                </Button>
            </div>
        </motion.div>
    );
}
