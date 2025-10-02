"use client";
import React, {useEffect, useState} from "react";
import {ChevronDown} from "lucide-react";
import {cn} from "@/lib/utils";

export interface PhoneInputProps {
    countryCode: string;
    setCountryCode: (value: string) => void;
    phoneNumber: string;
    setPhoneNumber: (value: string) => void;
    countryCodeError?: string;
    phoneNumberError?: string;
    className?: string;
}

import countryOptions from "@/data/country_phone_codes";
import { defaultSelector } from "@/utils/autoSelectCountry";

const PhoneInput: React.FC<PhoneInputProps> = ({countryCode, setCountryCode, phoneNumber, setPhoneNumber, countryCodeError, phoneNumberError, className}) => {
    const hasError = countryCodeError || phoneNumberError;

    const [country, setCountry] = useState(countryCode);

    // Auto-select user's country on component mount
    useEffect(() => {
        const setDefaultCountry = async () => {
            try {
                const defaultCountry = await defaultSelector();
                if (defaultCountry && !country) {
                    // Only set if no country is already selected
                    setCountry(defaultCountry.label);
                    setCountryCode(defaultCountry.value);
                }
            } catch (error) {
                console.error("Error setting default country:", error);
            }
        };

        setDefaultCountry();
    }, []); // Empty dependency array - only run once on mount

    useEffect(() => {
        setCountryCode(countryOptions.find((option) => option.label === country)?.value || "");
        // Just country else setCountryCode as dependency will retrigger the useEffect always
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [country]);

    return (
        <div className={cn("w-full", className)}>
            <div className={cn("flex h-10 rounded-md border border-gray-300 bg-white focus-within:border-black", hasError && "border-red-500 focus-within:border-red-500")}>
                {/* Country Code Select */}
                <div className="relative w-24 border-r border-gray-300">
                    <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className={cn(
                            "flex h-full w-full text-black appearance-none bg-transparent px-3 py-2 pr-8 text-xs focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                            countryCodeError && "text-red-500"
                        )}
                    >
                        <option value={""} disabled>
                            Select country
                        </option>
                        {countryOptions.map((option) => (
                            <option key={option.label} className="text-black" value={option.label}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                </div>

                {/* Phone Number Input */}
                <div className="flex-1">
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Phone number"
                        className={cn(
                            "flex h-full text-black w-full bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-500",
                            phoneNumberError && "text-red-500"
                        )}
                    />
                </div>
            </div>
            {countryCodeError && <p className="mt-1 text-sm text-destructive">{countryCodeError}</p>}
            {phoneNumberError && <p className="mt-1 text-sm text-destructive">{phoneNumberError}</p>}
        </div>
    );
};

export default PhoneInput;
