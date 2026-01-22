<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AreaResource\Pages;
use App\Filament\Resources\AreaResource\RelationManagers;
use App\Models\Area;
use App\Models\Country;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\Select;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Models\City;

class AreaResource extends Resource
{
    protected static ?string $model = Area::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
             Forms\Components\TextInput::make('name') ->required()
            ->maxLength(255) ,
                Select::make('country_id')
            ->label('الدولة')
            ->options(Country::all()->pluck('name', 'id'))
            ->reactive()
            ->afterStateUpdated(fn ($state, callable $set) => $set('city_id', null)),

                
           Select::make('city_id')
    ->label('City')
    ->searchable()->suffixIcon('heroicon-m-home-modern')
    
            ->options(function (callable $get) {
                $countryId = $get('country_id');
                if (!$countryId) return [];

                return City::where('country_id', $countryId)
                    ->pluck('name', 'id');
            })
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name'),
                 Tables\Columns\TextColumn::make('city.name'),
                  Tables\Columns\TextColumn::make('city.country.name'),


            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAreas::route('/'),
            'create' => Pages\CreateArea::route('/create'),
            'edit' => Pages\EditArea::route('/{record}/edit'),
        ];
    }
       public static function getNavigationLabel(): string
{
    return __('resources.areas'); 
}
public static function getNavigationSort(): ?int
{
    return 3; 
}
}
