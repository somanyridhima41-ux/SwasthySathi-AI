import React from "react";
import { 
  AlertOctagon, 
  CheckCircle2, 
  XCircle, 
  SunMedium, 
  Wind, 
  Droplets,
  HelpCircle,
  ShieldAlert,
  Flame,
  CloudFog,
  Waves
} from "lucide-react";

export const Problem = () => {
  const hazardScenarios = [
    {
      icon: Flame,
      title: "Heat Waves & Wet-Bulb Extremes",
      context: "Severe North & Central Indian Summer (40°C–47°C)",
      issue: "A raw temperature number ignores high humidity. When wet-bulb thresholds exceed 31°C, the human body cannot cool itself through sweat alone, triggering fatal heat stroke in outdoor workers and elderly citizens.",
    },
    {
      icon: CloudFog,
      title: "Toxic Smog & Inversion Spikes",
      context: "Winter Air Crises across the Indo-Gangetic Plain",
      issue: "Broad city AQI scores hide micro-zone spikes. For someone with asthma or cardiovascular conditions, exposure to PM2.5 above 250 µg/m³ causes acute bronchospasm and arterial inflammation within 20 minutes.",
    },
    {
      icon: Waves,
      title: "Monsoon Humidity & Urban Flooding",
      context: "Coastal & Urban Inundation Events",
      issue: "Sudden barometric pressure drops coupled with 90%+ relative humidity exacerbate respiratory distress, joint swelling, and vector-borne exposure without early hyper-local warnings.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-surface-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-mono text-red-800 font-semibold">
            <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
            <span>The Core Problem in Climate Health</span>
          </div>
          <h2 className="font-headline font-bold text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight">
            Generic Weather Advisories Fail to Protect Real People
          </h2>
          <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed">
            Standard weather apps broadcast atmospheric measurements designed for a hypothetical &ldquo;average person&rdquo;. 
            In reality, the exact same temperature and air quality produce wildly different biological impacts depending on who you are.
          </p>
        </div>

        {/* The Contrast: Generic vs Personalized */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Card 1: The Broken Generic Standard */}
          <div className="rounded-2xl p-6 sm:p-8 bg-surface-container-low/70 border border-surface-container flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-outline flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Current Standard Weather Apps
                </span>
                <span className="text-xs font-mono bg-red-100 text-red-800 px-2 py-0.5 rounded">
                  Impersonal
                </span>
              </div>

              {/* Simulated Generic App Notification */}
              <div className="bg-white p-4 rounded-xl border border-surface-container shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-outline">
                  <span>Weather Broadcast</span>
                  <span>1:00 PM</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold font-headline text-on-surface">39°C</span>
                  <span className="text-sm text-outline">Feels like 44°C</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold ml-auto">
                    AQI 185 • Poor
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant italic">
                  &ldquo;Sunny and hot throughout the day. Air quality is unhealthy for sensitive groups.&rdquo;
                </p>
              </div>

              {/* Why it fails */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-outline uppercase tracking-wider block">
                  Why this leads to emergencies:
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-on-surface-variant">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>No exposure awareness:</strong> Treats an indoor office worker sitting in air conditioning the same as a construction laborer working on direct asphalt.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Vague &ldquo;Sensitive Groups&rdquo; label:</strong> Leaves individuals guessing whether their specific condition (cardiovascular, asthma, age) is in immediate danger.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Zero actionable guidance:</strong> Fails to provide hydration quantities, mandatory rest intervals, or emergency escalation protocols.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-container text-xs text-outline font-mono">
              Result: Preventable heat stroke, asthma exacerbations, and hospitalizations.
            </div>
          </div>

          {/* Card 2: The SwasthyaSathi AI Personalized Model */}
          <div className="rounded-2xl p-6 sm:p-8 bg-surface-container-lowest border-2 border-primary/30 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  The SwasthyaSathi AI Health Companion
                </span>
                <span className="text-xs font-mono bg-primary-fixed text-primary px-2 py-0.5 rounded font-bold">
                  Personalized
                </span>
              </div>

              {/* Simulated SwasthyaSathi AI Triage Alert */}
              <div className="bg-red-50/80 p-4 rounded-xl border border-red-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-red-900 font-mono">SwasthyaSathi AI Personal Triage</span>
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold">CRITICAL RISK</span>
                </div>
                <p className="text-xs font-semibold text-red-950">
                  Targeted for: Construction Worker (34y, High Direct Sun, No Shade)
                </p>
                <p className="text-xs text-red-900 leading-relaxed">
                  Wet-bulb stress at 39°C direct solar insolation exceeds your body&rsquo;s sweating cooling capacity. High dehydration and cardiac cramp threshold reached.
                </p>
                <div className="pt-2 border-t border-red-200 flex flex-col gap-1 text-[11px] text-red-950 font-medium">
                  <div>✓ Mandatory 15-minute shaded cooling interval immediately</div>
                  <div>✓ Drink 400 mL electrolyte fluid before resuming labor</div>
                  <div>✓ Cease heavy mechanical lifting between 12 PM - 3 PM</div>
                </div>
              </div>

              {/* Why it works */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                  Why this prevents medical crises:
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-on-surface-variant">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>Tailored to your biological vulnerability:</strong> Factors in your exact age group, exertion level, and physiological sensitivities.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>Plain-language clinical reasoning:</strong> Tells you exactly <em>why</em> you are at risk, removing confusing medical jargon.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>Proactive preventive actions:</strong> Provides concrete dosages, rest schedules, and an emergency SOS fail-safe with GPS coordinates.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-container text-xs text-primary font-mono font-semibold">
              Result: Early intervention before physiological stress turns into an emergency.
            </div>
          </div>

        </div>

        {/* Hazard Scenarios Grid (Indian Context) */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="font-headline font-bold text-xl text-on-surface">
              Built for India&rsquo;s Most Urgent Climate Health Challenges
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Frequent extreme weather occurrences in urban and rural India require hyper-local early warnings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hazardScenarios.map((hazard, idx) => {
              const Icon = hazard.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-surface-container-low rounded-xl p-5 border border-surface-container interactive-card"
                >
                  <div className="w-10 h-10 rounded-lg bg-white border border-surface-container-high flex items-center justify-center text-primary mb-3 shadow-xs">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-headline font-bold text-base text-on-surface">
                    {hazard.title}
                  </h4>
                  <span className="text-[11px] font-mono text-outline block mb-2">
                    {hazard.context}
                  </span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {hazard.issue}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

