"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface FormRendererProps {
    html: string;
    onSubmit?: (formData: FormData) => void;
    className?: string;
}

const FormRenderer: React.FC<FormRendererProps> = ({ 
    html, 
    onSubmit, 
    className = "" 
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Basic HTML sanitization function (production should use DOMPurify)
    const sanitizeHTML = (html: string): string => {
        // Remove script tags and dangerous attributes
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+="[^"]*"/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/vbscript:/gi, '')
            .replace(/data:/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
            .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const cleanHTML = sanitizeHTML(html);
        
        // Set the HTML content
        container.innerHTML = cleanHTML;

        // Find forms and handle submission
        const forms = container.querySelectorAll('form');
        forms.forEach((form) => {
            const handleSubmit = (e: Event) => {
                e.preventDefault();
                if (onSubmit) {
                    const formData = new FormData(form as HTMLFormElement);
                    onSubmit(formData);
                }
            };
            
            form.addEventListener('submit', handleSubmit);
            
            // Store event listener for cleanup
            (form as any)._formSubmitHandler = handleSubmit;
        });

        // Cleanup function
        return () => {
            forms.forEach((form) => {
                const handler = (form as any)._formSubmitHandler;
                if (handler) {
                    form.removeEventListener('submit', handler);
                }
            });
        };
    }, [html, onSubmit]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`form-renderer ${className}`}
            style={{ backgroundColor: 'transparent' }}
        >
            <div 
                ref={containerRef} 
                className="backend-form-wrapper"
                style={{ 
                    minHeight: '100px',
                    backgroundColor: 'transparent'
                }}
            />
        </motion.div>
    );
};

export default FormRenderer;