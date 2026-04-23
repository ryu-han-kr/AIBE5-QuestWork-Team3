'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface ManagerProfileData {
  nickname: string
  managerName: string
  companyName: string
  contactPhone: string
  businessNumber: string
}

export function ManagerProfileForm({ userId }: { userId: number }) {
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm<ManagerProfileData>({
    defaultValues: {
      nickname: '',
      managerName: '',
      companyName: '',
      contactPhone: '',
      businessNumber: '',
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return
      setIsLoading(true)

      try {
        const response = await fetch(`http://localhost:8000/api/manager/${userId}`)
        if (!response.ok) throw new Error('Failed to load manager profile')

        const data = await response.json()
        form.reset({
          nickname: data.nickname || data.username || '',
          managerName: data.managerName || '',
          companyName: data.companyName || '',
          contactPhone: data.contactPhone || '',
          businessNumber: data.businessNumber || '',
        })
      } catch (error) {
        console.error('Fetch Error:', error)
        setErrorMessage('We could not load the current manager profile.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [userId, form])

  const onSubmit = async (data: ManagerProfileData) => {
    setIsLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const response = await fetch(`http://localhost:8000/api/manager/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update manager profile')

      setSuccessMessage('Manager profile saved successfully.')
      localStorage.setItem('nickname', data.nickname)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Update Error:', error)
      setErrorMessage('Something went wrong while saving your changes.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border border-border p-6 shadow-none">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>
        <p className="mt-1 text-sm text-foreground-muted">
          Update the public and operational information tied to your manager account.
        </p>
      </div>

      {successMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-green-700">
          <CheckCircle2 className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
          <AlertCircle className="h-5 w-5" />
          {errorMessage}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="managerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manager Name</FormLabel>
                <FormControl>
                  <Input placeholder="Manager name" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Company name" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder="010-0000-0000" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Number</FormLabel>
                <FormControl>
                  <Input placeholder="000-00-00000" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}
