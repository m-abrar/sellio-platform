'use client';

interface LeaseEstimatorSectionProps {
  downPayment: number;
  leaseDuration: string;
  estimatedRent: number;
  onDownPaymentChange: (value: number) => void;
  onLeaseDurationChange: (value: string) => void;
}

export function LeaseEstimatorSection({
  downPayment,
  leaseDuration,
  estimatedRent,
  onDownPaymentChange,
  onLeaseDurationChange,
}: LeaseEstimatorSectionProps) {
  return (
    <section className="pr-estimator-panel" id="pr-estimator">
      <span className="pr-kicker">Lease calculator</span>
      <h2 className="pr-detail-block__title">Estimate your monthly rent</h2>
      <p className="pr-detail-block__copy">
        Adjust your security deposit and lease length to preview how your monthly payment may change.
      </p>

      <div className="pr-estimator-slider">
        <div className="pr-estimator-slider__header">
          <span>Security deposit</span>
          <strong>${downPayment.toLocaleString()}</strong>
        </div>
        <input
          type="range"
          min={0}
          max={10000}
          step={500}
          value={downPayment}
          onChange={(event) => onDownPaymentChange(Number(event.target.value))}
          className="pr-range"
        />
        <div className="pr-estimator-slider__hints">
          <span>$0 min</span>
          <span>$10,000 max</span>
        </div>
      </div>

      <div className="pr-estimator-row">
        <label className="pr-estimator-field" htmlFor="pr-lease-duration">
          <span className="pr-booking-label">Lease length</span>
          <select
            id="pr-lease-duration"
            className="pr-booking-input"
            value={leaseDuration}
            onChange={(event) => onLeaseDurationChange(event.target.value)}
          >
            <option value="6">6 months</option>
            <option value="12">12 months</option>
            <option value="24">24 months (−$150/mo)</option>
          </select>
        </label>
        <div className="pr-estimator-result">
          <span className="pr-kicker">Estimated rent</span>
          <p className="pr-booking-panel__price">
            ${estimatedRent.toLocaleString()}
            <span> /mo</span>
          </p>
        </div>
      </div>
    </section>
  );
}
