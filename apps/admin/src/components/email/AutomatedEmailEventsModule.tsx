"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Settings2,
} from "lucide-react";

interface EventMapping {
  id: string;
  event_key: string;
  event_name: string;
  description: string;
  template_id?: string;
  is_enabled: number;
  trigger_timing: string;
  updated_at: string;
}

interface TemplateOption {
  id: string;
  name: string;
}

export function AutomatedEmailEventsModule() {
  const [events, setEvents] = useState<EventMapping[]>([]);
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, tplRes] = await Promise.all([
        fetch("http://localhost:4000/api/v1/admin/email/events"),
        fetch("http://localhost:4000/api/v1/admin/email/templates"),
      ]);

      const eventsJson = await eventsRes.json();
      const tplJson = await tplRes.json();

      if (eventsJson.success && Array.isArray(eventsJson.data)) {
        setEvents(eventsJson.data);
      }
      if (tplJson.success && Array.isArray(tplJson.data)) {
        setTemplates(tplJson.data);
      }
    } catch (err) {
      console.error("Failed to load event mappings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleEnable = async (event: EventMapping) => {
    const newStatus = event.is_enabled ? 0 : 1;
    try {
      setSavingId(event.id);
      const res = await fetch(`http://localhost:4000/api/v1/admin/email/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_enabled: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setEvents((prev) =>
          prev.map((e) => (e.id === event.id ? { ...e, is_enabled: newStatus } : e))
        );
      }
    } catch (err) {
      alert("Failed to toggle event trigger");
    } finally {
      setSavingId(null);
    }
  };

  const handleChangeTemplate = async (eventId: string, newTemplateId: string) => {
    try {
      setSavingId(eventId);
      const res = await fetch(`http://localhost:4000/api/v1/admin/email/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_id: newTemplateId }),
      });
      const json = await res.json();
      if (json.success) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, template_id: newTemplateId } : e))
        );
      }
    } catch (err) {
      alert("Failed to assign template to event");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0076D7] uppercase tracking-wider">
          <Zap className="w-4 h-4" />
          <span>System Trigger Mappings</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1220] tracking-tight mt-1">
          Automated Email Events
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Bind platform backend events (customer signup, merchant verification, billing invoices) to approved dynamic templates.
        </p>
      </div>

      {/* Events Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700">Platform Trigger Matrix</div>
          <div className="text-xs text-slate-400 font-medium">
            Active: {events.filter((e) => e.is_enabled).length} of {events.length}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading event mappings...</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition"
              >
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{evt.event_name}</span>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                      {evt.event_key}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{evt.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Select Template */}
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <select
                      value={evt.template_id || ""}
                      onChange={(e) => handleChangeTemplate(evt.id, e.target.value)}
                      disabled={savingId === evt.id}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0076D7]"
                    >
                      <option value="">-- No Template Assigned --</option>
                      {templates.map((tpl) => (
                        <option key={tpl.id} value={tpl.id}>
                          {tpl.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Timing Pill */}
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{evt.trigger_timing || "IMMEDIATE"}</span>
                  </div>

                  {/* Enable / Disable Switch */}
                  <button
                    onClick={() => handleToggleEnable(evt)}
                    disabled={savingId === evt.id}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      evt.is_enabled ? "bg-[#16A34A]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        evt.is_enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

