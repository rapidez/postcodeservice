<?php

use Illuminate\Http\Request;

Route::middleware('api')->match(['get', 'post'], '/api/postcodeservice', function (Request $request) {
    $request->merge([
        'postcode' => strtoupper(str_replace(' ', '', $request->postcode)),
    ])->validate([
        'postcode' => 'required|string|max:6',
        'housenumber' => 'required',
    ]);

    $cacheKey = 'postcodeservice-'.$request->postcode.'-'.$request->housenumber;

    return Cache::rememberForever($cacheKey, function () use ($request) {
        return Http::postcodeservice()->get('/nl/v5/getAddress', [
            'zipcode'=> $request->postcode,
            'houseno'=> $request->housenumber,
        ])->throw()->json();
    });
});
