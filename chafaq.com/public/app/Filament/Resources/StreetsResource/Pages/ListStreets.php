<?php

namespace App\Filament\Resources\StreetsResource\Pages;

use App\Filament\Resources\StreetsResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListStreets extends ListRecords
{
    protected static string $resource = StreetsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
