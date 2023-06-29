document.addEventListener('turbo:load', function () {
    ['shipping_address', 'billing_address'].forEach((type) => {
        window.app.$watch('checkout.'+type+'.postcode', function () {
            getAddressFromPostcodeservice(type)
        })

        window.app.$watch('checkout.'+type+'.street.1', function () {
            getAddressFromPostcodeservice(type)
        })
    })
})

async function getAddressFromPostcodeservice(type) {
    if (window.app.checkout[type].country_id != 'NL') {
        return
    }

    let response = await window.axios.post(window.url('/api/postcodeservice'), {
        postcode: window.app.checkout[type].postcode,
        housenumber: window.app.checkout[type].street[1],
    }, {
        headers: {
            accept: 'application/json',
        }
    })

    if (!response.data?.city || !response.data?.street) {
        return
    }

    window.app.checkout[type].city = response.data.city
    window.app.checkout[type].street[0] = response.data.street
}
