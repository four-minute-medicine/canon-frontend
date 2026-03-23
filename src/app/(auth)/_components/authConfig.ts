export const authPills = [
  'Context-aware responses',
  'Clinician-tested workflows',
  'Fast, relevant answers',
]

export const authBrandName = 'Cannon'

export const trainingLevelOptions = [
  { value: '1st-year', label: '1st year' },
  { value: '2nd-year', label: '2nd year' },
  { value: '3rd-year', label: '3rd year' },
  { value: '4th-year', label: '4th year' },
  { value: '5th-year', label: '5th year' },
  { value: '6th-year', label: '6th year' },
  { value: 'medical-intern', label: 'Medical Intern' },
  { value: 'mo-gps', label: 'MO/GPs' },
  { value: 'registrar-resident', label: 'Registrar/Resident' },
  { value: 'other', label: 'Other' },
] as const

export const genderOptions = [
  { value: '', label: 'Select gender' },
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
] as const
