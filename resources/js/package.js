import { useThrottleFn } from "@vueuse/core"

const postcodeObserver = new MutationObserver(useThrottleFn(() => {
    let types = ['housenumber', 'postcode', 'country']
    types.forEach((type) => {
        document.querySelectorAll(`[id\$='_${type}']:not([no-postcode])`).forEach(el => {
            if (el.id in window.app.custom.postcode_data) {
                return
            }

            window.app.custom.postcode_data[el.id] = el.value
            let id = el.id.replace(`_${type}`, '')
            el.addEventListener('change', () => {
                window.app.custom.postcode_data[el.id] = el.value
                getAddressFromPostcodeservice(id)
            })
        })
    })
}, 500, true, true))

document.addEventListener('turbo:load', function () {
    window.app.custom.postcode_data = {}

    postcodeObserver.observe(window.app.$el, {
        childList: true,
        subtree: true,
    })
})

async function getAddressFromPostcodeservice(id) {
    let getDataFrom = (type) => window.app.custom.postcode_data[`${id}_${type}`]
    let getElement = (type) => document.getElementById(`${id}_${type}`)
    let setDataTo = (type, value) => {
        let el = getElement(type)
        if (el && el.value != value) {
            el.value = value
            el.dispatchEvent(new Event('change'))
        }
    }

    if (getDataFrom('country') != 'NL'
        || !getDataFrom('postcode')
        || !getElement('housenumber')
        || !getElement('city')
        || !getElement('street')
    ) {
        return
    }

    let response = await window.axios.post('/api/postcodeservice', {
        postcode: getDataFrom('postcode'),
        housenumber: getDataFrom('housenumber'),
    }, {
        headers: {
            accept: 'application/json',
        }
    })

    if (!response.data?.city || !response.data?.street) {
        if (response.data?.error == 'Postcode not found') {
            setDataTo('city', '')
            setDataTo('street', '')
        }
        return
    }

    setDataTo('city', response.data.city)
    setDataTo('street', response.data.street)
}
