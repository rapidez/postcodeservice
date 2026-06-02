import { useDebounceFn, useMemoize } from "@vueuse/core";
import { on } from 'Vendor/rapidez/core/resources/js/polyfills/emit.js'

const getAddressFromPostcodeservice = useMemoize(
    async function (postcode, housenumber) {
        return window.rapidezAPI(
            'post',
            'postcodeservice',
            {
                postcode: postcode,
                housenumber: housenumber,
            }
        )
    }
)

async function updateAddressFromPostcodeservice(address, event) {
    if ((address?.country_id || address?.country_code) != 'NL') {
        return
    }

    if(!address.postcode || !(address?.housenumber || address.street[1])) {
        return
    }

    let response = await getAddressFromPostcodeservice(address.postcode, address?.housenumber || address.street[1])

    if (!response?.city || !response?.street) {
        if (response?.error == "Postcode not found") {
            address.city = ''
            address.street[0] = ''
        }
        return
    }

    address.city = response.city
    address.street[0] = response.street
    event?.target?.parentElement?.dispatchEvent?.(new Event('change', {bubbles: true}));
}

on('postcode-change', useDebounceFn(updateAddressFromPostcodeservice, 100), { autoremove: false })
