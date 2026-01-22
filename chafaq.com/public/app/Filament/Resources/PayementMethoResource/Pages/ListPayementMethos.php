<?php

namespace App\Filament\Resources\PayementMethoResource\Pages;

use App\Filament\Resources\PayementMethoResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPayementMethos extends ListRecords
{
    protected static string $resource = PayementMethoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
