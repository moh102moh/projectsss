<?php

namespace App\Filament\Resources\DeviceBrandNameResource\Pages;

use App\Filament\Resources\DeviceBrandNameResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListDeviceBrandNames extends ListRecords
{
    protected static string $resource = DeviceBrandNameResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
