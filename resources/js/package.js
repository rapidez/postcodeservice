const postcodeObserver = new MutationObserver((m) => {
    let types = ['housenumber', 'postcode', 'country']
    types.forEach((type) => {
        document.querySelectorAll(`[id\$='_${type}']`).forEach(el => {
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
})

document.addEventListener('turbo:load', function () {
    window.app.custom.postcode_data = {}

    postcodeObserver.observe(window.app.$el, {
        childList: true,
        subtree: true,
    })
})

async function getAddressFromPostcodeservice(id) {
    let get = ((type) => window.app.custom.postcode_data[`${id}_${type}`])
    let set = ((type, value) => {
        let el = document.getElementById(`${id}_${type}`)
        if (el) {
            el.value = value
            el.dispatchEvent(new Event('change'))
        }
    })

    if (get('country') != 'NL' || !get('postcode')) {
        return
    }

    let response = await window.axios.post('/api/postcodeservice', {
        postcode: get('postcode'),
        housenumber: get('housenumber'),
    }, {
        headers: {
            accept: 'application/json',
        }
    })

    if (!response.data?.city || !response.data?.street) {
        if (response.data?.error == 'Postcode not found') {
            set('city', '')
            set('street', '')
        }
        return
    }

    set('city', response.data.city)
    set('street', response.data.street)
}
