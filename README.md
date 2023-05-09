# Rapidez Postcodeservice

Integration with [postcodeservice.com](https://postcodeservice.com/). This package listens to `postcode` and `street[1]` changes (which should be used as house number), when there is a change an API call will be made and the results will be added to `city` and `street[0]`. The responses will be cached to reduce API calls.

## Installation

```
composer require rapidez/postcodeservice
```

## Configuration

Add your credentials in de `.env`
```
POSTCODESERVICE_CLIENT_ID=
POSTCODESERVICE_SECURE_CODE=
```

## Note

Currently only Dutch address completion is implemented!

## License

GNU General Public License v3. Please see [License File](LICENSE) for more information.
