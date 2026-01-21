export interface CareerFormData {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    position: string;
    employmentType: string;
    portfolio: string;
    workPreference: string;
    whyJoin: string;
    cv_resume: File | null;
    cover_letter: File | null;
}

export interface CareerApiResponse {
    success: boolean;
    message: string;
    application_id?: number;
    errors?: Record<string, string[]>;
}

export interface BaseStepProps {
    data: CareerFormData;
    updateData: (data: Partial<CareerFormData>) => void;
    errors: Record<string, string>;
}

export interface Step1Props extends BaseStepProps {
    onNext: () => void;
}

export interface Step2Props extends BaseStepProps {
    onNext: () => void;
    onBack: () => void;
}

export interface Step3Props extends BaseStepProps {
    onSubmit: () => Promise<void>;
}
