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
        DB::table('task_categories')->where('id', 3)
            ->where('name', 'Content Calender')
            ->update(['name' => 'Content Calendar']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('departments')
            ->where('id', 3)
            ->where('name', 'Content Calendar')
            ->update(['name' => 'Content Calender']);
    }
};
