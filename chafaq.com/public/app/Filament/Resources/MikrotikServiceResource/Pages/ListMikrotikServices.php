<?php

namespace App\Filament\Resources\MikrotikServiceResource\Pages;

use App\Filament\Resources\MikrotikServiceResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMikrotikServices extends ListRecords
{
    protected static string $resource = MikrotikServiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
