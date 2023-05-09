document.addEventListener('turbo:load', function () {
    window.app.$watch('checkout.shipping_address.postcode', function () {
        getAddressFromPostcodeservice()
    })

    window.app.$watch('checkout.shipping_address.street.1', function () {
        getAddressFromPostcodeservice()
    })
})

async function getAddressFromPostcodeservice() {
    if (window.app.checkout.shipping_address.country_id != 'NL') {
        return
    }

    let response = await window.axios.post('/api/postcodeservice', {
        postcode: window.app.checkout.shipping_address.postcode,
        housenumber: window.app.checkout.shipping_address.street[1],
    }, {
        headers: {
            accept: 'application/json',
        }
    })

    if (!response.data?.city || !response.data?.street) {
        return
    }

    window.app.checkout.shipping_address.city = response.data.city
    window.app.checkout.shipping_address.street[0] = response.data.street
}
