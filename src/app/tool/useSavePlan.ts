"use client";

import { useState, useCallback } from "react";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { PlanState } from "./types";

export interface SavedPlan {
  id: string;
  name: string;
  drawing_number: string;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

export function useSavePlan(supabase: SupabaseClient, user: User | null) {
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);

  const fetchPlans = useCallback(async () => {
    if (!user) return;
    setLoadingPlans(true);
    try {
      const { data, error } = await supabase
        .from("planting_plans")
        .select("id, name, drawing_number, thumbnail, created_at, updated_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setSavedPlans(data || []);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    } finally {
      setLoadingPlans(false);
    }
  }, [supabase, user]);

  const savePlan = useCallback(
    async (planState: PlanState, thumbnail: string | null) => {
      if (!user) return null;
      setSaving(true);
      try {
        if (currentPlanId) {
          // Update existing
          const { error } = await supabase
            .from("planting_plans")
            .update({
              name: planState.settings.name,
              drawing_number: planState.settings.drawingNumber,
              data: planState,
              thumbnail,
            })
            .eq("id", currentPlanId);
          if (error) throw error;
          await fetchPlans();
          return currentPlanId;
        } else {
          // Create new
          const { data, error } = await supabase
            .from("planting_plans")
            .insert({
              user_id: user.id,
              name: planState.settings.name,
              drawing_number: planState.settings.drawingNumber,
              data: planState,
              thumbnail,
            })
            .select("id")
            .single();
          if (error) throw error;
          setCurrentPlanId(data.id);
          await fetchPlans();
          return data.id;
        }
      } catch (err) {
        console.error("Failed to save plan:", err);
        return null;
      } finally {
        setSaving(false);
      }
    },
    [supabase, user, currentPlanId, fetchPlans]
  );

  const loadPlan = useCallback(
    async (planId: string): Promise<PlanState | null> => {
      if (!user) return null;
      try {
        const { data, error } = await supabase
          .from("planting_plans")
          .select("*")
          .eq("id", planId)
          .single();
        if (error) throw error;
        setCurrentPlanId(planId);
        return data.data as PlanState;
      } catch (err) {
        console.error("Failed to load plan:", err);
        return null;
      }
    },
    [supabase, user]
  );

  const deletePlan = useCallback(
    async (planId: string) => {
      if (!user) return;
      try {
        const { error } = await supabase
          .from("planting_plans")
          .delete()
          .eq("id", planId);
        if (error) throw error;
        if (currentPlanId === planId) setCurrentPlanId(null);
        await fetchPlans();
      } catch (err) {
        console.error("Failed to delete plan:", err);
      }
    },
    [supabase, user, currentPlanId, fetchPlans]
  );

  const saveAsNew = useCallback(
    async (planState: PlanState, thumbnail: string | null) => {
      if (!user) return null;
      setCurrentPlanId(null);
      setSaving(true);
      try {
        const { data, error } = await supabase
          .from("planting_plans")
          .insert({
            user_id: user.id,
            name: planState.settings.name,
            drawing_number: planState.settings.drawingNumber,
            data: planState,
            thumbnail,
          })
          .select("id")
          .single();
        if (error) throw error;
        setCurrentPlanId(data.id);
        await fetchPlans();
        return data.id;
      } catch (err) {
        console.error("Failed to save plan:", err);
        return null;
      } finally {
        setSaving(false);
      }
    },
    [supabase, user, fetchPlans]
  );

  return {
    savedPlans,
    currentPlanId,
    saving,
    loadingPlans,
    fetchPlans,
    savePlan,
    loadPlan,
    deletePlan,
    saveAsNew,
    setCurrentPlanId,
  };
}
