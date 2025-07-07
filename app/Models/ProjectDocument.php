<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectDocument extends Model
{
    use HasFactory, SoftDeletes;
    protected static function boot()
    {
        parent::boot();
        // cascade delete
        static::deleting(function (ProjectDocument $document) {
            // delete project tasks relationship
            if ($document->projectDocumentPaymentPeriod->isNotEmpty()) {
                foreach ($document->projectDocumentPaymentPeriod as $period) {
                    $period->delete();
                }
            }
        });
    }
    protected $fillable = [
        'contract_link',
        'project_id'
    ];
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
    public function projectDocumentPaymentPeriod()
    {
        return $this->hasMany(ProjectDocumentPaymentPeriod::class, 'project_documents_id');
    }
}
