<?php

namespace App\Filament\Resources\MikrotikProfileResource\Pages;

use App\Filament\Resources\MikrotikProfileResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMikrotikProfile extends EditRecord
{
    protected static string $resource = MikrotikProfileResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
