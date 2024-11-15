import React, { useState } from 'react';
import { DollarSign, PlusCircle, Trash2 } from 'lucide-react';
import { Fixture } from '../types/tournament';

interface BudgetItem {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

interface BudgetManagerProps {
  fixture: Fixture;
}

export function BudgetManager({ fixture }: BudgetManagerProps) {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [newItem, setNewItem] = useState<Omit<BudgetItem, 'id'>>({
    description: '',
    amount: 0,
    type: 'income',
    category: 'inscription'
  });

  const categories = {
    income: ['inscription', 'sponsorship', 'other'],
    expense: ['referees', 'courts', 'equipment', 'prizes', 'other']
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        ...newItem,
        id: crypto.randomUUID()
      }
    ]);
    setNewItem({
      description: '',
      amount: 0,
      type: 'income',
      category: 'inscription'
    });
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalIncome = items
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = items
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-8">
      <div className="card p-6">
        <h2 className="section-header flex items-center justify-center gap-2">
          <DollarSign className="w-6 h-6" />
          PRESUPUESTO DEL TORNEO
        </h2>

        {/* Add New Item Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select
            value={newItem.type}
            onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'income' | 'expense' })}
            className="input"
          >
            <option value="income">INGRESO</option>
            <option value="expense">GASTO</option>
          </select>

          <select
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            className="input"
          >
            {categories[newItem.type].map(cat => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Descripción"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="input"
          />

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Monto"
              value={newItem.amount}
              onChange={(e) => setNewItem({ ...newItem, amount: parseFloat(e.target.value) || 0 })}
              className="input"
            />
            <button
              onClick={addItem}
              className="btn btn-primary"
              disabled={!newItem.description || !newItem.amount}
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Budget Items List */}
        <div className="space-y-4">
          {items.map(item => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-lg ${
                item.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}
            >
              <div className="flex-1">
                <p className="font-semibold">{item.description}</p>
                <p className="text-sm text-gray-400">{item.category.toUpperCase()}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={item.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                  ${item.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-green-500/10 p-4">
            <h3 className="text-center text-green-500 mb-2">INGRESOS TOTALES</h3>
            <p className="text-2xl text-center">${totalIncome.toFixed(2)}</p>
          </div>
          
          <div className="card bg-red-500/10 p-4">
            <h3 className="text-center text-red-500 mb-2">GASTOS TOTALES</h3>
            <p className="text-2xl text-center">${totalExpenses.toFixed(2)}</p>
          </div>
          
          <div className={`card p-4 ${balance >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
            <h3 className={`text-center mb-2 ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              BALANCE
            </h3>
            <p className="text-2xl text-center">${balance.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}