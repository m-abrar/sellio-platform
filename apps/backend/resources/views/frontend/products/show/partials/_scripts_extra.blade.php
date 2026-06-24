@push('scripts')
<script>
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

                requiredAddonIds() {
                    return Array.from(this.$root.querySelectorAll('[data-required-addon]'))
                        .map((input) => input.value)
                        .filter(Boolean);
                },

                mergeSelectedAddons(optionalAddonIds = []) {
                    return [...new Set([...this.requiredAddonIds(), ...optionalAddonIds])];
                },

                init() {
                    const optionalAddonIds = Array.from(this.$root.querySelectorAll('input[type="checkbox"][name="addon_ids[]"]:checked'))
                        .map((input) => input.value);

                    this.selectedAddons = this.mergeSelectedAddons(optionalAddonIds);

                    this.$watch('selectedAddons', (value) => {
                        const merged = this.mergeSelectedAddons(value);
                        const current = [...value].sort().join(',');
                        const next = [...merged].sort().join(',');

                        if (current !== next) {
                            this.selectedAddons = merged;
                        }
                    });

                    this.$watch('quantity', () => this.updatePrice());
                    this.updatePrice();
                },

                updatePrice() {
                    const addonIds = this.mergeSelectedAddons(this.selectedAddons);

                    if (!this.priceUrl) {
                        this.totalPrice = this.currentPrice * this.quantity;
                        return;
                    }

                    const params = new URLSearchParams();
                    Object.values(this.selectedAttributes)
                        .filter(Boolean)
                        .forEach((id) => params.append('attribute_ids[]', id));

                    addonIds
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
                    return '{{ setting('currency_symbol', '$') }}' + Number(value || 0).toLocaleString(undefined, {
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
