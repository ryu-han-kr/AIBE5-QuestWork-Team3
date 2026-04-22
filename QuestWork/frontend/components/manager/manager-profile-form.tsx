'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { CheckCircle2, AlertCircle } from 'lucide-react'

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
                if (!response.ok) throw new Error('데이터 로드 실패')

                const data = await response.json()
                // 💡 백엔드에서 온 실제 데이터(data)를 프론트엔드 입력창(form)에 연결
                form.reset({
                    // 백엔드는 'username'으로 주는데, 프론트엔드 입력창은 'nickname' 이름일 때
                    nickname: data.nickname || data.username || '',
                    managerName: data.managerName || '',
                    companyName: data.companyName || '', // 현재 null이라 빈칸으로 나옴
                    contactPhone: data.contactPhone || '', // '010123456789'가 들어감
                    businessNumber: data.businessNumber || '', // 현재 null이라 빈칸으로 나옴
                });
            } catch (error) {
                console.error('Fetch Error:', error)
                setErrorMessage('기존 정보를 불러오지 못했습니다.')
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
            if (!response.ok) throw new Error('수정 실패')
            setSuccessMessage('매니저 프로필이 성공적으로 저장되었습니다.')
            localStorage.setItem('nickname', data.nickname)
            setTimeout(() => setSuccessMessage(''), 3000)
        } catch (error) {
            setErrorMessage('저장 중 오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-bold">매니저 프로필 설정</h2>
                <p className="text-sm text-muted-foreground">기업 및 담당자 정보를 수정하세요.</p>
            </div>

            {successMessage && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700 border border-green-200">
                    <CheckCircle2 className="h-5 w-5" /> {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700 border border-red-200">
                    <AlertCircle className="h-5 w-5" /> {errorMessage}
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="nickname" render={({ field }) => (
                        <FormItem>
                            <FormLabel>유저 닉네임</FormLabel>
                            <FormControl><Input {...field} disabled={isLoading} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="managerName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>담당자 이름</FormLabel>
                            <FormControl><Input placeholder="담당자 이름" {...field} disabled={isLoading} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="companyName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>회사/팀명</FormLabel>
                            <FormControl><Input placeholder="회사명" {...field} disabled={isLoading} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="contactPhone" render={({ field }) => (
                        <FormItem>
                            <FormLabel>연락처</FormLabel>
                            <FormControl><Input placeholder="010-0000-0000" {...field} disabled={isLoading} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="businessNumber" render={({ field }) => (
                        <FormItem>
                            <FormLabel>사업자 번호</FormLabel>
                            <FormControl><Input placeholder="000-00-00000" {...field} disabled={isLoading} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isLoading}>초기화</Button>
                        <Button type="submit" disabled={isLoading} className="bg-blue-600">
                            {isLoading ? '저장 중...' : '프로필 저장'}
                        </Button>
                    </div>
                </form>
            </Form>
        </Card>
    )
}