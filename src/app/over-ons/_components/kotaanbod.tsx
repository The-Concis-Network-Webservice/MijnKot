'use client';

import { useTranslation } from 'react-i18next';
import {
  HomeModernIcon,
  HomeIcon,
  UserGroupIcon,
  ArrowsUpDownIcon,
  SunIcon,
} from '@heroicons/react/24/outline';

const iconsMapping: Record<string, React.ElementType> = {
  student_rooms: HomeModernIcon,
  duplex: ArrowsUpDownIcon,
  studios: HomeIcon,
  studios_terrace: SunIcon,
  double_rooms: UserGroupIcon,
};

export function Kotaanbod() {
  const { t } = useTranslation();

  const keys = ['student_rooms', 'duplex', 'studios', 'studios_terrace', 'double_rooms'];

  return (
    <section className="bg-[#f3ede6] py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3 block">
            {t('kotaanbod.label' as any)}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900">
            {t('kotaanbod.title' as any)}
          </h2>
          <p className="mt-3 text-neutral-500 max-w-xl mx-auto">
            {t('kotaanbod.description' as any)}
          </p>
        </div>
        <div className="divide-y divide-[#dfd8cd]">
          {keys.map((key) => {
            const Icon = iconsMapping[key];
            return (
              <div key={key} className="flex items-center gap-5 py-5 group">
                <div className="flex-shrink-0 w-11 h-11 bg-primary-500 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-primary-900">
                    {t(`kotaanbod.${key}.title` as any)}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-0.5 leading-relaxed">
                    {t(`kotaanbod.${key}.desc` as any)}
                  </p>
                </div>
                <div className="flex-shrink-0 pl-4 text-right">
                  <span className="text-base font-bold text-primary-500 tabular-nums">
                    {t(`kotaanbod.${key}.size` as any)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
