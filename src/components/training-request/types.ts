export interface TrainingRequestFormData {
    // Step 1: Basic Information
    fullName: string;
    email: string;
    companyName: string;
    countryCode: string;
    phoneNumber: string;
    traineeType: "Individual" | "Company Team" | "";

    // Step 2: Training Details
    trainingFocus: string;
    currentKnowledgeLevel: string;
    preferredFormat: "Online" | "In-person" | "Hybrid" | "";
    estimatedParticipants: string;

    // Step 3: Additional Options
    goalsExpectations: string;
    preferredCommunication: "Email" | "Phone" | "WhatsApp" | "";
    howDidYouHearAboutUs: string;
}

export interface StepProps {
    formData: TrainingRequestFormData;
    updateFormData: (data: Partial<TrainingRequestFormData>) => void;
    onNext: () => void;
    onBack?: () => void;
}
