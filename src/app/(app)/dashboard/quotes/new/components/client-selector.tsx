'use client'

import { useState } from 'react'
import { Search, ChevronDown, User, MapPin, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface DemoClient {
  id: string
  name: string
  phone: string
  properties: { id: string; address: string }[]
}

const DEMO_CLIENTS: DemoClient[] = [
  { id: '1', name: 'Ricky Ferris', phone: '(817) 555-1234', properties: [{ id: 'p1', address: '4521 Oak Valley Dr, Keller TX 76248' }] },
  { id: '2', name: 'Lindon Frazier', phone: '(817) 555-2345', properties: [{ id: 'p2', address: '1892 Saddle Ridge Blvd, Southlake TX 76092' }] },
  { id: '3', name: 'Chris Brady', phone: '(817) 555-3456', properties: [
    { id: 'p3', address: '513 Saddle Ridge, Northlake TX 76247' },
    { id: 'p4', address: '8901 Timber Creek, Roanoke TX 76262' },
  ]},
  { id: '4', name: 'Matthew Watkins', phone: '(817) 555-4567', properties: [{ id: 'p5', address: '2108 Elm Creek Ln, Flower Mound TX 75028' }] },
  { id: '5', name: 'Harvest Ops HQ', phone: '(817) 555-0001', properties: [
    { id: 'p6', address: '100 Commerce Blvd, Fort Worth TX 76102' },
    { id: 'p7', address: '441 Industrial Pkwy, Arlington TX 76014' },
  ]},
]

export function ClientSelector() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState<DemoClient | null>(DEMO_CLIENTS[0])
  const [selectedProperty, setSelectedProperty] = useState(DEMO_CLIENTS[0].properties[0])

  const filtered = DEMO_CLIENTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectClient = (client: DemoClient) => {
    setSelectedClient(client)
    setSelectedProperty(client.properties[0])
    setOpen(false)
  }

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <h3 className="font-semibold text-sm">Client & Property</h3>

      {selectedClient ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">{selectedClient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
              </div>
              <div>
                <div className="font-medium text-sm">{selectedClient.name}</div>
                <div className="text-xs text-muted-foreground">{selectedClient.phone}</div>
              </div>
            </div>
            <button onClick={() => setOpen(true)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Change
            </button>
          </div>

          {/* Property Select */}
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {selectedClient.properties.length > 1 ? (
              <select
                value={selectedProperty.id}
                onChange={e => {
                  const prop = selectedClient.properties.find(p => p.id === e.target.value)!
                  setSelectedProperty(prop)
                }}
                className="flex-1 text-sm bg-transparent border-0 focus:outline-none"
              >
                {selectedClient.properties.map(p => (
                  <option key={p.id} value={p.id}>{p.address}</option>
                ))}
              </select>
            ) : (
              <span className="text-sm text-muted-foreground">{selectedProperty.address}</span>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed hover:border-primary/50 hover:bg-primary/5 transition-colors text-muted-foreground hover:text-foreground"
        >
          <User className="h-4 w-4" />
          <span className="text-sm">Select a client...</span>
        </button>
      )}

      {/* Dropdown */}
      {open && (
        <div className="mt-2 rounded-lg border bg-card shadow-lg overflow-hidden">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search clients..."
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto divide-y">
            {filtered.map(client => (
              <button
                key={client.id}
                onClick={() => selectClient(client)}
                className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-primary">{client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                </div>
                <div>
                  <div className="font-medium text-sm">{client.name}</div>
                  <div className="text-xs text-muted-foreground">{client.properties.length} {client.properties.length === 1 ? 'property' : 'properties'}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
