<?php

namespace App\Filament\Resources\MikrotikUserGroupResource\Pages;

use App\Filament\Resources\MikrotikUserGroupResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMikrotikUserGroups extends ListRecords
{
    protected static string $resource = MikrotikUserGroupResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
