<?php

namespace App\Filament\Resources\TourDevicesResource\Pages;

use App\Filament\Resources\TourDevicesResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListTourDevices extends ListRecords
{
    protected static string $resource = TourDevicesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
