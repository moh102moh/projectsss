<?php

namespace App\Filament\Resources\TourDevicesResource\Pages;

use App\Filament\Resources\TourDevicesResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditTourDevices extends EditRecord
{
    protected static string $resource = TourDevicesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
