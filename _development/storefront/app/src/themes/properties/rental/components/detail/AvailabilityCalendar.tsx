'use client';

import { useMemo, useState } from 'react';
import type { PropertyBookingBlock } from '../../property-detail-types';
import { isDateWithinBooking } from '../../property-detail-utils';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < startOffset; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, month, day));
  return cells;
}

interface AvailabilityCalendarProps {
  bookings: PropertyBookingBlock[];
  minimumRentalDays?: number;
}

export function AvailabilityCalendar({ bookings, minimumRentalDays }: AvailabilityCalendarProps) {
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
    <section className="pr-booking-panel__section">
      <span className="pr-kicker">Availability</span>
      <h3 className="pr-booking-panel__section-title">Booked dates</h3>
      {minimumRentalDays ? (
        <p className="pr-detail-block__copy">Minimum stay: {minimumRentalDays} nights</p>
      ) : null}

      <div className="pr-calendar-nav">
        <button type="button" className="pr-calendar-nav__btn" onClick={() => setOffset((v) => v - 1)}>
          ←
        </button>
        <span>{monthLabel}</span>
        <button type="button" className="pr-calendar-nav__btn" onClick={() => setOffset((v) => v + 1)}>
          →
        </button>
      </div>

      <div className="pr-calendar-weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="pr-calendar-grid">
        {cells.map((date, index) => {
          if (!date) {
            return <span key={`empty-${index}`} className="pr-calendar-day pr-calendar-day--empty" />;
          }
          const booked = isDateWithinBooking(date, bookings);
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <span
              key={date.toISOString()}
              className={`pr-calendar-day${booked ? ' pr-calendar-day--booked' : ''}${isToday ? ' pr-calendar-day--today' : ''}`}
              title={booked ? 'Booked' : 'Available'}
            >
              {date.getDate()}
            </span>
          );
        })}
      </div>

      <div className="pr-calendar-legend">
        <span>
          <i className="pr-calendar-legend__swatch pr-calendar-legend__swatch--booked" />
          Booked
        </span>
        <span>
          <i className="pr-calendar-legend__swatch pr-calendar-legend__swatch--open" />
          Available
        </span>
      </div>
    </section>
  );
}
