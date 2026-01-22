<?php

namespace App\Filament\Resources\PackagBundleResource\Pages;

use App\Filament\Resources\PackagBundleResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPackagBundle extends EditRecord
{
    protected static string $resource = PackagBundleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
