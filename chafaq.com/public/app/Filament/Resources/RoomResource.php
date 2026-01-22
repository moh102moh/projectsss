<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RoomResource\Pages;
use App\Filament\Resources\RoomResource\RelationManagers;
use App\Models\Room;
use App\Models\Hotel;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
 use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
class RoomResource extends Resource
{
    protected static ?string $model = Room::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                 Select::make('hotel_id')
    ->label('الفندق')
   // ->relationship('routers', 'name')
    ->required() ->options(function () {
       
        return Hotel::all()->pluck('name', 'id');

     

        return [];
    }),
            Forms\Components\TextInput::make('identifier') ->required()
            ->maxLength(255),
          
             Select::make('type')
                ->options([
                    'single' => 'single',
                    'double' => 'double',
                    'suite' => 'suite',
                ])
                ->reactive()
                ,     Forms\Components\TextInput::make('price')
            ->label('السعر')
            ->required()->numeric(),
               Forms\Components\TextInput::make('capacity')
            ->label('السعة')
            ->required()->numeric(),
          
                Toggle::make('status')
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                //
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
            'index' => Pages\ListRooms::route('/'),
            'create' => Pages\CreateRoom::route('/create'),
            'edit' => Pages\EditRoom::route('/{record}/edit'),
        ];
    }
}
