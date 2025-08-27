<?php

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
        DB::table('status_details')->insert(
            [
                ['name' => 'Đã Gửi Khách'],
                ['name' => 'Khách Đã Duyệt'],
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('table_status_detail', function (Blueprint $table) {
            //
        });
    }
};
