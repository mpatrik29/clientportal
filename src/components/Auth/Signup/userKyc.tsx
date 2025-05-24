'use client'

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import {
    validateClientDetailsForm,
    validateFile,
    isFormValid,
    ClientDetailsFormData,
    ValidationErrors,
    DocumentData
} from "@/utils/clientDetailsValidation";
import { databases, ID, storage } from "@/app/appwrite";
import { useRouter } from "next/navigation";
import { Permission, Role } from "appwrite";

interface IdentityType {
    value: string;
    label: string;
}



export default function ClientDetailsForm() {
    const [formData, setFormData] = useState<ClientDetailsFormData>({
        nationality: "",
        phoneNumber: "",
        dateOfBirth: null,
        identityType: "",
        identityFront: null,
        identityBack: null
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [success, setSuccess] = useState<boolean>(false);

    const nationalities: string[] = [
        "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
        "Italy", "Spain", "Netherlands", "Sweden", "Norway", "Denmark", "Switzerland",
        "Japan", "South Korea", "Singapore", "Hong Kong", "India", "China", "Brazil",
        "Mexico", "Argentina", "South Africa", "Nigeria", "Kenya", "Egypt", "UAE",
        "Saudi Arabia", "Qatar", "Kuwait", "Other"
    ];

    const identityTypes: IdentityType[] = [
        { value: "passport", label: "Passport" },
        { value: "national_id", label: "National ID Card" },
        { value: "drivers_license", label: "Driver's License" }
    ];

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof ValidationErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: keyof Pick<ClientDetailsFormData, 'identityFront' | 'identityBack'>): void => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file using helper function
            const validation = validateFile(file);

            if (!validation.isValid) {
                setErrors(prev => ({
                    ...prev,
                    [field]: validation.error
                }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                [field]: file
            }));

            // Clear error
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };


    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); // Prevent the default form submission behavior



        // Step 1: Upload files if they exist
        let docId_01: string | undefined;
        let docId_02: string | undefined;

        // Use validation helper
        const validationErrors = validateClientDetailsForm(formData);

        if (!isFormValid(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {

            if (formData.identityFront) {
                console.log('Uploading file 1...');
                docId_01 = await uploadFile(formData.identityFront);
            }
            if (formData.identityBack) {
                console.log('Uploading file 2');
                docId_02 = await uploadFile(formData.identityBack);
            }

            // Step 2: Prepare document data
            const documentData: DocumentData = {
                nationality: formData.nationality,
                dob: new Date(formData.dateOfBirth).toISOString(), // Convert to Date object
                docType: formData.identityType,
                ...(docId_01 && { docId_01 }),
                ...(docId_02 && { docId_02 })
            };

            // Step 3: Create document in Appwrite
            console.log('Creating document...');
            const document = await databases.createDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
                process.env.NEXT_PUBLIC_USER_DETAILS_COLLECTION_ID!,
                ID.unique(),
                documentData,
                [
                Permission.read(Role.user(localStorage.getItem('userId'))),    // Only this user can read
                Permission.update(Role.user(localStorage.getItem('userId'))),  // Only this user can update
                Permission.delete(Role.user(localStorage.getItem('userId')))   // Only this user can delete
            ]
                    );

            console.log('Document created successfully:', document.$id);
            setSuccess(true);
            localStorage.setItem('identityVerified','true');
            const router = useRouter();
            setTimeout(() => {
                router.push('/dashboard');
            },1000)

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred while submitting your details";
            setErrors({ submit: errorMessage });
        } finally {
            setLoading(false);
        }
    };


    const removeFile = (field: keyof Pick<ClientDetailsFormData, 'identityFront' | 'identityBack'>): void => {
        setFormData(prev => ({
            ...prev,
            [field]: null
        }));
    };

    // Upload file to Appwrite storage
    async function uploadFile(file: File): Promise<string> {
        try {
            const response = await storage.createFile(
                process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
                ID.unique(),
                file
            );
            return response.$id;
        } catch (error) {
            console.error('File upload failed:', error);
            throw new Error(`Failed to upload file: ${file.name}`);
        }
    }





    if (success) {
        return (
            <div className="bg-white dark:bg-gray-dark p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Details Submitted Successfully!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Your information has been received and is being reviewed.
                    </p>
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg text-left">
                        <p className="text-sm text-green-800 dark:text-green-200">
                            We'll review your documents and contact you within 2-3 business days regarding your account status.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <Link href="/dashboard" className="block w-full">
                        <button className="w-full rounded-lg bg-primary p-3 font-medium text-white transition hover:bg-opacity-90">
                            Continue to Dashboard
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-dark  rounded-lg  max-w-2xl mx-auto">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                    Complete Your Profile
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Please provide the following information to complete your account setup.
                </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Personal Information Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nationality */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nationality *
                        </label>
                        <select
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                            <option value="">Select nationality</option>
                            {nationalities.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                        {errors.nationality && (
                            <p className="mt-1 text-xs text-red-600">{errors.nationality}</p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 123-4567"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        {errors.phoneNumber && (
                            <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>
                        )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date of Birth *
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            onChange={handleInputChange}
                            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        {errors.dateOfBirth && (
                            <p className="mt-1 text-xs text-red-600">{errors.dateOfBirth}</p>
                        )}
                    </div>

                    {/* Identity Document Type */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ID Document Type *
                        </label>
                        <select
                            name="identityType"
                            value={formData.identityType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                            <option value="">Select document type</option>
                            {identityTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                        {errors.identityType && (
                            <p className="mt-1 text-xs text-red-600">{errors.identityType}</p>
                        )}
                    </div>
                </div>

                {/* Document Upload Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Identity Document Front */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ID Front Side *
                        </label>
                        <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 text-center">
                            {formData.identityFront ? (
                                <div className="space-y-1">
                                    <div className="flex items-center justify-center space-x-1">
                                        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
                                            {formData.identityFront.name}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile('identityFront')}
                                        className="text-xs text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="file"
                                        id="identityFront"
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileChange(e, 'identityFront')}
                                        className="hidden"
                                    />
                                    <label htmlFor="identityFront" className="cursor-pointer">
                                        <div className="space-y-1">
                                            <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="text-xs text-gray-600 dark:text-gray-300">
                                                <span className="font-medium text-primary">Click to upload</span>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, PDF (5MB max)</p>
                                        </div>
                                    </label>
                                </div>
                            )}
                        </div>
                        {errors.identityFront && (
                            <p className="mt-1 text-xs text-red-600">{errors.identityFront}</p>
                        )}
                    </div>

                    {/* Identity Document Back */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ID Back Side *
                        </label>
                        <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 text-center">
                            {formData.identityBack ? (
                                <div className="space-y-1">
                                    <div className="flex items-center justify-center space-x-1">
                                        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
                                            {formData.identityBack.name}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile('identityBack')}
                                        className="text-xs text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="file"
                                        id="identityBack"
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileChange(e, 'identityBack')}
                                        className="hidden"
                                    />
                                    <label htmlFor="identityBack" className="cursor-pointer">
                                        <div className="space-y-1">
                                            <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="text-xs text-gray-600 dark:text-gray-300">
                                                <span className="font-medium text-primary">Click to upload</span>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, PDF (5MB max)</p>
                                        </div>
                                    </label>
                                </div>
                            )}
                        </div>
                        {errors.identityBack && (
                            <p className="mt-1 text-xs text-red-600">{errors.identityBack}</p>
                        )}
                    </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                    <div className="p-3 text-sm bg-red-50 dark:bg-red-900/30 rounded-md">
                        <p className="text-red-800 dark:text-red-200">{errors.submit}</p>
                    </div>
                )}

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 rounded-md bg-primary p-3 text-sm font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
                                Processing...
                            </>
                        ) : 'Submit Details'}
                    </button>

                    <Link href="/dashboard" className="flex-1">
                        <button
                            type="button"
                            className="w-full rounded-md border border-primary bg-transparent p-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
                        >
                            Skip for Now
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    );
}