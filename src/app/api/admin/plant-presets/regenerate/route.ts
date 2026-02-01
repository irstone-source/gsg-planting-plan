/**
 * Plant Preset Regeneration API
 * POST /api/admin/plant-presets/regenerate
 * Applies approved suggestions to src/lib/symbols/presets.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth } from '@/lib/supabase-auth';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

interface RegenerateRequest {
  suggestion_id?: string; // Specific suggestion, or all approved
  dry_run?: boolean; // Preview changes without writing
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication and admin role
    const user = await requireAuth();

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body: RegenerateRequest = await request.json();

    // Fetch approved suggestions
    let query = supabase
      .from('plant_preset_suggestions')
      .select('*')
      .eq('status', 'approved');

    if (body.suggestion_id) {
      query = query.eq('id', body.suggestion_id);
    }

    const { data: suggestions, error: fetchError } = await query;

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch suggestions', details: fetchError.message },
        { status: 500 }
      );
    }

    if (!suggestions || suggestions.length === 0) {
      return NextResponse.json(
        { error: 'No approved suggestions found' },
        { status: 404 }
      );
    }

    // Read current presets.ts file
    const presetsPath = join(process.cwd(), 'src/lib/symbols/presets.ts');
    let presetsContent = readFileSync(presetsPath, 'utf-8');

    const changes: any[] = [];

    // Apply each suggestion
    for (const suggestion of suggestions) {
      const botanicalName = suggestion.botanical_name;
      const suggestedValue = JSON.parse(suggestion.suggested_value);
      const currentValue = suggestion.current_value ? JSON.parse(suggestion.current_value) : null;

      // Find the preset in the file
      const presetRegex = new RegExp(
        `'${botanicalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*\\{[^}]+\\}`,
        'g'
      );

      const match = presetsContent.match(presetRegex);

      if (match) {
        // Update existing preset
        const oldPreset = match[0];

        // Build new preset object
        let newPreset = `'${botanicalName}': {\n`;

        if (suggestion.suggestion_type === 'species_correction') {
          // Rename the key
          const newBotanicalName = suggestedValue.botanical_name;
          newPreset = `'${newBotanicalName}': {\n`;
          newPreset += `    botanical_name: '${newBotanicalName}',\n`;
        } else {
          newPreset += `    botanical_name: '${botanicalName}',\n`;
        }

        // Apply field updates
        const updatedPreset = { ...currentValue, ...suggestedValue };

        for (const [key, value] of Object.entries(updatedPreset)) {
          if (key === 'botanical_name') continue; // Already added

          if (typeof value === 'string') {
            newPreset += `    ${key}: '${value}',\n`;
          } else if (typeof value === 'number') {
            newPreset += `    ${key}: ${value},\n`;
          } else if (value === null) {
            newPreset += `    ${key}: null,\n`;
          }
        }

        newPreset += '  }';

        // Track change
        changes.push({
          botanical_name: botanicalName,
          suggestion_id: suggestion.id,
          suggestion_type: suggestion.suggestion_type,
          old_preset: oldPreset,
          new_preset: newPreset
        });

        // Apply replacement (unless dry run)
        if (!body.dry_run) {
          presetsContent = presetsContent.replace(oldPreset, newPreset);
        }

      } else if (suggestion.suggestion_type === 'species_correction') {
        // Preset not found, but we can create a new one
        const newBotanicalName = suggestedValue.botanical_name;
        const newPreset = `  '${newBotanicalName}': {\n    botanical_name: '${newBotanicalName}',\n    ...suggestedValue\n  },`;

        changes.push({
          botanical_name: newBotanicalName,
          suggestion_id: suggestion.id,
          suggestion_type: 'new_species',
          old_preset: null,
          new_preset: newPreset
        });

        // Note: Actual insertion would require finding the right place in the file
        // For now, skip new species (future enhancement)
      }
    }

    // Write updated presets.ts (unless dry run)
    if (!body.dry_run && changes.length > 0) {
      writeFileSync(presetsPath, presetsContent, 'utf-8');

      // Update suggestions to mark as applied
      const suggestionIds = suggestions.map(s => s.id);
      await supabase
        .from('plant_preset_suggestions')
        .update({ status: 'approved' })
        .in('id', suggestionIds);
    }

    return NextResponse.json({
      success: true,
      dry_run: body.dry_run || false,
      changes_applied: changes.length,
      changes: changes.map(c => ({
        botanical_name: c.botanical_name,
        suggestion_id: c.suggestion_id,
        suggestion_type: c.suggestion_type,
        preview: body.dry_run ? c.new_preset : undefined
      })),
      file_updated: !body.dry_run,
      message: body.dry_run
        ? `Dry run: ${changes.length} changes would be applied`
        : `Successfully applied ${changes.length} preset updates`
    });

  } catch (error: any) {
    console.error('Preset regeneration error:', error);
    return NextResponse.json(
      {
        error: 'Failed to regenerate presets',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
