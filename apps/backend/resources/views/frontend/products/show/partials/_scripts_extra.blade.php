@section('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const mainImage = document.getElementById('mainImage');
        const thumbnails = document.querySelectorAll('.thumbnail-img');

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // 1. Get the new image source
                const newSrc = this.getAttribute('data-full-src');
                
                // 2. Change the main image source
                mainImage.src = newSrc;
                
                // 3. Update active state on thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });
</script>
@endsection
