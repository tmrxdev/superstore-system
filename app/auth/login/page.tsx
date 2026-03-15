'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const DEFAULT_PIN = '123123'

export default function LoginPage() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showNewPinSetup, setShowNewPinSetup] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handlePinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setPin(value)
    setError('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid PIN')
        setPin('')
        return
      }

      if (data.firstLogin) {
        setShowNewPinSetup(true)
        setPin('')
      } else {
        localStorage.setItem('shopSession', JSON.stringify(data.user))
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  const handleNewPinSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPin.length !== 6) {
      setError('PIN must be 6 digits')
      return
    }

    if (newPin !== confirmPin) {
      setError('PINs do not match')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/set-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPin }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to set PIN')
        return
      }

      localStorage.setItem('shopSession', JSON.stringify(data.user))
      router.push('/dashboard')
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (showNewPinSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="glass-lg p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-center text-blue-400 mb-2">Superstore</h1>
              <p className="text-center text-slate-400">Set Your PIN</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleNewPinSetup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  New PIN (6 digits)
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={newPin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setNewPin(value)
                    setError('')
                  }}
                  placeholder="••••••"
                  maxLength={6}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-center text-2xl tracking-widest text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm PIN (6 digits)
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={confirmPin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setConfirmPin(value)
                    setError('')
                  }}
                  placeholder="••••••"
                  maxLength={6}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-center text-2xl tracking-widest text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || newPin.length !== 6 || confirmPin.length !== 6}
                className="w-full glass-button-primary"
              >
                {loading ? 'Setting PIN...' : 'Confirm PIN'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-lg p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-center text-blue-400 mb-2">Superstore</h1>
            <p className="text-center text-slate-400">Staff Portal</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Enter PIN
              </label>
              <input
                ref={inputRef}
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={handlePinInput}
                placeholder="••••••"
                maxLength={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-center text-4xl tracking-widest text-blue-300 placeholder-slate-500 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || pin.length !== 6}
              className="w-full glass-button-primary"
            >
              {loading ? 'Verifying...' : 'Login'}
            </Button>
          </form>

          <p className="text-center text-slate-500 text-xs mt-6">
            Staff access required
          </p>
        </div>
      </div>
    </div>
  )
}
