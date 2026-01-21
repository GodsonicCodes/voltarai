import { Button } from '@/components/ui/FormButton';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function SuccessScreen() {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-10 gap-6 text-center"
        >
            <div className="w-24 h-24 mb-4  text-gray-600">
                {/* Custom double checkmark icon approximating the design */}
                {/* <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 50 L40 70 L80 30" className="text-gray-600" />
                    <path d="M35 50 L50 65 L90 25" className="text-gray-600 opacity-50" transform="translate(10, -10)" />
                </svg> */}
                {/* tick */}
                <Image src="/assets/done_all.svg" alt="Success Tick" width={100} height={100} className="w-full h-full object-contain" />
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Application Submitted</h2>
                <p className="text-sm text-gray-500 max-w-[280px] mx-auto leading-relaxed">
                    Thanks, we have received your request.
                    Our team will contact you within 24-48 hours
                </p>
            </div>

            <div className="pt-8 w-full">
                <Button className="w-full" onClick={() => router.push('/')}>
                    Done
                </Button>
            </div>
        </motion.div>
    );
}
