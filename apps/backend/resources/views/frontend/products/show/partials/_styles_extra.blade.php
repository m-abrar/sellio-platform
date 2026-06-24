@section('head_extra')
<style>
    .product-gallery__main {
        max-height: 420px;
        object-fit: contain;
        background: #f8f9fa;
        cursor: zoom-in;
    }
    .thumbnail-img {
        width: 70px;
        height: 70px;
        object-fit: cover;
        border-radius: 6px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border-color 0.2s, opacity 0.2s;
        opacity: 0.65;
    }
    .thumbnail-img:hover { opacity: 1; border-color: rgba(0,0,0,.15); }
    .thumbnail-img.active { border-color: var(--primary-color); opacity: 1; }
    .product-gallery__thumb { flex-shrink: 0; width: 70px; height: 70px; }
</style>
@endsection
