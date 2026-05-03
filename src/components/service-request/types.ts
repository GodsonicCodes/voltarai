export interface ServiceRequestPageFormData {
    fullName: string;
    email: string;
    companyName: string;
    countryCode: string;
    phoneNumber: string;
    websiteLinkedin: string;
    serviceType: string;
    preferredTimeline: string;
    budgetRange: string;
    projectGoal: string;
    currentChallenges: string;
    preferredCommunication: string;
    howDidYouHearAboutUs: string;
    supportingDocuments: File | null;
}

export interface BaseStepProps {
    data: ServiceRequestPageFormData;
    updateData: (data: Partial<ServiceRequestPageFormData>) => void;
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
    onBack: () => void;
}
