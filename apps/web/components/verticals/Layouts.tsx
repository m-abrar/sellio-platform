"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import { Product, Property, Application } from '@sellio/types';
import { Button, Card } from '@sellio/ui';

interface LayoutProps {
  appConfig: Application | null;
}

/**
 * --- E-COMMERCE VERTICAL ---
 */
export const EcommerceLayout = ({ appConfig }: LayoutProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.products.list().then(res => {
      setProducts(res.data.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          {appConfig?.title || 'Our Collection'}
        </h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto uppercase tracking-widest text-[10px]">
          Discover Premium Goods
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-pulse">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-[400px] bg-slate-100 rounded-3xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <Card key={product.id} className="group border-none shadow-none bg-transparent hover:-translate-y-2 transition-transform duration-500">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6 bg-slate-100">
                <img 
                  src={product.media.featured_image} 
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-primary shadow-sm">
                        {product.taxonomy.category.title}
                    </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{product.title}</h3>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{product.short_description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-950">{product.pricing.formatted}</span>
                <Button variant="primary" className="rounded-full px-6">Add to Cart</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * --- REAL ESTATE VERTICAL ---
 */
export const RealEstateLayout = ({ appConfig }: LayoutProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.properties.list().then(res => {
      setProperties(res.data.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="mb-16">
        <div className="h-px w-20 bg-primary mb-8" />
        <h1 className="text-5xl font-black text-slate-900 mb-2 leading-tight">
          {appConfig?.title || 'Premium Properties'}
        </h1>
        <p className="text-slate-400 font-medium text-sm">Your vision, our architecture.</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[1, 2].map(n => <div key={n} className="h-[500px] bg-slate-100 rounded-[2.5rem]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {properties.map(property => (
            <div key={property.id} className="group relative rounded-[2.5rem] overflow-hidden bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 hover:shadow-primary/10 transition-all duration-700">
               <div className="aspect-[16/10] overflow-hidden">
                <img 
                    src={property.media.featured_image} 
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                  />
               </div>
               <div className="p-8 sm:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-slate-950 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm">
                        {property.specs.property_type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{property.location.city}, {property.location.state}</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4">{property.title}</h3>
                  
                  <div className="flex items-center gap-8 border-y border-slate-50 py-6 mb-8">
                     <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest mb-1">Beds</span>
                        <span className="font-bold text-slate-700">{property.specs.bedrooms}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest mb-1">Baths</span>
                        <span className="font-bold text-slate-700">{property.specs.bathrooms}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest mb-1">Area</span>
                        <span className="font-bold text-slate-700">{property.specs.area_formatted}</span>
                     </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-primary">{property.pricing.formatted}</span>
                    <Button variant="outline" className="rounded-2xl border-2 font-black px-8">VIEW DETAIL</Button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const VacationRentalLayout = ({ appConfig }: LayoutProps) => (
  <div className="p-20 text-center animate-in zoom-in duration-700">
    <div className="bg-white/50 backdrop-blur-3xl rounded-[3rem] p-20 border border-white max-w-4xl mx-auto shadow-2xl">
        <h1 className="text-6xl font-black text-primary mb-8 tracking-tighter italic">Relax. Unwind.</h1>
        <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Welcome to <span className="text-slate-950 font-black underline decoration-accent decoration-4">{appConfig?.title}</span>. 
            The ultimate retreat experience tailored to your exact desires.
        </p>
        <div className="mt-12 flex items-center justify-center gap-4">
            <Button size="lg" className="rounded-full px-12 h-16 text-lg">Check Availability</Button>
        </div>
    </div>
  </div>
);
