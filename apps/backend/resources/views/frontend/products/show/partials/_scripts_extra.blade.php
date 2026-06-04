@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const mainImage = document.getElementById('mainImage');
        const thumbnails = document.querySelectorAll('.thumbnail-img');

        if (!mainImage || !thumbnails.length) {
            return;
        }

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const newSrc = this.getAttribute('data-full-src');
                mainImage.src = newSrc;

                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });

    (() => {
        const registerProductPriceCalculator = () => {
            Alpine.data('productPriceCalculator', (config) => ({
                quantity: 1,
                selectedAttributes: {},
                selectedAddons: [],
                currentPrice: Number(config.basePrice) || 0,
                totalPrice: Number(config.basePrice) || 0,
                priceUrl: config.priceUrl,
                isUpdatingPrice: false,

                init() {
                    this.selectedAddons = Array.from(this.$root.querySelectorAll('input[name="addon_ids[]"]:checked'))
                        .map((input) => input.value);

                    this.$watch('quantity', () => this.updatePrice());
                    this.updatePrice();
                },

                updatePrice() {
                    if (!this.priceUrl) {
                        this.totalPrice = this.currentPrice * this.quantity;
                        return;
                    }

                    const params = new URLSearchParams();
                    Object.values(this.selectedAttributes)
                        .filter(Boolean)
                        .forEach((id) => params.append('attribute_ids[]', id));

                    this.selectedAddons
                        .filter(Boolean)
                        .forEach((id) => params.append('addon_ids[]', id));

                    params.set('quantity', this.quantity || 1);
                    this.isUpdatingPrice = true;

                    fetch(this.priceUrl + '?' + params.toString(), {
                        headers: {
                            'Accept': 'application/json',
                        },
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Price update failed');
                            }

                            return response.json();
                        })
                        .then((data) => {
                            this.currentPrice = Number(data.unit_price ?? this.currentPrice);
                            this.totalPrice = Number(data.total_price ?? (this.currentPrice * this.quantity));
                        })
                        .catch(() => {
                            this.totalPrice = this.currentPrice * (this.quantity || 1);
                        })
                        .finally(() => {
                            this.isUpdatingPrice = false;
                        });
                },

                formatCurrency(value) {
                    return '$' + Number(value || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                },
            }));
        };

        if (window.Alpine) {
            registerProductPriceCalculator();
        } else {
            document.addEventListener('alpine:init', registerProductPriceCalculator, { once: true });
        }
    })();
</script>
@endpush
