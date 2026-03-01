'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface PropertyForm {
  id: string
  name: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  zip: string
  property_type: string
  notes: string
}

export default function NewClientPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [properties, setProperties] = useState<PropertyForm[]>([
    { id: '1', name: '', address_line1: '', address_line2: '', city: '', state: 'TX', zip: '', property_type: 'residential', notes: '' }
  ])

  const addProperty = () => {
    setProperties(prev => [...prev, {
      id: crypto.randomUUID(),
      name: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: 'TX',
      zip: '',
      property_type: 'residential',
      notes: '',
    }])
  }

  const removeProperty = (id: string) => {
    if (properties.length === 1) return
    setProperties(prev => prev.filter(p => p.id !== id))
  }

  const updateProperty = (id: string, field: keyof PropertyForm, value: string) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Client created successfully')
    router.push('/dashboard/clients')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/clients"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Client</h1>
          <p className="text-muted-foreground">Add a new client and their properties.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info */}
        <Card>
          <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input id="first_name" name="first_name" required placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input id="last_name" name="last_name" required placeholder="Smith" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input id="company_name" name="company_name" placeholder="Acme Corp (optional)" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" placeholder="(817) 555-0000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Lead Source</Label>
                <Select name="source">
                  <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                  <SelectContent>
                    {['Angi', 'Google', 'Referral', 'Website', 'Direct', 'Other'].map(s => (
                      <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" placeholder="Internal notes about this client..." rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Properties */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Properties</h2>
            <Button type="button" variant="outline" size="sm" onClick={addProperty}>
              <Plus className="h-4 w-4 mr-2" />Add Property
            </Button>
          </div>
          {properties.map((property, idx) => (
            <Card key={property.id}>
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <CardTitle className="text-base">Property {idx + 1}</CardTitle>
                {properties.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeProperty(property.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Property Name</Label>
                    <Input
                      placeholder="Main Residence"
                      value={property.name}
                      onChange={e => updateProperty(property.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Property Type</Label>
                    <Select value={property.property_type} onValueChange={v => updateProperty(property.id, 'property_type', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Street Address *</Label>
                  <Input
                    placeholder="123 Main St"
                    value={property.address_line1}
                    onChange={e => updateProperty(property.id, 'address_line1', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 col-span-1">
                    <Label>City *</Label>
                    <Input
                      placeholder="Keller"
                      value={property.city}
                      onChange={e => updateProperty(property.id, 'city', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input value={property.state} onChange={e => updateProperty(property.id, 'state', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>ZIP *</Label>
                    <Input
                      placeholder="76248"
                      value={property.zip}
                      onChange={e => updateProperty(property.id, 'zip', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/clients">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Client'}
          </Button>
        </div>
      </form>
    </div>
  )
}
