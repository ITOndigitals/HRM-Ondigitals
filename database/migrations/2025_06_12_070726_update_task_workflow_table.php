<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

use function Laravel\Prompts\table;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
        DB::table('task_workflows')
            ->where('current_step_id', 1)
            ->where('department', 1)
            ->update(['department' => 3]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        DB::table('task_workflows')
            ->where('current_step_id', 1)
            ->where('department', 3)
            ->update(['department' => 1]);
    }
};
