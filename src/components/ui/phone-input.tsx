import * as React from "react";
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

const countryOptions = [
    {value: "+233", label: "GH +233"},
    {value: "+1", label: "US +1"},
    {value: "+44", label: "UK +44"},
    {value: "+1", label: "CA +1"},
    {value: "+61", label: "AU +61"},
    {value: "+49", label: "DE +49"},
    {value: "+33", label: "FR +33"},
    {value: "+39", label: "IT +39"},
    {value: "+34", label: "ES +34"},
    {value: "+31", label: "NL +31"},
];

const PhoneInput: React.FC<PhoneInputProps> = ({countryCode, setCountryCode, phoneNumber, setPhoneNumber, countryCodeError, phoneNumberError, className}) => {
    const hasError = countryCodeError || phoneNumberError;

    return (
        <div className={cn("w-full", className)}>
            <div className={cn("flex h-10 rounded-md border border-gray-300 bg-white focus-within:border-black", hasError && "border-red-500 focus-within:border-red-500")}>
                {/* Country Code Select */}
                <div className="relative w-24 border-r border-gray-300">
                    <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className={cn(
                            "flex h-full w-full appearance-none bg-transparent px-3 py-2 pr-8 text-xs focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                            countryCodeError && "text-red-500"
                        )}
                    >
                        <option value="" disabled>
                            Select country
                        </option>
                        {countryOptions.map((option) => (
                            <option key={option.label} value={option.value}>
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
                            "flex h-full w-full bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-500",
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
