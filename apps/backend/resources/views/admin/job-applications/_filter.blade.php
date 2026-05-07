{{--
    Administrative Jobs: Application Filter Protocol
    
    This component provides a streamlined filtering interface for the 
    recruitment pipeline. It enables multi-dimensional auditing across 
    job positions, vertical sectors, and pipeline statuses (submitted, 
    reviewed, accepted, rejected), facilitating efficient candidate 
    triage and registry oversight.
    
    @context Job Application Management
    @variables Collection $jobs List of active job listings for selection mapping.
    @variables Collection $categories Job sectors for vertical filtering.
--}}
<div class="card registry-card-premium registry-filter-card mb-4">
    <div class="card-body">
        <form method="GET" action="{{ url()->current() }}">
            <div class="row align-items-end">
                <div class="col-md-3">
                    <label class="form-label-premium">Target Position</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-briefcase text-xs"></i></span>
                        </div>
                        <select name="job" class="form-control select2">
                            <option value="">All Active Listings</option>
                            @foreach($jobs as $j)
                                <option value="{{ $j->id }}" {{ request('job') == $j->id ? 'selected' : '' }}>{{ $j->title }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-premium">Sector Category</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-tags text-xs"></i></span>
                        </div>
                        <select name="category" class="form-control select2">
                            <option value="">All Sectors</option>
                            @foreach ($categories as $c)
                                <option value="{{ $c->id }}" {{ request('category') == $c->id ? 'selected' : '' }}>{{ $c->title }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-premium">Pipeline Status</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-filter text-xs"></i></span>
                        </div>
                        <select name="status" class="form-control select2">
                            <option value="all">All States</option>
                            <option value="submitted" {{ (request('status') ?? $status) == 'submitted' ? 'selected' : '' }}>Submitted</option>
                            <option value="reviewed" {{ (request('status') ?? $status) == 'reviewed' ? 'selected' : '' }}>Reviewed</option>
                            <option value="accepted" {{ (request('status') ?? $status) == 'accepted' ? 'selected' : '' }}>Accepted</option>
                            <option value="rejected" {{ (request('status') ?? $status) == 'rejected' ? 'selected' : '' }}>Rejected</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="d-flex align-items-center justify-content-end" style="gap: 12px;">
                        <button type="submit" class="btn-filter-premium flex-grow-1">
                            <i class="fas fa-sync-alt mr-2"></i> UPDATE
                        </button>
                        <a href="{{ url()->current() }}" class="btn-reset-premium" data-toggle="tooltip" title="Reset Filters">
                            <i class="fas fa-undo"></i>
                        </a>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
