<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
        Schema::create('project_document_payment_periods', function (Blueprint $table) {
            $table->id();
            $table->date('month');
            $table->foreignId('project_documents_id')->constrained('project_documents')->onDelete('cascade');
            $table->text('invoice_link')->nullable();
            $table->text('red_invoice_link')->nullable();
            $table->text('acceptance_link')->nullable();
            $table->text('report_link')->nullable();
            $table->boolean("has_sent")->default(false);
            $table->boolean("has_paid")->default(false);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
