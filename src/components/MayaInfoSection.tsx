import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { MayaCalendarConstants } from 'calendar-converter/constants';
import type { CalendarInfo } from '../data/calendarInfo';
import {
  MAYA_LONG_PERIOD_GLYPHS,
  mayaHaabSrc,
  mayaLongPeriodSrc,
  mayaLordOfNightSrc,
  mayaNumeralSrc,
  mayaTzolkinSrc,
} from '../data/mayaGlyphAssets';
import { MayaGlyph } from './MayaGlyph';
import { WorldUsageMap } from './WorldUsageMap';

type MayaInfoTab = 'usage' | 'glyphs';

interface MayaInfoSectionProps {
  info: CalendarInfo;
  mapColors: { stroke: string; fill: string };
  usedIn: string[];
}

function GlyphReferenceItem({
  src,
  label,
  detail,
  rotated,
}: {
  src: string;
  label: string;
  detail?: string;
  rotated?: boolean;
}) {
  return (
    <div className="maya-glyphs-ref__item">
      <MayaGlyph
        className={['maya-glyphs-ref__glyph', rotated ? 'maya-glyphs-ref__glyph--rotated' : '']
          .filter(Boolean)
          .join(' ')}
        src={src}
      />
      <span className="maya-glyphs-ref__label">{label}</span>
      {detail ? <span className="maya-glyphs-ref__detail">{detail}</span> : null}
    </div>
  );
}

function GlyphReferenceSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="maya-glyphs-ref__section">
      <h4 className="maya-glyphs-ref__section-title">{title}</h4>
      {description ? <p className="maya-glyphs-ref__section-desc">{description}</p> : null}
      <div className="maya-glyphs-ref__grid">{children}</div>
    </section>
  );
}

export function MayaInfoSection({ info, mapColors, usedIn }: MayaInfoSectionProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<MayaInfoTab>('usage');

  const periodKeys = ['baktun', 'katun', 'tun', 'uinal', 'kin'] as const;

  return (
    <section className="info-modal__map-section" aria-label={t('modals.calendarInfo.maya.sectionAria')}>
      <div className="info-modal__map-tabs" role="tablist" aria-label={t('modals.calendarInfo.maya.tabsAria')}>
        <button
          type="button"
          role="tab"
          id="maya-info-tab-usage"
          aria-selected={activeTab === 'usage'}
          aria-controls="maya-info-panel-usage"
          className={`info-modal__map-tab${activeTab === 'usage' ? ' info-modal__map-tab--active' : ''}`}
          onClick={() => setActiveTab('usage')}
        >
          {t('modals.calendarInfo.whereUsed')}
        </button>
        <button
          type="button"
          role="tab"
          id="maya-info-tab-glyphs"
          aria-selected={activeTab === 'glyphs'}
          aria-controls="maya-info-panel-glyphs"
          className={`info-modal__map-tab${activeTab === 'glyphs' ? ' info-modal__map-tab--active' : ''}`}
          onClick={() => setActiveTab('glyphs')}
        >
          {t('modals.calendarInfo.maya.glyphsTab')}
        </button>
      </div>

      {activeTab === 'usage' ? (
        <div
          id="maya-info-panel-usage"
          role="tabpanel"
          aria-labelledby="maya-info-tab-usage"
        >
          <h3>{t('modals.calendarInfo.whereUsed')}</h3>
          <WorldUsageMap
            highlighted={info.mapCountries}
            strokeColor={mapColors.stroke}
            fillColor={mapColors.fill}
          />
          <ul className="info-modal__countries">
            {usedIn.map((place) => (
              <li key={place}>{place}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div
          id="maya-info-panel-glyphs"
          role="tabpanel"
          aria-labelledby="maya-info-tab-glyphs"
          className="maya-glyphs-ref"
        >
          <p className="maya-glyphs-ref__intro">{t('modals.calendarInfo.maya.glyphsIntro')}</p>

          <GlyphReferenceSection
            title={t('modals.calendarInfo.maya.sections.longCount')}
            description={t('modals.calendarInfo.maya.sections.longCountDesc')}
          >
            {MAYA_LONG_PERIOD_GLYPHS.map((periodId, index) => (
              <GlyphReferenceItem
                key={periodId}
                src={mayaLongPeriodSrc(index)}
                label={t(`datePicker.field.${periodKeys[index]}`)}
              />
            ))}
          </GlyphReferenceSection>

          <GlyphReferenceSection
            title={t('modals.calendarInfo.maya.sections.numerals')}
            description={t('modals.calendarInfo.maya.sections.numeralsDesc')}
          >
            {Array.from({ length: 20 }, (_, value) => (
              <GlyphReferenceItem
                key={value}
                src={mayaNumeralSrc(value)}
                label={String(value)}
              />
            ))}
          </GlyphReferenceSection>

          <GlyphReferenceSection
            title={t('modals.calendarInfo.maya.sections.tzolkin')}
            description={t('modals.calendarInfo.maya.sections.tzolkinDesc')}
          >
            {MayaCalendarConstants.tzolkinDayNames.map((dayName, index) => (
              <GlyphReferenceItem
                key={dayName}
                src={mayaTzolkinSrc(index)}
                label={dayName}
                detail={MayaCalendarConstants.nahualNames[index]}
                rotated
              />
            ))}
          </GlyphReferenceSection>

          <GlyphReferenceSection
            title={t('modals.calendarInfo.maya.sections.haab')}
            description={t('modals.calendarInfo.maya.sections.haabDesc')}
          >
            {MayaCalendarConstants.haabMonthNames.map((monthName, index) => (
              <GlyphReferenceItem
                key={monthName}
                src={mayaHaabSrc(index)}
                label={monthName}
                rotated
              />
            ))}
          </GlyphReferenceSection>

          <GlyphReferenceSection
            title={t('modals.calendarInfo.maya.sections.lords')}
            description={t('modals.calendarInfo.maya.sections.lordsDesc')}
          >
            {MayaCalendarConstants.lordOfNightNames.map((lordName, index) => (
              <GlyphReferenceItem
                key={lordName}
                src={mayaLordOfNightSrc(index + 1)}
                label={lordName}
                detail={`G${index + 1}`}
                rotated
              />
            ))}
          </GlyphReferenceSection>

          <p className="maya-glyphs-ref__credit">{t('modals.calendarInfo.maya.glyphsCredit')}</p>
        </div>
      )}
    </section>
  );
}
