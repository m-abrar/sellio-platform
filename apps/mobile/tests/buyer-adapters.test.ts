import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
  toAutoInquiryActivityCard,
  toBookingActivityCard,
  toClassifiedInquiryActivityCard,
  toJobApplicationActivityCard,
  toOrderActivityCard,
  toServiceQuoteActivityCard,
} from '../src/features/buyer/adapters';
import {
  BuyerAutoInquiryRecord,
  BuyerBookingRecord,
  BuyerClassifiedInquiryRecord,
  BuyerJobApplicationRecord,
  BuyerOrderRecord,
  BuyerServiceQuoteRecord,
} from '../src/features/buyer/types';

test('booking adapters distinguish property stays, visits, events, and services', () => {
  const propertyStay: BuyerBookingRecord = {
    id: 11,
    module: 'properties',
    status: 'confirmed',
    created_at: '2026-06-01T10:00:00Z',
    property: { id: 3, title: 'Harbor Loft', slug: 'harbor-loft', primary_image_url: 'https://example.test/loft.jpg' },
    check_in_date: '2026-07-10',
    check_out_date: '2026-07-13',
    guests: 2,
    duration_nights: 3,
    total_price: '450',
  };
  const visit: BuyerBookingRecord = {
    id: 12,
    module: 'properties',
    status: 'pending',
    created_at: '2026-06-02T10:00:00Z',
    property: { id: 4, title: 'City House', slug: 'city-house' },
    scheduled_at: '2026-07-04T14:00:00Z',
  };
  const event: BuyerBookingRecord = {
    id: 13,
    module: 'events',
    status: 'confirmed',
    created_at: '2026-06-03T10:00:00Z',
    event: { id: 5, title: 'Design Summit', slug: 'design-summit' },
    occurrence: { id: 8, start_date_time: '2026-08-01T09:00:00Z' },
    ticket_type: { id: 2, name: 'General', price: 25 },
    quantity: 2,
    total_price: 50,
  };
  const service: BuyerBookingRecord = {
    id: 14,
    module: 'services',
    status: 'pending',
    created_at: '2026-06-04T10:00:00Z',
    service: { id: 6, title: 'Home Cleaning', slug: 'home-cleaning' },
    scheduled_at: '2026-07-05T12:00:00Z',
    topic: 'Deep clean consultation',
    price: 80,
  };

  const stayCard = toBookingActivityCard(propertyStay, true);
  const visitCard = toBookingActivityCard(visit, true);
  const eventCard = toBookingActivityCard(event, true);
  const serviceCard = toBookingActivityCard(service, true);

  assert.equal(stayCard.kind, 'property_booking');
  assert.equal(stayCard.vertical, 'properties');
  assert.equal(stayCard.detail, '2 guests - 3 nights');
  assert.equal(stayCard.amount, '$450.00');
  assert.equal(visitCard.kind, 'property_visit');
  assert.equal(visitCard.detail, 'Scheduled property visit');
  assert.equal(eventCard.kind, 'event_booking');
  assert.equal(eventCard.detail, 'General - 2 tickets');
  assert.equal(serviceCard.kind, 'service_appointment');
  assert.equal(serviceCard.detail, 'Deep clean consultation');
});

test('order adapter summarizes quantities, payment, and additional products', () => {
  const order: BuyerOrderRecord = {
    id: 21,
    order_number: 'ORD-2026-21',
    status: 'processing',
    payment_status: 'paid',
    payment_method: 'stripe',
    pricing: {
      subtotal: 100,
      shipping_cost: 5,
      tax_amount: 10,
      discount_amount: 0,
      total_amount: 115,
      currency_symbol: '$',
    },
    items: [
      { id: 1, product_name: 'Fallback name', quantity: 2, unit_price: 40, total_price: 80, product: { id: 7, title: 'Canvas Bag', slug: 'canvas-bag', image: 'https://example.test/bag.jpg' } },
      { id: 2, product_name: 'Travel Bottle', quantity: 1, unit_price: 20, total_price: 20 },
    ],
    created_at: '2026-06-05T10:00:00Z',
  };

  const card = toOrderActivityCard(order);

  assert.equal(card.kind, 'product_order');
  assert.equal(card.title, 'Canvas Bag + 1 more');
  assert.equal(card.detail, '3 items - STRIPE');
  assert.equal(card.amount, '$115.00');
  assert.equal(card.reference, 'ORD-2026-21');
});

test('job application adapter formats salary and listing metadata', () => {
  const application: BuyerJobApplicationRecord = {
    id: 31,
    job_listing_id: 9,
    user_id: 2,
    status: 'submitted',
    created_at: '2026-06-06T10:00:00Z',
    job: {
      id: 9,
      title: 'Product Designer',
      slug: 'product-designer',
      salary_min: 60000,
      salary_max: 80000,
      primary_image_url: 'https://example.test/job.jpg',
    },
  };

  const card = toJobApplicationActivityCard(application);

  assert.equal(card.kind, 'job_application');
  assert.equal(card.title, 'Product Designer');
  assert.equal(card.amount, '$60,000.00 - $80,000.00');
  assert.equal(card.detail, 'Salary range $60,000.00 - $80,000.00');
  assert.equal(card.slug, 'product-designer');
});

test('vehicle inquiry adapter combines the preferred visit schedule', () => {
  const inquiry: BuyerAutoInquiryRecord = {
    id: 41,
    user_id: 2,
    auto_id: 10,
    status: 'new',
    preferred_date: '2026-07-12',
    preferred_time: '15:30',
    created_at: '2026-06-07T10:00:00Z',
    auto: { id: 10, title: 'Electric Coupe', slug: 'electric-coupe' },
  };

  const card = toAutoInquiryActivityCard(inquiry);

  assert.equal(card.kind, 'vehicle_inquiry');
  assert.equal(card.detail, 'Preferred visit 2026-07-12 - 15:30');
  assert.equal(card.reference, 'Inquiry #41');
});

test('service quote adapter prefers requested date, scope, and quoted price', () => {
  const quote: BuyerServiceQuoteRecord = {
    id: 51,
    service_id: 11,
    user_id: 2,
    status: 'quoted',
    scope_size: 'Large home',
    requested_date: '2026-07-20',
    quoted_price: '320',
    created_at: '2026-06-08T10:00:00Z',
    service: { id: 11, title: 'Interior Painting', slug: 'interior-painting' },
  };

  const card = toServiceQuoteActivityCard(quote);

  assert.equal(card.kind, 'service_quote');
  assert.equal(card.date, '2026-07-20');
  assert.equal(card.detail, 'Scope: Large home');
  assert.equal(card.amount, '$320.00');
});

test('classified inquiry adapter supports alternate classified payload keys', () => {
  const inquiry: BuyerClassifiedInquiryRecord = {
    id: 61,
    user_id: 2,
    classified_id: 12,
    status: 'pending',
    created_at: '2026-06-09T10:00:00Z',
    classified_ad: {
      id: 12,
      title: 'Road Bicycle',
      slug: 'road-bicycle',
      price_formatted: '$900',
      condition_label: 'Used - excellent',
      brand: { id: 3, name: 'Velocity' },
    },
  };

  const card = toClassifiedInquiryActivityCard(inquiry);

  assert.equal(card.kind, 'classified_inquiry');
  assert.equal(card.title, 'Road Bicycle');
  assert.equal(card.amount, '$900');
  assert.equal(card.detail, 'Used - excellent - Velocity');
  assert.equal(card.slug, 'road-bicycle');
});
