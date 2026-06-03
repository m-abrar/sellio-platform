@isset($paginator)
    @if($paginator->hasPages())
        <div class="listing-pagination d-flex justify-content-center" role="navigation" aria-label="{{ __('Pagination') }}">
            {{ $paginator->appends(request()->query())->links('frontend._partials._pagination') }}
        </div>
    @endif
@endisset
