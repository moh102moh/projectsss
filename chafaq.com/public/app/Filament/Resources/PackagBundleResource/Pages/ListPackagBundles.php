<?php

namespace App\Filament\Resources\PackagBundleResource\Pages;

use App\Filament\Resources\PackagBundleResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPackagBundles extends ListRecords
{
    protected static string $resource = PackagBundleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
