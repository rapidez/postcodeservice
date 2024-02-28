# Rapidez Postcodeservice

Integration with [postcodeservice.com](https://postcodeservice.com/). This package listens to `postcode` and `street[1]` changes (which should be used as house number), when there is a change an API call will be made and the results will be added to `city` and `street[0]`. The responses will be cached to reduce API calls.

## Installation

```
composer require rapidez/postcodeservice
```

## Configuration

Add your credentials in the `.env`
```
POSTCODESERVICE_CLIENT_ID=
POSTCODESERVICE_SECURE_CODE=
```

## Customisation

In case you have your own postcode fields you want checked and updated you can emit the `postcode-change` event passing a reactive object with the following keys:

- `country_id/country_code`
- `postcode`
- `street[0]`
- `street[1]`
- `city`

Then you can use it like:

```html
<input 
    v-on:change="window.app.$emit('postcode-change', addressVariables)" 
    name="postcode" 
    label="Postcode" 
    v-model="addressVariables.postcode" 
    required
/>
<input 
    v-on:change="window.app.$emit('postcode-change', addressVariables)" 
    name="street[1]" 
    type="number" 
    label="Housenumber" 
    v-model="addressVariables.street[1]" 
    placeholder=""
/>
```

## Note

Currently only Dutch address completion is implemented!

## License

GNU General Public License v3. Please see [License File](LICENSE) for more information.
