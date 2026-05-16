@if ($paginator->hasPages())
<div class="d-flex justify-content-center mt-5 mb-4 px-2" role="navigation">
    <nav aria-label="{{ __('Page navigation') }}">
        {{-- 
            Aligned with Section 3 of frontend.css: glass-surface.
            Rounded-pill added for the specific container aesthetic.
        --}}
        <ul @class([
            'pagination shadow-sm glass-surface p-2 rounded-pill border-0',
            'd-flex align-items-center justify-content-center flex-wrap'
        ])>

            {{-- Previous Page Link --}}
            <li @class([
                'page-item custom-page-item',
                'disabled' => $paginator->onFirstPage()
            ]) aria-disabled="{{ $paginator->onFirstPage() ? 'true' : 'false' }}">
                <a class="page-link custom-page-link" 
                   href="{{ $paginator->previousPageUrl() }}" 
                   rel="prev" 
                   aria-label="{{ __('pagination.previous') }}">
                    <i class="bi bi-chevron-left"></i>
                </a>
            </li>

            {{-- Pagination Elements --}}
            @foreach ($elements as $element)
                {{-- "Three Dots" Separator --}}
                @if (is_string($element))
                    <li class="page-item disabled px-1" aria-disabled="true">
                        <span class="page-link border-0 bg-transparent custom-page-link">{{ $element }}</span>
                    </li>
                @endif

                {{-- Array Of Links --}}
                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        <li @class([
                            'page-item custom-page-item mx-1',
                            'active' => $page == $paginator->currentPage()
                        ]) @if($page == $paginator->currentPage()) aria-current="page" @endif>
                            
                            <a @class([
                                'page-link custom-page-link',
                                'active-link text-white' => $page == $paginator->currentPage()
                            ]) href="{{ $url }}">
                                {{ $page }}
                            </a>
                        </li>
                    @endforeach
                @endif
            @endforeach

            {{-- Next Page Link --}}
            <li @class([
                'page-item custom-page-item',
                'disabled' => $paginator->onLastPage()
            ]) aria-disabled="{{ $paginator->onLastPage() ? 'true' : 'false' }}">
                <a class="page-link custom-page-link" 
                   href="{{ $paginator->nextPageUrl() }}" 
                   rel="next" 
                   aria-label="{{ __('pagination.next') }}">
                    <i class="bi bi-chevron-right"></i>
                </a>
            </li>

        </ul>
    </nav>
</div>
@endif