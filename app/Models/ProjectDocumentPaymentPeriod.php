<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectDocumentPaymentPeriod extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'month',
        'project_documents_id',
        'invoice_link',
        'red_invoice_link',
        'acceptance_link',
        'report_link',
        'has_sent',
        'has_paid'
    ];
    public function projectDocument()
    {
        $this->belongsTo(ProjectDocument::class, 'project_documents_id');
    }
}
