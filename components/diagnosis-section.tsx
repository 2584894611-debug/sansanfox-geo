"use client";

import { BrandDiagnosisForm } from "@/components/brand-diagnosis-form";

export function DiagnosisSection() {
  return (
    <section id="diagnose" className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[#1A365D]">立即诊断你的品牌GEO</h2>
          <p className="mt-2 text-[#718096]">无需注册，输入品牌名即可获得完整诊断报告</p>
        </div>
        <BrandDiagnosisForm />
      </div>
    </section>
  );
}
