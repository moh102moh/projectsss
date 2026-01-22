<?php

namespace App\Filament\Resources\StreetsResource\Pages;

use App\Filament\Resources\StreetsResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditStreets extends EditRecord
{
    protected static string $resource = StreetsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
