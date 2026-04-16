import React from 'react';

export const EcommerceLayout = ({ appConfig }: any) => (
  <div className="p-20 text-center">
    <h1 className="text-4xl font-bold text-primary mb-4">🛒 eCommerce Hello World</h1>
    <p>Welcome to {appConfig?.title || 'our Store'}</p>
    <div className="mt-8 p-10 bg-secondary rounded-lg">
      [Simple Product Grid Placeholder]
    </div>
  </div>
);

export const RealEstateLayout = ({ appConfig }: any) => (
  <div className="p-20 text-center">
    <h1 className="text-4xl font-bold text-primary mb-4">🏠 Real Estate Hello World</h1>
    <p>Find your home at {appConfig?.title}</p>
    <div className="mt-8 p-10 bg-secondary rounded-lg">
      [Map & Property Search Placeholder]
    </div>
  </div>
);

export const VacationRentalLayout = ({ appConfig }: any) => (
  <div className="p-20 text-center">
    <h1 className="text-4xl font-bold text-primary mb-4">🏖️ Vacation Rental Hello World</h1>
    <p>Book your stay at {appConfig?.title}</p>
    <div className="mt-8 p-10 bg-secondary rounded-lg">
      [Booking Calendar Placeholder]
    </div>
  </div>
);
