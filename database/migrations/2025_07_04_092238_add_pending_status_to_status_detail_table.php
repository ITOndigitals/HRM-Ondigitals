<?php

use Doctrine\DBAL\Schema\Table;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
        DB::table("status_details")->insert(
            [
                'name' => 'Đang Chờ'
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
