<?php

namespace App\Filament\Resources\PayementMethoResource\Pages;

use App\Filament\Resources\PayementMethoResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPayementMetho extends EditRecord
{
    protected static string $resource = PayementMethoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
