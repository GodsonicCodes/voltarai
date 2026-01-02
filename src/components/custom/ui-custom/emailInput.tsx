"use client";
import { useState, useEffect } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { submitEmail } from "@/actions/email.api";
import { emailSchema } from "@/schema/email.schema";

const EmailInput = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [submissionError, setSubmissionError] = useState("");

  // Cleanup loading state on unmount
  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || isLoading) return;

    // Clear previous errors
    setValidationError("");
    setSubmissionError("");

    // Validate with Joi schema
    const { error } = emailSchema.validate({ email });
    if (error) {
      setValidationError(error.message);
      return;
    }

    setIsLoading(true);
    setIsSuccess(false);

    try {
      // Check network connectivity first
      if (!navigator.onLine) {
        setSubmissionError("No internet connection. Please check your network and try again.");
        setIsLoading(false);
        return;
      }

      const result = await submitEmail(email);

      if (result && result.success) {
        setIsSuccess(true);
        setEmail("");
        // Reset success state after 2 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 2000);
      } else {
        // Show specific API error message
        setSubmissionError(result?.message || "Failed to submit email. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting email:", error);

      // Handle different types of errors
      if (!navigator.onLine) {
        setSubmissionError("No internet connection. Please check your network and try again.");
      } else if (error instanceof TypeError) {
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          setSubmissionError("Unable to connect to the server. Please check if the backend server is running.");
        } else {
          setSubmissionError("Network connection failed. Please check your internet and try again.");
        }
      } else if (error instanceof Error) {
        setSubmissionError(error.message || "An error occurred while submitting. Please try again.");
      } else {
        setSubmissionError("An unexpected error occurred. Please try again.");
      }
    } finally {
      // Always ensure loading state is reset
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear errors when user starts typing
    if (validationError) {
      setValidationError("");
    }
    if (submissionError) {
      setSubmissionError("");
    }
  };

  return (
    <div className="relative w-full max-w-[300px] md:max-w-[380px]">
      <form onSubmit={handleSubmit} noValidate>
        {/* Input Container */}
        <div className="relative w-full">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your Email"
            aria-label="Email address"
            disabled={isLoading}
            className={`bglineargradient text-[#E5E5E7]/80 border placeholder:text-[#E5E5E7]/60
                       font-normal px-4 pr-10 md:pr-12 text-xs md:text-base
                       rounded-[56px] w-full h-[40px] md:h-[52px]
                       cursor-text caret-[#E5E5E7]/80 outline-none transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed ${
              validationError || submissionError
                ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10 shadow-lg shadow-red-500/20"
                : "border-white/20 focus:border-blue-500/50 focus:ring-blue-500/10"
            }`}
          />

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className={`absolute right-1 lg:right-2 top-1/2 -translate-y-1/2
                       w-8 h-8 md:w-10 md:h-10
                       flex items-center justify-center
                       rounded-full shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500/20 group
                       transition-all duration-300 ${
              isSuccess
                ? "bg-green-500 hover:bg-green-400"
                : isLoading
                ? "bg-blue-500 hover:bg-blue-400"
                : "bg-blue-600 hover:bg-blue-500 active:bg-blue-700"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-white animate-spin" />
            ) : isSuccess ? (
              <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />
            ) : (
              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white transition-transform duration-200 group-hover:translate-x-[1px]" />
            )}
          </button>
        </div>

        {/* Success Message - Always reserve space to prevent layout shift when switching between error and success states */}
        <div className="min-h-[20px] flex items-start">
          {isSuccess && (
            <p className="text-green-400 text-xs animate-in fade-in slide-in-from-top-1 duration-300">
              Our team will get back to you soon
            </p>
          )}
        </div>

        {/* Error Messages - Always reserve space to prevent layout shift */}
        <div className="min-h-[20px] flex items-start">
          {(validationError || submissionError) && (
            <p className="text-red-400 text-xs animate-in fade-in slide-in-from-top-1 duration-300">
              {validationError || submissionError}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default EmailInput;