'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import type { Vestiging } from '@/types';
import {
  ShieldCheckIcon,
  HomeModernIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  MapPinIcon,
  EnvelopeIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { Kotaanbod } from './kotaanbod';

export function OverOnsContent({ vestigingen }: { vestigingen: Vestiging[] }) {
  const { t } = useTranslation();

  const values = [
    { icon: ShieldCheckIcon, title: t('over_ons.values.items.0.title' as any), desc: t('over_ons.values.items.0.desc' as any) },
    { icon: StarIcon, title: t('over_ons.values.items.1.title' as any), desc: t('over_ons.values.items.1.desc' as any) },
    { icon: UserGroupIcon, title: t('over_ons.values.items.2.title' as any), desc: t('over_ons.values.items.2.desc' as any) },
    { icon: WrenchScrewdriverIcon, title: t('over_ons.values.items.3.title' as any), desc: t('over_ons.values.items.3.desc' as any) },
  ];

  const steps = [
    { number: '01', title: t('over_ons.steps.items.0.title' as any), desc: t('over_ons.steps.items.0.desc' as any) },
    { number: '02', title: t('over_ons.steps.items.1.title' as any), desc: t('over_ons.steps.items.1.desc' as any) },
    { number: '03', title: t('over_ons.steps.items.2.title' as any), desc: t('over_ons.steps.items.2.desc' as any) },
    { number: '04', title: t('over_ons.steps.items.3.title' as any), desc: t('over_ons.steps.items.3.desc' as any) },
  ];

  return (
    <>
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white/80 uppercase tracking-widest mb-6">
            {t('over_ons.hero.badge' as any)}
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {t('over_ons.hero.title' as any)}<br />
            <span className="text-secondary-300">{t('over_ons.hero.title_highlight' as any)}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/75 max-w-2xl leading-relaxed">
            {t('over_ons.hero.desc' as any)}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/koten"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-colors"
            >
              {t('over_ons.hero.btn_rooms' as any)}
            </Link>
            <Link
              href="/afspraken"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-semibold transition-colors"
            >
              <CalendarDaysIcon className="w-5 h-5" />
              {t('over_ons.hero.btn_visit' as any)}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-surface-card border-b border-border-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 text-center">
            {[
              { value: '4', label: t('over_ons.stats.buildings' as any) },
              { value: 'KU Leuven', label: t('over_ons.stats.kotlabel' as any) },
              { value: '100%', label: t('over_ons.stats.fire' as any) },
              { value: '€0', label: t('over_ons.stats.fees' as any) },
            ].map(({ value, label }) => (
              <div key={label}>
                <dt className="font-display text-3xl font-bold text-primary-700">{value}</dt>
                <dd className="mt-1 text-sm text-neutral-500">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3 block">
              {t('over_ons.story.label' as any)}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-5 leading-tight">
              {t('over_ons.story.title' as any)}
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>{t('over_ons.story.p1' as any)}</p>
              <p>
                {t('over_ons.story.p2' as any)} <strong className="text-primary-800">{t('over_ons.story.p2_strong' as any)}</strong>
              </p>
              <p>{t('over_ons.story.p3' as any)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-50 rounded-2xl p-6 flex flex-col gap-2">
              <AcademicCapIcon className="w-8 h-8 text-primary-600" />
              <p className="font-semibold text-primary-900 text-sm">{t('over_ons.features.f1_title' as any)}</p>
              <p className="text-xs text-neutral-500">{t('over_ons.features.f1_desc' as any)}</p>
            </div>
            <div className="bg-accent-50 rounded-2xl p-6 flex flex-col gap-2">
              <ShieldCheckIcon className="w-8 h-8 text-accent-600" />
              <p className="font-semibold text-primary-900 text-sm">{t('over_ons.features.f2_title' as any)}</p>
              <p className="text-xs text-neutral-500">{t('over_ons.features.f2_desc' as any)}</p>
            </div>
            <div className="bg-secondary-50 rounded-2xl p-6 flex flex-col gap-2">
              <HomeModernIcon className="w-8 h-8 text-secondary-600" />
              <p className="font-semibold text-primary-900 text-sm">{t('over_ons.features.f3_title' as any)}</p>
              <p className="text-xs text-neutral-500">{t('over_ons.features.f3_desc' as any)}</p>
            </div>
            <div className="bg-primary-50 rounded-2xl p-6 flex flex-col gap-2">
              <WrenchScrewdriverIcon className="w-8 h-8 text-primary-600" />
              <p className="font-semibold text-primary-900 text-sm">{t('over_ons.features.f4_title' as any)}</p>
              <p className="text-xs text-neutral-500">{t('over_ons.features.f4_desc' as any)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-main border-y border-border-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3 block">
              {t('over_ons.values.label' as any)}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900">
              {t('over_ons.values.title' as any)}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-surface-card rounded-2xl p-6 border border-border-light hover:border-primary-200 hover:shadow-soft transition-all">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Kotaanbod />

      <section className="bg-primary-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary-400 mb-3 block">
              {t('over_ons.steps.label' as any)}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              {t('over_ons.steps.title' as any)}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ number, title, desc }) => (
              <div key={number} className="relative">
                <div className="text-5xl font-display font-bold text-white/10 mb-3">{number}</div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/afspraken"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-colors"
            >
              <CalendarDaysIcon className="w-5 h-5" />
              {t('over_ons.steps.btn' as any)}
            </Link>
            <p className="mt-3 text-xs text-white/40">{t('over_ons.steps.btn_sub' as any)}</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3 block">
            {t('over_ons.locations.label' as any)}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900">
            {t('over_ons.locations.title' as any)}
          </h2>
          <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
            {t('over_ons.locations.desc' as any)}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {vestigingen.map((v) => (
            <Link
              key={v.id}
              href={`/vestigingen/${v.id}`}
              className="group relative h-64 rounded-2xl overflow-hidden block"
            >
              {v.image_url ? (
                <Image
                  src={v.image_url}
                  alt={v.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-primary-100" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-display font-bold text-white text-lg leading-tight">{v.name}</h3>
                    <p className="text-white/70 text-sm flex items-center gap-1 mt-0.5">
                      <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
                      {v.city}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-white bg-white/20 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full group-hover:bg-accent-500 group-hover:border-accent-500 transition-colors">
                    {t('over_ons.locations.btn_view' as any)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/vestigingen"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border-mid text-primary-700 hover:bg-primary-50 rounded-xl text-sm font-medium transition-colors"
          >
            {t('over_ons.locations.btn_all' as any)}
          </Link>
        </div>
      </section>

      <section className="bg-surface-main border-t border-border-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-surface-card border border-border-light rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-8 justify-between">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-900 mb-2">
                {t('over_ons.contact.title' as any)}
              </h2>
              <p className="text-neutral-700 max-w-lg">
                {t('over_ons.contact.desc' as any)}
              </p>
              <a
                href="mailto:dominique@mijn-kot.be"
                className="inline-flex items-center gap-2 mt-4 text-primary-600 hover:text-primary-800 font-medium transition-colors"
              >
                <EnvelopeIcon className="w-5 h-5" />
                dominique@mijn-kot.be
              </a>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-border-mid text-primary-700 hover:bg-primary-50 rounded-xl text-sm font-semibold transition-colors"
              >
                {t('over_ons.contact.btn_contact' as any)}
              </Link>
              <Link
                href="/afspraken"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                <CalendarDaysIcon className="w-4 h-4" />
                {t('over_ons.contact.btn_visit' as any)}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
