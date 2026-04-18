@if ($paginator->hasPages())
<div class="d-flex justify-content-center mt-5 mb-4 px-2" role="navigation">
    <nav aria-label="{{ __('Page navigation') }}">
        <ul class="pagination shadow-sm glass-surface p-2 rounded-pill border-0 d-flex align-items-center justify-content-center flex-wrap">

            {{-- Previous Page Link --}}
            <li class="page-item custom-page-item @unless($paginator->onFirstPage()) enabled @else disabled @endunless">
                <a class="page-link custom-page-link border-0 rounded-circle d-flex align-items-center justify-content-center" 
                   href="{{ $paginator->previousPageUrl() }}" 
                   rel="prev" 
                   aria-label="{{ __('pagination.previous') }}"
                   style="width: 40px; height: 40px;">
                    <i class="bi bi-chevron-left"></i>
                </a>
            </li>

            {{-- Pagination Elements --}}
            @foreach ($elements as $element)
                {{-- "Three Dots" Separator --}}
                @if (is_string($element))
                    <li class="page-item disabled px-1" aria-disabled="true">
                        <span class="page-link border-0 bg-transparent custom-page-link d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">{{ $element }}</span>
                    </li>
                @endif

                {{-- Array Of Links --}}
                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        <li class="page-item custom-page-item mx-1 @if($page == $paginator->currentPage()) active @endif">
                            <a class="page-link custom-page-link border-0 rounded-circle d-flex align-items-center justify-content-center @if($page == $paginator->currentPage()) active-link text-white shadow-sm @endif" 
                               href="{{ $url }}"
                               style="width: 40px; height: 40px; transition: all 0.2s ease;">
                                {{ $page }}
                            </a>
                        </li>
                    @endforeach
                @endif
            @endforeach

            {{-- Next Page Link --}}
            <li class="page-item custom-page-item @if($paginator->hasMorePages()) enabled @else disabled @endendif">
                <a class="page-link custom-page-link border-0 rounded-circle d-flex align-items-center justify-content-center" 
                   href="{{ $paginator->nextPageUrl() }}" 
                   rel="next" 
                   aria-label="{{ __('pagination.next') }}"
                   style="width: 40px; height: 40px;">
                    <i class="bi bi-chevron-right"></i>
                </a>
            </li>

        </ul>
    </nav>
</div>
@endif

<style>
    .custom-page-link {
        color: var(--primary-color) !important;
        background: transparent !important;
    }
    .custom-page-link:hover {
        background: var(--primary-light) !important;
        transform: translateY(-2px);
    }
    .active-link {
        background: var(--primary-color) !important;
        color: #fff !important;
    }
    .page-item.disabled .custom-page-link {
        opacity: 0.5;
        pointer-events: none;
    }
</style>
