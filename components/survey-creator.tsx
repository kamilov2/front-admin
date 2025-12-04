"use client";

import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import { useCallback, useEffect, useRef } from "react";
import "survey-core/survey-core.min.css";
import "survey-creator-core/survey-creator-core.min.css";

interface SurveyCreatorProps {
  json?: any;
  onSave?: (json: any) => void;
  onJsonChange?: (json: any) => void;
}

export function SurveyCreatorEditor({
  json,
  onSave,
  onJsonChange,
}: SurveyCreatorProps) {
  const creatorRef = useRef<SurveyCreator | null>(null);

  useEffect(() => {
    const options = {
      showLogicTab: true,
      showTranslationTab: true,
      showJSONEditorTab: true,
      showEmbeddedSurveyTab: false,
      isAutoSave: true,
      showDesignerTab: true,
      showPreviewTab: true,
      showThemeTab: true,
    };

    const creator = new SurveyCreator(options);

    // Configure creator
    creator.toolbox.allowExpandMultipleCategories = true;
    creator.showToolbox = true;
    creator.showPropertyGrid = true;

    // Set initial JSON if provided
    if (json) {
      creator.JSON = json;
    }

    // Auto-save callback
    creator.saveSurveyFunc = (saveNo: number, callback: Function) => {
      const surveyJson = creator.JSON;
      if (onSave) {
        onSave(surveyJson);
      }
      if (onJsonChange) {
        onJsonChange(surveyJson);
      }
      callback(saveNo, true);
    };

    // Listen to JSON changes
    creator.onModified.add(() => {
      if (onJsonChange) {
        onJsonChange(creator.JSON);
      }
    });

    creatorRef.current = creator;

    return () => {
      if (creatorRef.current) {
        creatorRef.current.dispose();
      }
    };
  }, []);

  // Update JSON when prop changes
  useEffect(() => {
    if (creatorRef.current && json) {
      creatorRef.current.JSON = json;
    }
  }, [json]);

  const handleSave = useCallback(() => {
    if (creatorRef.current && onSave) {
      onSave(creatorRef.current.JSON);
    }
  }, [onSave]);

  return (
    <div className="survey-creator-container h-full">
      {creatorRef.current && (
        <SurveyCreatorComponent creator={creatorRef.current} />
      )}
    </div>
  );
}
