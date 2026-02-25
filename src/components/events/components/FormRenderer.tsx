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

    // Handle phone number combination
    const combinePhoneNumber = (formData: FormData): FormData => {
        const countryCode = formData.get('country_code') as string;
        const phoneNumber = formData.get('phone') as string;
        
        if (countryCode && phoneNumber) {
            // Remove country_code and phone fields, add combined phone
            formData.delete('country_code');
            formData.delete('phone');
            formData.set('phone', `${countryCode}${phoneNumber}`);
        }
        
        return formData;
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const cleanHTML = sanitizeHTML(html);
        
        // Set the HTML content
        container.innerHTML = cleanHTML;

        // Add custom styles for phone fields
        const style = document.createElement('style');
        style.textContent = `
            .backend-form-wrapper select[name="country_code"],
            .backend-form select[name="country_code"],
            .form-row select[name="country_code"],
            select[name="country_code"] {
                width: 40px !important;
                min-width: 40px !important;
                max-width: 40px !important;
                flex-shrink: 0 !important;
                flex-basis: 40px !important;
                box-sizing: border-box !important;
                padding: 4px !important;
                font-size: 12px !important;
            }
            .backend-form-wrapper input[name="phone"],
            .backend-form input[name="phone"],
            .form-row input[name="phone"],
            input[name="phone"] {
                flex: 1 !important;
                min-width: 200px !important;
                flex-grow: 1 !important;
            }
            .backend-form-wrapper .form-row:has(select[name="country_code"]),
            .backend-form .form-row:has(select[name="country_code"]),
            .form-row:has(select[name="country_code"]) {
                display: flex !important;
                gap: 8px !important;
                align-items: center !important;
                width: 100% !important;
            }
        `;
        document.head.appendChild(style);

        // Find forms and handle submission
        const forms = container.querySelectorAll('form');
        forms.forEach((form) => {
            const handleSubmit = (e: Event) => {
                e.preventDefault();
                if (onSubmit) {
                    const formData = new FormData(form as HTMLFormElement);
                    const combinedFormData = combinePhoneNumber(formData);
                    onSubmit(combinedFormData);
                }
            };
            
            form.addEventListener('submit', handleSubmit);
            
            // Store event listener for cleanup
            (form as HTMLFormElement & { _formSubmitHandler?: (e: Event) => void })._formSubmitHandler = handleSubmit;
        });

        // Cleanup function
        return () => {
            forms.forEach((form) => {
                const handler = (form as HTMLFormElement & { _formSubmitHandler?: (e: Event) => void })._formSubmitHandler;
                if (handler) {
                    form.removeEventListener('submit', handler);
                }
            });
            // Remove added styles
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
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