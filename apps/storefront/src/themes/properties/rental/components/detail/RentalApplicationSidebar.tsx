'use client';

import type { Property } from '@/types';
import type { PropertyBookingBlock, PropertyDetail } from '../../property-detail-types';
import { formatMonthlyRent } from '../../property-utils';
import { formatLocalDate } from '../../property-detail-utils';
import { AvailabilityCalendar } from './AvailabilityCalendar';

export type RentalApplicationReceipt = {
  orderId: string;
  propertyTitle: string;
  tenantName: string;
  leaseDuration: string;
  downPaymentPaid: string;
  utilityAddons: { addonsTotal: string };
  netMonthlyTotal: string;
};

interface RentalApplicationSidebarProps {
  property: Property;
  detail: PropertyDetail;
  bookings: PropertyBookingBlock[];
  checkIn: string;
  checkOut: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  lodgingBreakdown: { total_nights: number; estimated_lodging_total: string } | null;
  calculatingPrice: boolean;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  addFiber: boolean;
  addParking: boolean;
  addValet: boolean;
  isSubmitting: boolean;
  formError?: string | null;
  hasStayDates?: boolean;
  receipt: RentalApplicationReceipt | null;
  onTenantNameChange: (value: string) => void;
  onTenantEmailChange: (value: string) => void;
  onTenantPhoneChange: (value: string) => void;
  onAddFiberChange: (value: boolean) => void;
  onAddParkingChange: (value: boolean) => void;
  onAddValetChange: (value: boolean) => void;
  onSubmit: (event: React.FormEvent) => void;
  onResetReceipt: () => void;
}

export function RentalApplicationSidebar({
  property,
  detail,
  bookings,
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  lodgingBreakdown,
  calculatingPrice,
  tenantName,
  tenantEmail,
  tenantPhone,
  addFiber,
  addParking,
  addValet,
  isSubmitting,
  formError,
  hasStayDates = false,
  receipt,
  onTenantNameChange,
  onTenantEmailChange,
  onTenantPhoneChange,
  onAddFiberChange,
  onAddParkingChange,
  onAddValetChange,
  onSubmit,
  onResetReceipt,
}: RentalApplicationSidebarProps) {
  const todayValue = formatLocalDate(new Date());
  const checkoutMin = checkIn || todayValue;

  if (receipt) {
    return (
      <aside className="pr-detail-sidebar" aria-label="Application confirmation">
        <div className="pr-receipt-panel">
          <span className="pr-kicker" style={{ color: 'var(--pr-mint)' }}>
            Application received
          </span>
          <h3 className="pr-detail-block__title" style={{ color: '#fff', marginTop: '0.75rem' }}>
            You are all set
          </h3>
          <p style={{ fontSize: '0.95rem', opacity: 0.75, lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Your lease inquiry for {receipt.propertyTitle} has been recorded.
          </p>
          <dl className="pr-receipt-list">
            <div>
              <dt>Reference</dt>
              <dd>{receipt.orderId}</dd>
            </div>
            <div>
              <dt>Tenant</dt>
              <dd>{receipt.tenantName}</dd>
            </div>
            <div>
              <dt>Lease term</dt>
              <dd>{receipt.leaseDuration}</dd>
            </div>
            <div>
              <dt>Deposit</dt>
              <dd>{receipt.downPaymentPaid}</dd>
            </div>
            <div>
              <dt>Add-ons</dt>
              <dd>{receipt.utilityAddons.addonsTotal}/mo</dd>
            </div>
            <div className="pr-receipt-list__total">
              <dt>Monthly total</dt>
              <dd>{receipt.netMonthlyTotal}</dd>
            </div>
          </dl>
          <button type="button" className="pr-btn-primary pr-btn-block" onClick={onResetReceipt}>
            Submit another inquiry
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="pr-detail-sidebar" aria-label="Apply for rental">
      <div className="pr-booking-panel pr-booking-panel--sticky" id="pr-apply">
        <div className="pr-booking-panel__header">
          <div>
            <span className="pr-kicker">Monthly rent</span>
            <p className="pr-booking-panel__price">
              {formatMonthlyRent(property)}
              <span> /mo</span>
            </p>
          </div>
        </div>

        <div className="pr-booking-panel__section">
          <h3 className="pr-booking-panel__section-title">Short-stay estimate</h3>
          <div className="pr-date-row">
            <label className="pr-booking-field">
              <span className="pr-booking-label">Check-in</span>
              <input
                type="date"
                className="pr-booking-input"
                min={todayValue}
                value={checkIn}
                onChange={(event) => onCheckInChange(event.target.value)}
              />
            </label>
            <label className="pr-booking-field">
              <span className="pr-booking-label">Check-out</span>
              <input
                type="date"
                className="pr-booking-input"
                min={checkoutMin}
                value={checkOut}
                onChange={(event) => onCheckOutChange(event.target.value)}
              />
            </label>
          </div>
          {calculatingPrice ? (
            <p className="pr-booking-hint">Calculating stay total…</p>
          ) : lodgingBreakdown ? (
            <div className="pr-lodging-quote">
              <div>
                <strong>Stay total</strong>
                <p>{lodgingBreakdown.total_nights} nights</p>
              </div>
              <span className="pr-lodging-quote__total">{lodgingBreakdown.estimated_lodging_total}</span>
            </div>
          ) : (
            <p className="pr-booking-hint">Select dates for a short-stay quote.</p>
          )}
        </div>

        <AvailabilityCalendar
          bookings={bookings}
          minimumRentalDays={detail.minimum_rental_days}
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={onCheckInChange}
          onCheckOutChange={onCheckOutChange}
        />

        <form onSubmit={onSubmit} className="pr-application-form">
          <h3 className="pr-booking-panel__section-title">Apply for this rental</h3>
          <label className="pr-booking-field">
            <span className="pr-booking-label">Full name</span>
            <input
              type="text"
              className="pr-booking-input"
              required
              value={tenantName}
              onChange={(event) => onTenantNameChange(event.target.value)}
            />
          </label>
          <label className="pr-booking-field">
            <span className="pr-booking-label">Email</span>
            <input
              type="email"
              className="pr-booking-input"
              required
              value={tenantEmail}
              onChange={(event) => onTenantEmailChange(event.target.value)}
            />
          </label>
          <label className="pr-booking-field">
            <span className="pr-booking-label">Phone</span>
            <input
              type="tel"
              className="pr-booking-input"
              required
              value={tenantPhone}
              onChange={(event) => onTenantPhoneChange(event.target.value)}
            />
          </label>

          <p className="pr-booking-panel__section-title pr-booking-panel__section-title--addons">
            Optional add-ons
          </p>
          <div className="pr-addon-list">
          {[
            { label: 'High-speed internet', cost: '+$80/mo', active: addFiber, setter: onAddFiberChange },
            { label: 'Reserved parking', cost: '+$150/mo', active: addParking, setter: onAddParkingChange },
            { label: 'Valet trash service', cost: '+$35/mo', active: addValet, setter: onAddValetChange },
          ].map((addon) => (
            <label key={addon.label} className="pr-addon-item">
              <span>
                <input
                  type="checkbox"
                  checked={addon.active}
                  onChange={(event) => addon.setter(event.target.checked)}
                />{' '}
                {addon.label}
              </span>
              <span style={{ color: 'var(--pr-mint-deep)', fontWeight: 800 }}>{addon.cost}</span>
            </label>
          ))}
          </div>

          {formError && (
            <p role="alert" className="pr-booking-hint" style={{ color: '#b42318' }}>
              {formError}
            </p>
          )}
          <button type="submit" className="pr-btn-primary pr-btn-block" disabled={isSubmitting}>
            {isSubmitting
              ? 'Submitting…'
              : hasStayDates
                ? 'Continue to payment'
                : 'Submit lease inquiry'}
          </button>
        </form>
      </div>
    </aside>
  );
}
