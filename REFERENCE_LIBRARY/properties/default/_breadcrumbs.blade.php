{{-- Breadcrumbs for Navigation --}}
<nav aria-label="breadcrumb" class="d-block mb-3 small">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="{{ route('home') }}" class="text-muted text-decoration-none">Home</a></li>
        <li class="breadcrumb-item">
            <a href="{{ route('categories.show', $property->category->slug) }}" class="text-muted text-decoration-none">
                {{ $property->category->title ?? 'Property Search' }}
            </a>
        </li>
        <li class="breadcrumb-item active fw-bold" aria-current="page">
            {{ Str::limit($property->title, 40) }}
        </li>
    </ol>
</nav>