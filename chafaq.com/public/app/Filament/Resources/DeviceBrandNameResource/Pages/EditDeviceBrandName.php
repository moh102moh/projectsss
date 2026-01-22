<?php

namespace App\Filament\Resources\DeviceBrandNameResource\Pages;

use App\Filament\Resources\DeviceBrandNameResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditDeviceBrandName extends EditRecord
{
    protected static string $resource = DeviceBrandNameResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
