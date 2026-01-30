'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2, Calculator } from 'lucide-react';

export function CostCalculatorForm() {
  const [plants, setPlants] = useState([{ scientific: '', quantity: 1, unitPrice: 0, subtotal: 0 }]);
  const [sitePrepHours, setSitePrepHours] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(25);
  const [markup, setMarkup] = useState(20);
  const [includeVAT, setIncludeVAT] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const addPlantRow = () => {
    setPlants([...plants, { scientific: '', quantity: 1, unitPrice: 0, subtotal: 0 }]);
  };

  const updatePlant = (index: number, field: string, value: any) => {
    const updated = [...plants];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      updated[index].subtotal = updated[index].quantity * updated[index].unitPrice;
    }
    setPlants(updated);
  };

  const removePlant = (index: number) => {
    setPlants(plants.filter((_, i) => i !== index));
  };

  const calculate = async () => {
    setCalculating(true);
    try {
      const res = await fetch('/api/calculator/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plants,
          materials: [],
          labor: { sitePrepHours, hourlyRate, markupPercentage: markup },
          includeVAT
        })
      });
      const data = await res.json();
      setResult(data.calculation);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Plant List Table */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Plant List</h3>
          <div className="space-y-2">
            {plants.map((plant, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  placeholder="Scientific name"
                  value={plant.scientific}
                  onChange={(e) => updatePlant(i, 'scientific', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Qty"
                  value={plant.quantity}
                  onChange={(e) => updatePlant(i, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-20"
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="£ each"
                  value={plant.unitPrice}
                  onChange={(e) => updatePlant(i, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-24"
                />
                <span className="w-24 text-right">£{plant.subtotal.toFixed(2)}</span>
                <Button variant="ghost" size="sm" onClick={() => removePlant(i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={addPlantRow} variant="outline" className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Add Plant
          </Button>
        </CardContent>
      </Card>

      {/* Labor */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Labor</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Site Prep Hours</label>
              <Input
                type="number"
                step="0.5"
                value={sitePrepHours}
                onChange={(e) => setSitePrepHours(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm">Hourly Rate (£)</label>
              <Input
                type="number"
                step="0.5"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm">Markup (%)</label>
              <Input
                type="number"
                step="1"
                value={markup}
                onChange={(e) => setMarkup(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeVAT}
                onChange={(e) => setIncludeVAT(e.target.checked)}
              />
              <label className="text-sm">Include VAT (20%)</label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculate Button */}
      <Button onClick={calculate} disabled={calculating} className="w-full" size="lg">
        {calculating ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating...</>
        ) : (
          <><Calculator className="mr-2 h-4 w-4" /> Calculate Costs</>
        )}
      </Button>

      {/* Result */}
      {result && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <h3 className="font-bold text-lg mb-4">Cost Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Plants:</span>
                <span>£{result.summary.plantsSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Labor ({(result.labor.plantingHours + result.labor.sitePrepHours).toFixed(1)}h):</span>
                <span>£{result.summary.laborSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Markup ({markup}%):</span>
                <span>£{result.summary.markup.toFixed(2)}</span>
              </div>
              {includeVAT && (
                <div className="flex justify-between">
                  <span>VAT (20%):</span>
                  <span>£{result.summary.vat.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Grand Total:</span>
                <span>£{result.summary.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
