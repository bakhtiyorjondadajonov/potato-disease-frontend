import React, { useState, useRef, useEffect, useCallback } from "react";
import { plants } from "../data/plantData";
import {
  predictPotato,
  analyzePlant,
  getSeverity,
  getAdvice,
  getCropCalendar,
} from "../api";

const Analyze = () => {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // Results
  const [diagnosis, setDiagnosis] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [severityLoading, setSeverityLoading] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [calendar, setCalendar] = useState(null);
  const [calendarLoading, setCalendarLoading] = useState(false);

  // UI state
  const [adviceTab, setAdviceTab] = useState("treatment");
  const [calendarSeason, setCalendarSeason] = useState("Summer");
  const [calendarLocation, setCalendarLocation] = useState("Poland");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileSelect = useCallback((selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setDiagnosis(null);
    setSeverity(null);
    setAdvice(null);
    setCalendar(null);
    setError(null);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFileSelect(droppedFile);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setDiagnosis(null);
    setSeverity(null);
    setAdvice(null);
    setCalendar(null);
    setError(null);
  }, [preview]);

  const handleAnalyze = async () => {
    if (!file || !selectedPlant) return;

    setIsAnalyzing(true);
    setError(null);
    setDiagnosis(null);
    setSeverity(null);
    setAdvice(null);
    setCalendar(null);

    try {
      // Step 1: Diagnosis
      let diagResult;
      if (selectedPlant.id === "potato") {
        const raw = await predictPotato(file);
        diagResult = {
          diseaseName: raw.class,
          confidence: raw.confidence,
          confidencePercent: raw.confidence_percent,
          isHealthy: raw.class === "Healthy",
        };
      } else {
        const raw = await analyzePlant(selectedPlant.id, file);
        diagResult = {
          diseaseName: raw.disease_name,
          confidence: raw.confidence,
          confidencePercent: `${(raw.confidence * 100).toFixed(1)}%`,
          isHealthy: raw.is_healthy,
          description: raw.description,
        };
      }
      setDiagnosis(diagResult);
      setIsAnalyzing(false);

      // Step 2: Parallel calls for severity, advice, calendar
      setSeverityLoading(true);
      setAdviceLoading(true);
      setCalendarLoading(true);

      const [severityResult, adviceResult, calendarResult] =
        await Promise.allSettled([
          getSeverity(file),
          getAdvice(
            diagResult.diseaseName,
            diagResult.confidence,
            selectedPlant.id
          ),
          getCropCalendar(
            diagResult.diseaseName,
            diagResult.confidence,
            calendarSeason,
            calendarLocation,
            selectedPlant.id
          ),
        ]);

      if (severityResult.status === "fulfilled") {
        setSeverity(severityResult.value);
      }
      setSeverityLoading(false);

      if (adviceResult.status === "fulfilled") {
        setAdvice(adviceResult.value);
      }
      setAdviceLoading(false);

      if (calendarResult.status === "fulfilled") {
        setCalendar(calendarResult.value);
      }
      setCalendarLoading(false);
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
      setIsAnalyzing(false);
    }
  };

  const refreshCalendar = async () => {
    if (!diagnosis) return;
    setCalendarLoading(true);
    try {
      const result = await getCropCalendar(
        diagnosis.diseaseName,
        diagnosis.confidence,
        calendarSeason,
        calendarLocation,
        selectedPlant.id
      );
      setCalendar(result);
    } catch (err) {
      // silently fail
    }
    setCalendarLoading(false);
  };

  const handleUploadAnother = () => {
    removeFile();
  };

  const handleChangePlant = () => {
    removeFile();
    setSelectedPlant(null);
  };

  const handleDownloadReport = () => {
    if (!diagnosis) return;
    const lines = [
      `Plant Disease Classifier - Analysis Report`,
      `Date: ${new Date().toLocaleDateString()}`,
      `Plant: ${selectedPlant.name}`,
      ``,
      `--- Diagnosis ---`,
      `Disease: ${diagnosis.diseaseName}`,
      `Confidence: ${diagnosis.confidencePercent}`,
      `Status: ${diagnosis.isHealthy ? "Healthy" : "Disease Detected"}`,
    ];
    if (severity) {
      lines.push(
        ``,
        `--- Severity ---`,
        `Level: ${severity.severity_level}`,
        `Affected Area: ${severity.affected_area_percent}%`,
        `Urgency: ${severity.urgency}`,
        ``,
        `Immediate Actions:`,
        ...severity.immediate_actions.map((a, i) => `${i + 1}. ${a}`),
        ``,
        severity.detailed_analysis
      );
    }
    if (advice) {
      lines.push(
        ``,
        `--- Treatment ---`,
        advice.treatment,
        ``,
        `--- Prevention ---`,
        advice.prevention,
        ``,
        `--- Care Instructions ---`,
        advice.care_instructions
      );
    }
    if (calendar) {
      lines.push(``, `--- Action Timeline (${calendar.season}) ---`);
      calendar.timeline.forEach((item) => {
        lines.push(`${item.week}: ${item.action}`, `  ${item.details}`);
      });
    }
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plant-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Derived values
  const plantData = selectedPlant
    ? plants.find((p) => p.id === selectedPlant.id)
    : null;
  const hasResults = diagnosis !== null;

  return (
    <div className="bg-background-light min-h-screen font-display text-slate-900">
      <main className="max-w-[1024px] mx-auto w-full px-6 py-8">
        {/* Plant Selector */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            What plant are you examining?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-3">
            {plants.map((plant) => {
              const isSelected =
                selectedPlant && selectedPlant.id === plant.id;
              return (
                <button
                  key={plant.id}
                  onClick={() => {
                    setSelectedPlant(plant);
                    setDiagnosis(null);
                    setSeverity(null);
                    setAdvice(null);
                    setCalendar(null);
                    setError(null);
                  }}
                  className={`cursor-pointer flex flex-col items-center gap-3 rounded-xl p-4 transition-all hover:shadow-md ${
                    isSelected
                      ? "border-2 border-primary bg-primary/5"
                      : "border border-primary/10 bg-white hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <div className={isSelected ? "text-primary" : "text-slate-400"}>
                    <span className="material-symbols-outlined text-3xl">
                      {plant.icon}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm">{plant.name}</p>
                    {isSelected ? (
                      <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase">
                        Selected
                      </span>
                    ) : (
                      <p className="text-[10px] text-slate-500">
                        {plant.diseases}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {plantData ? (
            <p className="text-slate-500 text-sm italic">
              <span className="material-symbols-outlined text-sm align-middle">
                info
              </span>{" "}
              {plantData.detectsText}
            </p>
          ) : null}
        </section>

        {/* Image Upload */}
        {selectedPlant ? (
          <section className="max-w-[600px] mx-auto mb-12">
            {/* Dropzone */}
            {!preview ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`bg-white border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px] mb-6 cursor-pointer transition-all ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-primary/30 hover:border-primary/50"
                }`}
              >
                <span className="material-symbols-outlined text-5xl text-primary mb-3">
                  cloud_upload
                </span>
                <p className="text-slate-700 font-medium">
                  Drag & drop a leaf image here, or{" "}
                  <span className="text-primary">click to browse</span>
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Supports JPG, PNG, WEBP (Max 10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files[0]) handleFileSelect(e.target.files[0]);
                  }}
                />
              </div>
            ) : (
              <div className="relative bg-slate-100 rounded-lg p-3 flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={preview}
                    alt="Selected leaf"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(1)} MB &middot; Uploaded
                  </p>
                </div>
                <button
                  onClick={removeFile}
                  className="bg-slate-200 p-1.5 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                  aria-label="Remove file"
                >
                  <span className="material-symbols-outlined text-sm">
                    close
                  </span>
                </button>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing}
              className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all ${
                !file || isAnalyzing
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <span className="material-symbols-outlined animate-spin">
                    progress_activity
                  </span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">psychology</span>
                  Analyze Leaf
                </>
              )}
            </button>

            {error ? (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <span className="material-symbols-outlined text-sm align-middle mr-1">
                  error
                </span>
                {error}
              </div>
            ) : null}
          </section>
        ) : null}

        {/* Results Dashboard */}
        {hasResults ? (
          <section className="space-y-6">
            {/* Card 1: Diagnosis */}
            <DiagnosisCard diagnosis={diagnosis} preview={preview} />

            {/* Card 2: Severity */}
            <SeverityCard severity={severity} loading={severityLoading} />

            {/* Card 3: Treatment Advice */}
            <AdviceCard
              advice={advice}
              loading={adviceLoading}
              activeTab={adviceTab}
              onTabChange={setAdviceTab}
            />

            {/* Card 4: Crop Calendar */}
            <CalendarCard
              calendar={calendar}
              loading={calendarLoading}
              season={calendarSeason}
              location={calendarLocation}
              onSeasonChange={setCalendarSeason}
              onLocationChange={setCalendarLocation}
              onRefresh={refreshCalendar}
            />
          </section>
        ) : null}

        {/* Bottom spacer for action bar */}
        {hasResults ? <div className="h-24"></div> : null}
      </main>

      {/* Bottom Action Bar */}
      {hasResults ? (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-2xl z-50">
          <div className="max-w-[1024px] mx-auto flex flex-wrap justify-center gap-4">
            <button
              onClick={handleUploadAnother}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-xl">
                upload_file
              </span>
              Upload Another
            </button>
            <button
              onClick={handleChangePlant}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-xl">
                swap_horiz
              </span>
              Change Plant
            </button>
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all text-sm shadow-md"
            >
              <span className="material-symbols-outlined text-xl">
                download
              </span>
              Download Report
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

/* ─── Sub-components (defined outside Analyze to avoid re-render issues) ─── */

const SkeletonBlock = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
  </div>
);

const DiagnosisCard = ({ diagnosis, preview }) => {
  const confidencePercent = (diagnosis.confidence * 100).toFixed(1);
  return (
    <div className="bg-white border-l-8 border-primary rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {preview ? (
          <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
            <img
              src={preview}
              alt="Analyzed leaf"
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                {diagnosis.diseaseName}
              </h3>
              {diagnosis.description ? (
                <p className="text-sm text-slate-500">{diagnosis.description}</p>
              ) : null}
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                diagnosis.isHealthy
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {diagnosis.isHealthy ? "Healthy" : "Disease Detected"}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4 relative overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-700"
              style={{ width: `${confidencePercent}%` }}
            ></div>
            <span className="absolute right-2 top-0 text-[10px] leading-4 font-bold text-slate-700">
              {confidencePercent}% Confidence
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SeverityCard = ({ severity, loading }) => {
  if (loading) {
    return (
      <div className="bg-white border-l-8 border-yellow-500 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-yellow-500">assessment</span>
          <h4 className="font-bold text-slate-800 uppercase text-sm tracking-widest">
            Severity & Impact Analysis
          </h4>
        </div>
        <SkeletonBlock />
      </div>
    );
  }
  if (!severity) return null;

  const urgencyColor =
    severity.urgency === "critical" || severity.urgency === "high"
      ? "text-orange-600 bg-orange-50"
      : "text-yellow-600 bg-yellow-50";
  const severityColor =
    severity.severity_level === "severe"
      ? "text-red-600 bg-red-50"
      : "text-yellow-600 bg-yellow-50";

  return (
    <div className="bg-white border-l-8 border-yellow-500 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-yellow-500">assessment</span>
        <h4 className="font-bold text-slate-800 uppercase text-sm tracking-widest">
          Severity & Impact Analysis
        </h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className={`p-3 rounded-lg ${severityColor}`}>
          <p className="text-xs font-bold uppercase">Severity</p>
          <p className="text-lg font-bold capitalize">{severity.severity_level}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 font-bold uppercase">Affected Area</p>
          <p className="text-lg font-bold">{severity.affected_area_percent}%</p>
        </div>
        <div className={`p-3 rounded-lg ${urgencyColor}`}>
          <p className="text-xs font-bold uppercase">Urgency</p>
          <p className="text-lg font-bold capitalize">{severity.urgency}</p>
        </div>
      </div>
      <div className="space-y-3">
        <p className="font-bold text-sm text-slate-800">Immediate Actions:</p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
          {severity.immediate_actions.map((action, i) => (
            <li key={i}>{action}</li>
          ))}
        </ul>
      </div>
      {severity.detailed_analysis ? (
        <p className="mt-4 text-sm text-slate-600 italic border-t border-slate-100 pt-4">
          {severity.detailed_analysis}
        </p>
      ) : null}
    </div>
  );
};

const adviceTabs = [
  { key: "treatment", label: "Treatment" },
  { key: "prevention", label: "Prevention" },
  { key: "care_instructions", label: "Care Guide" },
];

const AdviceCard = ({ advice, loading, activeTab, onTabChange }) => {
  if (loading) {
    return (
      <div className="bg-white border-l-8 border-blue-500 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-blue-500">healing</span>
          <h4 className="font-bold text-slate-800 uppercase text-sm tracking-widest">
            Treatment Plan
          </h4>
        </div>
        <SkeletonBlock />
      </div>
    );
  }
  if (!advice) return null;

  return (
    <div className="bg-white border-l-8 border-blue-500 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-blue-500">healing</span>
        <h4 className="font-bold text-slate-800 uppercase text-sm tracking-widest">
          Treatment Plan
        </h4>
      </div>
      <div className="flex border-b border-slate-100 mb-4 overflow-x-auto">
        {adviceTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-6 py-2 text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-slate-500 font-medium hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-slate-50 p-4 rounded-lg text-sm leading-relaxed text-slate-700 italic border border-slate-200">
        {advice[activeTab]}
      </div>
    </div>
  );
};

const CalendarCard = ({
  calendar,
  loading,
  season,
  location,
  onSeasonChange,
  onLocationChange,
  onRefresh,
}) => {
  if (loading) {
    return (
      <div className="bg-white border-l-8 border-purple-500 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-purple-500">
            calendar_today
          </span>
          <h4 className="font-bold text-slate-800 uppercase text-sm tracking-widest">
            Action Timeline
          </h4>
        </div>
        <SkeletonBlock />
      </div>
    );
  }
  if (!calendar) return null;

  return (
    <div className="bg-white border-l-8 border-purple-500 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-purple-500">
          calendar_today
        </span>
        <h4 className="font-bold text-slate-800 uppercase text-sm tracking-widest">
          Action Timeline
        </h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase text-slate-500">
            Current Season
          </label>
          <select
            value={season}
            onChange={(e) => onSeasonChange(e.target.value)}
            className="bg-slate-50 border-slate-200 rounded-lg text-sm p-2"
          >
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
            <option value="Winter">Winter</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase text-slate-500">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="bg-slate-50 border-slate-200 rounded-lg text-sm p-2"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={onRefresh}
            className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Refresh
          </button>
        </div>
      </div>
      <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
        {calendar.timeline.map((item, i) => (
          <div key={i} className="relative">
            <div
              className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full ring-4 ${
                i === 0
                  ? "bg-purple-500 ring-purple-100"
                  : "bg-slate-300 ring-slate-50"
              }`}
            ></div>
            <p className="font-bold text-sm text-slate-900">
              {item.week}: {item.action}
            </p>
            <p className="text-xs text-slate-600">{item.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analyze;
