@isset($paginator)
    @if($paginator->hasPages())
        <div class="listing-pagination d-flex justify-content-center" role="navigation" aria-label="{{ content_display(__('Page navigation'), 'Page navigation') }}">
            {!! $paginator->appends(request()->query())->links('frontend._partials._pagination') !!}
        </div>
    @endif
@endisset
