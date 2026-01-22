<?php

namespace App\Filament\Resources\MikrotikProfileResource\Pages;

use App\Filament\Resources\MikrotikProfileResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMikrotikProfiles extends ListRecords
{
    protected static string $resource = MikrotikProfileResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
