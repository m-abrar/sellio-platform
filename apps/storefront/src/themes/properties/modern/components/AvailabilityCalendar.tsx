'use client';

import React, { useMemo, useState } from 'react';
import type { PropertyBookingBlock } from '../property-detail-types';
import { isDateWithinBooking } from '../property-detail-utils';

interface AvailabilityCalendarProps {
  bookings: PropertyBookingBlock[];
  minimumRentalDays?: number;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }
  return cells;
}

export function AvailabilityCalendar({
  bookings,
  minimumRentalDays,
}: AvailabilityCalendarProps) {
  const [offset, setOffset] = useState(0);

  const viewDate = useMemo(() => {
    const base = new Date();
    return new Date(base.getFullYear(), base.getMonth() + offset, 1);
  }, [offset]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const cells = useMemo(() => buildMonthDays(year, month), [year, month]);

  return (
    <section className="pm-detail-block">
      <span className="structure-grid-kicker">Availability</span>
      <h2 className="pm-detail-block__title">Booked dates.</h2>
      {minimumRentalDays ? (
        <p className="pm-detail-block__copy">Minimum stay: {minimumRentalDays} nights</p>
      ) : null}

      <div className="pm-calendar-nav">
        <button type="button" className="pm-calendar-nav__btn" onClick={() => setOffset((v) => v - 1)}>
          ←
        </button>
        <span>{monthLabel}</span>
        <button type="button" className="pm-calendar-nav__btn" onClick={() => setOffset((v) => v + 1)}>
          →
        </button>
      </div>

      <div className="pm-calendar-weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="pm-calendar-grid">
        {cells.map((date, index) => {
          if (!date) {
            return <span key={`empty-${index}`} className="pm-calendar-day pm-calendar-day--empty" />;
          }
          const booked = isDateWithinBooking(date, bookings);
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <span
              key={date.toISOString()}
              className={`pm-calendar-day${booked ? ' pm-calendar-day--booked' : ''}${isToday ? ' pm-calendar-day--today' : ''}`}
              title={booked ? 'Booked' : 'Available'}
            >
              {date.getDate()}
            </span>
          );
        })}
      </div>

      <div className="pm-calendar-legend">
        <span>
          <i className="pm-calendar-legend__swatch pm-calendar-legend__swatch--booked" />
          Booked
        </span>
        <span>
          <i className="pm-calendar-legend__swatch pm-calendar-legend__swatch--open" />
          Open
        </span>
      </div>
    </section>
  );
}
