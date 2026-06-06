@extends('frontend._layouts._app')
@section('title', 'InvestStream - Proven ROI Real Estate')

@push('styles')
<style>
    /* Theme Specific Root Variables for InvestStream */
    :root {
        --primary-navy: #0A2540;
        --secondary-steel: #4A5568;
        --accent-green: #38A169;
        --light-gray: #F7FAFC;
        
        /* Overriding default layout fonts */
        --font-heading: 'Montserrat', sans-serif;
        --font-body: 'Inter', sans-serif;
    }
</style>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Montserrat:wght@700;800&family=Poppins:wght@600;700&display=swap" rel="stylesheet">

@endpush



@section('content')

<?php
// PHP Data Arrays for the page content
$kpis = [
    ['icon' => 'bi-percent', 'value' => '12%', 'label' => 'Avg. ROI'],
    ['icon' => 'bi-person-check', 'value' => '95%', 'label' => 'Occupancy Rate'],
    ['icon' => 'bi-building-up', 'value' => '8%', 'label' => 'Avg. Appreciation (Y)'],
    ['icon' => 'bi-people', 'value' => '10K+', 'label' => 'Investors Served'],
];

$opportunities = [
    ['title' => 'Office Tower in Downtown', 'description' => 'Prime commercial space in a major financial district.', 'price' => '$1.2M', 'roi' => '14%', 'yield' => '$180K', 'image' => 'https://images.unsplash.com/photo-1544377193-33e1467e2a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MDkzMTR8MHwxfHNlYXJjaHwzfHdlbGwlMjRmaW5hbmNpYWwlMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwwfHx8fDE3MjU4NTAwNTB8MA&ixlib=rb-4.0.3&q=80&w=400'],
    ['title' => 'Luxury Residential Complex', 'description' => 'High-demand rental units near a university campus.', 'price' => '$3.5M', 'roi' => '10.5%', 'yield' => '$367K', 'image' => 'https://images.unsplash.com/photo-1628173428987-a2f7c006509a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MDkzMTR8MHwxfHNlYXJjaHw1fG11bHRpJTI0ZmFtaWx5JTIwcmVhbCUyMGVzdGF0ZXxlbnwwfHx8fDE3MjU4NTAwNTF8MA&ixlib=rb-4.0.3&q=80&w=400'],
    ['title' => 'Suburban Retail Strip', 'description' => 'Fully leased space with stable anchor tenants.', 'price' => '$950K', 'roi' => '13.2%', 'yield' => '$125K', 'image' => 'https://images.unsplash.com/photo-1621609764095-b91c0628e932?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MDkzMTR8MHwxfHNlYXJjaHw0fHJldGFpbCUyMHNwYWNlfGVufDB8fHx8MTcyNTg1MDA1MXww&ixlib=rb-4.0.3&q=80&w=400'],
];

$comparison_data = [
    ['name' => 'Office Tower (Downtown)', 'price' => '$1.2M', 'roi' => '14.0%', 'cap' => '8.5%', 'cash_flow' => '$15,000'],
    ['name' => 'Residential Complex (Lux)', 'price' => '$3.5M', 'roi' => '10.5%', 'cap' => '6.2%', 'cash_flow' => '$30,600'],
    ['name' => 'Retail Strip (Suburban)', 'price' => '$950K', 'roi' => '13.2%', 'cap' => '7.9%', 'cash_flow' => '$10,400'],
    ['name' => 'Industrial Warehouse', 'price' => '$2.1M', 'roi' => '11.8%', 'cap' => '7.1%', 'cash_flow' => '$18,800'],
];
?>

    
    <header class="bg-navy py-5 py-lg-0">
        <div class="container">
            <div class="row align-items-center py-5">
                <div class="col-lg-6 order-lg-1 mb-4 mb-lg-0 text-center text-lg-start">
                    <h1 class="display-3 fw-bolder text-white mb-4" style="line-height: 1.2;">Invest with Confidence</h1>
                    <p class="lead text-white-50 mb-5">Discover properties with **proven ROI** and long-term growth tailored for serious investors.</p>
                    <div class="d-grid gap-3 d-md-block">
                        <a href="#opportunities" class="btn btn-primary-green btn-lg px-4 me-md-2 mb-2 mb-md-0">
                            <i class="bi bi-house-door me-2"></i> Browse Investment Properties
                        </a>
                        <a href="#calculator" class="btn btn-outline-light btn-lg px-4">
                            <i class="bi bi-calculator me-2"></i> Calculate ROI
                        </a>
                    </div>
                </div>
                <div class="col-lg-6 order-lg-2">
                    <div id="hero-chart" class="p-4">
                        <div class="chart-line"></div>
                        <h4 class="text-white mt-3 ps-3">Portfolio Value Growth</h4>
                        <p class="text-white-50 ps-3">Year-over-Year Performance</p>
                    </div>
                </div>
            </div>
        </div>
    </header>


    <section id="metrics" class="py-5 bg-white shadow-sm">
        <div class="container">
            <h2 class="text-center mb-5 text-navy">Key Investment Metrics</h2>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                @foreach($kpis as $kpi)
                <div class="col">
                    <div class="card kpi-card p-4 text-center">
                        <div class="card-body">
                            <i class="bi {{ $kpi['icon'] }} fs-1 text-accent-green mb-3"></i>
                            <h3 class="display-6 fw-bold text-navy">{{ $kpi['value'] }}</h3>
                            <p class="card-text text-uppercase fw-bold text-secondary">{{ $kpi['label'] }}</p>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </section>
    <section id="opportunities" class="py-5">
        <div class="container">
            <h2 class="text-center mb-5">Featured Investment Opportunities</h2>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                @foreach ($opportunities as $opportunity)
                <div class="col">
                    <div class="card feature-card h-100">
                        <img src="{{ $opportunity['image'] }}" class="card-img-top" alt="{{ $opportunity['title'] }}"
                            style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <h4 class="card-title text-navy">{{ $opportunity['title'] }}</h4>
                            <p class="card-text text-secondary mb-3">{{ $opportunity['description'] }}</p>
                            <div class="row mb-3 g-2">
                                <div class="col-6">
                                    <p class="mb-0 fw-bold fs-5 text-navy">{{ $opportunity['price'] }}</p>
                                    <small class="text-secondary">Price</small>
                                </div>
                                <div class="col-6 text-end">
                                    <p class="mb-0 fw-bold fs-5 text-accent-green">{{ $opportunity['roi'] }}</p>
                                    <small class="text-secondary">Projected ROI</small>
                                </div>
                            </div>
                            <p class="mb-3 text-secondary">Annual Yield: <span
                                    class="fw-bold text-navy">{{ $opportunity['yield'] }}</span></p>
                            <div class="mt-auto">
                                <a href="#" class="btn btn-sm btn-primary-green w-100">View Projections</a>
                            </div>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
            <div class="text-center mt-5">
                <a href="#" class="btn btn-outline-navy btn-lg">Explore All 50+ Opportunities <i class="bi bi-arrow-right"></i></a>
            </div>
        </div>
    </section>
    <section id="calculator" class="py-5 bg-white">
        <div class="container">
            <div class="row g-5 align-items-center">
                <div class="col-lg-6">
                    <h2 class="mb-4">Interactive ROI Calculator</h2>
                    <p class="lead mb-4 text-secondary">Input your key variables to instantly estimate the Return on Investment for any property.</p>
                    <form>
                        <div class="mb-3">
                            <label for="purchasePrice" class="form-label fw-bold">Purchase Price ($)</label>
                            <input type="number" class="form-control" id="purchasePrice" placeholder="e.g., 500000" required>
                        </div>
                        <div class="mb-3">
                            <label for="rentalYield" class="form-label fw-bold">Annual Rental Yield ($)</label>
                            <input type="number" class="form-control" id="rentalYield" placeholder="e.g., 40000" required>
                        </div>
                        <div class="mb-4">
                            <label for="annualExpenses" class="form-label fw-bold">Annual Expenses ($)</label>
                            <input type="number" class="form-control" id="annualExpenses" placeholder="e.g., 8000" required>
                        </div>
                        <button type="submit" class="btn btn-primary-green btn-lg">
                            <i class="bi bi-calculator me-2"></i> Calculate Estimated ROI
                        </button>
                    </form>
                </div>
                <div class="col-lg-6">
                    <h3 class="text-center text-navy mb-4">Estimated 5-Year ROI Projection</h3>
                    <div class="calculator-output-chart chart-placeholder shadow-sm">
                        <i class="bi bi-graph-up-arrow fs-1 text-secondary opacity-50"></i>
                    </div>
                    <div class="text-center mt-3">
                        <p class="fs-4 fw-bold text-accent-green mb-0">Estimated ROI: 11.2%</p>
                        <small class="text-secondary">Based on current inputs and average market conditions.</small>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section id="data-visualization" class="py-5">
        <div class="container">
            <h2 class="text-center mb-5">Market Trends & Data Visualization</h2>
            <div class="row g-4">
                <div class="col-lg-6">
                    <div class="card p-4 h-100 shadow-sm">
                        <h4 class="card-title text-navy">Property Value Appreciation (5 Yrs)</h4>
                        <div class="chart-placeholder">
                            <i class="bi bi-graph-up-arrow me-2"></i> Line Graph Placeholder
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="card p-4 h-100 shadow-sm">
                        <h4 class="card-title text-navy">Income vs Expenses</h4>
                        <div class="chart-placeholder">
                            <i class="bi bi-pie-chart me-2"></i> Pie Chart Placeholder
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="card p-4 h-100 shadow-sm">
                        <h4 class="card-title text-navy">ROI by City (Top 3)</h4>
                        <div class="chart-placeholder">
                            <i class="bi bi-bar-chart me-2"></i> Bar Chart Placeholder
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section id="comparison" class="py-5 bg-white">
        <div class="container">
            <h2 class="text-center mb-5">Property Investment Comparison</h2>
            <div class="table-responsive shadow-lg rounded-3 overflow-hidden">
                <table class="table table-hover align-middle mb-0 comparison-table">
                    <thead class="bg-light">
                        <tr>
                            <th scope="col">Property</th>
                            <th scope="col">Price</th>
                            <th scope="col">ROI</th>
                            <th scope="col">Cap Rate</th>
                            <th scope="col">Cash Flow (M)</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($comparison_data as $property)
                        <tr>
                            <td>{{ $property['name'] }}</td>
                            <td>{{ $property['price'] }}</td>
                            <td class="text-accent-green fw-bold">{{ $property['roi'] }}</td>
                            <td>{{ $property['cap'] }}</td>
                            <td>{{ $property['cash_flow'] }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </section>
    <section id="case-studies" class="py-5">
        <div class="container">
            <div class="row g-5">
                <div class="col-lg-6">
                    <div class="card p-4 h-100 border-0 shadow-lg">
                        <h3 class="text-navy mb-4">Investor Success Story</h3>
                        <div class="d-flex align-items-center mb-4">
                            <img src="https://images.unsplash.com/photo-1544717297-fa95b1ee4c0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MDkzMTR8MHwxfHNlYXJjaHwzfGludmVzdG9yJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzI1ODUwMDUxfDA&ixlib=rb-4.0.3&q=80&w=100"
                                alt="Sarah J. Investor" class="rounded-circle me-3"
                                style="width: 80px; height: 80px; object-fit: cover;">
                            <div>
                                <h5 class="fw-bold mb-0 text-navy">Sarah J., Portfolio Manager</h5>
                                <p class="text-secondary mb-0">Invested: 3 Years</p>
                            </div>
                        </div>
                        <p class="lead fw-bold text-dark">"How Sarah grew her portfolio by <span class="text-accent-green">35% in 3 years</span> using our data-driven approach."</p>
                        <p class="text-secondary">Our financial insights allowed Sarah to identify high-potential secondary markets, significantly outperforming her previous investment strategy. The transparency of the ROI projections was key.</p>
                        <a href="#" class="btn btn-outline-navy mt-auto align-self-start">Read Full Case Study</a>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="card p-4 h-100 border-0 shadow-lg">
                        <h3 class="text-navy mb-4">Video Explainer: Investment Fundamentals</h3>
                        <p class="lead mb-4 text-secondary">Watch our quick guide on real estate as the #1 long-term investment vehicle.</p>
                        <div class="ratio ratio-16x9 rounded-3 overflow-hidden shadow">
                            <div class="d-flex align-items-center justify-content-center bg-dark text-white-50">
                                <i class="bi bi-play-circle-fill fs-1 text-white"></i>
                            </div>
                        </div>
                        <p class="mt-3 text-center text-secondary"><small>Video Placeholder: Why Real Estate is the #1 Long-Term Investment.</small></p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section id="contact" class="py-5 bg-navy text-white">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 mb-4 mb-lg-0">
                    <h2 class="display-5 fw-bolder text-white mb-3">Ready to Maximize Your ROI?</h2>
                    <p class="lead text-white-50">Talk to a dedicated Investment Advisor today and receive a personalized portfolio review.</p>
                    <div class="d-flex align-items-center">
                        <i class="bi bi-check-circle-fill fs-4 me-2 text-accent-green"></i>
                        <p class="mb-0 fw-bold">Data-backed property selection.</p>
                    </div>
                    <div class="d-flex align-items-center">
                        <i class="bi bi-check-circle-fill fs-4 me-2 text-accent-green"></i>
                        <p class="mb-0 fw-bold">Long-term growth strategies.</p>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="card p-4 shadow-lg">
                        <h4 class="text-navy mb-3">Book Your Free Consultation</h4>
                        <form>
                            <div class="mb-3">
                                <input type="text" class="form-control" placeholder="Your Name" required>
                            </div>
                            <div class="mb-3">
                                <input type="email" class="form-control" placeholder="Work Email" required>
                            </div>
                            <div class="mb-4">
                                <select class="form-select" required>
                                    <option selected disabled>Investment Budget ($)</option>
                                    <option>Under $500K</option>
                                    <option>$500K - $2M</option>
                                    <option>Over $2M</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary-green btn-lg w-100">
                                <i class="bi bi-send me-2"></i> Talk to an Investment Advisor
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

@endsection