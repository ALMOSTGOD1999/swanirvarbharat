import { useState, useEffect } from 'react'
import { Form, router } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import type { InertiaProps } from '~/types'
import DefaultLayout from '~/layouts/default'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import { Button, buttonVariants } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'

const STEPS = [
  { num: 1, label: 'Personal Information' },
  { num: 2, label: 'Documents' },
  { num: 3, label: 'Introduction Video' },
  { num: 4, label: 'KYC Verification' },
  { num: 5, label: 'Purpose' },
  { num: 6, label: 'Preview & Submit' },
]

type PageProps = InertiaProps<{
  application: any
  currentStep: number
}>

export default function OnboardingIndex({ application, currentStep }: PageProps) {
  const [activeStep, setActiveStep] = useState(currentStep || 1)
  const app = application || {}

  useEffect(() => { setActiveStep(currentStep || 1) }, [currentStep])

  const progressPct = Math.round(((activeStep - 1) / STEPS.length) * 100)

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Step {activeStep} of {STEPS.length}</span>
          <span>{progressPct}% complete</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          {STEPS.map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div className={cn(
                'size-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors',
                s.num < activeStep ? 'bg-primary text-primary-foreground' :
                s.num === activeStep ? 'bg-primary text-primary-foreground ring-2 ring-primary/30' :
                'bg-muted text-muted-foreground'
              )}>
                {s.num < activeStep ? '✓' : s.num}
              </div>
              <span className="text-[10px] mt-1 text-muted-foreground hidden sm:block">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Step {activeStep}: {STEPS[activeStep - 1].label}</CardTitle>
        </CardHeader>
        <CardPanel>
          {activeStep === 1 && <PersonalInfoStep app={app} onNext={() => setActiveStep(2)} />}
          {activeStep === 2 && <DocumentsStep app={app} onNext={() => setActiveStep(3)} onPrev={() => setActiveStep(1)} />}
          {activeStep === 3 && <IntroVideoStep app={app} onNext={() => setActiveStep(4)} onPrev={() => setActiveStep(2)} />}
          {activeStep === 4 && <KycStep app={app} onNext={() => setActiveStep(5)} onPrev={() => setActiveStep(3)} />}
          {activeStep === 5 && <PurposeStep app={app} onNext={() => setActiveStep(6)} onPrev={() => setActiveStep(4)} />}
          {activeStep === 6 && <PreviewStep app={app} />}
        </CardPanel>
      </Card>
    </div>
  )
}

// ─── Step 1: Personal Information ────────────────────────────
function PersonalInfoStep({ app, onNext }: { app: any; onNext: () => void }) {
  const [fullName, setFullName] = useState(app.fullName || '')
  const [gender, setGender] = useState(app.gender || '')
  const [age, setAge] = useState(app.age || '')
  const [education, setEducation] = useState(app.educationalQualification || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.post('/onboarding/personal-info', { fullName, gender, age, educationalQualification: education }, {
      onSuccess: () => onNext(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Full Name *</label>
        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Enter your full name" />
      </div>
      <div>
        <label className="text-sm font-medium">Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Age</label>
        <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Your age" min={1} max={120} />
      </div>
      <div>
        <label className="text-sm font-medium">Educational Qualification</label>
        <Input value={education} onChange={(e) => setEducation(e.target.value)} placeholder="e.g. Bachelor's in Hotel Management" />
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit">Save & Next</Button>
      </div>
    </form>
  )
}

// ─── Step 2: Document Uploads ────────────────────────────────
function DocumentsStep({ app, onNext, onPrev }: { app: any; onNext: () => void; onPrev: () => void }) {
  const docs = [
    { key: 'certificate_10th', label: '10th Certificate', value: app.certificate10th, required: true },
    { key: 'certificate_12th', label: '12th Certificate', value: app.certificate12th, required: true },
    { key: 'certificate_graduation', label: 'Graduation Certificate', value: app.certificateGraduation, required: false },
    { key: 'certificate_post_graduation', label: 'Post Graduation Certificate', value: app.certificatePostGraduation, required: false },
    { key: 'passport_photo', label: 'Recent Passport Size Photo', value: app.passportPhoto, required: true },
  ]

  const handleUpload = (field: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.jpg,.jpeg,.png'
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        router.post(`/onboarding/documents/${field}`, formData)
      }
    }
    input.click()
  }

  const handleRemove = (field: string) => {
    router.post('/onboarding/documents/remove', { field })
  }

  const requiredCount = docs.filter((d) => d.required).length
  const requiredUploadedCount = docs.filter((d) => d.required && d.value).length
  const allRequiredUploaded = requiredUploadedCount === requiredCount

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Upload your educational documents and a recent photograph. Accepted formats: PDF, JPG, PNG.</p>
      {docs.map((doc) => (
        <div key={doc.key} className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <span className="text-sm font-medium">{doc.label}</span>
            {doc.required && <span className="ml-1 text-xs text-destructive">*</span>}
            {doc.value && <Badge variant="outline" className="ml-2">Uploaded</Badge>}
          </div>
          <div className="flex gap-2">
            {doc.value && (
              <Button type="button" variant="outline" size="sm" onClick={() => window.open(doc.value.url, '_blank')}>View</Button>
            )}
            <Button type="button" variant={doc.value ? 'destructive' : 'default'} size="sm" onClick={() => doc.value ? handleRemove(doc.key) : handleUpload(doc.key)}>
              {doc.value ? 'Remove' : 'Upload'}
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev}>Back</Button>
        <Button type="button" onClick={onNext} disabled={!allRequiredUploaded}>
          {!allRequiredUploaded ? 'Upload all required (starred) docs first' : 'Next'}
        </Button>
      </div>
    </div>
  )
}

// ─── Step 3: Introduction Video ──────────────────────────────
function IntroVideoStep({ app, onNext, onPrev }: { app: any; onNext: () => void; onPrev: () => void }) {
  const handleUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'video/mp4,video/webm,video/quicktime'
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) {
        const formData = new FormData()
        formData.append('video', file)
        router.post('/onboarding/intro-video', formData, { onSuccess: () => onNext() })
      }
    }
    input.click()
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Record and upload a short self-introduction video (max 2 minutes).</p>
      {app.introductionVideo ? (
        <div>
          <video src={app.introductionVideo.url} controls className="w-full max-w-md rounded-lg border" />
          <p className="text-xs text-muted-foreground mt-1">Video uploaded: {app.introductionVideo.name}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-8">
          <p className="text-muted-foreground">No video uploaded yet</p>
          <Button type="button" onClick={handleUpload}>Upload Introduction Video</Button>
        </div>
      )}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev}>Back</Button>
        <Button type="button" onClick={onNext} disabled={!app.introductionVideo}>Next</Button>
      </div>
    </div>
  )
}

// ─── Step 4: KYC Verification ────────────────────────────────
function KycStep({ app, onNext, onPrev }: { app: any; onNext: () => void; onPrev: () => void }) {
  const [kycType, setKycType] = useState(app.kycType || '')
  const [uploaded, setUploaded] = useState(!!app.kycDocument)

  const handleUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.jpg,.jpeg,.png'
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) {
        const formData = new FormData()
        formData.append('kycType', kycType)
        formData.append('file', file)
        router.post('/onboarding/kyc', formData, { onSuccess: () => setUploaded(true) })
      }
    }
    input.click()
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Upload any one government-issued ID for KYC verification.</p>
      <div>
        <label className="text-sm font-medium">KYC Document Type *</label>
        <select value={kycType} onChange={(e) => setKycType(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">Select document type</option>
          <option value="aadhaar">Aadhaar Card</option>
          <option value="voter_id">Voter ID Card</option>
        </select>
      </div>
      {app.kycDocument ? (
        <div className="flex items-center justify-between rounded-lg border p-3">
          <span className="text-sm">{app.kycType === 'aadhaar' ? 'Aadhaar Card' : 'Voter ID Card'} uploaded</span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => window.open(app.kycDocument.url, '_blank')}>View</Button>
          </div>
        </div>
      ) : (
        <Button type="button" onClick={handleUpload} disabled={!kycType}>
          Upload KYC Document
        </Button>
      )}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev}>Back</Button>
        <Button type="button" onClick={onNext} disabled={!app.kycDocument}>Next</Button>
      </div>
    </div>
  )
}

// ─── Step 5: Purpose Video & Description ─────────────────────
function PurposeStep({ app, onNext, onPrev }: { app: any; onNext: () => void; onPrev: () => void }) {
  const [description, setDescription] = useState(app.purposeDescription || '')

  const handleUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'video/mp4,video/webm'
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) {
        const formData = new FormData()
        formData.append('video', file)
        formData.append('description', description)
        router.post('/onboarding/purpose', formData, { onSuccess: () => {} })
      }
    }
    input.click()
  }

  const handleSave = () => {
    const formData = new FormData()
    formData.append('description', description)
    router.post('/onboarding/purpose', formData, { onSuccess: () => onNext() })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Upload a short English video (max 3 min) explaining why you want to join this course, your career goals, and your interest in the hospitality industry.</p>
      <div>
        <label className="text-sm font-medium">Description / Key Points</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Tell us about your motivation, career goals, and interest in hospitality..." />
      </div>
      <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-8">
        {app.purposeVideo ? (
          <div className="w-full">
            <video src={app.purposeVideo.url} controls className="w-full max-w-md rounded-lg border mx-auto" />
            <p className="text-xs text-muted-foreground text-center mt-1">Video uploaded: {app.purposeVideo.name}</p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground">No purpose video uploaded yet</p>
            <Button type="button" variant="outline" onClick={handleUpload}>Upload Purpose Video</Button>
          </>
        )}
      </div>
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev}>Back</Button>
        <Button type="button" onClick={handleSave}>Continue to Preview</Button>
      </div>
    </div>
  )
}

// ─── Step 6: Preview & Submit ────────────────────────────────
function PreviewStep({ app }: { app: any }) {
  const handleSubmit = () => {
    if (confirm('Are you sure you want to submit your application? You will not be able to edit it after submission.')) {
      router.post('/onboarding/submit')
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Please review all the information before submitting your application.</p>

      <section>
        <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
        <div className="grid grid-cols-2 gap-2 text-sm rounded-lg bg-muted/50 p-4">
          <span className="text-muted-foreground">Full Name:</span>
          <span>{app.fullName || '—'}</span>
          <span className="text-muted-foreground">Gender:</span>
          <span className="capitalize">{app.gender || '—'}</span>
          <span className="text-muted-foreground">Age:</span>
          <span>{app.age || '—'}</span>
          <span className="text-muted-foreground">Education:</span>
          <span>{app.educationalQualification || '—'}</span>
        </div>
      </section>

      <section>
        <h3 className="font-semibold text-lg mb-2">Documents</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { key: 'certificate10th', label: '10th Certificate' },
            { key: 'certificate12th', label: '12th Certificate' },
            { key: 'certificateGraduation', label: 'Graduation' },
            { key: 'certificatePostGraduation', label: 'Post Graduation' },
            { key: 'passportPhoto', label: 'Passport Photo' },
          ].map((doc) => (
            <div key={doc.key} className="flex items-center justify-between rounded-lg border p-2">
              <span className="text-xs">{doc.label}</span>
              {(app as any)[doc.key] ? (
                <Button type="button" variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => window.open((app as any)[doc.key].url, '_blank')}>View</Button>
              ) : (
                <span className="text-xs text-muted-foreground">Not uploaded</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {app.introductionVideo && (
        <section>
          <h3 className="font-semibold text-lg mb-2">Introduction Video</h3>
          <video src={app.introductionVideo.url} controls className="w-full max-w-sm rounded-lg border" />
        </section>
      )}

      {app.kycDocument && (
        <section>
          <h3 className="font-semibold text-lg mb-2">KYC Document</h3>
          <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
            <span>{app.kycType === 'aadhaar' ? 'Aadhaar Card' : 'Voter ID Card'} — <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => window.open(app.kycDocument.url, '_blank')}>View Document</Button></span>
          </div>
        </section>
      )}

      {app.purposeVideo && (
        <section>
          <h3 className="font-semibold text-lg mb-2">Purpose Video</h3>
          <video src={app.purposeVideo.url} controls className="w-full max-w-sm rounded-lg border" />
        </section>
      )}

      {app.purposeDescription && (
        <section>
          <h3 className="font-semibold text-lg mb-2">Purpose Description</h3>
          <p className="text-sm whitespace-pre-wrap rounded-lg bg-muted/50 p-4">{app.purposeDescription}</p>
        </section>
      )}

      <div className="flex justify-center pt-6">
        <Button size="lg" onClick={handleSubmit}>
          Submit Application
        </Button>
      </div>
    </div>
  )
}

OnboardingIndex.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
