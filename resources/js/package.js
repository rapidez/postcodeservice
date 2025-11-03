import { useDebounceFn, useMemoize } from "@vueuse/core";

document.addEventListener('vue:loaded', function () {
    window.$on('postcode-change', useDebounceFn(updateAddressFromPostcodeservice, 100));
})

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

async function updateAddressFromPostcodeservice(address) {
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
}
