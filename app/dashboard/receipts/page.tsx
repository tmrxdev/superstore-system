'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Receipt {
  id: string
  customer_name: string
  items: string
  total_price: number
  is_paid: boolean
  created_at: string
}

interface CustomerReceipts {
  customer_name: string
  order_count: number
  total_spent: number
  receipts: Receipt[]
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [groupedReceipts, setGroupedReceipts] = useState<Map<string, CustomerReceipts>>(new Map())
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Form fields
  const [customerName, setCustomerName] = useState('')
  const [items, setItems] = useState('')
  const [totalPrice, setTotalPrice] = useState('')
  const [isPaid, setIsPaid] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchReceipts()
  }, [])

  const fetchReceipts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/receipts')
      const data = await response.json()

      if (Array.isArray(data)) {
        setReceipts(data)
        groupReceiptsByCustomer(data)
      }
    } catch (error) {
      console.error('Failed to fetch receipts:', error)
    } finally {
      setLoading(false)
    }
  }

  const groupReceiptsByCustomer = (receipts: Receipt[]) => {
    const grouped = new Map<string, CustomerReceipts>()

    receipts.forEach((receipt) => {
      const name = receipt.customer_name
      if (!grouped.has(name)) {
        grouped.set(name, {
          customer_name: name,
          order_count: 0,
          total_spent: 0,
          receipts: [],
        })
      }

      const customer = grouped.get(name)!
      customer.order_count += 1
      customer.total_spent += receipt.total_price
      customer.receipts.push(receipt)
    })

    setGroupedReceipts(grouped)
  }

  const handleAddReceipt = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitting(true)

    try {
      const response = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          items,
          total_price: parseFloat(totalPrice),
          is_paid: isPaid,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setSubmitError(data.error || 'Failed to add receipt')
        return
      }

      // Reset form and refresh receipts
      setCustomerName('')
      setItems('')
      setTotalPrice('')
      setIsPaid(false)
      setShowForm(false)
      fetchReceipts()
    } catch (error) {
      setSubmitError('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredCustomers = Array.from(groupedReceipts.values()).filter((customer) =>
    customer.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-300">Customer Receipts</h1>
        <p className="text-slate-400 mt-1">Track customer purchases and orders</p>
      </div>

      {/* Add Receipt Form */}
      {showForm && (
        <div className="glass-lg p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Add New Receipt</h2>

          {submitError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleAddReceipt} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Customer Name
                </label>
                <Input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="glass bg-white/10 border-white/20 text-slate-200 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Items Purchased
                </label>
                <Input
                  type="text"
                  value={items}
                  onChange={(e) => setItems(e.target.value)}
                  placeholder="Diamond x10, Emerald x5"
                  required
                  className="glass bg-white/10 border-white/20 text-slate-200 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Total Price ($)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value)}
                  placeholder="0.00"
                  required
                  className="glass bg-white/10 border-white/20 text-slate-200 placeholder-slate-500"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20"
                  />
                  <span className="text-sm font-medium text-slate-300">
                    Payment Received
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-white/10">
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                className="glass-button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="glass-button-primary"
              >
                {submitting ? 'Adding...' : 'Add Receipt'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Add Button */}
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="glass bg-white/10 border-white/20 text-slate-200 placeholder-slate-500 flex-1"
        />
        <Button
          onClick={() => setShowForm(!showForm)}
          className="glass-button-primary"
        >
          {showForm ? 'Cancel' : 'Add Receipt'}
        </Button>
      </div>

      {/* Receipts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="glass-lg p-8 text-center">
            <p className="text-slate-400">Loading receipts...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="glass-lg p-8 text-center">
            <p className="text-slate-400">
              {receipts.length === 0 ? 'No receipts yet' : 'No customers found'}
            </p>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div key={customer.customer_name} className="glass-lg overflow-hidden">
              <button
                onClick={() =>
                  setExpandedCustomer(
                    expandedCustomer === customer.customer_name ? null : customer.customer_name
                  )
                }
                className="w-full p-4 text-left hover:bg-white/5 transition flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-100 text-lg">
                    {customer.customer_name}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {customer.order_count} order{customer.order_count !== 1 ? 's' : ''} - Total:
                    ${customer.total_spent.toFixed(2)}
                  </p>
                  {customer.order_count >= 5 && (
                    <span className="inline-block mt-1 px-2 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded">
                      VIP Member
                    </span>
                  )}
                </div>
                <span className="text-slate-400">
                  {expandedCustomer === customer.customer_name ? '-' : '+'}
                </span>
              </button>

              {expandedCustomer === customer.customer_name && (
                <div className="border-t border-white/10 bg-white/5 p-4 space-y-3">
                  {customer.receipts.map((receipt) => (
                    <div key={receipt.id} className="p-3 glass-sm text-sm">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-slate-200">{receipt.items}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(receipt.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-400">
                            ${receipt.total_price.toFixed(2)}
                          </p>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                              receipt.is_paid
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-yellow-500/20 text-yellow-300'
                            }`}
                          >
                            {receipt.is_paid ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
