import CareerForm from "@/components/career/CareerForm";
import Image from "next/image";
import Link from "next/link";
import desktopLogo from "@/../public/assets/logo/logodesktop.svg";
import mobileLogo from "@/../public/assets/logo/logomobile.svg";

export const metadata = {
    title: "Careers | Voltar AI",
    description: "Join our team to build the future of AI automation.",
};

export default function CareerPage() {
    return (
        <div className="w-full min-h-screen bg-bgBlack font-sans flex flex-col relative overflow-hidden">
            {/* ── Background grid pattern ─────────────────────────────────── */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: "48px 48px",
                }}
            />

            {/* ── Ambient glow orbs ───────────────────────────────────────── */}
            <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

            {/* ── Logo / Top nav ──────────────────────────────────────────── */}
            <header className="relative z-10 w-full px-6 py-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <Image
                            src={desktopLogo}
                            alt="Voltar AI Logo"
                            className="hidden sm:block h-8 w-auto"
                        />
                        <Image
                            src={mobileLogo}
                            alt="Voltar AI Logo"
                            className="sm:hidden h-8 w-auto"
                        />
                    </Link>
                    <Link
                        href="/"
                        className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </header>

            {/* ── Form card ───────────────────────────────────────────────── */}
            <main className="relative z-10 flex-1 flex items-start justify-center px-4 py-10 sm:py-16">
                <CareerForm />
            </main>
        </div>
    );
}
