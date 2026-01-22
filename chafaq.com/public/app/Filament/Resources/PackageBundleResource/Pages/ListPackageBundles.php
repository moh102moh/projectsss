<?php

namespace App\Filament\Resources\PackageBundleResource\Pages;

use App\Filament\Resources\PackageBundleResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPackageBundles extends ListRecords
{
    protected static string $resource = PackageBundleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
