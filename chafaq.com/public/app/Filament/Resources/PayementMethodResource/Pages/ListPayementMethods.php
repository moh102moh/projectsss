<?php

namespace App\Filament\Resources\PayementMethodResource\Pages;

use App\Filament\Resources\PayementMethodResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPayementMethods extends ListRecords
{
    protected static string $resource = PayementMethodResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
