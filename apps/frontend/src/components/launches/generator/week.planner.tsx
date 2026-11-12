'use client';

import React, { FC, useCallback, useState } from 'react';
import clsx from 'clsx';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { Button } from '@gitroom/react/form/button';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import {
  CalendarWeekProvider,
  useCalendar,
} from '@gitroom/frontend/components/launches/calendar.context';
import { newDayjs } from '@gitroom/frontend/components/layout/set.timezone';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useToaster } from '@gitroom/react/toaster/toaster';

interface PlannedPost {
  angle: string;
  post: string;
  variations?: string[];
  loading?: boolean;
}

const field =
  'w-full rounded-[8px] border border-newBorder bg-newBgColorInner px-[12px] py-[10px] text-[14px] text-textColor outline-none focus:border-btnPrimary';

const WeekPlannerPopup: FC = () => {
  const { integrations, reloadCalendarView } = useCalendar();
  const modal = useModals();
  const fetch = useFetch();
  const toaster = useToaster();
  const t = useT();

  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState<'personal' | 'company'>('personal');
  const [time, setTime] = useState('10:00');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [posts, setPosts] = useState<PlannedPost[]>([]);
  const available = integrations.filter((f) => !f.disabled);
  const [selected, setSelected] = useState<string[]>(
    available.map((p) => p.id)
  );

  // the plan starts tomorrow, in the timezone the calendar is shown in
  const dayOf = useCallback(
    (index: number) => {
      const [hours, minutes] = time.split(':').map(Number);
      return newDayjs()
        .add(index + 1, 'day')
        .hour(hours || 0)
        .minute(minutes || 0)
        .second(0);
    },
    [time]
  );

  const update = useCallback(
    (index: number, change: Partial<PlannedPost>) => {
      setPosts((list) =>
        list.map((p, i) => (i === index ? { ...p, ...change } : p))
      );
    },
    []
  );

  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/posts/generator/week', {
        method: 'POST',
        body: JSON.stringify({
          topic,
          tone,
          ...(audience ? { audience } : {}),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data?.posts?.length) {
        toaster.show(
          data?.message ||
            t('week_plan_failed', 'Could not generate a plan, please try again'),
          'warning'
        );
        return;
      }
      setPosts(data.posts);
    } finally {
      setLoading(false);
    }
  }, [topic, tone, audience]);

  const variations = useCallback(
    (index: number) => async () => {
      update(index, { loading: true });
      try {
        const response = await fetch('/posts/generator/variations', {
          method: 'POST',
          body: JSON.stringify({ content: posts[index].post }),
        });
        const data = await response.json();
        if (!response.ok || !data?.variations?.length) {
          toaster.show(
            data?.message ||
              t('variations_failed', 'Could not generate variations'),
            'warning'
          );
          return;
        }
        update(index, { variations: data.variations });
      } finally {
        update(index, { loading: false });
      }
    },
    [posts]
  );

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const response = await fetch('/posts/generator/week/draft', {
        method: 'POST',
        body: JSON.stringify({
          integrations: selected,
          posts: posts
            .map((p, index) => ({
              content: p.post.trim(),
              date: dayOf(index).utc().format('YYYY-MM-DDTHH:mm:ss'),
            }))
            .filter((p) => p.content),
        }),
      });
      if (!response.ok) {
        toaster.show(
          t('week_plan_save_failed', 'Could not save the drafts'),
          'warning'
        );
        return;
      }
      toaster.show(
        t('week_plan_saved', 'Drafts added to your calendar'),
        'success'
      );
      reloadCalendarView();
      modal.closeAll();
    } finally {
      setSaving(false);
    }
  }, [posts, selected, dayOf]);

  if (!posts.length) {
    return (
      <div className="flex flex-col gap-[16px] text-textColor">
        <div className="text-[14px] text-newTextColor/70">
          {t(
            'week_plan_description',
            'Describe a topic and get seven draft posts, one per day, starting tomorrow. Nothing is published until you schedule it.'
          )}
        </div>
        <div className="flex flex-col gap-[6px]">
          <label className="text-[14px]">{t('topic', 'Topic')}</label>
          <textarea
            className={clsx(field, 'min-h-[110px] resize-none')}
            placeholder={t(
              'week_plan_topic_placeholder',
              'e.g. Why small clinics should answer every Google review'
            )}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex gap-[12px] mobile:flex-col">
          <div className="flex flex-1 flex-col gap-[6px]">
            <label className="text-[14px]">
              {t('audience_optional', 'Audience (optional)')}
            </label>
            <input
              className={field}
              placeholder={t('audience_placeholder', 'Who is this for?')}
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex w-[200px] mobile:w-full flex-col gap-[6px]">
            <label className="text-[14px]">{t('voice', 'Voice')}</label>
            <select
              className={field}
              value={tone}
              onChange={(e) => setTone(e.target.value as 'personal' | 'company')}
              disabled={loading}
            >
              <option value="personal">{t('personal_voice', 'Personal (I)')}</option>
              <option value="company">{t('company_voice', 'Company (we)')}</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={generate}
            disabled={topic.trim().length < 3}
            loading={loading}
          >
            {t('plan_my_week', 'Plan my week')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[16px] text-textColor">
      <div className="flex flex-wrap items-end gap-[16px]">
        <div className="flex flex-1 min-w-[220px] flex-col gap-[6px]">
          <div className="text-[14px]">{t('channels', 'Channels')}</div>
          <div className="flex flex-wrap gap-[6px]">
            {available.map((p) => {
              const on = selected.includes(p.id);
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() =>
                    setSelected((list) =>
                      on ? list.filter((f) => f !== p.id) : [...list, p.id]
                    )
                  }
                  className={clsx(
                    'flex items-center gap-[6px] rounded-full border px-[10px] py-[5px] text-[13px]',
                    on
                      ? 'border-btnPrimary bg-btnPrimary/20'
                      : 'border-newBorder opacity-60'
                  )}
                >
                  <img
                    src={p.picture || '/no-picture.jpg'}
                    className="h-[18px] w-[18px] rounded-full"
                    alt=""
                  />
                  <span className="max-w-[140px] truncate">{p.name}</span>
                  <span className="text-[11px] opacity-60">
                    {p.identifier}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-[6px]">
          <label className="text-[14px]">{t('post_time', 'Post time')}</label>
          <input
            type="time"
            className={clsx(field, 'w-[130px]')}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      <div className="flex max-h-[55vh] flex-col gap-[10px] overflow-y-auto pe-[4px]">
        {posts.map((p, index) => (
          <div
            key={index}
            className="rounded-[10px] border border-newBorder bg-newBgColorInner p-[12px]"
          >
            <div className="mb-[8px] flex items-center justify-between gap-[8px] text-[13px]">
              <div>
                <span className="font-[600]">
                  {dayOf(index).format('dddd, MMM D')}
                </span>
                <span className="ms-[8px] opacity-60">{p.angle}</span>
              </div>
              <div className="flex items-center gap-[12px]">
                <span
                  className={clsx(
                    'opacity-60',
                    p.post.length > 280 && '!opacity-100 text-red-400'
                  )}
                >
                  {p.post.length}
                </span>
                <button
                  type="button"
                  className="underline hover:font-[600] disabled:opacity-50"
                  onClick={variations(index)}
                  disabled={p.loading}
                >
                  {p.loading
                    ? t('generating', 'Generating…')
                    : t('variations', 'Variations')}
                </button>
                <button
                  type="button"
                  className="underline hover:font-[600]"
                  onClick={() =>
                    setPosts((list) => list.filter((_, i) => i !== index))
                  }
                >
                  {t('remove', 'Remove')}
                </button>
              </div>
            </div>
            <textarea
              className={clsx(field, 'min-h-[84px] resize-none !bg-transparent')}
              value={p.post}
              onChange={(e) => update(index, { post: e.target.value })}
            />
            {!!p.variations?.length && (
              <div className="mt-[8px] flex flex-col gap-[6px]">
                {p.variations.map((v, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => update(index, { post: v, variations: [] })}
                    className="rounded-[8px] border border-dashed border-newBorder p-[10px] text-start text-[13px] hover:border-btnPrimary"
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between gap-[8px]">
        <Button secondary={true} onClick={() => setPosts([])} disabled={saving}>
          {t('start_over', 'Start over')}
        </Button>
        <Button
          onClick={save}
          loading={saving}
          disabled={!selected.length || !posts.some((p) => p.post.trim())}
        >
          {t('add_drafts_to_calendar', 'Add drafts to calendar')}
        </Button>
      </div>
    </div>
  );
};

export const WeekPlannerComponent: FC = () => {
  const t = useT();
  const modal = useModals();
  const all = useCalendar();
  const open = useCallback(() => {
    modal.openModal({
      title: t('plan_a_week_with_ai', 'Plan a week with AI'),
      size: 'xl',
      children: (
        <CalendarWeekProvider {...all}>
          <WeekPlannerPopup />
        </CalendarWeekProvider>
      ),
    });
  }, [all]);

  return (
    <div
      className="h-[44px] w-[44px] min-w-[44px] group-[.sidebar]:w-full bg-ai text-white justify-center items-center flex rounded-[8px] cursor-pointer"
      onClick={open}
      title={t('plan_a_week_with_ai', 'Plan a week with AI')}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M3 10h18M8 3v4M16 3v4M12 13.2l.9 1.9 1.9.9-1.9.9-.9 1.9-.9-1.9-1.9-.9 1.9-.9z" />
      </svg>
    </div>
  );
};
