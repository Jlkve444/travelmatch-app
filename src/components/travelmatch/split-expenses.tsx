'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Plus, 
  Receipt, 
  Users, 
  CheckCircle, 
  Wallet,
  ArrowRightLeft,
  Camera,
  MoreHorizontal
} from 'lucide-react'

// Mock expense data
const MOCK_EXPENSES = [
  {
    id: '1',
    description: 'Airbnb Lissabon',
    amount: 2400,
    currency: 'EUR',
    category: 'accommodation',
    paid_by: {
      id: '1',
      name: 'Lena',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    },
    date: '2026-09-01',
    splits: [
      { user_id: '1', amount: 800 },
      { user_id: '2', amount: 800 },
      { user_id: '3', amount: 800 },
    ],
    receipt_url: null,
    settled: true,
  },
  {
    id: '2',
    description: 'Mietwagen',
    amount: 450,
    currency: 'EUR',
    category: 'transport',
    paid_by: {
      id: '2',
      name: 'Max',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    },
    date: '2026-09-05',
    splits: [
      { user_id: '1', amount: 150 },
      { user_id: '2', amount: 150 },
      { user_id: '3', amount: 150 },
    ],
    receipt_url: null,
    settled: false,
  },
  {
    id: '3',
    description: 'Restaurant Abendessen',
    amount: 180,
    currency: 'EUR',
    category: 'food',
    paid_by: {
      id: '3',
      name: 'Sarah',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    },
    date: '2026-09-10',
    splits: [
      { user_id: '1', amount: 60 },
      { user_id: '2', amount: 60 },
      { user_id: '3', amount: 60 },
    ],
    receipt_url: null,
    settled: false,
  },
  {
    id: '4',
    description: 'Surfing Lesson',
    amount: 120,
    currency: 'EUR',
    category: 'activity',
    paid_by: {
      id: '1',
      name: 'Lena',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    },
    date: '2026-09-12',
    splits: [
      { user_id: '2', amount: 60 },
      { user_id: '3', amount: 60 },
    ],
    receipt_url: null,
    settled: false,
  },
]

const TRIP_MEMBERS = [
  { id: '1', name: 'Lena', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { id: '2', name: 'Max', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { id: '3', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
]

const CATEGORY_ICONS: Record<string, string> = {
  accommodation: '🏠',
  food: '🍽️',
  transport: '🚗',
  activity: '🎯',
  other: '📦',
}

const CATEGORY_LABELS: Record<string, string> = {
  accommodation: 'Unterkunft',
  food: 'Essen',
  transport: 'Transport',
  activity: 'Aktivität',
  other: 'Sonstiges',
}

function calculateBalances(expenses: typeof MOCK_EXPENSES, members: typeof TRIP_MEMBERS) {
  const balances: Record<string, number> = {}
  
  members.forEach(member => {
    balances[member.id] = 0
  })
  
  expenses.forEach(expense => {
    // Add what payer paid
    balances[expense.paid_by.id] += expense.amount
    
    // Subtract what each person owes
    expense.splits.forEach(split => {
      balances[split.user_id] -= split.amount
    })
  })
  
  return balances
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function SplitExpenses() {
  const [expenses, setExpenses] = useState(MOCK_EXPENSES)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'food',
    paid_by: '1',
    split_type: 'equal',
  })

  const balances = calculateBalances(expenses, TRIP_MEMBERS)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const settledExpenses = expenses.filter(e => e.settled).length

  const handleAddExpense = () => {
    const amount = parseFloat(newExpense.amount)
    if (!newExpense.description || isNaN(amount)) return

    const splits = TRIP_MEMBERS.map(member => ({
      user_id: member.id,
      amount: amount / TRIP_MEMBERS.length,
    }))

    const expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount,
      currency: 'EUR',
      category: newExpense.category,
      paid_by: TRIP_MEMBERS.find(m => m.id === newExpense.paid_by) || TRIP_MEMBERS[0],
      date: new Date().toISOString().split('T')[0],
      splits,
      receipt_url: null,
      settled: false,
    }

    setExpenses([...expenses, expense])
    setShowAddForm(false)
    setNewExpense({
      description: '',
      amount: '',
      category: 'food',
      paid_by: '1',
      split_type: 'equal',
    })
  }

  const handleSettle = (expenseId: string) => {
    setExpenses(expenses.map(e => 
      e.id === expenseId ? { ...e, settled: true } : e
    ))
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card style={{ borderRadius: '24px' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sunset-coral/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-sunset-coral" />
              </div>
              <div>
                <p className="text-sm text-deep-ocean/60">Gesamtausgaben</p>
                <p className="text-2xl font-bold text-deep-ocean">{formatCurrency(totalExpenses, 'EUR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderRadius: '24px' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-moss-green/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-moss-green" />
              </div>
              <div>
                <p className="text-sm text-deep-ocean/60">Beglichen</p>
                <p className="text-2xl font-bold text-deep-ocean">{settledExpenses} / {expenses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderRadius: '24px' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center">
                <ArrowRightLeft className="w-6 h-6 text-amber" />
              </div>
              <div>
                <p className="text-sm text-deep-ocean/60">Offen</p>
                <p className="text-2xl font-bold text-deep-ocean">{expenses.length - settledExpenses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Overview */}
      <Card style={{ borderRadius: '24px' }}>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-deep-ocean flex items-center gap-2">
            <Users className="w-5 h-5" />
            
            Bilanz
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {TRIP_MEMBERS.map((member) => {
              const balance = balances[member.id]
              const isPositive = balance > 0
              
              return (
                <div key={member.id} className="flex items-center justify-between p-3 bg-soft-sand/30 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-deep-ocean">{member.name}</span>
                  </div>
                  
                  <div className={`text-right ${isPositive ? 'text-moss-green' : 'text-sunset-coral'}`}>
                    <p className="font-bold">
                      {isPositive ? '+' : ''}{formatCurrency(balance, 'EUR')}
                    </p>
                    <p className="text-xs opacity-70">
                      {isPositive ? 'Bekommt' : 'Schuldet'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card style={{ borderRadius: '24px' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-deep-ocean flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              
              Ausgaben
            </CardTitle>
            
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-sunset-coral hover:bg-sunset-coral/90 text-white"
              style={{ borderRadius: '9999px' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              
              Hinzufügen
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className={`p-4 rounded-2xl border-2 transition-all ${
                expense.settled 
                  ? 'bg-moss-green/5 border-moss-green/20' 
                  : 'bg-white border-soft-sand'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-soft-sand/50 flex items-center justify-center text-xl">
                    {CATEGORY_ICONS[expense.category]}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-deep-ocean">{expense.description}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" style={{ borderRadius: '9999px' }}>
                        {CATEGORY_LABELS[expense.category]}
                      </Badge>
                      
                      <span className="text-sm text-deep-ocean/50">
                        {new Date(expense.date).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold text-deep-ocean">{formatCurrency(expense.amount, expense.currency)}</p>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={expense.paid_by.avatar} />
                      <AvatarFallback>{expense.paid_by.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-deep-ocean/50">
                      Bezahlt von {expense.paid_by.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Splits */}
              <div className="mt-3 pt-3 border-t border-soft-sand/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-deep-ocean/60">Aufgeteilt:</span>
                    <div className="flex -space-x-2">
                      {expense.splits.map((split, i) => (
                        <div
                          key={split.user_id}
                          className="w-8 h-8 rounded-full bg-soft-sand flex items-center justify-center text-xs font-medium border-2 border-white"
                          title={`${formatCurrency(split.amount, expense.currency)}`}
                        >
                          {TRIP_MEMBERS.find(m => m.id === split.user_id)?.name[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {!expense.settled ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSettle(expense.id)}
                      className="border-moss-green text-moss-green hover:bg-moss-green/10"
                      style={{ borderRadius: '9999px' }}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      
                      Als beglichen markieren
                    </Button>
                  ) : (
                    <Badge className="bg-moss-green/10 text-moss-green border-0">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      
                      Beglichen
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add Expense Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md" style={{ borderRadius: '24px' }}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-deep-ocean">
                Ausgabe hinzufügen
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-deep-ocean">Beschreibung</label>
                <Input
                  placeholder="z.B. Restaurant, Mietwagen..."
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  style={{ borderRadius: '12px' }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-deep-ocean">Betrag (EUR)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  style={{ borderRadius: '12px' }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-deep-ocean">Kategorie</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <Button
                      key={key}
                      type="button"
                      variant={newExpense.category === key ? 'default' : 'outline'}
                      onClick={() => setNewExpense({ ...newExpense, category: key })}
                      className={`h-12 ${
                        newExpense.category === key
                          ? 'bg-sunset-coral text-white border-sunset-coral'
                          : 'border-soft-sand'
                      }`}
                      style={{ borderRadius: '12px' }}
                    >
                      <span className="mr-2">{CATEGORY_ICONS[key]}</span>
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-deep-ocean">Bezahlt von</label>
                <div className="flex gap-2">
                  {TRIP_MEMBERS.map((member) => (
                    <Button
                      key={member.id}
                      type="button"
                      variant={newExpense.paid_by === member.id ? 'default' : 'outline'}
                      onClick={() => setNewExpense({ ...newExpense, paid_by: member.id })}
                      className={`flex-1 h-12 ${
                        newExpense.paid_by === member.id
                          ? 'bg-sunset-coral text-white border-sunset-coral'
                          : 'border-soft-sand'
                      }`}
                      style={{ borderRadius: '12px' }}
                    >
                      {member.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 h-12"
                  style={{ borderRadius: '9999px' }}
                >
                  Abbrechen
                </Button>
                
                <Button
                  onClick={handleAddExpense}
                  disabled={!newExpense.description || !newExpense.amount}
                  className="flex-1 h-12 bg-sunset-coral hover:bg-sunset-coral/90 text-white"
                  style={{ borderRadius: '9999px' }}
                >
                  Hinzufügen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
