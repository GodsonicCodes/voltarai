"use client";

import Image from "next/image";
import Link from "next/link";
import { Button as FormButton } from "@/components/ui/FormButton";

export default function SuccessScreen() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
            <div className="w-20 h-20 mb-4">
                <Image
                    src="/assets/done_all.svg"
                    alt="Success"
                    width={80}
                    height={80}
                    className="w-full h-full"
                />
            </div>
            
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Request Submitted!</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                    Thank you for your interest in AI training with Voltar AI. Our team will review your requirements and get back to you shortly to discuss a tailored curriculum.
                </p>
            </div>

            <div className="pt-8">
                <Link href="/">
                    <FormButton>Return to Home</FormButton>
                </Link>
            </div>
        </div>
    );
}
