import { set, useDebounceFn, useMemoize } from "@vueuse/core";

document.addEventListener('turbo:load', function () {
    window.app.$on('postcode-change', useDebounceFn(updateAddressFromPostcodeservice, 100));

    ['shipping_address', 'billing_address'].forEach((type) => {
        window.app.$watch('checkout.'+type+'.postcode', function () {
            window.app.$emit('postcode-change', window.app.checkout[type])
        })

        window.app.$watch('checkout.'+type+'.street.1', function () {
            window.app.$emit('postcode-change', window.app.checkout[type])
        })

        window.app.$watch('checkout.'+type+'.country_id', function () {
            window.app.$emit('postcode-change', window.app.checkout[type])
        })
    })
})

const getAddressFromPostcodeservice = useMemoize(
    async function (postcode, housenumber) {
        return window.axios.post(window.url('/api/postcodeservice'), {
            postcode: postcode,
            housenumber: housenumber,
        }, {
            headers: {
                accept: 'application/json',
            }
        })
    }
)

async function updateAddressFromPostcodeservice(address) {
    if ((address?.country_id || address?.country_code) != 'NL') {
        return
    }

    if(!address.postcode || !(address?.housenumber || address.street[1])) {
        return
    }

    let response = await getAddressFromPostcodeservice(address.postcode, address?.housenumber || address.street[1])

    if (!response.data?.city || !response.data?.street) {
        if (response.data?.error == "Postcode not found") {
            set(address, 'city', '')
            set(address.street, 0, '')
        }
        return
    }

    set(address, 'city', response.data.city)
    set(address.street, 0, response.data.street)
}
