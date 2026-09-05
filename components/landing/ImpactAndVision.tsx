import React from "react";
import Link from "next/link";
import { 
  Users, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight, 
  Lock, 
  HeartHandshake, 
  HardHat, 
  GraduationCap, 
  Activity,
  Layers
} from "lucide-react";

export const ImpactAndVision = () => {
  const beneficiaryGroups = [
    {
      icon: HardHat,
      title: "Outdoor & Construction Workers",
      description: "Daily wage earners, traffic police, gig delivery riders, and farmers exposed to unmitigated solar radiation and vehicular emissions. SwasthyaSathi AI provides actionable work-rest cycles and hydration reminders to avert heat stroke.",
    },
    {
      icon: HeartHandshake,
      title: "Elderly & Chronic Cardiac Patients",
      description: "Senior citizens whose vascular systems struggle to compensate during simultaneous heat and high PM2.5 smog events. SwasthyaSathi AI provides tailored indoor safety thresholds and resting pulse check reminders.",
    },
    {
      icon: Activity,
      title: "Asthma & Respiratory Patients",
      description: "Individuals prone to severe bronchospasms during seasonal crop-burning or winter thermal inversions. SwasthyaSathi AI provides timely advance warnings before stepping into high-risk particulate zones.",
    },
    {
      icon: GraduationCap,
      title: "Students & Academic Campuses",
      description: "Schools and universities scheduling outdoor physical education or inter-school athletics during humid summer peaks. Empowers administrators with objective heat safety parameters.",
    },
  ];

  const teamMembers = [
    {
      name: "Lead Full-Stack & Systems Engineer",
      role: "Architecture, Deterministic Risk Engine, Next.js Infrastructure",
      tag: "Engineering",
    },
    {
      name: "HealthTech & Clinical Protocols Researcher",
      role: "Environmental Thresholds, Heat-Index Formulations, Triage Rules",
      tag: "Domain Research",
    },
    {
      name: "Frontend & Accessibility Designer",
      role: "Clinical-Telemetry Design System, Responsive UX, Micro-interactions",
      tag: "Design & UX",
    },
    {
      name: "Embedded & Edge Systems Specialist",
      role: "Future Android Edge ML Pipeline, Sensor BLE Telemetry Architecture",
      tag: "Hardware & Edge",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* 1. Real-World Impact Section */}
      <section className="py-16 sm:py-20 bg-white border-t border-surface-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-surface-container-high text-xs font-mono text-primary font-semibold">
              <Users className="w-3.5 h-3.5" />
              <span>Real-World Demographics</span>
            </div>
            <h2 className="font-headline font-bold text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight">
              Built for Those Most Vulnerable to Climate Extremes
            </h2>
            <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed">
              We present our impact honestly: no fabricated statistics or fictitious testimonials. 
              Instead, here are the concrete user profiles who directly benefit from individualized risk translation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {beneficiaryGroups.map((group, idx) => {
              const Icon = group.icon;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl p-6 bg-surface-container-low border border-surface-container interactive-card flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-surface-container flex items-center justify-center text-primary flex-shrink-0 shadow-xs">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-lg text-on-surface mb-1.5">
                      {group.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      {group.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. Privacy Architecture Highlight Strip */}
      <section className="py-12 bg-primary text-white border-t border-primary-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary-container text-xs font-mono text-primary-fixed">
                <Lock className="w-3.5 h-3.5" />
                <span>Strict Data Minimization Guarantee</span>
              </div>
              <h3 className="font-headline font-bold text-xl sm:text-2xl text-white">
                Zero Medical History Stored. 100% Transparent.
              </h3>
              <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                We only collect broad sensitivity flags (e.g. &ldquo;respiratory sensitivity&rdquo;) to calculate risk multipliers. 
                No diagnoses, hospital records, or identity trackers are ever persisted or exposed.
              </p>
            </div>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary text-xs sm:text-sm font-bold hover:bg-surface-container transition-colors shadow-sm flex-shrink-0"
            >
              <span>Read Full Privacy Architecture</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Future Roadmap / Mobile Vision */}
      <section className="py-16 sm:py-20 bg-surface-container-low border-t border-surface-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-fixed text-tertiary text-xs font-mono font-bold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Future Roadmap (Beyond Round 1)</span>
            </div>
            <h2 className="font-headline font-bold text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight">
              Hardware Track Vision: Wearable Telemetry &amp; Edge Sync
            </h2>
            <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed">
              While Round 1 delivers an accessible, responsive Next.js web application, our architecture is specifically 
              structured so it will not block native mobile deployment and hardware telemetry ingestion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-white border border-surface-container space-y-3">
              <span className="text-xs font-mono text-tertiary font-bold uppercase">Milestone A</span>
              <h4 className="font-headline font-bold text-base text-on-surface">React Native / Android Client</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Porting the UI layer to a cross-platform mobile app with background geofencing and push notification capabilities for critical climate alerts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-surface-container space-y-3">
              <span className="text-xs font-mono text-primary font-bold uppercase">Milestone B</span>
              <h4 className="font-headline font-bold text-base text-on-surface">BLE Wearable Ingestion</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Connecting low-cost smart bands via Bluetooth Low Energy to stream real-time physiological vitals (resting HR, SpO2, skin temp) directly to the phone.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-surface-container space-y-3">
              <span className="text-xs font-mono text-secondary font-bold uppercase">Milestone C</span>
              <h4 className="font-headline font-bold text-base text-on-surface">On-Device Edge ML Inference</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Deploying quantized TensorFlow Lite models to predict syncope, heat exhaustion, and cardiovascular strain completely offline without cloud latency.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Team Placeholder Section (SIH Hackathon Team) */}
      <section className="py-16 bg-white border-t border-surface-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-surface-container-high text-xs font-mono text-outline font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Project Contributors</span>
            </div>
            <h2 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface tracking-tight">
              Smart India Hackathon 2026 Team (SIH26181)
            </h2>
            <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
              Modular team roles representing full-stack architecture, clinical domain research, UX, and hardware integration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-xl bg-surface-container-low border border-surface-container space-y-2 text-left"
              >
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-container text-primary font-bold">
                  {member.tag}
                </span>
                <h4 className="font-headline font-bold text-sm text-on-surface pt-1">
                  {member.name}
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {member.role}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

