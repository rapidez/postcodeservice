<?php

namespace Rapidez\Postcodeservice;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\ServiceProvider;

class RapidezPostcodeserviceServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this
            ->registerConfig();
    }

    public function boot()
    {
        $this
            ->bootRoutes()
            ->bootPublishables()
            ->bootMacros();
    }

    public function registerConfig() : self
    {
        $this->mergeConfigFrom(__DIR__.'/../config/rapidez-postcodeservice.php', 'rapidez-postcodeservice');

        return $this;
    }

    public function bootRoutes() : self
    {
        $this->loadRoutesFrom(__DIR__.'/../routes/api.php');

        return $this;
    }

    public function bootPublishables() : self
    {
        $this->publishes([
            __DIR__.'/../config/rapidez-postcodeservice.php' => config_path('rapidez-postcodeservice.php'),
        ], 'config');

        return $this;
    }

    public function bootMacros() : self
    {
        Http::macro('postcodeservice', function () {
            return Http::withHeaders([
                'X-ClientId' => config('rapidez-postcodeservice.client_id'),
                'X-SecureCode' => config('rapidez-postcodeservice.secure_code'),
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->baseUrl('https://api.postcodeservice.com');
        });

        return $this;
    }
}
