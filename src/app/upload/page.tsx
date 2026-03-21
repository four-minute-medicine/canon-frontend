'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FiUploadCloud, FiFile, FiX, FiCheck, FiArrowLeft } from 'react-icons/fi'
import { IoAlertCircleOutline } from 'react-icons/io5'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

const DOCUMENT_TYPES = [
    { value: 'articles', label: 'Articles' },
    { value: 'circular', label: 'Circular' },
    { value: 'guideline', label: 'Guideline' },
    { value: 'microlearning', label: 'Microlearning' },
    { value: 'webpage', label: 'Webpage' },
]

const DOCUMENT_STATUSES = [
    { value: 'binding_guideline', label: 'Binding Guideline' },
    { value: 'consensus_statement', label: 'Consensus Statement' },
    { value: 'academic_research', label: 'Academic Research' },
    { value: 'literature_review', label: 'Literature Review' },
]

const RESOURCE_TAGS = [
    { value: 'public_tier_1', label: 'Public Tier 1 (Clinics)' },
    { value: 'public_tier_2_plus', label: 'Public Tier 2+ (Hospitals)' },
    { value: 'private', label: 'Private' },
]

const GEOGRAPHIC_SCALES = [
    { value: 'global', label: 'Global' },
    { value: 'regional', label: 'Regional' },
    { value: 'national', label: 'National' },
    { value: 'provincial', label: 'Provincial' },
]

const EVIDENCE_LEVELS = [
    { value: '', label: 'Not specified' },
    { value: 'high', label: 'High' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'low', label: 'Low' },
    { value: 'opinion', label: 'Opinion' },
]

interface FormData {
    file_name: string
    country: string
    publication_date: string
    reference: string
    organisation_affiliation: string
    specialty: string
    document_type: string
    document_status: string
    resource_tag: string
    geographic_scale: string
    evidence_level: string
    region_countries: string
    namespace: string
    force: boolean
}

interface IngestResult {
    status: string
    file_name?: string
    chunks_created?: number
    file_summary?: string
    pages_extracted?: number
    source_hash?: string
    message?: string
}

const SelectField = ({ label, name, value, onChange, options, required = false }: {
    label: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: { value: string; label: string }[]
    required?: boolean
}) => (
    <div className="flex flex-col gap-1.5">
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all appearance-none cursor-pointer"
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
)

const TextField = ({ label, name, value, onChange, placeholder = '', required = false, type = 'text' }: {
    label: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    required?: boolean
    type?: string
}) => (
    <div className="flex flex-col gap-1.5">
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
        />
    </div>
)

export default function UploadPage() {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [result, setResult] = useState<IngestResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<FormData>({
        file_name: '',
        country: 'ZA',
        publication_date: '',
        reference: '',
        organisation_affiliation: '',
        specialty: '',
        document_type: 'guideline',
        document_status: 'binding_guideline',
        resource_tag: 'public_tier_2_plus',
        geographic_scale: 'national',
        evidence_level: '',
        region_countries: '',
        namespace: '',
        force: false,
    })

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    const handleFileDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile?.type === 'application/pdf') {
            setFile(droppedFile)
            if (!formData.file_name) {
                setFormData(prev => ({ ...prev, file_name: droppedFile.name }))
            }
        } else {
            setError('Only PDF files are supported.')
        }
    }, [formData.file_name])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            if (!formData.file_name) {
                setFormData(prev => ({ ...prev, file_name: selectedFile.name }))
            }
        }
    }

    const removeFile = () => {
        setFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!file) {
            setError('Please select a PDF file.')
            return
        }

        setIsSubmitting(true)
        setError(null)
        setResult(null)

        const body = new FormData()
        body.append('file', file)
        body.append('file_name', formData.file_name)
        body.append('country', formData.country)
        body.append('publication_date', formData.publication_date)
        body.append('reference', formData.reference)
        body.append('organisation_affiliation', formData.organisation_affiliation)
        body.append('specialty', formData.specialty)
        body.append('document_type', formData.document_type)
        body.append('document_status', formData.document_status)
        body.append('resource_tag', formData.resource_tag)
        body.append('geographic_scale', formData.geographic_scale)
        if (formData.evidence_level) body.append('evidence_level', formData.evidence_level)
        if (formData.region_countries) body.append('region_countries', formData.region_countries)
        body.append('namespace', formData.namespace)
        body.append('force', String(formData.force))

        try {
            const response = await fetch(`${API_BASE_URL}/ingest`, {
                method: 'POST',
                body,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail || `Request failed with status ${response.status}`)
            }

            setResult(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setFile(null)
        setResult(null)
        setError(null)
        setFormData({
            file_name: '',
            country: 'ZA',
            publication_date: '',
            reference: '',
            organisation_affiliation: '',
            specialty: '',
            document_type: 'guideline',
            document_status: 'binding_guideline',
            resource_tag: 'public_tier_2_plus',
            geographic_scale: 'national',
            evidence_level: '',
            region_countries: '',
            namespace: '',
            force: false,
        })
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <div className="min-h-screen bg-[#F7F7F7]">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Back to Chat
                    </button>
                    <h1 className="text-xl font-semibold text-black">Document Ingestion</h1>
                    <div className="w-24" />
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10">
                {/* Success banner */}
                {result && result.status === 'success' && (
                    <div className="mb-8 p-5 bg-green-50 border border-green-200 rounded-2xl">
                        <div className="flex items-start gap-3">
                            <FiCheck className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-green-800 mb-1">Ingestion successful</h3>
                                <p className="text-sm text-green-700">
                                    <strong>{result.file_name}</strong> was processed into{' '}
                                    <strong>{result.chunks_created}</strong> chunks across{' '}
                                    <strong>{result.pages_extracted}</strong> pages.
                                </p>
                                {result.file_summary && (
                                    <p className="text-sm text-green-700 mt-2 italic">
                                        &ldquo;{result.file_summary}&rdquo;
                                    </p>
                                )}
                                <button
                                    onClick={resetForm}
                                    className="mt-3 text-sm font-medium text-green-800 underline underline-offset-2 hover:text-green-900"
                                >
                                    Upload another document
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {result && result.status === 'already_ingested' && (
                    <div className="mb-8 p-5 bg-yellow-50 border border-yellow-200 rounded-2xl">
                        <div className="flex items-start gap-3">
                            <IoAlertCircleOutline className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                            <div>
                                <h3 className="text-sm font-semibold text-yellow-800 mb-1">Already ingested</h3>
                                <p className="text-sm text-yellow-700">{result.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error banner */}
                {error && (
                    <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-2xl">
                        <div className="flex items-start gap-3">
                            <IoAlertCircleOutline className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                            <div>
                                <h3 className="text-sm font-semibold text-red-800 mb-1">Error</h3>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* File upload */}
                    <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                        <h2 className="text-base font-semibold text-black mb-4">Upload PDF</h2>

                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleFileDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-12 px-6 cursor-pointer transition-all ${
                                isDragging
                                    ? 'border-black bg-gray-50'
                                    : file
                                        ? 'border-green-300 bg-green-50/50'
                                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {file ? (
                                <div className="flex items-center gap-3">
                                    <FiFile className="w-8 h-8 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeFile() }}
                                        className="ml-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        <FiX className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <FiUploadCloud className="w-10 h-10 text-gray-400 mb-3" />
                                    <p className="text-sm text-gray-600 font-medium">
                                        Drop your PDF here or <span className="text-black underline underline-offset-2">browse</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">PDF files only</p>
                                </>
                            )}
                        </div>
                    </section>

                    {/* Core identifiers */}
                    <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                        <h2 className="text-base font-semibold text-black mb-4">Core Identifiers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <TextField
                                label="File Name"
                                name="file_name"
                                value={formData.file_name}
                                onChange={handleFieldChange}
                                placeholder="e.g. NDOH_Hypertension_2024.pdf"
                                required
                            />
                            <TextField
                                label="Reference (AMA Format)"
                                name="reference"
                                value={formData.reference}
                                onChange={handleFieldChange}
                                placeholder="e.g. National Department of Health. Clinical Guidelines..."
                                required
                            />
                            <TextField
                                label="Organisation Affiliation"
                                name="organisation_affiliation"
                                value={formData.organisation_affiliation}
                                onChange={handleFieldChange}
                                placeholder="e.g. SA NDOH, WHO, NICE"
                                required
                            />
                            <TextField
                                label="Publication Date"
                                name="publication_date"
                                type="date"
                                value={formData.publication_date}
                                onChange={handleFieldChange}
                                required
                            />
                        </div>
                    </section>

                    {/* Classification */}
                    <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                        <h2 className="text-base font-semibold text-black mb-4">Classification</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <TextField
                                label="Specialty"
                                name="specialty"
                                value={formData.specialty}
                                onChange={handleFieldChange}
                                placeholder="e.g. Paediatrics, Cardiology, Emergency Medicine"
                                required
                            />
                            <SelectField
                                label="Document Type"
                                name="document_type"
                                value={formData.document_type}
                                onChange={handleFieldChange}
                                options={DOCUMENT_TYPES}
                                required
                            />
                            <SelectField
                                label="Document Status"
                                name="document_status"
                                value={formData.document_status}
                                onChange={handleFieldChange}
                                options={DOCUMENT_STATUSES}
                                required
                            />
                            <SelectField
                                label="Level of Evidence"
                                name="evidence_level"
                                value={formData.evidence_level}
                                onChange={handleFieldChange}
                                options={EVIDENCE_LEVELS}
                            />
                        </div>
                    </section>

                    {/* Geographic & resource context */}
                    <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                        <h2 className="text-base font-semibold text-black mb-4">Geographic &amp; Resource Context</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <TextField
                                label="Country"
                                name="country"
                                value={formData.country}
                                onChange={handleFieldChange}
                                placeholder="ISO code, e.g. ZA, GB, US"
                                required
                            />
                            <SelectField
                                label="Geographic Scale"
                                name="geographic_scale"
                                value={formData.geographic_scale}
                                onChange={handleFieldChange}
                                options={GEOGRAPHIC_SCALES}
                                required
                            />
                            <SelectField
                                label="Resource Tag"
                                name="resource_tag"
                                value={formData.resource_tag}
                                onChange={handleFieldChange}
                                options={RESOURCE_TAGS}
                                required
                            />
                            <TextField
                                label="Region / Countries (if applicable)"
                                name="region_countries"
                                value={formData.region_countries}
                                onChange={handleFieldChange}
                                placeholder="e.g. SADC, EU or ZA, BW, MZ"
                            />
                        </div>
                    </section>

                    {/* Advanced options */}
                    <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
                        <h2 className="text-base font-semibold text-black mb-4">Advanced Options</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <TextField
                                label="Namespace"
                                name="namespace"
                                value={formData.namespace}
                                onChange={handleFieldChange}
                                placeholder="Leave blank for default"
                            />
                            <div className="flex items-end pb-1">
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        name="force"
                                        checked={formData.force}
                                        onChange={handleFieldChange}
                                        className="w-4 h-4 rounded border-gray-300 accent-black"
                                    />
                                    <span className="text-sm text-gray-700">Force re-ingestion (overwrite existing)</span>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !file}
                            className="px-8 py-3 bg-[#1e1e1e] hover:bg-[#2d2d2d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-full transition-colors shadow-sm"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                'Ingest Document'
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}
