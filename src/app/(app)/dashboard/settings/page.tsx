'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { User, Building2, Bell, Shield, CreditCard } from 'lucide-react'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    toast.success('Settings saved')
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your organization settings.</p>
      </div>

      {/* Organization */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <CardTitle>Organization</CardTitle>
          </div>
          <CardDescription>Your company info shown on quotes and invoices.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input defaultValue="Harvest Operations LLC" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input defaultValue="(817) 555-0100" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue="ops@harvestoperations.com" type="email" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Address</Label>
              <Input defaultValue="PO Box 1234" />
            </div>
            <div className="space-y-2">
              <Label>City / State / ZIP</Label>
              <Input defaultValue="Keller, TX 76248" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Tax Rate (%)</Label>
              <Input defaultValue="8.25" type="number" step="0.001" />
            </div>
            <div className="space-y-2">
              <Label>Quote Valid Duration (days)</Label>
              <Input defaultValue="30" type="number" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Default Quote Disclaimer</Label>
            <Textarea
              defaultValue="This quote is valid for 30 days from the date issued. Prices may vary based on actual site conditions."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <CardTitle>Team Members</CardTitle>
          </div>
          <CardDescription>Manage who has access to your Streamline account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: 'Dan Mitchell', email: 'dan@harvestoperations.com', role: 'owner' },
            { name: 'Marcus Rodriguez', email: 'marcus@harvestoperations.com', role: 'tech' },
            { name: 'Jake Thompson', email: 'jake@harvestoperations.com', role: 'tech' },
            { name: 'Derek Sanders', email: 'derek@harvestoperations.com', role: 'tech' },
          ].map(member => (
            <div key={member.email} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <div className="font-medium text-sm">{member.name}</div>
                <div className="text-xs text-muted-foreground">{member.email}</div>
              </div>
              <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                {member.role}
              </Badge>
            </div>
          ))}
          <Button variant="outline" size="sm" className="mt-2">
            Invite Team Member
          </Button>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <CardTitle>Integrations</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: 'Stripe', description: 'Accept online payments', connected: true },
            { name: 'Resend', description: 'Transactional email delivery', connected: true },
            { name: 'Google Maps', description: 'Address autocomplete + maps', connected: false },
          ].map(int => (
            <div key={int.name} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <div className="font-medium text-sm">{int.name}</div>
                <div className="text-xs text-muted-foreground">{int.description}</div>
              </div>
              <Badge variant={int.connected ? 'default' : 'outline'}>
                {int.connected ? 'Connected' : 'Not connected'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
