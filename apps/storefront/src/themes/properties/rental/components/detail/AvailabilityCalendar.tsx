'use client';

import { useMemo, useState } from 'react';
import type { PropertyBookingBlock } from '../../property-detail-types';
import {
  countNightsBetween,
  formatLocalDate,
  isDateWithinBooking,
  isPastDate,
  isStayRangeBlocked,
} from '../../property-detail-utils';

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

function isDateInRange(day: string, checkIn: string, checkOut: string): boolean {
  if (!checkIn || !checkOut) {
    return false;
  }

  return day > checkIn && day < checkOut;
}

interface AvailabilityCalendarProps {
  bookings: PropertyBookingBlock[];
  minimumRentalDays?: number;
  checkIn?: string;
  checkOut?: string;
  onCheckInChange?: (value: string) => void;
  onCheckOutChange?: (value: string) => void;
}

export function AvailabilityCalendar({
  bookings,
  minimumRentalDays,
  checkIn = '',
  checkOut = '',
  onCheckInChange,
  onCheckOutChange,
}: AvailabilityCalendarProps) {
  const [offset, setOffset] = useState(0);
  const [rangeError, setRangeError] = useState<string | null>(null);
  const interactive = Boolean(onCheckInChange && onCheckOutChange);

  const viewDate = useMemo(() => {
    const base = new Date();
    return new Date(base.getFullYear(), base.getMonth() + offset, 1);
  }, [offset]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const cells = useMemo(() => buildMonthDays(year, month), [year, month]);

  function handleDaySelect(date: Date) {
    if (!interactive) {
      return;
    }

    const day = formatLocalDate(date);
    const booked = isDateWithinBooking(date, bookings);
    const disabled = isPastDate(date) || booked;

    if (disabled) {
      return;
    }

    setRangeError(null);

    if (!checkIn || (checkIn && checkOut)) {
      onCheckInChange!(day);
      onCheckOutChange!('');
      return;
    }

    if (day <= checkIn) {
      onCheckInChange!(day);
      onCheckOutChange!('');
      return;
    }

    const nights = countNightsBetween(checkIn, day);
    if (minimumRentalDays && nights < minimumRentalDays) {
      setRangeError(`Minimum stay is ${minimumRentalDays} nights.`);
      return;
    }

    if (isStayRangeBlocked(checkIn, day, bookings)) {
      setRangeError('Selected range includes booked dates. Choose different dates.');
      return;
    }

    onCheckOutChange!(day);
  }

  return (
    <section className="pr-booking-panel__section">
      <span className="pr-kicker">Availability</span>
      <h3 className="pr-booking-panel__section-title">
        {interactive ? 'Select your dates' : 'Booked dates'}
      </h3>
      {minimumRentalDays ? (
        <p className="pr-detail-block__copy">Minimum stay: {minimumRentalDays} nights</p>
      ) : null}
      {interactive ? (
        <p className="pr-booking-hint">
          {checkIn && !checkOut
            ? 'Choose your check-out date.'
            : 'Tap an available date to start your stay.'}
        </p>
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

      <div className="pr-calendar-grid" role={interactive ? 'grid' : undefined} aria-label={interactive ? 'Stay dates' : undefined}>
        {cells.map((date, index) => {
          if (!date) {
            return <span key={`empty-${index}`} className="pr-calendar-day pr-calendar-day--empty" />;
          }

          const dayValue = formatLocalDate(date);
          const booked = isDateWithinBooking(date, bookings);
          const disabled = isPastDate(date) || booked;
          const isToday = date.toDateString() === new Date().toDateString();
          const isCheckIn = checkIn === dayValue;
          const isCheckOut = checkOut === dayValue;
          const inRange = isDateInRange(dayValue, checkIn, checkOut);
          const className = [
            'pr-calendar-day',
            booked ? 'pr-calendar-day--booked' : '',
            disabled ? 'pr-calendar-day--disabled' : '',
            interactive && !disabled ? 'pr-calendar-day--selectable' : '',
            isToday ? 'pr-calendar-day--today' : '',
            isCheckIn || isCheckOut ? 'pr-calendar-day--selected' : '',
            inRange ? 'pr-calendar-day--in-range' : '',
          ].filter(Boolean).join(' ');

          if (interactive) {
            return (
              <button
                key={dayValue}
                type="button"
                className={className}
                disabled={disabled}
                aria-label={`${dayValue}${booked ? ', booked' : disabled ? ', unavailable' : isCheckIn ? ', check-in' : isCheckOut ? ', check-out' : inRange ? ', in stay' : ', available'}`}
                aria-pressed={isCheckIn || isCheckOut}
                onClick={() => handleDaySelect(date)}
              >
                {date.getDate()}
              </button>
            );
          }

          return (
            <span
              key={dayValue}
              className={className}
              title={booked ? 'Booked' : 'Available'}
            >
              {date.getDate()}
            </span>
          );
        })}
      </div>

      {rangeError && (
        <p className="pr-booking-hint" role="alert" style={{ color: '#b42318', marginTop: '0.75rem' }}>
          {rangeError}
        </p>
      )}

      <div className="pr-calendar-legend">
        <span>
          <i className="pr-calendar-legend__swatch pr-calendar-legend__swatch--booked" />
          Booked
        </span>
        <span>
          <i className="pr-calendar-legend__swatch pr-calendar-legend__swatch--open" />
          Available
        </span>
        {interactive && checkIn && checkOut ? (
          <span>
            <i className="pr-calendar-legend__swatch pr-calendar-legend__swatch--selected" />
            Selected
          </span>
        ) : null}
      </div>
    </section>
  );
}
