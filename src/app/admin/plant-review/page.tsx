'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Eye, EyeOff, Sparkles } from 'lucide-react';

interface PlantEvidence {
  id: string;
  botanical_name: string;
  wfo_id: string | null;
  evidence_type: string;
  image_url: string;
  uploaded_by: string;
  metadata: {
    season?: string;
    location?: string;
    date_taken?: string;
    notes?: string;
  };
  verification_status: 'pending' | 'verified' | 'rejected' | 'needs_review';
  created_at: string;
}

interface PlantSuggestion {
  id: string;
  botanical_name: string;
  suggestion_type: string;
  current_value: string | null;
  suggested_value: string;
  confidence_score: number;
  rationale: string;
  status: 'pending' | 'approved' | 'rejected' | 'deferred';
  evidence_ids: string[];
  created_at: string;
}

export default function PlantReviewPage() {
  const [activeTab, setActiveTab] = useState<'evidence' | 'suggestions'>('evidence');
  const [evidenceList, setEvidenceList] = useState<PlantEvidence[]>([]);
  const [suggestions, setSuggestions] = useState<PlantSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvidence, setSelectedEvidence] = useState<PlantEvidence | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<PlantSuggestion | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      // Fetch pending evidence
      const evidenceRes = await fetch('/api/admin/plant-evidence');
      const evidenceData = await evidenceRes.json();
      setEvidenceList(evidenceData.evidence || []);

      // Fetch pending suggestions
      const suggestionsRes = await fetch('/api/admin/plant-suggestions');
      const suggestionsData = await suggestionsRes.json();
      setSuggestions(suggestionsData.suggestions || []);
    } catch (error) {
      console.error('Failed to fetch review data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateEvidenceStatus(evidenceId: string, status: 'verified' | 'rejected' | 'needs_review') {
    try {
      const response = await fetch('/api/admin/plant-evidence/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evidence_id: evidenceId, status })
      });

      if (response.ok) {
        fetchData();
        setSelectedEvidence(null);
      }
    } catch (error) {
      console.error('Failed to update evidence status:', error);
    }
  }

  async function updateSuggestionStatus(suggestionId: string, status: 'approved' | 'rejected' | 'deferred', notes?: string) {
    try {
      const response = await fetch('/api/admin/plant-suggestions/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestion_id: suggestionId, status, review_notes: notes })
      });

      if (response.ok) {
        fetchData();
        setSelectedSuggestion(null);
      }
    } catch (error) {
      console.error('Failed to update suggestion status:', error);
    }
  }

  async function runVerification(evidenceId: string) {
    setIsVerifying(true);
    try {
      const response = await fetch('/api/plant/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evidence_id: evidenceId })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Verification complete!\n\nBackends: ${data.backends_used.join(', ')}\nConfidence: ${(data.aggregated_confidence * 100).toFixed(0)}%\nConsensus: ${data.consensus_name}\nSuggestion created: ${data.suggestion_created ? 'Yes' : 'No'}`);
        fetchData(); // Refresh to show new suggestions
      } else {
        const error = await response.json();
        alert(`Verification failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to run verification:', error);
      alert('Verification failed - check console for details');
    } finally {
      setIsVerifying(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300"><CheckCircle2 className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'needs_review':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300"><AlertTriangle className="w-3 h-3 mr-1" />Needs Review</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'deferred':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300"><EyeOff className="w-3 h-3 mr-1" />Deferred</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEvidenceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'leaf': 'Leaf Detail',
      'bark': 'Bark Texture',
      'habit': 'Overall Habit',
      'winter': 'Winter Interest',
      'flower': 'Flower',
      'fruit': 'Fruit/Berry',
      'overall': 'Overall'
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading review queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Plant Evidence Review Queue
          </h1>
          <p className="text-gray-600">
            Review user-submitted evidence and approve suggested improvements to plant rendering parameters
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'evidence' | 'suggestions')}>
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="evidence">
              Evidence ({evidenceList.filter(e => e.verification_status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="suggestions">
              Suggestions ({suggestions.filter(s => s.status === 'pending').length})
            </TabsTrigger>
          </TabsList>

          {/* Evidence Review Tab */}
          <TabsContent value="evidence">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Evidence List */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">Pending Evidence</h2>
                {evidenceList.filter(e => e.verification_status === 'pending').length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                      No pending evidence to review
                    </CardContent>
                  </Card>
                ) : (
                  evidenceList
                    .filter(e => e.verification_status === 'pending')
                    .map(evidence => (
                      <Card
                        key={evidence.id}
                        className={`cursor-pointer transition-all ${
                          selectedEvidence?.id === evidence.id ? 'ring-2 ring-green-500' : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedEvidence(evidence)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={evidence.image_url}
                              alt={evidence.botanical_name}
                              className="w-24 h-24 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {evidence.botanical_name}
                              </h3>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {getEvidenceTypeLabel(evidence.evidence_type)}
                                </Badge>
                                {getStatusBadge(evidence.verification_status)}
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                Uploaded {new Date(evidence.created_at).toLocaleDateString()}
                              </p>
                              {evidence.metadata.season && (
                                <p className="text-xs text-gray-600 mt-1">
                                  Season: {evidence.metadata.season}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>

              {/* Evidence Detail */}
              <div className="lg:sticky lg:top-8">
                {selectedEvidence ? (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Evidence Detail</h3>

                      <img
                        src={selectedEvidence.image_url}
                        alt={selectedEvidence.botanical_name}
                        className="w-full h-auto rounded-lg mb-4"
                      />

                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-gray-500">Botanical Name</p>
                          <p className="font-semibold">{selectedEvidence.botanical_name}</p>
                        </div>

                        <div>
                          <p className="text-gray-500">Evidence Type</p>
                          <p className="font-semibold">{getEvidenceTypeLabel(selectedEvidence.evidence_type)}</p>
                        </div>

                        {selectedEvidence.metadata.season && (
                          <div>
                            <p className="text-gray-500">Season</p>
                            <p className="font-semibold">{selectedEvidence.metadata.season}</p>
                          </div>
                        )}

                        {selectedEvidence.metadata.location && (
                          <div>
                            <p className="text-gray-500">Location</p>
                            <p className="font-semibold">{selectedEvidence.metadata.location}</p>
                          </div>
                        )}

                        {selectedEvidence.metadata.notes && (
                          <div>
                            <p className="text-gray-500">Notes</p>
                            <p className="text-gray-700">{selectedEvidence.metadata.notes}</p>
                          </div>
                        )}

                        <div>
                          <p className="text-gray-500">Uploaded</p>
                          <p className="font-semibold">
                            {new Date(selectedEvidence.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {selectedEvidence.verification_status === 'pending' && (
                        <div className="flex gap-2 mb-3">
                          <Button
                            onClick={() => updateEvidenceStatus(selectedEvidence.id, 'verified')}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Verify
                          </Button>
                          <Button
                            onClick={() => updateEvidenceStatus(selectedEvidence.id, 'needs_review')}
                            variant="outline"
                            className="flex-1"
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Flag
                          </Button>
                          <Button
                            onClick={() => updateEvidenceStatus(selectedEvidence.id, 'rejected')}
                            variant="outline"
                            className="flex-1 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {selectedEvidence.verification_status === 'verified' && (
                        <Button
                          onClick={() => runVerification(selectedEvidence.id)}
                          disabled={isVerifying}
                          className="w-full bg-purple-600 hover:bg-purple-700 mb-3"
                        >
                          {isVerifying ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                              Running Verification...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Run Verification APIs
                            </>
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                      Select evidence to review
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Suggestions Review Tab */}
          <TabsContent value="suggestions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Suggestions List */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">Pending Suggestions</h2>
                {suggestions.filter(s => s.status === 'pending').length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                      No pending suggestions to review
                    </CardContent>
                  </Card>
                ) : (
                  suggestions
                    .filter(s => s.status === 'pending')
                    .map(suggestion => (
                      <Card
                        key={suggestion.id}
                        className={`cursor-pointer transition-all ${
                          selectedSuggestion?.id === suggestion.id ? 'ring-2 ring-green-500' : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedSuggestion(suggestion)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {suggestion.botanical_name}
                              </h3>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {suggestion.suggestion_type.replace('_', ' ')}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    suggestion.confidence_score >= 0.8 ? 'bg-green-50 text-green-700' :
                                    suggestion.confidence_score >= 0.6 ? 'bg-yellow-50 text-yellow-700' :
                                    'bg-orange-50 text-orange-700'
                                  }`}
                                >
                                  {(suggestion.confidence_score * 100).toFixed(0)}% confidence
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">
                                {suggestion.current_value || 'Not set'} → <strong>{suggestion.suggested_value}</strong>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {suggestion.evidence_ids.length} supporting evidence
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>

              {/* Suggestion Detail */}
              <div className="lg:sticky lg:top-8">
                {selectedSuggestion ? (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Suggestion Detail</h3>

                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-500 text-sm">Botanical Name</p>
                          <p className="font-semibold text-lg">{selectedSuggestion.botanical_name}</p>
                        </div>

                        <div>
                          <p className="text-gray-500 text-sm">Suggestion Type</p>
                          <p className="font-semibold">{selectedSuggestion.suggestion_type.replace('_', ' ')}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-500 text-sm">Current Value</p>
                            <p className="font-semibold">{selectedSuggestion.current_value || 'Not set'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">Suggested Value</p>
                            <p className="font-semibold text-green-700">{selectedSuggestion.suggested_value}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-500 text-sm">Confidence Score</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  selectedSuggestion.confidence_score >= 0.8 ? 'bg-green-600' :
                                  selectedSuggestion.confidence_score >= 0.6 ? 'bg-yellow-600' :
                                  'bg-orange-600'
                                }`}
                                style={{ width: `${selectedSuggestion.confidence_score * 100}%` }}
                              />
                            </div>
                            <span className="font-semibold text-sm">
                              {(selectedSuggestion.confidence_score * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-500 text-sm">Rationale</p>
                          <p className="text-gray-700 text-sm mt-1">{selectedSuggestion.rationale}</p>
                        </div>

                        <div>
                          <p className="text-gray-500 text-sm mb-2">Supporting Evidence ({selectedSuggestion.evidence_ids.length})</p>
                          <div className="grid grid-cols-3 gap-2">
                            {selectedSuggestion.evidence_ids.slice(0, 6).map((evidenceId, idx) => (
                              <div key={idx} className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                                <Eye className="w-6 h-6 text-gray-400" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="flex gap-2">
                        <Button
                          onClick={() => updateSuggestionStatus(selectedSuggestion.id, 'approved')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => updateSuggestionStatus(selectedSuggestion.id, 'deferred')}
                          variant="outline"
                          className="flex-1"
                        >
                          <EyeOff className="w-4 h-4 mr-2" />
                          Defer
                        </Button>
                        <Button
                          onClick={() => updateSuggestionStatus(selectedSuggestion.id, 'rejected')}
                          variant="outline"
                          className="flex-1 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                      Select a suggestion to review
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Statistics */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wide mb-4">Review Statistics</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {evidenceList.filter(e => e.verification_status === 'pending').length}
                </p>
                <p className="text-xs text-gray-600">Pending Evidence</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {evidenceList.filter(e => e.verification_status === 'verified').length}
                </p>
                <p className="text-xs text-gray-600">Verified</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {suggestions.filter(s => s.status === 'pending').length}
                </p>
                <p className="text-xs text-gray-600">Pending Suggestions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {suggestions.filter(s => s.status === 'approved').length}
                </p>
                <p className="text-xs text-gray-600">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
